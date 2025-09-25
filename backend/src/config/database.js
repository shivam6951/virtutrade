const { Pool } = require('pg');
require('dotenv').config();

console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);

// Railway-specific configuration
const isProduction = process.env.NODE_ENV === 'production';

const poolConfig = {
  connectionString: process.env.DATABASE_URL + (isProduction ? '?sslmode=require' : ''),
  ssl: isProduction ? { rejectUnauthorized: false } : false,
  max: 3,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 5000
};

console.log('Pool config:', { ...poolConfig, connectionString: poolConfig.connectionString ? '[HIDDEN]' : 'MISSING' });

const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  console.error('Database pool error:', err.message, err.code);
});

pool.on('connect', (client) => {
  console.log('New database connection established');
});

pool.on('acquire', () => {
  console.log('Connection acquired from pool');
});

pool.on('remove', () => {
  console.log('Connection removed from pool');
});

module.exports = pool;