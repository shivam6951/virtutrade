const pool = require('../config/database');

const getMarketData = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM market_data ORDER BY asset_type, asset_symbol'
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get market data error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAssetPrice = async (req, res) => {
  try {
    const { symbol } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM market_data WHERE asset_symbol = $1',
      [symbol]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get asset price error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getMarketData, getAssetPrice };