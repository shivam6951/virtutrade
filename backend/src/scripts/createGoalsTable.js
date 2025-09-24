const pool = require('../config/database');

const createGoalsTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS goals (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        goal_name VARCHAR(255) NOT NULL,
        target_amount DECIMAL(15,2) NOT NULL,
        time_horizon INTEGER NOT NULL,
        monthly_sip DECIMAL(15,2),
        lump_sum DECIMAL(15,2),
        recommended_instruments JSONB,
        expected_return DECIMAL(5,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Goals table created successfully');
  } catch (error) {
    console.error('Error creating goals table:', error);
  }
};

createGoalsTable();