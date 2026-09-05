import React, { useState, useEffect } from 'react';
import { useWatchlistStore } from '../stores/useWatchlistStore';
import { fetchReplayData } from '../services/api';
import { ReplayFrame } from '../types';
import { X, Play, Pause, RotateCcw, Clock, TrendingDown, TrendingUp, AlertCircle } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export const ReplayTimelineModal: React.FC = () => {
  const { selectedStockForReplay, setSelectedStockForReplay } = useWatchlistStore();
  const [frames, setFrames] = useState<ReplayFrame[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedStockForReplay) return;
    let isMounted = true;

    setLoading(true);
    fetchReplayData(selectedStockForReplay.symbol).then((data) => {
      if (isMounted) {
        setFrames(data.replayFrames);
        setCurrentIndex(0);
        setLoading(false);
        setIsPlaying(true); // Auto-play replay animation
      }
    });

    return () => {
      isMounted = false;
    };
  }, [selectedStockForReplay]);

  // Handle Play/Pause animation timer
  useEffect(() => {
    let timer: any = null;
    if (isPlaying && frames.length > 0) {
      timer = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev >= frames.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1200);
    }
    return () => clearInterval(timer);
  }, [isPlaying, frames]);

  if (!selectedStockForReplay) return null;

  const currentFrame = frames[currentIndex] || {
    time: '09:15 AM',
    price: selectedStockForReplay.currentPrice,
    change: 0,
    changePercent: 0,
    volume: 1000000,
    event: null,
  };

  const chartData = frames.slice(0, currentIndex + 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#131924] border border-[#232d3f] rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative">
        {/* Close button */}
        <button
          onClick={() => setSelectedStockForReplay(null)}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-[#1c2433] hover:bg-[#232d3f] text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#00d09c]/10 border border-[#00d09c]/30 flex items-center justify-center">
            <Clock className="w-5 h-5 text-[#00d09c]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-extrabold text-white">Intraday Market Replay</h2>
              <span className="px-2 py-0.5 text-xs font-semibold bg-[#00d09c]/15 text-[#00d09c] rounded-full">
                {selectedStockForReplay.symbol}
              </span>
            </div>
            <p className="text-xs text-gray-400">Replaying market movement while you were away (9:15 AM → 3:30 PM)</p>
          </div>
        </div>

        {/* Live Replay Frame Banner */}
        <div className="bg-[#0b0e14] p-4 rounded-xl border border-[#232d3f] mb-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Timeline Timestamp</span>
              <div className="text-xl font-extrabold text-[#00baf2] flex items-center space-x-2 mt-0.5">
                <Clock className="w-4 h-4" />
                <span>{currentFrame.time}</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Replay Price</span>
              <div className="text-2xl font-extrabold text-white">
                ₹{currentFrame.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
              <div className={`text-xs font-bold ${currentFrame.changePercent < 0 ? 'text-[#ff5252]' : 'text-[#00d09c]'}`}>
                {currentFrame.changePercent >= 0 ? '+' : ''}
                {currentFrame.changePercent}%
              </div>
            </div>
          </div>

          {/* Event Alert Flag if present in frame */}
          {currentFrame.event && (
            <div className="mt-3 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center space-x-2 text-xs text-amber-300 animate-pulse">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>
                <strong>Event Logged:</strong> {currentFrame.event}
              </span>
            </div>
          )}
        </div>

        {/* Animated Replay Recharts Graph */}
        <div className="h-52 w-full mb-6">
          {loading ? (
            <div className="h-full flex items-center justify-center text-xs text-gray-400">Loading Replay Frames...</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="replayGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d09c" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#00d09c" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#4b5563" tick={{ fontSize: 10 }} />
                <YAxis domain={['auto', 'auto']} stroke="#4b5563" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#131924', borderColor: '#232d3f', borderRadius: 8, fontSize: 12 }}
                />
                <Area type="monotone" dataKey="price" stroke="#00d09c" strokeWidth={2} fillOpacity={1} fill="url(#replayGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Timeline Slider & Play Controls */}
        <div className="flex items-center space-x-4 bg-[#0b0e14]/60 p-3 rounded-xl border border-[#232d3f]">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-lg bg-[#00d09c] hover:bg-[#00b386] text-gray-950 font-bold transition-all shadow-md"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
          </button>

          <button
            onClick={() => {
              setCurrentIndex(0);
              setIsPlaying(true);
            }}
            className="p-2 rounded-lg bg-[#1c2433] hover:bg-[#232d3f] text-gray-300 transition-colors"
            title="Reset Timeline"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <input
            type="range"
            min={0}
            max={Math.max(0, frames.length - 1)}
            value={currentIndex}
            onChange={(e) => {
              setIsPlaying(false);
              setCurrentIndex(parseInt(e.target.value, 10));
            }}
            className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#00d09c]"
          />

          <span className="text-xs font-mono text-gray-400 whitespace-nowrap">
            Frame {currentIndex + 1} / {frames.length}
          </span>
        </div>
      </div>
    </div>
  );
};
