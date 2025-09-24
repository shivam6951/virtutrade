// Mock data for the application
export const mockUser = {
  id: 1,
  name: "Shivam Kumar",
  email: "shivam@example.com",
  walletBalance: 100000,
  totalInvested: 45000,
  currentValue: 52500,
  totalGain: 7500,
  gainPercentage: 16.67
};

export const mockPortfolioData = [
  { date: '2024-01', value: 45000 },
  { date: '2024-02', value: 47000 },
  { date: '2024-03', value: 44000 },
  { date: '2024-04', value: 49000 },
  { date: '2024-05', value: 52500 }
];

export const mockHoldings = [
  {
    id: 1,
    symbol: 'RELIANCE',
    name: 'Reliance Industries',
    quantity: 10,
    avgPrice: 2450,
    currentPrice: 2680,
    type: 'Stock',
    pnl: 2300,
    pnlPercentage: 9.39
  },
  {
    id: 2,
    symbol: 'NIFTYBEES',
    name: 'Nippon India ETF Nifty BeES',
    quantity: 50,
    avgPrice: 185,
    currentPrice: 195,
    type: 'ETF',
    pnl: 500,
    pnlPercentage: 5.41
  },
  {
    id: 3,
    symbol: 'AXISBLUE',
    name: 'Axis Bluechip Fund',
    quantity: 100,
    avgPrice: 45,
    currentPrice: 47,
    type: 'Mutual Fund',
    pnl: 200,
    pnlPercentage: 4.44
  }
];

export const mockTransactions = [
  {
    id: 1,
    date: '2024-05-15',
    symbol: 'RELIANCE',
    type: 'BUY',
    quantity: 5,
    price: 2680,
    status: 'Completed'
  },
  {
    id: 2,
    date: '2024-05-14',
    symbol: 'NIFTYBEES',
    type: 'SELL',
    quantity: 10,
    price: 195,
    status: 'Completed'
  },
  {
    id: 3,
    date: '2024-05-13',
    symbol: 'AXISBLUE',
    type: 'BUY',
    quantity: 50,
    price: 47,
    status: 'Completed'
  }
];

export const mockWatchlist = [
  {
    id: 1,
    symbol: 'TCS',
    name: 'Tata Consultancy Services',
    price: 3850,
    change: 45.50,
    changePercentage: 1.20
  },
  {
    id: 2,
    symbol: 'INFY',
    name: 'Infosys Limited',
    price: 1456,
    change: -12.30,
    changePercentage: -0.84
  },
  {
    id: 3,
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Limited',
    price: 1678,
    change: 23.40,
    changePercentage: 1.41
  }
];

export const mockGoals = [
  {
    id: 1,
    title: 'Buy a Car',
    targetAmount: 800000,
    currentAmount: 125000,
    targetDate: '2027-05-01',
    monthlyInvestment: 15000,
    progress: 15.6
  },
  {
    id: 2,
    title: 'House Down Payment',
    targetAmount: 2000000,
    currentAmount: 450000,
    targetDate: '2029-12-01',
    monthlyInvestment: 25000,
    progress: 22.5
  }
];

export const mockLeaderboard = [
  {
    rank: 1,
    username: 'InvestorPro',
    portfolioValue: 185000,
    gainPercentage: 85.0,
    badge: 'Gold'
  },
  {
    rank: 2,
    username: 'StockMaster',
    portfolioValue: 165000,
    gainPercentage: 65.0,
    badge: 'Silver'
  },
  {
    rank: 3,
    username: 'TradingGuru',
    portfolioValue: 145000,
    gainPercentage: 45.0,
    badge: 'Bronze'
  },
  {
    rank: 4,
    username: 'You',
    portfolioValue: 125000,
    gainPercentage: 25.0,
    badge: null
  }
];

export const mockStockData = {
  symbol: 'RELIANCE',
  name: 'Reliance Industries Limited',
  price: 2680,
  change: 45.50,
  changePercentage: 1.73,
  marketCap: '18,12,345 Cr',
  pe: 24.5,
  chartData: [
    { time: '09:15', price: 2635 },
    { time: '10:00', price: 2645 },
    { time: '11:00', price: 2660 },
    { time: '12:00', price: 2655 },
    { time: '13:00', price: 2670 },
    { time: '14:00', price: 2680 },
    { time: '15:30', price: 2680 }
  ]
};