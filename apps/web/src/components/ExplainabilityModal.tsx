import React from 'react';
import { useWatchlistStore } from '../stores/useWatchlistStore';
import { X, ShieldCheck, HelpCircle, Layers, Award } from 'lucide-react';

export const ExplainabilityModal: React.FC = () => {
  const { selectedStockForExplainability, setSelectedStockForExplainability } = useWatchlistStore();

  if (!selectedStockForExplainability) return null;

  const stock = selectedStockForExplainability;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#131924] border border-[#232d3f] rounded-2xl max-w-xl w-full p-6 shadow-2xl relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => setSelectedStockForExplainability(null)}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-[#1c2433] hover:bg-[#232d3f] text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#00baf2]/10 border border-[#00baf2]/30 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-[#00baf2]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-extrabold text-white">{stock.symbol}</h2>
              <span className="text-xs text-gray-400 font-medium">({stock.name})</span>
            </div>
            <p className="text-xs text-gray-400">Explainability Engine & Factor Decomposition</p>
          </div>
        </div>

        {/* Score Card Banner */}
        <div className="bg-gradient-to-r from-[#1c2433] to-[#141a24] p-4 rounded-xl border border-[#232d3f] mb-5 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-gray-400">Meaningful Change Score</div>
            <div className="text-2xl font-extrabold text-[#00d09c]">{stock.meaningfulScore} / 100</div>
          </div>
          <div className="text-right">
            <div className="text-xs font-semibold text-gray-400">Priority Tier</div>
            <div className="text-sm font-bold text-amber-400 uppercase tracking-wide">
              {stock.priorityCategory.replace('_', ' ')}
            </div>
          </div>
        </div>

        {/* Why Am I Seeing This? */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 text-xs font-bold text-gray-300 uppercase tracking-wider mb-3">
            <HelpCircle className="w-4 h-4 text-[#00d09c]" />
            <span>Why Am I Seeing This?</span>
          </div>

          <div className="space-y-2.5">
            {stock.reasons.map((r, idx) => (
              <div key={idx} className="bg-[#0b0e14]/80 p-3 rounded-lg border border-[#232d3f] flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs text-gray-200 font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#00d09c]" />
                  <span>{r.message}</span>
                </div>
                <span className="text-[10px] font-mono text-gray-400 bg-gray-800 px-2 py-0.5 rounded">
                  +{r.weight} pts
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Scoring Engine Multi-Factor Breakdown */}
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-gray-300 uppercase tracking-wider mb-3">
            <Layers className="w-4 h-4 text-purple-400" />
            <span>Deterministic Scoring Allocation</span>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <div className="flex justify-between text-gray-400 mb-1">
                <span>Price Movement Delta (Weight: 30%)</span>
                <span className="text-white font-semibold">30%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-[#00d09c] rounded-full" style={{ width: '85%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-gray-400 mb-1">
                <span>Volume Ratio Anomaly (Weight: 20%)</span>
                <span className="text-white font-semibold">20%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: '75%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-gray-400 mb-1">
                <span>News Sentiment & Filings (Weight: 30%)</span>
                <span className="text-white font-semibold">30%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-purple-400 rounded-full" style={{ width: '60%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-6 pt-4 border-t border-[#232d3f] flex items-center justify-between text-[11px] text-gray-400">
          <div className="flex items-center space-x-1">
            <Award className="w-3.5 h-3.5 text-[#00d09c]" />
            <span>Groww Responsible Transparency Guarantee</span>
          </div>
          <button
            onClick={() => setSelectedStockForExplainability(null)}
            className="px-4 py-1.5 bg-[#1c2433] hover:bg-[#232d3f] text-white rounded-lg font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
