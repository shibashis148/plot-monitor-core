const express = require('express');
const router = express.Router();
const farmController = require('../../controllers/farm.controller');
const farmValidation = require('../../validations/farm.validation');
const validate = require('../../middlewares/validate');

router.route('/').get(farmController.getFarms);
router.route('/:id').get(validate(farmValidation.getFarm), farmController.getFarm);

module.exports = router;
