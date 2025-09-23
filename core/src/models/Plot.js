const { getDatabase } = require('../config/database');

class Plot {
  constructor() {
    this.tableName = 'plots';
  }

  async create(plotData) {
    const db = getDatabase();
    
    const processedData = { ...plotData };
    if (plotData.boundary && typeof plotData.boundary === 'object') {
      processedData.boundary = db.raw('ST_GeomFromGeoJSON(?)', [JSON.stringify(plotData.boundary)]);
    }
    
    const [plot] = await db(this.tableName)
      .insert({
        ...processedData,
        created_at: new Date(),
      })
      .returning('*');
    return plot;
  }

  async findById(id) {
    const db = getDatabase();
    return await db(this.tableName)
      .join('farms', 'plots.farm_id', 'farms.id')
      .select(
        'plots.id',
        'plots.farm_id',
        'plots.name',
        'plots.plot_number',
        db.raw('ST_AsGeoJSON(plots.boundary) as boundary'),
        'plots.area',
        'plots.crop_type',
        'plots.status',
        'plots.alert_thresholds',
        'plots.created_at',
        'farms.name as farm_name',
        'farms.owner_name'
      )
      .where('plots.id', id)
      .first();
  }

  async findAll(filters = {}) {
    const db = getDatabase();
    let query = db(this.tableName)
      .join('farms', 'plots.farm_id', 'farms.id')
      .select(
        'plots.id',
        'plots.farm_id',
        'plots.name',
        'plots.plot_number',
        db.raw('ST_AsGeoJSON(plots.boundary) as boundary'),
        'plots.area',
        'plots.crop_type',
        'plots.status',
        'plots.alert_thresholds',
        'plots.created_at',
        'farms.name as farm_name',
        'farms.owner_name'
      );
    
    if (filters.farm_id) {
      query = query.where('plots.farm_id', filters.farm_id);
    }
    
    if (filters.status) {
      query = query.where('plots.status', filters.status);
    }
    
    if (filters.crop_type) {
      query = query.where('plots.crop_type', filters.crop_type);
    }
    
    return await query.orderBy('plots.created_at', 'desc');
  }

  async findByFarmId(farmId) {
    const db = getDatabase();
    const results = await db(this.tableName)
      .join('farms', 'plots.farm_id', 'farms.id')
      .select(
        'plots.id',
        'plots.farm_id',
        'plots.name',
        'plots.plot_number',
        db.raw('ST_AsGeoJSON(plots.boundary) as boundary'),
        'plots.area',
        'plots.crop_type',
        'plots.status',
        'plots.alert_thresholds',
        'plots.created_at',
        'farms.name as farm_name',
        'farms.owner_name'
      )
      .where('plots.farm_id', farmId)
      .orderBy('plots.plot_number', 'asc');

    return results.map(plot => ({
      ...plot,
      area: parseFloat(plot.area) || 0,
      boundary: plot.boundary ? JSON.parse(plot.boundary) : null,
      alert_thresholds: plot.alert_thresholds ? 
        (typeof plot.alert_thresholds === 'string' ? 
          JSON.parse(plot.alert_thresholds) : 
          plot.alert_thresholds) : 
        null
    }));
  }

  async update(id, updateData) {
    const db = getDatabase();
    const [plot] = await db(this.tableName)
      .where('id', id)
      .update(updateData)
      .returning('*');
    return plot;
  }

  async delete(id) {
    const db = getDatabase();
    return await db(this.tableName).where('id', id).del();
  }

  async findByStatus(status) {
    const db = getDatabase();
    return await db(this.tableName)
      .join('farms', 'plots.farm_id', 'farms.id')
      .select('plots.*', 'farms.name as farm_name', 'farms.owner_name')
      .where('plots.status', status)
      .orderBy('plots.created_at', 'desc');
  }

  async findByCropType(cropType) {
    const db = getDatabase();
    return await db(this.tableName)
      .join('farms', 'plots.farm_id', 'farms.id')
      .select('plots.*', 'farms.name as farm_name', 'farms.owner_name')
      .where('plots.crop_type', cropType)
      .orderBy('plots.created_at', 'desc');
  }

  async updateStatus(id, status) {
    const db = getDatabase();
    const [plot] = await db(this.tableName)
      .where('id', id)
      .update({ status })
      .returning('*');
    return plot;
  }
}

module.exports = new Plot();
