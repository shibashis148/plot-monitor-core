import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import './Settings.css';

const Settings = () => {
  return (
    <div className="settings">
      <div className="settings-header">
        <SettingsIcon className="header-icon" size={32} />
        <div>
          <h1>Settings</h1>
          <p>Configure your farm monitoring preferences</p>
        </div>
      </div>

      <div className="settings-content">
        <div className="coming-soon">
          <SettingsIcon className="coming-soon-icon" size={64} />
          <h2>Settings Panel</h2>
          <p>Application settings and configuration options will be available here.</p>
          <div className="features-list">
            <div className="feature-item">
              <span className="feature-icon">⚙️</span>
              <span>Alert thresholds configuration</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🔔</span>
              <span>Notification preferences</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🌐</span>
              <span>API configuration</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">👤</span>
              <span>User profile settings</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🎨</span>
              <span>Theme customization</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
