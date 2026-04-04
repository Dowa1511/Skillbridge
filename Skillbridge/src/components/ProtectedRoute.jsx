import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { LoadingPage } from './Loading';

const ProtectedRoute = ({ children, requiredRole }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        // Verify token with backend
        const res = await fetch('http://localhost:5000/api/auth/verify', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const userData = storedUser ? JSON.parse(storedUser) : null;
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          // Token invalid, clear storage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth verification failed:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  // Still checking authentication
  if (isAuthenticated === null) {
    return <LoadingPage message="Verifying authentication..." />;
  }

  // Not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role if required
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;