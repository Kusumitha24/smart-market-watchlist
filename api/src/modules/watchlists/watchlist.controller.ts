import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.js';
import { SEED_STOCKS, marketSimulator } from '../market-data/simulator.service.js';

let mockWatchlists = [
  {
    id: 'wl-default-1',
    name: 'My Watchlist',
    description: 'Core Groww portfolio watchlist',
    isDefault: true,
    symbols: ['TCS', 'RELIANCE', 'HDFCBANK', 'INFY', 'ICICIBANK'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'wl-tech-2',
    name: 'Technology Leaders',
    description: 'Top Indian IT Services',
    isDefault: false,
    symbols: ['TCS', 'INFY', 'WIPRO'],
    createdAt: new Date().toISOString(),
  },
];

export const getWatchlistsHandler = (req: AuthenticatedRequest, res: Response) => {
  res.json(mockWatchlists);
};

export const createWatchlistHandler = (req: AuthenticatedRequest, res: Response) => {
  const { name, description } = req.body;
  const newWatchlist = {
    id: `wl-${Date.now()}`,
    name: name || 'New Watchlist',
    description: description || '',
    isDefault: false,
    symbols: ['TCS', 'RELIANCE'],
    createdAt: new Date().toISOString(),
  };

  mockWatchlists.push(newWatchlist);
  res.status(201).json(newWatchlist);
};

export const addStockToWatchlistHandler = (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { symbol } = req.body;

  const wl = mockWatchlists.find((w) => w.id === id);
  if (!wl) return res.status(404).json({ error: 'Watchlist not found' });

  if (symbol && !wl.symbols.includes(symbol.toUpperCase())) {
    wl.symbols.push(symbol.toUpperCase());
  }

  res.json(wl);
};

export const removeStockFromWatchlistHandler = (req: AuthenticatedRequest, res: Response) => {
  const { id, symbol } = req.params;

  const wl = mockWatchlists.find((w) => w.id === id);
  if (!wl) return res.status(404).json({ error: 'Watchlist not found' });

  wl.symbols = wl.symbols.filter((s) => s !== symbol.toUpperCase());
  res.json(wl);
};

export const deleteWatchlistHandler = (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  mockWatchlists = mockWatchlists.filter((w) => w.id !== id);
  res.json({ message: 'Watchlist deleted successfully' });
};
