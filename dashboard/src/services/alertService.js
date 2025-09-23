import api from './api';

export const alertService = {
  // Get all alerts with optional filters
  getAlerts: async (filters = {}) => {
    try {
      const response = await api.get('/alerts', { params: filters });
      return response;
    } catch (error) {
      console.error('Error fetching alerts:', error);
      throw error;
    }
  },

  // Get alert by ID
  getAlert: async (alertId) => {
    try {
      const response = await api.get(`/alerts/${alertId}`);
      return response;
    } catch (error) {
      console.error('Error fetching alert:', error);
      throw error;
    }
  },

  // Get alerts for a specific plot
  getAlertsByPlot: async (plotId) => {
    try {
      const response = await api.get(`/alerts/plot/${plotId}`);
      return response;
    } catch (error) {
      console.error('Error fetching alerts by plot:', error);
      throw error;
    }
  },

  // Get all active alerts
  getActiveAlerts: async () => {
    try {
      const response = await api.get('/alerts/active');
      return response;
    } catch (error) {
      console.error('Error fetching active alerts:', error);
      throw error;
    }
  },

  // Get all unacknowledged alerts
  getUnacknowledgedAlerts: async () => {
    try {
      const response = await api.get('/alerts/unacknowledged');
      return response;
    } catch (error) {
      console.error('Error fetching unacknowledged alerts:', error);
      throw error;
    }
  },

  // Get alert statistics
  getAlertStats: async () => {
    try {
      const response = await api.get('/alerts/stats');
      return response;
    } catch (error) {
      console.error('Error fetching alert statistics:', error);
      throw error;
    }
  },

  // Acknowledge alert
  acknowledgeAlert: async (alertId) => {
    try {
      const response = await api.post(`/alerts/${alertId}/acknowledge`, { action: 'acknowledge' });
      return response;
    } catch (error) {
      console.error('Error acknowledging alert:', error);
      throw error;
    }
  },

  // Dismiss alert
  dismissAlert: async (alertId) => {
    try {
      const response = await api.post(`/alerts/${alertId}/dismiss`);
      return response;
    } catch (error) {
      console.error('Error dismissing alert:', error);
      throw error;
    }
  },

  // Update alert
  updateAlert: async (alertId, alertData) => {
    try {
      const response = await api.put(`/alerts/${alertId}`, alertData);
      return response;
    } catch (error) {
      console.error('Error updating alert:', error);
      throw error;
    }
  },

  // Delete alert
  deleteAlert: async (alertId) => {
    try {
      const response = await api.delete(`/alerts/${alertId}`);
      return response;
    } catch (error) {
      console.error('Error deleting alert:', error);
      throw error;
    }
  },
};
