import api from './api';

export const farmService = {
  // Get all farms with plot counts
  getFarms: async () => {
    try {
      const response = await api.get('/farms');
      return response;
    } catch (error) {
      console.error('Error fetching farms:', error);
      throw error;
    }
  },

  // Get farm by ID
  getFarm: async (farmId) => {
    try {
      const response = await api.get(`/farms/${farmId}`);
      return response;
    } catch (error) {
      console.error('Error fetching farm:', error);
      throw error;
    }
  },

  // Get plots for a specific farm
  getFarmPlots: async (farmId) => {
    try {
      const response = await api.get(`/farms/${farmId}/plots`);
      return response;
    } catch (error) {
      console.error('Error fetching farm plots:', error);
      throw error;
    }
  },

  // Create new farm
  createFarm: async (farmData) => {
    try {
      const response = await api.post('/farms', farmData);
      return response;
    } catch (error) {
      console.error('Error creating farm:', error);
      throw error;
    }
  },

  // Update farm
  updateFarm: async (farmId, farmData) => {
    try {
      const response = await api.put(`/farms/${farmId}`, farmData);
      return response;
    } catch (error) {
      console.error('Error updating farm:', error);
      throw error;
    }
  },

  // Delete farm
  deleteFarm: async (farmId) => {
    try {
      const response = await api.delete(`/farms/${farmId}`);
      return response;
    } catch (error) {
      console.error('Error deleting farm:', error);
      throw error;
    }
  },
};
