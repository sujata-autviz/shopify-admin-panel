import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import AuthGuard from './components/AuthGuard';
import LoginGuard from './components/LoginGuard';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Stores from './pages/Stores';
import TokenUsage from './pages/TokenUsage';
import ChatHistory from './pages/ChatHistory';
import DashboardLayout from './layouts/DashboardLayout';
import './App.css';
import { getPageTitle } from './utils/navigation';
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

// Title updater component
const TitleUpdater = () => {
  const location = useLocation();
  
  useEffect(() => {
    
    const title = getPageTitle(location.pathname);
    
    document.title = `${title} | Mavexa Admin`;
  }, [location]);
  
  return null;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <TitleUpdater />
          <Routes>
            <Route path="/login" element={
              <LoginGuard>
                <Login />
              </LoginGuard>
            } />
            
            <Route path="/" element={
              <AuthGuard>
                <DashboardLayout />
              </AuthGuard>
            }>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="stores" element={<Stores />} />
              <Route path="token-usage" element={<TokenUsage />} />
              <Route path="chat-history" element={<ChatHistory />} />
              <Route path="users" element={<div>Users Page</div>} />
              <Route path="settings" element={<div>Settings Page</div>} />
            </Route>
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;










