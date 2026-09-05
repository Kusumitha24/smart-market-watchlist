import React from 'react';
import { StockChangeEvaluation } from '../types';
import { useWatchlistStore } from '../stores/useWatchlistStore';
import { TrendingDown, TrendingUp, HelpCircle, Play, Sparkles, AlertTriangle, ChevronRight } from 'lucide-react';

interface StockCardProps {
  stock: StockChangeEvaluation;
}

export const StockCard: React.FC<StockCardProps> = ({ stock }) => {
  const { setSelectedStockForExplainability, setSelectedStockForReplay } = useWatchlistStore();

  const isDrop = stock.priceChangePercent < 0;
  const isSurge = stock.priceChangePercent > 0;

  // Score Badge Color Strategy
  let scoreBadgeStyle = 'bg-gray-800 text-gray-300 border-gray-700';
  let cardBorder = 'border-[#232d3f] hover:border-gray-600';

  if (stock.priorityCategory === 'NEEDS_ATTENTION') {
    scoreBadgeStyle = 'bg-[#ff5252]/10 text-[#ff5252] border-[#ff5252]/40 shadow-sm shadow-[#ff5252]/10';
    cardBorder = 'border-[#ff5252]/30 hover:border-[#ff5252]/60 bg-gradient-to-b from-[#181216] to-[#131924]';
  } else if (stock.priorityCategory === 'WORTH_WATCHING') {
    scoreBadgeStyle = 'bg-amber-500/10 text-amber-400 border-amber-500/40';
    cardBorder = 'border-amber-500/30 hover:border-amber-500/60 bg-gradient-to-b from-[#1a1712] to-[#131924]';
  } else if (stock.priorityCategory === 'MINOR_CHANGES') {
    scoreBadgeStyle = 'bg-[#00baf2]/10 text-[#00baf2] border-[#00baf2]/30';
  }

  return (
    <div className={`rounded-2xl border p-5 transition-all duration-200 shadow-md ${cardBorder}`}>
      {/* Top Header Row */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-extrabold text-white tracking-wide">{stock.symbol}</h3>
            <span className="text-xs font-semibold text-gray-400 truncate max-w-[150px] sm:max-w-[200px]">
              {stock.name}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5 font-mono">
            ₹{stock.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
        </div>

        {/* Meaningful Change Score Badge */}
        <div className="text-right">
          <div className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-extrabold border ${scoreBadgeStyle}`}>
            <Sparkles className="w-3 h-3" />
            <span>Score: {stock.meaningfulScore}/100</span>
          </div>
          <div className="mt-1 flex items-center justify-end space-x-1 text-xs font-bold">
            {isDrop ? (
              <span className="flex items-center text-[#ff5252]">
                <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                {stock.priceChangePercent.toFixed(1)}%
              </span>
            ) : isSurge ? (
              <span className="flex items-center text-[#00d09c]">
                <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                +{stock.priceChangePercent.toFixed(1)}%
              </span>
            ) : (
              <span className="text-gray-400">0.0%</span>
            )}
          </div>
        </div>
      </div>

      {/* Explainability Section ("WHY AM I SEEING THIS?") */}
      <div className="bg-[#0b0e14]/70 rounded-xl p-3.5 border border-[#232d3f] mb-4">
        <div className="flex items-center space-x-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
          <HelpCircle className="w-3.5 h-3.5 text-[#00baf2]" />
          <span>Why Am I Seeing This?</span>
        </div>

        <ul className="space-y-1.5">
          {stock.reasons.slice(0, 3).map((r, idx) => (
            <li key={idx} className="flex items-center space-x-2 text-xs text-gray-200 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00d09c] flex-shrink-0" />
              <span>{r.message}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action Footer Buttons */}
      <div className="flex items-center justify-between pt-2 border-t border-[#232d3f]/60 text-xs">
        <button
          onClick={() => setSelectedStockForExplainability(stock)}
          className="flex items-center space-x-1 text-[#00baf2] hover:text-white font-semibold transition-colors"
        >
          <span>Explain Details</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => setSelectedStockForReplay(stock)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#1c2433] hover:bg-[#232d3f] text-gray-300 font-semibold border border-[#232d3f] transition-all"
        >
          <Play className="w-3 h-3 text-[#00d09c] fill-[#00d09c]" />
          <span>Replay Market</span>
        </button>
      </div>
    </div>
  );
};
