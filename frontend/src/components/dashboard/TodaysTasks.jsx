// frontend/src/components/dashboard/TodaysTasks.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaCode, FaLaptopCode, FaArrowRight } from 'react-icons/fa';
import { dsaTopics, devTopics } from '../../data/curriculumData';

const TasksContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TaskItem = styled(motion.div)`
  background: ${({ theme }) => theme.background};
  border-radius: 16px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

const TaskIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ type, theme }) => 
    type === 'dsa' ? theme.warning + '33' : theme.info + '33'};
  color: ${({ type, theme }) => 
    type === 'dsa' ? theme.warning : theme.info};
  font-size: 1rem;
  flex-shrink: 0;
`;

const TaskContent = styled.div`
  flex-grow: 1;
`;

const TaskTitle = styled.h3`
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 0.3rem;
`;

const TaskStatus = styled.div`
  font-size: 0.8rem;
  color: ${({ $completed, theme }) => 
    $completed ? theme.success : theme.text + 'aa'};
`;

const ViewButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.8rem;
  background: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 500;
  margin-top: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  
  &:hover {
    background: ${({ theme }) => theme.primary}dd;
    transform: translateY(-2px);
  }
`;

const TodaysTasks = ({ user, currentDay, progressData }) => {
  const [dayData, setDayData] = useState(null);
  
  useEffect(() => {
    if (progressData && currentDay) {
      setDayData(progressData?.days[currentDay] || {});
    }
  }, [progressData, currentDay]);
  
  // Get current day's topics
  const dsaDay = currentDay ? (currentDay - 1) % dsaTopics.length : 0;
  const dsaTopic = dsaTopics[dsaDay];
  
  const devDay = currentDay ? (currentDay - 1) % devTopics.length : 0;
  const devTopic = devTopics[devDay];
  
  const isDsaCompleted = dayData?.dsaCompleted || false;
  const isDevCompleted = dayData?.devCompleted || false;

  return (
    <TasksContainer>
      <TaskItem
        whileHover={{ x: 5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <TaskIcon type="dsa"><FaCode /></TaskIcon>
        <TaskContent>
          <TaskTitle>{dsaTopic?.title || "DSA Challenge"}</TaskTitle>
          <TaskStatus $completed={isDsaCompleted}>
            {isDsaCompleted ? 'Completed' : 'Not completed'}
          </TaskStatus>
        </TaskContent>
      </TaskItem>
      
      <TaskItem
        whileHover={{ x: 5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <TaskIcon type="dev"><FaLaptopCode /></TaskIcon>
        <TaskContent>
          <TaskTitle>{devTopic?.title || "Development Task"}</TaskTitle>
          <TaskStatus $completed={isDevCompleted}>
            {isDevCompleted ? 'Completed' : 'Not completed'}
          </TaskStatus>
        </TaskContent>
      </TaskItem>
      
      <ViewButton to={`/day/${currentDay || 1}`}>
        View Today's Tasks <FaArrowRight style={{ marginLeft: '0.5rem' }} />
      </ViewButton>
    </TasksContainer>
  );
};

export default TodaysTasks;