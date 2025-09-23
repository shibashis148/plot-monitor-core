const { getDatabase } = require('../config/database');

class Alert {
  constructor() {
    this.tableName = 'alerts';
  }

  async create(alertData) {
    const db = getDatabase();
    const [alert] = await db(this.tableName)
      .insert({
        ...alertData,
        created_at: new Date(),
      })
      .returning('*');
    return alert;
  }

  async findById(id) {
    const db = getDatabase();
    return await db(this.tableName)
      .join('plots', 'alerts.plot_id', 'plots.id')
      .join('farms', 'plots.farm_id', 'farms.id')
      .select(
        'alerts.*',
        'plots.name as plot_name',
        'plots.plot_number',
        'farms.name as farm_name',
        'farms.owner_name'
      )
      .where('alerts.id', id)
      .first();
  }

  async findByPlotId(plotId) {
    const db = getDatabase();
    return await db(this.tableName)
      .join('plots', 'alerts.plot_id', 'plots.id')
      .join('farms', 'plots.farm_id', 'farms.id')
      .select(
        'alerts.*',
        'plots.name as plot_name',
        'plots.plot_number',
        'farms.name as farm_name',
        'farms.owner_name'
      )
      .where('alerts.plot_id', plotId)
      .orderBy('alerts.created_at', 'desc');
  }

  async findAll(filters = {}) {
    const db = getDatabase();
    let query = db(this.tableName)
      .join('plots', 'alerts.plot_id', 'plots.id')
      .join('farms', 'plots.farm_id', 'farms.id')
      .select(
        'alerts.*',
        'plots.name as plot_name',
        'plots.plot_number',
        'farms.name as farm_name',
        'farms.owner_name'
      );
    
    if (filters.plot_id) {
      query = query.where('alerts.plot_id', filters.plot_id);
    }
    
    if (filters.status) {
      query = query.where('alerts.status', filters.status);
    }
    
    if (filters.severity) {
      query = query.where('alerts.severity', filters.severity);
    }
    
    if (filters.alert_type) {
      query = query.where('alerts.alert_type', filters.alert_type);
    }
    
    return await query.orderBy('alerts.created_at', 'desc');
  }

  async findActive() {
    const db = getDatabase();
    return await db(this.tableName)
      .join('plots', 'alerts.plot_id', 'plots.id')
      .join('farms', 'plots.farm_id', 'farms.id')
      .select(
        'alerts.*',
        'plots.name as plot_name',
        'plots.plot_number',
        'farms.name as farm_name',
        'farms.owner_name'
      )
      .where('alerts.status', 'active')
      .orderBy('alerts.created_at', 'desc');
  }

  async findUnacknowledged() {
    const db = getDatabase();
    return await db(this.tableName)
      .join('plots', 'alerts.plot_id', 'plots.id')
      .join('farms', 'plots.farm_id', 'farms.id')
      .select(
        'alerts.*',
        'plots.name as plot_name',
        'plots.plot_number',
        'farms.name as farm_name',
        'farms.owner_name'
      )
      .where('alerts.status', 'active')
      .whereNull('alerts.acknowledged_at')
      .orderBy('alerts.created_at', 'desc');
  }

  async acknowledge(id) {
    const db = getDatabase();
    const [alert] = await db(this.tableName)
      .where('id', id)
      .update({
        status: 'acknowledged',
        acknowledged_at: new Date(),
      })
      .returning('*');
    return alert;
  }

  async dismiss(id) {
    const db = getDatabase();
    const [alert] = await db(this.tableName)
      .where('id', id)
      .update({
        status: 'dismissed',
        acknowledged_at: new Date(),
      })
      .returning('*');
    return alert;
  }

  async markAsDelivered(id) {
    const db = getDatabase();
    const [alert] = await db(this.tableName)
      .where('id', id)
      .update({
        delivered_at: new Date(),
      })
      .returning('*');
    return alert;
  }

  async update(id, updateData) {
    const db = getDatabase();
    const [alert] = await db(this.tableName)
      .where('id', id)
      .update(updateData)
      .returning('*');
    return alert;
  }

  async delete(id) {
    const db = getDatabase();
    return await db(this.tableName).where('id', id).del();
  }

  async getAlertStats() {
    const db = getDatabase();
    return await db(this.tableName)
      .select(
        db.raw('COUNT(*) as total_alerts'),
        db.raw('COUNT(CASE WHEN status = ? THEN 1 END) as active_alerts', ['active']),
        db.raw('COUNT(CASE WHEN status = ? THEN 1 END) as acknowledged_alerts', ['acknowledged']),
        db.raw('COUNT(CASE WHEN status = ? THEN 1 END) as dismissed_alerts', ['dismissed']),
        db.raw('COUNT(CASE WHEN severity = ? THEN 1 END) as critical_alerts', ['critical']),
        db.raw('COUNT(CASE WHEN severity = ? THEN 1 END) as high_alerts', ['high']),
        db.raw('COUNT(CASE WHEN severity = ? THEN 1 END) as medium_alerts', ['medium']),
        db.raw('COUNT(CASE WHEN severity = ? THEN 1 END) as low_alerts', ['low'])
      )
      .first();
  }

  async findDuplicateAlert(plotId, alertType, severity, condition = null) {
    const db = getDatabase();
    
    let query = db(this.tableName)
      .where('plot_id', plotId)
      .where('alert_type', alertType)
      .where('severity', severity)
      .where('status', 'active');
    
    if (condition) {
      query = query.where('message', 'like', `%${condition}%`);
    }
    
    return await query.first();
  }

  async findActiveAlertForCondition(plotId, alertType, condition) {
    const db = getDatabase();
    
    return await db(this.tableName)
      .where('plot_id', plotId)
      .where('alert_type', alertType)
      .where('status', 'active')
      .where('message', 'like', `%${condition}%`)
      .first();
  }
}

module.exports = new Alert();
