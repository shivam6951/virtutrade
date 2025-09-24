const express = require('express');
const { getGoals, createGoal, deleteGoal } = require('../controllers/goalsController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, getGoals);
router.post('/', authenticateToken, createGoal);
router.delete('/:goalId', authenticateToken, deleteGoal);

module.exports = router;