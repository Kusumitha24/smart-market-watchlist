import http from 'http';
import { createApp } from './app.js';
import { config } from './config/index.js';
import { setupWebSocketServer } from './websocket/socket.server.js';

const app = createApp();
const server = http.createServer(app);

// Setup Socket.IO WebSockets
setupWebSocketServer(server);

server.listen(config.port, () => {
  console.log(`====================================================`);
  console.log(`🚀 PULSEWATCH BACKEND ENGINE RUNNING ON PORT ${config.port}`);
  console.log(`📊 Mode: ${config.env}`);
  console.log(`🔗 API Base: http://localhost:${config.port}/api`);
  console.log(`====================================================`);
});
