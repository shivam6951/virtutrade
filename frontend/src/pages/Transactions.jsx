import React, { useState, useEffect } from 'react';
import { Filter, Download } from 'lucide-react';
import api from '../utils/api';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await api.getTransactions(token);
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filter !== 'ALL' && transaction.transaction_type !== filter) return false;
    return true;
  });

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border";
    switch (status) {
      case 'Completed':
        return {
          className: `${baseClasses} bg-green-200 dark:bg-green-900/60 text-green-900 dark:text-green-200 border-green-400 dark:border-green-500`,
          icon: '✓',
          text: 'Completed'
        };
      case 'Pending':
        return {
          className: `${baseClasses} bg-yellow-200 dark:bg-yellow-900/60 text-yellow-900 dark:text-yellow-200 border-yellow-400 dark:border-yellow-500`,
          icon: '⚠',
          text: 'Pending'
        };
      case 'Failed':
        return {
          className: `${baseClasses} bg-red-200 dark:bg-red-900/60 text-red-900 dark:text-red-200 border-red-400 dark:border-red-500`,
          icon: '✗',
          text: 'Failed'
        };
      default:
        return {
          className: `${baseClasses} bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-600`,
          icon: '?',
          text: status
        };
    }
  };

  const getTypeBadge = (type) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold border-l-4";
    return type === 'BUY' 
      ? {
          className: `${baseClasses} bg-green-200 dark:bg-green-900/60 text-green-900 dark:text-green-200 border-green-600`,
          icon: '↗',
          text: 'BUY'
        }
      : {
          className: `${baseClasses} bg-red-200 dark:bg-red-900/60 text-red-900 dark:text-red-200 border-red-600`,
          icon: '↘',
          text: 'SELL'
        };
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transactions</h1>
          <p className="text-gray-600 dark:text-gray-300">View your complete trading history</p>
        </div>
        <button 
          onClick={() => {
            const csvContent = [
              ['Date', 'Asset', 'Type', 'Quantity', 'Price', 'Total', 'Status'],
              ...transactions.map(t => [
                new Date(t.created_at).toLocaleDateString('en-IN'),
                t.asset_symbol,
                t.transaction_type,
                t.quantity,
                t.price,
                t.total_amount,
                t.status
              ])
            ].map(row => row.join(',')).join('\n');
            
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);
          }}
          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 hover:scale-105"
        >
          <Download className="h-4 w-4 mr-2" />
          Export
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>
          
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Types</option>
            <option value="BUY">Buy Only</option>
            <option value="SELL">Sell Only</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="card">
        {filteredTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Asset</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">Type</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">Quantity</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">Price</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">Total</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction, index) => (
                  <tr key={transaction.id} className={`border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                    index % 2 === 0 ? 'bg-gray-25 dark:bg-gray-800/20' : 'bg-white dark:bg-transparent'
                  }`}>
                    <td className="py-4 px-4 text-gray-900">
                      {new Date(transaction.created_at).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{transaction.asset_symbol}</p>
                        <p className="text-sm text-gray-600">{transaction.asset_name}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      {(() => {
                        const badge = getTypeBadge(transaction.transaction_type);
                        return (
                          <span className={badge.className}>
                            <span className="mr-1">{badge.icon}</span>
                            {badge.text}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="text-right py-4 px-4 text-gray-900">{transaction.quantity}</td>
                    <td className="text-right py-4 px-4 text-gray-900">₹{transaction.price}</td>
                    <td className="text-right py-4 px-4 font-medium text-gray-900">
                      ₹{transaction.total_amount.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {(() => {
                        const badge = getStatusBadge(transaction.status);
                        return (
                          <span className={badge.className}>
                            <span className="mr-1">{badge.icon}</span>
                            {badge.text}
                          </span>
                        );
                      })()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No transactions found.</p>
          </div>
        )}
      </div>

      {/* Transaction Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <p className="text-sm text-gray-600">Total Transactions</p>
          <p className="text-2xl font-bold text-gray-900">{transactions.length}</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-gray-600">Total Buy Orders</p>
          <p className="text-2xl font-bold text-green-600">
            {transactions.filter(t => t.transaction_type === 'BUY').length}
          </p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-gray-600">Total Sell Orders</p>
          <p className="text-2xl font-bold text-red-600">
            {transactions.filter(t => t.transaction_type === 'SELL').length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Transactions;