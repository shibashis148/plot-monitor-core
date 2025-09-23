const express = require('express');
const router = express.Router();
const farmController = require('../../controllers/farm.controller');
const farmValidation = require('../../validations/farm.validation');
const validate = require('../../middlewares/validate');

router.route('/').get(farmController.getFarms);

router.route('/health').get((req, res) => {
  res.status(200).json({
    success: true,
    message: 'Farm API is working',
    timestamp: new Date().toISOString()
  });
});

router.route('/test').get((req, res) => {
  res.status(200).json({
    success: true,
    message: 'Farm test endpoint working',
    data: [
      { id: 'test-1', name: 'Test Farm 1', owner_name: 'Test Owner' },
      { id: 'test-2', name: 'Test Farm 2', owner_name: 'Test Owner 2' }
    ]
  });
});

router.route('/db-test').get(async (req, res) => {
  try {
    const { getDatabase } = require('../../config/database');
    const db = getDatabase();

    const result = await db.raw('SELECT 1 as test');

    res.status(200).json({
      success: true,
      message: 'Database connection working',
      data: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
});

router.route('/').post(validate(farmValidation.createFarm), farmController.createFarm);

router.route('/:id').get(validate(farmValidation.getFarm), farmController.getFarm);

router.route('/:id').put(validate(farmValidation.updateFarm), farmController.updateFarm);
router.route('/:id').delete(validate(farmValidation.deleteFarm), farmController.deleteFarm);

module.exports = router;
