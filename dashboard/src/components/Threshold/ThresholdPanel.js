import React, { useState, useEffect } from 'react';
import { Settings, Save, RotateCcw, Thermometer, Droplets, Gauge } from 'lucide-react';
import { plotService } from '../../services/plotService';
import { useApp } from '../../contexts/AppContext';
import toast from 'react-hot-toast';
import './ThresholdPanel.css';

const ThresholdPanel = ({ plotId, plotName, onClose }) => {
  const { selectedPlot } = useApp();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [thresholds, setThresholds] = useState({
    temperature: { min: 15, max: 35 },
    humidity: { min: 40, max: 80 },
    soil_moisture: { min: 30, max: 70 }
  });

  useEffect(() => {
    if (selectedPlot?.alert_thresholds) {
      setThresholds(selectedPlot.alert_thresholds);
    }
  }, [selectedPlot]);

  const handleThresholdChange = (sensor, type, value) => {
    setThresholds(prev => ({
      ...prev,
      [sensor]: {
        ...prev[sensor],
        [type]: parseFloat(value) || 0
      }
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await plotService.updateThresholds(plotId, { alert_thresholds: thresholds });
      toast.success('Thresholds updated successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to update thresholds: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setThresholds({
      temperature: { min: 15, max: 35 },
      humidity: { min: 40, max: 80 },
      soil_moisture: { min: 30, max: 70 }
    });
    toast.success('Thresholds reset to defaults');
  };

  const ThresholdInput = ({ sensor, label, icon: Icon, min, max, unit }) => (
    <div className="threshold-input-group">
      <div className="threshold-header">
        <Icon className="threshold-icon" />
        <span className="threshold-label">{label}</span>
      </div>
      
      <div className="threshold-inputs">
        <div className="input-field">
          <label>Minimum {unit}</label>
          <input
            type="number"
            value={thresholds[sensor].min}
            onChange={(e) => handleThresholdChange(sensor, 'min', e.target.value)}
            min={min}
            max={max}
            step="0.1"
            className="threshold-input"
          />
        </div>
        
        <div className="input-field">
          <label>Maximum {unit}</label>
          <input
            type="number"
            value={thresholds[sensor].max}
            onChange={(e) => handleThresholdChange(sensor, 'max', e.target.value)}
            min={min}
            max={max}
            step="0.1"
            className="threshold-input"
          />
        </div>
      </div>
      
      <div className="threshold-range">
        <span className="range-label">Range:</span>
        <span className="range-value">
          {thresholds[sensor].min} - {thresholds[sensor].max} {unit}
        </span>
      </div>
    </div>
  );

  return (
    <div className="threshold-panel-overlay">
      <div className="threshold-panel">
        <div className="threshold-header">
          <div className="header-content">
            <Settings className="header-icon" />
            <div>
              <h2>Alert Thresholds</h2>
              <p>{plotName || 'Selected Plot'}</p>
            </div>
          </div>
          <button onClick={onClose} className="close-button">
            ×
          </button>
        </div>

        <div className="threshold-content">
          <div className="threshold-description">
            <p>
              Set the minimum and maximum values for each sensor type. 
              Alerts will be triggered when sensor readings fall outside these ranges.
            </p>
          </div>

          <div className="threshold-sections">
            <ThresholdInput
              sensor="temperature"
              label="Temperature"
              icon={Thermometer}
              min={-50}
              max={100}
              unit="°C"
            />

            <ThresholdInput
              sensor="humidity"
              label="Humidity"
              icon={Droplets}
              min={0}
              max={100}
              unit="%"
            />

            <ThresholdInput
              sensor="soil_moisture"
              label="Soil Moisture"
              icon={Gauge}
              min={0}
              max={100}
              unit="%"
            />
          </div>
        </div>

        <div className="threshold-actions">
          <button
            onClick={handleReset}
            className="reset-button"
            disabled={saving}
          >
            <RotateCcw className="button-icon" />
            Reset to Defaults
          </button>
          
          <div className="action-buttons">
            <button
              onClick={onClose}
              className="cancel-button"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="save-button"
              disabled={saving}
            >
              <Save className="button-icon" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThresholdPanel;
