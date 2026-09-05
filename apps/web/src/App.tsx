import React from 'react';
import { useWatchlistStore } from './stores/useWatchlistStore';
import { Navbar } from './components/Navbar';
import { DashboardPage } from './pages/Dashboard';
import { WatchlistPage } from './pages/WatchlistPage';
import { TimelinePage } from './pages/TimelinePage';
import { SettingsPage } from './pages/SettingsPage';
import { ExplainabilityModal } from './components/ExplainabilityModal';
import { ReplayTimelineModal } from './components/ReplayTimelineModal';
import { MarketSimulatorPanel } from './components/MarketSimulatorPanel';

export const App: React.FC = () => {
  const { activeTab } = useWatchlistStore();

  return (
    <div className="min-h-screen bg-[#0b0e14] text-gray-100 flex flex-col font-['Inter',sans-serif]">
      <Navbar />

      <main className="flex-grow">
        {activeTab === 'dashboard' && <DashboardPage />}
        {activeTab === 'watchlist' && <WatchlistPage />}
        {activeTab === 'timeline' && <TimelinePage />}
        {activeTab === 'settings' && <SettingsPage />}
      </main>

      {/* Modals & Overlays */}
      <ExplainabilityModal />
      <ReplayTimelineModal />
      <MarketSimulatorPanel />

      {/* Groww Footer */}
      <footer className="border-t border-[#232d3f] bg-[#0b0e14] py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-gray-500">
          <p className="font-semibold text-gray-400">PulseWatch — Smart Market Watchlist | CODE 2026 by Groww</p>
          <p className="mt-1">Empowering investors with clarity and confidence. Know What Changed. Focus on What Matters.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
