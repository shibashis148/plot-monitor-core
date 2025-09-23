const express = require('express');
const router = express.Router();
const alertDeliveryController = require('../../controllers/alertDelivery.controller');
const alertDeliveryValidation = require('../../validations/alertDelivery.validation');
const validate = require('../../middlewares/validate');

router.route('/config').get(alertDeliveryController.getDeliveryConfig);

router.route('/test').post(validate(alertDeliveryValidation.testDelivery), alertDeliveryController.testDelivery);

router.route('/status/:alertId').get(validate(alertDeliveryValidation.getDeliveryStatus), alertDeliveryController.getDeliveryStatus);

router.route('/retry/:alertId').post(validate(alertDeliveryValidation.retryDelivery), alertDeliveryController.retryDelivery);
router.route('/config').put(validate(alertDeliveryValidation.updateConfig), alertDeliveryController.updateDeliveryConfig);

module.exports = router;
