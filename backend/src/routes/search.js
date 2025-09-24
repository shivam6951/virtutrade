const express = require('express');
const { searchStocks } = require('../controllers/searchController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, searchStocks);

module.exports = router;