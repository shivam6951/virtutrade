// Popular Indian stocks, ETFs, and mutual funds
const MARKET_ASSETS = [
  // Top Indian Stocks
  { symbol: 'RELIANCE.NS', name: 'Reliance Industries Limited', type: 'Stock' },
  { symbol: 'TCS.NS', name: 'Tata Consultancy Services', type: 'Stock' },
  { symbol: 'HDFCBANK.NS', name: 'HDFC Bank Limited', type: 'Stock' },
  { symbol: 'INFY.NS', name: 'Infosys Limited', type: 'Stock' },
  { symbol: 'ICICIBANK.NS', name: 'ICICI Bank Limited', type: 'Stock' },
  { symbol: 'HINDUNILVR.NS', name: 'Hindustan Unilever Limited', type: 'Stock' },
  { symbol: 'SBIN.NS', name: 'State Bank of India', type: 'Stock' },
  { symbol: 'BHARTIARTL.NS', name: 'Bharti Airtel Limited', type: 'Stock' },
  { symbol: 'ITC.NS', name: 'ITC Limited', type: 'Stock' },
  { symbol: 'KOTAKBANK.NS', name: 'Kotak Mahindra Bank Limited', type: 'Stock' },
  { symbol: 'LT.NS', name: 'Larsen & Toubro Limited', type: 'Stock' },
  { symbol: 'ASIANPAINT.NS', name: 'Asian Paints Limited', type: 'Stock' },
  { symbol: 'MARUTI.NS', name: 'Maruti Suzuki India Limited', type: 'Stock' },
  { symbol: 'TITAN.NS', name: 'Titan Company Limited', type: 'Stock' },
  { symbol: 'NESTLEIND.NS', name: 'Nestle India Limited', type: 'Stock' },
  { symbol: 'ULTRACEMCO.NS', name: 'UltraTech Cement Limited', type: 'Stock' },
  { symbol: 'POWERGRID.NS', name: 'Power Grid Corporation of India', type: 'Stock' },
  { symbol: 'NTPC.NS', name: 'NTPC Limited', type: 'Stock' },
  { symbol: 'TECHM.NS', name: 'Tech Mahindra Limited', type: 'Stock' },
  { symbol: 'HCLTECH.NS', name: 'HCL Technologies Limited', type: 'Stock' },
  
  // ETFs
  { symbol: 'NIFTYBEES.NS', name: 'Nippon India ETF Nifty BeES', type: 'ETF' },
  { symbol: 'JUNIORBEES.NS', name: 'Nippon India ETF Junior BeES', type: 'ETF' },
  { symbol: 'BANKBEES.NS', name: 'Nippon India ETF Bank BeES', type: 'ETF' },
  { symbol: 'GOLDBEES.NS', name: 'Nippon India ETF Gold BeES', type: 'ETF' },
  
  // Mutual Funds (using static NAV data)
  { symbol: 'AXISBLUE', name: 'Axis Bluechip Fund', type: 'Mutual Fund', nav: 47.25 },
  { symbol: 'HDFCTOP100', name: 'HDFC Top 100 Fund', type: 'Mutual Fund', nav: 785.50 },
  { symbol: 'ICICIPRU500', name: 'ICICI Prudential Nifty 500 Fund', type: 'Mutual Fund', nav: 156.75 },
  { symbol: 'SBISMALL', name: 'SBI Small Cap Fund', type: 'Mutual Fund', nav: 98.40 },
  { symbol: 'MOTILALMID', name: 'Motilal Oswal Midcap Fund', type: 'Mutual Fund', nav: 67.80 }
];

module.exports = MARKET_ASSETS;