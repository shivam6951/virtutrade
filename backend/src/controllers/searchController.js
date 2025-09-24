const pool = require('../config/database');

const searchStocks = async (req, res) => {
  try {
    const { query } = req.query;
    
    const result = await pool.query(
      `SELECT asset_symbol as symbol, asset_name as name, asset_type as type, 
              current_price as currentPrice, daily_change as change, 
              daily_change_percent as changePercentage
       FROM market_data 
       WHERE LOWER(asset_symbol) LIKE LOWER($1) 
          OR LOWER(asset_name) LIKE LOWER($1)
       ORDER BY asset_type, asset_symbol
       LIMIT 20`,
      [`%${query}%`]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { searchStocks };