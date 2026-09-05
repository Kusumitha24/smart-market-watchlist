import { create } from 'zustand';
import { DashboardInsightsResponse, StockChangeEvaluation } from '../types';
import { fetchDashboardInsights, triggerSimulatorEvent } from '../services/api';

interface WatchlistState {
  dashboardData: DashboardInsightsResponse | null;
  loading: boolean;
  sensitivity: 'CONSERVATIVE' | 'BALANCED' | 'SENSITIVE';
  hideNoise: boolean;
  activeTab: 'dashboard' | 'watchlist' | 'timeline' | 'settings';
  selectedStockForExplainability: StockChangeEvaluation | null;
  selectedStockForReplay: StockChangeEvaluation | null;
  showSimulatorModal: boolean;
  
  // Actions
  loadDashboard: () => Promise<void>;
  setSensitivity: (mode: 'CONSERVATIVE' | 'BALANCED' | 'SENSITIVE') => void;
  setHideNoise: (val: boolean) => void;
  setActiveTab: (tab: 'dashboard' | 'watchlist' | 'timeline' | 'settings') => void;
  setSelectedStockForExplainability: (stock: StockChangeEvaluation | null) => void;
  setSelectedStockForReplay: (stock: StockChangeEvaluation | null) => void;
  setShowSimulatorModal: (show: boolean) => void;
  triggerEvent: (symbol: string, event: string, magnitude: number) => Promise<void>;
}

export const useWatchlistStore = create<WatchlistState>((set, get) => ({
  dashboardData: null,
  loading: true,
  sensitivity: 'BALANCED',
  hideNoise: false,
  activeTab: 'dashboard',
  selectedStockForExplainability: null,
  selectedStockForReplay: null,
  showSimulatorModal: false,

  loadDashboard: async () => {
    set({ loading: true });
    const data = await fetchDashboardInsights(get().sensitivity);
    set({ dashboardData: data, loading: false });
  },

  setSensitivity: (mode) => {
    set({ sensitivity: mode });
    get().loadDashboard();
  },

  setHideNoise: (val) => set({ hideNoise: val }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedStockForExplainability: (stock) => set({ selectedStockForExplainability: stock }),
  setSelectedStockForReplay: (stock) => set({ selectedStockForReplay: stock }),
  setShowSimulatorModal: (show) => set({ showSimulatorModal: show }),

  triggerEvent: async (symbol, event, magnitude) => {
    await triggerSimulatorEvent(symbol, event, magnitude);
    await get().loadDashboard();
  },
}));
