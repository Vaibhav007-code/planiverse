// frontend/src/components/dashboard/ProgressCircle.jsx
import styled from 'styled-components';
import { motion } from 'framer-motion';

const CircleContainer = styled.div`
  position: relative;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  margin: 0 auto 1.5rem;
`;

const CircleBackground = styled.circle`
  fill: none;
  stroke: ${({ theme }) => theme.background};
  stroke-width: 10;
`;

const CircleProgress = styled(motion.circle)`
  fill: none;
  stroke: ${({ theme }) => theme.primary};
  stroke-width: 10;
  stroke-linecap: round;
  transform-origin: center;
  transform: rotate(-90deg);
`;

const CircleText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
`;

const Percentage = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${({ theme }) => theme.primary};
`;

const Label = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.text}aa;
`;

const ProgressCircle = ({ percentage, size = 150 }) => {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <CircleContainer size={size}>
      <svg width={size} height={size}>
        <CircleBackground
          cx={size / 2}
          cy={size / 2}
          r={radius}
        />
        <CircleProgress
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </svg>
      <CircleText>
        <Percentage>{percentage}%</Percentage>
        <Label>Completed</Label>
      </CircleText>
    </CircleContainer>
  );
};

export default ProgressCircle;