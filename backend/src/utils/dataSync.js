const pool = require('../config/database');

// Clean up duplicate watchlist entries
const cleanupDuplicateWatchlist = async () => {
  try {
    console.log('Cleaning up duplicate watchlist entries...');
    
    await pool.query(`
      DELETE FROM watchlist w1 
      USING watchlist w2 
      WHERE w1.id > w2.id 
      AND w1.user_id = w2.user_id 
      AND w1.asset_symbol = w2.asset_symbol
    `);
    
    console.log('Duplicate watchlist entries cleaned up');
  } catch (error) {
    console.error('Error cleaning up duplicates:', error);
  }
};

// Update asset types in holdings table
const updateAssetTypes = async () => {
  try {
    console.log('Updating asset types in holdings...');
    
    await pool.query(`
      UPDATE holdings 
      SET asset_type = market_data.asset_type 
      FROM market_data 
      WHERE holdings.asset_symbol = market_data.asset_symbol
    `);
    
    console.log('Asset types updated in holdings');
  } catch (error) {
    console.error('Error updating asset types:', error);
  }
};

// Update transaction asset types
const updateTransactionTypes = async () => {
  try {
    console.log('Updating asset types in transactions...');
    
    await pool.query(`
      UPDATE transactions 
      SET asset_type = market_data.asset_type 
      FROM market_data 
      WHERE transactions.asset_symbol = market_data.asset_symbol
    `);
    
    console.log('Asset types updated in transactions');
  } catch (error) {
    console.error('Error updating transaction types:', error);
  }
};

const syncAllData = async () => {
  await cleanupDuplicateWatchlist();
  await updateAssetTypes();
  await updateTransactionTypes();
};

module.exports = { syncAllData, cleanupDuplicateWatchlist, updateAssetTypes, updateTransactionTypes };