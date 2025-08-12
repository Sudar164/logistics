import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ChartBarIcon,
  BeakerIcon,
  UserGroupIcon,
  MapIcon,
  ShoppingBagIcon,
  XMarkIcon,
  HomeIcon,
  CogIcon,
} from '@heroicons/react/24/outline';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: ChartBarIcon, color: 'emerald' },
    { name: 'Simulation', href: '/simulation', icon: BeakerIcon, color: 'purple' },
    { name: 'Drivers', href: '/drivers', icon: UserGroupIcon, color: 'blue' },
    { name: 'Routes', href: '/routes', icon: MapIcon, color: 'orange' },
    { name: 'Orders', href: '/orders', icon: ShoppingBagIcon, color: 'pink' },
  ];

  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  const getActiveStyles = (isActive, color) => {
    if (isActive) {
      return {
        emerald: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30',
        purple: 'bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-lg shadow-purple-500/30',
        blue: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30',
        orange: 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30',
        pink: 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/30',
      }[color];
    }
    return 'text-slate-600 hover:text-slate-900 hover:bg-slate-50';
  };

  const getIconStyles = (isActive) => {
    return isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600';
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0 lg:pt-20 lg:z-30">
        <div className="flex flex-col flex-grow bg-white/60 backdrop-blur-xl border-r border-white/20 overflow-hidden">
          <div className="flex flex-col flex-grow p-4">
            {/* Quick stats */}
            <div className="mb-6 p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl border border-slate-200/50">
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Today's Summary</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-center">
                  <p className="font-bold text-emerald-600">24</p>
                  <p className="text-slate-500">Active Routes</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-blue-600">156</p>
                  <p className="text-slate-500">Deliveries</p>
                </div>
              </div>
            </div>

            <nav className="flex-1 space-y-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${getActiveStyles(isActive, item.color)} group flex items-center px-4 py-4 text-sm font-medium rounded-2xl transition-all duration-200 hover:scale-[1.02] transform`}
                  >
                    <div className={`p-2 rounded-xl mr-4 ${isActive ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-slate-200'} transition-colors duration-200`}>
                      <item.icon className={`${getIconStyles(isActive)} h-5 w-5`} />
                    </div>
                    <span className="flex-1">{item.name}</span>
                    {isActive && (
                      <div className="w-2 h-2 bg-white rounded-full opacity-80"></div>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Settings */}
            <div className="mt-6 pt-4 border-t border-slate-200">
              <Link
                to="/settings"
                className="group flex items-center px-4 py-3 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all duration-200"
              >
                <CogIcon className="text-slate-400 group-hover:text-slate-600 mr-3 h-5 w-5" />
                Settings
              </Link>
            </div>

            {/* Version info */}
            <div className="mt-4 p-3 bg-slate-50 rounded-xl">
              <p className="text-xs text-slate-500 font-medium">
                Version {import.meta.env.VITE_APP_VERSION || '2.0.0'}
              </p>
              <p className="text-xs text-emerald-600 font-medium">All systems operational</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300 ease-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full bg-white/95 backdrop-blur-xl border-r border-white/20 shadow-2xl">
          {/* Mobile header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200/60">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-tr from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <span className="text-xl">🚚</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">GreenCart</h2>
                <p className="text-xs text-slate-500">Logistics Hub</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all duration-200"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="flex flex-col flex-grow p-4">
            {/* Mobile quick stats */}
            <div className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Quick Overview</h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="text-center p-2 bg-white/60 rounded-xl">
                  <p className="font-bold text-emerald-600 text-lg">24</p>
                  <p className="text-slate-600">Routes</p>
                </div>
                <div className="text-center p-2 bg-white/60 rounded-xl">
                  <p className="font-bold text-blue-600 text-lg">156</p>
                  <p className="text-slate-600">Orders</p>
                </div>
              </div>
            </div>

            <nav className="flex-1 space-y-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={handleLinkClick}
                    className={`${getActiveStyles(isActive, item.color)} group flex items-center px-4 py-4 text-sm font-medium rounded-2xl transition-all duration-200`}
                  >
                    <div className={`p-2 rounded-xl mr-4 ${isActive ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-slate-200'}`}>
                      <item.icon className={`${getIconStyles(isActive)} h-5 w-5`} />
                    </div>
                    <span className="flex-1">{item.name}</span>
                    {isActive && (
                      <div className="w-2 h-2 bg-white rounded-full opacity-80 animate-pulse"></div>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile settings */}
            <div className="mt-6 pt-4 border-t border-slate-200">
              <Link
                to="/settings"
                onClick={handleLinkClick}
                className="group flex items-center px-4 py-3 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all duration-200"
              >
                <CogIcon className="text-slate-400 group-hover:text-slate-600 mr-3 h-5 w-5" />
                Settings
              </Link>
            </div>

            {/* Mobile version info */}
            <div className="mt-4 p-3 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl">
              <p className="text-xs text-slate-600 font-medium">
                Version {import.meta.env.VITE_APP_VERSION || '2.0.0'}
              </p>
              <div className="flex items-center mt-1">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                <p className="text-xs text-emerald-600 font-medium">System Online</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
