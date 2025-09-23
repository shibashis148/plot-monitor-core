import React from 'react';
import { BarChart3, MapPin, Droplets, Thermometer, Gauge, Settings, TrendingUp } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { getStatusColor, formatSensorValue } from '../../utils/helpers';
import SensorDataChart from '../Chart/SensorDataChart';
import ThresholdPanel from '../Threshold/ThresholdPanel';
import './PlotList.css';

const PlotList = () => {
  const { 
    plots, 
    farms, 
    selectedFarm, 
    selectedPlot,
    setSelectedFarm, 
    setSelectedPlot,
    fetchFarmPlots 
  } = useApp();

  const [selectedFarmId, setSelectedFarmId] = React.useState(selectedFarm?.id || '');
  const [showThresholdPanel, setShowThresholdPanel] = React.useState(false);
  const [showChart, setShowChart] = React.useState(false);

  React.useEffect(() => {
    if (selectedFarmId && selectedFarmId !== selectedFarm?.id && farms.length > 0) {
      const farm = farms.find(f => f.id === selectedFarmId);
      if (farm) {
        setSelectedFarm(farm);
        fetchFarmPlots(selectedFarmId);
      }
    }
  }, [selectedFarmId, selectedFarm?.id, setSelectedFarm, fetchFarmPlots]); // Removed farms from deps

  const handleFarmChange = (farmId) => {
    setSelectedFarmId(farmId);
  };

  const handlePlotSelect = (plot) => {
    setSelectedPlot(plot);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return <div className="status-icon healthy">●</div>;
      case 'warning':
        return <div className="status-icon warning">●</div>;
      case 'critical':
        return <div className="status-icon critical">●</div>;
      default:
        return <div className="status-icon">●</div>;
    }
  };

  const getCropIcon = (cropType) => {
    switch (cropType?.toLowerCase()) {
      case 'corn':
        return '🌽';
      case 'wheat':
        return '🌾';
      case 'tomatoes':
        return '🍅';
      case 'lettuce':
        return '🥬';
      case 'carrots':
        return '🥕';
      case 'potatoes':
        return '🥔';
      default:
        return '🌱';
    }
  };

  return (
    <div className="plot-list">
      <div className="plot-list-header">
        <h2>Plot Management</h2>
        
        {/* Farm Selector */}
        <div className="farm-selector">
          <label htmlFor="farm-select">Select Farm:</label>
          <select
            id="farm-select"
            value={selectedFarmId}
            onChange={(e) => handleFarmChange(e.target.value)}
            className="farm-select"
          >
            <option value="">Choose a farm...</option>
            {farms.map((farm) => (
              <option key={farm.id} value={farm.id}>
                {farm.name} ({farm.owner_name})
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedFarmId ? (
        <div className="plot-content">
          <div className="selected-farm-info">
            <h3>{selectedFarm?.name}</h3>
            <p>Owner: {selectedFarm?.owner_name}</p>
            <p>Total Area: {selectedFarm?.total_area} m²</p>
          </div>

          <div className="plots-grid">
            {plots.length === 0 ? (
              <div className="no-plots">
                <BarChart3 className="no-plots-icon" size={48} />
                <p>No plots found for this farm</p>
                <p className="no-plots-subtitle">Add plots to start monitoring</p>
              </div>
            ) : (
              plots.map((plot) => (
                <div
                  key={plot.id}
                  className={`plot-card ${plot.status}`}
                  onClick={() => handlePlotSelect(plot)}
                >
                  <div className="plot-header">
                    <div className="plot-info">
                      <h4 className="plot-name">{plot.name}</h4>
                      <p className="plot-number">Plot #{plot.plot_number}</p>
                    </div>
                    <div className="plot-status">
                      {getStatusIcon(plot.status)}
                      <span className="status-text">{plot.status}</span>
                    </div>
                  </div>

                  <div className="plot-details">
                    <div className="plot-metrics">
                      <div className="metric">
                        <MapPin className="metric-icon" size={16} />
                        <span className="metric-label">Area:</span>
                        <span className="metric-value">{plot.area} m²</span>
                      </div>
                      <div className="metric">
                        <span className="crop-icon">{getCropIcon(plot.crop_type)}</span>
                        <span className="metric-label">Crop:</span>
                        <span className="metric-value">{plot.crop_type || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="plot-sensor-summary">
                      <div className="sensor-item">
                        <Thermometer className="sensor-icon temperature" size={14} />
                        <span className="sensor-label">Temp</span>
                        <span className="sensor-value">--°C</span>
                      </div>
                      <div className="sensor-item">
                        <Droplets className="sensor-icon humidity" size={14} />
                        <span className="sensor-label">Humidity</span>
                        <span className="sensor-value">--%</span>
                      </div>
                      <div className="sensor-item">
                        <Gauge className="sensor-icon soil" size={14} />
                        <span className="sensor-label">Soil</span>
                        <span className="sensor-value">--%</span>
                      </div>
                    </div>

                    {plot.alert_thresholds && (
                      <div className="plot-thresholds">
                        <h5>Alert Thresholds:</h5>
                        <div className="thresholds-grid">
                          {plot.alert_thresholds.temperature && (
                            <div className="threshold">
                              <span className="threshold-label">Temp:</span>
                              <span className="threshold-value">
                                {plot.alert_thresholds.temperature.min}°C - {plot.alert_thresholds.temperature.max}°C
                              </span>
                            </div>
                          )}
                          {plot.alert_thresholds.humidity && (
                            <div className="threshold">
                              <span className="threshold-label">Humidity:</span>
                              <span className="threshold-value">
                                {plot.alert_thresholds.humidity.min}% - {plot.alert_thresholds.humidity.max}%
                              </span>
                            </div>
                          )}
                          {plot.alert_thresholds.soil_moisture && (
                            <div className="threshold">
                              <span className="threshold-label">Soil:</span>
                              <span className="threshold-value">
                                {plot.alert_thresholds.soil_moisture.min}% - {plot.alert_thresholds.soil_moisture.max}%
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="plot-actions">
                    <button 
                      className="action-button primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlotSelect(plot);
                        setShowChart(true);
                      }}
                    >
                      <TrendingUp size={16} />
                      View Chart
                    </button>
                    <button 
                      className="action-button secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlotSelect(plot);
                        setShowThresholdPanel(true);
                      }}
                    >
                      <Settings size={16} />
                      Thresholds
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="no-farm-selected">
          <MapPin className="no-farm-icon" size={64} />
          <h3>Select a Farm</h3>
          <p>Choose a farm from the dropdown above to view its plots</p>
        </div>
      )}

      {/* Sensor Data Chart Modal */}
      {showChart && selectedPlot && (
        <div className="chart-modal-overlay">
          <div className="chart-modal">
            <div className="chart-modal-header">
              <h3>Sensor Data Chart</h3>
              <button 
                onClick={() => setShowChart(false)}
                className="close-button"
              >
                ×
              </button>
            </div>
            <div className="chart-modal-content">
              <SensorDataChart 
                plotId={selectedPlot.id} 
                plotName={selectedPlot.name}
              />
            </div>
          </div>
        </div>
      )}

      {/* Threshold Panel Modal */}
      {showThresholdPanel && selectedPlot && (
        <ThresholdPanel
          plotId={selectedPlot.id}
          plotName={selectedPlot.name}
          onClose={() => setShowThresholdPanel(false)}
        />
      )}
    </div>
  );
};

export default PlotList;
