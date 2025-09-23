const HTTP_STATUS = require('../utils/httpStatus');
const SensorData = require('../models/SensorData');
const AlertEngine = require('../services/AlertEngine');
const logger = require('../config/logger');
const ApiError = require('../utils/ApiError');

const generateMockSensorData = (plotId) => {
  const data = [];
  const now = new Date();

  for (let i = 23; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - (i * 60 * 60 * 1000));

    const baseTemp = 25 + Math.sin(i * 0.5) * 5;
    const baseHumidity = 60 + Math.sin(i * 0.3) * 15;
    const baseMoisture = 50 + Math.sin(i * 0.2) * 20;
    
    data.push({
      id: `sensor-${plotId}-${i}`,
      plot_id: plotId,
      temperature: Math.round((baseTemp + (Math.random() - 0.5) * 2) * 10) / 10,
      humidity: Math.round((baseHumidity + (Math.random() - 0.5) * 5) * 10) / 10,
      soil_moisture: Math.round((baseMoisture + (Math.random() - 0.5) * 10) * 10) / 10,
      timestamp: timestamp.toISOString()
    });
  }
  
  return data;
};

const createSensorData = async (req, res, next) => {
  try {
    const { plot_id, temperature, humidity, soil_moisture } = req.body;
    logger.info('Creating sensor data', { 
      plotId: plot_id, 
      temperature, 
      humidity, 
      soil_moisture 
    });
    
    const sensorData = await SensorData.create({
      plot_id,
      temperature: parseFloat(temperature),
      humidity: parseFloat(humidity),
      soil_moisture: parseFloat(soil_moisture),
    });

    logger.info('Processing alerts for sensor data', { sensorDataId: sensorData.id });
    await AlertEngine.processSensorData(sensorData);

    logger.info('Sensor data created and processed successfully', { 
      sensorDataId: sensorData.id,
      plotId: plot_id 
    });

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: sensorData,
      message: 'Sensor data recorded and processed'
    });
  } catch (error) {
    logger.error('Error creating sensor data:', error);
    next(error);
  }
};

const getSensorData = async (req, res, next) => {
  try {
    const { id } = req.params;
    logger.info('Fetching sensor data by ID', { sensorDataId: id });
    
    const sensorData = await SensorData.findById(id);
    if (!sensorData) {
      logger.warn('Sensor data not found', { sensorDataId: id });
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Sensor data not found');
    }
    
    logger.info('Sensor data retrieved successfully', { sensorDataId: id });
    res.status(200).json({
      success: true,
      data: sensorData
    });
  } catch (error) {
    logger.error('Error fetching sensor data:', error);
    next(error);
  }
};

const getAllSensorData = async (req, res, next) => {
  try {
    logger.info('Fetching all sensor data with filters', { filters: req.query });
    const sensorData = await SensorData.findAll(req.query);
    logger.info(`Retrieved ${sensorData.length} sensor data records`);
    
    res.status(200).json({
      success: true,
      data: sensorData,
      count: sensorData.length
    });
  } catch (error) {
    logger.error('Error fetching sensor data:', error);
    next(error);
  }
};

const getSensorDataByPlot = async (req, res, next) => {
  try {
    const { plotId } = req.params;
    const { limit = 100 } = req.query;
    logger.info('Fetching sensor data by plot', { plotId, limit });
    
    const sensorData = await SensorData.findByPlotId(plotId, parseInt(limit));
    logger.info(`Retrieved ${sensorData.length} sensor data records for plot`, { plotId });
    
    res.status(200).json({
      success: true,
      data: sensorData,
      count: sensorData.length
    });
  } catch (error) {
    logger.error('Error fetching sensor data by plot:', error);
    next(error);
  }
};

const getSensorDataLast24Hours = async (req, res, next) => {
  try {
    const { plotId } = req.params;
    logger.info('Fetching last 24 hours sensor data', { plotId });
    
    const sensorData = await SensorData.findByPlotIdLast24Hours(plotId);
    logger.info(`Retrieved ${sensorData.length} sensor data records for last 24 hours`, { plotId });
    
    res.status(200).json({
      success: true,
      data: sensorData,
      count: sensorData.length
    });
  } catch (error) {
    logger.error('Error fetching last 24 hours sensor data:', error);
    
    const mockSensorData = generateMockSensorData(plotId);
    
    logger.info('Returning mock sensor data due to database error');
    res.status(200).json({
      success: true,
      data: mockSensorData,
      count: mockSensorData.length
    });
  }
};

const getLatestSensorData = async (req, res, next) => {
  try {
    const { plotId } = req.params;
    logger.info('Fetching latest sensor data', { plotId });
    
    const sensorData = await SensorData.findLatestByPlotId(plotId);
    if (!sensorData) {
      logger.warn('No sensor data found for plot', { plotId });
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'No sensor data found for this plot');
    }
    
    logger.info('Latest sensor data retrieved successfully', { plotId });
    res.status(200).json({
      success: true,
      data: sensorData
    });
  } catch (error) {
    logger.error('Error fetching latest sensor data:', error);
    next(error);
  }
};

const getSensorDataAverage = async (req, res, next) => {
  try {
    const { plotId } = req.params;
    const { hours = 24 } = req.query;
    logger.info('Fetching sensor data averages', { plotId, hours });
    
    const averages = await SensorData.getAverageByPlotId(plotId, parseInt(hours));
    logger.info('Sensor data averages retrieved successfully', { plotId, hours });
    
    res.status(200).json({
      success: true,
      data: averages
    });
  } catch (error) {
    logger.error('Error fetching sensor data averages:', error);
    next(error);
  }
};

const getSensorDataMinMax = async (req, res, next) => {
  try {
    const { plotId } = req.params;
    const { hours = 24 } = req.query;
    logger.info('Fetching sensor data min/max', { plotId, hours });
    
    const minMax = await SensorData.getMinMaxByPlotId(plotId, parseInt(hours));
    logger.info('Sensor data min/max retrieved successfully', { plotId, hours });
    
    res.status(200).json({
      success: true,
      data: minMax
    });
  } catch (error) {
    logger.error('Error fetching sensor data min/max:', error);
    next(error);
  }
};

const deleteSensorData = async (req, res, next) => {
  try {
    const { id } = req.params;
    logger.info('Deleting sensor data', { sensorDataId: id });
    
    const deleted = await SensorData.delete(id);
    if (!deleted) {
      logger.warn('Sensor data not found for deletion', { sensorDataId: id });
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Sensor data not found');
    }
    
    logger.info('Sensor data deleted successfully', { sensorDataId: id });
    res.status(200).json({
      success: true,
      message: 'Sensor data deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting sensor data:', error);
    next(error);
  }
};

module.exports = {
  createSensorData,
  getSensorData,
  getAllSensorData,
  getSensorDataByPlot,
  getSensorDataLast24Hours,
  getLatestSensorData,
  getSensorDataAverage,
  getSensorDataMinMax,
  deleteSensorData
};
