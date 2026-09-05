import { marketSimulator } from '../market-data/simulator.service.js';
import { MeaningfulChangeEngine } from './scoring.engine.js';
import { StockChangeEvaluation, DashboardInsightsResponse } from '../../types/index.js';

export class MarketMemoryEngine {
  /**
   * Evaluates market changes for a set of stock quotes relative to previous visit snapshot.
   */
  public static evaluateWatchlistMemory(
    watchlistSymbols: string[],
    sensitivity: 'CONSERVATIVE' | 'BALANCED' | 'SENSITIVE' = 'BALANCED'
  ): {
    evaluations: StockChangeEvaluation[];
    dashboardResponse: DashboardInsightsResponse;
  } {
    const quotes = marketSimulator.getAllQuotes().filter((q) => watchlistSymbols.includes(q.symbol));

    const evaluations: StockChangeEvaluation[] = quotes.map((quote) => {
      return MeaningfulChangeEngine.evaluateStockChange({
        currentQuote: quote,
        sensitivity,
      });
    });

    // Sort by Meaningful Score descending (Highest attention first)
    evaluations.sort((a, b) => b.meaningfulScore - a.meaningfulScore);

    const needsAttention = evaluations.filter((e) => e.priorityCategory === 'NEEDS_ATTENTION');
    const worthWatching = evaluations.filter((e) => e.priorityCategory === 'WORTH_WATCHING');
    const minorChanges = evaluations.filter((e) => e.priorityCategory === 'MINOR_CHANGES');
    const stable = evaluations.filter((e) => e.priorityCategory === 'STABLE');

    // Determine Overall Market Sentiment & Stats
    let totalScore = 0;
    let mostVolatileSymbol = quotes[0]?.symbol || 'TCS';
    let maxVol = 0;
    let maxGain = { symbol: quotes[0]?.symbol || 'N/A', changePercent: -999 };
    let maxLoss = { symbol: quotes[0]?.symbol || 'N/A', changePercent: 999 };

    quotes.forEach((q) => {
      totalScore += q.sentimentScore;
      if (q.volatility > maxVol) {
        maxVol = q.volatility;
        mostVolatileSymbol = q.symbol;
      }
      if (q.changePercent > maxGain.changePercent) {
        maxGain = { symbol: q.symbol, changePercent: q.changePercent };
      }
      if (q.changePercent < maxLoss.changePercent) {
        maxLoss = { symbol: q.symbol, changePercent: q.changePercent };
      }
    });

    const avgSentiment = quotes.length ? totalScore / quotes.length : 0;
    let marketSentimentLabel: 'Bullish' | 'Slightly Bullish' | 'Neutral' | 'Slightly Bearish' | 'Bearish' = 'Neutral';
    if (avgSentiment > 0.4) marketSentimentLabel = 'Bullish';
    else if (avgSentiment > 0.1) marketSentimentLabel = 'Slightly Bullish';
    else if (avgSentiment < -0.4) marketSentimentLabel = 'Bearish';
    else if (avgSentiment < -0.1) marketSentimentLabel = 'Slightly Bearish';

    const stocksNeedingAttentionCount = needsAttention.length + worthWatching.length;
    const isQuietMarket = stocksNeedingAttentionCount === 0;

    // AI/Deterministic Natural Language Executive Summary
    let aiExecutiveSummary = `Your watchlist was relatively stable today with ${minorChanges.length} minor changes observed.`;
    if (needsAttention.length > 0) {
      const topIssue = needsAttention[0];
      aiExecutiveSummary = `Significant movement detected: ${topIssue.name} (${topIssue.symbol}) ${topIssue.reasons[0]?.message || 'showed high volatility'}. Recommended to review priority section.`;
    } else if (worthWatching.length > 0) {
      const topWatch = worthWatching[0];
      aiExecutiveSummary = `${worthWatching.length} stocks show notable activity. ${topWatch.name} surged/changed with elevated volume.`;
    }

    const dashboardResponse: DashboardInsightsResponse = {
      user: {
        name: 'Groww Demo Investor',
        lastVisit: 'Yesterday at 4:30 PM',
      },
      marketPulseSummary: {
        overallActivity: stocksNeedingAttentionCount > 2 ? 'HIGH' : stocksNeedingAttentionCount > 0 ? 'MODERATE' : 'LOW',
        totalChangesCount: needsAttention.length + worthWatching.length + minorChanges.length,
        stocksNeedingAttentionCount,
        marketSentiment: marketSentimentLabel,
        mostVolatileSymbol,
        biggestGain: maxGain.changePercent === -999 ? { symbol: 'N/A', changePercent: 0 } : maxGain,
        biggestLoss: maxLoss.changePercent === 999 ? { symbol: 'N/A', changePercent: 0 } : maxLoss,
        aiExecutiveSummary,
      },
      prioritySections: {
        needsAttention,
        worthWatching,
        minorChanges,
        stable,
      },
      isQuietMarket,
    };

    return { evaluations, dashboardResponse };
  }
}
