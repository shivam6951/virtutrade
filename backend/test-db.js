const { Pool } = require('pg');
require('dotenv').config();

async function testConnection() {
  console.log('Testing Railway Postgres connection...');
  console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
  
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is not set');
    return;
  }
  
  // Parse the connection string to check format
  try {
    const url = new URL(process.env.DATABASE_URL);
    console.log('✅ DATABASE_URL format is valid');
    console.log('Host:', url.hostname);
    console.log('Port:', url.port);
    console.log('Database:', url.pathname.slice(1));
    console.log('Username:', url.username);
  } catch (error) {
    console.error('❌ Invalid DATABASE_URL format:', error.message);
    return;
  }
  
  // Test different SSL configurations
  const configs = [
    { name: 'No SSL', ssl: false },
    { name: 'SSL with rejectUnauthorized: false', ssl: { rejectUnauthorized: false } },
    { name: 'SSL required', ssl: { rejectUnauthorized: false, require: true } }
  ];
  
  for (const config of configs) {
    console.log(`\n🔄 Testing: ${config.name}`);
    
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: config.ssl,
      max: 1,
      connectionTimeoutMillis: 5000
    });
    
    try {
      const result = await pool.query('SELECT NOW() as time, version() as version');
      console.log('✅ SUCCESS!');
      console.log('Time:', result.rows[0].time);
      console.log('Version:', result.rows[0].version.split(' ')[0]);
      await pool.end();
      return; // Stop on first success
    } catch (error) {
      console.log('❌ FAILED:', error.code, error.message);
      await pool.end();
    }
  }
  
  console.log('\n❌ All connection attempts failed');
}

testConnection().catch(console.error);