import React, { createContext, useState, useEffect,useMemo } from 'react';
import { getCurrentUser, getToken, setAuthHeader } from '../services/authService';
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken()
    if (token) {
      setAuthHeader(token);
      const userData = getCurrentUser();
      setUser(userData);
    }
    
    setLoading(false);
  }, []);

useEffect(() => {
  setAuthHeader(user?.token ?? null);
}, [user]);

 const value = useMemo(() => ({ user, setUser, loading }), [user, setUser, loading]);

return (
  <AuthContext.Provider value={value}>
    {children}
  </AuthContext.Provider>
);
};


