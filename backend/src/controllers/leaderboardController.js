const pool = require('../config/database');
const { getMultipleStockPrices } = require('../utils/marketData');

const getLeaderboard = async (req, res) => {
  try {
    // Get all users with their holdings
    const usersResult = await pool.query(
      'SELECT id, username, balance FROM users ORDER BY id'
    );

    const leaderboard = [];

    for (const user of usersResult.rows) {
      // Get user holdings with market data
      const holdingsResult = await pool.query(`
        SELECT h.asset_symbol, h.quantity, h.avg_buy_price, m.current_price
        FROM holdings h
        LEFT JOIN market_data m ON h.asset_symbol = m.asset_symbol
        WHERE h.user_id = $1
      `, [user.id]);

      let totalInvested = 0;
      let currentValue = 0;

      // Calculate portfolio value
      holdingsResult.rows.forEach(holding => {
        const quantity = parseFloat(holding.quantity) || 0;
        const avgPrice = parseFloat(holding.avg_buy_price) || 0;
        const currentPrice = parseFloat(holding.current_price) || 0;
        
        const invested = quantity * avgPrice;
        const current = quantity * currentPrice;
        
        totalInvested += invested;
        currentValue += current;
      });

      const portfolioValue = parseFloat(user.balance) + currentValue;
      const initialBalance = 100000; // Starting balance
      const totalGain = portfolioValue - initialBalance;
      const gainPercentage = ((totalGain / initialBalance) * 100).toFixed(2);

      leaderboard.push({
        userId: user.id,
        username: user.username,
        walletBalance: parseFloat(user.balance),
        holdingsValue: currentValue,
        portfolioValue: portfolioValue,
        totalGain: totalGain,
        gainPercentage: parseFloat(gainPercentage)
      });
    }

    // Sort by gain percentage
    leaderboard.sort((a, b) => b.gainPercentage - a.gainPercentage);

    // Add ranks and badges
    const rankedLeaderboard = leaderboard.map((user, index) => ({
      ...user,
      rank: index + 1,
      badge: index === 0 ? 'Gold' : index === 1 ? 'Silver' : index === 2 ? 'Bronze' : null
    }));

    res.json(rankedLeaderboard);
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getLeaderboard };