// frontend/src/components/common/Navbar.jsx
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/config';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaSun, FaMoon, FaCalendarAlt, FaChartLine, FaBook, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';

const NavContainer = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: ${({ theme }) => theme.cardBackground};
  box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.1);
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  z-index: 100;
  padding: 0.5rem 0;

  @media (min-width: 768px) {
    top: 0;
    bottom: auto;
    border-radius: 0;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  }
`;

const NavItems = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 0.5rem;
  
  @media (max-width: 480px) {
    padding-bottom: env(safe-area-inset-bottom, 0.5rem);
  }
`;

const NavItem = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;
  cursor: pointer;
  color: ${({ $active, theme }) => ($active ? theme.primary : theme.text)};
  position: relative;

  &:hover {
    color: ${({ theme }) => theme.primary};
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem 0.25rem;
  }
`;

const NavText = styled.span`
  font-size: 0.7rem;
  margin-top: 0.2rem;
  font-weight: ${({ $active }) => ($active ? '600' : '400')};
  text-align: center;

  @media (min-width: 768px) {
    font-size: 0.8rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.65rem;
  }
`;

const ActiveIndicator = styled(motion.div)`
  position: absolute;
  bottom: -0.5rem;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.primary};

  @media (min-width: 768px) {
    top: -0.5rem;
    bottom: auto;
  }
`;

const ThemeToggle = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.text};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    color: ${({ theme }) => theme.primary};
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem 0.25rem;
  }
`;

const ThemeText = styled.span`
  font-size: 0.7rem;
  margin-top: 0.2rem;
  
  @media (min-width: 768px) {
    font-size: 0.8rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.65rem;
  }
`;

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <NavContainer>
      <NavItems>
        <Link to="/dashboard">
          <NavItem $active={isActive('/dashboard')} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <FaTachometerAlt size={20} />
            <NavText $active={isActive('/dashboard')}>Dashboard</NavText>
            {isActive('/dashboard') && <ActiveIndicator layoutId="activeIndicator" />}
          </NavItem>
        </Link>

        <Link to="/calendar">
          <NavItem $active={isActive('/calendar')} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <FaCalendarAlt size={20} />
            <NavText $active={isActive('/calendar')}>Calendar</NavText>
            {isActive('/calendar') && <ActiveIndicator layoutId="activeIndicator" />}
          </NavItem>
        </Link>

        <Link to="/analytics">
          <NavItem $active={isActive('/analytics')} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <FaChartLine size={20} />
            <NavText $active={isActive('/analytics')}>Analytics</NavText>
            {isActive('/analytics') && <ActiveIndicator layoutId="activeIndicator" />}
          </NavItem>
        </Link>

        <Link to="/resources">
          <NavItem $active={isActive('/resources')} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <FaBook size={20} />
            <NavText $active={isActive('/resources')}>Resources</NavText>
            {isActive('/resources') && <ActiveIndicator layoutId="activeIndicator" />}
          </NavItem>
        </Link>

        <ThemeToggle onClick={toggleDarkMode}>
          {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
          <ThemeText>Theme</ThemeText>
        </ThemeToggle>

        <NavItem onClick={handleLogout} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <FaSignOutAlt size={20} />
          <NavText>Logout</NavText>
        </NavItem>
      </NavItems>
    </NavContainer>
  );
};

export default Navbar;