import React from 'react';
import { useWatchlistStore } from '../stores/useWatchlistStore';
import { TrendingUp, TrendingDown, Activity, Flame, ShieldAlert } from 'lucide-react';

export const WatchlistPulseSummary: React.FC = () => {
  const { dashboardData } = useWatchlistStore();

  if (!dashboardData) return null;

  const { marketPulseSummary } = dashboardData;

  const activityBadgeColor =
    marketPulseSummary.overallActivity === 'HIGH'
      ? 'bg-red-500/10 text-red-400 border-red-500/30'
      : marketPulseSummary.overallActivity === 'MODERATE'
      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
      : 'bg-[#00d09c]/10 text-[#00d09c] border-[#00d09c]/30';

  return (
    <div className="bg-[#131924] border border-[#232d3f] rounded-2xl p-5 mb-8 shadow-lg">
      <div className="flex items-center justify-between mb-4 border-b border-[#232d3f] pb-3">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-[#00d09c]" />
          <h2 className="text-base font-bold text-white tracking-wide uppercase">Watchlist Pulse</h2>
        </div>
        <span className={`px-3 py-1 text-xs font-bold rounded-full border ${activityBadgeColor}`}>
          Activity: {marketPulseSummary.overallActivity}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Metric 1 */}
        <div className="bg-[#0b0e14]/60 p-3.5 rounded-xl border border-[#232d3f]">
          <div className="flex items-center space-x-2 text-gray-400 text-xs mb-1">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Requires Attention</span>
          </div>
          <p className="text-xl font-extrabold text-white">{marketPulseSummary.stocksNeedingAttentionCount}</p>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#0b0e14]/60 p-3.5 rounded-xl border border-[#232d3f]">
          <div className="text-gray-400 text-xs mb-1">Market Sentiment</div>
          <p className="text-sm font-bold text-white">{marketPulseSummary.marketSentiment}</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#0b0e14]/60 p-3.5 rounded-xl border border-[#232d3f]">
          <div className="flex items-center space-x-1.5 text-gray-400 text-xs mb-1">
            <Flame className="w-3.5 h-3.5 text-purple-400" />
            <span>Most Volatile</span>
          </div>
          <p className="text-sm font-extrabold text-purple-300">{marketPulseSummary.mostVolatileSymbol}</p>
        </div>

        {/* Metric 4 */}
        <div className="bg-[#0b0e14]/60 p-3.5 rounded-xl border border-[#232d3f]">
          <div className="flex items-center space-x-1.5 text-gray-400 text-xs mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-[#00d09c]" />
            <span>Biggest Gain</span>
          </div>
          <p className="text-sm font-bold text-[#00d09c]">
            {marketPulseSummary.biggestGain.symbol} (+{marketPulseSummary.biggestGain.changePercent}%)
          </p>
        </div>

        {/* Metric 5 */}
        <div className="bg-[#0b0e14]/60 p-3.5 rounded-xl border border-[#232d3f] col-span-2 sm:col-span-1">
          <div className="flex items-center space-x-1.5 text-gray-400 text-xs mb-1">
            <TrendingDown className="w-3.5 h-3.5 text-[#ff5252]" />
            <span>Biggest Drop</span>
          </div>
          <p className="text-sm font-bold text-[#ff5252]">
            {marketPulseSummary.biggestLoss.symbol} ({marketPulseSummary.biggestLoss.changePercent}%)
          </p>
        </div>
      </div>
    </div>
  );
};
