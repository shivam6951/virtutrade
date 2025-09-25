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
  res.json({ 
    status: 'OK', 
    message: 'VirtuTrade API is running',
    database: 'Service Available',
    timestamp: new Date().toISOString()
  });
});

// Emergency login endpoint when database is down
app.post('/api/auth/emergency-login', (req, res) => {
  const { email } = req.body;
  
  if (email === '89mishrashivam89@gmail.com') {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { userId: 1, username: 'testuser' },
      process.env.JWT_SECRET || 'emergency-secret',
      { expiresIn: '24h' }
    );
    
    return res.json({
      message: 'Emergency login successful',
      token,
      user: {
        id: 1,
        username: 'testuser',
        email: '89mishrashivam89@gmail.com',
        balance: 100000
      }
    });
  }
  
  res.status(401).json({ error: 'Emergency login not available for this user' });
});

// Database connectivity test with fallback
app.get('/test-db', async (req, res) => {
  const { Pool } = require('pg');
  
  const configs = [
    { name: 'SSL Required', connectionString: process.env.DATABASE_URL + '?sslmode=require', ssl: { rejectUnauthorized: false } },
    { name: 'SSL Prefer', connectionString: process.env.DATABASE_URL + '?sslmode=prefer', ssl: { rejectUnauthorized: false } },
    { name: 'No SSL', connectionString: process.env.DATABASE_URL, ssl: false }
  ];
  
  for (const config of configs) {
    const testPool = new Pool({ ...config, max: 1, connectionTimeoutMillis: 3000 });
    try {
      const result = await testPool.query('SELECT NOW() as time');
      await testPool.end();
      return res.json({
        success: true,
        message: `Database connected with ${config.name}`,
        data: result.rows[0],
        config: config.name
      });
    } catch (error) {
      await testPool.end();
      console.log(`${config.name} failed:`, error.code);
    }
  }
  
  res.status(500).json({
    success: false,
    error: 'All connection attempts failed',
    message: 'Railway database service may be down'
  });
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