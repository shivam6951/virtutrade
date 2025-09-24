const express = require('express');
const { getMarketData, getAssetPrice } = require('../controllers/marketController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, getMarketData);
router.get('/:symbol', authenticateToken, getAssetPrice);

module.exports = router;