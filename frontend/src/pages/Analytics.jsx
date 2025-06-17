// frontend/src/pages/Analytics.jsx
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { database } from '../firebase/config';
import { ref, onValue } from 'firebase/database';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title as ChartTitle, 
  Tooltip, 
  Legend, 
  ArcElement 
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { format } from 'date-fns';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ChartTitle,
  Tooltip,
  Legend,
  ArcElement
);

const AnalyticsContainer = styled(motion.div)`
  padding: 2rem 1rem 6rem;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (min-width: 768px) {
    padding: 6rem 2rem 2rem;
  }
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  
  @media (min-width: 768px) {
    font-size: 2.2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.text}aa;
  margin-top: 0.5rem;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
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
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const StatItem = styled.div`
  background: ${({ theme }) => theme.background};
  border-radius: 16px;
  padding: 1rem;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${({ theme }) => theme.primary};
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.text}aa;
  margin-top: 0.3rem;
`;

const ChartContainer = styled.div`
  height: 300px;
  position: relative;
`;

const Analytics = ({ user }) => {
  const [userData, setUserData] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDays: 0,
    completedDays: 0,
    completionRate: 0,
    currentStreak: 0,
    dsaCompleted: 0,
    devCompleted: 0,
    daysRemaining: 730
  });
  const [chartData, setChartData] = useState({
    weekly: {
      labels: [],
      datasets: []
    },
    distribution: {
      labels: [],
      datasets: []
    }
  });

  useEffect(() => {
    if (user) {
      // Reference to user data in the database
      const userRef = ref(database, 'users/' + user.uid);
      
      // Listen for changes to user data
      const unsubscribeUser = onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setUserData(data);
        }
      });
      
      // Reference to progress data in the database
      const progressRef = ref(database, 'progress/' + user.uid);
      
      // Listen for changes to progress data
      const unsubscribeProgress = onValue(progressRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setProgressData(data);
          calculateStats(data, userData);
          generateChartData(data);
        }
        
        setLoading(false);
      });
      
      // Clean up listeners
      return () => {
        unsubscribeUser();
        unsubscribeProgress();
      };
    }
  }, [user, userData]);

  const calculateStats = (progressData, userData) => {
    if (!progressData || !userData) return;

    const days = progressData.days || {};
    const dayNumbers = Object.keys(days).map(Number);
    
    // Calculate stats
    const totalDays = dayNumbers.length;
    const completedDays = dayNumbers.filter(day => days[day].completed).length;
    const completionRate = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;
    const currentStreak = userData.streak || 0;
    
    // Count DSA and Dev completions
    let dsaCompleted = 0;
    let devCompleted = 0;
    
    dayNumbers.forEach(day => {
      if (days[day].dsaCompleted) dsaCompleted++;
      if (days[day].devCompleted) devCompleted++;
    });
    
    // Calculate days remaining
    const daysRemaining = 730 - (userData.currentDay - 1);
    
    setStats({
      totalDays,
      completedDays,
      completionRate,
      currentStreak,
      dsaCompleted,
      devCompleted,
      daysRemaining
    });
  };

  const generateChartData = (progressData) => {
    if (!progressData) return;

    const days = progressData.days || {};
    const dayNumbers = Object.keys(days).map(Number).sort((a, b) => a - b);
    
    if (dayNumbers.length === 0) return;
    
    // Weekly progress chart
    const lastSevenDays = dayNumbers.slice(-7);
    const weeklyLabels = lastSevenDays.map(day => `Day ${day}`);
    const weeklyCompletions = lastSevenDays.map(day => days[day].completed ? 1 : 0);
    
    // Task distribution chart
    const dsaOnly = dayNumbers.filter(day => days[day].dsaCompleted && !days[day].devCompleted).length;
    const devOnly = dayNumbers.filter(day => !days[day].dsaCompleted && days[day].devCompleted).length;
    const bothCompleted = dayNumbers.filter(day => days[day].dsaCompleted && days[day].devCompleted).length;
    const noneCompleted = dayNumbers.filter(day => !days[day].dsaCompleted && !days[day].devCompleted).length;
    
    setChartData({
      weekly: {
        labels: weeklyLabels,
        datasets: [
          {
            label: 'Completed Days',
            data: weeklyCompletions,
            backgroundColor: 'rgba(108, 92, 231, 0.2)',
            borderColor: 'rgba(108, 92, 231, 1)',
            borderWidth: 2,
            tension: 0.4
          }
        ]
      },
      distribution: {
        labels: ['DSA Only', 'Dev Only', 'Both Completed', 'None Completed'],
        datasets: [
          {
            data: [dsaOnly, devOnly, bothCompleted, noneCompleted],
            backgroundColor: [
              'rgba(253, 203, 110, 0.8)',
              'rgba(9, 132, 227, 0.8)',
              'rgba(0, 184, 148, 0.8)',
              'rgba(214, 48, 49, 0.8)'
            ],
            borderColor: [
              'rgba(253, 203, 110, 1)',
              'rgba(9, 132, 227, 1)',
              'rgba(0, 184, 148, 1)',
              'rgba(214, 48, 49, 1)'
            ],
            borderWidth: 1
          }
        ]
      }
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AnalyticsContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Header>
        <PageTitle>Your Progress Analytics</PageTitle>
        <Subtitle>Track your journey and stay motivated</Subtitle>
      </Header>
      
      <StatsGrid>
        <StatItem>
          <StatValue>{stats.completedDays}</StatValue>
          <StatLabel>Days Completed</StatLabel>
        </StatItem>
        
        <StatItem>
          <StatValue>{stats.daysRemaining}</StatValue>
          <StatLabel>Days Remaining</StatLabel>
        </StatItem>
        
        <StatItem>
          <StatValue>{stats.completionRate}%</StatValue>
          <StatLabel>Completion Rate</StatLabel>
        </StatItem>
        
        <StatItem>
          <StatValue>{stats.currentStreak}</StatValue>
          <StatLabel>Current Streak</StatLabel>
        </StatItem>
      </StatsGrid>
      
      <GridContainer>
        <Card
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <CardTitle>Weekly Progress</CardTitle>
          <ChartContainer>
            {chartData.weekly.labels.length > 0 ? (
              <Line 
                data={chartData.weekly}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 1,
                      ticks: {
                        stepSize: 1
                      }
                    }
                  }
                }}
              />
            ) : (
              <p>Not enough data to display weekly progress.</p>
            )}
          </ChartContainer>
        </Card>
        
        <Card
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <CardTitle>Task Distribution</CardTitle>
          <ChartContainer>
            {chartData.distribution.labels.length > 0 ? (
              <Pie 
                data={chartData.distribution}
                options={{
                  responsive: true,
                  maintainAspectRatio: false
                }}
              />
            ) : (
              <p>Not enough data to display task distribution.</p>
            )}
          </ChartContainer>
        </Card>
        
        <Card
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <CardTitle>DSA vs Development Progress</CardTitle>
          <ChartContainer>
            <Bar 
              data={{
                labels: ['DSA Tasks', 'Development Tasks'],
                datasets: [
                  {
                    label: 'Completed',
                    data: [stats.dsaCompleted, stats.devCompleted],
                    backgroundColor: [
                      'rgba(253, 203, 110, 0.8)',
                      'rgba(9, 132, 227, 0.8)'
                    ],
                    borderColor: [
                      'rgba(253, 203, 110, 1)',
                      'rgba(9, 132, 227, 1)'
                    ],
                    borderWidth: 1
                  }
                ]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }}
            />
          </ChartContainer>
        </Card>
        
        <Card
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <CardTitle>Journey Timeline</CardTitle>
          <div>
            <p><strong>Start Date:</strong> {userData?.startDate ? format(new Date(userData.startDate), 'MMMM d, yyyy') : 'Not set'}</p>
            <p><strong>Current Day:</strong> Day {userData?.currentDay || 1} of 730</p>
            <p><strong>Estimated Completion:</strong> {userData?.startDate ? 
              format(new Date(new Date(userData.startDate).getTime() + (730 * 24 * 60 * 60 * 1000)), 'MMMM d, yyyy') 
              : 'Not available'}</p>
            <p><strong>Progress:</strong> {Math.round((userData?.currentDay / 730) * 100) || 0}% complete</p>
          </div>
        </Card>
      </GridContainer>
    </AnalyticsContainer>
  );
};

export default Analytics;