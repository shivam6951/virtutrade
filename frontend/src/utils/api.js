const API_BASE_URL = process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/api` : 'http://localhost:3002/api';

const api = {
  // Auth endpoints
  register: (userData) => 
    fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    }),

  login: (credentials) =>
    fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    }),

  // Portfolio endpoints
  getPortfolio: (token) =>
    fetch(`${API_BASE_URL}/portfolio`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }),

  // Transaction endpoints
  buyStock: (token, data) =>
    fetch(`${API_BASE_URL}/transactions/buy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    }),

  sellStock: (token, data) =>
    fetch(`${API_BASE_URL}/transactions/sell`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    }),

  getTransactions: (token) =>
    fetch(`${API_BASE_URL}/transactions`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }),

  // Watchlist endpoints
  getWatchlist: (token) =>
    fetch(`${API_BASE_URL}/watchlist`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }),

  addToWatchlist: (token, data) =>
    fetch(`${API_BASE_URL}/watchlist/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    }),

  // Goals endpoints
  getGoals: (token) =>
    fetch(`${API_BASE_URL}/goals`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }),

  addGoal: (token, data) =>
    fetch(`${API_BASE_URL}/goals/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    }),

  // Leaderboard endpoint
  getLeaderboard: (token) =>
    fetch(`${API_BASE_URL}/leaderboard`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }),

  // Search endpoint
  searchStocks: (token, query) =>
    fetch(`${API_BASE_URL}/search?query=${encodeURIComponent(query)}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }),

  // Market data endpoint
  getMarketData: (token) =>
    fetch(`${API_BASE_URL}/market`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }),

  // User profile endpoint
  getUserProfile: (token) =>
    fetch(`${API_BASE_URL}/user/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }),

  // Remove from watchlist endpoint
  removeFromWatchlist: (token, symbol) =>
    fetch(`${API_BASE_URL}/watchlist/${symbol}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
};

export default api;