import React from 'react';
import { useWatchlistStore } from '../stores/useWatchlistStore';
import { StockCard } from './StockCard';
import { QuietMarketBanner } from './QuietMarketBanner';
import { AlertOctagon, Eye, Clock, CheckCircle2 } from 'lucide-react';

export const AttentionSection: React.FC = () => {
  const { dashboardData, hideNoise } = useWatchlistStore();

  if (!dashboardData) return null;

  const { prioritySections, isQuietMarket } = dashboardData;

  if (isQuietMarket) {
    return <QuietMarketBanner />;
  }

  return (
    <div className="space-y-8">
      {/* Category 1: Needs Attention (>80) */}
      {prioritySections.needsAttention.length > 0 && (
        <section>
          <div className="flex items-center space-x-2 mb-4 border-b border-[#232d3f] pb-2">
            <AlertOctagon className="w-5 h-5 text-[#ff5252]" />
            <h2 className="text-lg font-bold text-[#ff5252] tracking-wide uppercase">Needs Immediate Attention</h2>
            <span className="ml-auto text-xs bg-[#ff5252]/10 text-[#ff5252] border border-[#ff5252]/30 px-2 py-0.5 rounded-full font-bold">
              Score &gt; 80
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prioritySections.needsAttention.map((stock) => (
              <StockCard key={stock.symbol} stock={stock} />
            ))}
          </div>
        </section>
      )}

      {/* Category 2: Worth Watching (50-80) */}
      {prioritySections.worthWatching.length > 0 && (
        <section>
          <div className="flex items-center space-x-2 mb-4 border-b border-[#232d3f] pb-2">
            <Eye className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-amber-400 tracking-wide uppercase">Worth Watching</h2>
            <span className="ml-auto text-xs bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
              Score 50 - 80
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prioritySections.worthWatching.map((stock) => (
              <StockCard key={stock.symbol} stock={stock} />
            ))}
          </div>
        </section>
      )}

      {/* Category 3: Minor Changes (20-50) */}
      {!hideNoise && prioritySections.minorChanges.length > 0 && (
        <section>
          <div className="flex items-center space-x-2 mb-4 border-b border-[#232d3f] pb-2">
            <Clock className="w-5 h-5 text-[#00baf2]" />
            <h2 className="text-lg font-bold text-gray-300 tracking-wide uppercase">Minor Changes</h2>
            <span className="ml-auto text-xs bg-[#00baf2]/10 text-[#00baf2] border border-[#00baf2]/30 px-2 py-0.5 rounded-full font-bold">
              Score 20 - 50
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prioritySections.minorChanges.map((stock) => (
              <StockCard key={stock.symbol} stock={stock} />
            ))}
          </div>
        </section>
      )}

      {/* Category 4: Stable (<20) */}
      {!hideNoise && prioritySections.stable.length > 0 && (
        <section>
          <div className="flex items-center space-x-2 mb-4 border-b border-[#232d3f] pb-2">
            <CheckCircle2 className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-bold text-gray-400 tracking-wide uppercase">Stable Stocks</h2>
            <span className="ml-auto text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full font-bold">
              Score &lt; 20
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prioritySections.stable.map((stock) => (
              <StockCard key={stock.symbol} stock={stock} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
