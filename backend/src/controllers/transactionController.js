const pool = require('../config/database');
const { getStockPrice } = require('../utils/marketData');

const buyStock = async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const userId = req.user.userId;
    const { symbol, quantity, assetName = symbol } = req.body;

    // Get current price
    const priceData = await getStockPrice(symbol);
    const price = priceData.price;
    const totalAmount = quantity * price;

    // Check user balance
    const userResult = await client.query(
      'SELECT balance FROM users WHERE id = $1',
      [userId]
    );

    if (parseFloat(userResult.rows[0].balance) < totalAmount) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Update user balance
    await client.query(
      'UPDATE users SET balance = balance - $1 WHERE id = $2',
      [totalAmount, userId]
    );

    // Check if holding exists
    const holdingResult = await client.query(
      'SELECT * FROM holdings WHERE user_id = $1 AND asset_symbol = $2',
      [userId, symbol]
    );

    if (holdingResult.rows.length > 0) {
      // Update existing holding
      const existing = holdingResult.rows[0];
      const newQuantity = existing.quantity + quantity;
      const newAvgPrice = ((existing.quantity * existing.avg_buy_price) + totalAmount) / newQuantity;

      await client.query(
        'UPDATE holdings SET quantity = $1, avg_buy_price = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
        [newQuantity, newAvgPrice, existing.id]
      );
    } else {
      // Create new holding
      await client.query(
        'INSERT INTO holdings (user_id, asset_symbol, asset_name, quantity, avg_buy_price) VALUES ($1, $2, $3, $4, $5)',
        [userId, symbol, assetName, quantity, price]
      );
    }

    // Record transaction
    await client.query(
      'INSERT INTO transactions (user_id, asset_symbol, asset_name, transaction_type, quantity, price, total_amount) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [userId, symbol, assetName, 'BUY', quantity, price, totalAmount]
    );

    await client.query('COMMIT');

    res.json({
      message: 'Stock purchased successfully',
      transaction: {
        symbol,
        quantity,
        price,
        totalAmount,
        type: 'BUY'
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Buy stock error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
};

const sellStock = async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const userId = req.user.userId;
    const { symbol, quantity } = req.body;

    // Check if user has enough holdings
    const holdingResult = await client.query(
      'SELECT * FROM holdings WHERE user_id = $1 AND asset_symbol = $2',
      [userId, symbol]
    );

    if (holdingResult.rows.length === 0 || holdingResult.rows[0].quantity < quantity) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Insufficient holdings' });
    }

    const holding = holdingResult.rows[0];
    const priceData = await getStockPrice(symbol);
    const price = priceData.price;
    const totalAmount = quantity * price;

    // Update user balance
    await client.query(
      'UPDATE users SET balance = balance + $1 WHERE id = $2',
      [totalAmount, userId]
    );

    // Update or remove holding
    const newQuantity = holding.quantity - quantity;
    if (newQuantity === 0) {
      await client.query(
        'DELETE FROM holdings WHERE id = $1',
        [holding.id]
      );
    } else {
      await client.query(
        'UPDATE holdings SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [newQuantity, holding.id]
      );
    }

    // Record transaction
    await client.query(
      'INSERT INTO transactions (user_id, asset_symbol, asset_name, transaction_type, quantity, price, total_amount) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [userId, symbol, holding.asset_name, 'SELL', quantity, price, totalAmount]
    );

    await client.query('COMMIT');

    res.json({
      message: 'Stock sold successfully',
      transaction: {
        symbol,
        quantity,
        price,
        totalAmount,
        type: 'SELL'
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Sell stock error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
};

const getTransactions = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { limit = 50, offset = 0 } = req.query;

    const result = await pool.query(
      'SELECT * FROM transactions WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [userId, limit, offset]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { buyStock, sellStock, getTransactions };