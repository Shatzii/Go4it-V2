import { useEffect, useState } from 'react';

// Notification priority levels
export type NotificationPriority = 'low' | 'medium' | 'high' | 'critical';

// Notification types
export type NotificationType = 
  | 'alert' 
  | 'threat' 
  | 'system' 
  | 'auth' 
  | 'network' 
  | 'file_integrity' 
  | 'anomaly';

// Base notification interface
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  priority: NotificationPriority;
  source?: string;
  metadata?: Record<string, any>;
  isRead?: boolean;
}

// Event handlers
type NotificationHandler = (notification: Notification) => void;
type ConnectionStatusHandler = (status: ConnectionStatus) => void;

// Connection status
export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting' | 'error';

/**
 * WebSocket Notification Service
 * 
 * Manages real-time notifications via WebSocket connection
 */
class NotificationService {
  private socket: WebSocket | null = null;
  private clientId: number | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 2000; // Start with 2 second delay
  private connectionStatus: ConnectionStatus = 'disconnected';
  
  private notificationHandlers: NotificationHandler[] = [];
  private statusHandlers: ConnectionStatusHandler[] = [];
  
  // Connect to WebSocket server
  connect(clientId: number): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }
    
    this.clientId = clientId;
    this.updateConnectionStatus('connecting');
    
    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      
      this.socket = new WebSocket(wsUrl);
      
      this.socket.onopen = this.handleOpen.bind(this);
      this.socket.onmessage = this.handleMessage.bind(this);
      this.socket.onclose = this.handleClose.bind(this);
      this.socket.onerror = this.handleError.bind(this);
    } catch (error) {
      console.error('Failed to connect to WebSocket server:', error);
      this.updateConnectionStatus('error');
      this.scheduleReconnect();
    }
  }
  
  // Disconnect from WebSocket server
  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    
    this.updateConnectionStatus('disconnected');
  }
  
  // Subscribe to notifications
  subscribeToNotifications(handler: NotificationHandler): () => void {
    this.notificationHandlers.push(handler);
    
    // Return unsubscribe function
    return () => {
      this.notificationHandlers = this.notificationHandlers.filter(h => h !== handler);
    };
  }
  
  // Subscribe to connection status changes
  subscribeToConnectionStatus(handler: ConnectionStatusHandler): () => void {
    this.statusHandlers.push(handler);
    handler(this.connectionStatus); // Immediately call with current status
    
    // Return unsubscribe function
    return () => {
      this.statusHandlers = this.statusHandlers.filter(h => h !== handler);
    };
  }
  
  // Handle WebSocket open event
  private handleOpen(): void {
    console.log('WebSocket connected');
    this.updateConnectionStatus('connected');
    this.reconnectAttempts = 0;
    
    // Send authentication message with clientId
    if (this.socket && this.clientId) {
      this.socket.send(JSON.stringify({
        type: 'authenticate',
        clientId: this.clientId
      }));
    }
  }
  
  // Handle WebSocket message event
  private handleMessage(event: MessageEvent): void {
    try {
      const data = JSON.parse(event.data);
      
      if (data.type === 'notification' || data.type === 'system_notification') {
        const notification = data.data as Notification;
        
        // Convert timestamp string to Date if necessary
        if (typeof notification.timestamp === 'string') {
          notification.timestamp = new Date(notification.timestamp);
        }
        
        // Notify all handlers
        this.notificationHandlers.forEach(handler => {
          try {
            handler(notification);
          } catch (error) {
            console.error('Error in notification handler:', error);
          }
        });
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }
  
  // Handle WebSocket close event
  private handleClose(event: CloseEvent): void {
    console.log(`WebSocket disconnected: ${event.code} ${event.reason}`);
    this.updateConnectionStatus('disconnected');
    
    // Don't reconnect if closed cleanly
    if (event.code !== 1000) {
      this.scheduleReconnect();
    }
  }
  
  // Handle WebSocket error event
  private handleError(event: Event): void {
    console.error('WebSocket error:', event);
    this.updateConnectionStatus('error');
    
    // Socket will close after error, which will trigger reconnect
  }
  
  // Schedule reconnection attempt
  private scheduleReconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
    
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Maximum reconnection attempts reached');
      return;
    }
    
    const delay = this.reconnectDelay * Math.pow(1.5, this.reconnectAttempts);
    console.log(`Scheduling reconnect in ${delay}ms`);
    
    this.reconnectTimer = setTimeout(() => {
      console.log(`Attempting to reconnect (${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`);
      this.reconnectAttempts++;
      
      if (this.clientId) {
        this.connect(this.clientId);
      }
    }, delay);
  }
  
  // Update connection status and notify handlers
  private updateConnectionStatus(status: ConnectionStatus): void {
    if (this.connectionStatus !== status) {
      this.connectionStatus = status;
      
      this.statusHandlers.forEach(handler => {
        try {
          handler(status);
        } catch (error) {
          console.error('Error in status handler:', error);
        }
      });
    }
  }
  
  // Get current connection status
  getConnectionStatus(): ConnectionStatus {
    return this.connectionStatus;
  }
}

// Create singleton instance
export const notificationService = new NotificationService();

/**
 * Hook for using notifications in React components
 */
export function useNotifications(clientId?: number) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  
  // Connect to notification service when component mounts
  useEffect(() => {
    if (clientId) {
      // Connect to notification service
      notificationService.connect(clientId);
      
      // Subscribe to notifications
      const unsubscribeNotifications = notificationService.subscribeToNotifications(
        (notification) => {
          setNotifications(prev => [notification, ...prev].slice(0, 100)); // Keep last 100 notifications
        }
      );
      
      // Subscribe to connection status
      const unsubscribeStatus = notificationService.subscribeToConnectionStatus(
        (newStatus) => {
          setStatus(newStatus);
        }
      );
      
      // Cleanup on unmount
      return () => {
        unsubscribeNotifications();
        unsubscribeStatus();
      };
    }
  }, [clientId]);
  
  return {
    notifications,
    connectionStatus: status,
    clearNotifications: () => setNotifications([]),
    markAsRead: (id: string) => {
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, isRead: true } 
            : notification
        )
      );
    },
    markAllAsRead: () => {
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      );
    }
  };
}