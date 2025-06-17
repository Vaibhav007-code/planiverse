import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { AnimatePresence } from 'framer-motion';
import { auth } from './firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

// Pages
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import DayView from './pages/DayView';
import Login from './pages/Login';
import Register from './pages/Register';
import Resources from './pages/Resources';
import Analytics from './pages/Analytics';
import NotFound from './pages/NotFound';

// Components
import Navbar from './components/common/Navbar';
import SplashScreen from './components/common/SplashScreen';
import MotivationalAssistant from './components/common/MotivationalAssistant';

// Styles and themes
import GlobalStyle from './styles/GlobalStyle';
import { lightTheme, darkTheme } from './styles/themes';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Hide splash screen after 3 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('darkMode', !darkMode);
  };

  // Load dark mode preference from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <GlobalStyle />
      <Router>
        {user && <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
            <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
            <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
            <Route path="/calendar" element={user ? <Calendar user={user} /> : <Navigate to="/login" />} />
            <Route path="/day/:dayNumber" element={user ? <DayView user={user} /> : <Navigate to="/login" />} />
            <Route path="/resources" element={user ? <Resources /> : <Navigate to="/login" />} />
            <Route path="/analytics" element={user ? <Analytics user={user} /> : <Navigate to="/login" />} />
            <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
        {user && <MotivationalAssistant />}
      </Router>
    </ThemeProvider>
  );
}

export default App