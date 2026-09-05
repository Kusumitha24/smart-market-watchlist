import React from 'react';
import { Clock, TrendingDown, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';

export const TimelinePage: React.FC = () => {
  const events = [
    {
      id: 'ev-1',
      timestamp: 'Today, 10:42 AM',
      symbol: 'TCS',
      name: 'Tata Consultancy Services',
      eventType: 'PRICE_DROP',
      significance: 92,
      title: 'TCS dropped 4.2% on high volume',
      explanation: 'Largest drop in your watchlist. Trading volume 2.3x above 30-day average. Quarterly filings released.',
    },
    {
      id: 'ev-2',
      timestamp: 'Today, 09:30 AM',
      symbol: 'RELIANCE',
      name: 'Reliance Industries Ltd',
      eventType: 'PRICE_SURGE',
      significance: 84,
      title: 'Reliance crossed ₹2,850 resistance',
      explanation: 'Gained 3.8%. Approaching 52-week high with positive sentiment.',
    },
    {
      id: 'ev-3',
      timestamp: 'Yesterday, 04:00 PM',
      symbol: 'HDFCBANK',
      name: 'HDFC Bank Ltd',
      eventType: 'VOLUME_SPIKE',
      significance: 55,
      title: 'HDFC Bank quarterly results released',
      explanation: 'Price remained stable (+0.1%), but trading volume spiked 220%.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-[#00d09c]/10 border border-[#00d09c]/30 flex items-center justify-center">
          <Clock className="w-5 h-5 text-[#00d09c]" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-white">Change Timeline</h1>
          <p className="text-xs text-gray-400">Timestamped log of meaningful market events since your last visit</p>
        </div>
      </div>

      <div className="relative border-l-2 border-[#232d3f] ml-4 pl-6 space-y-8">
        {events.map((ev) => (
          <div key={ev.id} className="relative group">
            {/* Timeline Dot */}
            <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-[#131924] border-2 border-[#00d09c] group-hover:scale-125 transition-transform" />

            <div className="bg-[#131924] border border-[#232d3f] rounded-2xl p-5 shadow-lg">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                <span className="font-mono text-[#00baf2] font-semibold">{ev.timestamp}</span>
                <span className="bg-[#ff5252]/10 text-[#ff5252] border border-[#ff5252]/30 px-2 py-0.5 rounded-full font-bold">
                  Score: {ev.significance}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-1 flex items-center space-x-2">
                <span className="text-[#00d09c]">{ev.symbol}</span>
                <span>—</span>
                <span>{ev.title}</span>
              </h3>

              <p className="text-xs text-gray-300 leading-relaxed bg-[#0b0e14]/60 p-3 rounded-xl border border-[#232d3f] mt-2">
                {ev.explanation}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
