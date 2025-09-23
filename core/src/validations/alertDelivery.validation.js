const Joi = require('joi');

const testDelivery = {
  body: Joi.object().keys({
    methods: Joi.array().items(
      Joi.string().valid('email', 'webhook')
    ).min(1).required(),
    testAlert: Joi.object().keys({
      id: Joi.string(),
      alert_type: Joi.string().valid('temperature', 'humidity', 'soil_moisture'),
      severity: Joi.string().valid('low', 'medium', 'high', 'critical'),
      message: Joi.string(),
      plot_id: Joi.string(),
      plot_name: Joi.string(),
      farm_name: Joi.string(),
      created_at: Joi.date()
    })
  })
};

const getDeliveryStatus = {
  params: Joi.object().keys({
    alertId: Joi.string().required()
  })
};

const retryDelivery = {
  params: Joi.object().keys({
    alertId: Joi.string().required()
  }),
  body: Joi.object().keys({
    methods: Joi.array().items(
      Joi.string().valid('email', 'webhook')
    ).min(1).required()
  })
};

const updateConfig = {
  body: Joi.object().keys({
    config: Joi.object().keys({
      email: Joi.object().keys({
        enabled: Joi.boolean(),
        from: Joi.string().email(),
        recipients: Joi.array().items(Joi.string().email())
      }),
      webhook: Joi.object().keys({
        enabled: Joi.boolean(),
        url: Joi.string().uri(),
        timeout: Joi.number().integer().min(1000).max(60000),
        retries: Joi.number().integer().min(1).max(10)
      }),
      inApp: Joi.object().keys({
        enabled: Joi.boolean(),
        websocket: Joi.object().keys({
          enabled: Joi.boolean(),
          port: Joi.number().integer().min(1000).max(65535)
        })
      }),
      strategy: Joi.object().keys({
        severityMethods: Joi.object().keys({
          low: Joi.array().items(Joi.string().valid('email', 'webhook', 'inApp')),
          medium: Joi.array().items(Joi.string().valid('email', 'webhook', 'inApp')),
          high: Joi.array().items(Joi.string().valid('email', 'webhook', 'inApp')),
          critical: Joi.array().items(Joi.string().valid('email', 'webhook', 'inApp'))
        })
      })
    }).required()
  })
};

module.exports = {
  testDelivery,
  getDeliveryStatus,
  retryDelivery,
  updateConfig
};
