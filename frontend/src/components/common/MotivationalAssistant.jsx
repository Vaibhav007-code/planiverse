// frontend/src/components/common/MotivationalAssistant.jsx
import { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaTimes } from 'react-icons/fa';

const AssistantButton = styled(motion.button)`
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  z-index: 90;
  
  @media (min-width: 768px) {
    bottom: 20px;
  }
`;

const AssistantContainer = styled(motion.div)`
  position: fixed;
  bottom: 150px;
  right: 20px;
  width: 300px;
  background: ${({ theme }) => theme.cardBackground};
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  z-index: 90;
  
  @media (min-width: 768px) {
    bottom: 90px;
    width: 350px;
  }
`;

const AssistantHeader = styled.div`
  padding: 1rem;
  background: ${({ theme }) => theme.primary};
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AssistantTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
`;

const AssistantContent = styled.div`
  padding: 1rem;
  max-height: 300px;
  overflow-y: auto;
`;

const Message = styled.p`
  margin-bottom: 1rem;
  line-height: 1.5;
`;

const motivationalMessages = [
  "Remember, every line of code you write brings you closer to your goal!",
  "Consistency is key. Keep showing up every day!",
  "You've got this! One day at a time, one problem at a time.",
  "The journey of a thousand miles begins with a single step. Keep stepping!",
  "Don't compare your day 1 to someone else's day 100. Focus on your progress.",
  "Debugging is like being the detective in a crime movie where you're also the murderer.",
  "Today's challenges are tomorrow's expertise. Keep pushing!",
  "Your future self will thank you for the hard work you're putting in today.",
  "Remember: It's not about being the best, it's about being better than you were yesterday."
];

// frontend/src/components/common/MotivationalAssistant.jsx (continued)
const MotivationalAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const toggleAssistant = () => {
    if (!isOpen) {
      // Get random motivational message when opening
      const randomIndex = Math.floor(Math.random() * motivationalMessages.length);
      setMessage(motivationalMessages[randomIndex]);
    }
    setIsOpen(!isOpen);
  };

  return (
    <>
      <AssistantButton
        onClick={toggleAssistant}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <FaRobot size={24} />
      </AssistantButton>
      
      <AnimatePresence>
        {isOpen && (
          <AssistantContainer
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <AssistantHeader>
              <AssistantTitle>Motivational Assistant</AssistantTitle>
              <CloseButton onClick={toggleAssistant}>
                <FaTimes />
              </CloseButton>
            </AssistantHeader>
            <AssistantContent>
              <Message>{message}</Message>
            </AssistantContent>
          </AssistantContainer>
        )}
      </AnimatePresence>
    </>
  );
};

export default MotivationalAssistant;