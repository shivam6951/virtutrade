const { syncAllData } = require('../utils/dataSync');

const runDataSync = async () => {
  console.log('Starting data synchronization...');
  await syncAllData();
  console.log('Data synchronization completed');
  process.exit(0);
};

runDataSync();