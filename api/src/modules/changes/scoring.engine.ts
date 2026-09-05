import { QuoteData, ExplainabilityReason, StockChangeEvaluation } from '../../types/index.js';

export interface ScoringInput {
  currentQuote: QuoteData;
  previousPrice?: number;
  userInteractionCount?: number;
  sensitivity?: 'CONSERVATIVE' | 'BALANCED' | 'SENSITIVE';
}

export class MeaningfulChangeEngine {
  /**
   * Computes deterministic Meaningful Change Score (0 - 100) and human-readable Explainability reasons
   */
  public static evaluateStockChange(input: ScoringInput): StockChangeEvaluation {
    const { currentQuote, previousPrice, userInteractionCount = 1, sensitivity = 'BALANCED' } = input;

    const basePreviousPrice = previousPrice || currentQuote.previousClose;
    const absPriceChangePercent = Math.abs(((currentQuote.price - basePreviousPrice) / basePreviousPrice) * 100);
    const isPriceDrop = currentQuote.price < basePreviousPrice;

    // Sensitivity multipliers
    const sensitivityMultiplier = sensitivity === 'CONSERVATIVE' ? 0.8 : sensitivity === 'SENSITIVE' ? 1.2 : 1.0;

    // 1. Price Movement Component (Max 30 pts)
    let priceScore = 0;
    if (absPriceChangePercent >= 4.0) priceScore = 30;
    else if (absPriceChangePercent >= 2.0) priceScore = 20 + ((absPriceChangePercent - 2.0) / 2.0) * 10;
    else if (absPriceChangePercent >= 1.0) priceScore = 10 + ((absPriceChangePercent - 1.0) / 1.0) * 10;
    else priceScore = (absPriceChangePercent / 1.0) * 10;

    // 2. Volume Anomaly Component (Max 20 pts)
    const volumeRatio = currentQuote.avgVolume > 0 ? currentQuote.volume / currentQuote.avgVolume : 1.0;
    let volumeScore = 0;
    if (volumeRatio >= 3.0) volumeScore = 20;
    else if (volumeRatio >= 2.0) volumeScore = 15;
    else if (volumeRatio >= 1.5) volumeScore = 10;
    else if (volumeRatio > 1.0) volumeScore = 5;

    // 3. News Activity Component (Max 15 pts)
    const newsScore = Math.min(15, currentQuote.newsCount * 5);

    // 4. News Sentiment Component (Max 15 pts)
    // Sentiment range: -1.0 to 1.0. High negative or high positive sentiment increases score interest
    const absSentiment = Math.abs(currentQuote.sentimentScore);
    const sentimentScore = Math.min(15, absSentiment * 15);

    // 5. Volatility Change Component (Max 10 pts)
    const volatilityScore = Math.min(10, currentQuote.volatility * 10);

    // 6. Technical Events (Max 5 pts)
    let technicalScore = 0;
    const distToHigh = Math.abs(currentQuote.fiftyTwoHigh - currentQuote.price) / currentQuote.fiftyTwoHigh;
    const distToLow = Math.abs(currentQuote.price - currentQuote.fiftyTwoLow) / currentQuote.fiftyTwoLow;

    if (distToHigh < 0.02 || distToLow < 0.02) technicalScore = 5;
    else if (distToHigh < 0.05 || distToLow < 0.05) technicalScore = 3;

    // 7. User Interest (Max 5 pts)
    const userInterestScore = Math.min(5, userInteractionCount * 1.5);

    // Calculate raw weighted score
    const rawScore =
      (priceScore + volumeScore + newsScore + sentimentScore + volatilityScore + technicalScore + userInterestScore) *
      sensitivityMultiplier;

    const finalScore = Math.min(100, Math.max(0, Math.round(rawScore)));

    // Generate Explainability Reasons
    const reasons: ExplainabilityReason[] = [];

    if (absPriceChangePercent >= 1.0) {
      reasons.push({
        type: isPriceDrop ? 'PRICE_DROP' : 'PRICE_SURGE',
        weight: Math.round(priceScore),
        message: `Price ${isPriceDrop ? 'dropped' : 'gained'} ${absPriceChangePercent.toFixed(1)}% since last visit`,
      });
    }

    if (volumeRatio >= 1.5) {
      reasons.push({
        type: 'VOLUME_SPIKE',
        weight: Math.round(volumeScore),
        message: `Trading volume is ${volumeRatio.toFixed(1)}x above 30-day average`,
      });
    }

    if (currentQuote.newsCount > 0) {
      const sentimentLabel =
        currentQuote.sentimentScore < -0.2
          ? 'Negative'
          : currentQuote.sentimentScore > 0.2
          ? 'Positive'
          : 'Neutral';

      reasons.push({
        type: currentQuote.sentimentScore < -0.2 ? 'NEGATIVE_NEWS' : 'NEWS_ALERT',
        weight: Math.round(newsScore + sentimentScore),
        message: `${sentimentLabel} market news & announcements detected (${currentQuote.newsCount} articles)`,
      });
    }

    if (distToHigh < 0.02) {
      reasons.push({
        type: 'TECHNICAL_RESISTANCE',
        weight: 5,
        message: `Approaching 52-week high resistance level (₹${currentQuote.fiftyTwoHigh.toLocaleString()})`,
      });
    } else if (distToLow < 0.02) {
      reasons.push({
        type: 'TECHNICAL_SUPPORT',
        weight: 5,
        message: `Trading near 52-week low support level (₹${currentQuote.fiftyTwoLow.toLocaleString()})`,
      });
    }

    if (reasons.length === 0) {
      reasons.push({
        type: 'STABLE_METRICS',
        weight: 0,
        message: 'Price stable with normal volume and low volatility',
      });
    }

    // Determine priority category
    let priorityCategory: 'NEEDS_ATTENTION' | 'WORTH_WATCHING' | 'MINOR_CHANGES' | 'STABLE' = 'STABLE';
    if (finalScore > 80) priorityCategory = 'NEEDS_ATTENTION';
    else if (finalScore >= 50) priorityCategory = 'WORTH_WATCHING';
    else if (finalScore >= 20) priorityCategory = 'MINOR_CHANGES';
    else priorityCategory = 'STABLE';

    return {
      symbol: currentQuote.symbol,
      name: currentQuote.name,
      currentPrice: currentQuote.price,
      previousPrice: basePreviousPrice,
      priceChangePercent: parseFloat(
        (((currentQuote.price - basePreviousPrice) / basePreviousPrice) * 100).toFixed(2)
      ),
      meaningfulScore: finalScore,
      priorityCategory,
      reasons,
      quote: currentQuote,
    };
  }
}
