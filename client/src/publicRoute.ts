import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface PublicRouteProps {
  element: JSX.Element;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ element }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      navigate('/admin-access', { replace: true }); // Redirect to /admin-access if token exists
    }
  }, [token, navigate]);

  // Render the public component if no token
  return !token ? element : null;
};

export default PublicRoute;
