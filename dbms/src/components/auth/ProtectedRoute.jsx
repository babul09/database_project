import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children, requireAdmin }) => {
  const { currentUser, isAdmin } = useAuth();
  
  // If user is not logged in, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  // If route requires admin but user is not admin, redirect to dashboard
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" />;
  }
  
  // User has required permissions, render the route
  return children;
};

export default ProtectedRoute; 