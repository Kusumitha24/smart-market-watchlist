import express from 'express';
import cors from 'cors';
import { config } from './config/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { loginHandler, registerHandler, logoutHandler } from './modules/auth/auth.controller.js';
import {
  getWatchlistsHandler,
  createWatchlistHandler,
  addStockToWatchlistHandler,
  removeStockFromWatchlistHandler,
  deleteWatchlistHandler,
} from './modules/watchlists/watchlist.controller.js';
import {
  getQuoteHandler,
  getQuotesHandler,
  getAvailableStocksHandler,
  triggerSimulatorEventHandler,
} from './modules/market-data/market.controller.js';
import {
  getDashboardInsightsHandler,
  getReplayTimelineHandler,
  getChangeTimelineEventsHandler,
} from './modules/insights/insights.controller.js';

export function createApp() {
  const app = express();

  app.use(cors({ origin: '*' }));
  app.use(express.json());

  // Health checks
  app.get('/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));
  app.get('/ready', (req, res) => res.json({ status: 'ready', timestamp: new Date().toISOString() }));

  // Auth Routes
  app.post('/api/auth/login', loginHandler);
  app.post('/api/auth/register', registerHandler);
  app.post('/api/auth/logout', logoutHandler);

  // Watchlist Routes
  app.get('/api/watchlists', getWatchlistsHandler);
  app.post('/api/watchlists', createWatchlistHandler);
  app.post('/api/watchlists/:id/stocks', addStockToWatchlistHandler);
  app.delete('/api/watchlists/:id/stocks/:symbol', removeStockFromWatchlistHandler);
  app.delete('/api/watchlists/:id', deleteWatchlistHandler);

  // Market Data Routes
  app.get('/api/market/quotes', getQuotesHandler);
  app.get('/api/market/quote/:symbol', getQuoteHandler);
  app.get('/api/market/stocks', getAvailableStocksHandler);
  app.post('/api/market/simulator', triggerSimulatorEventHandler);

  // Market Memory Insights & Replay Routes
  app.get('/api/insights/dashboard', getDashboardInsightsHandler);
  app.get('/api/insights/replay', getReplayTimelineHandler);
  app.get('/api/insights/timeline', getChangeTimelineEventsHandler);

  app.use(errorHandler);

  return app;
}
