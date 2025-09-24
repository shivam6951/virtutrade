# VirtuTrade Backend API

Express.js backend for the VirtuTrade virtual stock trading platform with PostgreSQL database.

## Features

- **JWT Authentication** - Secure user registration and login
- **Portfolio Management** - Track holdings, P&L, and portfolio performance
- **Trading System** - Buy/sell stocks with real-time balance updates
- **Watchlist** - Save and track favorite stocks
- **Goals Tracking** - Set and monitor financial goals
- **Leaderboard** - Rank users by portfolio performance
- **Mock Market Data** - Simulated stock prices for development

## Tech Stack

- **Node.js** + **Express.js** - Backend framework
- **PostgreSQL** - Database with proper relations and indexes
- **JWT** - Authentication and authorization
- **bcryptjs** - Password hashing
- **node-postgres (pg)** - Database connection

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Portfolio
- `GET /api/portfolio` - Get user portfolio with holdings and metrics

### Transactions
- `POST /api/transactions/buy` - Buy stocks
- `POST /api/transactions/sell` - Sell stocks
- `GET /api/transactions` - Get transaction history

### Watchlist
- `GET /api/watchlist` - Get user watchlist
- `POST /api/watchlist/add` - Add stock to watchlist
- `DELETE /api/watchlist/:symbol` - Remove from watchlist

### Goals
- `GET /api/goals` - Get user goals
- `POST /api/goals/add` - Create new goal
- `PUT /api/goals/:goalId` - Update goal progress

### Leaderboard
- `GET /api/leaderboard` - Get user rankings

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- PostgreSQL (v12+)

### Installation

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup PostgreSQL database:
   ```sql
   CREATE DATABASE virtutrade;
   ```

4. Run the schema:
   ```bash
   psql -d virtutrade -f src/config/schema.sql
   ```

5. Configure environment variables in `.env`:
   ```
   PORT=5000
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=virtutrade
   DB_USER=postgres
   DB_PASSWORD=your_password
   JWT_SECRET=your_jwt_secret
   ```

6. Seed sample data:
   ```bash
   npm run seed
   ```

7. Start the server:
   ```bash
   npm run dev
   ```

## Database Schema

### Users Table
- `id` - Primary key
- `username` - Unique username
- `email` - Unique email
- `password_hash` - Hashed password
- `balance` - Virtual wallet balance (starts at ₹1,00,000)

### Holdings Table
- `user_id` - Foreign key to users
- `asset_symbol` - Stock symbol (RELIANCE, TCS, etc.)
- `quantity` - Number of shares owned
- `avg_buy_price` - Average purchase price

### Transactions Table
- `user_id` - Foreign key to users
- `asset_symbol` - Stock symbol
- `transaction_type` - BUY or SELL
- `quantity` - Number of shares
- `price` - Price per share
- `total_amount` - Total transaction value

### Watchlist Table
- `user_id` - Foreign key to users
- `asset_symbol` - Stock symbol
- `asset_name` - Company name

### Goals Table
- `user_id` - Foreign key to users
- `goal_name` - Goal description
- `target_amount` - Target amount to achieve
- `target_date` - Target completion date
- `current_amount` - Current progress

## API Usage Examples

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"john_doe","email":"john@example.com","password":"password123"}'
```

### Buy Stock
```bash
curl -X POST http://localhost:5000/api/transactions/buy \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"symbol":"RELIANCE","quantity":10,"assetName":"Reliance Industries"}'
```

### Get Portfolio
```bash
curl -X GET http://localhost:5000/api/portfolio \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Market Data

Currently uses mock data for development. In production, integrate with:
- **Alpha Vantage API** - Real stock prices
- **Yahoo Finance API** - Market data
- **CoinGecko API** - Cryptocurrency prices

## Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt with salt rounds
- **SQL Injection Protection** - Parameterized queries
- **CORS Configuration** - Cross-origin request handling

## Error Handling

- Comprehensive error responses
- Transaction rollbacks for data consistency
- Input validation and sanitization
- Proper HTTP status codes

## Testing

Sample users created by seed script:
- **Username**: john_doe, **Password**: password123
- **Username**: jane_smith, **Password**: password123
- **Username**: mike_wilson, **Password**: password123

All users start with ₹1,00,000 virtual balance.

## Next Steps

1. **Real Market Data** - Integrate live stock price APIs
2. **WebSocket Support** - Real-time price updates
3. **Advanced Features** - Stop-loss orders, SIP automation
4. **Performance Optimization** - Caching, database indexing
5. **Testing Suite** - Unit and integration tests