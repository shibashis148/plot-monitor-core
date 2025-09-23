const Joi = require('joi');

const createPlot = {
  body: Joi.object().keys({
    farm_id: Joi.string().uuid().required(),
    name: Joi.string().required().min(2).max(100),
    plot_number: Joi.string().required().min(1).max(20),
    boundary: Joi.object().keys({
      type: Joi.string().valid('Polygon').required(),
      coordinates: Joi.array().items(
        Joi.array().items(
          Joi.array().items(Joi.number()).length(2)
        )
      ).required()
    }).required(),
    area: Joi.number().positive().required(),
    crop_type: Joi.string().max(50),
    status: Joi.string().valid('healthy', 'warning', 'critical'),
    alert_thresholds: Joi.object().keys({
      temperature: Joi.object().keys({
        min: Joi.number(),
        max: Joi.number()
      }),
      humidity: Joi.object().keys({
        min: Joi.number(),
        max: Joi.number()
      }),
      soil_moisture: Joi.object().keys({
        min: Joi.number(),
        max: Joi.number()
      })
    })
  })
};

const updatePlot = {
  params: Joi.object().keys({
    id: Joi.string().uuid().required()
  }),
  body: Joi.object().keys({
    farm_id: Joi.string().uuid(),
    name: Joi.string().min(2).max(100),
    plot_number: Joi.string().min(1).max(20),
    boundary: Joi.object().keys({
      type: Joi.string().valid('Polygon').required(),
      coordinates: Joi.array().items(
        Joi.array().items(
          Joi.array().items(Joi.number()).length(2)
        )
      ).required()
    }),
    area: Joi.number().positive(),
    crop_type: Joi.string().max(50),
    status: Joi.string().valid('healthy', 'warning', 'critical'),
    alert_thresholds: Joi.object().keys({
      temperature: Joi.object().keys({
        min: Joi.number(),
        max: Joi.number()
      }),
      humidity: Joi.object().keys({
        min: Joi.number(),
        max: Joi.number()
      }),
      soil_moisture: Joi.object().keys({
        min: Joi.number(),
        max: Joi.number()
      })
    })
  }).min(1)
};

const getPlot = {
  params: Joi.object().keys({
    id: Joi.string().uuid().required()
  })
};

const deletePlot = {
  params: Joi.object().keys({
    id: Joi.string().uuid().required()
  })
};

const getPlotsByFarm = {
  params: Joi.object().keys({
    farmId: Joi.string().uuid().required()
  })
};

const getPlotsByStatus = {
  params: Joi.object().keys({
    status: Joi.string().valid('healthy', 'warning', 'critical').required()
  })
};

const getPlotsByCropType = {
  params: Joi.object().keys({
    cropType: Joi.string().required()
  })
};

const getPlots = {
  query: Joi.object().keys({
    farm_id: Joi.string().uuid(),
    status: Joi.string().valid('healthy', 'warning', 'critical'),
    crop_type: Joi.string(),
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1).max(100)
  })
};

const getThresholds = {
  params: Joi.object().keys({
    id: Joi.string().uuid().required()
  })
};

const updateThresholds = {
  params: Joi.object().keys({
    id: Joi.string().uuid().required()
  }),
  body: Joi.object().keys({
    alert_thresholds: Joi.object().keys({
      temperature: Joi.object().keys({
        min: Joi.number().min(-50).max(100),
        max: Joi.number().min(-50).max(100)
      }),
      humidity: Joi.object().keys({
        min: Joi.number().min(0).max(100),
        max: Joi.number().min(0).max(100)
      }),
      soil_moisture: Joi.object().keys({
        min: Joi.number().min(0).max(100),
        max: Joi.number().min(0).max(100)
      })
    }).required()
  })
};

module.exports = {
  createPlot,
  updatePlot,
  getPlot,
  deletePlot,
  getPlotsByFarm,
  getPlotsByStatus,
  getPlotsByCropType,
  getPlots,
  getThresholds,
  updateThresholds
};
