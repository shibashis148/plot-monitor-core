import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { SnackbarProvider } from 'notistack';
import theme from './theme/theme';
import { AppProvider } from './contexts/AppContext';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Farms from './pages/Farms';
import Plots from './pages/Plots';
import SensorData from './pages/SensorData';
import Alerts from './pages/Alerts';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={3}>
        <AppProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="farms" element={<Farms />} />
                <Route path="plots/:farmId" element={<Plots />} />
                <Route path="sensor-data/:plotId" element={<SensorData />} />
                <Route path="alerts" element={<Alerts />} />
              </Route>
            </Routes>
          </Router>
        </AppProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;