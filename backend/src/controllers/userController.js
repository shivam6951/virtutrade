const pool = require('../config/database');

const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      'SELECT id, username, email, balance, first_name, last_name, full_name FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      balance: parseFloat(user.balance),
      firstName: user.first_name,
      lastName: user.last_name,
      fullName: user.full_name
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { firstName, lastName, fullName } = req.body;
    
    const result = await pool.query(
      'UPDATE users SET first_name = $1, last_name = $2, full_name = $3 WHERE id = $4 RETURNING id, username, email, balance, first_name, last_name, full_name',
      [firstName, lastName, fullName, userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const user = result.rows[0];
    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        balance: parseFloat(user.balance),
        firstName: user.first_name,
        lastName: user.last_name,
        fullName: user.full_name
      }
    });
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getUserProfile, updateUserProfile };