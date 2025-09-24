const pool = require('../config/database');

const getStockPrice = async (symbol) => {
  try {
    const result = await pool.query(
      'SELECT current_price as price, daily_change as change, daily_change_percent as changePercent FROM market_data WHERE asset_symbol = $1',
      [symbol]
    );
    
    if (result.rows.length > 0) {
      return {
        price: parseFloat(result.rows[0].price),
        change: parseFloat(result.rows[0].change),
        changePercent: parseFloat(result.rows[0].changepercent)
      };
    }
    
    return { price: 100, change: 0, changePercent: 0 };
  } catch (error) {
    console.error('Error fetching stock price:', error);
    return { price: 100, change: 0, changePercent: 0 };
  }
};

const getMultipleStockPrices = async (symbols) => {
  try {
    const placeholders = symbols.map((_, index) => `$${index + 1}`).join(',');
    const result = await pool.query(
      `SELECT asset_symbol, current_price as price, daily_change as change, daily_change_percent as changePercent 
       FROM market_data WHERE asset_symbol IN (${placeholders})`,
      symbols
    );
    
    const prices = {};
    result.rows.forEach(row => {
      prices[row.asset_symbol] = {
        price: parseFloat(row.price),
        change: parseFloat(row.change),
        changePercent: parseFloat(row.changepercent)
      };
    });
    
    symbols.forEach(symbol => {
      if (!prices[symbol]) {
        prices[symbol] = { price: 100, change: 0, changePercent: 0 };
      }
    });
    
    return prices;
  } catch (error) {
    console.error('Error fetching multiple stock prices:', error);
    const prices = {};
    symbols.forEach(symbol => {
      prices[symbol] = { price: 100, change: 0, changePercent: 0 };
    });
    return prices;
  }
};

module.exports = { getStockPrice, getMultipleStockPrices };