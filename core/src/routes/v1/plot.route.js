const express = require('express');
const router = express.Router();
const plotController = require('../../controllers/plot.controller');
const plotValidation = require('../../validations/plot.validation');
const validate = require('../../middlewares/validate');

router.route('/:id').get(validate(plotValidation.getPlot), plotController.getPlot);
router.route('/:id/thresholds').get(validate(plotValidation.getThresholds), plotController.getPlotThresholds);
router.route('/:id/thresholds').put(validate(plotValidation.updateThresholds), plotController.updatePlotThresholds);

module.exports = router;
