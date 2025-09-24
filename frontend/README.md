# VirtuTrade Frontend

A React-based frontend for the VirtuTrade virtual stock trading platform, designed with a Groww-like interface.

## Features

- **Dashboard**: Portfolio overview with wallet balance, growth charts, and top holdings
- **Portfolio**: Detailed holdings table with P&L tracking and asset allocation pie chart
- **Transactions**: Complete trading history with filtering options
- **Watchlist**: Favorite stocks with real-time price updates and quick buy/sell actions
- **Goals**: Financial goal setting with progress tracking and investment suggestions
- **Leaderboard**: Gamified ranking system with badges and competitions
- **Stock Details**: Individual stock pages with charts, company info, and trading interface

## Tech Stack

- **React 18** - Frontend framework
- **Tailwind CSS** - Styling and responsive design
- **Recharts** - Charts and data visualization
- **React Router** - Navigation and routing
- **Lucide React** - Modern icon library

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Project Structure

```
src/
├── components/
│   └── Layout.jsx          # Main layout with sidebar and navbar
├── pages/
│   ├── Dashboard.jsx       # Dashboard with portfolio overview
│   ├── Portfolio.jsx       # Holdings and asset allocation
│   ├── Transactions.jsx    # Trading history
│   ├── Watchlist.jsx       # Favorite stocks
│   ├── Goals.jsx           # Financial goals
│   ├── Leaderboard.jsx     # User rankings
│   └── StockDetails.jsx    # Individual stock page
├── utils/
│   └── mockData.js         # Sample data for development
├── App.jsx                 # Main app component
├── index.js               # Entry point
└── index.css              # Global styles
```

## Design System

### Colors
- **Primary**: Blue (#3b82f6) - Used for main actions and highlights
- **Success**: Green (#22c55e) - Used for positive values and buy actions
- **Danger**: Red (#ef4444) - Used for negative values and sell actions

### Components
- **Cards**: White background with subtle shadows and rounded corners
- **Buttons**: Consistent styling with hover states
- **Tables**: Clean, responsive design with hover effects
- **Charts**: Interactive charts using Recharts library

## Mock Data

The application uses mock data for development purposes. All data is stored in `src/utils/mockData.js` and includes:

- User profile and wallet information
- Portfolio holdings and performance data
- Transaction history
- Watchlist stocks
- Financial goals
- Leaderboard rankings
- Stock details and price data

## Responsive Design

The application is fully responsive and works on:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (one-way operation)

## Next Steps

1. **Backend Integration**: Connect to Express.js APIs
2. **Real Data**: Replace mock data with live stock prices
3. **Authentication**: Add user login/signup functionality
4. **Real-time Updates**: Implement WebSocket for live price updates
5. **Advanced Charts**: Add candlestick charts and technical indicators
6. **Mobile App**: Consider React Native version

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request