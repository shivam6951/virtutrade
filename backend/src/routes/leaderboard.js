const express = require('express');
const { getLeaderboard } = require('../controllers/leaderboardController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, getLeaderboard);

module.exports = router;