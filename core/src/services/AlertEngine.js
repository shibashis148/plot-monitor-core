const Plot = require('../models/Plot');
const Alert = require('../models/Alert');
const AlertDeliveryService = require('./AlertDeliveryService');
const { getDatabase } = require('../config/database');
const logger = require('../config/logger');

class AlertEngine {
  /**
   * Process sensor data and generate alerts based on plot thresholds
   * @param {Object} sensorData - Sensor data object
   */
  static async processSensorData(sensorData) {
    try {
      const { plot_id, temperature, humidity, soil_moisture } = sensorData;
      
      const plot = await Plot.findById(plot_id);
      if (!plot) {
        logger.warn(`Plot not found for sensor data: ${plot_id}`);
        return;
      }

      const alertThresholds = plot.alert_thresholds || {};
      
      const alerts = [];
      if (alertThresholds.temperature) {
        const tempAlerts = this.checkTemperatureThresholds(
          temperature, 
          alertThresholds.temperature, 
          plot_id
        );
        alerts.push(...tempAlerts);
      }
      
      if (alertThresholds.humidity) {
        const humidityAlerts = this.checkHumidityThresholds(
          humidity, 
          alertThresholds.humidity, 
          plot_id
        );
        alerts.push(...humidityAlerts);
      }
      
      if (alertThresholds.soil_moisture) {
        const soilAlerts = this.checkSoilMoistureThresholds(
          soil_moisture, 
          alertThresholds.soil_moisture, 
          plot_id
        );
        alerts.push(...soilAlerts);
      }
      
      for (const alertData of alerts) {
        await this.createAlert(alertData, plot);
      }
      
      await this.updatePlotStatus(plot_id, alerts);
      
      logger.info(`Processed sensor data for plot ${plot_id}, generated ${alerts.length} alerts`);
      
    } catch (error) {
      logger.error('Error processing sensor data:', error);
      throw error;
    }
  }

  /**
   * Check temperature thresholds and generate alerts
   */
  static checkTemperatureThresholds(temperature, thresholds, plotId) {
    const alerts = [];
    
    if (thresholds.min && temperature < thresholds.min) {
      const severity = this.determineSeverity(temperature, thresholds.min, 'below');
      const condition = `below minimum threshold of ${thresholds.min}°C`;
      alerts.push({
        plot_id: plotId,
        alert_type: 'temperature',
        message: `Temperature is ${temperature}°C, ${condition}`,
        severity,
        condition: condition,
        threshold_value: thresholds.min,
        actual_value: temperature,
        direction: 'below'
      });
    }
    
    if (thresholds.max && temperature > thresholds.max) {
      const severity = this.determineSeverity(temperature, thresholds.max, 'above');
      const condition = `above maximum threshold of ${thresholds.max}°C`;
      alerts.push({
        plot_id: plotId,
        alert_type: 'temperature',
        message: `Temperature is ${temperature}°C, ${condition}`,
        severity,
        condition: condition,
        threshold_value: thresholds.max,
        actual_value: temperature,
        direction: 'above'
      });
    }
    
    return alerts;
  }

  /**
   * Check humidity thresholds and generate alerts
   */
  static checkHumidityThresholds(humidity, thresholds, plotId) {
    const alerts = [];
    
    if (thresholds.min && humidity < thresholds.min) {
      const severity = this.determineSeverity(humidity, thresholds.min, 'below');
      const condition = `below minimum threshold of ${thresholds.min}%`;
      alerts.push({
        plot_id: plotId,
        alert_type: 'humidity',
        message: `Humidity is ${humidity}%, ${condition}`,
        severity,
        condition: condition,
        threshold_value: thresholds.min,
        actual_value: humidity,
        direction: 'below'
      });
    }
    
    if (thresholds.max && humidity > thresholds.max) {
      const severity = this.determineSeverity(humidity, thresholds.max, 'above');
      const condition = `above maximum threshold of ${thresholds.max}%`;
      alerts.push({
        plot_id: plotId,
        alert_type: 'humidity',
        message: `Humidity is ${humidity}%, ${condition}`,
        severity,
        condition: condition,
        threshold_value: thresholds.max,
        actual_value: humidity,
        direction: 'above'
      });
    }
    
    return alerts;
  }

  /**
   * Check soil moisture thresholds and generate alerts
   */
  static checkSoilMoistureThresholds(soilMoisture, thresholds, plotId) {
    const alerts = [];
    
    if (thresholds.min && soilMoisture < thresholds.min) {
      const severity = this.determineSeverity(soilMoisture, thresholds.min, 'below');
      const condition = `below minimum threshold of ${thresholds.min}%`;
      alerts.push({
        plot_id: plotId,
        alert_type: 'soil_moisture',
        message: `Soil moisture is ${soilMoisture}%, ${condition}`,
        severity,
        condition: condition,
        threshold_value: thresholds.min,
        actual_value: soilMoisture,
        direction: 'below'
      });
    }
    
    if (thresholds.max && soilMoisture > thresholds.max) {
      const severity = this.determineSeverity(soilMoisture, thresholds.max, 'above');
      const condition = `above maximum threshold of ${thresholds.max}%`;
      alerts.push({
        plot_id: plotId,
        alert_type: 'soil_moisture',
        message: `Soil moisture is ${soilMoisture}%, ${condition}`,
        severity,
        condition: condition,
        threshold_value: thresholds.max,
        actual_value: soilMoisture,
        direction: 'above'
      });
    }
    
    return alerts;
  }

  /**
   * Determine alert severity based on how far the value is from threshold
   */
  static determineSeverity(value, threshold, direction) {
    const difference = Math.abs(value - threshold);
    const percentage = (difference / threshold) * 100;
    
    if (percentage >= 50) return 'critical';
    if (percentage >= 25) return 'high';
    if (percentage >= 10) return 'medium';
    return 'low';
  }

  /**
   * Create alert if it doesn't already exist (duplicate prevention)
   */
  static async createAlert(alertData, plot) {
    try {
      const existingAlert = await Alert.findDuplicateAlert(
        alertData.plot_id,
        alertData.alert_type,
        alertData.severity,
        alertData.condition
      );
      
      if (existingAlert) {
        logger.info(`Duplicate alert prevented for plot ${alertData.plot_id}, type ${alertData.alert_type}, condition: ${alertData.condition}`);
        return existingAlert;
      }
      
      const activeAlertForCondition = await Alert.findActiveAlertForCondition(
        alertData.plot_id,
        alertData.alert_type,
        alertData.condition
      );
      
      if (activeAlertForCondition) {
        logger.info(`Active alert already exists for same condition: ${alertData.condition} on plot ${alertData.plot_id}`);
        return activeAlertForCondition;
      }
      
      const alert = await Alert.create(alertData);
      await this.deliverAlert(alert, plot);
      
      logger.info(`Created alert: ${alertData.alert_type} - ${alertData.severity} for plot ${alertData.plot_id}, condition: ${alertData.condition}`);
      
      return alert;
      
    } catch (error) {
      logger.error('Error creating alert:', error);
      throw error;
    }
  }


  /**
   * Update plot status based on alert severity
   */
  static async updatePlotStatus(plotId, alerts) {
    try {
      if (alerts.length === 0) {
        await Plot.updateStatus(plotId, 'healthy');
        return;
      }
      
      const severities = alerts.map(alert => alert.severity);
      let status = 'healthy';
      
      if (severities.includes('critical')) {
        status = 'critical';
      } else if (severities.includes('high')) {
        status = 'warning';
      } else if (severities.includes('medium') || severities.includes('low')) {
        status = 'warning';
      }
      
      await Plot.updateStatus(plotId, status);
      
    } catch (error) {
      logger.error('Error updating plot status:', error);
      throw error;
    }
  }

  /**
   * Deliver alert using appropriate delivery methods
   * @param {Object} alert - Alert object
   * @param {Object} plot - Plot object with delivery preferences
   */
  static async deliverAlert(alert, plot) {
    try {
      const deliveryMethods = this.getDeliveryMethods(alert.severity, plot);
      
      const deliveryResults = await AlertDeliveryService.deliverAlert(alert, deliveryMethods);
      const hasSuccessfulDelivery = deliveryResults.some(result => result.success);
      if (hasSuccessfulDelivery) {
        await Alert.markAsDelivered(alert.id);
        logger.info(`Alert ${alert.id} delivered successfully via: ${deliveryResults.filter(r => r.success).map(r => r.method).join(', ')}`);
      } else {
        logger.error(`All delivery methods failed for alert ${alert.id}`);
      }
      
      return deliveryResults;
      
    } catch (error) {
      logger.error('Error delivering alert:', error);
      throw error;
    }
  }

  /**
   * Determine delivery methods based on alert severity and plot configuration
   * @param {string} severity - Alert severity
   * @param {Object} plot - Plot object
   */
  static getDeliveryMethods(severity, plot) {
    const methods = [];
    if (['medium', 'high', 'critical'].includes(severity)) {
      methods.push('email');
    }
    
    if (['high', 'critical'].includes(severity)) {
      methods.push('webhook');
    }
    
    if (plot.delivery_preferences) {
      const plotMethods = plot.delivery_preferences.methods || [];
      return [...new Set([...methods, ...plotMethods])];
    }
    
    return methods;
  }

  /**
   * Get default alert thresholds for a plot
   */
  static getDefaultThresholds() {
    return {
      temperature: {
        min: 10,
        max: 35
      },
      humidity: {
        min: 30,
        max: 80
      },
      soil_moisture: {
        min: 20,
        max: 80
      }
    };
  }
}

module.exports = AlertEngine;
