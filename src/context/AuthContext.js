import React, { createContext, useState, useEffect } from 'react';
import { getCurrentUser, getToken, setAuthHeader } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if token exists in cookies
    const token = getToken();
    
    if (token) {
      // Set axios auth header
      setAuthHeader(token);
      
      // Get user data from localStorage
      const userData = getCurrentUser();
      setUser(userData);
    }
    
    setLoading(false);
  }, []);

  // Update auth header when user changes
  useEffect(() => {
    if (user && user.token) {
      setAuthHeader(user.token);
    } else {
      setAuthHeader(null);
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};


