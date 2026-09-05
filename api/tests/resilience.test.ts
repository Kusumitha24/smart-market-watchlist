import { describe, it, expect } from 'vitest';
import { resilientDataProvider, CircuitState } from '../src/modules/market-data/resilience.service.js';
import { MeaningfulChangeEngine } from '../src/modules/changes/scoring.engine.js';
import { QuoteData } from '../src/types/index.js';

describe('Edge Cases & System Resilience Suite', () => {
  it('should serve fallback data when market provider encounters failures', async () => {
    const quote = await resilientDataProvider.getQuoteResiliently('TCS');
    expect(quote).toBeDefined();
    expect(quote.symbol).toBe('TCS');
  });

  it('should report circuit breaker status cleanly', () => {
    const status = resilientDataProvider.getCircuitStatus();
    expect(status).toHaveProperty('state');
    expect(status).toHaveProperty('failureCount');
  });

  it('should handle zero volume or missing average volume without division by zero crash', () => {
    const corruptQuote: QuoteData = {
      symbol: 'TEST',
      name: 'Test Stock',
      price: 100,
      change: 0,
      changePercent: 0,
      open: 100,
      high: 100,
      low: 100,
      previousClose: 100,
      volume: 0,
      avgVolume: 0, // Potential division by zero edge case
      fiftyTwoHigh: 100,
      fiftyTwoLow: 100,
      marketCap: 1000,
      volatility: 0,
      newsCount: 0,
      sentimentScore: 0,
      lastUpdated: new Date().toISOString(),
      source: 'EDGE_TEST',
      status: 'LIVE',
    };

    expect(() => {
      const result = MeaningfulChangeEngine.evaluateStockChange({ currentQuote: corruptQuote });
      expect(result.meaningfulScore).toBeGreaterThanOrEqual(0);
      expect(result.meaningfulScore).toBeLessThanOrEqual(100);
    }).not.toThrow();
  });
});
