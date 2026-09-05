import React from 'react';
import { useWatchlistStore } from '../stores/useWatchlistStore';
import { Sparkles, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';
import { DataFreshnessBadge } from './DataFreshnessBadge';

export const HeaderHero: React.FC = () => {
  const { dashboardData } = useWatchlistStore();

  if (!dashboardData) return null;

  const { user, marketPulseSummary, isQuietMarket } = dashboardData;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#131924] via-[#162030] to-[#131924] border border-[#232d3f] p-6 mb-8 shadow-xl">
      {/* Background Subtle Gradient Overlay */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-[#00d09c]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-xs font-bold tracking-wider uppercase text-[#00d09c] bg-[#00d09c]/10 px-2.5 py-1 rounded-md border border-[#00d09c]/20">
              Market Memory Engine
            </span>
            <DataFreshnessBadge />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Good Morning, <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">{user.name}</span>
          </h1>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-300">
            <div className="flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-[#00d09c]" />
              <span className="font-semibold text-white">
                {isQuietMarket
                  ? 'No critical changes since last visit'
                  : `${marketPulseSummary.stocksNeedingAttentionCount} meaningful changes since your last visit`}
              </span>
            </div>
            <div className="flex items-center space-x-1.5 text-gray-400 text-xs border-l border-[#232d3f] pl-4">
              <Clock className="w-3.5 h-3.5" />
              <span>Last checked: <strong className="text-gray-300">{user.lastVisit}</strong></span>
            </div>
          </div>
        </div>

        {/* Executive AI / Deterministic Insight Bubble */}
        <div className="md:max-w-md w-full bg-[#0b0e14]/60 backdrop-blur border border-[#232d3f] rounded-xl p-4 shadow-inner">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-[#00baf2]" />
              <span className="text-xs font-semibold text-[#00baf2] tracking-wide uppercase">Insight Summary</span>
            </div>
            <span className="text-[10px] text-gray-400 bg-gray-800 px-2 py-0.5 rounded">Deterministic Scoring</span>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed font-normal">
            {marketPulseSummary.aiExecutiveSummary}
          </p>
        </div>
      </div>
    </div>
  );
};
