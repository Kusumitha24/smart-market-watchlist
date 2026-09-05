import { QuoteData } from '../../types/index.js';
import { marketSimulator } from './simulator.service.js';

export enum CircuitState {
  CLOSED, // Normal operation
  OPEN,   // Primary provider failed, short-circuiting to fallback
  HALF_OPEN // Testing primary provider recovery
}

export class ResilientMarketDataProvider {
  private circuitState: CircuitState = CircuitState.CLOSED;
  private failureCount: number = 0;
  private failureThreshold: number = 3;
  private lastStateChange: number = Date.now();
  private recoveryTimeoutMs: number = 10000;

  /**
   * Fetches market quote with exponential retry, circuit breaker, and simulator fallback
   */
  public async getQuoteResiliently(symbol: string): Promise<QuoteData> {
    const now = Date.now();

    // Check if circuit breaker is OPEN and should transition to HALF_OPEN
    if (this.circuitState === CircuitState.OPEN && now - this.lastStateChange > this.recoveryTimeoutMs) {
      this.circuitState = CircuitState.HALF_OPEN;
      this.lastStateChange = now;
    }

    // If Circuit is OPEN, bypass primary and serve directly from Fallback Simulator
    if (this.circuitState === CircuitState.OPEN) {
      console.warn(`[Circuit Breaker OPEN] Serving ${symbol} quote from resilient simulator fallback.`);
      const fallback = marketSimulator.getQuote(symbol);
      if (!fallback) throw new Error(`Stock ${symbol} not found in fallback provider`);
      return { ...fallback, status: 'STALE', source: 'CIRCUIT_BREAKER_FALLBACK' };
    }

    // Attempt primary provider fetch with exponential backoff retries
    try {
      const quote = await this.fetchWithRetry(symbol, 3, 100);
      
      if (this.circuitState === CircuitState.HALF_OPEN) {
        this.circuitState = CircuitState.CLOSED;
        this.failureCount = 0;
      }
      return quote;
    } catch (err) {
      this.failureCount++;
      console.error(`[Provider Error] Primary provider attempt failed for ${symbol} (Failures: ${this.failureCount})`);

      if (this.failureCount >= this.failureThreshold) {
        this.circuitState = CircuitState.OPEN;
        this.lastStateChange = Date.now();
        console.warn(`[Circuit Breaker TRIPPED] Switched to OPEN state due to ${this.failureCount} consecutive failures.`);
      }

      // Graceful degradation: Fallback to market simulator
      const fallback = marketSimulator.getQuote(symbol);
      if (!fallback) throw new Error(`Stock ${symbol} unavailable in fallback engine`);

      return {
        ...fallback,
        status: 'DELAYED',
        source: 'FALLBACK_SIMULATOR',
      };
    }
  }

  private async fetchWithRetry(symbol: string, maxRetries: number, delayMs: number): Promise<QuoteData> {
    let attempt = 0;
    while (attempt < maxRetries) {
      try {
        const quote = marketSimulator.getQuote(symbol);
        if (!quote) throw new Error(`Symbol ${symbol} not found`);
        return quote;
      } catch (err) {
        attempt++;
        if (attempt >= maxRetries) throw err;
        await new Promise((r) => setTimeout(r, delayMs * Math.pow(2, attempt - 1)));
      }
    }
    throw new Error('Retry exhausted');
  }

  public getCircuitStatus() {
    return {
      state: CircuitState[this.circuitState],
      failureCount: this.failureCount,
      lastStateChange: new Date(this.lastStateChange).toISOString(),
    };
  }
}

export const resilientDataProvider = new ResilientMarketDataProvider();
