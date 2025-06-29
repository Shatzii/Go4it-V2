import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer } from 'ws';
import { setupAuth } from "./auth";
import { setupApiRoutes } from "./routes/api-routes";
import { setupAdminRoutes } from "./routes/admin-routes";
import { setupWebhookRoutes } from "./routes/webhook-routes";
import { initializeEngine } from "./services/engine-connector";
import { logger } from "./utils/logger";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize Go4It Engine connection
  await initializeEngine().catch(err => {
    logger.warn('Engine initialization failed, continuing with limited functionality', err);
  });

  // sets up authentication
  setupAuth(app);

  // API Routes
  setupApiRoutes(app);

  // Admin Routes
  setupAdminRoutes(app);

  // Webhook Routes
  setupWebhookRoutes(app);

  const httpServer = createServer(app);

  // WebSocket Server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws) => {
    logger.debug('WebSocket client connected');
    
    ws.on('message', (message) => {
      try {
        const parsedMessage = JSON.parse(message.toString());
        // Handle message based on type
        logger.debug('Received message:', parsedMessage);
      } catch (error) {
        logger.error('Error processing WebSocket message:', error);
      }
    });
    
    ws.on('close', () => {
      logger.debug('WebSocket client disconnected');
    });
  });

  return httpServer;
}
