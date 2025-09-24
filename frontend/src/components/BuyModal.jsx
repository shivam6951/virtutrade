import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../utils/api';

const BuyModal = ({ stock, onClose, onSuccess }) => {
  const [quantity, setQuantity] = useState(1);
  const [pricePerShare, setPricePerShare] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [priceLoading, setPriceLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchStockPrice();
    setWalletBalance(user.balance || 0);
  }, [stock.symbol]);

  const fetchStockPrice = async () => {
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
      setLoading(false);
    }
  };

  const totalAmount = Number(quantity || 0) * Number(pricePerShare || 0);
  const remainingBalance = Number(walletBalance || 0) - totalAmount;
  const canAfford = remainingBalance >= 0 && totalAmount > 0;

  const handleBuy = async () => {
    console.log('Buy button clicked', { canAfford, priceLoading, quantity, totalAmount });
    
    if (!canAfford || priceLoading || !quantity || quantity <= 0) {
      console.log('Buy blocked:', { canAfford, priceLoading, quantity });
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Sending buy request:', {
        symbol: stock.symbol,
        quantity: parseInt(quantity),
        assetName: stock.name || stock.symbol
      });
      
      const response = await api.buyStock(token, {
        symbol: stock.symbol,
        quantity: parseInt(quantity) || 1,
        assetName: stock.name || stock.symbol
      });

      console.log('Buy response:', response.status);
      
      if (response.ok) {
        console.log('Buy successful');
        onSuccess();
        onClose();
      } else {
        const data = await response.json();
        console.log('Buy failed:', data);
        setError(data.error || 'Purchase failed');
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
      setQuantity(value === '' ? '' : parseInt(value));
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={onClose} />
        <div className="relative bg-white rounded-lg max-w-md w-full p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Buy {stock.symbol || 'Stock'}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">
                    {(stock.symbol || 'ST').substring(0, 2)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{stock.symbol || 'Unknown'}</p>
                  <p className="text-sm text-gray-600">{stock.name || 'Stock Name'}</p>
                  <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full mt-1">
                    {stock.type || 'Stock'}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <input
                type="number"
                value={quantity || ''}
                onChange={handleQuantityChange}
                min="1"
                disabled={priceLoading}
                placeholder="Enter quantity"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price per share
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
                    <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total Amount:</span>
                <span className="font-medium">₹{Number(totalAmount || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Available Balance:</span>
                <span className="font-medium">₹{Number(walletBalance || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Remaining Balance:</span>
                <span className={`font-medium ${canAfford ? 'text-green-600' : 'text-red-600'}`}>
                  ₹{Number(remainingBalance || 0).toFixed(2)}
                </span>
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
                {error}
              </div>
            )}

            {!canAfford && !priceLoading && totalAmount > 0 && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
                Insufficient balance to complete this purchase
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
                onClick={handleBuy}
                disabled={loading || !canAfford || priceLoading || totalAmount <= 0}
                className="flex-1 px-4 py-2 rounded-lg font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  `Buy ${quantity || 1} shares`
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyModal;