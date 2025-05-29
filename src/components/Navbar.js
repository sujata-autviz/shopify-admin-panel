import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Avatar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = ({ toggleSidebar }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  
  // Get the current page title based on the path
  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path.includes('/dashboard')) return 'Dashboard';
    if (path.includes('/stores')) return 'Stores';
    if (path.includes('/token-usage')) return 'Token Usage';
    if (path.includes('/chat-history')) return 'Chat History';
    if (path.includes('/users')) return 'Users';
    if (path.includes('/settings')) return 'Settings';
    if (path.includes('/login')) return 'Login';
    
    return 'Dashboard';
  };
  
  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={toggleSidebar}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          {getPageTitle()}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ mr: 2 }}>
            {user?.username || 'Admin'}
          </Typography>
          <Avatar sx={{ bgcolor: 'secondary.main' }}>
            {(user?.username?.[0] || 'A').toUpperCase()}
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
