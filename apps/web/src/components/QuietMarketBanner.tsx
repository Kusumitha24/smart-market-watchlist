import React from 'react';
import { ShieldCheck, Sparkles, CheckCircle } from 'lucide-react';

export const QuietMarketBanner: React.FC = () => {
  return (
    <div className="rounded-2xl bg-gradient-to-r from-[#00d09c]/10 via-[#131924] to-[#00baf2]/10 border border-[#00d09c]/30 p-8 text-center shadow-xl my-8">
      <div className="w-14 h-14 mx-auto rounded-full bg-[#00d09c]/20 border border-[#00d09c]/40 flex items-center justify-center mb-4 text-[#00d09c]">
        <CheckCircle className="w-8 h-8" />
      </div>

      <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#00d09c]/10 border border-[#00d09c]/30 text-xs font-bold text-[#00d09c] mb-3">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Quiet Market Mode Active</span>
      </div>

      <h2 className="text-2xl font-extrabold text-white mb-2">Good news. Nothing in your watchlist requires attention.</h2>

      <p className="text-sm text-gray-300 max-w-lg mx-auto leading-relaxed">
        Market fluctuations across your tracked stocks remained within stable normal ranges (Meaningful Scores &lt; 20).
        PulseWatch protects your attention by filtering out market noise.
      </p>

      <div className="mt-6 flex items-center justify-center space-x-2 text-xs text-gray-400 font-medium">
        <ShieldCheck className="w-4 h-4 text-[#00baf2]" />
        <span>Groww Responsible Product Guarantee — No Artificial Engagement</span>
      </div>
    </div>
  );
};
