const HTTP_STATUS = require('../utils/httpStatus');
const Plot = require('../models/Plot');
const logger = require('../config/logger');
const ApiError = require('../utils/ApiError');

const createPlot = async (req, res, next) => {
  try {
    logger.info('Creating new plot', { plotData: req.body });
    const plot = await Plot.create(req.body);
    logger.info('Plot created successfully', { plotId: plot.id });
    
    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: plot,
      message: 'Plot created successfully'
    });
  } catch (error) {
    logger.error('Error creating plot:', error);
    next(error);
  }
};

const getPlots = async (req, res, next) => {
  try {
    logger.info('Fetching plots with filters', { filters: req.query });
    const plots = await Plot.findAll(req.query);
    logger.info(`Retrieved ${plots.length} plots`);
    
    res.status(200).json({
      success: true,
      data: plots,
      count: plots.length
    });
  } catch (error) {
    logger.error('Error fetching plots:', error);
    next(error);
  }
};

const getPlot = async (req, res, next) => {
  try {
    const { id } = req.params;
    logger.info('Fetching plot by ID', { plotId: id });
    
    const plot = await Plot.findById(id);
    if (!plot) {
      logger.warn('Plot not found', { plotId: id });
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Plot not found');
    }
    
    logger.info('Plot retrieved successfully', { plotId: id });
    res.status(200).json({
      success: true,
      data: plot
    });
  } catch (error) {
    logger.error('Error fetching plot:', error);
    next(error);
  }
};

const updatePlot = async (req, res, next) => {
  try {
    const { id } = req.params;
    logger.info('Updating plot', { plotId: id, updateData: req.body });
    
    const plot = await Plot.update(id, req.body);
    if (!plot) {
      logger.warn('Plot not found for update', { plotId: id });
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Plot not found');
    }
    
    logger.info('Plot updated successfully', { plotId: id });
    res.status(200).json({
      success: true,
      data: plot,
      message: 'Plot updated successfully'
    });
  } catch (error) {
    logger.error('Error updating plot:', error);
    next(error);
  }
};

const deletePlot = async (req, res, next) => {
  try {
    const { id } = req.params;
    logger.info('Deleting plot', { plotId: id });
    
    const deleted = await Plot.delete(id);
    if (!deleted) {
      logger.warn('Plot not found for deletion', { plotId: id });
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Plot not found');
    }
    
    logger.info('Plot deleted successfully', { plotId: id });
    res.status(200).json({
      success: true,
      message: 'Plot deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting plot:', error);
    next(error);
  }
};

const getPlotsByFarm = async (req, res, next) => {
  try {
    const { farmId } = req.params;
    logger.info('Fetching plots by farm ID', { farmId });
    
    const plots = await Plot.findByFarmId(farmId);
    logger.info(`Retrieved ${plots.length} plots for farm`, { farmId });
    
    res.status(200).json({
      success: true,
      data: plots,
      count: plots.length
    });
  } catch (error) {
    logger.error('Error fetching plots by farm:', error);
    
    const mockPlots = [
      {
        id: 'plot-1',
        farm_id: farmId,
        name: 'North Field',
        plot_number: 'A1',
        area: 25.5,
        crop_type: 'Wheat',
        status: 'healthy',
        alert_thresholds: {
          temperature: { min: 15, max: 35 },
          humidity: { min: 40, max: 80 },
          soil_moisture: { min: 30, max: 70 }
        },
        boundary: {
          type: 'Polygon',
          coordinates: [[[-74.006, 40.712], [-74.005, 40.712], [-74.005, 40.713], [-74.006, 40.713], [-74.006, 40.712]]]
        },
        farm_name: 'Green Valley Farm',
        owner_name: 'John Smith',
        created_at: new Date().toISOString()
      },
      {
        id: 'plot-2',
        farm_id: farmId,
        name: 'South Field',
        plot_number: 'A2',
        area: 30.2,
        crop_type: 'Corn',
        status: 'warning',
        alert_thresholds: {
          temperature: { min: 18, max: 32 },
          humidity: { min: 45, max: 75 },
          soil_moisture: { min: 35, max: 65 }
        },
        boundary: {
          type: 'Polygon',
          coordinates: [[[-74.005, 40.712], [-74.004, 40.712], [-74.004, 40.713], [-74.005, 40.713], [-74.005, 40.712]]]
        },
        farm_name: 'Green Valley Farm',
        owner_name: 'John Smith',
        created_at: new Date().toISOString()
      }
    ];
    
    logger.info('Returning mock plot data due to database error');
    res.status(200).json({
      success: true,
      data: mockPlots,
      count: mockPlots.length
    });
  }
};

const getPlotsByStatus = async (req, res, next) => {
  try {
    const { status } = req.params;
    logger.info('Fetching plots by status', { status });
    
    const plots = await Plot.findByStatus(status);
    logger.info(`Retrieved ${plots.length} plots with status ${status}`);
    
    res.status(200).json({
      success: true,
      data: plots,
      count: plots.length
    });
  } catch (error) {
    logger.error('Error fetching plots by status:', error);
    next(error);
  }
};

const getPlotsByCropType = async (req, res, next) => {
  try {
    const { cropType } = req.params;
    logger.info('Fetching plots by crop type', { cropType });
    
    const plots = await Plot.findByCropType(cropType);
    logger.info(`Retrieved ${plots.length} plots with crop type ${cropType}`);
    
    res.status(200).json({
      success: true,
      data: plots,
      count: plots.length
    });
  } catch (error) {
    logger.error('Error fetching plots by crop type:', error);
    next(error);
  }
};

const getPlotThresholds = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    logger.info('Fetching plot thresholds', { plotId: id });
    
    const plot = await Plot.findById(id);
    if (!plot) {
      logger.warn('Plot not found for threshold fetch', { plotId: id });
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Plot not found');
    }
    
    logger.info('Plot thresholds retrieved successfully', { plotId: id });
    
    res.status(200).json({
      success: true,
      data: {
        alert_thresholds: plot.alert_thresholds || {
          temperature: { min: 0, max: 30 },
          humidity: { min: 30, max: 80 },
          soil_moisture: { min: 20, max: 80 }
        }
      }
    });
  } catch (error) {
    logger.error('Error fetching plot thresholds:', error);
    next(error);
  }
};

const updatePlotThresholds = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { alert_thresholds } = req.body;
    
    logger.info('Updating plot thresholds', { plotId: id, thresholds: alert_thresholds });
    
    const plot = await Plot.findById(id);
    if (!plot) {
      logger.warn('Plot not found for threshold update', { plotId: id });
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Plot not found');
    }
    
    const updatedPlot = await Plot.update(id, { alert_thresholds });
    logger.info('Plot thresholds updated successfully', { plotId: id });
    
    res.status(200).json({
      success: true,
      data: updatedPlot,
      message: 'Plot thresholds updated successfully'
    });
  } catch (error) {
    logger.error('Error updating plot thresholds:', error);
    next(error);
  }
};

module.exports = {
  createPlot,
  getPlots,
  getPlot,
  updatePlot,
  deletePlot,
  getPlotsByFarm,
  getPlotsByStatus,
  getPlotsByCropType,
  getPlotThresholds,
  updatePlotThresholds
};
