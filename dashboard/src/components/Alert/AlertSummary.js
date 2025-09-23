import React from 'react';
import { AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { formatRelativeTime, getStatusColor } from '../../utils/helpers';
import './AlertSummary.css';

const AlertSummary = () => {
  const { alerts, acknowledgeAlert, dismissAlert } = useApp();

  const activeAlerts = alerts.filter(alert => alert.status === 'active');
  const unacknowledgedAlerts = activeAlerts.filter(alert => !alert.acknowledged_at);
  const criticalAlerts = activeAlerts.filter(alert => alert.severity === 'critical');
  const highAlerts = activeAlerts.filter(alert => alert.severity === 'high');

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="severity-icon critical" size={16} />;
      case 'high':
        return <AlertTriangle className="severity-icon high" size={16} />;
      case 'medium':
        return <AlertTriangle className="severity-icon medium" size={16} />;
      case 'low':
        return <CheckCircle className="severity-icon low" size={16} />;
      default:
        return <AlertTriangle className="severity-icon" size={16} />;
    }
  };

  const getAlertTypeColor = (alertType) => {
    const colors = {
      temperature: '#ef4444',
      humidity: '#3b82f6',
      soil_moisture: '#10b981',
      pest: '#f59e0b',
      disease: '#8b5cf6',
      weather: '#06b6d4',
    };
    return colors[alertType] || '#6b7280';
  };

  const handleAcknowledge = async (alertId, e) => {
    e.stopPropagation();
    try {
      await acknowledgeAlert(alertId);
    } catch (error) {
      console.error('Error acknowledging alert:', error);
    }
  };

  const handleDismiss = async (alertId, e) => {
    e.stopPropagation();
    try {
      await dismissAlert(alertId);
    } catch (error) {
      console.error('Error dismissing alert:', error);
    }
  };

  return (
    <div className="alert-summary">
      <div className="alert-summary-header">
        <h2>Alert Summary</h2>
        <div className="alert-stats">
          <div className="stat-item">
            <span className="stat-label">Active:</span>
            <span className="stat-value active">{activeAlerts.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Critical:</span>
            <span className="stat-value critical">{criticalAlerts.length}</span>
          </div>
        </div>
      </div>

      <div className="alert-list">
        {unacknowledgedAlerts.length === 0 ? (
          <div className="no-alerts">
            <CheckCircle className="no-alerts-icon" size={48} />
            <p>No active alerts</p>
            <p className="no-alerts-subtitle">All systems are running normally</p>
          </div>
        ) : (
          unacknowledgedAlerts.slice(0, 5).map((alert) => (
            <div key={alert.id} className={`alert-item ${alert.severity}`}>
              <div className="alert-header">
                <div className="alert-type">
                  <div
                    className="alert-type-indicator"
                    style={{ backgroundColor: getAlertTypeColor(alert.alert_type) }}
                  />
                  <span className="alert-type-text">
                    {alert.alert_type.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <div className="alert-severity">
                  {getSeverityIcon(alert.severity)}
                  <span className="severity-text">{alert.severity}</span>
                </div>
              </div>

              <div className="alert-content">
                <p className="alert-message">{alert.message}</p>
                <div className="alert-meta">
                  <div className="alert-time">
                    <Clock className="time-icon" size={12} />
                    <span>{formatRelativeTime(alert.created_at)}</span>
                  </div>
                  <div className="alert-plot">
                    Plot ID: {alert.plot_id?.slice(0, 8)}...
                  </div>
                </div>
              </div>

              <div className="alert-actions">
                <button
                  className="action-button acknowledge"
                  onClick={(e) => handleAcknowledge(alert.id, e)}
                >
                  Acknowledge
                </button>
                <button
                  className="action-button dismiss"
                  onClick={(e) => handleDismiss(alert.id, e)}
                >
                  Dismiss
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {unacknowledgedAlerts.length > 5 && (
        <div className="alert-footer">
          <button className="view-all-button">
            View All Alerts ({unacknowledgedAlerts.length})
          </button>
        </div>
      )}
    </div>
  );
};

export default AlertSummary;
