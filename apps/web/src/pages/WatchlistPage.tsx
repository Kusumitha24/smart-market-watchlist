import React, { useState } from 'react';
import { useWatchlistStore } from '../stores/useWatchlistStore';
import { StockCard } from '../components/StockCard';
import { Plus, ArrowUpDown, Search, Star, Trash2 } from 'lucide-react';

export const WatchlistPage: React.FC = () => {
  const { dashboardData } = useWatchlistStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'SCORE' | 'CHANGE' | 'NAME'>('SCORE');

  if (!dashboardData) return null;

  const allStocks = [
    ...dashboardData.prioritySections.needsAttention,
    ...dashboardData.prioritySections.worthWatching,
    ...dashboardData.prioritySections.minorChanges,
    ...dashboardData.prioritySections.stable,
  ];

  const filteredStocks = allStocks
    .filter(
      (s) =>
        s.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'SCORE') return b.meaningfulScore - a.meaningfulScore;
      if (sortBy === 'CHANGE') return Math.abs(b.priceChangePercent) - Math.abs(a.priceChangePercent);
      return a.symbol.localeCompare(b.symbol);
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Watchlist Management</h1>
          <p className="text-xs text-gray-400">Track and organize your stocks across intelligent market memory watchlists</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search stocks by name or ticker..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#131924] border border-[#232d3f] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00d09c] w-64"
            />
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center space-x-1.5 bg-[#131924] border border-[#232d3f] rounded-xl px-3 py-2 text-xs text-gray-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#00d09c]" />
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
            >
              <option value="SCORE" className="bg-[#131924]">Sort by Attention Score</option>
              <option value="CHANGE" className="bg-[#131924]">Sort by Price % Change</option>
              <option value="NAME" className="bg-[#131924]">Sort Alphabetically</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Stock Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStocks.map((stock) => (
          <StockCard key={stock.symbol} stock={stock} />
        ))}
      </div>
    </div>
  );
};
