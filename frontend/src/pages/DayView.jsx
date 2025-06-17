// frontend/src/pages/DayView.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaArrowRight, FaCode, FaLaptopCode, FaCheckCircle, FaLock, FaEye } from 'react-icons/fa';
import { ref, onValue, update, get } from "firebase/database";
import { database } from '../firebase/config';
import { dsaTopics, devTopics } from '../data/curriculumData';
import Confetti from 'react-confetti';

const DayViewContainer = styled(motion.div)`
  padding: 2rem 1rem 6rem;
  max-width: 1000px;
  margin: 0 auto;
  
  @media (min-width: 768px) {
    padding: 6rem 2rem 2rem;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  
  @media (min-width: 768px) {
    font-size: 2.2rem;
  }
`;

const PreviewBadge = styled.span`
  display: inline-block;
  background: ${({ theme }) => theme.warning};
  color: white;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  margin-left: 1rem;
  vertical-align: middle;
  
  @media (max-width: 480px) {
    margin-left: 0;
    margin-top: 0.5rem;
    font-size: 0.7rem;
  }
`;

const Navigation = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 480px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const NavButton = styled(motion.button)`
  background: ${({ theme }) => theme.cardBackground};
  border: none;
  border-radius: 12px;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadow};
  color: ${({ theme }) => theme.text};
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ theme }) => theme.primary};
    color: white;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    
    &:hover {
      background: ${({ theme }) => theme.cardBackground};
      color: ${({ theme }) => theme.text};
    }
  }
`;

const TasksContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const TaskCard = styled(motion.div)`
  background: ${({ theme }) => theme.cardBackground};
  border-radius: 24px;
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadow};
  position: relative;
  overflow: hidden;
`;

const PreviewOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.cardBackground}dd;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
  backdrop-filter: blur(3px);
  border-radius: 24px;
`;

const PreviewMessage = styled.div`
  text-align: center;
  padding: 1.5rem;
  
  h3 {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: ${({ theme }) => theme.primary};
  }
  
  p {
    margin-bottom: 1.5rem;
    line-height: 1.5;
  }
`;

const PreviewButton = styled(motion.button)`
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 12px;
  background: ${({ theme }) => theme.primary};
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 0 auto;
`;

const TaskHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 1.5rem;
`;

const TaskIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ type, theme }) => 
    type === 'dsa' ? theme.warning + '33' : theme.info + '33'};
  color: ${({ type, theme }) => 
    type === 'dsa' ? theme.warning : theme.info};
  font-size: 1.2rem;
`;

const TaskTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
`;

const TaskContent = styled.div`
  margin-bottom: 1.5rem;
`;

const TopicTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.8rem;
  color: ${({ theme }) => theme.primary};
`;

const TopicDescription = styled.p`
  font-size: 0.95rem;
  margin-bottom: 1rem;
  line-height: 1.5;
`;

const ProblemList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const ProblemItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem;
  border-radius: 12px;
  background: ${({ theme }) => theme.background};
  margin-bottom: 0.8rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateX(5px);
  }
`;

const ProblemCheckbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: ${({ theme }) => theme.primary};
`;

const ProblemText = styled.span`
  font-size: 0.9rem;
`;

const ProblemDifficulty = styled.span`
  font-size: 0.75rem;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  background: ${({ $difficulty, theme }) => 
    $difficulty === 'Easy' 
      ? theme.success + '33' 
      : $difficulty === 'Medium' 
        ? theme.warning + '33' 
        : theme.danger + '33'};
  color: ${({ $difficulty, theme }) => 
    $difficulty === 'Easy' 
      ? theme.success 
      : $difficulty === 'Medium' 
        ? theme.warning 
        : theme.danger};
  margin-left: auto;
`;

const CompletionButton = styled(motion.button)`
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 12px;
  background: ${({ $completed, theme }) => 
    $completed ? theme.success : theme.primary};
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const DayView = ({ user }) => {
  const { dayNumber } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dsaChecklist, setDsaChecklist] = useState([]);
  const [devChecklist, setDevChecklist] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [savingDsa, setSavingDsa] = useState(false);
  const [savingDev, setSavingDev] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (user) {
      // Reference to user data in the database
      const userRef = ref(database, 'users/' + user.uid);
      
      // Listen for changes to user data
      const unsubscribeUser = onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setUserData(data);
          
          // Check if user is trying to access a future day
          const currentDayNum = parseInt(dayNumber);
          if (currentDayNum > data.currentDay) {
            setIsPreviewMode(true);
          }
          
          // Check if previous days are completed
          if (currentDayNum > 1 && !isPreviewMode) {
            const progressRef = ref(database, 'progress/' + user.uid);
            get(progressRef).then((snapshot) => {
              const progressData = snapshot.val();
              if (progressData) {
                for (let i = 1; i < currentDayNum; i++) {
                  if (!progressData.days[i]?.completed) {
                    setIsPreviewMode(true);
                    break;
                  }
                }
              }
            });
          }
        }
      });
      
      // Reference to progress data in the database
      const progressRef = ref(database, 'progress/' + user.uid);
      
      // Listen for changes to progress data
      const unsubscribeProgress = onValue(progressRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setProgressData(data);
          
          // Initialize checklists
          const dayData = data.days[dayNumber] || {};
          
          // DSA checklist
          const dsaDay = (parseInt(dayNumber) - 1) % dsaTopics.length;
          const dsaTopic = dsaTopics[dsaDay];
          const savedDsaChecklist = dayData.dsaChecklist || Array(dsaTopic.problems.length).fill(false);
          setDsaChecklist(savedDsaChecklist);
          
          // Dev checklist
          const devDay = (parseInt(dayNumber) - 1) % devTopics.length;
          const devTopic = devTopics[devDay];
          const savedDevChecklist = dayData.devChecklist || Array(devTopic.tasks.length).fill(false);
          setDevChecklist(savedDevChecklist);
          
          // Show confetti if day is completed
          if (dayData.completed) {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 5000);
          }
        }
        
        setLoading(false);
      });
      
      // Clean up listeners
      return () => {
        unsubscribeUser();
        unsubscribeProgress();
      };
    }
  }, [user, dayNumber, isPreviewMode]);

  const handleDsaChecklistChange = (index, checked) => {
    if (isPreviewMode) return;
    
    const newChecklist = [...dsaChecklist];
    newChecklist[index] = checked;
    setDsaChecklist(newChecklist);
  };

  const handleDevChecklistChange = (index, checked) => {
    if (isPreviewMode) return;
    
    const newChecklist = [...devChecklist];
    newChecklist[index] = checked;
    setDevChecklist(newChecklist);
  };

  const handleCompleteDsa = async () => {
    if (isPreviewMode) return;
    
    setSavingDsa(true);
    try {
      const progressRef = ref(database, 'progress/' + user.uid);
      const snapshot = await get(progressRef);
      const progressData = snapshot.val();
      
      // Update day data
      const days = { ...progressData.days };
      days[dayNumber] = {
        ...days[dayNumber],
        dsaChecklist,
        dsaCompleted: true,
        date: new Date().toISOString()
      };
      
      // Check if both DSA and Dev are completed
      const isFullyCompleted = days[dayNumber]?.devCompleted === true;
      if (isFullyCompleted) {
        days[dayNumber].completed = true;
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
        
        // Update user data if this is the current day
        if (parseInt(dayNumber) === userData.currentDay) {
          const userRef = ref(database, 'users/' + user.uid);
          await update(userRef, {
            currentDay: parseInt(dayNumber) + 1,
            streak: userData.streak + 1,
            lastCompletedDay: new Date().toISOString(),
            totalTasksCompleted: userData.totalTasksCompleted + 1
          });
        }
      }
      
      await update(progressRef, { days });
    } catch (error) {
      console.error("Error saving DSA progress:", error);
    } finally {
      setSavingDsa(false);
    }
  };

  const handleCompleteDev = async () => {
    if (isPreviewMode) return;
    
    setSavingDev(true);
    try {
      const progressRef = ref(database, 'progress/' + user.uid);
      const snapshot = await get(progressRef);
      const progressData = snapshot.val();
      
      // Update day data
      const days = { ...progressData.days };
      days[dayNumber] = {
        ...days[dayNumber],
        devChecklist,
        devCompleted: true,
        date: new Date().toISOString()
      };
      
      // Check if both DSA and Dev are completed
      const isFullyCompleted = days[dayNumber]?.dsaCompleted === true;
      if (isFullyCompleted) {
        // frontend/src/pages/DayView.jsx (continued)
        days[dayNumber].completed = true;
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
        
        // Update user data if this is the current day
        if (parseInt(dayNumber) === userData.currentDay) {
          const userRef = ref(database, 'users/' + user.uid);
          await update(userRef, {
            currentDay: parseInt(dayNumber) + 1,
            streak: userData.streak + 1,
            lastCompletedDay: new Date().toISOString(),
            totalTasksCompleted: userData.totalTasksCompleted + 1
          });
        }
      }
      
      await update(progressRef, { days });
    } catch (error) {
      console.error("Error saving Dev progress:", error);
    } finally {
      setSavingDev(false);
    }
  };

  const handlePrevDay = () => {
    navigate(`/day/${parseInt(dayNumber) - 1}`);
  };

  const handleNextDay = () => {
    navigate(`/day/${parseInt(dayNumber) + 1}`);
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  // Get current day's topics
  const dsaDay = (parseInt(dayNumber) - 1) % dsaTopics.length;
  const dsaTopic = dsaTopics[dsaDay];
  
  const devDay = (parseInt(dayNumber) - 1) % devTopics.length;
  const devTopic = devTopics[devDay];
  
  // Check if day is completed
  const dayData = progressData?.days[dayNumber] || {};
  const isDsaCompleted = dayData.dsaCompleted;
  const isDevCompleted = dayData.devCompleted;
  const isDayCompleted = dayData.completed;

  // Calculate the actual calendar date for this day
  const startDate = new Date(userData?.startDate || new Date());
  const dayDate = new Date(startDate);
  dayDate.setDate(startDate.getDate() + parseInt(dayNumber) - 1);
  const formattedDate = dayDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <DayViewContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      
      <Header>
        <div>
          <Title>
            Day {dayNumber}
            {isPreviewMode && <PreviewBadge>Preview Mode</PreviewBadge>}
          </Title>
          <p style={{ marginTop: '0.5rem', color: '#666' }}>{formattedDate}</p>
        </div>
        <Navigation>
          <NavButton 
            onClick={handlePrevDay} 
            disabled={parseInt(dayNumber) <= 1}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaArrowLeft /> Previous Day
          </NavButton>
          <NavButton 
            onClick={handleNextDay} 
            disabled={parseInt(dayNumber) >= 730}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Next Day <FaArrowRight />
          </NavButton>
        </Navigation>
      </Header>
      
      <TasksContainer>
        <TaskCard
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {isPreviewMode && !showPreview && (
            <PreviewOverlay>
              <PreviewMessage>
                <h3>DSA Challenge Preview</h3>
                <p>This is a future day in your journey. You need to complete previous days first before you can work on this day's tasks.</p>
                <PreviewButton 
                  onClick={togglePreview}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaEye /> Preview Tasks
                </PreviewButton>
              </PreviewMessage>
            </PreviewOverlay>
          )}
          
          <TaskHeader>
            <TaskIcon type="dsa"><FaCode /></TaskIcon>
            <TaskTitle>DSA Challenge</TaskTitle>
          </TaskHeader>
          
          <TaskContent>
            <TopicTitle>{dsaTopic.title}</TopicTitle>
            <TopicDescription>{dsaTopic.description}</TopicDescription>
            
            <ProblemList>
              {dsaTopic.problems.map((problem, index) => (
                <ProblemItem key={index}>
                  <ProblemCheckbox 
                    type="checkbox" 
                    checked={dsaChecklist[index] || false}
                    onChange={(e) => handleDsaChecklistChange(index, e.target.checked)}
                    disabled={isDsaCompleted || isPreviewMode}
                  />
                  <ProblemText>{problem.name}</ProblemText>
                  <ProblemDifficulty $difficulty={problem.difficulty}>
                    {problem.difficulty}
                  </ProblemDifficulty>
                </ProblemItem>
              ))}
            </ProblemList>
          </TaskContent>
          
          <CompletionButton 
            $completed={isDsaCompleted}
            onClick={handleCompleteDsa}
            disabled={isDsaCompleted || dsaChecklist.some(item => !item) || savingDsa || isPreviewMode}
            whileHover={{ scale: isPreviewMode ? 1 : 1.03 }}
            whileTap={{ scale: isPreviewMode ? 1 : 0.98 }}
          >
            {isDsaCompleted ? (
              <>
                <FaCheckCircle /> Completed
              </>
            ) : isPreviewMode ? (
              <>
                <FaLock /> Complete Previous Days First
              </>
            ) : savingDsa ? (
              'Saving...'
            ) : (
              'Mark DSA as Complete'
            )}
          </CompletionButton>
        </TaskCard>
        
        <TaskCard
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {isPreviewMode && !showPreview && (
            <PreviewOverlay>
              <PreviewMessage>
                <h3>Development Task Preview</h3>
                <p>This is a future day in your journey. You need to complete previous days first before you can work on this day's tasks.</p>
                <PreviewButton 
                  onClick={togglePreview}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaEye /> Preview Tasks
                </PreviewButton>
              </PreviewMessage>
            </PreviewOverlay>
          )}
          
          <TaskHeader>
            <TaskIcon type="dev"><FaLaptopCode /></TaskIcon>
            <TaskTitle>Development Task</TaskTitle>
          </TaskHeader>
          
          <TaskContent>
            <TopicTitle>{devTopic.title}</TopicTitle>
            <TopicDescription>{devTopic.description}</TopicDescription>
            
            <ProblemList>
              {devTopic.tasks.map((task, index) => (
                <ProblemItem key={index}>
                  <ProblemCheckbox 
                    type="checkbox" 
                    checked={devChecklist[index] || false}
                    onChange={(e) => handleDevChecklistChange(index, e.target.checked)}
                    disabled={isDevCompleted || isPreviewMode}
                  />
                  <ProblemText>{task}</ProblemText>
                </ProblemItem>
              ))}
            </ProblemList>
          </TaskContent>
          
          <CompletionButton 
            $completed={isDevCompleted}
            onClick={handleCompleteDev}
            disabled={isDevCompleted || devChecklist.some(item => !item) || savingDev || isPreviewMode}
            whileHover={{ scale: isPreviewMode ? 1 : 1.03 }}
            whileTap={{ scale: isPreviewMode ? 1 : 0.98 }}
          >
            {isDevCompleted ? (
              <>
                <FaCheckCircle /> Completed
              </>
            ) : isPreviewMode ? (
              <>
                <FaLock /> Complete Previous Days First
              </>
            ) : savingDev ? (
              'Saving...'
            ) : (
              'Mark Development as Complete'
            )}
          </CompletionButton>
        </TaskCard>
      </TasksContainer>
      
      {isPreviewMode && showPreview && (
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <PreviewButton 
            onClick={togglePreview}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ background: '#f39c12' }}
          >
            <FaEye /> Hide Preview
          </PreviewButton>
        </div>
      )}
    </DayViewContainer>
  );
};

export default DayView;