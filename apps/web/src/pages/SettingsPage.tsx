import React from 'react';
import { useWatchlistStore } from '../stores/useWatchlistStore';
import { Sliders, Bell, RefreshCw, Shield, Trash2 } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { sensitivity, setSensitivity, hideNoise, setHideNoise, loadDashboard } = useWatchlistStore();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
          <Sliders className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-white">Engine Preferences</h1>
          <p className="text-xs text-gray-400">Configure Market Memory thresholds, data freshness, and noise filters</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Sensitivity Option */}
        <div className="bg-[#131924] border border-[#232d3f] rounded-2xl p-6 shadow-md">
          <h2 className="text-base font-bold text-white mb-1">Meaningful Change Sensitivity</h2>
          <p className="text-xs text-gray-400 mb-4">
            Controls how aggressively the deterministic scoring engine flags price and volume changes.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => setSensitivity('CONSERVATIVE')}
              className={`p-4 rounded-xl border text-left transition-all ${
                sensitivity === 'CONSERVATIVE'
                  ? 'bg-[#1c2433] border-[#00d09c] text-white'
                  : 'bg-[#0b0e14]/60 border-[#232d3f] text-gray-400 hover:border-gray-600'
              }`}
            >
              <div className="text-sm font-bold mb-1">Conservative</div>
              <p className="text-[11px] text-gray-400">Surfaces only major price shifts (&gt;4%) and critical earnings</p>
            </button>

            <button
              onClick={() => setSensitivity('BALANCED')}
              className={`p-4 rounded-xl border text-left transition-all ${
                sensitivity === 'BALANCED'
                  ? 'bg-[#00d09c]/10 border-[#00d09c] text-white'
                  : 'bg-[#0b0e14]/60 border-[#232d3f] text-gray-400 hover:border-gray-600'
              }`}
            >
              <div className="text-sm font-bold text-[#00d09c] mb-1">Balanced (Recommended)</div>
              <p className="text-[11px] text-gray-400">Groww standard balanced threshold for investor focus</p>
            </button>

            <button
              onClick={() => setSensitivity('SENSITIVE')}
              className={`p-4 rounded-xl border text-left transition-all ${
                sensitivity === 'SENSITIVE'
                  ? 'bg-[#1c2433] border-[#00baf2] text-white'
                  : 'bg-[#0b0e14]/60 border-[#232d3f] text-gray-400 hover:border-gray-600'
              }`}
            >
              <div className="text-sm font-bold text-[#00baf2] mb-1">Sensitive</div>
              <p className="text-[11px] text-gray-400">Captures minor 1-2% fluctuations and volume changes</p>
            </button>
          </div>
        </div>

        {/* Noise Filter Option */}
        <div className="bg-[#131924] border border-[#232d3f] rounded-2xl p-6 shadow-md flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white mb-1">Market Noise Suppressor</h2>
            <p className="text-xs text-gray-400">Automatically hide stocks with stable scores (&lt; 20)</p>
          </div>

          <button
            onClick={() => setHideNoise(!hideNoise)}
            className={`w-12 h-6 rounded-full transition-colors relative ${hideNoise ? 'bg-[#00d09c]' : 'bg-gray-700'}`}
          >
            <span className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${hideNoise ? 'left-6' : 'left-0.5'}`} />
          </button>
        </div>

        {/* Reset Demo Data */}
        <div className="bg-[#131924] border border-[#232d3f] rounded-2xl p-6 shadow-md flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white mb-1">Reset Market Memory Snapshots</h2>
            <p className="text-xs text-gray-400">Re-initialize default Groww demo portfolio state</p>
          </div>

          <button
            onClick={loadDashboard}
            className="flex items-center space-x-2 px-4 py-2 bg-[#ff5252]/10 hover:bg-[#ff5252]/20 text-[#ff5252] border border-[#ff5252]/30 rounded-xl text-xs font-bold transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo State</span>
          </button>
        </div>
      </div>
    </div>
  );
};
