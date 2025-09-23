const { getDatabase } = require('../config/database');

class Farm {
  constructor() {
    this.tableName = 'farms';
  }

  async create(farmData) {
    const db = getDatabase();
    
    const processedData = { ...farmData };
    if (farmData.location && typeof farmData.location === 'object') {
      processedData.location = db.raw('ST_GeomFromGeoJSON(?)', [JSON.stringify(farmData.location)]);
    }
    if (farmData.boundary && typeof farmData.boundary === 'object') {
      processedData.boundary = db.raw('ST_GeomFromGeoJSON(?)', [JSON.stringify(farmData.boundary)]);
    }
    
    const [farm] = await db(this.tableName)
      .insert({
        ...processedData,
        created_at: new Date(),
      })
      .returning('*');
    return farm;
  }

  async findById(id) {
    const db = getDatabase();
    return await db(this.tableName)
      .select(
        'id',
        'name',
        'owner_name',
        db.raw('ST_AsGeoJSON(location) as location'),
        db.raw('ST_AsGeoJSON(boundary) as boundary'),
        'total_area',
        'created_at'
      )
      .where('id', id)
      .first();
  }

  async findAll() {
    const db = getDatabase();
    return await db(this.tableName)
      .select(
        'id',
        'name',
        'owner_name',
        db.raw('ST_AsGeoJSON(location) as location'),
        db.raw('ST_AsGeoJSON(boundary) as boundary'),
        'total_area',
        'created_at'
      )
      .orderBy('created_at', 'desc');
  }

  async findAllWithPlotCounts() {
    const db = getDatabase();
    const results = await db(this.tableName)
      .leftJoin('plots', 'farms.id', 'plots.farm_id')
      .select(
        'farms.id',
        'farms.name',
        'farms.owner_name',
        db.raw('ST_AsGeoJSON(farms.location) as location'),
        db.raw('ST_AsGeoJSON(farms.boundary) as boundary'),
        'farms.total_area',
        'farms.created_at',
        db.raw('COUNT(plots.id) as plot_count'),
        db.raw('COUNT(CASE WHEN plots.status = ? THEN 1 END) as healthy_plots', ['healthy']),
        db.raw('COUNT(CASE WHEN plots.status = ? THEN 1 END) as warning_plots', ['warning']),
        db.raw('COUNT(CASE WHEN plots.status = ? THEN 1 END) as critical_plots', ['critical'])
      )
      .groupBy('farms.id', 'farms.name', 'farms.owner_name', 'farms.location', 'farms.boundary', 'farms.total_area', 'farms.created_at')
      .orderBy('farms.created_at', 'desc');

    return results.map(farm => {
      const warningPlots = parseInt(farm.warning_plots) || 0;
      const criticalPlots = parseInt(farm.critical_plots) || 0;
      
      return {
        ...farm,
        total_area: parseFloat(farm.total_area) || 0,
        plot_count: parseInt(farm.plot_count) || 0,
        healthy_plots: parseInt(farm.healthy_plots) || 0,
        warning_plots: warningPlots,
        critical_plots: criticalPlots,
        active_alerts: warningPlots + criticalPlots,
        location: farm.location ? JSON.parse(farm.location) : null,
        boundary: farm.boundary ? JSON.parse(farm.boundary) : null
      };
    });
  }

  async update(id, updateData) {
    const db = getDatabase();
    const [farm] = await db(this.tableName)
      .where('id', id)
      .update(updateData)
      .returning('*');
    return farm;
  }

  async delete(id) {
    const db = getDatabase();
    return await db(this.tableName).where('id', id).del();
  }

  async findByName(name) {
    const db = getDatabase();
    return await db(this.tableName)
      .where('name', 'ilike', `%${name}%`)
      .orderBy('created_at', 'desc');
  }

  async findByOwner(ownerName) {
    const db = getDatabase();
    return await db(this.tableName)
      .where('owner_name', 'ilike', `%${ownerName}%`)
      .orderBy('created_at', 'desc');
  }
}

module.exports = new Farm();
