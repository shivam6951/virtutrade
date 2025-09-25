import React, { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import api from '../utils/api';

const SellModal = ({ stock, holding, onClose, onSuccess }) => {
  const [quantity, setQuantity] = useState(1);
  const [pricePerShare, setPricePerShare] = useState(0);
  const [loading, setLoading] = useState(false);
  const [priceLoading, setPriceLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  const maxQuantity = parseInt(holding?.quantity) || 0;
  const avgBuyPrice = parseFloat(holding?.avg_buy_price) || 0;

  useEffect(() => {
    fetchStockPrice();
  }, [fetchStockPrice]);

  const fetchStockPrice = useCallback(async () => {
    setPriceLoading(true);
    setError('');
    
    try {
      const response = await fetch(`http://localhost:3002/api/market/${stock.symbol}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPricePerShare(parseFloat(data.current_price) || stock.currentPrice || 0);
      } else {
        setPricePerShare(stock.currentPrice || 0);
      }
    } catch (err) {
      console.error('Error fetching price:', err);
      setPricePerShare(stock.currentPrice || 0);
    } finally {
      setPriceLoading(false);
    }
  }, [stock.symbol, token]);

  const totalAmount = Number(quantity || 0) * Number(pricePerShare || 0);
  const totalCost = Number(quantity || 0) * Number(avgBuyPrice || 0);
  const profitLoss = totalAmount - totalCost;
  const canSell = quantity > 0 && quantity <= maxQuantity;

  const handleSell = async () => {
    if (!canSell || priceLoading) return;

    setLoading(true);
    setError('');

    try {
      const response = await api.sellStock(token, {
        symbol: stock.symbol,
        quantity: parseInt(quantity) || 1
      });

      if (response.ok) {
        onSuccess();
        onClose();
      } else {
        const data = await response.json();
        setError(data.error || 'Sale failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^[0-9]+$/.test(value)) {
      const numValue = value === '' ? 0 : parseInt(value);
      setQuantity(Math.max(0, Math.min(numValue, maxQuantity)));
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={onClose} />
        <div className="relative bg-white rounded-lg max-w-md w-full p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Sell {stock.symbol || 'Stock'}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 font-semibold text-sm">
                    {(stock.symbol || 'ST').substring(0, 2)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{stock.symbol || 'Unknown'}</p>
                  <p className="text-sm text-gray-600">{stock.name || 'Stock Name'}</p>
                  <p className="text-xs text-gray-500">Holdings: {maxQuantity} shares</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity (Max: {maxQuantity})
              </label>
              <input
                type="number"
                value={quantity || ''}
                onChange={handleQuantityChange}
                min="1"
                max={maxQuantity}
                disabled={priceLoading}
                placeholder="Enter quantity"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Price per share
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={priceLoading ? 'Loading...' : `₹${(pricePerShare || 0).toFixed(2)}`}
                  readOnly
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50"
                />
                {priceLoading && (
                  <div className="absolute right-3 top-2">
                    <div className="animate-spin h-4 w-4 border-2 border-red-500 border-t-transparent rounded-full"></div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-red-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span>Sale Amount:</span>
                <span className="font-medium">₹{Number(totalAmount || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Avg Buy Price:</span>
                <span className="font-medium">₹{avgBuyPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total Cost:</span>
                <span className="font-medium">₹{Number(totalCost || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm border-t pt-2">
                <span>Profit/Loss:</span>
                <span className={`font-medium ${profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {profitLoss >= 0 ? '+' : ''}₹{Number(profitLoss || 0).toFixed(2)}
                </span>
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
                {error}
              </div>
            )}

            {!canSell && !priceLoading && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
                Invalid quantity. You can sell up to {maxQuantity} shares.
              </div>
            )}

            <div className="flex space-x-3">
              <button 
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleSell}
                disabled={loading || !canSell || priceLoading}
                className="flex-1 px-4 py-2 rounded-lg font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  `Sell ${quantity || 1} shares`
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellModal;