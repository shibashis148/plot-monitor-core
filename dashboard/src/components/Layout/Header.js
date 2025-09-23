import React from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Typography, Chip } from '@mui/material';
import { useSnackbar } from 'notistack';

function Header() {
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard';
      case '/farms':
        return 'Farm Overview';
      case '/alerts':
        return 'Alert Management';
      default:
        if (location.pathname.startsWith('/plots/')) {
          return 'Plot List';
        }
        if (location.pathname.startsWith('/sensor-data/')) {
          return 'Sensor Data';
        }
        return 'FarmPlot';
    }
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
      <Typography variant="h5" component="h1" fontWeight={600}>
        {getPageTitle()}
      </Typography>
      <Box display="flex" alignItems="center" gap={2}>
        <Chip
          label="Live"
          color="success"
          size="small"
          sx={{ fontWeight: 500 }}
        />
      </Box>
    </Box>
  );
}

export default Header;