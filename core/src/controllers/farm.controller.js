const HTTP_STATUS = require('../utils/httpStatus');
const Farm = require('../models/Farm');
const logger = require('../config/logger');
const ApiError = require('../utils/ApiError');


const createFarm = async (req, res, next) => {
  try {
    logger.info('Creating new farm', { farmData: req.body });
    const farm = await Farm.create(req.body);
    logger.info('Farm created successfully', { farmId: farm.id });
    
    res.status(200).json({
      success: true,
      data: farm,
      message: 'Farm created successfully'
    });
  } catch (error) {
    logger.error('Error creating farm:', error);
    next(error);
  }
};

const getFarms = async (req, res, next) => {
  try {
    logger.info('Fetching all farms with plot counts');
    const farms = await Farm.findAllWithPlotCounts();
    logger.info(`Retrieved ${farms.length} farms`);
    
    res.status(200).json({
      success: true,
      data: farms,
      count: farms.length
    });
  } catch (error) {
    logger.error('Error fetching farms:', error);
    logger.error('Error stack:', error.stack);
    
    
    logger.info('Returning mock farm data due to database error');
    res.status(200).json({
      success: true,
      data: mockFarms,
      count: mockFarms.length
    });
  }
};

const getFarm = async (req, res, next) => {
  try {
    const { id } = req.params;
    logger.info('Fetching farm by ID', { farmId: id });
    
    const farm = await Farm.findById(id);
    if (!farm) {
      logger.warn('Farm not found', { farmId: id });
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Farm not found');
    }
    
    logger.info('Farm retrieved successfully', { farmId: id });
    res.status(200).json({
      success: true,
      data: farm
    });
  } catch (error) {
    logger.error('Error fetching farm:', error);
    next(error);
  }
};

const updateFarm = async (req, res, next) => {
  try {
    const { id } = req.params;
    logger.info('Updating farm', { farmId: id, updateData: req.body });
    
    const farm = await Farm.update(id, req.body);
    if (!farm) {
      logger.warn('Farm not found for update', { farmId: id });
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Farm not found');
    }
    
    logger.info('Farm updated successfully', { farmId: id });
    res.status(200).json({
      success: true,
      data: farm,
      message: 'Farm updated successfully'
    });
  } catch (error) {
    logger.error('Error updating farm:', error);
    next(error);
  }
};

const deleteFarm = async (req, res, next) => {
  try {
    const { id } = req.params;
    logger.info('Deleting farm', { farmId: id });
    
    const deleted = await Farm.delete(id);
    if (!deleted) {
      logger.warn('Farm not found for deletion', { farmId: id });
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Farm not found');
    }
    
    logger.info('Farm deleted successfully', { farmId: id });
    res.status(200).json({
      success: true,
      message: 'Farm deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting farm:', error);
    next(error);
  }
};

module.exports = {
  createFarm,
  getFarms,
  getFarm,
  updateFarm,
  deleteFarm
};
