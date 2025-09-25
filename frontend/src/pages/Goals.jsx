import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Target, Calendar, Calculator, Trash2 } from 'lucide-react';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [newGoal, setNewGoal] = useState({
    goalName: '',
    targetAmount: '',
    timeHorizon: ''
  });
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const fetchGoals = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3002/api/goals', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setGoals(data);
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const addGoal = async () => {
    console.log('Adding goal:', newGoal);
    
    try {
      const response = await fetch('http://localhost:3002/api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          goalName: newGoal.goalName,
          targetAmount: parseFloat(newGoal.targetAmount),
          timeHorizon: parseInt(newGoal.timeHorizon)
        })
      });
      
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Goal created successfully:', data);
        setRecommendations(data.recommendations);
        fetchGoals();
        setShowAddModal(false);
        setNewGoal({ goalName: '', targetAmount: '', timeHorizon: '' });
      } else {
        const errorData = await response.json();
        console.error('Failed to create goal:', errorData);
        alert(`Failed to create goal: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Network error adding goal:', error);
      alert(`Network error: ${error.message}`);
    }
  };

  const deleteGoal = async (goalId) => {
    try {
      const response = await fetch(`http://localhost:3002/api/goals/${goalId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        fetchGoals();
      }
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const GoalCard = ({ goal }) => {
    let instruments = [];
    try {
      instruments = typeof goal.recommended_instruments === 'string' 
        ? JSON.parse(goal.recommended_instruments) 
        : goal.recommended_instruments || [];
    } catch (error) {
      console.error('Error parsing instruments:', error);
      instruments = [];
    }
    
    return (
      <div className="card bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mr-3">
              <Target className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{goal.goal_name}</h3>
              <p className="text-sm text-gray-600">Target: ₹{parseFloat(goal.target_amount).toLocaleString()}</p>
            </div>
          </div>
          <button 
            onClick={() => deleteGoal(goal.id)}
            className="p-1 text-red-500 hover:bg-red-50 rounded"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white/50 p-3 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Monthly SIP</p>
            <p className="font-bold text-green-600">₹{parseFloat(goal.monthly_sip).toLocaleString()}</p>
          </div>
          <div className="bg-white/50 p-3 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Lump Sum</p>
            <p className="font-bold text-blue-600">₹{parseFloat(goal.lump_sum).toLocaleString()}</p>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Recommended Investments:</p>
          {instruments.map((instrument, index) => (
            <div key={index} className="flex justify-between items-center bg-white/70 p-2 rounded mb-1">
              <span className="text-sm font-medium">{instrument.name}</span>
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                {instrument.avgReturn}% return
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-white/50">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-1" />
            {goal.time_horizon} years
          </div>
          <div className="text-sm font-medium text-gray-700">
            Expected: {goal.expected_return}% CAGR
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Financial Goals</h1>
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">Set smart investment goals with AI-powered recommendations</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Goal
        </button>
      </div>

      {/* Recommendations Display */}
      {recommendations && (
        <div className="card bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <div className="flex items-center mb-4">
            <Calculator className="h-6 w-6 text-green-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Investment Recommendation</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-white p-4 rounded-lg">
              <p className="text-sm text-gray-600">Monthly SIP Required</p>
              <p className="text-2xl font-bold text-green-600">₹{recommendations.monthlySIP.toLocaleString()}</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <p className="text-sm text-gray-600">One-time Investment</p>
              <p className="text-2xl font-bold text-blue-600">₹{recommendations.lumpSum.toLocaleString()}</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <p className="text-sm text-gray-600">Expected Return</p>
              <p className="text-2xl font-bold text-purple-600">{recommendations.expectedReturn}%</p>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-medium text-gray-900 mb-2">Recommended Instruments:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {recommendations.instruments.map((instrument, index) => (
                <div key={index} className="bg-white p-3 rounded-lg flex justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{instrument.name}</p>
                    <p className="text-sm text-gray-600">{instrument.type} • {instrument.riskLevel}</p>
                  </div>
                  <span className="text-green-600 font-bold">{instrument.avgReturn}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Projections:</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-600">Best Case</p>
                <p className="font-bold text-green-600">₹{recommendations.projections.bestCase.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Expected</p>
                <p className="font-bold text-blue-600">₹{recommendations.projections.expected.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Worst Case</p>
                <p className="font-bold text-red-600">₹{recommendations.projections.worstCase.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => setRecommendations(null)}
            className="mt-4 w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Close Recommendations
          </button>
        </div>
      )}

      {/* Goals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>

      {goals.length === 0 && (
        <div className="text-center py-12">
          <Target className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No financial goals set yet</p>
          <p className="text-gray-400">Create your first goal and get personalized investment recommendations!</p>
        </div>
      )}

      {/* Add Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setShowAddModal(false)} />
            <div className="relative bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Financial Goal</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Goal Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Buy a car"
                    value={newGoal.goalName}
                    onChange={(e) => setNewGoal({...newGoal, goalName: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Amount (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="400000"
                    value={newGoal.targetAmount}
                    onChange={(e) => setNewGoal({...newGoal, targetAmount: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time Horizon (Years)
                  </label>
                  <input
                    type="number"
                    placeholder="4"
                    value={newGoal.timeHorizon}
                    onChange={(e) => setNewGoal({...newGoal, timeHorizon: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                    max="30"
                  />
                </div>

                <div className="flex space-x-3">
                  <button 
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={addGoal}
                    disabled={!newGoal.goalName || !newGoal.targetAmount || !newGoal.timeHorizon}
                    className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Calculate & Add Goal
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Goals;