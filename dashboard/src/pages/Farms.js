import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Agriculture as FarmIcon,
  GridView as PlotIcon,
  Warning as WarningIcon,
  Error as CriticalIcon,
  CheckCircle as HealthyIcon,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { api } from '../services/api';

function Farms() {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchFarms();
  }, []);

  const fetchFarms = async () => {
    try {
      setLoading(true);
      const response = await api.get('/farms');
      setFarms(response.data.data || []);
    } catch (err) {
      setError('Failed to fetch farms data');
      enqueueSnackbar('Failed to load farms data', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return <HealthyIcon />;
      case 'warning':
        return <WarningIcon />;
      case 'critical':
        return <CriticalIcon />;
      default:
        return <PlotIcon />;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight={600}>
        Farm Management
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Overview of all farms and their status
      </Typography>

      <Grid container spacing={3}>
        {farms.map((farm) => (
          <Grid item xs={12} sm={6} md={4} key={farm.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                },
              }}
              onClick={() => navigate(`/plots/${farm.id}`)}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <FarmIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" fontWeight={600}>
                    {farm.name}
                  </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {farm.location?.coordinates ? 
                    `${farm.location.coordinates[1].toFixed(4)}, ${farm.location.coordinates[0].toFixed(4)}` : 
                    'Location not available'
                  }
                </Typography>

                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <Box textAlign="center">
                      <Typography variant="h4" fontWeight={600} color="primary.main">
                        {farm.plot_count || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Plots
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign="center">
                      <Typography variant="h4" fontWeight={600} color="warning.main">
                        {farm.active_alerts || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Active Alerts
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    Plot Status:
                  </Typography>
                  <Box display="flex" gap={1}>
                    <Chip
                      icon={getStatusIcon('healthy')}
                      label={`${farm.healthy_plots || 0}`}
                      size="small"
                      color="success"
                      variant="outlined"
                    />
                    <Chip
                      icon={getStatusIcon('warning')}
                      label={`${farm.warning_plots || 0}`}
                      size="small"
                      color="warning"
                      variant="outlined"
                    />
                    <Chip
                      icon={getStatusIcon('critical')}
                      label={`${farm.critical_plots || 0}`}
                      size="small"
                      color="error"
                      variant="outlined"
                    />
                  </Box>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/plots/${farm.id}`);
                  }}
                >
                  View Plots
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {farms.length === 0 && (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <FarmIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No farms found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Farms will appear here once they are added to the system.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

export default Farms;