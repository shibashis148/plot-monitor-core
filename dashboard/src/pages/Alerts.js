import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Grid,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  CheckCircle as AcknowledgeIcon,
  Cancel as DismissIcon,
  Warning as WarningIcon,
  Error as CriticalIcon,
  Info as InfoIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { useSnackbar } from 'notistack';
import { api } from '../services/api';
import { formatDate } from '../utils/helpers';

function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/alerts');
      setAlerts(response.data.data || []);
    } catch (err) {
      setError('Failed to fetch alerts data');
      enqueueSnackbar('Failed to load alerts data', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAcknowledge = async (alertId) => {
    try {
      setActionLoading(true);
      await api.put(`/alerts/${alertId}`, { status: 'acknowledged' });
      enqueueSnackbar('Alert acknowledged successfully', { variant: 'success' });
      fetchAlerts();
    } catch (err) {
      enqueueSnackbar('Failed to acknowledge alert', { variant: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDismiss = async (alertId) => {
    try {
      setActionLoading(true);
      await api.put(`/alerts/${alertId}`, { status: 'dismissed' });
      enqueueSnackbar('Alert dismissed successfully', { variant: 'success' });
      fetchAlerts();
    } catch (err) {
      enqueueSnackbar('Failed to dismiss alert', { variant: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewDetails = (alert) => {
    setSelectedAlert(alert);
    setDialogOpen(true);
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return <CriticalIcon color="error" />;
      case 'high':
        return <WarningIcon color="warning" />;
      case 'medium':
        return <InfoIcon color="info" />;
      default:
        return <InfoIcon color="action" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'error';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'error';
      case 'acknowledged':
        return 'warning';
      case 'dismissed':
        return 'default';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      field: 'severity',
      headerName: 'Severity',
      width: 120,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1}>
          {getSeverityIcon(params.value)}
          <Chip
            label={params.value}
            color={getSeverityColor(params.value)}
            size="small"
          />
        </Box>
      ),
    },
    {
      field: 'alert_type',
      headerName: 'Type',
      width: 120,
    },
    {
      field: 'message',
      headerName: 'Message',
      width: 300,
      renderCell: (params) => (
        <Typography variant="body2" noWrap>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'plot_name',
      headerName: 'Plot',
      width: 150,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getStatusColor(params.value)}
          size="small"
        />
      ),
    },
    {
      field: 'created_at',
      headerName: 'Created',
      width: 150,
      renderCell: (params) => (
        <Typography variant="body2">
          {formatDate(params.value)}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <Tooltip title="View Details">
            <IconButton
              size="small"
              onClick={() => handleViewDetails(params.row)}
            >
              <ViewIcon />
            </IconButton>
          </Tooltip>
          {params.row.status === 'active' && (
            <>
              <Tooltip title="Acknowledge">
                <IconButton
                  size="small"
                  color="success"
                  onClick={() => handleAcknowledge(params.row.id)}
                  disabled={actionLoading}
                >
                  <AcknowledgeIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Dismiss">
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDismiss(params.row.id)}
                  disabled={actionLoading}
                >
                  <DismissIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
      ),
    },
  ];

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
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight={600}>
            Alert Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Monitor and manage system alerts
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchAlerts}
        >
          Refresh
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <CriticalIcon color="error" />
                <Box>
                  <Typography variant="h4" fontWeight={600} color="error.main">
                    {alerts.filter(a => a.status === 'active').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Alerts
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <AcknowledgeIcon color="warning" />
                <Box>
                  <Typography variant="h4" fontWeight={600} color="warning.main">
                    {alerts.filter(a => a.status === 'acknowledged').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Acknowledged
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <DismissIcon color="action" />
                <Box>
                  <Typography variant="h4" fontWeight={600} color="text.secondary">
                    {alerts.filter(a => a.status === 'dismissed').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Dismissed
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <InfoIcon color="info" />
                <Box>
                  <Typography variant="h4" fontWeight={600} color="info.main">
                    {alerts.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Alerts
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            All Alerts
          </Typography>
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={alerts}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
              disableSelectionOnClick
              loading={loading}
              sx={{
                border: 'none',
                '& .MuiDataGrid-cell': {
                  borderBottom: '1px solid #f0f0f0',
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Alert Details Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Alert Details</DialogTitle>
        <DialogContent>
          {selectedAlert && (
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Alert Type"
                    value={selectedAlert.alert_type}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Severity"
                    value={selectedAlert.severity}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Status"
                    value={selectedAlert.status}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Plot"
                    value={selectedAlert.plot_name}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Message"
                    value={selectedAlert.message}
                    fullWidth
                    multiline
                    rows={3}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Created At"
                    value={formatDate(selectedAlert.created_at)}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Updated At"
                    value={selectedAlert.updated_at ? formatDate(selectedAlert.updated_at) : 'Not updated'}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Alerts;