import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const AuthRedirect = ({ children }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  // If not logged in, render the children (Login page)
  return !currentUser ? children : null;
};

export default AuthRedirect; 