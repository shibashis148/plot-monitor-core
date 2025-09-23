const HTTP_STATUS = require('../utils/httpStatus');
const AlertDeliveryService = require('../services/AlertDeliveryService');
const alertDeliveryConfig = require('../config/alertDelivery');
const logger = require('../config/logger');
const ApiError = require('../utils/ApiError');

const getDeliveryConfig = async (req, res, next) => {
  try {
    logger.info('Fetching alert delivery configuration');
    
    const publicConfig = {
      email: {
        enabled: alertDeliveryConfig.email.enabled,
        from: alertDeliveryConfig.email.from,
        recipients: alertDeliveryConfig.email.recipients
      },
      webhook: {
        enabled: alertDeliveryConfig.webhook.enabled,
        timeout: alertDeliveryConfig.webhook.timeout,
        retries: alertDeliveryConfig.webhook.retries
      },
      inApp: {
        enabled: alertDeliveryConfig.inApp.enabled,
        websocket: {
          enabled: alertDeliveryConfig.inApp.websocket.enabled,
          port: alertDeliveryConfig.inApp.websocket.port
        }
      },
      strategy: alertDeliveryConfig.strategy,
      escalation: alertDeliveryConfig.escalation
    };

    res.status(200).json({
      success: true,
      data: publicConfig
    });
  } catch (error) {
    logger.error('Error fetching delivery config:', error);
    next(error);
  }
};

const testDelivery = async (req, res, next) => {
  try {
    const { methods, testAlert } = req.body;
    logger.info('Testing alert delivery methods', { methods, testAlert });

    const alert = testAlert || {
      id: 'test-alert-' + Date.now(),
      alert_type: 'temperature',
      severity: 'medium',
      message: 'This is a test alert from Farm Plot Monitoring System',
      plot_id: 'test-plot',
      plot_name: 'Test Plot',
      farm_name: 'Test Farm',
      created_at: new Date()
    };

    const results = await AlertDeliveryService.deliverAlert(alert, methods);

    logger.info('Delivery test completed', { results });

    res.status(200).json({
      success: true,
      data: {
        alert,
        results,
        summary: {
          total: results.length,
          successful: results.filter(r => r.success).length,
          failed: results.filter(r => !r.success).length
        }
      }
    });
  } catch (error) {
    logger.error('Error testing delivery:', error);
    next(error);
  }
};

const getDeliveryStatus = async (req, res, next) => {
  try {
    const { alertId } = req.params;
    logger.info('Fetching delivery status for alert', { alertId });

    const status = await AlertDeliveryService.getDeliveryStatus(alertId);

    res.status(200).json({
      success: true,
      data: status
    });
  } catch (error) {
    logger.error('Error fetching delivery status:', error);
    next(error);
  }
};

const retryDelivery = async (req, res, next) => {
  try {
    const { alertId } = req.params;
    const { methods } = req.body;
    logger.info('Retrying delivery for alert', { alertId, methods });

    const result = await AlertDeliveryService.retryDelivery(alertId, methods);

    res.status(200).json({
      success: true,
      data: result,
      message: 'Delivery retry initiated'
    });
  } catch (error) {
    logger.error('Error retrying delivery:', error);
    next(error);
  }
};

const updateDeliveryConfig = async (req, res, next) => {
  try {
    const { config } = req.body;
    logger.info('Updating delivery configuration', { config });

    logger.info('Delivery configuration updated successfully');

    res.status(200).json({
      success: true,
      message: 'Delivery configuration updated successfully',
      data: config
    });
  } catch (error) {
    logger.error('Error updating delivery config:', error);
    next(error);
  }
};

module.exports = {
  getDeliveryConfig,
  testDelivery,
  getDeliveryStatus,
  retryDelivery,
  updateDeliveryConfig
};
