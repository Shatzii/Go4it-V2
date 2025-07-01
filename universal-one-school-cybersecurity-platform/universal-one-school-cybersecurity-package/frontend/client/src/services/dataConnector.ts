import { queryClient } from '@/lib/queryClient';

/**
 * Dashboard Data Connector
 * 
 * Provides real-time access to security metrics and system data
 * with automatic caching, WebSocket updates, and data transformation
 */
class DashboardDataConnector {
  private socket: WebSocket | null = null;
  private isConnecting: boolean = false;
  private reconnectTimeout: number | null = null;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 3000; // Start with 3 seconds
  private subscriptions: Set<string> = new Set(['dashboard', 'threats', 'alerts']);
  private connectionListeners: Set<() => void> = new Set();
  private disconnectionListeners: Set<() => void> = new Set();
  
  /**
   * Initialize the WebSocket connection
   * @param userId User ID for the connection
   * @param clientId Client ID for the connection
   */
  connect(userId: number, clientId: number): void {
    if (this.socket?.readyState === WebSocket.OPEN || this.isConnecting) {
      return;
    }
    
    this.isConnecting = true;
    this.clearReconnectTimeout();
    
    try {
      // Set up WebSocket connection to the server
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      
      this.socket = new WebSocket(wsUrl);
      
      // Connection established
      this.socket.onopen = () => {
        console.log('WebSocket connection established');
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.reconnectDelay = 3000;
        
        // Authenticate the connection
        this.sendMessage({
          type: 'authenticate',
          userId,
          clientId
        });
        
        // Subscribe to default topics
        this.sendMessage({
          type: 'subscribe',
          topics: Array.from(this.subscriptions)
        });
        
        // Notify connection listeners
        this.notifyConnectionListeners();
      };
      
      // Handle incoming messages
      this.socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          this.handleIncomingMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      // Handle disconnection
      this.socket.onclose = () => {
        console.log('WebSocket connection closed');
        this.socket = null;
        this.isConnecting = false;
        
        // Notify disconnection listeners
        this.notifyDisconnectionListeners();
        
        // Attempt to reconnect
        this.scheduleReconnect();
      };
      
      // Handle errors
      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        // The onclose handler will be called after this
      };
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      this.isConnecting = false;
      this.scheduleReconnect();
    }
  }
  
  /**
   * Close the WebSocket connection
   */
  disconnect(): void {
    this.clearReconnectTimeout();
    
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.close();
    }
    
    this.socket = null;
    this.isConnecting = false;
  }
  
  /**
   * Check if the WebSocket is connected
   */
  isConnected(): boolean {
    return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
  }
  
  /**
   * Subscribe to specific data topics
   * @param topics Array of topics to subscribe to
   */
  subscribe(topics: string[]): void {
    if (!Array.isArray(topics) || topics.length === 0) {
      return;
    }
    
    // Add to subscriptions set
    topics.forEach(topic => this.subscriptions.add(topic));
    
    // If connected, send subscribe message
    if (this.isConnected()) {
      this.sendMessage({
        type: 'subscribe',
        topics
      });
    }
  }
  
  /**
   * Unsubscribe from specific data topics
   * @param topics Array of topics to unsubscribe from
   */
  unsubscribe(topics: string[]): void {
    if (!Array.isArray(topics) || topics.length === 0) {
      return;
    }
    
    // Remove from subscriptions set
    topics.forEach(topic => this.subscriptions.delete(topic));
    
    // If connected, send unsubscribe message
    if (this.isConnected()) {
      this.sendMessage({
        type: 'unsubscribe',
        topics
      });
    }
  }
  
  /**
   * Request an immediate data sync for all subscribed topics
   */
  requestSync(): void {
    if (this.isConnected()) {
      this.sendMessage({
        type: 'sync_request'
      });
    }
  }
  
  /**
   * Add connection state change listener
   * @param onConnect Function to call when connection is established
   * @param onDisconnect Function to call when connection is lost
   */
  addConnectionListener(onConnect: () => void, onDisconnect: () => void): void {
    if (onConnect) {
      this.connectionListeners.add(onConnect);
    }
    
    if (onDisconnect) {
      this.disconnectionListeners.add(onDisconnect);
    }
    
    // If already connected, immediately notify
    if (this.isConnected() && onConnect) {
      onConnect();
    }
  }
  
  /**
   * Remove connection state change listener
   * @param onConnect Function to remove from connect listeners
   * @param onDisconnect Function to remove from disconnect listeners
   */
  removeConnectionListener(onConnect?: () => void, onDisconnect?: () => void): void {
    if (onConnect) {
      this.connectionListeners.delete(onConnect);
    }
    
    if (onDisconnect) {
      this.disconnectionListeners.delete(onDisconnect);
    }
  }
  
  /**
   * Handle incoming WebSocket messages
   * @param message The parsed message object
   */
  private handleIncomingMessage(message: any): void {
    switch (message.type) {
      case 'connection_established':
        console.log('WebSocket connection authenticated:', message.data);
        break;
        
      case 'authentication_successful':
        console.log('Authentication successful:', message.data);
        break;
        
      case 'subscription_updated':
        console.log('Subscriptions updated:', message.data);
        break;
        
      case 'sync_update':
        // Handle data sync update
        this.handleSyncUpdate(message.topic, message.data);
        break;
        
      case 'entity_updated':
        // Handle individual entity update
        this.handleEntityUpdate(message.entityType, message.data);
        break;
        
      case 'notification':
        // Handle notification message
        this.handleNotification(message.data);
        break;
        
      case 'system_notification':
        // Handle system notification
        this.handleSystemNotification(message);
        break;
        
      default:
        console.log('Unhandled WebSocket message type:', message.type);
    }
  }
  
  /**
   * Handle sync update messages by updating the query cache
   * @param topic The data topic
   * @param data The updated data
   */
  private handleSyncUpdate(topic: string, data: any): void {
    // Map topics to query keys
    const queryKeyMap: Record<string, string> = {
      'dashboard': '/api/dashboard/stats',
      'threats': '/api/threats',
      'alerts': '/api/alerts',
      'network': '/api/network/nodes',
      'logs': '/api/logs',
      'fileIntegrity': '/api/file-integrity',
      'anomalies': '/api/anomalies'
    };
    
    const queryKey = queryKeyMap[topic];
    if (queryKey) {
      // Update query cache with new data
      queryClient.setQueryData([queryKey], data);
      
      // Also invalidate the query to trigger a refetch if components need fresh data
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    }
  }
  
  /**
   * Handle entity update messages
   * @param entityType The type of entity updated
   * @param data The updated entity data
   */
  private handleEntityUpdate(entityType: string, data: any): void {
    // Map entity types to query keys for individual entities
    const queryKeyMap: Record<string, string> = {
      'threat': '/api/threats',
      'alert': '/api/alerts',
      'log': '/api/logs',
      'networkNode': '/api/network/nodes',
      'fileCheck': '/api/file-integrity',
      'anomaly': '/api/anomalies'
    };
    
    const queryKey = queryKeyMap[entityType];
    if (queryKey) {
      // Invalidate the query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      
      // Also invalidate dashboard stats as they may have changed
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
    }
  }
  
  /**
   * Handle notification messages
   * @param data The notification data
   */
  private handleNotification(data: any): void {
    // Invalidate alerts to show new notification
    queryClient.invalidateQueries({ queryKey: ['/api/alerts'] });
    
    // Dispatch a custom event for notification listeners
    const event = new CustomEvent('sentinel:notification', { detail: data });
    window.dispatchEvent(event);
  }
  
  /**
   * Handle system notification messages
   * @param message The system notification message
   */
  private handleSystemNotification(message: any): void {
    // Dispatch a custom event for system notification listeners
    const event = new CustomEvent('sentinel:system_notification', { detail: message });
    window.dispatchEvent(event);
  }
  
  /**
   * Send a message to the server
   * @param message The message to send
   */
  private sendMessage(message: any): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    }
  }
  
  /**
   * Schedule a reconnection attempt
   */
  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Maximum reconnection attempts reached');
      return;
    }
    
    this.clearReconnectTimeout();
    
    this.reconnectTimeout = window.setTimeout(() => {
      this.reconnectAttempts++;
      
      // Exponential backoff for reconnect delay
      this.reconnectDelay = Math.min(30000, this.reconnectDelay * 1.5);
      
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      
      // Attempt to reconnect
      this.connect(0, 0); // These will be properly set during authentication
    }, this.reconnectDelay);
  }
  
  /**
   * Clear any pending reconnection timeout
   */
  private clearReconnectTimeout(): void {
    if (this.reconnectTimeout !== null) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }
  
  /**
   * Notify all connection listeners
   */
  private notifyConnectionListeners(): void {
    this.connectionListeners.forEach(listener => {
      try {
        listener();
      } catch (error) {
        console.error('Error in connection listener:', error);
      }
    });
  }
  
  /**
   * Notify all disconnection listeners
   */
  private notifyDisconnectionListeners(): void {
    this.disconnectionListeners.forEach(listener => {
      try {
        listener();
      } catch (error) {
        console.error('Error in disconnection listener:', error);
      }
    });
  }
}

// Create a singleton instance
export const dashboardConnector = new DashboardDataConnector();