import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Grid,
  Chip,
  IconButton,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Refresh as RefreshIcon,
  Thermostat as TemperatureIcon,
  WaterDrop as HumidityIcon,
  Grass as SoilIcon,
} from '@mui/icons-material';
import { LineChart } from '@mui/x-charts/LineChart';
import { useSnackbar } from 'notistack';
import { api } from '../services/api';

function SensorData() {
  const { plotId } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  
  const [plot, setPlot] = useState(null);
  const [sensorData, setSensorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (plotId) {
      fetchPlotAndSensorData();
    }
  }, [plotId]);

  const fetchPlotAndSensorData = async () => {
    try {
      setLoading(true);
      const [plotResponse, sensorResponse] = await Promise.all([
        api.get(`/plots/${plotId}`),
        api.get(`/sensor-data/plot/${plotId}/last24hours`)
      ]);
      setPlot(plotResponse.data.data);
      setSensorData(sensorResponse.data.data || []);
    } catch (err) {
      setError('Failed to fetch plot and sensor data');
      enqueueSnackbar('Failed to load sensor data', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchPlotAndSensorData();
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
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

  if (!plot) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Plot not found
      </Alert>
    );
  }

  // Prepare chart data
  const chartData = {
    timestamps: sensorData.map(item => formatTime(item.timestamp)),
    temperature: sensorData.map(item => parseFloat(item.temperature) || 0),
    humidity: sensorData.map(item => parseFloat(item.humidity) || 0),
    soilMoisture: sensorData.map(item => parseFloat(item.soil_moisture) || 0),
  };

  const latestData = sensorData[sensorData.length - 1];

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Box display="flex" alignItems="center">
          <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h4" fontWeight={600}>
              {plot.name} - Sensor Data
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Last 24 hours
            </Typography>
          </Box>
        </Box>
        <Box display="flex" alignItems="center" gap={2}>
          <Chip
            label={plot.status}
            color={getStatusColor(plot.status)}
            size="small"
          />
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Current Values */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Current Values
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Box display="flex" alignItems="center" p={2} bgcolor="background.default" borderRadius={2}>
                    <TemperatureIcon sx={{ mr: 2, color: 'error.main', fontSize: 32 }} />
                    <Box>
                      <Typography variant="h4" fontWeight={600} color="error.main">
                        {latestData?.temperature?.toFixed(1) || 'N/A'}°C
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Temperature
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box display="flex" alignItems="center" p={2} bgcolor="background.default" borderRadius={2}>
                    <HumidityIcon sx={{ mr: 2, color: 'info.main', fontSize: 32 }} />
                    <Box>
                      <Typography variant="h4" fontWeight={600} color="info.main">
                        {latestData?.humidity?.toFixed(1) || 'N/A'}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Humidity
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box display="flex" alignItems="center" p={2} bgcolor="background.default" borderRadius={2}>
                    <SoilIcon sx={{ mr: 2, color: 'warning.main', fontSize: 32 }} />
                    <Box>
                      <Typography variant="h4" fontWeight={600} color="warning.main">
                        {latestData?.soil_moisture?.toFixed(1) || 'N/A'}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Soil Moisture
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Chart */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sensor Data Trends (Last 24 Hours)
              </Typography>
              {sensorData.length > 0 ? (
                <Box sx={{ height: 400 }}>
                  <LineChart
                    xAxis={[{
                      data: chartData.timestamps,
                      scaleType: 'point',
                    }]}
                    series={[
                      {
                        data: chartData.temperature,
                        label: 'Temperature (°C)',
                        color: '#f44336',
                      },
                      {
                        data: chartData.humidity,
                        label: 'Humidity (%)',
                        color: '#2196f3',
                      },
                      {
                        data: chartData.soilMoisture,
                        label: 'Soil Moisture (%)',
                        color: '#ff9800',
                      },
                    ]}
                    height={400}
                    margin={{ left: 60, right: 30, top: 20, bottom: 60 }}
                    grid={{ vertical: true, horizontal: true }}
                  />
                </Box>
              ) : (
                <Box display="flex" justifyContent="center" alignItems="center" height={400}>
                  <Typography variant="body1" color="text.secondary">
                    No sensor data available for the last 24 hours
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default SensorData;