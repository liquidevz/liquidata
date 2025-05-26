import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Container, Paper, Typography } from '@mui/material';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem('adminToken', token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    navigate('/admin');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        {!isAuthenticated ? (
          <>
            <Typography variant="h4" gutterBottom>
              Admin Panel
            </Typography>
            <Login onLogin={handleLogin} />
          </>
        ) : (
          <Dashboard onLogout={handleLogout} />
        )}
      </Paper>
    </Container>
  );
};

export default AdminPanel; 