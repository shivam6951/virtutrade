const pool = require('../config/database');
const bcrypt = require('bcryptjs');

const seedData = async () => {
  try {
    console.log('Seeding database...');

    // Create sample users
    const passwordHash = await bcrypt.hash('password123', 10);
    
    const users = [
      { username: 'john_doe', email: 'john@example.com', balance: 95000 },
      { username: 'jane_smith', email: 'jane@example.com', balance: 87500 },
      { username: 'mike_wilson', email: 'mike@example.com', balance: 102000 }
    ];

    for (const user of users) {
      await pool.query(
        'INSERT INTO users (username, email, password_hash, balance) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING',
        [user.username, user.email, passwordHash, user.balance]
      );
    }

    // Get user IDs
    const userResults = await pool.query('SELECT id, username FROM users');
    const userMap = {};
    userResults.rows.forEach(user => {
      userMap[user.username] = user.id;
    });

    // Sample holdings
    const holdings = [
      { userId: userMap['john_doe'], symbol: 'RELIANCE', name: 'Reliance Industries', quantity: 5, avgPrice: 2600 },
      { userId: userMap['john_doe'], symbol: 'TCS', name: 'Tata Consultancy Services', quantity: 3, avgPrice: 3800 },
      { userId: userMap['jane_smith'], symbol: 'INFY', name: 'Infosys Limited', quantity: 10, avgPrice: 1400 },
      { userId: userMap['jane_smith'], symbol: 'NIFTYBEES', name: 'Nippon India ETF Nifty BeES', quantity: 50, avgPrice: 190 },
      { userId: userMap['mike_wilson'], symbol: 'HDFCBANK', name: 'HDFC Bank Limited', quantity: 8, avgPrice: 1650 }
    ];

    for (const holding of holdings) {
      if (holding.userId) {
        await pool.query(
          'INSERT INTO holdings (user_id, asset_symbol, asset_name, quantity, avg_buy_price) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (user_id, asset_symbol) DO NOTHING',
          [holding.userId, holding.symbol, holding.name, holding.quantity, holding.avgPrice]
        );
      }
    }

    // Sample transactions
    const transactions = [
      { userId: userMap['john_doe'], symbol: 'RELIANCE', name: 'Reliance Industries', type: 'BUY', quantity: 5, price: 2600 },
      { userId: userMap['john_doe'], symbol: 'TCS', name: 'Tata Consultancy Services', type: 'BUY', quantity: 3, price: 3800 },
      { userId: userMap['jane_smith'], symbol: 'INFY', name: 'Infosys Limited', type: 'BUY', quantity: 10, price: 1400 },
      { userId: userMap['mike_wilson'], symbol: 'HDFCBANK', name: 'HDFC Bank Limited', type: 'BUY', quantity: 8, price: 1650 }
    ];

    for (const transaction of transactions) {
      if (transaction.userId) {
        const totalAmount = transaction.quantity * transaction.price;
        await pool.query(
          'INSERT INTO transactions (user_id, asset_symbol, asset_name, transaction_type, quantity, price, total_amount) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [transaction.userId, transaction.symbol, transaction.name, transaction.type, transaction.quantity, transaction.price, totalAmount]
        );
      }
    }

    // Sample watchlist
    const watchlistItems = [
      { userId: userMap['john_doe'], symbol: 'INFY', name: 'Infosys Limited' },
      { userId: userMap['jane_smith'], symbol: 'RELIANCE', name: 'Reliance Industries' },
      { userId: userMap['mike_wilson'], symbol: 'TCS', name: 'Tata Consultancy Services' }
    ];

    for (const item of watchlistItems) {
      if (item.userId) {
        await pool.query(
          'INSERT INTO watchlist (user_id, asset_symbol, asset_name) VALUES ($1, $2, $3) ON CONFLICT (user_id, asset_symbol) DO NOTHING',
          [item.userId, item.symbol, item.name]
        );
      }
    }

    // Sample goals
    const goals = [
      { userId: userMap['john_doe'], name: 'Buy a Car', targetAmount: 800000, targetDate: '2027-05-01', monthlyInvestment: 15000 },
      { userId: userMap['jane_smith'], name: 'House Down Payment', targetAmount: 2000000, targetDate: '2029-12-01', monthlyInvestment: 25000 }
    ];

    for (const goal of goals) {
      if (goal.userId) {
        await pool.query(
          'INSERT INTO goals (user_id, goal_name, target_amount, target_date, monthly_investment) VALUES ($1, $2, $3, $4, $5)',
          [goal.userId, goal.name, goal.targetAmount, goal.targetDate, goal.monthlyInvestment]
        );
      }
    }

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    process.exit();
  }
};

seedData();