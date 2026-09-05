export interface QuoteData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  previousClose: number;
  volume: number;
  avgVolume: number;
  fiftyTwoHigh: number;
  fiftyTwoLow: number;
  marketCap: number;
  volatility: number;
  newsCount: number;
  sentimentScore: number;
  lastUpdated: string;
  source: string;
  status: 'LIVE' | 'DELAYED' | 'STALE';
}

export interface ExplainabilityReason {
  type: string;
  weight: number;
  message: string;
}

export interface StockChangeEvaluation {
  symbol: string;
  name: string;
  currentPrice: number;
  previousPrice: number;
  priceChangePercent: number;
  meaningfulScore: number;
  priorityCategory: 'NEEDS_ATTENTION' | 'WORTH_WATCHING' | 'MINOR_CHANGES' | 'STABLE';
  reasons: ExplainabilityReason[];
  quote: QuoteData;
}

export interface DashboardInsightsResponse {
  user: {
    name: string;
    lastVisit: string;
  };
  marketPulseSummary: {
    overallActivity: 'HIGH' | 'MODERATE' | 'LOW';
    totalChangesCount: number;
    stocksNeedingAttentionCount: number;
    marketSentiment: 'Bullish' | 'Slightly Bullish' | 'Neutral' | 'Slightly Bearish' | 'Bearish';
    mostVolatileSymbol: string;
    biggestGain: { symbol: string; changePercent: number };
    biggestLoss: { symbol: string; changePercent: number };
    aiExecutiveSummary: string;
  };
  prioritySections: {
    needsAttention: StockChangeEvaluation[];
    worthWatching: StockChangeEvaluation[];
    minorChanges: StockChangeEvaluation[];
    stable: StockChangeEvaluation[];
  };
  isQuietMarket: boolean;
}

export interface Watchlist {
  id: string;
  name: string;
  description?: string;
  isDefault?: boolean;
  symbols: string[];
  createdAt: string;
}

export interface ReplayFrame {
  time: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  event: string | null;
}
