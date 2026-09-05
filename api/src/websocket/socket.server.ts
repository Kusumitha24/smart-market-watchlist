import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { marketSimulator } from '../modules/market-data/simulator.service.js';

export function setupWebSocketServer(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  console.log('[WebSocket] Initialized Socket.IO server');

  io.on('connection', (socket: Socket) => {
    console.log(`[WebSocket] Client connected: ${socket.id}`);

    // Client subscribes to specific watchlist or stock symbols
    socket.on('subscribe:watchlist', (symbols: string[]) => {
      console.log(`[WebSocket] Client ${socket.id} subscribed to symbols:`, symbols);
      socket.join('market_updates');
    });

    socket.on('disconnect', () => {
      console.log(`[WebSocket] Client disconnected: ${socket.id}`);
    });
  });

  // Broadcast market data updates every 3 seconds to connected subscribers
  setInterval(() => {
    const quotes = marketSimulator.getAllQuotes();
    io.to('market_updates').emit('market:tick', {
      timestamp: new Date().toISOString(),
      quotes,
    });
  }, 3000);

  return io;
}
