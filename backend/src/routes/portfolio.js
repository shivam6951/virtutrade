const express = require('express');
const { getPortfolio } = require('../controllers/portfolioController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, getPortfolio);

module.exports = router;