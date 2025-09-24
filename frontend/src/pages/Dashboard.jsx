import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Wallet, PieChart } from 'lucide-react';
import api from '../utils/api';
import useAutoRefresh from '../hooks/useAutoRefresh';
import PortfolioGrowthChart from '../components/PortfolioGrowthChart';

const Dashboard = () => {
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  const fetchPortfolioData = async () => {
    try {
      console.log('Fetching portfolio data...');
      const response = await api.getPortfolio(token);
      console.log('Portfolio response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Portfolio data:', data);
        setPortfolioData(data);
      } else {
        const errorData = await response.json();
        console.error('Portfolio API error:', errorData);
        setPortfolioData(null);
      }
    } catch (error) {
      console.error('Network error fetching portfolio:', error);
      setPortfolioData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  // Auto-refresh every 30 seconds
  useAutoRefresh(fetchPortfolioData, 30000);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (!portfolioData && !loading) {
    return <div className="text-center text-red-600">Error loading portfolio data</div>;
  }

  const { 
    balance = 0, 
    totalInvested = 0, 
    currentValue = 0, 
    totalGain = 0, 
    gainPercentage = 0, 
    holdings = [] 
  } = portfolioData || {};

  const StatCard = ({ title, value, change, changeType, icon: Icon, gradient }) => (
    <div className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-white/20 dark:border-gray-700/20 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${gradient}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-bold text-gray-600 dark:text-gray-300 mb-2 tracking-wide uppercase">{title}</p>
          <p className="text-4xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">₹{value.toLocaleString()}</p>
          {change !== undefined && (
            <div className={`flex items-center transition-all duration-200 ${changeType === 'positive' ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
              {changeType === 'positive' ? <TrendingUp className="h-5 w-5 mr-2" /> : <TrendingDown className="h-5 w-5 mr-2" />}
              <span className="text-lg font-black">
                {change > 0 ? '+' : ''}₹{Math.abs(change).toLocaleString()} ({Math.abs(gainPercentage)}% {changeType === 'positive' ? '↑ Gain' : '↓ Loss'})
              </span>
            </div>
          )}
        </div>
        <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg transition-transform duration-200 hover:scale-110">
          <Icon className="h-8 w-8 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
            Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">
            Welcome back{localStorage.getItem('user') ? `, ${JSON.parse(localStorage.getItem('user')).firstName || JSON.parse(localStorage.getItem('user')).username}` : ''}! Here's your portfolio overview.
          </p>
        </div>
        <button
          onClick={() => {
            setLoading(true);
            fetchPortfolioData();
          }}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 disabled:scale-100"
        >
          <svg className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {loading ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
        <StatCard
          title="Wallet Balance"
          value={balance}
          icon={Wallet}
          gradient="bg-gradient-to-br from-green-50/50 to-green-100/50"
        />
        <StatCard
          title="Total Invested"
          value={totalInvested}
          icon={PieChart}
          gradient="bg-gradient-to-br from-blue-50/50 to-blue-100/50"
        />
        <StatCard
          title="Current Value"
          value={currentValue}
          change={totalGain}
          changeType={totalGain > 0 ? 'positive' : 'negative'}
          icon={TrendingUp}
          gradient="bg-gradient-to-br from-purple-50/50 to-purple-100/50"
        />
        <StatCard
          title="Total Returns"
          value={totalGain}
          change={totalGain}
          changeType={totalGain > 0 ? 'positive' : 'negative'}
          icon={totalGain > 0 ? TrendingUp : TrendingDown}
          gradient={totalGain > 0 ? 'bg-gradient-to-br from-green-50/50 to-emerald-50/50' : 'bg-gradient-to-br from-red-50/50 to-red-100/50'}
        />
      </div>

      {/* Portfolio Growth Chart */}
      <PortfolioGrowthChart 
        portfolioData={portfolioData}
        onRefresh={fetchPortfolioData}
      />

      {/* Recent Holdings */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Top Holdings</h2>
            <p className="text-gray-600">Your best performing investments</p>
          </div>
        </div>
        {holdings && holdings.length > 0 ? (
          <div className="space-y-4">
            {(holdings || []).slice(0, 3).map((holding) => (
              <div key={holding.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">
                      {holding.asset_symbol.substring(0, 2)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{holding.asset_symbol}</p>
                    <p className="text-sm text-gray-600">{holding.quantity} shares</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">₹{holding.currentPrice}</p>
                  <p className={`text-sm ${holding.pnl > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {holding.pnl > 0 ? '+' : ''}₹{holding.pnl.toFixed(2)} ({holding.pnlPercentage}%)
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No holdings yet. Start investing to see your portfolio here!
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;