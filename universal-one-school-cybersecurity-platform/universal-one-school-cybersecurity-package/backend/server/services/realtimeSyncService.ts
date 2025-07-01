import { WebSocket } from "ws";
import { storage } from "../storage";
import { performanceOptimizer } from "./performanceOptimizer";

/**
 * Handles real-time data synchronization between clients and server
 * Optimizes data transfer and ensures consistent state across all connected clients
 */
class RealtimeSyncService {
  private connectedClients: Map<WebSocket, { 
    userId?: number, 
    clientId?: number,
    lastSyncTime: number,
    subscribedTopics: Set<string>
  }> = new Map();
  
  // Data change tracking for efficient syncing
  private changeLog: Map<string, { 
    lastUpdate: number, 
    changedIds: Set<number>
  }> = new Map();
  
  // Subscription topics available in the system
  private readonly AVAILABLE_TOPICS = [
    'threats', 
    'alerts', 
    'logs', 
    'network', 
    'fileIntegrity',
    'anomalies',
    'dashboard'
  ];
  
  constructor() {
    console.log('Real-time sync service initialized');
    
    // Initialize change tracking for all entity types
    this.initializeChangeTracking();
    
    // Start periodic sync for connected clients
    setInterval(() => this.syncConnectedClients(), 5000); // Every 5 seconds
  }
  
  /**
   * Initialize change tracking for different entity types
   */
  private initializeChangeTracking(): void {
    this.AVAILABLE_TOPICS.forEach(topic => {
      this.changeLog.set(topic, {
        lastUpdate: Date.now(),
        changedIds: new Set()
      });
    });
  }
  
  /**
   * Register a WebSocket connection with the service
   */
  registerConnection(ws: WebSocket): void {
    this.connectedClients.set(ws, {
      lastSyncTime: Date.now(),
      subscribedTopics: new Set(['threats', 'alerts', 'dashboard']) // Default subscriptions
    });
    
    // Setup disconnect handler
    ws.on('close', () => {
      this.connectedClients.delete(ws);
    });
    
    // Setup message handler for client commands
    ws.on('message', (message: string) => {
      try {
        const data = JSON.parse(message);
        this.handleClientMessage(ws, data);
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    });
    
    // Send initial connection acknowledgment
    this.sendToClient(ws, {
      type: 'connection_established',
      data: {
        connectionId: this.generateConnectionId(),
        serverTime: new Date().toISOString(),
        availableTopics: this.AVAILABLE_TOPICS
      }
    });
  }
  
  /**
   * Handle incoming client messages
   */
  private handleClientMessage(ws: WebSocket, message: any): void {
    const client = this.connectedClients.get(ws);
    if (!client) return;
    
    switch (message.type) {
      case 'authenticate':
        // Update client with authentication info
        if (message.userId && message.clientId) {
          client.userId = message.userId;
          client.clientId = message.clientId;
          
          // Confirm authentication
          this.sendToClient(ws, {
            type: 'authentication_successful',
            data: { userId: message.userId, clientId: message.clientId }
          });
        }
        break;
        
      case 'subscribe':
        // Add topics to client's subscriptions
        if (Array.isArray(message.topics)) {
          message.topics.forEach((topic: string) => {
            if (this.AVAILABLE_TOPICS.includes(topic)) {
              client.subscribedTopics.add(topic);
            }
          });
          
          // Confirm subscription
          this.sendToClient(ws, {
            type: 'subscription_updated',
            data: { subscribedTopics: Array.from(client.subscribedTopics) }
          });
          
          // Immediately sync the newly subscribed topics
          this.syncClient(ws);
        }
        break;
        
      case 'unsubscribe':
        // Remove topics from client's subscriptions
        if (Array.isArray(message.topics)) {
          message.topics.forEach((topic: string) => {
            client.subscribedTopics.delete(topic);
          });
          
          // Confirm unsubscription
          this.sendToClient(ws, {
            type: 'subscription_updated',
            data: { subscribedTopics: Array.from(client.subscribedTopics) }
          });
        }
        break;
        
      case 'sync_request':
        // Client is requesting an immediate sync
        this.syncClient(ws);
        break;
    }
  }
  
  /**
   * Record a change to an entity type
   */
  recordChange(entityType: string, entityId: number): void {
    // Get the change log for this entity type
    const changeRecord = this.changeLog.get(entityType);
    if (!changeRecord) return;
    
    // Record the change
    changeRecord.lastUpdate = Date.now();
    changeRecord.changedIds.add(entityId);
    
    // Immediately notify clients if it's a critical update
    const criticalTypes = ['threats', 'alerts'];
    if (criticalTypes.includes(entityType)) {
      this.notifyClientsOfCriticalChange(entityType, entityId);
    }
  }
  
  /**
   * Immediately notify clients of a critical change
   */
  private notifyClientsOfCriticalChange(entityType: string, entityId: number): void {
    for (const [ws, client] of this.connectedClients.entries()) {
      // Skip clients not subscribed to this topic
      if (!client.subscribedTopics.has(entityType)) continue;
      
      // Skip clients that aren't authenticated or don't have a client ID
      if (!client.clientId) continue;
      
      // Fetch the entity data
      this.fetchEntityData(entityType, entityId, client.clientId)
        .then(data => {
          if (!data) return;
          
          // Send real-time update
          this.sendToClient(ws, {
            type: 'entity_updated',
            entityType,
            data
          });
        })
        .catch(error => {
          console.error(`Error fetching ${entityType} data:`, error);
        });
    }
  }
  
  /**
   * Fetch entity data for a specific ID
   */
  private async fetchEntityData(entityType: string, entityId: number, clientId: number): Promise<any> {
    // Use caching to optimize frequently accessed data
    const cacheKey = `entity:${entityType}:${entityId}`;
    
    return performanceOptimizer.getCachedData(cacheKey, async () => {
      try {
        // Fetch different entity types
        switch (entityType) {
          case 'threats':
            // Fetch single threat by ID
            return { /* Simulated data */ };
          case 'alerts':
            // Fetch single alert by ID
            return { /* Simulated data */ };
          case 'logs':
            // Fetch single log by ID
            return { /* Simulated data */ };
          default:
            return null;
        }
      } catch (error) {
        console.error(`Error fetching entity data (${entityType}/${entityId}):`, error);
        return null;
      }
    }, 30000); // Cache for 30 seconds
  }
  
  /**
   * Sync all connected clients with latest data
   */
  private syncConnectedClients(): void {
    // For each connected client
    for (const [ws, client] of this.connectedClients.entries()) {
      // Only sync authenticated clients
      if (!client.clientId) continue;
      
      // Check if client needs syncing (every 5 seconds)
      const timeSinceLastSync = Date.now() - client.lastSyncTime;
      if (timeSinceLastSync >= 5000) {
        this.syncClient(ws);
      }
    }
  }
  
  /**
   * Sync a specific client with latest data
   */
  private syncClient(ws: WebSocket): void {
    const client = this.connectedClients.get(ws);
    if (!client || !client.clientId) return;
    
    // Update last sync time
    client.lastSyncTime = Date.now();
    
    // For each subscribed topic
    for (const topic of client.subscribedTopics) {
      // Get optimized query options
      const queryOptions = performanceOptimizer.getOptimizedQueryOptions(client.clientId, topic);
      
      // Fetch the data
      this.fetchTopicData(topic, client.clientId, queryOptions)
        .then(data => {
          if (!data) return;
          
          // Send sync update
          this.sendToClient(ws, {
            type: 'sync_update',
            topic,
            data,
            timestamp: new Date().toISOString()
          });
        })
        .catch(error => {
          console.error(`Error syncing ${topic} data:`, error);
        });
    }
  }
  
  /**
   * Fetch data for a specific topic
   */
  private async fetchTopicData(topic: string, clientId: number, options: any): Promise<any> {
    // Use cache for frequently accessed data
    const cacheKey = `sync:${topic}:${clientId}:${JSON.stringify(options)}`;
    
    return performanceOptimizer.getCachedData(cacheKey, async () => {
      try {
        // Fetch different types of data
        switch (topic) {
          case 'threats':
            return await storage.getThreats(clientId, options.limit);
          case 'alerts':
            return await storage.getAlerts(clientId, options.limit);
          case 'logs':
            return await storage.getLogs(clientId, options.limit);
          case 'network':
            return await storage.getNetworkNodes(clientId);
          case 'fileIntegrity':
            return await storage.getFileIntegrityChecks(clientId, options.limit);
          case 'anomalies':
            return await storage.getAnomalies(clientId, options.limit);
          case 'dashboard':
            // Fetch dashboard stats - more complex, needs multiple calls
            const [threatStats, unreadAlerts, anomalyStats, networkNodes] = await Promise.all([
              storage.getThreatStats(clientId),
              storage.getUnreadAlertCount(clientId),
              storage.getAnomalyStats(clientId),
              storage.getNetworkNodes(clientId)
            ]);
            
            const endpointsOnline = networkNodes.filter(node => node.status === 'online').length;
            const securityScore = Math.max(0, 100 - (threatStats.activeThreats * 5) - (anomalyStats.highRiskCount * 10));
            
            return {
              activeThreats: threatStats.activeThreats,
              blockedAttacks: threatStats.resolvedToday,
              endpoints: endpointsOnline,
              securityScore: `${securityScore}%`,
              unreadAlerts
            };
          default:
            return null;
        }
      } catch (error) {
        console.error(`Error fetching topic data (${topic}):`, error);
        return null;
      }
    }, 10000); // Cache for 10 seconds
  }
  
  /**
   * Send a message to a specific client
   */
  private sendToClient(ws: WebSocket, message: any): void {
    try {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
      }
    } catch (error) {
      console.error('Error sending message to client:', error);
    }
  }
  
  /**
   * Generate a unique connection ID
   */
  private generateConnectionId(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }
  
  /**
   * Broadcast a system-wide notification to all connected clients
   */
  broadcastSystemNotification(title: string, message: string, severity: string): void {
    const notification = {
      type: 'system_notification',
      title,
      message,
      severity,
      timestamp: new Date().toISOString()
    };
    
    // Send to all connected clients
    for (const [ws, client] of this.connectedClients.entries()) {
      this.sendToClient(ws, notification);
    }
  }
  
  /**
   * Get statistics about current connections
   */
  getConnectionStats(): any {
    const totalConnections = this.connectedClients.size;
    const authenticatedConnections = Array.from(this.connectedClients.values())
      .filter(client => client.clientId).length;
    
    const topicSubscriptions = new Map<string, number>();
    this.AVAILABLE_TOPICS.forEach(topic => {
      const count = Array.from(this.connectedClients.values())
        .filter(client => client.subscribedTopics.has(topic)).length;
      topicSubscriptions.set(topic, count);
    });
    
    return {
      totalConnections,
      authenticatedConnections,
      subscriptions: Object.fromEntries(topicSubscriptions)
    };
  }
}

export const realtimeSyncService = new RealtimeSyncService();