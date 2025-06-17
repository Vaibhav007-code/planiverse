// frontend/src/pages/Login.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { ref, get, set } from 'firebase/database';
import { auth, database } from '../firebase/config';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaGoogle } from 'react-icons/fa';

const LoginContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, ${({ theme }) => theme.gradientStart} 0%, ${({ theme }) => theme.gradientEnd} 100%);
`;

const LoginCard = styled(motion.div)`
  background: ${({ theme }) => theme.cardBackground};
  border-radius: 24px;
  padding: 2.5rem;
  width: 100%;
  max-width: 400px;
  box-shadow: ${({ theme }) => theme.shadow};
`;

const BrandTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
  color: ${({ theme }) => theme.primary};
  margin-bottom: 0.5rem;
  letter-spacing: 1px;
`;

const Tagline = styled.p`
  font-size: 0.9rem;
  text-align: center;
  color: ${({ theme }) => theme.text}aa;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-align: center;
  color: ${({ theme }) => theme.primary};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  font-size: 1rem;
  background: ${({ theme }) => theme.cardBackground};
  color: ${({ theme }) => theme.text};
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.2);
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.primary};
`;

const Button = styled(motion.button)`
  padding: 1rem;
  border: none;
  border-radius: 12px;
  background: ${({ theme }) => theme.primary};
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const GoogleButton = styled(motion.button)`
  padding: 1rem;
  border: none;
  border-radius: 12px;
  background: #ea4335;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 1rem 0;
  
  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.border};
  }
  
  span {
    padding: 0 1rem;
    color: ${({ theme }) => theme.text}aa;
    font-size: 0.9rem;
  }
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.danger};
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const SignupLink = styled.p`
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.9rem;

  a {
    color: ${({ theme }) => theme.primary};
    font-weight: 600;
    margin-left: 0.3rem;
  }
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const googleProvider = new GoogleAuthProvider();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Check if user exists in database
      const userRef = ref(database, 'users/' + user.uid);
      const snapshot = await get(userRef);
      
      if (!snapshot.exists()) {
        // Create new user in database
        const startDate = new Date(2025, 6, 1).toISOString(); // July 1, 2025
        
        await set(userRef, {
          name: user.displayName || 'User',
          email: user.email,
          createdAt: new Date().toISOString(),
          startDate: startDate,
          currentDay: 1,
          streak: 0,
          lastCompletedDay: null,
          totalTasksCompleted: 0,
          badges: []
        });
        
        // Initialize progress for day 1
        await set(ref(database, 'progress/' + user.uid), {
          days: {
            "1": {
              completed: false,
              dsaCompleted: false,
              devCompleted: false,
              date: startDate
            }
          }
        });
      }
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Google sign-in error:', error);
      setError('Failed to sign in with Google. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <LoginContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <LoginCard
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <BrandTitle>PLANIVERSE</BrandTitle>
        <Tagline>YOU CURATE YOUR SUCCESS HERE</Tagline>
        
        <Title>Welcome Back!</Title>
        
        <GoogleButton 
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <FaGoogle /> {googleLoading ? 'Signing in...' : 'Sign in with Google'}
        </GoogleButton>
        
        <Divider>
          <span>OR</span>
        </Divider>
        
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <InputIcon>
              <FaEnvelope />
            </InputIcon>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputGroup>
          <InputGroup>
            <InputIcon>
              <FaLock />
            </InputIcon>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </InputGroup>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Button 
            type="submit" 
            disabled={loading}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </Form>
        <SignupLink>
          Don't have an account?
          <Link to="/register">Sign up</Link>
        </SignupLink>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;