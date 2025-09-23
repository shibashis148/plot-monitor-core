const Joi = require('joi');

const createSensorData = {
  body: Joi.object().keys({
    plot_id: Joi.string().uuid().required(),
    temperature: Joi.number().min(-50).max(100).required(),
    humidity: Joi.number().min(0).max(100).required(),
    soil_moisture: Joi.number().min(0).max(100).required(),
    timestamp: Joi.date().optional()
  })
};

const getSensorData = {
  params: Joi.object().keys({
    id: Joi.string().uuid().required()
  })
};

const getSensorDataByPlot = {
  params: Joi.object().keys({
    plotId: Joi.string().uuid().required()
  }),
  query: Joi.object().keys({
    limit: Joi.number().integer().min(1).max(1000).default(100)
  })
};

const getSensorDataLast24Hours = {
  params: Joi.object().keys({
    plotId: Joi.string().uuid().required()
  })
};

const getLatestSensorData = {
  params: Joi.object().keys({
    plotId: Joi.string().uuid().required()
  })
};

const getSensorDataAverage = {
  params: Joi.object().keys({
    plotId: Joi.string().uuid().required()
  }),
  query: Joi.object().keys({
    hours: Joi.number().integer().min(1).max(168).default(24)
  })
};

const getSensorDataMinMax = {
  params: Joi.object().keys({
    plotId: Joi.string().uuid().required()
  }),
  query: Joi.object().keys({
    hours: Joi.number().integer().min(1).max(168).default(24)
  })
};

const deleteSensorData = {
  params: Joi.object().keys({
    id: Joi.string().uuid().required()
  })
};

const getAllSensorData = {
  query: Joi.object().keys({
    plot_id: Joi.string().uuid(),
    start_date: Joi.date(),
    end_date: Joi.date(),
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1).max(1000)
  })
};

module.exports = {
  createSensorData,
  getSensorData,
  getSensorDataByPlot,
  getSensorDataLast24Hours,
  getLatestSensorData,
  getSensorDataAverage,
  getSensorDataMinMax,
  deleteSensorData,
  getAllSensorData
};
