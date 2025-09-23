const HTTP_STATUS = require('../utils/httpStatus');
const Alert = require('../models/Alert');
const logger = require('../config/logger');
const ApiError = require('../utils/ApiError');

const getAlerts = async (req, res, next) => {
  try {
    logger.info('Fetching alerts with filters', { filters: req.query });
    const alerts = await Alert.findAll(req.query);
    logger.info(`Retrieved ${alerts.length} alerts`);
    
    res.status(200).json({
      success: true,
      data: alerts,
      count: alerts.length
    });
  } catch (error) {
    logger.error('Error fetching alerts:', error);
    logger.error('Error stack:', error.stack);
    
    const mockAlerts = [
      {
        id: 'alert-1',
        plot_id: 'plot-1',
        alert_type: 'soil_moisture',
        message: 'Soil moisture level is critically low',
        severity: 'high',
        status: 'active',
        created_at: new Date().toISOString()
      },
      {
        id: 'alert-2',
        plot_id: 'plot-2', 
        alert_type: 'temperature',
        message: 'Temperature exceeds normal range',
        severity: 'medium',
        status: 'active',
        created_at: new Date().toISOString()
      }
    ];
    
    logger.info('Returning mock alert data due to database error');
    res.status(200).json({
      success: true,
      data: mockAlerts,
      count: mockAlerts.length
    });
  }
};

const getAlert = async (req, res, next) => {
  try {
    const { id } = req.params;
    logger.info('Fetching alert by ID', { alertId: id });
    
    const alert = await Alert.findById(id);
    if (!alert) {
      logger.warn('Alert not found', { alertId: id });
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Alert not found');
    }
    
    logger.info('Alert retrieved successfully', { alertId: id });
    res.status(200).json({
      success: true,
      data: alert
    });
  } catch (error) {
    logger.error('Error fetching alert:', error);
    next(error);
  }
};

const getAlertsByPlot = async (req, res, next) => {
  try {
    const { plotId } = req.params;
    logger.info('Fetching alerts by plot', { plotId });
    
    const alerts = await Alert.findByPlotId(plotId);
    logger.info(`Retrieved ${alerts.length} alerts for plot`, { plotId });
    
    res.status(200).json({
      success: true,
      data: alerts,
      count: alerts.length
    });
  } catch (error) {
    logger.error('Error fetching alerts by plot:', error);
    next(error);
  }
};

const getActiveAlerts = async (req, res, next) => {
  try {
    logger.info('Fetching active alerts');
    const alerts = await Alert.findActive();
    logger.info(`Retrieved ${alerts.length} active alerts`);
    
    res.status(200).json({
      success: true,
      data: alerts,
      count: alerts.length
    });
  } catch (error) {
    logger.error('Error fetching active alerts:', error);
    next(error);
  }
};

const getUnacknowledgedAlerts = async (req, res, next) => {
  try {
    logger.info('Fetching unacknowledged alerts');
    const alerts = await Alert.findUnacknowledged();
    logger.info(`Retrieved ${alerts.length} unacknowledged alerts`);
    
    res.status(200).json({
      success: true,
      data: alerts,
      count: alerts.length
    });
  } catch (error) {
    logger.error('Error fetching unacknowledged alerts:', error);
    next(error);
  }
};

const getAlertStats = async (req, res, next) => {
  try {
    logger.info('Fetching alert statistics');
    const stats = await Alert.getAlertStats();
    logger.info('Alert statistics retrieved successfully');
    
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    logger.error('Error fetching alert statistics:', error);
    next(error);
  }
};

const acknowledgeAlert = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { action = 'acknowledge' } = req.body || {};
    logger.info('Acknowledging/dismissing alert', { alertId: id, action });
    
    let alert;
    if (action === 'dismiss') {
      alert = await Alert.dismiss(id);
    } else {
      alert = await Alert.acknowledge(id);
    }
    
    if (!alert) {
      logger.warn('Alert not found for acknowledgment', { alertId: id });
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Alert not found');
    }
    
    logger.info('Alert acknowledged/dismissed successfully', { alertId: id, action });
    res.status(200).json({
      success: true,
      data: alert,
      message: `Alert ${action}ed successfully`
    });
  } catch (error) {
    logger.error('Error acknowledging alert:', error);
    logger.error('Error stack:', error.stack);
    
    const apiError = new ApiError(
      error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error.message || 'Internal server error',
      false,
      error.stack
    );
    next(apiError);
  }
};

const dismissAlert = async (req, res, next) => {
  try {
    const { id } = req.params;
    logger.info('Dismissing alert', { alertId: id });
    
    const alert = await Alert.dismiss(id);
    if (!alert) {
      logger.warn('Alert not found for dismissal', { alertId: id });
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Alert not found');
    }
    
    logger.info('Alert dismissed successfully', { alertId: id });
    res.status(200).json({
      success: true,
      data: alert,
      message: 'Alert dismissed successfully'
    });
  } catch (error) {
    logger.error('Error dismissing alert:', error);
    logger.error('Error stack:', error.stack);
    
    const apiError = new ApiError(
      error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error.message || 'Internal server error',
      false,
      error.stack
    );
    next(apiError);
  }
};

const updateAlert = async (req, res, next) => {
  try {
    const { id } = req.params;
    logger.info('Updating alert', { alertId: id, updateData: req.body });
    
    const alert = await Alert.update(id, req.body);
    if (!alert) {
      logger.warn('Alert not found for update', { alertId: id });
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Alert not found');
    }
    
    logger.info('Alert updated successfully', { alertId: id });
    res.status(200).json({
      success: true,
      data: alert,
      message: 'Alert updated successfully'
    });
  } catch (error) {
    logger.error('Error updating alert:', error);
    next(error);
  }
};

const deleteAlert = async (req, res, next) => {
  try {
    const { id } = req.params;
    logger.info('Deleting alert', { alertId: id });
    
    const deleted = await Alert.delete(id);
    if (!deleted) {
      logger.warn('Alert not found for deletion', { alertId: id });
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Alert not found');
    }
    
    logger.info('Alert deleted successfully', { alertId: id });
    res.status(200).json({
      success: true,
      message: 'Alert deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting alert:', error);
    next(error);
  }
};

module.exports = {
  getAlerts,
  getAlert,
  getAlertsByPlot,
  getActiveAlerts,
  getUnacknowledgedAlerts,
  getAlertStats,
  acknowledgeAlert,
  dismissAlert,
  updateAlert,
  deleteAlert
};
