import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, TrendingUp, TrendingDown } from 'lucide-react';
import api from '../utils/api';

const SearchBar = ({ onBuyStock }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length > 1) {
      const timeoutId = setTimeout(() => {
        searchStocks();
      }, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setResults([]);
      setShowResults(false);
    }
  }, [query, searchStocks]);

  const searchStocks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.searchStocks(token, query);
      const data = await response.json();
      setResults(data);
      setShowResults(true);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  }, [token, query]);

  const handleBuy = (stock) => {
    onBuyStock(stock);
    setQuery('');
    setShowResults(false);
  };

  return (
    <div className="relative w-full max-w-lg" ref={searchRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4">
          <Search className="h-5 w-5 text-gray-400 transition-colors duration-200" />
        </div>
        <input
          className="block w-full rounded-full border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-4 pl-12 pr-4 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 shadow-lg transition-all duration-300 hover:shadow-xl font-medium"
          placeholder="Search stocks, ETFs, mutual funds..."
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length > 1 && setShowResults(true)}
        />
      </div>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute z-50 w-full mt-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl shadow-2xl max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Searching...</div>
          ) : results.length > 0 ? (
            results.map((stock) => (
              <div
                key={stock.symbol}
                className="p-4 hover:bg-blue-50/50 dark:hover:bg-gray-700/50 border-b border-gray-100/50 dark:border-gray-700/50 last:border-b-0 cursor-pointer transition-all duration-200 hover:scale-[1.01] mx-2 my-1 rounded-xl"
                onClick={() => handleBuy(stock)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">
                          {stock.symbol.substring(0, 2)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{stock.symbol}</p>
                        <p className="text-sm text-gray-600">{stock.name}</p>
                        <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full mt-1">
                          {stock.type}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">₹{stock.currentPrice}</p>
                    <div className={`flex items-center justify-end ${stock.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stock.change > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                      <span className="text-xs">
                        {stock.change > 0 ? '+' : ''}₹{Math.abs(stock.change)} ({stock.changePercentage}%)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">No results found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;