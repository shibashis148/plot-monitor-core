import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  GridView as PlotIcon,
  Warning as WarningIcon,
  Error as CriticalIcon,
  CheckCircle as HealthyIcon,
  ShowChart as ChartIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { api } from '../services/api';
import ThresholdEditModal from '../components/ThresholdEditModal';
import { formatDate } from '../utils/helpers';

function Plots() {
  const { farmId } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  
  const [farm, setFarm] = useState(null);
  const [plots, setPlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [thresholdModalOpen, setThresholdModalOpen] = useState(false);
  const [selectedPlot, setSelectedPlot] = useState(null);

  useEffect(() => {
    if (farmId) {
      fetchFarmAndPlots();
    }
  }, [farmId]);

  const fetchFarmAndPlots = async () => {
    try {
      setLoading(true);
      const [farmResponse, plotsResponse] = await Promise.all([
        api.get(`/farms/${farmId}`),
        api.get(`/farms/${farmId}/plots`)
      ]);
      setFarm(farmResponse.data.data);
      setPlots(plotsResponse.data.data || []);
    } catch (err) {
      setError('Failed to fetch farm and plots data');
      enqueueSnackbar('Failed to load farm data', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'success';
      case 'warning':
        return 'warning';
      case 'critical':
        return 'error';
      default:
        return 'default';
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

  const handleEditThresholds = (plot) => {
    setSelectedPlot(plot);
    setThresholdModalOpen(true);
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

  if (!farm) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Farm not found
      </Alert>
    );
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={() => navigate('/farms')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h4" fontWeight={600}>
            {farm.name} - Plots
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {farm.location?.coordinates ? 
              `${farm.location.coordinates[1].toFixed(4)}, ${farm.location.coordinates[0].toFixed(4)}` : 
              'Location not available'
            }
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {plots.map((plot) => (
          <Grid item xs={12} sm={6} md={4} key={plot.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Box display="flex" alignItems="center">
                    <PlotIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" fontWeight={600}>
                      {plot.name}
                    </Typography>
                  </Box>
                  <Chip
                    icon={getStatusIcon(plot.status)}
                    label={plot.status}
                    color={getStatusColor(plot.status)}
                    size="small"
                  />
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Plot ID: {plot.id}
                </Typography>

                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <Box textAlign="center">
                      <Typography variant="h6" fontWeight={600} color="primary.main">
                        {plot.crop_type || 'N/A'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Crop Type
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign="center">
                      <Typography variant="h6" fontWeight={600} color="info.main">
                        {plot.area || 'N/A'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Area (sq m)
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Box display="flex" gap={1} mb={2}>
                  <Button
                    variant="outlined"
                    startIcon={<ChartIcon />}
                    onClick={() => navigate(`/sensor-data/${plot.id}`)}
                    sx={{ flex: 1 }}
                  >
                    View Chart
                  </Button>
                  <Tooltip title="Edit Thresholds">
                    <IconButton
                      onClick={() => handleEditThresholds(plot)}
                      color="primary"
                    >
                      <SettingsIcon />
                    </IconButton>
                  </Tooltip>
                </Box>

                <Typography variant="caption" color="text.secondary">
                  Last updated: {formatDate(plot.updated_at || plot.created_at)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {plots.length === 0 && (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <PlotIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No plots found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Plots will appear here once they are added to this farm.
            </Typography>
          </CardContent>
        </Card>
      )}

      <ThresholdEditModal
        open={thresholdModalOpen}
        onClose={() => {
          setThresholdModalOpen(false);
          setSelectedPlot(null);
        }}
        plotId={selectedPlot?.id}
        plotName={selectedPlot?.name}
      />
    </Box>
  );
}

export default Plots;