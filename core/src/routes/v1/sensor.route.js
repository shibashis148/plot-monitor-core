const express = require('express');
const router = express.Router();
const sensorController = require('../../controllers/sensor.controller');
const sensorValidation = require('../../validations/sensor.validation');
const validate = require('../../middlewares/validate');

router.route('/').post(validate(sensorValidation.createSensorData), sensorController.createSensorData);

router.route('/').get(validate(sensorValidation.getAllSensorData), sensorController.getAllSensorData);

router.route('/plot/:plotId/last24hours').get(validate(sensorValidation.getSensorDataLast24Hours), sensorController.getSensorDataLast24Hours);

router.route('/plot/:plotId/latest').get(validate(sensorValidation.getLatestSensorData), sensorController.getLatestSensorData);

router.route('/plot/:plotId/average').get(validate(sensorValidation.getSensorDataAverage), sensorController.getSensorDataAverage);

router.route('/plot/:plotId/minmax').get(validate(sensorValidation.getSensorDataMinMax), sensorController.getSensorDataMinMax);

router.route('/plot/:plotId').get(validate(sensorValidation.getSensorDataByPlot), sensorController.getSensorDataByPlot);

router.route('/:id').get(validate(sensorValidation.getSensorData), sensorController.getSensorData);
router.route('/:id').delete(validate(sensorValidation.deleteSensorData), sensorController.deleteSensorData);

module.exports = router;
