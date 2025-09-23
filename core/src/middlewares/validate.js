const Joi = require('joi');
const HTTP_STATUS = require('../utils/httpStatus');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');

const validate = (schema) => (req, res, next) => {
  try {
    const validSchema = pick(schema, ['params', 'query', 'body']);
    
    const objectToValidate = {};
    if (validSchema.params && req.params) {
      objectToValidate.params = req.params;
    }
    if (validSchema.query && req.query) {
      objectToValidate.query = req.query;
    }
    if (validSchema.body && req.body) {
      objectToValidate.body = req.body;
    }
    
    const { error } = Joi.compile(validSchema)
      .prefs({ errors: { label: 'key' }, abortEarly: false })
      .validate(objectToValidate);

    if (error) {
      const errorMessage = error.details.map((details) => details.message).join(', ');
      return next(new ApiError(HTTP_STATUS.BAD_REQUEST, errorMessage));
    }
    
    return next();
  } catch (err) {
    return next(new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Validation error'));
  }
};

module.exports = validate;
