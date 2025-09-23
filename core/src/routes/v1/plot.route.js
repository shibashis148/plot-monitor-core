const express = require('express');
const router = express.Router();
const plotController = require('../../controllers/plot.controller');
const plotValidation = require('../../validations/plot.validation');
const validate = require('../../middlewares/validate');

router.route('/').get(validate(plotValidation.getPlots), plotController.getPlots);

router.route('/').post(validate(plotValidation.createPlot), plotController.createPlot);

router.route('/status/:status').get(validate(plotValidation.getPlotsByStatus), plotController.getPlotsByStatus);

router.route('/crop/:cropType').get(validate(plotValidation.getPlotsByCropType), plotController.getPlotsByCropType);

router.route('/:id').get(validate(plotValidation.getPlot), plotController.getPlot);

router.route('/:id').put(validate(plotValidation.updatePlot), plotController.updatePlot);

router.route('/:id').delete(validate(plotValidation.deletePlot), plotController.deletePlot);
router.route('/:id/thresholds').get(validate(plotValidation.getThresholds), plotController.getPlotThresholds);
router.route('/:id/thresholds').put(validate(plotValidation.updateThresholds), plotController.updatePlotThresholds);

module.exports = router;
