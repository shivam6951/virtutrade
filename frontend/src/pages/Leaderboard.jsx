import React, { useState, useEffect, useCallback } from 'react';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';
import api from '../utils/api';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const currentUser = JSON.parse(localStorage.getItem('user'));

  const fetchLeaderboard = useCallback(async () => {
    try {
      const response = await api.getLeaderboard(token);
      const data = await response.json();
      setLeaderboard(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setLeaderboard([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const getBadgeIcon = (badge) => {
    switch (badge) {
      case 'Gold':
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 'Silver':
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 'Bronze':
        return <Award className="h-5 w-5 text-orange-600" />;
      default:
        return null;
    }
  };

  const getRankStyle = (rank) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
      case 3:
        return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Leaderboard</h1>
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">See how you rank against other investors</p>
      </div>

      {/* Top 3 Podium */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-white/20 dark:border-gray-700/20">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Top Performers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {leaderboard.slice(0, 3).map((user, index) => (
            <div key={user.userId} className={`text-center p-6 rounded-lg ${
              index === 0 ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30 border-2 border-yellow-200 dark:border-yellow-600' :
              index === 1 ? 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-2 border-gray-200 dark:border-gray-600' :
              'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 border-2 border-orange-200 dark:border-orange-600'
            }`}>
              <div className="flex justify-center mb-4">
                {getBadgeIcon(user.badge)}
              </div>
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full text-xl font-bold mb-3 ${getRankStyle(user.rank)}`}>
                {user.rank}
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">{user.username}</h3>
              <p className="text-2xl font-black text-gray-900 dark:text-white mb-1">₹{user.portfolioValue.toLocaleString()}</p>
              <p className={`font-black text-lg ${user.gainPercentage >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {user.gainPercentage >= 0 ? '+' : ''}{user.gainPercentage}%
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Full Leaderboard Table */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-white/20 dark:border-gray-700/20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">All Rankings</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <TrendingUp className="h-4 w-4" />
            <span>Updated every 15 minutes</span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Rank</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Investor</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">Portfolio Value</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">Total Gain</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">Badge</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((user) => {
                const isCurrentUser = user.userId === currentUser?.id;
                return (
                  <tr 
                    key={user.userId} 
                    className={`border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                      isCurrentUser ? 'bg-blue-50 dark:bg-blue-900/30' : ''
                    }`}
                  >
                    <td className="py-4 px-4">
                      <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${getRankStyle(user.rank)}`}>
                        {user.rank}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mr-3">
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                            {user.username.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className={`font-medium ${isCurrentUser ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
                            {user.username}
                            {isCurrentUser && (
                              <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                                You
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="text-right py-4 px-4">
                      <p className="font-medium text-gray-900 dark:text-white">₹{user.portfolioValue.toLocaleString()}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Cash: ₹{(user.walletBalance || 0).toLocaleString()} + Holdings: ₹{(user.holdingsValue || 0).toLocaleString()}
                      </p>
                    </td>
                    <td className="text-right py-4 px-4">
                      <span className={`font-medium ${user.gainPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {user.gainPercentage >= 0 ? '+' : ''}{user.gainPercentage}%
                      </span>
                    </td>
                    <td className="text-center py-4 px-4">
                      {user.badge ? (
                        <div className="flex items-center justify-center">
                          {getBadgeIcon(user.badge)}
                          <span className="ml-1 text-sm font-medium text-gray-600 dark:text-gray-300">{user.badge}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Achievement Badges */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-white/20 dark:border-gray-700/20">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Achievement Badges</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
            <Trophy className="h-8 w-8 text-yellow-500 dark:text-yellow-400 mr-3" />
            <div>
              <p className="font-medium text-yellow-900 dark:text-yellow-200">Gold Investor</p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">Top 1% performers</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <Medal className="h-8 w-8 text-gray-500 dark:text-gray-400 mr-3" />
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-200">Silver Investor</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">Top 5% performers</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
            <Award className="h-8 w-8 text-orange-500 dark:text-orange-400 mr-3" />
            <div>
              <p className="font-medium text-orange-900 dark:text-orange-200">Bronze Investor</p>
              <p className="text-sm text-orange-700 dark:text-orange-300">Top 10% performers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Competition Info */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-white/20 dark:border-gray-700/20 bg-gradient-to-r from-blue-50/50 dark:from-blue-900/20 to-blue-50/50 dark:to-blue-900/20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Monthly Competition</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Compete with other investors and win exciting prizes! 
              The top 3 performers each month get special rewards.
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-700 dark:text-gray-300">
              <div className="flex items-center">
                <Trophy className="h-4 w-4 text-yellow-500 dark:text-yellow-400 mr-1" />
                <span>1st Place: ₹10,000 bonus</span>
              </div>
              <div className="flex items-center">
                <Medal className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1" />
                <span>2nd Place: ₹5,000 bonus</span>
              </div>
              <div className="flex items-center">
                <Award className="h-4 w-4 text-orange-500 dark:text-orange-400 mr-1" />
                <span>3rd Place: ₹2,500 bonus</span>
              </div>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Time Remaining</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">12 days</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;