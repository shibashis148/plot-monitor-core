const express = require('express');
const router = express.Router();
const alertController = require('../../controllers/alert.controller');
const alertValidation = require('../../validations/alert.validation');
const validate = require('../../middlewares/validate');

router.route('/').get(alertController.getAlerts);

router.route('/active').get(alertController.getActiveAlerts);

router.route('/unacknowledged').get(alertController.getUnacknowledgedAlerts);

router.route('/stats').get(alertController.getAlertStats);

router.route('/plot/:plotId').get(validate(alertValidation.getAlertsByPlot), alertController.getAlertsByPlot);

router.route('/:id/acknowledge').post(validate(alertValidation.acknowledgeAlert), alertController.acknowledgeAlert);

router.route('/:id/dismiss').post(validate(alertValidation.dismissAlert), alertController.dismissAlert);

router.route('/:id').get(validate(alertValidation.getAlert), alertController.getAlert);

router.route('/:id').put(validate(alertValidation.updateAlert), alertController.updateAlert);
router.route('/:id').delete(validate(alertValidation.deleteAlert), alertController.deleteAlert);

module.exports = router;
