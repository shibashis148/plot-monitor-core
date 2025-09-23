/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  await knex('alerts').del();
  await knex('sensor_data').del();
  await knex('plots').del();
  await knex('farms').del();
  
  const farms = await knex('farms').insert([
    {
      id: knex.raw('gen_random_uuid()'),
      name: 'Green Valley Farm',
      owner_name: 'John Smith',
      location: knex.raw('ST_GeomFromText(?, 4326)', ['POINT(-74.0060 40.7128)']),
      boundary: knex.raw('ST_GeomFromText(?, 4326)', ['POLYGON((-74.0100 40.7100, -74.0020 40.7100, -74.0020 40.7150, -74.0100 40.7150, -74.0100 40.7100))']),
      total_area: 5000.00,
      created_at: new Date(),
    },
    {
      id: knex.raw('gen_random_uuid()'),
      name: 'Sunrise Agriculture',
      owner_name: 'Sarah Johnson',
      location: knex.raw('ST_GeomFromText(?, 4326)', ['POINT(-73.9851 40.7589)']),
      boundary: knex.raw('ST_GeomFromText(?, 4326)', ['POLYGON((-73.9900 40.7550, -73.9800 40.7550, -73.9800 40.7620, -73.9900 40.7620, -73.9900 40.7550))']),
      total_area: 3200.50,
      created_at: new Date(),
    }
  ]).returning('*');

  const plots = await knex('plots').insert([
    {
      id: knex.raw('gen_random_uuid()'),
      farm_id: farms[0].id,
      name: 'North Field Plot A',
      plot_number: 'A1',
      boundary: knex.raw('ST_GeomFromText(?, 4326)', ['POLYGON((-74.0080 40.7120, -74.0040 40.7120, -74.0040 40.7140, -74.0080 40.7140, -74.0080 40.7120))']),
      area: 2500.00,
      crop_type: 'Corn',
      status: 'healthy',
      alert_thresholds: JSON.stringify({
        temperature: { min: 10, max: 35 },
        humidity: { min: 30, max: 80 },
        soil_moisture: { min: 20, max: 80 }
      }),
      created_at: new Date(),
    },
    {
      id: knex.raw('gen_random_uuid()'),
      farm_id: farms[0].id,
      name: 'South Field Plot B',
      plot_number: 'B1',
      boundary: knex.raw('ST_GeomFromText(?, 4326)', ['POLYGON((-74.0080 40.7100, -74.0040 40.7100, -74.0040 40.7120, -74.0080 40.7120, -74.0080 40.7100))']),
      area: 1200.75,
      crop_type: 'Tomatoes',
      status: 'warning',
      alert_thresholds: JSON.stringify({
        temperature: { min: 15, max: 30 },
        humidity: { min: 40, max: 70 },
        soil_moisture: { min: 25, max: 75 }
      }),
      created_at: new Date(),
    },
    {
      id: knex.raw('gen_random_uuid()'),
      farm_id: farms[1].id,
      name: 'East Field Plot C',
      plot_number: 'C1',
      boundary: knex.raw('ST_GeomFromText(?, 4326)', ['POLYGON((-73.9880 40.7580, -73.9840 40.7580, -73.9840 40.7600, -73.9880 40.7600, -73.9880 40.7580))']),
      area: 800.25,
      crop_type: 'Lettuce',
      status: 'critical',
      alert_thresholds: JSON.stringify({
        temperature: { min: 12, max: 25 },
        humidity: { min: 50, max: 85 },
        soil_moisture: { min: 30, max: 70 }
      }),
      created_at: new Date(),
    },
    {
      id: knex.raw('gen_random_uuid()'),
      farm_id: farms[1].id,
      name: 'West Field Plot D',
      plot_number: 'D1',
      boundary: knex.raw('ST_GeomFromText(?, 4326)', ['POLYGON((-73.9880 40.7600, -73.9840 40.7600, -73.9840 40.7620, -73.9880 40.7620, -73.9880 40.7600))']),
      area: 600.00,
      crop_type: 'Carrots',
      status: 'healthy',
      alert_thresholds: JSON.stringify({
        temperature: { min: 8, max: 28 },
        humidity: { min: 35, max: 75 },
        soil_moisture: { min: 20, max: 80 }
      }),
      created_at: new Date(),
    }
  ]).returning('*');

  const sensorData = [];
  const now = new Date();
  
  for (const plot of plots) {
    for (let i = 0; i < 48; i++) {
      const timestamp = new Date(now.getTime() - (i * 60 * 60 * 1000));

      const baseTemp = 22 + Math.sin(i * 0.1) * 5;
      const baseHumidity = 60 + Math.sin(i * 0.15) * 15;
      const baseSoilMoisture = 50 + Math.sin(i * 0.2) * 20;
      const tempVariation = (Math.random() - 0.5) * 4;
      const humidityVariation = (Math.random() - 0.5) * 10;
      const soilVariation = (Math.random() - 0.5) * 15;
      
      let temperature = baseTemp + tempVariation;
      let humidity = baseHumidity + humidityVariation;
      let soilMoisture = baseSoilMoisture + soilVariation;
      
      if (plot.status === 'warning' && i < 24) {
        temperature = 32 + Math.random() * 5;
      }
      
      if (plot.status === 'critical' && i < 12) {
        soilMoisture = 15 + Math.random() * 10;
      }
      
      sensorData.push({
        id: knex.raw('gen_random_uuid()'),
        plot_id: plot.id,
        temperature: Math.round(temperature * 100) / 100,
        humidity: Math.round(humidity * 100) / 100,
        soil_moisture: Math.round(soilMoisture * 100) / 100,
        timestamp: timestamp,
      });
    }
  }
  
  await knex('sensor_data').insert(sensorData);
  
  const alerts = [];
  
  const warningPlot = plots.find(p => p.status === 'warning');
  if (warningPlot) {
    alerts.push({
      id: knex.raw('gen_random_uuid()'),
      plot_id: warningPlot.id,
      alert_type: 'temperature',
      message: 'Temperature is 35.2°C, above maximum threshold of 30°C',
      severity: 'high',
      status: 'active',
      delivered_at: new Date(Date.now() - 2 * 60 * 60 * 1000),
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000),
    });
  }
  
  const criticalPlot = plots.find(p => p.status === 'critical');
  if (criticalPlot) {
    alerts.push({
      id: knex.raw('gen_random_uuid()'),
      plot_id: criticalPlot.id,
      alert_type: 'soil_moisture',
      message: 'Soil moisture is 18.5%, below minimum threshold of 30%',
      severity: 'critical',
      status: 'active',
      delivered_at: new Date(Date.now() - 1 * 60 * 60 * 1000),
      created_at: new Date(Date.now() - 1 * 60 * 60 * 1000),
    });
    
    alerts.push({
      id: knex.raw('gen_random_uuid()'),
      plot_id: criticalPlot.id,
      alert_type: 'temperature',
      message: 'Temperature is 26.8°C, approaching maximum threshold of 25°C',
      severity: 'medium',
      status: 'acknowledged',
      delivered_at: new Date(Date.now() - 3 * 60 * 60 * 1000),
      acknowledged_at: new Date(Date.now() - 2 * 60 * 60 * 1000),
      created_at: new Date(Date.now() - 3 * 60 * 60 * 1000),
    });
  }
  
  if (alerts.length > 0) {
    await knex('alerts').insert(alerts);
  }
};
