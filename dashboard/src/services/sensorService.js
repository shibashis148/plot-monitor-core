import api from './api';

export const sensorService = {
  // Submit sensor data
  submitSensorData: async (sensorData) => {
    try {
      const response = await api.post('/sensor-data', sensorData);
      return response;
    } catch (error) {
      console.error('Error submitting sensor data:', error);
      throw error;
    }
  },

  // Get all sensor data with optional filters
  getAllSensorData: async (filters = {}) => {
    try {
      const response = await api.get('/sensor-data', { params: filters });
      return response;
    } catch (error) {
      console.error('Error fetching sensor data:', error);
      throw error;
    }
  },

  // Get sensor data by ID
  getSensorData: async (sensorDataId) => {
    try {
      const response = await api.get(`/sensor-data/${sensorDataId}`);
      return response;
    } catch (error) {
      console.error('Error fetching sensor data by ID:', error);
      throw error;
    }
  },

  // Get sensor data for a specific plot
  getSensorDataByPlot: async (plotId, limit = 100) => {
    try {
      const response = await api.get(`/sensor-data/plot/${plotId}`, {
        params: { limit }
      });
      return response;
    } catch (error) {
      console.error('Error fetching sensor data by plot:', error);
      throw error;
    }
  },

  // Get last 24 hours of sensor data for a plot
  getSensorDataLast24Hours: async (plotId) => {
    try {
      const response = await api.get(`/sensor-data/plot/${plotId}/last24hours`);
      return response;
    } catch (error) {
      console.error('Error fetching last 24 hours sensor data:', error);
      throw error;
    }
  },

  // Get latest sensor reading for a plot
  getLatestSensorData: async (plotId) => {
    try {
      const response = await api.get(`/sensor-data/plot/${plotId}/latest`);
      return response;
    } catch (error) {
      console.error('Error fetching latest sensor data:', error);
      throw error;
    }
  },

  // Get average sensor data for a plot
  getSensorDataAverage: async (plotId) => {
    try {
      const response = await api.get(`/sensor-data/plot/${plotId}/average`);
      return response;
    } catch (error) {
      console.error('Error fetching average sensor data:', error);
      throw error;
    }
  },

  // Get min/max sensor data for a plot
  getSensorDataMinMax: async (plotId) => {
    try {
      const response = await api.get(`/sensor-data/plot/${plotId}/minmax`);
      return response;
    } catch (error) {
      console.error('Error fetching min/max sensor data:', error);
      throw error;
    }
  },

  // Delete sensor data
  deleteSensorData: async (sensorDataId) => {
    try {
      const response = await api.delete(`/sensor-data/${sensorDataId}`);
      return response;
    } catch (error) {
      console.error('Error deleting sensor data:', error);
      throw error;
    }
  },
};
