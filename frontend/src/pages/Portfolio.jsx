import React, { useState, useEffect, useCallback } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import api from '../utils/api';
import useAutoRefresh from '../hooks/useAutoRefresh';
import SellModal from '../components/SellModal';

const Portfolio = () => {
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStock, setSelectedStock] = useState(null);
  const [showSellModal, setShowSellModal] = useState(false);
  const token = localStorage.getItem('token');

  const fetchPortfolioData = useCallback(async () => {
    try {
      const response = await api.getPortfolio(token);
      const data = await response.json();
      setPortfolioData(data);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchPortfolioData();
  }, [fetchPortfolioData]);

  // Auto-refresh every 30 seconds
  useAutoRefresh(fetchPortfolioData, 30000);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (!portfolioData) {
    return <div className="text-center text-red-600">Error loading portfolio data</div>;
  }

  const { 
    holdings = [], 
    currentValue = 0, 
    totalGain = 0, 
    gainPercentage = 0 
  } = portfolioData || {};

  // Calculate allocation data for pie chart
  const allocationData = (holdings || []).reduce((acc, holding) => {
    const value = holding.currentValue;
    const existingType = acc.find(item => item.name === holding.asset_type);
    if (existingType) {
      existingType.value += value;
    } else {
      acc.push({ name: holding.asset_type, value });
    }
    return acc;
  }, []);

  const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Portfolio</h1>
        <p className="text-gray-600 dark:text-gray-300">Track your investments and performance</p>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-white/20 dark:border-gray-700/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Holdings</h2>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">₹{currentValue.toLocaleString()}</p>
                <p className={`text-sm ${totalGain > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {totalGain > 0 ? '+' : ''}₹{totalGain.toLocaleString()} ({gainPercentage}%)
                </p>
              </div>
            </div>
            
            {holdings && holdings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Asset</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">Qty</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">Avg Price</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">Current Price</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">P&L</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(holdings || []).map((holding) => (
                      <tr key={holding.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{holding.asset_symbol}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{holding.asset_name}</p>
                            <span className="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full mt-1">
                              {holding.asset_type}
                            </span>
                          </div>
                        </td>
                        <td className="text-right py-4 px-4 text-gray-900 dark:text-white">{holding.quantity}</td>
                        <td className="text-right py-4 px-4 text-gray-900 dark:text-white">₹{holding.avg_buy_price}</td>
                        <td className="text-right py-4 px-4 text-gray-900 dark:text-white">₹{holding.currentPrice}</td>
                        <td className="text-right py-4 px-4">
                          <div className={`flex items-center justify-end ${holding.pnl > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {holding.pnl > 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                            <div>
                              <p className="font-medium">{holding.pnl > 0 ? '+' : ''}₹{holding.pnl.toFixed(2)}</p>
                              <p className="text-sm">({holding.pnlPercentage}%)</p>
                            </div>
                          </div>
                        </td>
                        <td className="text-center py-4 px-4">
                          <button
                            onClick={() => {
                              setSelectedStock({
                                symbol: holding.asset_symbol,
                                name: holding.asset_name || holding.asset_symbol,
                                currentPrice: holding.currentPrice,
                                type: holding.asset_type || 'Stock'
                              });
                              setShowSellModal(true);
                            }}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-all duration-200 hover:scale-105"
                          >
                            Sell
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No holdings yet. Start investing to build your portfolio!
              </div>
            )}
          </div>
        </div>

        {/* Asset Allocation Pie Chart */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-white/20 dark:border-gray-700/20">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Asset Allocation</h2>
          {allocationData.length > 0 ? (
            <>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={allocationData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {allocationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {allocationData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-300">{entry.name}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {((entry.value / currentValue) * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No assets to display
            </div>
          )}
        </div>
      </div>

      {/* Sell Modal */}
      {showSellModal && selectedStock && (
        <SellModal 
          stock={selectedStock}
          holding={holdings.find(h => h.asset_symbol === selectedStock.symbol)}
          onClose={() => {
            setShowSellModal(false);
            setSelectedStock(null);
          }}
          onSuccess={() => {
            fetchPortfolioData();
            setShowSellModal(false);
            setSelectedStock(null);
          }}
        />
      )}
    </div>
  );
};

export default Portfolio;