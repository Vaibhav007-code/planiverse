// frontend/src/components/dashboard/BadgesCard.jsx
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaTrophy, FaMedal, FaStar } from 'react-icons/fa';

const BadgesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
`;

const Badge = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${({ theme, color }) => theme[color] || theme.primary}22;
  color: ${({ theme, color }) => theme[color] || theme.primary};
`;

const BadgeName = styled.div`
  font-size: 0.7rem;
  text-align: center;
  margin-top: 0.5rem;
  font-weight: 500;
`;

const EmptyBadge = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  text-align: center;
  color: ${({ theme }) => theme.text}aa;
  font-size: 0.9rem;
`;

const defaultBadges = [
  { id: 'first-day', name: 'First Day', icon: <FaStar size={24} />, color: 'warning' },
  { id: 'week-streak', name: '7 Day Streak', icon: <FaMedal size={24} />, color: 'info' },
  { id: 'month-journey', name: '30 Day Journey', icon: <FaTrophy size={24} />, color: 'success' }
];

const BadgesCard = ({ badges = [] }) => {
  // If no badges, show default ones as locked
  const displayBadges = badges.length > 0 ? badges : defaultBadges;

  return (
    <BadgesContainer>
      {displayBadges.length > 0 ? (
        displayBadges.map((badge, index) => (
          <motion.div
            key={badge.id || index}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Badge 
              color={badge.color}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{ opacity: badges.length > 0 ? 1 : 0.5 }}
            >
              {badge.icon}
            </Badge>
            <BadgeName>{badge.name}</BadgeName>
          </motion.div>
        ))
      ) : (
        <EmptyBadge>
          Complete tasks to earn badges!
        </EmptyBadge>
      )}
    </BadgesContainer>
  );
};

export default BadgesCard;