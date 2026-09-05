import { QuoteData } from '../../types/index.js';

export interface InitialStockSeed {
  symbol: string;
  name: string;
  sector: string;
  basePrice: number;
  marketCap: number;
  fiftyTwoHigh: number;
  fiftyTwoLow: number;
  avgVolume: number;
}

export const SEED_STOCKS: InitialStockSeed[] = [
  {
    symbol: 'TCS',
    name: 'Tata Consultancy Services',
    sector: 'Technology',
    basePrice: 4102.35,
    marketCap: 1485000,
    fiftyTwoHigh: 4250.0,
    fiftyTwoLow: 3310.0,
    avgVolume: 2500000,
  },
  {
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd',
    sector: 'Energy & Conglomerate',
    basePrice: 2856.45,
    marketCap: 1930000,
    fiftyTwoHigh: 3020.0,
    fiftyTwoLow: 2220.0,
    avgVolume: 4200000,
  },
  {
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Ltd',
    sector: 'Banking & Financials',
    basePrice: 1678.9,
    marketCap: 1270000,
    fiftyTwoHigh: 1750.0,
    fiftyTwoLow: 1360.0,
    avgVolume: 8900000,
  },
  {
    symbol: 'INFY',
    name: 'Infosys Limited',
    sector: 'Technology',
    basePrice: 1580.75,
    marketCap: 655000,
    fiftyTwoHigh: 1730.0,
    fiftyTwoLow: 1350.0,
    avgVolume: 3800000,
  },
  {
    symbol: 'ICICIBANK',
    name: 'ICICI Bank Ltd',
    sector: 'Banking & Financials',
    basePrice: 1235.6,
    marketCap: 865000,
    fiftyTwoHigh: 1260.0,
    fiftyTwoLow: 890.0,
    avgVolume: 5100000,
  },
  {
    symbol: 'TATAMOTORS',
    name: 'Tata Motors Ltd',
    sector: 'Automotive',
    basePrice: 1045.2,
    marketCap: 348000,
    fiftyTwoHigh: 1175.0,
    fiftyTwoLow: 590.0,
    avgVolume: 9400000,
  },
  {
    symbol: 'WIPRO',
    name: 'Wipro Limited',
    sector: 'Technology',
    basePrice: 524.5,
    marketCap: 274000,
    fiftyTwoHigh: 545.0,
    fiftyTwoLow: 375.0,
    avgVolume: 4100000,
  },
  {
    symbol: 'SBIN',
    name: 'State Bank of India',
    sector: 'Banking & Financials',
    basePrice: 825.3,
    marketCap: 736000,
    fiftyTwoHigh: 912.0,
    fiftyTwoLow: 550.0,
    avgVolume: 12000000,
  },
];

class MarketDataSimulatorService {
  private activeQuotes: Map<string, QuoteData> = new Map();
  private simulatedEvents: Map<string, { priceChangePct?: number; volumeMultiplier?: number; newsEvent?: string }> = new Map();

  constructor() {
    this.initializeQuotes();
    // Periodically fluctuate prices slightly to simulate dynamic market feeds
    setInterval(() => this.simulateMarketTick(), 3000);
  }

  private initializeQuotes() {
    for (const stock of SEED_STOCKS) {
      let initialPrice = stock.basePrice;
      let changePercent = 0;
      let newsCount = 0;
      let sentimentScore = 0.1;
      let volatility = 0.25;
      let volumeMultiplier = 1.0;

      // Add interesting realistic defaults for demo presentation matching Groww PDF
      if (stock.symbol === 'TCS') {
        // TCS dropped 4.2% on unusual volume according to demo PDF page 2
        changePercent = -4.2;
        initialPrice = stock.basePrice * (1 + changePercent / 100);
        volumeMultiplier = 2.3;
        newsCount = 3;
        sentimentScore = -0.65;
        volatility = 0.85;
      } else if (stock.symbol === 'RELIANCE') {
        // Reliance gained +3.8%, broke resistance
        changePercent = 3.8;
        initialPrice = stock.basePrice * (1 + changePercent / 100);
        volumeMultiplier = 1.8;
        newsCount = 2;
        sentimentScore = 0.72;
        volatility = 0.55;
      } else if (stock.symbol === 'HDFCBANK') {
        // HDFC Bank unchanged price, high volume +220%
        changePercent = 0.1;
        volumeMultiplier = 2.2;
        newsCount = 4;
        sentimentScore = 0.05;
        volatility = 0.4;
      }

      const quote: QuoteData = {
        symbol: stock.symbol,
        name: stock.name,
        price: parseFloat(initialPrice.toFixed(2)),
        change: parseFloat((initialPrice - stock.basePrice).toFixed(2)),
        changePercent: parseFloat(changePercent.toFixed(2)),
        open: parseFloat((stock.basePrice * 0.995).toFixed(2)),
        high: parseFloat((stock.basePrice * 1.02).toFixed(2)),
        low: parseFloat((stock.basePrice * 0.98).toFixed(2)),
        previousClose: stock.basePrice,
        volume: Math.round(stock.avgVolume * volumeMultiplier),
        avgVolume: stock.avgVolume,
        fiftyTwoHigh: stock.fiftyTwoHigh,
        fiftyTwoLow: stock.fiftyTwoLow,
        marketCap: stock.marketCap,
        volatility,
        newsCount,
        sentimentScore,
        lastUpdated: new Date().toISOString(),
        source: 'GROWW_SIMULATOR',
        status: 'LIVE',
      };

      this.activeQuotes.set(stock.symbol, quote);
    }
  }

  private simulateMarketTick() {
    for (const [symbol, quote] of this.activeQuotes.entries()) {
      const customEvent = this.simulatedEvents.get(symbol);
      let noise = (Math.random() - 0.5) * 0.002; // Small 0.1% tick random walk

      if (customEvent?.priceChangePct !== undefined) {
        noise = customEvent.priceChangePct / 100;
        this.simulatedEvents.delete(symbol); // Consume single shot event
      }

      const newPrice = Math.max(1, quote.price * (1 + noise));
      const totalChange = newPrice - quote.previousClose;
      const totalChangePct = (totalChange / quote.previousClose) * 100;

      quote.price = parseFloat(newPrice.toFixed(2));
      quote.change = parseFloat(totalChange.toFixed(2));
      quote.changePercent = parseFloat(totalChangePct.toFixed(2));
      quote.lastUpdated = new Date().toISOString();

      if (newPrice > quote.high) quote.high = quote.price;
      if (newPrice < quote.low) quote.low = quote.price;
    }
  }

  public getQuote(symbol: string): QuoteData | undefined {
    return this.activeQuotes.get(symbol.toUpperCase());
  }

  public getAllQuotes(): QuoteData[] {
    return Array.from(this.activeQuotes.values());
  }

  public injectSimulatorEvent(symbol: string, eventType: string, magnitude: number) {
    const quote = this.activeQuotes.get(symbol.toUpperCase());
    if (!quote) return null;

    if (eventType === 'PRICE_DROP') {
      quote.price = parseFloat((quote.previousClose * (1 - magnitude / 100)).toFixed(2));
      quote.changePercent = -magnitude;
      quote.sentimentScore = -0.7;
      quote.newsCount += 2;
    } else if (eventType === 'PRICE_SURGE') {
      quote.price = parseFloat((quote.previousClose * (1 + magnitude / 100)).toFixed(2));
      quote.changePercent = magnitude;
      quote.sentimentScore = 0.8;
      quote.newsCount += 2;
    } else if (eventType === 'VOLUME_SPIKE') {
      quote.volume = Math.round(quote.avgVolume * magnitude);
      quote.volatility = 0.9;
    } else if (eventType === 'STALE_DATA') {
      quote.status = 'STALE';
    }

    quote.lastUpdated = new Date().toISOString();
    return quote;
  }
}

export const marketSimulator = new MarketDataSimulatorService();
