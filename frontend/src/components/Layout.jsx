import React, { useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  History, 
  Heart, 
  Target, 
  Trophy, 
  User, 
  Menu,
  X
} from 'lucide-react';
import SearchBar from './SearchBar';
import BuyModal from './BuyModal';
import ThemeToggle from './ThemeToggle';
import api from '../utils/api';

const Layout = ({ children, user, onLogout }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileData, setProfileData] = useState({ firstName: '', lastName: '' });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const token = localStorage.getItem('token');

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Portfolio', href: '/portfolio', icon: Briefcase },
    { name: 'Transactions', href: '/transactions', icon: History },
    { name: 'Watchlist', href: '/watchlist', icon: Heart },
    { name: 'Goals', href: '/goals', icon: Target },
    { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
  ];

  // Fetch updated user profile
  const fetchUserProfile = useCallback(async () => {
    try {
      const response = await api.getUserProfile(token);
      if (response.ok) {
        const userData = await response.json();
        setCurrentUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }, [token]);

  // Update user profile when component mounts
  React.useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserDropdown && !event.target.closest('.user-dropdown')) {
        setShowUserDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserDropdown]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between px-4">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:scale-105 transition-transform duration-200" onClick={() => setSidebarOpen(false)}>
              VirtuTrade
            </Link>
            <button onClick={() => setSidebarOpen(false)}>
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 space-y-2 px-4 py-6">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-700/60 hover:text-gray-900 dark:hover:text-white hover:scale-105'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="mr-3 h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className={`hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col transition-all duration-300 ${sidebarCollapsed ? 'lg:w-16' : 'lg:w-64'}`}>
        <div className="flex flex-col flex-grow bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-r border-white/20 dark:border-gray-700/20 shadow-sm">
          <div className="flex h-16 items-center px-4 justify-between">
            {!sidebarCollapsed && (
              <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:scale-105 transition-transform duration-200">
                VirtuTrade
              </Link>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
          <nav className="flex-1 space-y-2 px-4 py-6">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-700/60 hover:text-gray-900 dark:hover:text-white hover:scale-105'
                  }`}
                  title={sidebarCollapsed ? item.name : ''}
                >
                  <Icon className={`h-5 w-5 transition-transform duration-200 group-hover:scale-110 ${sidebarCollapsed ? '' : 'mr-3'}`} />
                  {!sidebarCollapsed && item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64'}`}>
        {/* Top navbar */}
        <div className="sticky top-0 z-40 flex h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-sm border-b border-white/20 dark:border-gray-700/20">
          <button
            className="px-4 text-gray-500 dark:text-gray-400 focus:outline-none lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex flex-1 justify-between px-4">
            <div className="flex flex-1 items-center">
              <div className="flex w-full md:ml-0">
                <div className="w-full max-w-lg">
                  <SearchBar onBuyStock={(stock) => {
                    setSelectedStock(stock);
                    setShowBuyModal(true);
                  }} />
                </div>
              </div>
            </div>
            <div className="ml-4 flex items-center space-x-3 md:ml-6">
              <ThemeToggle />
              <div className="relative user-dropdown">
                <button 
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <User className="h-8 w-8 rounded-full bg-gray-200 p-1" />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">{currentUser?.username}</span>
                </button>
                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50">
                    <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                      Balance: ₹{Number(currentUser?.balance || 0).toLocaleString()}
                    </div>
                    {(!currentUser?.firstName || !currentUser?.lastName) && (
                      <button 
                        onClick={() => {
                          setShowUserDropdown(false);
                          setShowProfileModal(true);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Complete Profile
                      </button>
                    )}
                    <button 
                      onClick={() => {
                        setShowUserDropdown(false);
                        onLogout();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-8">
          <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
            {children}
          </div>
        </main>
      </div>
      
      {showBuyModal && selectedStock && (
        <BuyModal 
          stock={selectedStock}
          onClose={() => {
            setShowBuyModal(false);
            setSelectedStock(null);
          }}
          onSuccess={() => {
            fetchUserProfile();
          }}
        />
      )}
      
      {/* Profile Update Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setShowProfileModal(false)} />
            <div className="relative bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Complete Your Profile</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter last name"
                    />
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => setShowProfileModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Skip
                  </button>
                  <button 
                    onClick={async () => {
                      try {
                        const response = await fetch('http://localhost:3002/api/user/profile', {
                          method: 'PUT',
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                          },
                          body: JSON.stringify({
                            firstName: profileData.firstName,
                            lastName: profileData.lastName,
                            fullName: `${profileData.firstName} ${profileData.lastName}`.trim()
                          })
                        });
                        
                        if (response.ok) {
                          const updatedUser = { 
                            ...currentUser, 
                            firstName: profileData.firstName,
                            lastName: profileData.lastName,
                            fullName: `${profileData.firstName} ${profileData.lastName}`.trim()
                          };
                          setCurrentUser(updatedUser);
                          localStorage.setItem('user', JSON.stringify(updatedUser));
                          setShowProfileModal(false);
                          setProfileData({ firstName: '', lastName: '' });
                        }
                      } catch (error) {
                        console.error('Error updating profile:', error);
                      }
                    }}
                    disabled={!profileData.firstName || !profileData.lastName}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Update Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;