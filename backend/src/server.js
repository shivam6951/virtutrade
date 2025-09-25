const express = require('express');
const cors = require('cors');
const { startPriceScheduler } = require('./scripts/priceScheduler');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const portfolioRoutes = require('./routes/portfolio');
const transactionRoutes = require('./routes/transactions');
const watchlistRoutes = require('./routes/watchlist');
const goalsRoutes = require('./routes/goals');
const leaderboardRoutes = require('./routes/leaderboard');
const searchRoutes = require('./routes/search');
const marketRoutes = require('./routes/market');
const userRoutes = require('./routes/user');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://whimsical-speculoos-dcb78b.netlify.app',
    'https://virtutrade.vercel.app'
  ],
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/goals', goalsRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/user', userRoutes);

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const pool = require('./config/database');
    const result = await pool.query('SELECT NOW() as time');
    res.json({ 
      status: 'OK', 
      message: 'VirtuTrade API is running',
      database: 'Connected',
      timestamp: result.rows[0].time
    });
  } catch (error) {
    console.error('Health check database error:', error);
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Database connection failed',
      error: error.message,
      code: error.code
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
  console.log('NODE_ENV:', process.env.NODE_ENV);
  
  // Comprehensive database connection test
  const { Pool } = require('pg');
  
  const testConfigs = [
    { name: 'Current config', ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false },
    { name: 'No SSL', ssl: false },
    { name: 'SSL required', ssl: { rejectUnauthorized: false, require: true } }
  ];
  
  for (const config of testConfigs) {
    console.log(`\n🔄 Testing: ${config.name}`);
    const testPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: config.ssl,
      max: 1,
      connectionTimeoutMillis: 5000
    });
    
    try {
      const result = await testPool.query('SELECT NOW() as time');
      console.log('✅ SUCCESS! Database connected with:', config.name);
      console.log('Time:', result.rows[0].time);
      await testPool.end();
      break;
    } catch (error) {
      console.log('❌ FAILED:', error.code, error.message);
      await testPool.end();
    }
  }
  
  startPriceScheduler();
});