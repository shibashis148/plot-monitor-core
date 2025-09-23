import api from './api';

export const plotService = {
  // Get all plots with optional filters
  getPlots: async (filters = {}) => {
    try {
      const response = await api.get('/plots', { params: filters });
      return response;
    } catch (error) {
      console.error('Error fetching plots:', error);
      throw error;
    }
  },

  // Get plot by ID
  getPlot: async (plotId) => {
    try {
      const response = await api.get(`/plots/${plotId}`);
      return response;
    } catch (error) {
      console.error('Error fetching plot:', error);
      throw error;
    }
  },

  // Get plots by status
  getPlotsByStatus: async (status) => {
    try {
      const response = await api.get(`/plots/status/${status}`);
      return response;
    } catch (error) {
      console.error('Error fetching plots by status:', error);
      throw error;
    }
  },

  // Get plots by crop type
  getPlotsByCropType: async (cropType) => {
    try {
      const response = await api.get(`/plots/crop/${cropType}`);
      return response;
    } catch (error) {
      console.error('Error fetching plots by crop type:', error);
      throw error;
    }
  },

  // Create new plot
  createPlot: async (plotData) => {
    try {
      const response = await api.post('/plots', plotData);
      return response;
    } catch (error) {
      console.error('Error creating plot:', error);
      throw error;
    }
  },

  // Update plot
  updatePlot: async (plotId, plotData) => {
    try {
      const response = await api.put(`/plots/${plotId}`, plotData);
      return response;
    } catch (error) {
      console.error('Error updating plot:', error);
      throw error;
    }
  },

  // Delete plot
  deletePlot: async (plotId) => {
    try {
      const response = await api.delete(`/plots/${plotId}`);
      return response;
    } catch (error) {
      console.error('Error deleting plot:', error);
      throw error;
    }
  },

  // Update plot thresholds
  updateThresholds: async (plotId, thresholds) => {
    try {
      const response = await api.put(`/plots/${plotId}/thresholds`, thresholds);
      return response;
    } catch (error) {
      console.error('Error updating plot thresholds:', error);
      throw error;
    }
  },
};
