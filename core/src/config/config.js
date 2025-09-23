const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');
dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(5000),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  postgres: {
    host: envVars.POSTGRES_HOST || 'localhost',
    port: envVars.POSTGRES_PORT || 5432,
    database: envVars.POSTGRES_DB + (envVars.NODE_ENV === 'test' ? '_test' : ''),
    user: envVars.POSTGRES_USER || 'postgres',
    password: envVars.POSTGRES_PASSWORD || 'password',
    ssl: envVars.POSTGRES_SSL === 'true' ? { rejectUnauthorized: false } : false,
  }
};
