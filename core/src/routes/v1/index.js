const express = require('express');
const farmRoute = require('./farm.route');
const plotRoute = require('./plot.route');
const sensorRoute = require('./sensor.route');
const alertRoute = require('./alert.route');
const alertDeliveryRoute = require('./alertDelivery.route');
const plotController = require('../../controllers/plot.controller');
const plotValidation = require('../../validations/plot.validation');
const validate = require('../../middlewares/validate');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/farms',
    route: farmRoute,
  },
  {
    path: '/plots',
    route: plotRoute,
  },
  {
    path: '/sensor-data',
    route: sensorRoute,
  },
  {
    path: '/alerts',
    route: alertRoute,
  },
  {
    path: '/alert-delivery',
    route: alertDeliveryRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

router.route('/farms/:farmId/plots').get(validate(plotValidation.getPlotsByFarm), plotController.getPlotsByFarm);

module.exports = router;
