// frontend/src/pages/Calendar.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { database } from '../firebase/config';
import { ref, onValue } from 'firebase/database';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';

const CalendarContainer = styled(motion.div)`
  padding: 2rem 1rem 6rem;
  max-width: 1200px;
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

const PageTitle = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  
  @media (min-width: 768px) {
    font-size: 2.2rem;
  }
  
  @media (max-width: 480px) {
    width: 100%;
    margin-bottom: 0.5rem;
  }
`;

const MonthSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const MonthButton = styled.button`
  background: ${({ theme }) => theme.cardBackground};
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadow};
  color: ${({ theme }) => theme.text};
  font-size: 1.2rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ theme }) => theme.primary};
    color: white;
  }
`;

const CurrentMonth = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
  min-width: 150px;
  text-align: center;
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  
  @media (min-width: 768px) {
    gap: 1rem;
  }
  
  @media (max-width: 480px) {
    gap: 0.25rem;
  }
`;

const WeekdayLabel = styled.div`
  text-align: center;
  font-weight: 600;
  padding: 0.5rem 0;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text}aa;
  
  @media (max-width: 480px) {
    font-size: 0.7rem;
    padding: 0.3rem 0;
  }
`;

const DayCell = styled(motion.div)`
  aspect-ratio: 1;
  border-radius: 16px;
  background: ${({ $isCurrentDay, $isCompleted, $isActive, theme }) => 
    $isCurrentDay 
      ? theme.primary 
      : $isCompleted 
        ? theme.success + '33'
        : $isActive 
          ? theme.cardBackground
          : theme.background + '50'
  };
  color: ${({ $isCurrentDay, theme }) => $isCurrentDay ? 'white' : theme.text};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: ${({ $hasDay }) => $hasDay ? 'pointer' : 'default'};
  box-shadow: ${({ $isActive, theme }) => $isActive ? theme.shadow : 'none'};
  opacity: ${({ $isActive, $hasDay }) => (!$isActive && $hasDay) ? 0.8 : $hasDay ? 1 : 0.6};
  position: relative;
  overflow: hidden;
  padding: 0.25rem;
  
  &:hover {
    transform: ${({ $hasDay }) => $hasDay ? 'translateY(-3px)' : 'none'};
    box-shadow: ${({ $hasDay, theme }) => $hasDay ? '0 10px 30px rgba(0, 0, 0, 0.15)' : 'none'};
  }
  
  @media (max-width: 480px) {
    border-radius: 8px;
    padding: 0.1rem;
  }
`;

const DayNumber = styled.span`
  font-size: 1.2rem;
  font-weight: ${({ $isCurrentDay }) => $isCurrentDay ? '700' : '500'};
  margin-bottom: 0.2rem;
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin-bottom: 0.1rem;
  }
`;

const DayText = styled.span`
  font-size: 0.8rem;
  text-align: center;
  
  @media (max-width: 480px) {
    font-size: 0.6rem;
  }
`;

const DayIndicators = styled.div`
  display: flex;
  gap: 3px;
  margin-top: 0.2rem;
  
  @media (max-width: 480px) {
    gap: 2px;
    margin-top: 0.1rem;
  }
`;

const Indicator = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ type, theme }) => 
    type === 'dsa' 
      ? theme.warning 
      : type === 'dev' 
        ? theme.info 
        : theme.accent};
  
  @media (max-width: 480px) {
    width: 4px;
    height: 4px;
  }
`;

const CompletedBadge = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  background: ${({ theme }) => theme.success};
  color: white;
  font-size: 0.7rem;
  padding: 0.2rem;
  border-bottom-left-radius: 8px;
  
  @media (max-width: 480px) {
    font-size: 0.6rem;
    padding: 0.1rem;
    border-bottom-left-radius: 4px;
  }
`;

const Calendar = ({ user }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [userData, setUserData] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Reference to user data in the database
      const userRef = ref(database, 'users/' + user.uid);
      
      // Listen for changes to user data
      const unsubscribeUser = onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setUserData(data);
          
          // Set current date to start date month if it's the first load
          if (data.startDate && !currentDate.userSet) {
            const startDate = new Date(data.startDate);
            setCurrentDate(new Date(startDate.getFullYear(), startDate.getMonth(), 1));
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
        }
        
        setLoading(false);
      });
      
      // Clean up listeners
      return () => {
        unsubscribeUser();
        unsubscribeProgress();
      };
    }
  }, [user, currentDate]);

  const handlePrevMonth = () => {
    const prevMonth = new Date(currentDate);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    prevMonth.userSet = true;
    setCurrentDate(prevMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(currentDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    nextMonth.userSet = true;
    setCurrentDate(nextMonth);
  };

  const handleDayClick = (dayNumber) => {
    if (dayNumber) {
      // Always navigate to the day view, even for future days
      // The DayView component will handle showing it in preview mode if needed
      navigate(`/day/${dayNumber}`);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  // Calculate days to display
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Add empty cells for days before the first day of the month
  const startDay = monthStart.getDay();
  const emptyDaysBefore = Array(startDay).fill(null);
  
  // Get weekday names
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <CalendarContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Header>
        <PageTitle>730-Day Journey</PageTitle>
        <MonthSelector>
          <MonthButton onClick={handlePrevMonth}>&lt;</MonthButton>
          <CurrentMonth>{format(currentDate, 'MMMM yyyy')}</CurrentMonth>
          <MonthButton onClick={handleNextMonth}>&gt;</MonthButton>
        </MonthSelector>
      </Header>
      
      <CalendarGrid>
        {weekdays.map((day, index) => (
          <WeekdayLabel key={index}>{day}</WeekdayLabel>
        ))}
        
        {emptyDaysBefore.map((_, index) => (
          <DayCell key={`empty-${index}`} $isActive={false} $hasDay={false} />
        ))}
        
        {daysInMonth.map((date, index) => {
          // Calculate the day number based on the start date
          const startDate = new Date(userData?.startDate);
          const currentDateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), date.getDate());
          
          // Calculate days difference
          const diffTime = Math.abs(currentDateObj - startDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          // Day number is 1 + days since start date
          // If date is before start date, don't show day number
          let dayNumber = null;
          if (currentDateObj >= startDate) {
            dayNumber = diffDays + 1;
          }
          
          // Don't show days beyond 730
          if (dayNumber > 730) {
            dayNumber = null;
          }
          
          const dayData = dayNumber ? progressData?.days[dayNumber] : null;
          const isCompleted = dayData?.completed;
          const isCurrentDay = isSameDay(date, new Date());
          const isActive = dayNumber !== null && dayNumber <= userData?.currentDay;
          const hasDay = dayNumber !== null;
          
          return (
            <DayCell
              key={index}
              $isCurrentDay={isCurrentDay}
              $isCompleted={isCompleted}
              $isActive={isActive}
              $hasDay={hasDay}
              onClick={() => hasDay && handleDayClick(dayNumber)}
              whileHover={hasDay ? { scale: 1.05 } : {}}
              whileTap={hasDay ? { scale: 0.95 } : {}}
            >
              <DayNumber $isCurrentDay={isCurrentDay}>{date.getDate()}</DayNumber>
              {dayNumber && <DayText>Day {dayNumber}</DayText>}
              
              {isCompleted && <CompletedBadge>✓</CompletedBadge>}
              
              <DayIndicators>
                {dayData?.dsaCompleted && <Indicator type="dsa" />}
                {dayData?.devCompleted && <Indicator type="dev" />}
              </DayIndicators>
            </DayCell>
          );
        })}
      </CalendarGrid>
    </CalendarContainer>
  );
};

export default Calendar;