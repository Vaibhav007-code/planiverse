// frontend/src/components/dashboard/StatsCard.jsx
import styled from 'styled-components';
import { motion } from 'framer-motion';

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const StatItem = styled(motion.div)`
  background: ${({ theme }) => theme.background};
  border-radius: 16px;
  padding: 1rem;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.primary};
  margin-bottom: 0.3rem;
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.text}aa;
`;

const StatsCard = ({ totalTasks, currentDay }) => {
  const daysRemaining = 730 - currentDay;
  const completionPercentage = Math.round((currentDay / 730) * 100);
  const estimatedCompletionDate = new Date();
  estimatedCompletionDate.setDate(estimatedCompletionDate.getDate() + daysRemaining);

  return (
    <StatsContainer>
      <StatItem
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <StatValue>{totalTasks}</StatValue>
        <StatLabel>Tasks Completed</StatLabel>
      </StatItem>
      
      <StatItem
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <StatValue>{daysRemaining}</StatValue>
        <StatLabel>Days Remaining</StatLabel>
      </StatItem>
      
      <StatItem
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <StatValue>{completionPercentage}%</StatValue>
        <StatLabel>Journey Progress</StatLabel>
      </StatItem>
      
      <StatItem
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <StatValue>{estimatedCompletionDate.toLocaleDateString()}</StatValue>
        <StatLabel>Est. Completion</StatLabel>
      </StatItem>
    </StatsContainer>
  );
};

export default StatsCard;