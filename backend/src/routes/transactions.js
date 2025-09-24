const express = require('express');
const { buyStock, sellStock, getTransactions } = require('../controllers/transactionController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.post('/buy', authenticateToken, buyStock);
router.post('/sell', authenticateToken, sellStock);
router.get('/', authenticateToken, getTransactions);

module.exports = router;