import React from 'react';
import { Navigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

// Define the type for the decoded JWT token
interface DecodedToken {
  exp: number;
}

// Define the type for the PrivateRoute props
interface PrivateRouteProps {
  element: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const token = localStorage.getItem('token');

  const isAuthenticated = (): boolean => {
    if (!token) return false;
    try {
      // Use type assertion to ensure jwtDecode is treated as a function
      const decodedToken = jwtDecode<DecodedToken>(token);
      return decodedToken.exp * 1000 > Date.now(); // Check if token is expired
    } catch (error) {
      return false;
    }
  };

  return isAuthenticated() ? element : <Navigate to="/admin" replace />;
};

export default PrivateRoute;
