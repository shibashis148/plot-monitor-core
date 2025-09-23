import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { api } from '../services/api';

function ThresholdEditModal({ open, onClose, plotId, plotName }) {
  const [thresholds, setThresholds] = useState({
    temperature: { min: 0, max: 30 },
    humidity: { min: 30, max: 80 },
    soil_moisture: { min: 20, max: 80 },
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (open && plotId) {
      fetchThresholds();
    }
  }, [open, plotId]);

  const fetchThresholds = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/plots/${plotId}/thresholds`);
      if (response.data.data?.alert_thresholds) {
        setThresholds(response.data.data.alert_thresholds);
      }
    } catch (err) {
      // If no thresholds exist, use defaults
      console.log('No existing thresholds found, using defaults');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = {
        alert_thresholds: thresholds
      };
      await api.put(`/plots/${plotId}/thresholds`, payload);
      enqueueSnackbar('Thresholds updated successfully', { variant: 'success' });
      onClose();
    } catch (err) {
      enqueueSnackbar('Failed to update thresholds', { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (sensor, field, value) => {
    setThresholds(prev => ({
      ...prev,
      [sensor]: {
        ...prev[sensor],
        [field]: parseFloat(value) || 0
      }
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Thresholds - {plotName}</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ pt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Set alert thresholds for sensor values. Alerts will be triggered when values go outside these ranges.
            </Typography>
            
            <Grid container spacing={3}>
              {/* Temperature */}
              <Grid item xs={12} md={4}>
                <Box>
                  <Typography variant="h6" gutterBottom color="error.main">
                    Temperature (°C)
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        label="Min"
                        type="number"
                        value={thresholds.temperature.min}
                        onChange={(e) => handleChange('temperature', 'min', e.target.value)}
                        fullWidth
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Max"
                        type="number"
                        value={thresholds.temperature.max}
                        onChange={(e) => handleChange('temperature', 'max', e.target.value)}
                        fullWidth
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Grid>

              {/* Humidity */}
              <Grid item xs={12} md={4}>
                <Box>
                  <Typography variant="h6" gutterBottom color="info.main">
                    Humidity (%)
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        label="Min"
                        type="number"
                        value={thresholds.humidity.min}
                        onChange={(e) => handleChange('humidity', 'min', e.target.value)}
                        fullWidth
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Max"
                        type="number"
                        value={thresholds.humidity.max}
                        onChange={(e) => handleChange('humidity', 'max', e.target.value)}
                        fullWidth
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Grid>

              {/* Soil Moisture */}
              <Grid item xs={12} md={4}>
                <Box>
                  <Typography variant="h6" gutterBottom color="warning.main">
                    Soil Moisture (%)
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        label="Min"
                        type="number"
                        value={thresholds.soil_moisture.min}
                        onChange={(e) => handleChange('soil_moisture', 'min', e.target.value)}
                        fullWidth
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Max"
                        type="number"
                        value={thresholds.soil_moisture.max}
                        onChange={(e) => handleChange('soil_moisture', 'max', e.target.value)}
                        fullWidth
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          disabled={saving}
        >
          {saving ? <CircularProgress size={20} /> : 'Save Thresholds'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ThresholdEditModal;
