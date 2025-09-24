const pool = require('../config/database');
const { getMultipleStockPrices } = require('../utils/marketData');

const getPortfolio = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get user balance
    const userResult = await pool.query(
      'SELECT balance FROM users WHERE id = $1',
      [userId]
    );

    // Get holdings with market data
    const holdingsResult = await pool.query(`
      SELECT h.*, m.current_price, m.asset_name, m.asset_type
      FROM holdings h
      LEFT JOIN market_data m ON h.asset_symbol = m.asset_symbol
      WHERE h.user_id = $1
    `, [userId]);

    const holdings = holdingsResult.rows;

    if (holdings.length === 0) {
      return res.json({
        balance: parseFloat(userResult.rows[0].balance),
        holdings: [],
        totalInvested: 0,
        currentValue: 0,
        totalGain: 0,
        gainPercentage: 0
      });
    }

    // Calculate portfolio metrics
    let totalInvested = 0;
    let currentValue = 0;

    const enrichedHoldings = holdings.map(holding => {
      const currentPrice = parseFloat(holding.current_price) || 0;
      const quantity = parseInt(holding.quantity) || 0;
      const avgBuyPrice = parseFloat(holding.avg_buy_price) || 0;
      
      const invested = quantity * avgBuyPrice;
      const current = quantity * currentPrice;
      const pnl = current - invested;
      const pnlPercentage = invested > 0 ? ((pnl / invested) * 100).toFixed(2) : '0.00';

      totalInvested += invested;
      currentValue += current;

      return {
        ...holding,
        currentPrice,
        investedValue: invested,
        currentValue: current,
        pnl: pnl,
        pnlPercentage: parseFloat(pnlPercentage),
        asset_name: holding.asset_name || holding.asset_symbol,
        asset_type: holding.asset_type || 'Stock'
      };
    });

    const totalGain = currentValue - totalInvested;
    const gainPercentage = totalInvested > 0 ? ((totalGain / totalInvested) * 100).toFixed(2) : 0;

    res.json({
      balance: parseFloat(userResult.rows[0].balance),
      holdings: enrichedHoldings,
      totalInvested,
      currentValue,
      totalGain,
      gainPercentage: parseFloat(gainPercentage)
    });
  } catch (error) {
    console.error('Portfolio error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getPortfolio };