import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Avatar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getPageTitle } from '../utils/navigation';
const Navbar = ({ toggleSidebar }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

   const title = getPageTitle(location.pathname);
  
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
          {title}
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
