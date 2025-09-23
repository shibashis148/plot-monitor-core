import React, { createContext, useContext, useReducer } from 'react';

const AppContext = createContext();

const initialState = {
  user: null,
  farms: [],
  selectedFarm: null,
  selectedPlot: null,
  alerts: [],
  loading: false,
  error: null,
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_FARMS':
      return { ...state, farms: action.payload, loading: false };
    case 'SET_SELECTED_FARM':
      return { ...state, selectedFarm: action.payload };
    case 'SET_SELECTED_PLOT':
      return { ...state, selectedPlot: action.payload };
    case 'SET_ALERTS':
      return { ...state, alerts: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const setLoading = (loading) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const setFarms = (farms) => {
    dispatch({ type: 'SET_FARMS', payload: farms });
  };

  const setSelectedFarm = (farm) => {
    dispatch({ type: 'SET_SELECTED_FARM', payload: farm });
  };

  const setSelectedPlot = (plot) => {
    dispatch({ type: 'SET_SELECTED_PLOT', payload: plot });
  };

  const setAlerts = (alerts) => {
    dispatch({ type: 'SET_ALERTS', payload: alerts });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    setLoading,
    setError,
    setFarms,
    setSelectedFarm,
    setSelectedPlot,
    setAlerts,
    clearError,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};