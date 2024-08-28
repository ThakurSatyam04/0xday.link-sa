import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface PrivateRouteProps {
  element: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  console.log(token)

  useEffect(() => {
    if (!token) {
      navigate('/admin', { replace: true }); // Redirect to /admin if no token
    } else {
      setIsAuthenticated(true); // Mark as authenticated if token exists
    }
  }, [token, navigate]);

  return isAuthenticated ? element : "null";
};

export default PrivateRoute;
