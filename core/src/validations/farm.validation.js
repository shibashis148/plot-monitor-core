const Joi = require('joi');

const createFarm = {
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(100),
    owner_name: Joi.string().required().min(2).max(100),
    location: Joi.object().keys({
      type: Joi.string().valid('Point').required(),
      coordinates: Joi.array().items(Joi.number()).length(2).required()
    }).required(),
    boundary: Joi.object().keys({
      type: Joi.string().valid('Polygon').required(),
      coordinates: Joi.array().items(
        Joi.array().items(
          Joi.array().items(Joi.number()).length(2)
        )
      ).required()
    }).required(),
    total_area: Joi.number().positive().required()
  })
};

const updateFarm = {
  params: Joi.object().keys({
    id: Joi.string().uuid().required()
  }),
  body: Joi.object().keys({
    name: Joi.string().min(2).max(100),
    owner_name: Joi.string().min(2).max(100),
    location: Joi.object().keys({
      type: Joi.string().valid('Point').required(),
      coordinates: Joi.array().items(Joi.number()).length(2).required()
    }),
    boundary: Joi.object().keys({
      type: Joi.string().valid('Polygon').required(),
      coordinates: Joi.array().items(
        Joi.array().items(
          Joi.array().items(Joi.number()).length(2)
        )
      ).required()
    }),
    total_area: Joi.number().positive()
  }).min(1)
};

const getFarm = {
  params: Joi.object().keys({
    id: Joi.string().uuid().required()
  })
};

const deleteFarm = {
  params: Joi.object().keys({
    id: Joi.string().uuid().required()
  })
};

module.exports = {
  createFarm,
  updateFarm,
  getFarm,
  deleteFarm
};
