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

const TeamManager = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentMember, setCurrentMember] = useState({
    name: '',
    position: '',
    bio: '',
    imageUrl: '',
  });

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const response = await api.getTeam();
      setTeamMembers(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch team members');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const handleOpen = (member = null) => {
    if (member) {
      setCurrentMember(member);
    } else {
      setCurrentMember({
        name: '',
        position: '',
        bio: '',
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
      if (currentMember._id) {
        await api.updateTeamMember(currentMember._id, currentMember);
      } else {
        await api.createTeamMember(currentMember);
      }
      fetchTeamMembers();
      handleClose();
    } catch (err) {
      setError('Failed to save team member');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await api.deleteTeamMember(id);
      fetchTeamMembers();
    } catch (err) {
      setError('Failed to delete team member');
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
        <Typography variant="h5">Team Management</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => handleOpen()}
          disabled={loading}
        >
          Add Team Member
        </Button>
      </Box>

      <Grid container spacing={2}>
        {teamMembers.map((member) => (
          <Grid item xs={12} sm={6} md={4} key={member._id}>
            <Card>
              <CardContent>
                {member.imageUrl && (
                  <Box sx={{ mb: 2 }}>
                    <img 
                      src={member.imageUrl} 
                      alt={member.name} 
                      style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
                    />
                  </Box>
                )}
                <Typography variant="h6">{member.name}</Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {member.position}
                </Typography>
                <Typography variant="body2">
                  {member.bio}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Button 
                    size="small" 
                    onClick={() => handleOpen(member)}
                    disabled={loading}
                  >
                    Edit
                  </Button>
                  <Button 
                    size="small" 
                    color="error" 
                    onClick={() => handleDelete(member._id)}
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
        <DialogTitle>{currentMember._id ? 'Edit Team Member' : 'Add Team Member'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={currentMember.name}
            onChange={(e) => setCurrentMember({ ...currentMember, name: e.target.value })}
            margin="normal"
            disabled={loading}
          />
          <TextField
            fullWidth
            label="Position"
            value={currentMember.position}
            onChange={(e) => setCurrentMember({ ...currentMember, position: e.target.value })}
            margin="normal"
            disabled={loading}
          />
          <TextField
            fullWidth
            label="Bio"
            value={currentMember.bio}
            onChange={(e) => setCurrentMember({ ...currentMember, bio: e.target.value })}
            margin="normal"
            multiline
            rows={4}
            disabled={loading}
          />
          <TextField
            fullWidth
            label="Image URL"
            value={currentMember.imageUrl}
            onChange={(e) => setCurrentMember({ ...currentMember, imageUrl: e.target.value })}
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

export default TeamManager; 