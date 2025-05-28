import React from 'react';
import { Navigate } from 'react-router-dom';
import { getToken } from '../services/authService';

const LoginGuard = ({ children }) => {
  const token = getToken();

  // If token exists, redirect to dashboard
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default LoginGuard;