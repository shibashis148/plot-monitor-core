const express = require('express');
const router = express.Router();
const alertController = require('../../controllers/alert.controller');
const alertValidation = require('../../validations/alert.validation');
const validate = require('../../middlewares/validate');

router.route('/').get(alertController.getAlerts);
router.route('/:id').put(validate(alertValidation.updateAlert), alertController.updateAlert);

module.exports = router;
