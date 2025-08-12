import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Bars3Icon, 
  BellIcon, 
  UserCircleIcon, 
  ChevronDownIcon,
  MagnifyingGlassIcon,
  SunIcon
} from '@heroicons/react/24/outline';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-white/20 fixed w-full top-0 z-50 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Left side */}
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <button
              onClick={onMenuClick}
              className="lg:hidden p-3 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition-all duration-200 hover:scale-105"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>

            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-tr from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">🚚</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-400 rounded-full animate-pulse"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  {import.meta.env.VITE_APP_NAME || 'GreenCart Logistics'}
                </h1>
                <p className="text-xs text-slate-500 font-medium">Smart Delivery Solutions</p>
              </div>
            </div>
          </div>

          {/* Center - Search (hidden on mobile) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search orders, drivers, routes..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50/80 border border-slate-200/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all duration-200"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-3">
            {/* Theme toggle */}
            <button className="p-3 text-slate-600 hover:text-amber-500 hover:bg-amber-50 rounded-xl transition-all duration-200 hover:scale-105">
              <SunIcon className="w-5 h-5" />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button className="p-3 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-200 hover:scale-105">
                <BellIcon className="w-5 h-5" />
              </button>
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium animate-bounce">
                3
              </span>
            </div>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 p-2 pr-4 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-2xl transition-all duration-200 hover:scale-105 border border-slate-200/60"
              >
                <div className="relative">
                  <UserCircleIcon className="w-8 h-8 text-slate-400" />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold">{user?.username}</p>
                  <p className="text-xs text-slate-500">Admin</p>
                </div>
                <ChevronDownIcon className="w-4 h-4 text-slate-400" />
              </button>

              {/* Dropdown menu */}
              {showUserMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-10 lg:hidden" 
                    onClick={() => setShowUserMenu(false)}
                  ></div>
                  
                  <div className="absolute right-0 mt-3 w-64 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 z-50 overflow-hidden">
                    <div className="px-6 py-4 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
                      <div className="flex items-center space-x-3">
                        <UserCircleIcon className="w-10 h-10 text-emerald-600" />
                        <div>
                          <p className="font-semibold text-slate-800">{user?.username}</p>
                          <p className="text-sm text-slate-600">{user?.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      <button className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 rounded-xl transition-colors duration-150 mb-1">
                        Profile Settings
                      </button>
                      <button className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 rounded-xl transition-colors duration-150 mb-1">
                        Preferences
                      </button>
                      <hr className="my-2 border-slate-200" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-150"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
