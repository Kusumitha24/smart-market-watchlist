import React from 'react';
import { useWatchlistStore } from '../stores/useWatchlistStore';
import { Filter, Sliders, EyeOff, Shield } from 'lucide-react';

export const MarketNoiseFilter: React.FC = () => {
  const { hideNoise, setHideNoise, sensitivity, setSensitivity } = useWatchlistStore();

  return (
    <div className="bg-[#131924] border border-[#232d3f] rounded-xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
      {/* Sensitivity Selector */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1.5 text-xs font-bold text-gray-300 uppercase tracking-wider">
          <Sliders className="w-4 h-4 text-[#00d09c]" />
          <span>Sensitivity Mode:</span>
        </div>

        <div className="flex items-center bg-[#0b0e14] p-1 rounded-lg border border-[#232d3f]">
          <button
            onClick={() => setSensitivity('CONSERVATIVE')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              sensitivity === 'CONSERVATIVE'
                ? 'bg-[#1c2433] text-white border border-gray-600 shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Conservative
          </button>

          <button
            onClick={() => setSensitivity('BALANCED')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              sensitivity === 'BALANCED'
                ? 'bg-[#00d09c] text-gray-950 shadow-sm font-bold'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Balanced (Default)
          </button>

          <button
            onClick={() => setSensitivity('SENSITIVE')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              sensitivity === 'SENSITIVE'
                ? 'bg-[#1c2433] text-[#00baf2] border border-[#00baf2]/30 shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Sensitive
          </button>
        </div>
      </div>

      {/* Hide Noise Toggle Button */}
      <button
        onClick={() => setHideNoise(!hideNoise)}
        className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
          hideNoise
            ? 'bg-[#00baf2]/10 border-[#00baf2]/40 text-[#00baf2]'
            : 'bg-[#1c2433] border-[#232d3f] text-gray-400 hover:text-white'
        }`}
      >
        <EyeOff className="w-3.5 h-3.5" />
        <span>{hideNoise ? 'Market Noise Filtered (Hiding Minor Stocks)' : 'Filter Sub-1% Noise'}</span>
      </button>
    </div>
  );
};
