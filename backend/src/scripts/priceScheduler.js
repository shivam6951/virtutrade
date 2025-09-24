const cron = require('node-cron');
const { updateMarketPrices } = require('../utils/priceUpdater');

// Schedule price updates every 15 minutes during market hours (9:15 AM - 3:30 PM IST)
const startPriceScheduler = () => {
  console.log('Starting price scheduler...');
  
  // Update prices every 15 minutes
  cron.schedule('*/15 * * * *', async () => {
    const now = new Date();
    const istTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000)); // Convert to IST
    const hour = istTime.getHours();
    const minute = istTime.getMinutes();
    
    // Check if it's market hours (9:15 AM to 3:30 PM IST)
    const isMarketHours = (hour > 9 || (hour === 9 && minute >= 15)) && 
                         (hour < 15 || (hour === 15 && minute <= 30));
    
    if (isMarketHours) {
      console.log('Updating market prices during market hours...');
      await updateMarketPrices();
    } else {
      console.log('Market closed - skipping price update');
    }
  });
  
  // Initial price update on startup
  setTimeout(async () => {
    console.log('Initial price update on startup...');
    await updateMarketPrices();
  }, 5000);
};

module.exports = { startPriceScheduler };