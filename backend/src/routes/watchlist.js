const express = require('express');
const { getWatchlist, addToWatchlist, removeFromWatchlist } = require('../controllers/watchlistController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, getWatchlist);
router.post('/', authenticateToken, addToWatchlist);
router.delete('/:symbol', authenticateToken, removeFromWatchlist);

module.exports = router;