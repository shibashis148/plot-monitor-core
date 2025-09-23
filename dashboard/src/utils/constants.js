// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3000/v1',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

// Chart Configuration
export const CHART_CONFIG = {
  COLORS: {
    primary: '#3B82F6',
    secondary: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#06B6D4',
    light: '#F3F4F6',
    dark: '#1F2937',
  },
  
  SENSOR_COLORS: {
    temperature: '#EF4444', // red
    humidity: '#3B82F6', // blue
    soil_moisture: '#10B981', // green
  },
  
  STATUS_COLORS: {
    healthy: '#10B981',
    warning: '#F59E0B',
    critical: '#EF4444',
    active: '#EF4444',
    acknowledged: '#6B7280',
    dismissed: '#9CA3AF',
  },
};

// Status Types
export const STATUS_TYPES = {
  PLOT: {
    HEALTHY: 'healthy',
    WARNING: 'warning',
    CRITICAL: 'critical',
  },
  
  ALERT: {
    ACTIVE: 'active',
    ACKNOWLEDGED: 'acknowledged',
    DISMISSED: 'dismissed',
  },
  
  SEVERITY: {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    CRITICAL: 'critical',
  },
};

// Alert Types
export const ALERT_TYPES = {
  TEMPERATURE: 'temperature',
  HUMIDITY: 'humidity',
  SOIL_MOISTURE: 'soil_moisture',
  PEST: 'pest',
  DISEASE: 'disease',
  WEATHER: 'weather',
};

// Sensor Types
export const SENSOR_TYPES = {
  TEMPERATURE: 'temperature',
  HUMIDITY: 'humidity',
  SOIL_MOISTURE: 'soil_moisture',
  PH: 'ph',
  LIGHT: 'light',
  PRESSURE: 'pressure',
};

// Crop Types
export const CROP_TYPES = [
  'Corn',
  'Wheat',
  'Rice',
  'Soybeans',
  'Tomatoes',
  'Lettuce',
  'Carrots',
  'Potatoes',
  'Onions',
  'Peppers',
  'Cucumbers',
  'Spinach',
  'Broccoli',
  'Cabbage',
  'Other',
];

// Time Ranges
export const TIME_RANGES = {
  LAST_HOUR: '1h',
  LAST_6_HOURS: '6h',
  LAST_24_HOURS: '24h',
  LAST_7_DAYS: '7d',
  LAST_30_DAYS: '30d',
  CUSTOM: 'custom',
};

// Chart Time Intervals
export const CHART_INTERVALS = {
  '1h': 5 * 60 * 1000, // 5 minutes
  '6h': 30 * 60 * 1000, // 30 minutes
  '24h': 2 * 60 * 60 * 1000, // 2 hours
  '7d': 24 * 60 * 60 * 1000, // 1 day
  '30d': 7 * 24 * 60 * 60 * 1000, // 1 week
};

// Default Thresholds
export const DEFAULT_THRESHOLDS = {
  temperature: {
    min: 10,
    max: 35,
  },
  humidity: {
    min: 30,
    max: 80,
  },
  soil_moisture: {
    min: 20,
    max: 80,
  },
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
  MAX_PAGE_SIZE: 100,
};

// Refresh Intervals
export const REFRESH_INTERVALS = {
  REAL_TIME: 5000, // 5 seconds
  FAST: 30000, // 30 seconds
  NORMAL: 60000, // 1 minute
  SLOW: 300000, // 5 minutes
  MANUAL: 0, // Manual refresh only
};

// Local Storage Keys
export const STORAGE_KEYS = {
  SELECTED_FARM: 'selectedFarm',
  SELECTED_PLOT: 'selectedPlot',
  FILTERS: 'filters',
  THEME: 'theme',
  REFRESH_INTERVAL: 'refreshInterval',
  CHART_SETTINGS: 'chartSettings',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  NOT_FOUND: 'Resource not found.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  FARM_CREATED: 'Farm created successfully.',
  FARM_UPDATED: 'Farm updated successfully.',
  FARM_DELETED: 'Farm deleted successfully.',
  PLOT_CREATED: 'Plot created successfully.',
  PLOT_UPDATED: 'Plot updated successfully.',
  PLOT_DELETED: 'Plot deleted successfully.',
  ALERT_ACKNOWLEDGED: 'Alert acknowledged successfully.',
  ALERT_DISMISSED: 'Alert dismissed successfully.',
  SENSOR_DATA_SUBMITTED: 'Sensor data submitted successfully.',
};

// Validation Rules
export const VALIDATION_RULES = {
  FARM_NAME: {
    minLength: 2,
    maxLength: 100,
    required: true,
  },
  PLOT_NAME: {
    minLength: 2,
    maxLength: 100,
    required: true,
  },
  PLOT_NUMBER: {
    minLength: 1,
    maxLength: 20,
    required: true,
  },
  OWNER_NAME: {
    minLength: 2,
    maxLength: 100,
    required: true,
  },
  AREA: {
    min: 0.01,
    max: 10000,
    required: true,
  },
  TEMPERATURE: {
    min: -50,
    max: 100,
    required: true,
  },
  HUMIDITY: {
    min: 0,
    max: 100,
    required: true,
  },
  SOIL_MOISTURE: {
    min: 0,
    max: 100,
    required: true,
  },
};

// Map Configuration
export const MAP_CONFIG = {
  DEFAULT_ZOOM: 10,
  MIN_ZOOM: 5,
  MAX_ZOOM: 18,
  DEFAULT_CENTER: {
    lat: 40.7128,
    lng: -74.0060,
  },
};

// Notification Settings
export const NOTIFICATION_SETTINGS = {
  POSITION: 'top-right',
  DURATION: 5000,
  MAX_NOTIFICATIONS: 5,
};
