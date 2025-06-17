// frontend/src/components/common/SplashScreen.jsx
import { useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const SplashContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%);
  z-index: 9999;
  padding: 1rem;
  text-align: center;
`;

const LogoContainer = styled(motion.div)`
  position: relative;
  width: 150px;
  height: 150px;
  margin-bottom: 1.5rem;
  
  @media (max-width: 480px) {
    width: 120px;
    height: 120px;
  }
`;

const Circle = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    width: 150%;
    height: 150%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transform: rotate(45deg);
    animation: shine 3s infinite;
  }
  
  @keyframes shine {
    0% { left: -100%; }
    100% { left: 100%; }
  }
`;

const Planet = styled(motion.div)`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: 50%;
  background: ${props => props.color};
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  
  @media (max-width: 480px) {
    width: ${props => props.size * 0.8}px;
    height: ${props => props.size * 0.8}px;
  }
`;

const Star = styled(motion.div)`
  position: absolute;
  width: 2px;
  height: 2px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 0 3px white;
`;

const Title = styled(motion.h1)`
  font-size: 2.5rem;
  font-weight: 800;
  color: white;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 0.5rem;
  max-width: 80%;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const generateStars = (count) => {
  const stars = [];
  for (let i = 0; i < count; i++) {
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const size = Math.random() * 2 + 1;
    const delay = Math.random() * 2;
    
    stars.push(
      <Star 
        key={i}
        style={{ 
          left: `${x}%`, 
          top: `${y}%`,
          width: `${size}px`,
          height: `${size}px`
        }}
        animate={{ 
          opacity: [0.2, 1, 0.2],
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 2 + delay,
          ease: "easeInOut"
        }}
      />
    );
  }
  return stars;
};

const SplashScreen = () => {
  useEffect(() => {
    // Play a sound effect when the splash screen appears
    const audio = new Audio('/sounds/startup.mp3');
    audio.volume = 0.5;
    audio.play().catch(err => console.log('Audio play failed:', err));
  }, []);

  return (
    <SplashContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <LogoContainer>
        <Circle
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
        >
          🚀
        </Circle>
        
        {/* Orbiting planets */}
        <Planet 
          size={20} 
          color="#FD79A8"
          animate={{ 
            x: [0, 60, 0, -60, 0], 
            y: [60, 0, -60, 0, 60],
            scale: [1, 1.1, 1, 0.9, 1]
          }}
          transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
        />
        
        <Planet 
          size={15} 
          color="#74B9FF"
          animate={{ 
            x: [40, 0, -40, 0, 40], 
            y: [0, 40, 0, -40, 0],
            scale: [0.9, 1, 1.1, 1, 0.9]
          }}
          transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
        />
        
        <Planet 
          size={12} 
          color="#55EFC4"
          animate={{ 
            x: [-30, -20, 0, 20, 30, 20, 0, -20, -30], 
            y: [0, 20, 30, 20, 0, -20, -30, -20, 0],
            scale: [1, 0.9, 0.8, 0.9, 1, 0.9, 0.8, 0.9, 1]
          }}
          transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
        />
        
        {/* Background stars */}
        {generateStars(20)}
      </LogoContainer>
      
      <Title
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        PLANIVERSE
      </Title>
      <Subtitle
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
      >
        YOU CURATE YOUR SUCCESS HERE
      </Subtitle>
    </SplashContainer>
  );
};

export default SplashScreen;