// frontend/src/components/dashboard/StreakCard.jsx
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaFire } from 'react-icons/fa';

const StreakContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const StreakValue = styled.div`
  font-size: 3rem;
  font-weight: 700;
  color: ${({ theme }) => theme.primary};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FireIcon = styled(motion.div)`
  color: ${({ theme }) => theme.warning};
`;

const StreakLabel = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text}aa;
  margin-top: 0.5rem;
`;

const StreakCard = ({ streak = 0 }) => {
  return (
    <StreakContainer>
      <StreakValue>
        {streak}
        <FireIcon
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <FaFire size={32} />
        </FireIcon>
      </StreakValue>
      <StreakLabel>Day{streak !== 1 ? 's' : ''} in a row</StreakLabel>
    </StreakContainer>
  );
};

export default StreakCard;