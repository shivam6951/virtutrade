const pool = require('../config/database');
const { getMultipleStockPrices } = require('../utils/marketData');

const getWatchlist = async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(`
      SELECT w.*, m.current_price, m.daily_change, m.daily_change_percent, m.asset_name, m.asset_type
      FROM watchlist w
      LEFT JOIN market_data m ON w.asset_symbol = m.asset_symbol
      WHERE w.user_id = $1 
      ORDER BY w.created_at DESC
    `, [userId]);

    const enrichedWatchlist = result.rows.map(item => ({
      ...item,
      currentPrice: parseFloat(item.current_price) || 0,
      change: parseFloat(item.daily_change) || 0,
      changePercentage: parseFloat(item.daily_change_percent) || 0,
      asset_name: item.asset_name || item.asset_symbol,
      asset_type: item.asset_type || 'Stock'
    }));

    res.json(enrichedWatchlist);
  } catch (error) {
    console.error('Get watchlist error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const addToWatchlist = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { symbol, assetName = symbol } = req.body;

    // Check if already in watchlist
    const existing = await pool.query(
      'SELECT id FROM watchlist WHERE user_id = $1 AND asset_symbol = $2',
      [userId, symbol]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Asset already in watchlist' });
    }

    // Get asset info from market_data
    const assetInfo = await pool.query(
      'SELECT asset_name FROM market_data WHERE asset_symbol = $1',
      [symbol]
    );
    
    const finalAssetName = assetInfo.rows[0]?.asset_name || assetName;
    
    const result = await pool.query(
      'INSERT INTO watchlist (user_id, asset_symbol, asset_name) VALUES ($1, $2, $3) RETURNING *',
      [userId, symbol, finalAssetName]
    );

    res.status(201).json({
      message: 'Added to watchlist successfully',
      item: result.rows[0]
    });
  } catch (error) {
    console.error('Add to watchlist error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const removeFromWatchlist = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { symbol } = req.params;

    const result = await pool.query(
      'DELETE FROM watchlist WHERE user_id = $1 AND asset_symbol = $2 RETURNING *',
      [userId, symbol]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Asset not found in watchlist' });
    }

    res.json({ message: 'Removed from watchlist successfully' });
  } catch (error) {
    console.error('Remove from watchlist error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getWatchlist, addToWatchlist, removeFromWatchlist };