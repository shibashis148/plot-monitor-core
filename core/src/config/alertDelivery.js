/**
 * Alert Delivery Configuration
 * 
 * This file contains configuration for different alert delivery methods
 * including email, webhook, and in-app notifications.
 */

const config = {
  email: {
    enabled: process.env.ALERT_EMAIL_ENABLED === 'true',
    smtp: {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    },
    from: process.env.SMTP_FROM || 'alerts@farmplot.com',
    recipients: process.env.ALERT_EMAIL_RECIPIENTS ? 
      process.env.ALERT_EMAIL_RECIPIENTS.split(',') : 
      ['admin@farmplot.com'],
    templates: {
      subject: '🚨 Farm Alert: {severity} - {alert_type}',
      html: 'default'
    }
  },

  webhook: {
    enabled: process.env.ALERT_WEBHOOK_ENABLED === 'true',
    url: process.env.ALERT_WEBHOOK_URL,
    timeout: parseInt(process.env.ALERT_WEBHOOK_TIMEOUT) || 10000,
    retries: parseInt(process.env.ALERT_WEBHOOK_RETRIES) || 3,
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'FarmPlot-AlertSystem/1.0',
      'X-API-Key': process.env.ALERT_WEBHOOK_API_KEY
    }
  },


  strategy: {
    severityMethods: {
      low: ['email'],
      medium: ['email'],
      high: ['email', 'webhook'],
      critical: ['email', 'webhook']
    },

    retry: {
      enabled: true,
      maxAttempts: 3,
      backoffMultiplier: 2,
      initialDelay: 1000,
      maxDelay: 30000
    },

    rateLimit: {
      enabled: true,
      maxAlertsPerMinute: 10,
      maxAlertsPerHour: 100
    }
  },

  escalation: {
    enabled: process.env.ALERT_ESCALATION_ENABLED === 'true',
    levels: [
      {
        name: 'immediate',
        delay: 0,
        methods: ['inApp', 'email', 'webhook']
      },
      {
        name: '5min',
        delay: 5 * 60 * 1000,
        methods: ['email', 'webhook'],
        condition: 'unacknowledged'
      },
      {
        name: '15min',
        delay: 15 * 60 * 1000,
        methods: ['webhook'],
        condition: 'unacknowledged'
      }
    ]
  }
};

module.exports = config;
