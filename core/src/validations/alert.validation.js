const Joi = require('joi');

const getAlert = {
  params: Joi.object().keys({
    id: Joi.string().uuid().required()
  })
};

const getAlertsByPlot = {
  params: Joi.object().keys({
    plotId: Joi.string().uuid().required()
  })
};

const acknowledgeAlert = {
  params: Joi.object().keys({
    id: Joi.string().uuid().required()
  }),
  body: Joi.object().keys({
    action: Joi.string().valid('acknowledge', 'dismiss').default('acknowledge')
  })
};

const dismissAlert = {
  params: Joi.object().keys({
    id: Joi.string().uuid().required()
  })
};

const updateAlert = {
  params: Joi.object().keys({
    id: Joi.string().uuid().required()
  }),
  body: Joi.object().keys({
    status: Joi.string().valid('active', 'acknowledged', 'dismissed'),
    message: Joi.string().max(500)
  }).min(1)
};

const deleteAlert = {
  params: Joi.object().keys({
    id: Joi.string().uuid().required()
  })
};

const getAllAlerts = {
  query: Joi.object().keys({
    plot_id: Joi.string().uuid(),
    status: Joi.string().valid('active', 'acknowledged', 'dismissed'),
    severity: Joi.string().valid('low', 'medium', 'high', 'critical'),
    alert_type: Joi.string(),
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1).max(100)
  })
};

module.exports = {
  getAlert,
  getAlertsByPlot,
  acknowledgeAlert,
  dismissAlert,
  updateAlert,
  deleteAlert,
  getAllAlerts
};
