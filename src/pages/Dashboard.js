import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import BarChartIcon from '@mui/icons-material/BarChart';

const Dashboard = () => {
  const stats = [
    { title: 'Total Users', value: '1,245', icon: <PeopleIcon sx={{ fontSize: 40 }} />, color: '#3f51b5' },
    { title: 'Total Orders', value: '356', icon: <ShoppingCartIcon sx={{ fontSize: 40 }} />, color: '#f44336' },
    { title: 'Revenue', value: '$15,350', icon: <AttachMoneyIcon sx={{ fontSize: 40 }} />, color: '#4caf50' },
    { title: 'Growth', value: '+23%', icon: <BarChartIcon sx={{ fontSize: 40 }} />, color: '#ff9800' },
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>Dashboard</Typography>
      
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                height: 140,
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Box sx={{ 
                position: 'absolute', 
                top: 16, 
                right: 16, 
                color: stat.color,
                opacity: 0.2,
                transform: 'scale(1.5)',
                transformOrigin: 'top right'
              }}>
                {stat.icon}
              </Box>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {stat.title}
              </Typography>
              <Typography variant="h4" component="div" sx={{ mt: 'auto', fontWeight: 'bold', color: stat.color }}>
                {stat.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;