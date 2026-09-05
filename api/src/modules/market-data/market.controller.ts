import { Request, Response } from 'express';
import { marketSimulator, SEED_STOCKS } from './simulator.service.js';

export const getQuoteHandler = (req: Request, res: Response) => {
  const { symbol } = req.params;
  const quote = marketSimulator.getQuote(symbol);
  if (!quote) return res.status(404).json({ error: 'Stock symbol not found' });
  res.json(quote);
};

export const getQuotesHandler = (req: Request, res: Response) => {
  const quotes = marketSimulator.getAllQuotes();
  res.json(quotes);
};

export const getAvailableStocksHandler = (req: Request, res: Response) => {
  res.json(SEED_STOCKS);
};

export const triggerSimulatorEventHandler = (req: Request, res: Response) => {
  const { symbol, event, magnitude } = req.body;
  if (!symbol || !event) {
    return res.status(400).json({ error: 'Missing required parameters: symbol, event' });
  }

  const updatedQuote = marketSimulator.injectSimulatorEvent(symbol, event, magnitude || 4.2);
  if (!updatedQuote) {
    return res.status(404).json({ error: 'Stock symbol not found' });
  }

  res.json({
    message: `Simulator event ${event} triggered for ${symbol}`,
    quote: updatedQuote,
  });
};
