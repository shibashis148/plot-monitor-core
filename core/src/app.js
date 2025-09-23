const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const HTTP_STATUS = require('./utils/httpStatus');
const config = require('./config/config');
const morgan = require('./config/morgan');
const routes = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');
const path = require('path');
const logger = require('./config/logger');

const app = express();

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

app.use(helmet());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(compression());

app.use(
  cors({
    credentials: true,
    origin:
      config.env === 'production'
        ? [

          ]
        : '*',
  })
);

app.enable('trust proxy');

app.get('/health', (req, res, next) => {
  try {
    res.status(HTTP_STATUS.OK).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: config.env,
      version: process.env.npm_package_version || '1.0.0',
      memory: process.memoryUsage(),
      pid: process.pid
    });
  } catch (err) {
    next(err);
  }
});

app.use('/v1', routes);

if (config.env == 'production') {
  Sentry.setupExpressErrorHandler(app);
}

app.use((req, res, next) => {
  next(new ApiError(HTTP_STATUS.NOT_FOUND, 'Not found'));
});

app.use(errorConverter);

app.use(errorHandler);

module.exports = app;
