import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getToken } from '../services/authService';

const AuthGuard = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();
  const token = getToken();

  if (loading) {
    return <div>Loading...</div>;
  }

  // Check if token exists in cookies
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default AuthGuard;