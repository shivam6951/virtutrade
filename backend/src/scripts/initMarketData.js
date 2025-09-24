const { updateMarketPrices } = require('../utils/priceUpdater');

const initMarketData = async () => {
  console.log('Initializing market data...');
  await updateMarketPrices();
  console.log('Market data initialization completed');
  process.exit(0);
};

initMarketData();