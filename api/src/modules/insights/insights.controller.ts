import { Request, Response } from 'express';
import { MarketMemoryEngine } from '../changes/memory.engine.js';
import { marketSimulator } from '../market-data/simulator.service.js';

export const getDashboardInsightsHandler = (req: Request, res: Response) => {
  const sensitivity = (req.query.sensitivity as any) || 'BALANCED';
  const symbols = ['TCS', 'RELIANCE', 'HDFCBANK', 'INFY', 'ICICIBANK', 'TATAMOTORS', 'WIPRO', 'SBIN'];

  const { dashboardResponse } = MarketMemoryEngine.evaluateWatchlistMemory(symbols, sensitivity);
  res.json(dashboardResponse);
};

export const getReplayTimelineHandler = (req: Request, res: Response) => {
  const { symbol } = req.query;
  const targetSymbol = (symbol as string) || 'TCS';
  const quote = marketSimulator.getQuote(targetSymbol);

  if (!quote) return res.status(404).json({ error: 'Symbol not found' });

  // Generate 8 intraday snapshot frames from 9:15 AM to 3:30 PM for replay animation
  const times = ['09:15 AM', '10:00 AM', '11:15 AM', '12:30 PM', '01:45 PM', '02:30 PM', '03:15 PM', '03:30 PM'];
  const basePrice = quote.previousClose;

  const replayFrames = times.map((time, idx) => {
    let factor = 1.0;
    if (quote.changePercent < 0) {
      factor = 1 - (idx / 7) * (Math.abs(quote.changePercent) / 100);
    } else {
      factor = 1 + (idx / 7) * (quote.changePercent / 100);
    }

    const price = parseFloat((basePrice * factor).toFixed(2));
    const change = parseFloat((price - basePrice).toFixed(2));
    const changePercent = parseFloat(((change / basePrice) * 100).toFixed(2));

    return {
      time,
      price,
      change,
      changePercent,
      volume: Math.round(quote.avgVolume * (0.8 + idx * 0.15)),
      event: idx === 3 ? 'Quarterly results filing released' : idx === 5 ? 'Unusual institutional volume spike' : null,
    };
  });

  res.json({
    symbol: targetSymbol,
    name: quote.name,
    replayFrames,
  });
};

export const getChangeTimelineEventsHandler = (req: Request, res: Response) => {
  const events = [
    {
      id: 'ev-1',
      timestamp: 'Today, 10:42 AM',
      symbol: 'TCS',
      name: 'Tata Consultancy Services',
      eventType: 'PRICE_DROP',
      significance: 92,
      title: 'TCS dropped 4.2% on high volume',
      explanation: 'Largest drop in your watchlist. Trading volume 2.3x above normal.',
    },
    {
      id: 'ev-2',
      timestamp: 'Today, 09:30 AM',
      symbol: 'RELIANCE',
      name: 'Reliance Industries Ltd',
      eventType: 'PRICE_SURGE',
      significance: 84,
      title: 'Reliance crossed ₹2,850 resistance',
      explanation: 'Gained 3.8%. Approaching 52-week high with positive sentiment.',
    },
    {
      id: 'ev-3',
      timestamp: 'Yesterday, 04:00 PM',
      symbol: 'HDFCBANK',
      name: 'HDFC Bank Ltd',
      eventType: 'VOLUME_SPIKE',
      significance: 55,
      title: 'HDFC Bank quarterly results released',
      explanation: 'Price remained stable, but volume spiked 220%.',
    },
  ];

  res.json(events);
};
