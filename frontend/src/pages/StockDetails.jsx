import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Heart, Share, Info } from 'lucide-react';
import { mockStockData } from '../utils/mockData';

const StockDetails = () => {
  const [quantity, setQuantity] = useState(1);
  const [orderType, setOrderType] = useState('BUY');
  const [showOrderModal, setShowOrderModal] = useState(false);

  const { symbol, name, price, change, changePercentage, marketCap, pe, chartData } = mockStockData;

  const OrderModal = () => (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setShowOrderModal(false)} />
        <div className="relative bg-white rounded-lg max-w-md w-full p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {orderType} {symbol}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price per share
              </label>
              <input
                type="number"
                value={price}
                readOnly
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50"
              />
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between text-sm">
                <span>Total Amount:</span>
                <span className="font-medium">₹{(quantity * price).toLocaleString()}</span>
              </div>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={() => setShowOrderModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={() => setShowOrderModal(false)}
                className={`flex-1 px-4 py-2 rounded-lg font-medium text-white ${
                  orderType === 'BUY' ? 'bg-success-600 hover:bg-success-700' : 'bg-danger-600 hover:bg-danger-700'
                }`}
              >
                Place {orderType} Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Stock Header */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{symbol}</h1>
            <p className="text-gray-600">{name}</p>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-red-500">
              <Heart className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Share className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold text-gray-900">₹{price}</p>
            <div className={`flex items-center mt-1 ${change > 0 ? 'text-success-600' : 'text-danger-600'}`}>
              {change > 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
              <span className="font-medium">
                {change > 0 ? '+' : ''}₹{Math.abs(change)} ({changePercentage}%)
              </span>
            </div>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={() => {
                setOrderType('BUY');
                setShowOrderModal(true);
              }}
              className="btn-success"
            >
              Buy
            </button>
            <button 
              onClick={() => {
                setOrderType('SELL');
                setShowOrderModal(true);
              }}
              className="btn-danger"
            >
              Sell
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Price Chart</h2>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm bg-primary-50 text-primary-600 rounded">1D</button>
              <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded">1W</button>
              <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded">1M</button>
              <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded">1Y</button>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={['dataMin - 10', 'dataMax + 10']} />
                <Tooltip formatter={(value) => [`₹${value}`, 'Price']} />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke={change > 0 ? "#22c55e" : "#ef4444"} 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stock Info */}
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Market Cap</span>
                <span className="font-medium text-gray-900">{marketCap}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">P/E Ratio</span>
                <span className="font-medium text-gray-900">{pe}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Day's High</span>
                <span className="font-medium text-gray-900">₹{price + 25}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Day's Low</span>
                <span className="font-medium text-gray-900">₹{price - 15}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">52W High</span>
                <span className="font-medium text-gray-900">₹{price + 150}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">52W Low</span>
                <span className="font-medium text-gray-900">₹{price - 200}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">About Company</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Reliance Industries Limited is an Indian multinational conglomerate company 
              headquartered in Mumbai. It has diverse businesses across energy, 
              petrochemicals, oil & gas, telecom and retail.
            </p>
          </div>
        </div>
      </div>

      {/* News & Analysis */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Latest News</h2>
        <div className="space-y-4">
          {[
            {
              title: "Reliance Industries reports strong Q4 results",
              summary: "The company posted a 12% increase in net profit for the quarter...",
              time: "2 hours ago",
              sentiment: "positive"
            },
            {
              title: "New retail expansion plans announced",
              summary: "Reliance Retail to open 500 new stores across India...",
              time: "5 hours ago",
              sentiment: "positive"
            },
            {
              title: "Oil prices impact on petrochemical business",
              summary: "Rising crude oil prices may affect margins in the short term...",
              time: "1 day ago",
              sentiment: "neutral"
            }
          ].map((news, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">{news.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{news.summary}</p>
                  <span className="text-xs text-gray-500">{news.time}</span>
                </div>
                <div className="ml-4">
                  <span className={`inline-block w-3 h-3 rounded-full ${
                    news.sentiment === 'positive' ? 'bg-success-500' :
                    news.sentiment === 'negative' ? 'bg-danger-500' : 'bg-gray-400'
                  }`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showOrderModal && <OrderModal />}
    </div>
  );
};

export default StockDetails;