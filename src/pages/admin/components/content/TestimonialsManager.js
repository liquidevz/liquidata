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
  Rating,
  Alert,
  Snackbar,
} from '@mui/material';
import { api } from '../../../../services/api';

const TestimonialsManager = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentTestimonial, setCurrentTestimonial] = useState({
    name: '',
    company: '',
    testimonial: '',
    rating: 5,
    imageUrl: '',
  });

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await api.getTestimonials();
      setTestimonials(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch testimonials');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleOpen = (testimonial = null) => {
    if (testimonial) {
      setCurrentTestimonial(testimonial);
    } else {
      setCurrentTestimonial({
        name: '',
        company: '',
        testimonial: '',
        rating: 5,
        imageUrl: '',
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
      if (currentTestimonial._id) {
        await api.updateTestimonial(currentTestimonial._id, currentTestimonial);
      } else {
        await api.createTestimonial(currentTestimonial);
      }
      fetchTestimonials();
      handleClose();
    } catch (err) {
      setError('Failed to save testimonial');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await api.deleteTestimonial(id);
      fetchTestimonials();
    } catch (err) {
      setError('Failed to delete testimonial');
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
        <Typography variant="h5">Testimonials Management</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => handleOpen()}
          disabled={loading}
        >
          Add Testimonial
        </Button>
      </Box>

      <Grid container spacing={2}>
        {testimonials.map((testimonial) => (
          <Grid item xs={12} sm={6} md={4} key={testimonial._id}>
            <Card>
              <CardContent>
                {testimonial.imageUrl && (
                  <Box sx={{ mb: 2 }}>
                    <img 
                      src={testimonial.imageUrl} 
                      alt={testimonial.name} 
                      style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
                    />
                  </Box>
                )}
                <Typography variant="h6">{testimonial.name}</Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {testimonial.company}
                </Typography>
                <Rating value={testimonial.rating} readOnly />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  "{testimonial.testimonial}"
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Button 
                    size="small" 
                    onClick={() => handleOpen(testimonial)}
                    disabled={loading}
                  >
                    Edit
                  </Button>
                  <Button 
                    size="small" 
                    color="error" 
                    onClick={() => handleDelete(testimonial._id)}
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
        <DialogTitle>
          {currentTestimonial._id ? 'Edit Testimonial' : 'Add New Testimonial'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={currentTestimonial.name}
            onChange={(e) => setCurrentTestimonial({ ...currentTestimonial, name: e.target.value })}
            margin="normal"
            disabled={loading}
          />
          <TextField
            fullWidth
            label="Company"
            value={currentTestimonial.company}
            onChange={(e) => setCurrentTestimonial({ ...currentTestimonial, company: e.target.value })}
            margin="normal"
            disabled={loading}
          />
          <TextField
            fullWidth
            label="Testimonial"
            value={currentTestimonial.testimonial}
            onChange={(e) => setCurrentTestimonial({ ...currentTestimonial, testimonial: e.target.value })}
            margin="normal"
            multiline
            rows={4}
            disabled={loading}
          />
          <Box sx={{ mt: 2 }}>
            <Typography component="legend">Rating</Typography>
            <Rating
              value={currentTestimonial.rating}
              onChange={(event, newValue) => {
                setCurrentTestimonial({ ...currentTestimonial, rating: newValue });
              }}
              disabled={loading}
            />
          </Box>
          <TextField
            fullWidth
            label="Image URL"
            value={currentTestimonial.imageUrl}
            onChange={(e) => setCurrentTestimonial({ ...currentTestimonial, imageUrl: e.target.value })}
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

export default TestimonialsManager; 