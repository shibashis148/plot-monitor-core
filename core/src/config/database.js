const knex = require('knex');
const config = require('./config');
const logger = require('./logger');

const knexConfig = require('./knexfile');

let db;

const connectDatabase = async () => {
  try {
    db = knex(knexConfig[config.env]);
    
    await db.raw('CREATE EXTENSION IF NOT EXISTS postgis');
    logger.info('PostGIS extension enabled');
    
    await db.raw('SELECT 1');
    logger.info('Connected to PostgreSQL database with PostGIS support');
    
    return db;
  } catch (error) {
    logger.error('Failed to connect to PostgreSQL database:', error);
    throw error;
  }
};

const getDatabase = () => {
  if (!db) {
    throw new Error('Database not initialized. Call connectDatabase() first.');
  }
  return db;
};

const closeDatabase = async () => {
  if (db) {
    await db.destroy();
    logger.info('Database connection closed');
  }
};

module.exports = {
  connectDatabase,
  getDatabase,
  closeDatabase,
};
