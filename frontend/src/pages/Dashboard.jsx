// frontend/src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaChartLine, FaBook } from 'react-icons/fa';
import { format } from 'date-fns';
import { ref, onValue, set } from "firebase/database";
import { database } from '../firebase/config';

// Components
import ProgressCircle from '../components/dashboard/ProgressCircle';
import StatsCard from '../components/dashboard/StatsCard';
import TodaysTasks from '../components/dashboard/TodaysTasks';
import StreakCard from '../components/dashboard/StreakCard';
import BadgesCard from '../components/dashboard/BadgesCard';

// Styled Components
const DashboardContainer = styled(motion.div)`
  padding: 2rem 1rem 6rem;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (min-width: 768px) {
    padding: 6rem 2rem 2rem;
  }
`;

const WelcomeSection = styled.div`
  margin-bottom: 2rem;
`;

const Greeting = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  
  @media (min-width: 768px) {
    font-size: 2.2rem;
  }
`;

const DateDisplay = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.text}aa;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const Card = styled(motion.div)`
  background: ${({ theme }) => theme.cardBackground};
  border-radius: 24px;
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadow};
  height: 100%;
`;

const CardTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CardIcon = styled.span`
  color: ${({ theme }) => theme.primary};
`;

const QuickLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
`;

const QuickLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: ${({ theme }) => theme.background};
  border-radius: 12px;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ theme }) => theme.primary}22;
    transform: translateY(-2px);
  }
`;

const Dashboard = ({ user }) => {
  const [userData, setUserData] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentDateString, setCurrentDateString] = useState('');

  useEffect(() => {
    // Format the current date safely
    try {
      const now = new Date();
      setCurrentDateString(format(now, 'EEEE, MMMM do, yyyy'));
    } catch (error) {
      console.error("Error formatting date:", error);
      setCurrentDateString('Today');
    }
  }, []);

  useEffect(() => {
    if (user) {
      // Reference to user data in the database
      const userRef = ref(database, 'users/' + user.uid);
      
      // Listen for changes to user data
      const unsubscribeUser = onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        
        if (data) {
          setUserData(data);
        } else {
          // If no user data exists, create default data
          const defaultUserData = {
            name: user.displayName || 'Developer',
            email: user.email,
            createdAt: new Date().toISOString(),
            startDate: new Date().toISOString(),
            currentDay: 1,
            streak: 0,
            lastCompletedDay: null,
            totalTasksCompleted: 0,
            badges: []
          };
          
          // Save default user data
          set(userRef, defaultUserData);
          setUserData(defaultUserData);
        }
      });
      
      // Reference to progress data in the database
      const progressRef = ref(database, 'progress/' + user.uid);
      
      // Listen for changes to progress data
      const unsubscribeProgress = onValue(progressRef, (snapshot) => {
        const data = snapshot.val();
        
        if (data) {
          setProgressData(data);
        } else {
          // If no progress data exists, create default data
          const defaultProgressData = {
            days: {
              "1": {
                completed: false,
                dsaCompleted: false,
                devCompleted: false,
                date: new Date().toISOString()
              }
            }
          };
          
          // Save default progress data
          set(progressRef, defaultProgressData);
          setProgressData(defaultProgressData);
        }
        
        setLoading(false);
      });
      
      // Clean up listeners
      return () => {
        unsubscribeUser();
        unsubscribeProgress();
      };
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <WelcomeSection>
        <Greeting>Hello, {userData?.name}! 👋</Greeting>
        <DateDisplay>{currentDateString}</DateDisplay>
      </WelcomeSection>
      
      <GridContainer>
        <Card
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <CardTitle>
            <CardIcon><FaCalendarAlt /></CardIcon>
            Day {userData?.currentDay} of 730
          </CardTitle>
          <ProgressCircle 
            percentage={Math.round((userData?.currentDay / 730) * 100)} 
            size={120} 
          />
          <QuickLinks>
            <QuickLink to="/calendar">
              <FaCalendarAlt /> View Calendar
            </QuickLink>
          </QuickLinks>
        </Card>
        
        <Card
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <CardTitle>
            <CardIcon>📋</CardIcon>
            Today's Tasks
          </CardTitle>
          <TodaysTasks 
            user={user} 
            currentDay={userData?.currentDay} 
            progressData={progressData} 
          />
        </Card>
        
        <Card
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <CardTitle>
            <CardIcon>🔥</CardIcon>
            Current Streak
          </CardTitle>
          <StreakCard streak={userData?.streak || 0} />
        </Card>
        
        <Card
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <CardTitle>
            <CardIcon><FaChartLine /></CardIcon>
            Your Progress
          </CardTitle>
          <StatsCard 
            totalTasks={userData?.totalTasksCompleted || 0}
            currentDay={userData?.currentDay}
          />
          <QuickLinks>
            <QuickLink to="/analytics">
              <FaChartLine /> View Analytics
            </QuickLink>
          </QuickLinks>
        </Card>
        
        <Card
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <CardTitle>
            <CardIcon>🏆</CardIcon>
            Badges & Achievements
          </CardTitle>
          <BadgesCard badges={userData?.badges || []} />
        </Card>
        
        <Card
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <CardTitle>
            <CardIcon><FaBook /></CardIcon>
            Learning Resources
          </CardTitle>
          <p>Access curated learning materials for your journey.</p>
          <QuickLinks>
            <QuickLink to="/resources">
              <FaBook /> Browse Resources
            </QuickLink>
          </QuickLinks>
        </Card>
      </GridContainer>
    </DashboardContainer>
  );
};

export default Dashboard;