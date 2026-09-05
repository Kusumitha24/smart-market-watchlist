import { describe, it, expect } from 'vitest';
import { MeaningfulChangeEngine } from '../src/modules/changes/scoring.engine.js';
import { QuoteData } from '../src/types/index.js';

describe('MeaningfulChangeEngine - Deterministic Scoring System', () => {
  const baseQuote: QuoteData = {
    symbol: 'TCS',
    name: 'Tata Consultancy Services',
    price: 4100.0,
    change: 0,
    changePercent: 0,
    open: 4100.0,
    high: 4200.0,
    low: 4000.0,
    previousClose: 4100.0,
    volume: 2500000,
    avgVolume: 2500000,
    fiftyTwoHigh: 4250.0,
    fiftyTwoLow: 3310.0,
    marketCap: 1480000,
    volatility: 0.2,
    newsCount: 0,
    sentimentScore: 0,
    lastUpdated: new Date().toISOString(),
    source: 'TEST',
    status: 'LIVE',
  };

  it('should categorize small <1% movements as STABLE with low score', () => {
    const quote = { ...baseQuote, price: 4120.0, changePercent: 0.49 };
    const evalResult = MeaningfulChangeEngine.evaluateStockChange({ currentQuote: quote });

    expect(evalResult.meaningfulScore).toBeLessThan(20);
    expect(evalResult.priorityCategory).toBe('STABLE');
  });

  it('should trigger NEEDS_ATTENTION score (>80) on combined price crash, volume spike & negative news', () => {
    const quote: QuoteData = {
      ...baseQuote,
      price: 3927.8, // -4.2% drop
      changePercent: -4.2,
      volume: 5750000, // 2.3x volume ratio
      avgVolume: 2500000,
      newsCount: 3,
      sentimentScore: -0.8,
      volatility: 0.8,
    };

    const evalResult = MeaningfulChangeEngine.evaluateStockChange({ currentQuote: quote });

    expect(evalResult.meaningfulScore).toBeGreaterThanOrEqual(80);
    expect(evalResult.priorityCategory).toBe('NEEDS_ATTENTION');
    expect(evalResult.reasons.length).toBeGreaterThan(1);
    expect(evalResult.reasons[0].message).toContain('dropped 4.2%');
  });

  it('should generate human readable explainability reasons without black-box AI', () => {
    const quote: QuoteData = {
      ...baseQuote,
      price: 4245.0, // Near 52-week high (4250)
      volume: 5000000, // 2x volume ratio
      avgVolume: 2500000,
    };

    const evalResult = MeaningfulChangeEngine.evaluateStockChange({ currentQuote: quote });

    const messages = evalResult.reasons.map((r) => r.message);
    expect(messages.some((m) => m.includes('52-week high resistance'))).toBe(true);
    expect(messages.some((m) => m.includes('above 30-day average'))).toBe(true);
  });
});
