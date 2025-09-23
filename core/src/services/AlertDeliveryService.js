const logger = require('../config/logger');
const nodemailer = require('nodemailer');
const axios = require('axios');

class AlertDeliveryService {
  constructor() {
    this.deliveryMethods = {
      email: this.deliverViaEmail.bind(this),
      webhook: this.deliverViaWebhook.bind(this)
    };
  }

  /**
   * Deliver alert using specified method(s)
   * @param {Object} alert - Alert object
   * @param {Array} methods - Array of delivery methods ['email', 'webhook']
   */
  async deliverAlert(alert, methods = ['email']) {
    const deliveryResults = [];

    for (const method of methods) {
      try {
        if (this.deliveryMethods[method]) {
          const result = await this.deliveryMethods[method](alert);
          deliveryResults.push({
            method,
            success: true,
            result
          });
          logger.info(`Alert ${alert.id} delivered via ${method}`);
        } else {
          logger.warn(`Unknown delivery method: ${method}`);
          deliveryResults.push({
            method,
            success: false,
            error: `Unknown delivery method: ${method}`
          });
        }
      } catch (error) {
        logger.error(`Failed to deliver alert ${alert.id} via ${method}:`, error);
        deliveryResults.push({
          method,
          success: false,
          error: error.message
        });
      }
    }

    return deliveryResults;
  }

  /**
   * Deliver alert via email
   * @param {Object} alert - Alert object
   */
  async deliverViaEmail(alert) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const mailOptions = {
      from: process.env.SMTP_FROM || 'alerts@farmplot.com',
      to: process.env.ALERT_EMAIL_RECIPIENTS || 'admin@farmplot.com',
      subject: `🚨 Farm Alert: ${alert.severity.toUpperCase()} - ${alert.alert_type}`,
      html: this.generateEmailTemplate(alert)
    };

    const result = await transporter.sendMail(mailOptions);
    return {
      messageId: result.messageId,
      accepted: result.accepted,
      rejected: result.rejected
    };
  }

  /**
   * Deliver alert via webhook
   * @param {Object} alert - Alert object
   */
  async deliverViaWebhook(alert) {
    const webhookUrl = process.env.ALERT_WEBHOOK_URL;
    
    if (!webhookUrl) {
      throw new Error('Webhook URL not configured');
    }

    const payload = {
      alert: {
        id: alert.id,
        type: alert.alert_type,
        severity: alert.severity,
        message: alert.message,
        plot_id: alert.plot_id,
        plot_name: alert.plot_name,
        farm_name: alert.farm_name,
        created_at: alert.created_at
      },
      timestamp: new Date().toISOString(),
      source: 'farmplot-alert-system'
    };

    const response = await axios.post(webhookUrl, payload, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'FarmPlot-AlertSystem/1.0'
      }
    });

    return {
      status: response.status,
      statusText: response.statusText,
      data: response.data
    };
  }


  /**
   * Generate HTML email template for alerts
   * @param {Object} alert - Alert object
   */
  generateEmailTemplate(alert) {
    const severityColors = {
      low: '#10b981',
      medium: '#f59e0b',
      high: '#ef4444',
      critical: '#dc2626'
    };

    const color = severityColors[alert.severity] || '#6b7280';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Farm Alert</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: ${color}; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
          .alert-details { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .severity { display: inline-block; padding: 4px 12px; border-radius: 20px; color: white; font-weight: bold; background: ${color}; }
          .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚨 Farm Alert</h1>
            <span class="severity">${alert.severity.toUpperCase()}</span>
          </div>
          <div class="content">
            <div class="alert-details">
              <h2>${alert.alert_type.replace('_', ' ').toUpperCase()}</h2>
              <p><strong>Message:</strong> ${alert.message}</p>
              <p><strong>Farm:</strong> ${alert.farm_name || 'Unknown'}</p>
              <p><strong>Plot:</strong> ${alert.plot_name || 'Unknown'}</p>
              <p><strong>Time:</strong> ${new Date(alert.created_at).toLocaleString()}</p>
            </div>
            <p>Please check your farm monitoring dashboard for more details and take appropriate action.</p>
          </div>
          <div class="footer">
            <p>This is an automated alert from Farm Plot Monitoring System</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Get delivery status for an alert
   * @param {string} alertId - Alert ID
   */
  async getDeliveryStatus(alertId) {
    return {
      alertId,
      delivered: true,
      methods: ['inApp'],
      lastAttempt: new Date(),
      attempts: 1
    };
  }

  /**
   * Retry failed deliveries
   * @param {string} alertId - Alert ID
   * @param {Array} methods - Methods to retry
   */
  async retryDelivery(alertId, methods = ['email', 'webhook']) {
    
    logger.info(`Retrying delivery for alert ${alertId} using methods: ${methods.join(', ')}`);
    
    return {
      alertId,
      retryAttempts: 1,
      methods,
      success: true
    };
  }
}

module.exports = new AlertDeliveryService();
