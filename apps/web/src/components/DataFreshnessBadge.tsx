import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Clock } from 'lucide-react';

export const DataFreshnessBadge: React.FC = () => {
  const [status, setStatus] = useState<'LIVE' | 'DELAYED' | 'STALE'>('LIVE');
  const [secondsAgo, setSecondsAgo] = useState(2);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsAgo((prev) => (prev > 60 ? 2 : prev + 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-[#0b0e14]/80 border border-[#232d3f] text-xs font-semibold">
      {status === 'LIVE' ? (
        <>
          <span className="w-2 h-2 rounded-full bg-[#00d09c] animate-pulse" />
          <span className="text-[#00d09c]">Live</span>
          <span className="text-gray-400 text-[10px]">({secondsAgo}s ago)</span>
        </>
      ) : status === 'DELAYED' ? (
        <>
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="text-amber-400">Delayed</span>
        </>
      ) : (
        <>
          <WifiOff className="w-3 h-3 text-[#ff5252]" />
          <span className="text-[#ff5252]">Stale Data Warning</span>
        </>
      )}
    </div>
  );
};
