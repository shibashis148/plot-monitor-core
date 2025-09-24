const express = require('express');
const router = express.Router();
const sensorController = require('../../controllers/sensor.controller');
const sensorValidation = require('../../validations/sensor.validation');
const validate = require('../../middlewares/validate');

router.route('/').post(validate(sensorValidation.createSensorData), sensorController.createSensorData);
router.route('/plot/:plotId/last24hours').get(validate(sensorValidation.getSensorDataLast24Hours), sensorController.getSensorDataLast24Hours);

module.exports = router;
