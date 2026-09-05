import React from 'react';
import { useWatchlistStore } from '../stores/useWatchlistStore';
import { Activity, LayoutDashboard, ListFilter, Clock, SlidersHorizontal, Sparkles, RefreshCw } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab, setShowSimulatorModal, loadDashboard, loading } = useWatchlistStore();

  return (
    <header className="sticky top-0 z-40 bg-[#0b0e14]/90 backdrop-blur-md border-b border-[#232d3f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#00d09c] to-[#00baf2] flex items-center justify-center shadow-lg shadow-[#00d09c]/20">
              <Activity className="w-5 h-5 text-gray-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-white">PulseWatch</span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-[#00d09c]/15 text-[#00d09c] border border-[#00d09c]/30 rounded-full">
                  CODE 2026
                </span>
              </div>
              <p className="text-[11px] text-gray-400 font-medium hidden sm:block">Know What Changed. Focus on What Matters.</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-[#1c2433] text-[#00d09c] border border-[#00d09c]/30 shadow-sm'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#141a24]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('watchlist')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'watchlist'
                  ? 'bg-[#1c2433] text-[#00d09c] border border-[#00d09c]/30 shadow-sm'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#141a24]'
              }`}
            >
              <ListFilter className="w-4 h-4" />
              <span>Watchlist</span>
            </button>

            <button
              onClick={() => setActiveTab('timeline')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'timeline'
                  ? 'bg-[#1c2433] text-[#00d09c] border border-[#00d09c]/30 shadow-sm'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#141a24]'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span className="hidden sm:inline">Timeline</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'settings'
                  ? 'bg-[#1c2433] text-[#00d09c] border border-[#00d09c]/30 shadow-sm'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#141a24]'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </button>
          </nav>

          {/* Action Tools: Demo Simulator & Refresh */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowSimulatorModal(true)}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-semibold border border-amber-500/30 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Demo Simulator</span>
            </button>

            <button
              onClick={loadDashboard}
              disabled={loading}
              className="p-2 rounded-lg bg-[#141a24] hover:bg-[#1c2433] text-gray-300 border border-[#232d3f] transition-all disabled:opacity-50"
              title="Refresh Market Memory Snapshot"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#00d09c]' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
