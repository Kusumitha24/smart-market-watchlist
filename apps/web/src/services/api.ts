import { DashboardInsightsResponse, Watchlist, ReplayFrame, QuoteData } from '../types';

const API_BASE = (import.meta.env.VITE_API_URL as string) || 'http://localhost:5000/api';

export async function fetchDashboardInsights(sensitivity = 'BALANCED'): Promise<DashboardInsightsResponse> {
  try {
    const res = await fetch(`${API_BASE}/insights/dashboard?sensitivity=${sensitivity}`);
    if (!res.ok) throw new Error('API request failed');
    return await res.json();
  } catch (err) {
    console.warn('[API Fallback] Server offline, serving client memory simulation data.');
    return getFallbackDashboardData();
  }
}

export async function fetchWatchlists(): Promise<Watchlist[]> {
  try {
    const res = await fetch(`${API_BASE}/watchlists`);
    if (!res.ok) throw new Error('API request failed');
    return await res.json();
  } catch (err) {
    return [
      {
        id: 'wl-default-1',
        name: 'My Watchlist',
        description: 'Core Groww portfolio watchlist',
        isDefault: true,
        symbols: ['TCS', 'RELIANCE', 'HDFCBANK', 'INFY', 'ICICIBANK'],
        createdAt: new Date().toISOString(),
      },
    ];
  }
}

export async function fetchReplayData(symbol: string): Promise<{ symbol: string; name: string; replayFrames: ReplayFrame[] }> {
  try {
    const res = await fetch(`${API_BASE}/insights/replay?symbol=${symbol}`);
    if (!res.ok) throw new Error('Failed to fetch replay data');
    return await res.json();
  } catch (err) {
    return {
      symbol,
      name: symbol === 'TCS' ? 'Tata Consultancy Services' : 'Stock Item',
      replayFrames: [
        { time: '09:15 AM', price: 4102.35, change: 0, changePercent: 0, volume: 250000, event: null },
        { time: '10:30 AM', price: 4050.10, change: -52.25, changePercent: -1.27, volume: 1100000, event: null },
        { time: '12:00 PM', price: 3980.50, change: -121.85, changePercent: -2.97, volume: 2800000, event: 'Quarterly Filing Announced' },
        { time: '02:15 PM', price: 3930.00, change: -172.35, changePercent: -4.20, volume: 5750000, event: 'Unusual Volume Spike' },
        { time: '03:30 PM', price: 3930.00, change: -172.35, changePercent: -4.20, volume: 5750000, event: 'Market Close' },
      ],
    };
  }
}

export async function triggerSimulatorEvent(symbol: string, event: string, magnitude: number) {
  try {
    const res = await fetch(`${API_BASE}/market/simulator`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symbol, event, magnitude }),
    });
    return await res.json();
  } catch (err) {
    console.error('Simulator trigger error', err);
  }
}

function getFallbackDashboardData(): DashboardInsightsResponse {
  return {
    user: {
      name: 'Groww Demo Investor',
      lastVisit: 'Yesterday at 4:30 PM',
    },
    marketPulseSummary: {
      overallActivity: 'HIGH',
      totalChangesCount: 3,
      stocksNeedingAttentionCount: 2,
      marketSentiment: 'Slightly Bearish',
      mostVolatileSymbol: 'TCS',
      biggestGain: { symbol: 'RELIANCE', changePercent: 3.8 },
      biggestLoss: { symbol: 'TCS', changePercent: -4.2 },
      aiExecutiveSummary:
        'Your watchlist showed significant activity. TCS dropped 4.2% on 2.3x normal volume, while Reliance surged +3.8% approaching 52-week high resistance.',
    },
    prioritySections: {
      needsAttention: [
        {
          symbol: 'TCS',
          name: 'Tata Consultancy Services',
          currentPrice: 3930.0,
          previousPrice: 4102.35,
          priceChangePercent: -4.2,
          meaningfulScore: 92,
          priorityCategory: 'NEEDS_ATTENTION',
          reasons: [
            { type: 'PRICE_DROP', weight: 35, message: 'Price dropped 4.2% since your last visit' },
            { type: 'VOLUME_SPIKE', weight: 30, message: 'Trading volume is 2.3x above 30-day average' },
            { type: 'NEGATIVE_NEWS', weight: 20, message: 'Negative market news & quarterly earnings filing detected' },
          ],
          quote: {
            symbol: 'TCS',
            name: 'Tata Consultancy Services',
            price: 3930.0,
            change: -172.35,
            changePercent: -4.2,
            open: 4100.0,
            high: 4150.0,
            low: 3920.0,
            previousClose: 4102.35,
            volume: 5750000,
            avgVolume: 2500000,
            fiftyTwoHigh: 4250.0,
            fiftyTwoLow: 3310.0,
            marketCap: 1485000,
            volatility: 0.85,
            newsCount: 3,
            sentimentScore: -0.65,
            lastUpdated: new Date().toISOString(),
            source: 'SIMULATOR',
            status: 'LIVE',
          },
        },
      ],
      worthWatching: [
        {
          symbol: 'RELIANCE',
          name: 'Reliance Industries Ltd',
          currentPrice: 2964.9,
          previousPrice: 2856.45,
          priceChangePercent: 3.8,
          meaningfulScore: 78,
          priorityCategory: 'WORTH_WATCHING',
          reasons: [
            { type: 'PRICE_SURGE', weight: 30, message: 'Price gained 3.8% since last visit' },
            { type: 'TECHNICAL_RESISTANCE', weight: 15, message: 'Approaching 52-week high resistance (₹3,020)' },
            { type: 'VOLUME_SPIKE', weight: 15, message: 'Trading volume 1.8x above normal' },
          ],
          quote: {
            symbol: 'RELIANCE',
            name: 'Reliance Industries Ltd',
            price: 2964.9,
            change: 108.45,
            changePercent: 3.8,
            open: 2860.0,
            high: 2980.0,
            low: 2850.0,
            previousClose: 2856.45,
            volume: 7560000,
            avgVolume: 4200000,
            fiftyTwoHigh: 3020.0,
            fiftyTwoLow: 2220.0,
            marketCap: 1930000,
            volatility: 0.55,
            newsCount: 2,
            sentimentScore: 0.72,
            lastUpdated: new Date().toISOString(),
            source: 'SIMULATOR',
            status: 'LIVE',
          },
        },
      ],
      minorChanges: [
        {
          symbol: 'HDFCBANK',
          name: 'HDFC Bank Ltd',
          currentPrice: 1678.9,
          previousPrice: 1678.9,
          priceChangePercent: 0.1,
          meaningfulScore: 42,
          priorityCategory: 'MINOR_CHANGES',
          reasons: [{ type: 'VOLUME_SPIKE', weight: 20, message: 'Price stable, but trading volume surged 220%' }],
          quote: {
            symbol: 'HDFCBANK',
            name: 'HDFC Bank Ltd',
            price: 1678.9,
            change: 1.6,
            changePercent: 0.1,
            open: 1675.0,
            high: 1685.0,
            low: 1670.0,
            previousClose: 1678.9,
            volume: 19580000,
            avgVolume: 8900000,
            fiftyTwoHigh: 1750.0,
            fiftyTwoLow: 1360.0,
            marketCap: 1270000,
            volatility: 0.4,
            newsCount: 4,
            sentimentScore: 0.05,
            lastUpdated: new Date().toISOString(),
            source: 'SIMULATOR',
            status: 'LIVE',
          },
        },
      ],
      stable: [
        {
          symbol: 'INFY',
          name: 'Infosys Limited',
          currentPrice: 1583.9,
          previousPrice: 1580.75,
          priceChangePercent: 0.2,
          meaningfulScore: 12,
          priorityCategory: 'STABLE',
          reasons: [{ type: 'STABLE_METRICS', weight: 0, message: 'No meaningful changes detected since last visit' }],
          quote: {
            symbol: 'INFY',
            name: 'Infosys Limited',
            price: 1583.9,
            change: 3.15,
            changePercent: 0.2,
            open: 1580.0,
            high: 1590.0,
            low: 1575.0,
            previousClose: 1580.75,
            volume: 3850000,
            avgVolume: 3800000,
            fiftyTwoHigh: 1730.0,
            fiftyTwoLow: 1350.0,
            marketCap: 655000,
            volatility: 0.15,
            newsCount: 0,
            sentimentScore: 0.1,
            lastUpdated: new Date().toISOString(),
            source: 'SIMULATOR',
            status: 'LIVE',
          },
        },
      ],
    },
    isQuietMarket: false,
  };
}
