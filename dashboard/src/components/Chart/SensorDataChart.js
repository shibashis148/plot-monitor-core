import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useApp } from '../../contexts/AppContext';
import { sensorService } from '../../services/sensorService';
import { format } from 'date-fns';
import './SensorDataChart.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SensorDataChart = ({ plotId, plotName }) => {
  const { sensorData, fetchPlotSensorData } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('24h');

  useEffect(() => {
    if (plotId) {
      fetchSensorData();
    }
  }, [plotId, timeRange]);

  const fetchSensorData = async () => {
    try {
      setLoading(true);
      setError(null);
      await fetchPlotSensorData(plotId);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    if (timeRange === '24h') {
      return format(date, 'HH:mm');
    } else if (timeRange === '7d') {
      return format(date, 'MMM dd');
    } else {
      return format(date, 'MMM dd HH:mm');
    }
  };

  const chartData = {
    labels: sensorData.map(item => formatTime(item.timestamp)),
    datasets: [
      {
        label: 'Temperature (°C)',
        data: sensorData.map(item => Number(item.temperature) || 0),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        tension: 0.1,
        yAxisID: 'y',
      },
      {
        label: 'Humidity (%)',
        data: sensorData.map(item => Number(item.humidity) || 0),
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.1)',
        tension: 0.1,
        yAxisID: 'y1',
      },
      {
        label: 'Soil Moisture (%)',
        data: sensorData.map(item => Number(item.soil_moisture) || 0),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        tension: 0.1,
        yAxisID: 'y1',
      },
    ],
  };

  const options = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      title: {
        display: true,
        text: `Sensor Data - ${plotName || 'Selected Plot'}`,
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          title: (context) => {
            const index = context[0].dataIndex;
            const timestamp = sensorData[index]?.timestamp;
            return timestamp ? format(new Date(timestamp), 'MMM dd, yyyy HH:mm') : '';
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Time'
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Temperature (°C)'
        },
        min: 0,
        max: 50
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Humidity & Soil Moisture (%)'
        },
        min: 0,
        max: 100,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="sensor-chart-loading">
        <div className="loading-spinner"></div>
        <p>Loading sensor data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sensor-chart-error">
        <h3>Error Loading Chart</h3>
        <p>{error}</p>
        <button onClick={fetchSensorData}>Retry</button>
      </div>
    );
  }

  if (!sensorData || sensorData.length === 0) {
    return (
      <div className="sensor-chart-empty">
        <h3>No Sensor Data</h3>
        <p>No sensor data available for this plot.</p>
      </div>
    );
  }

  return (
    <div className="sensor-data-chart">
      <div className="chart-controls">
        <div className="time-range-selector">
          <label>Time Range:</label>
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="time-range-select"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>
        <button 
          onClick={fetchSensorData}
          className="refresh-button"
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      
      <div className="chart-container">
        <Line data={chartData} options={options} />
      </div>
      
      <div className="chart-stats">
        <div className="stat-item">
          <span className="stat-label">Latest Temperature:</span>
          <span className="stat-value">
            {sensorData[sensorData.length - 1]?.temperature != null 
              ? Number(sensorData[sensorData.length - 1].temperature).toFixed(1) 
              : '--'}°C
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Latest Humidity:</span>
          <span className="stat-value">
            {sensorData[sensorData.length - 1]?.humidity != null 
              ? Number(sensorData[sensorData.length - 1].humidity).toFixed(1) 
              : '--'}%
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Latest Soil Moisture:</span>
          <span className="stat-value">
            {sensorData[sensorData.length - 1]?.soil_moisture != null 
              ? Number(sensorData[sensorData.length - 1].soil_moisture).toFixed(1) 
              : '--'}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default SensorDataChart;
