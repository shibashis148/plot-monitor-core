import React from 'react';
import { MapPin, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { getStatusColor, calculatePercentage } from '../../utils/helpers';
import './FarmOverview.css';

const FarmOverview = () => {
  const { farms, stats, setSelectedFarm } = useApp();

  const handleFarmSelect = (farm) => {
    setSelectedFarm(farm);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="status-icon healthy" size={16} />;
      case 'warning':
        return <AlertTriangle className="status-icon warning" size={16} />;
      case 'critical':
        return <AlertTriangle className="status-icon critical" size={16} />;
      default:
        return <CheckCircle className="status-icon" size={16} />;
    }
  };

  const getOverallStatus = (farm) => {
    if (farm.critical_plots > 0) return 'critical';
    if (farm.warning_plots > 0) return 'warning';
    return 'healthy';
  };

  return (
    <div className="farm-overview">
      <div className="farm-overview-header">
        <h2>Farm Overview</h2>
        <div className="farm-stats-summary">
          <div className="stat-item">
            <span className="stat-label">Total Farms:</span>
            <span className="stat-value">{stats.totalFarms}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Total Plots:</span>
            <span className="stat-value">{stats.totalPlots}</span>
          </div>
        </div>
      </div>

      <div className="farm-list">
        {farms.length === 0 ? (
          <div className="no-farms">
            <MapPin className="no-farms-icon" size={48} />
            <p>No farms found</p>
            <p className="no-farms-subtitle">Add your first farm to get started</p>
          </div>
        ) : (
          farms.map((farm) => {
            const overallStatus = getOverallStatus(farm);
            const healthyPercentage = calculatePercentage(farm.healthy_plots, farm.plot_count);
            const warningPercentage = calculatePercentage(farm.warning_plots, farm.plot_count);
            const criticalPercentage = calculatePercentage(farm.critical_plots, farm.plot_count);

            return (
              <div
                key={farm.id}
                className={`farm-card ${overallStatus}`}
                onClick={() => handleFarmSelect(farm)}
              >
                <div className="farm-card-header">
                  <div className="farm-info">
                    <h3 className="farm-name">{farm.name}</h3>
                    <p className="farm-owner">Owner: {farm.owner_name}</p>
                  </div>
                  <div className="farm-status">
                    {getStatusIcon(overallStatus)}
                    <span className="status-text">{overallStatus}</span>
                  </div>
                </div>

                <div className="farm-details">
                  <div className="farm-metrics">
                    <div className="metric">
                      <span className="metric-label">Total Area:</span>
                      <span className="metric-value">{farm.total_area} m²</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Plot Count:</span>
                      <span className="metric-value">{farm.plot_count || 0}</span>
                    </div>
                  </div>

                  <div className="plot-status-breakdown">
                    <div className="status-bar">
                      <div
                        className="status-segment healthy"
                        style={{ width: `${healthyPercentage}%` }}
                        title={`${farm.healthy_plots || 0} healthy plots`}
                      />
                      <div
                        className="status-segment warning"
                        style={{ width: `${warningPercentage}%` }}
                        title={`${farm.warning_plots || 0} warning plots`}
                      />
                      <div
                        className="status-segment critical"
                        style={{ width: `${criticalPercentage}%` }}
                        title={`${farm.critical_plots || 0} critical plots`}
                      />
                    </div>
                    
                    <div className="status-legend">
                      <div className="legend-item">
                        <div className="legend-color healthy"></div>
                        <span>Healthy ({farm.healthy_plots || 0})</span>
                      </div>
                      <div className="legend-item">
                        <div className="legend-color warning"></div>
                        <span>Warning ({farm.warning_plots || 0})</span>
                      </div>
                      <div className="legend-item">
                        <div className="legend-color critical"></div>
                        <span>Critical ({farm.critical_plots || 0})</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="farm-actions">
                  <button className="action-button primary">
                    View Details
                  </button>
                  <button className="action-button secondary">
                    Manage Plots
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default FarmOverview;
