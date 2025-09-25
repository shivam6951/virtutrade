import React, { useState, useEffect, useCallback } from 'react';
import { Plus, TrendingUp, TrendingDown, Heart, Search, X } from 'lucide-react';
import api from '../utils/api';
import BuyModal from '../components/BuyModal';
import SellModal from '../components/SellModal';
import SearchBar from '../components/SearchBar';
import useAutoRefresh from '../hooks/useAutoRefresh';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const [selectedStock, setSelectedStock] = useState(null);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [userHoldings, setUserHoldings] = useState([]);
  const token = localStorage.getItem('token');

  const fetchWatchlist = useCallback(async () => {
    try {
      const response = await api.getWatchlist(token);
      const data = await response.json();
      setWatchlist(data);
    } catch (error) {
      console.error('Error fetching watchlist:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchUserHoldings = useCallback(async () => {
    try {
      const response = await api.getPortfolio(token);
      const data = await response.json();
      setUserHoldings(data.holdings || []);
    } catch (error) {
      console.error('Error fetching holdings:', error);
    }
  }, [token]);

  useEffect(() => {
    fetchWatchlist();
    fetchUserHoldings();
  }, [fetchWatchlist, fetchUserHoldings]);

  // Auto-refresh every 30 seconds
  useAutoRefresh(() => {
    fetchWatchlist();
    fetchUserHoldings();
  }, 30000);

  const removeFromWatchlist = async (symbol) => {
    try {
      const response = await api.removeFromWatchlist(token, symbol);
      if (response.ok) {
        fetchWatchlist();
      }
    } catch (error) {
      console.error('Error removing from watchlist:', error);
    }
  };

  const addStockToWatchlist = async (stock) => {
    try {
      console.log('Adding to watchlist:', stock);
      console.log('API URL:', `http://localhost:3002/api/watchlist`);
      console.log('Token:', token ? 'Present' : 'Missing');
      
      const response = await fetch('http://localhost:3002/api/watchlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          symbol: stock.symbol,
          assetName: stock.name
        })
      });
      
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Successfully added to watchlist:', data);
        await fetchWatchlist();
        alert(`${stock.symbol} added to watchlist!`);
        return true;
      } else {
        const errorData = await response.json();
        console.error('Failed to add to watchlist:', errorData);
        alert(`Failed to add ${stock.symbol}: ${errorData.error || 'Unknown error'}`);
        return false;
      }
    } catch (error) {
      console.error('Network error adding to watchlist:', error);
      alert(`Network error: ${error.message}`);
      return false;
    }
  };

  const filteredWatchlist = watchlist.filter(stock =>
    stock.asset_symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.asset_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const WatchlistCard = ({ stock }) => (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-white/20 dark:border-gray-700/20 hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900 dark:text-white">{stock.asset_symbol}</h3>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                removeFromWatchlist(stock.asset_symbol);
              }}
              className="p-1 hover:bg-red-50 rounded-full transition-colors"
              title="Remove from watchlist"
            >
              <X className="h-4 w-4 text-red-500" />
            </button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{stock.asset_name}</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">₹{Number(stock.currentPrice || 0).toFixed(2)}</p>
            </div>
            <div className={`flex items-center ${stock.change > 0 ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
              {stock.change > 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
              <div className="text-right">
                <p className="text-sm font-bold">
                  {(stock.change || 0) > 0 ? '+' : ''}₹{Math.abs(stock.change || 0).toFixed(2)}
                </p>
                <p className="text-xs font-medium">
                  ({(stock.changePercentage || 0) > 0 ? '+' : ''}{Number(stock.changePercentage || 0).toFixed(2)}% {stock.change > 0 ? '↑ Up' : '↓ Down'})
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 flex space-x-2">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setSelectedStock({
              symbol: stock.asset_symbol,
              name: stock.asset_name || stock.asset_symbol,
              currentPrice: stock.currentPrice,
              type: stock.asset_type || 'Stock'
            });
            setShowBuyModal(true);
          }}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-4 rounded-lg font-medium transition-all duration-200 hover:scale-105"
        >
          Buy
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            const holding = userHoldings.find(h => h.asset_symbol === stock.asset_symbol);
            if (holding) {
              setSelectedStock({
                symbol: stock.asset_symbol,
                name: stock.asset_name || stock.asset_symbol,
                currentPrice: stock.currentPrice,
                type: stock.asset_type || 'Stock'
              });
              setShowSellModal(true);
            } else {
              alert('You don\'t own this stock');
            }
          }}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm py-2 px-4 rounded-lg font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!userHoldings.find(h => h.asset_symbol === stock.asset_symbol)}
        >
          Sell
        </button>
      </div>
    </div>
  );

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Watchlist</h1>
          <p className="text-gray-600 dark:text-gray-300">Keep track of your favorite stocks and investments</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Stock
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-white/20 dark:border-gray-700/20">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search stocks in your watchlist..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Watchlist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWatchlist.map((stock) => (
          <WatchlistCard key={stock.id} stock={stock} />
        ))}
      </div>

      {filteredWatchlist.length === 0 && (
        <div className="text-center py-12">
          <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-lg">No stocks in your watchlist</p>
          <p className="text-gray-400 dark:text-gray-500">Add some stocks to get started!</p>
        </div>
      )}

      {/* Add Stock Modal with Search */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setShowAddModal(false)} />
            <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-lg w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add to Watchlist</h3>
              <SearchBar 
                onStockSelect={async (stock) => {
                  console.log('Stock selected from search:', stock);
                  const success = await addStockToWatchlist(stock);
                  if (success) {
                    setShowAddModal(false);
                  }
                }}
                onBuyStock={async (stock) => {
                  console.log('Buy clicked from search:', stock);
                  const success = await addStockToWatchlist(stock);
                  if (success) {
                    setShowAddModal(false);
                  }
                }}
                placeholder="Search stocks, ETFs, mutual funds to add..."
                showInModal={true}
              />
              <div className="mt-4 flex justify-end">
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Buy Modal */}
      {showBuyModal && selectedStock && (
        <BuyModal 
          stock={selectedStock}
          onClose={() => {
            setShowBuyModal(false);
            setSelectedStock(null);
          }}
          onSuccess={() => {
            fetchWatchlist();
            fetchUserHoldings();
          }}
        />
      )}

      {/* Sell Modal */}
      {showSellModal && selectedStock && (
        <SellModal 
          stock={selectedStock}
          holding={userHoldings.find(h => h.asset_symbol === selectedStock.asset_symbol)}
          onClose={() => {
            setShowSellModal(false);
            setSelectedStock(null);
          }}
          onSuccess={() => {
            fetchWatchlist();
            fetchUserHoldings();
          }}
        />
      )}
    </div>
  );
};

export default Watchlist;