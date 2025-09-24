const pool = require('../config/database');

const getGoals = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const result = await pool.query(
      'SELECT * FROM goals WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createGoal = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { goalName, targetAmount, timeHorizon } = req.body;
    
    console.log('Creating goal:', { userId, goalName, targetAmount, timeHorizon });
    
    // Calculate investment recommendations
    const recommendations = calculateInvestmentPlan(targetAmount, timeHorizon);
    console.log('Recommendations calculated:', recommendations);
    
    const result = await pool.query(
      `INSERT INTO goals (user_id, goal_name, target_amount, time_horizon, 
       monthly_sip, lump_sum, recommended_instruments, expected_return, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW()) RETURNING *`,
      [
        userId, 
        goalName, 
        targetAmount, 
        timeHorizon, 
        recommendations.monthlySIP,
        recommendations.lumpSum,
        JSON.stringify(recommendations.instruments),
        recommendations.expectedReturn
      ]
    );
    
    console.log('Goal created in database:', result.rows[0]);
    
    res.status(201).json({
      message: 'Goal created successfully',
      goal: result.rows[0],
      recommendations
    });
  } catch (error) {
    console.error('Create goal error details:', error.message);
    console.error('Full error:', error);
    res.status(500).json({ error: `Internal server error: ${error.message}` });
  }
};

const calculateInvestmentPlan = (targetAmount, timeHorizon) => {
  // All investment options with historical returns
  const allInstruments = [
    { name: 'HDFC Liquid Fund', type: 'Liquid Fund', avgReturn: 6, riskLevel: 'Very Low' },
    { name: 'SBI Short Term Debt Fund', type: 'Debt Fund', avgReturn: 7, riskLevel: 'Low' },
    { name: 'HDFC Index Fund', type: 'Index Fund', avgReturn: 11, riskLevel: 'Low-Medium' },
    { name: 'NIFTYBEES ETF', type: 'ETF', avgReturn: 12, riskLevel: 'Medium' },
    { name: 'SBI Bluechip Fund', type: 'Mutual Fund', avgReturn: 13, riskLevel: 'Medium' },
    { name: 'ICICI Prudential Nifty 500 Fund', type: 'Mutual Fund', avgReturn: 14, riskLevel: 'Medium-High' },
    { name: 'Axis Small Cap Fund', type: 'Mutual Fund', avgReturn: 16, riskLevel: 'High' },
    { name: 'Kotak Emerging Equity Fund', type: 'Mutual Fund', avgReturn: 15, riskLevel: 'High' }
  ];
  
  // Goal-based recommendations
  let recommendedInstruments = [];
  
  if (targetAmount <= 5000) {
    // Small goals: Conservative approach
    recommendedInstruments = [
      allInstruments[1], // SBI Short Term Debt
      allInstruments[2], // HDFC Index Fund
      allInstruments[3]  // NIFTYBEES ETF
    ];
  } else if (targetAmount <= 50000) {
    // Medium goals: Balanced approach
    recommendedInstruments = [
      allInstruments[2], // HDFC Index Fund
      allInstruments[3], // NIFTYBEES ETF
      allInstruments[4]  // SBI Bluechip Fund
    ];
  } else if (targetAmount <= 200000) {
    // Large goals: Growth-oriented
    recommendedInstruments = [
      allInstruments[4], // SBI Bluechip Fund
      allInstruments[5], // ICICI Prudential Nifty 500
      allInstruments[7]  // Kotak Emerging Equity
    ];
  } else {
    // Very large goals: Aggressive growth
    recommendedInstruments = [
      allInstruments[5], // ICICI Prudential Nifty 500
      allInstruments[6], // Axis Small Cap Fund
      allInstruments[7]  // Kotak Emerging Equity
    ];
  }
  
  // Time-based adjustments
  if (timeHorizon <= 1) {
    // Short term: More conservative
    recommendedInstruments = [
      allInstruments[0], // HDFC Liquid Fund
      allInstruments[1], // SBI Short Term Debt
      allInstruments[2]  // HDFC Index Fund
    ];
  } else if (timeHorizon >= 5) {
    // Long term: More aggressive
    recommendedInstruments = [
      allInstruments[5], // ICICI Prudential Nifty 500
      allInstruments[6], // Axis Small Cap Fund
      allInstruments[7]  // Kotak Emerging Equity
    ];
  }
  
  const bestInstrument = recommendedInstruments[0];
  const conservativeInstrument = recommendedInstruments[recommendedInstruments.length - 1];
  
  const monthlyRate = bestInstrument.avgReturn / 100 / 12;
  const months = timeHorizon * 12;
  
  // SIP calculation: PMT = FV * r / ((1 + r)^n - 1)
  const monthlySIP = Math.ceil(
    (targetAmount * monthlyRate) / (Math.pow(1 + monthlyRate, months) - 1)
  );
  
  // Lump sum calculation: PV = FV / (1 + r)^n
  const annualRate = bestInstrument.avgReturn / 100;
  const lumpSum = Math.ceil(targetAmount / Math.pow(1 + annualRate, timeHorizon));
  
  // Projections
  const expectedValue = monthlySIP * months * (1 + monthlyRate);
  const bestCase = expectedValue * 1.3; // 30% better
  const worstCase = expectedValue * 0.7; // 30% worse
  
  return {
    monthlySIP,
    lumpSum,
    expectedReturn: bestInstrument.avgReturn,
    instruments: recommendedInstruments,
    projections: {
      expected: Math.ceil(expectedValue),
      bestCase: Math.ceil(bestCase),
      worstCase: Math.ceil(worstCase)
    }
  };
};

const deleteGoal = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { goalId } = req.params;
    
    const result = await pool.query(
      'DELETE FROM goals WHERE id = $1 AND user_id = $2 RETURNING *',
      [goalId, userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Goal not found' });
    }
    
    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    console.error('Delete goal error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getGoals, createGoal, deleteGoal };