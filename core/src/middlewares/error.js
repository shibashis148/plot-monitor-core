const HTTP_STATUS = require('../utils/httpStatus');
const config = require('../config/config');
const logger = require('../config/logger');
const ApiError = require('../utils/ApiError');

const errorConverter = (err, req, res, next) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || error.status || HTTP_STATUS.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
};

const errorHandler = (err, req, res, next) => {
  console.log('Error caught in handler:', err);
  
  let statusCode = err.statusCode || err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message = err.message || 'Internal Server Error';

  if (typeof statusCode !== 'number' || !Number.isInteger(statusCode)) {
    statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  }

  if (config.env === 'production' && !err.isOperational) {
    statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
    message = httpStatus[HTTP_STATUS.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = message;

  const response = {
    success: false,
    code: statusCode,
    message,
    ...(config.env === 'development' && { stack: err.stack }),
  };

  const errorMessage = `${req.method} ${req.originalUrl} |
  Request body  :- ${JSON.stringify(req.body)} |
  Request Query :- ${JSON.stringify(req.query)} |
  Request Params :- ${JSON.stringify(req.params)} |
  Error:- ${JSON.stringify({
    name: err.name,
    message: err.message,
    statusCode: err.statusCode,
    status: err.status
  })} |
  Stack:- ${err.stack}`;

  if (config.env === 'development') {
    logger.error(errorMessage);
  }

  res.status(statusCode).send(response);
};

module.exports = {
  errorConverter,
  errorHandler,
};