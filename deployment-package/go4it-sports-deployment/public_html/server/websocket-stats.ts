/**
 * WebSocket Stats Module
 * 
 * Provides a centralized way to access WebSocket stats across the application
 * This allows the health route to access stats that are stored in the WebSocket server
 */

// Define the shape of the WebSocket stats object
export interface WebSocketStats {
  activeConnections: number;
  totalConnections: number;
  peakConnections: number;
  messagesSent: number;
  messagesReceived: number;
  authFailures: number;
  errors: number;
}

// Store a reference to the stats object
let wsStats: WebSocketStats | null = null;

/**
 * Set the current WebSocket stats object reference
 * This is called from routes.ts when the WebSocket server is initialized
 */
export function setWebSocketStats(stats: WebSocketStats): void {
  wsStats = stats;
}

/**
 * Get the latest WebSocket stats
 * Returns a default object if stats haven't been initialized yet
 */
export function getWebSocketStats(): WebSocketStats {
  if (!wsStats) {
    return {
      activeConnections: 0,
      totalConnections: 0,
      peakConnections: 0,
      messagesSent: 0,
      messagesReceived: 0,
      authFailures: 0,
      errors: 0
    };
  }
  
  return wsStats;
}