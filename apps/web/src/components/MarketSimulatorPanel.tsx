import React, { useState } from 'react';
import { useWatchlistStore } from '../stores/useWatchlistStore';
import { X, Sparkles, Zap, TrendingDown, TrendingUp, BarChart2, AlertTriangle, ShieldCheck } from 'lucide-react';

export const MarketSimulatorPanel: React.FC = () => {
  const { showSimulatorModal, setShowSimulatorModal, triggerEvent } = useWatchlistStore();
  const [selectedStock, setSelectedStock] = useState('TCS');

  if (!showSimulatorModal) return null;

  const handleSimulate = async (event: string, magnitude: number) => {
    await triggerEvent(selectedStock, event, magnitude);
    setShowSimulatorModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#131924] border border-amber-500/30 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
        <button
          onClick={() => setShowSimulatorModal(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-[#1c2433] hover:bg-[#232d3f] text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Market Data Simulator</h2>
            <p className="text-xs text-gray-400">Hackathon Demo Control — Test Engine Real-Time Reaction</p>
          </div>
        </div>

        {/* Stock Selector */}
        <div className="mb-5">
          <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Target Stock Symbol</label>
          <select
            value={selectedStock}
            onChange={(e) => setSelectedStock(e.target.value)}
            className="w-full bg-[#0b0e14] border border-[#232d3f] rounded-xl px-3.5 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-[#00d09c]"
          >
            <option value="TCS">TCS — Tata Consultancy Services</option>
            <option value="RELIANCE">RELIANCE — Reliance Industries Ltd</option>
            <option value="HDFCBANK">HDFCBANK — HDFC Bank Ltd</option>
            <option value="INFY">INFY — Infosys Limited</option>
            <option value="ICICIBANK">ICICIBANK — ICICI Bank Ltd</option>
          </select>
        </div>

        {/* Trigger Event Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => handleSimulate('PRICE_DROP', 4.2)}
            className="w-full p-3.5 rounded-xl bg-[#ff5252]/10 hover:bg-[#ff5252]/20 border border-[#ff5252]/30 flex items-center justify-between text-xs font-bold text-[#ff5252] transition-all"
          >
            <div className="flex items-center space-x-2">
              <TrendingDown className="w-4 h-4" />
              <span>Simulate Price Crash (-4.2%)</span>
            </div>
            <span className="bg-[#ff5252]/20 px-2 py-0.5 rounded text-[10px]">Triggers Needs Attention</span>
          </button>

          <button
            onClick={() => handleSimulate('PRICE_SURGE', 3.8)}
            className="w-full p-3.5 rounded-xl bg-[#00d09c]/10 hover:bg-[#00d09c]/20 border border-[#00d09c]/30 flex items-center justify-between text-xs font-bold text-[#00d09c] transition-all"
          >
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Simulate Price Surge (+3.8%)</span>
            </div>
            <span className="bg-[#00d09c]/20 px-2 py-0.5 rounded text-[10px]">Triggers Worth Watching</span>
          </button>

          <button
            onClick={() => handleSimulate('VOLUME_SPIKE', 2.3)}
            className="w-full p-3.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 flex items-center justify-between text-xs font-bold text-purple-300 transition-all"
          >
            <div className="flex items-center space-x-2">
              <BarChart2 className="w-4 h-4" />
              <span>Simulate Volume Anomaly (2.3x)</span>
            </div>
            <span className="bg-purple-500/20 px-2 py-0.5 rounded text-[10px]">Institutional Spike</span>
          </button>

          <button
            onClick={() => handleSimulate('STALE_DATA', 0)}
            className="w-full p-3.5 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 flex items-center justify-between text-xs font-bold text-gray-300 transition-all"
          >
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Simulate Network Outage / Stale Data</span>
            </div>
            <span className="bg-gray-700 px-2 py-0.5 rounded text-[10px]">Tests Stale Badge</span>
          </button>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => setShowSimulatorModal(false)}
            className="text-xs text-gray-400 hover:text-white font-semibold underline"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
