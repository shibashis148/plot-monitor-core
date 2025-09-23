import { format, parseISO, isValid } from 'date-fns';

// Format date for display
export const formatDate = (date, formatString = 'MMM dd, yyyy HH:mm') => {
  if (!date) return 'N/A';
  
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return isValid(parsedDate) ? format(parsedDate, formatString) : 'Invalid Date';
  } catch (error) {
    return 'Invalid Date';
  }
};

// Format relative time (e.g., "2 hours ago")
export const formatRelativeTime = (date) => {
  if (!date) return 'N/A';
  
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(parsedDate)) return 'Invalid Date';
    
    const now = new Date();
    const diffInSeconds = Math.floor((now - parsedDate) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
    return format(parsedDate, 'MMM dd, yyyy');
  } catch (error) {
    return 'Invalid Date';
  }
};

// Get status color
export const getStatusColor = (status) => {
  const colors = {
    healthy: '#10B981', // green
    warning: '#F59E0B', // yellow
    critical: '#EF4444', // red
    active: '#EF4444', // red
    acknowledged: '#6B7280', // gray
    dismissed: '#9CA3AF', // light gray
  };
  return colors[status] || '#6B7280';
};

// Get status icon
export const getStatusIcon = (status) => {
  const icons = {
    healthy: 'check-circle',
    warning: 'alert-triangle',
    critical: 'x-circle',
    active: 'alert-circle',
    acknowledged: 'check',
    dismissed: 'x',
  };
  return icons[status] || 'help-circle';
};

// Format sensor value with unit
export const formatSensorValue = (value, type) => {
  if (value === null || value === undefined) return 'N/A';
  
  const units = {
    temperature: '°C',
    humidity: '%',
    soil_moisture: '%',
  };
  
  const unit = units[type] || '';
  return `${parseFloat(value).toFixed(1)}${unit}`;
};

// Calculate percentage
export const calculatePercentage = (value, total) => {
  if (!total || total === 0) return 0;
  return Math.round((value / total) * 100);
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Generate random ID
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

// Parse GeoJSON coordinates
export const parseGeoJSON = (geoJsonString) => {
  try {
    if (typeof geoJsonString === 'string') {
      return JSON.parse(geoJsonString);
    }
    return geoJsonString;
  } catch (error) {
    console.error('Error parsing GeoJSON:', error);
    return null;
  }
};

// Calculate distance between two points (in meters)
export const calculateDistance = (point1, point2) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (point1.lat * Math.PI) / 180;
  const φ2 = (point2.lat * Math.PI) / 180;
  const Δφ = ((point2.lat - point1.lat) * Math.PI) / 180;
  const Δλ = ((point2.lng - point1.lng) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

// Sort array by property
export const sortBy = (array, property, direction = 'asc') => {
  return [...array].sort((a, b) => {
    const aVal = a[property];
    const bVal = b[property];
    
    if (direction === 'desc') {
      return bVal > aVal ? 1 : -1;
    }
    return aVal > bVal ? 1 : -1;
  });
};

// Filter array by multiple criteria
export const filterBy = (array, filters) => {
  return array.filter(item => {
    return Object.keys(filters).every(key => {
      const filterValue = filters[key];
      const itemValue = item[key];
      
      if (filterValue === 'all' || filterValue === null || filterValue === undefined) {
        return true;
      }
      
      if (typeof filterValue === 'string') {
        return itemValue?.toString().toLowerCase().includes(filterValue.toLowerCase());
      }
      
      return itemValue === filterValue;
    });
  });
};
