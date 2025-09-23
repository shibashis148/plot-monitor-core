import React from 'react';
import { Activity, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { formatRelativeTime } from '../../utils/helpers';
import './RecentActivity.css';

const RecentActivity = () => {
  const { alerts, sensorData } = useApp();

  // Combine and sort recent activities
  const recentActivities = React.useMemo(() => {
    const activities = [];

    // Add recent alerts
    alerts.slice(0, 10).forEach(alert => {
      activities.push({
        id: `alert-${alert.id}`,
        type: 'alert',
        title: `${alert.alert_type.replace('_', ' ')} Alert`,
        description: alert.message,
        timestamp: alert.created_at,
        severity: alert.severity,
        status: alert.status,
        plotId: alert.plot_id,
      });
    });

    // Add recent sensor data (if available)
    sensorData.slice(0, 5).forEach(data => {
      activities.push({
        id: `sensor-${data.id}`,
        type: 'sensor',
        title: 'Sensor Reading',
        description: `Temperature: ${data.temperature}°C, Humidity: ${data.humidity}%, Soil: ${data.soil_moisture}%`,
        timestamp: data.timestamp,
        plotId: data.plot_id,
      });
    });

    // Sort by timestamp (most recent first)
    return activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 10);
  }, [alerts, sensorData]);

  const getActivityIcon = (activity) => {
    switch (activity.type) {
      case 'alert':
        if (activity.severity === 'critical') {
          return <AlertTriangle className="activity-icon critical" size={16} />;
        }
        return <AlertTriangle className="activity-icon warning" size={16} />;
      case 'sensor':
        return <Activity className="activity-icon info" size={16} />;
      default:
        return <CheckCircle className="activity-icon success" size={16} />;
    }
  };

  const getActivityColor = (activity) => {
    switch (activity.type) {
      case 'alert':
        if (activity.severity === 'critical') return '#ef4444';
        if (activity.severity === 'high') return '#f59e0b';
        return '#3b82f6';
      case 'sensor':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  return (
    <div className="recent-activity">
      <div className="recent-activity-header">
        <h2>Recent Activity</h2>
        <div className="activity-stats">
          <div className="stat-item">
            <TrendingUp className="stat-icon" size={16} />
            <span>Last 24h</span>
          </div>
        </div>
      </div>

      <div className="activity-list">
        {recentActivities.length === 0 ? (
          <div className="no-activity">
            <Activity className="no-activity-icon" size={48} />
            <p>No recent activity</p>
            <p className="no-activity-subtitle">Activity will appear here as it happens</p>
          </div>
        ) : (
          <div className="activity-timeline">
            {recentActivities.map((activity, index) => (
              <div key={activity.id} className="activity-item">
                <div className="activity-indicator">
                  <div
                    className="activity-dot"
                    style={{ backgroundColor: getActivityColor(activity) }}
                  />
                  {index < recentActivities.length - 1 && (
                    <div className="activity-line" />
                  )}
                </div>
                
                <div className="activity-content">
                  <div className="activity-header">
                    <div className="activity-title">
                      {getActivityIcon(activity)}
                      <span>{activity.title}</span>
                    </div>
                    <div className="activity-time">
                      {formatRelativeTime(activity.timestamp)}
                    </div>
                  </div>
                  
                  <div className="activity-description">
                    {activity.description}
                  </div>
                  
                  <div className="activity-meta">
                    <span className="activity-plot">
                      Plot: {activity.plotId?.slice(0, 8)}...
                    </span>
                    {activity.severity && (
                      <span className={`activity-severity ${activity.severity}`}>
                        {activity.severity.toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
