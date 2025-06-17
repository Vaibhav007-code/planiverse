// backend/server.js
const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

// Initialize Firebase Admin
admin.initializeApp();

const db = admin.database();

// Initialize Express
const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// User routes
app.get('/api/users/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const userSnapshot = await db.ref(`users/${userId}`).once('value');
    
    if (!userSnapshot.exists()) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(200).json(userSnapshot.val());
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Progress routes
app.get('/api/progress/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const progressSnapshot = await db.ref(`progress/${userId}`).once('value');
    
    if (!progressSnapshot.exists()) {
      return res.status(404).json({ error: 'Progress not found' });
    }
    
    res.status(200).json(progressSnapshot.val());
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/progress/:userId/day/:dayNumber', async (req, res) => {
  try {
    const { userId, dayNumber } = req.params;
    const { dsaCompleted, devCompleted, dsaChecklist, devChecklist } = req.body;
    
    const progressRef = db.ref(`progress/${userId}`);
    const progressSnapshot = await progressRef.once('value');
    
    if (!progressSnapshot.exists()) {
      return res.status(404).json({ error: 'Progress not found' });
    }
    
    const progressData = progressSnapshot.val();
    const days = { ...progressData.days };
    
    // Update day data
    days[dayNumber] = {
      ...days[dayNumber],
      date: new Date().toISOString()
    };
    
    if (dsaCompleted !== undefined) {
      days[dayNumber].dsaCompleted = dsaCompleted;
    }
    
    if (devCompleted !== undefined) {
      days[dayNumber].devCompleted = devCompleted;
    }
    
    if (dsaChecklist) {
      days[dayNumber].dsaChecklist = dsaChecklist;
    }
    
    if (devChecklist) {
      days[dayNumber].devChecklist = devChecklist;
    }
    
    // Check if both DSA and Dev are completed
    if (days[dayNumber].dsaCompleted && days[dayNumber].devCompleted) {
      days[dayNumber].completed = true;
      
      // Update user data if this is the current day
      const userRef = db.ref(`users/${userId}`);
      const userSnapshot = await userRef.once('value');
      
      if (userSnapshot.exists()) {
        const userData = userSnapshot.val();
        
        if (parseInt(dayNumber) === userData.currentDay) {
          await userRef.update({
            currentDay: parseInt(dayNumber) + 1,
            streak: userData.streak + 1,
            lastCompletedDay: new Date().toISOString(),
            totalTasksCompleted: userData.totalTasksCompleted + 1
          });
        }
      }
    }
    
    await progressRef.update({ days });
    
    res.status(200).json({ success: true, message: 'Progress updated successfully' });
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Badge routes
app.post('/api/users/:userId/badges', async (req, res) => {
  try {
    const userId = req.params.userId;
    const { badge } = req.body;
    
    const userRef = db.ref(`users/${userId}`);
    const userSnapshot = await userRef.once('value');
    
    if (!userSnapshot.exists()) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const userData = userSnapshot.val();
    const badges = [...(userData.badges || [])];
    
    // Check if badge already exists
    if (!badges.some(b => b.id === badge.id)) {
      badges.push({
        ...badge,
        earnedAt: new Date().toISOString()
      });
      
      await userRef.update({ badges });
    }
    
    res.status(200).json({ success: true, message: 'Badge added successfully' });
  } catch (error) {
    console.error('Error adding badge:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Export the Express app as a Firebase Function
exports.api = functions.https.onRequest(app);