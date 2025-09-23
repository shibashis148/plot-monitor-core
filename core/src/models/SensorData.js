const { getDatabase } = require('../config/database');

class SensorData {
  constructor() {
    this.tableName = 'sensor_data';
  }

  async create(sensorData) {
    const db = getDatabase();
    const [data] = await db(this.tableName)
      .insert({
        ...sensorData,
        timestamp: new Date(),
      })
      .returning('*');
    return data;
  }

  async findById(id) {
    const db = getDatabase();
    return await db(this.tableName)
      .join('plots', 'sensor_data.plot_id', 'plots.id')
      .select('sensor_data.*', 'plots.name as plot_name', 'plots.plot_number')
      .where('sensor_data.id', id)
      .first();
  }

  async findByPlotId(plotId, limit = 100) {
    const db = getDatabase();
    return await db(this.tableName)
      .where('plot_id', plotId)
      .orderBy('timestamp', 'desc')
      .limit(limit);
  }

  async findByPlotIdLast24Hours(plotId) {
    const db = getDatabase();
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const results = await db(this.tableName)
      .where('plot_id', plotId)
      .where('timestamp', '>=', twentyFourHoursAgo)
      .orderBy('timestamp', 'asc');

    return results.map(sensorData => ({
      ...sensorData,
      temperature: parseFloat(sensorData.temperature) || 0,
      humidity: parseFloat(sensorData.humidity) || 0,
      soil_moisture: parseFloat(sensorData.soil_moisture) || 0
    }));
  }

  async findLatestByPlotId(plotId) {
    const db = getDatabase();
    return await db(this.tableName)
      .where('plot_id', plotId)
      .orderBy('timestamp', 'desc')
      .first();
  }

  async findAll(filters = {}) {
    const db = getDatabase();
    let query = db(this.tableName)
      .join('plots', 'sensor_data.plot_id', 'plots.id')
      .select('sensor_data.*', 'plots.name as plot_name', 'plots.plot_number');
    
    if (filters.plot_id) {
      query = query.where('sensor_data.plot_id', filters.plot_id);
    }
    
    if (filters.start_date) {
      query = query.where('sensor_data.timestamp', '>=', filters.start_date);
    }
    
    if (filters.end_date) {
      query = query.where('sensor_data.timestamp', '<=', filters.end_date);
    }
    
    return await query.orderBy('sensor_data.timestamp', 'desc');
  }

  async getAverageByPlotId(plotId, hours = 24) {
    const db = getDatabase();
    const startTime = new Date(Date.now() - hours * 60 * 60 * 1000);
    
    return await db(this.tableName)
      .where('plot_id', plotId)
      .where('timestamp', '>=', startTime)
      .select(
        db.raw('AVG(temperature) as avg_temperature'),
        db.raw('AVG(humidity) as avg_humidity'),
        db.raw('AVG(soil_moisture) as avg_soil_moisture'),
        db.raw('COUNT(*) as reading_count')
      )
      .first();
  }

  async getMinMaxByPlotId(plotId, hours = 24) {
    const db = getDatabase();
    const startTime = new Date(Date.now() - hours * 60 * 60 * 1000);
    
    return await db(this.tableName)
      .where('plot_id', plotId)
      .where('timestamp', '>=', startTime)
      .select(
        db.raw('MIN(temperature) as min_temperature'),
        db.raw('MAX(temperature) as max_temperature'),
        db.raw('MIN(humidity) as min_humidity'),
        db.raw('MAX(humidity) as max_humidity'),
        db.raw('MIN(soil_moisture) as min_soil_moisture'),
        db.raw('MAX(soil_moisture) as max_soil_moisture')
      )
      .first();
  }

  async delete(id) {
    const db = getDatabase();
    return await db(this.tableName).where('id', id).del();
  }

  async deleteOldData(daysOld = 30) {
    const db = getDatabase();
    const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);
    
    return await db(this.tableName)
      .where('timestamp', '<', cutoffDate)
      .del();
  }
}

module.exports = new SensorData();
