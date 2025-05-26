import React from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
} from '@mui/material';
import { ExitToApp as LogoutIcon } from '@mui/icons-material';
import ContentManager from './ContentManager';

const Dashboard = ({ onLogout }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          <IconButton color="inherit" onClick={onLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
        <ContentManager />
      </Box>
    </Box>
  );
};

export default Dashboard; 