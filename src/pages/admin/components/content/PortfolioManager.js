import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
} from '@mui/material';
import { api } from '../../../../services/api';

const PortfolioManager = () => {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentItem, setCurrentItem] = useState({
    title: '',
    description: '',
    imageUrl: '',
    link: '',
  });

  const fetchPortfolioItems = async () => {
    try {
      setLoading(true);
      const response = await api.getPortfolio();
      setPortfolioItems(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch portfolio items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolioItems();
  }, []);

  const handleOpen = (item = null) => {
    if (item) {
      setCurrentItem(item);
    } else {
      setCurrentItem({
        title: '',
        description: '',
        imageUrl: '',
        link: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setError(null);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      if (currentItem._id) {
        await api.updatePortfolioItem(currentItem._id, currentItem);
      } else {
        await api.createPortfolioItem(currentItem);
      }
      fetchPortfolioItems();
      handleClose();
    } catch (err) {
      setError('Failed to save portfolio item');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await api.deletePortfolioItem(id);
      fetchPortfolioItems();
    } catch (err) {
      setError('Failed to delete portfolio item');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Snackbar open={error !== null} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>

      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">Portfolio Management</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => handleOpen()}
          disabled={loading}
        >
          Add New Project
        </Button>
      </Box>

      <Grid container spacing={2}>
        {portfolioItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{item.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
                {item.imageUrl && (
                  <Box sx={{ mt: 2, mb: 2 }}>
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
                    />
                  </Box>
                )}
                <Box sx={{ mt: 2 }}>
                  <Button 
                    size="small" 
                    onClick={() => handleOpen(item)}
                    disabled={loading}
                  >
                    Edit
                  </Button>
                  <Button 
                    size="small" 
                    color="error" 
                    onClick={() => handleDelete(item._id)}
                    disabled={loading}
                  >
                    Delete
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{currentItem._id ? 'Edit Project' : 'Add New Project'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            value={currentItem.title}
            onChange={(e) => setCurrentItem({ ...currentItem, title: e.target.value })}
            margin="normal"
            disabled={loading}
          />
          <TextField
            fullWidth
            label="Description"
            value={currentItem.description}
            onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
            margin="normal"
            multiline
            rows={4}
            disabled={loading}
          />
          <TextField
            fullWidth
            label="Image URL"
            value={currentItem.imageUrl}
            onChange={(e) => setCurrentItem({ ...currentItem, imageUrl: e.target.value })}
            margin="normal"
            disabled={loading}
          />
          <TextField
            fullWidth
            label="Project Link"
            value={currentItem.link}
            onChange={(e) => setCurrentItem({ ...currentItem, link: e.target.value })}
            margin="normal"
            disabled={loading}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>Cancel</Button>
          <Button 
            onClick={handleSave} 
            variant="contained" 
            color="primary"
            disabled={loading}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PortfolioManager; 