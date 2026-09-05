import React, { useEffect } from 'react';
import { useWatchlistStore } from '../stores/useWatchlistStore';
import { HeaderHero } from '../components/HeaderHero';
import { WatchlistPulseSummary } from '../components/WatchlistPulseSummary';
import { MarketNoiseFilter } from '../components/MarketNoiseFilter';
import { AttentionSection } from '../components/AttentionSection';

export const DashboardPage: React.FC = () => {
  const { loadDashboard, loading } = useWatchlistStore();

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse space-y-6">
        <div className="h-40 bg-[#131924] rounded-2xl border border-[#232d3f]" />
        <div className="h-28 bg-[#131924] rounded-2xl border border-[#232d3f]" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-64 bg-[#131924] rounded-2xl border border-[#232d3f]" />
          <div className="h-64 bg-[#131924] rounded-2xl border border-[#232d3f]" />
          <div className="h-64 bg-[#131924] rounded-2xl border border-[#232d3f]" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <HeaderHero />
      <WatchlistPulseSummary />
      <MarketNoiseFilter />
      <AttentionSection />
    </div>
  );
};
