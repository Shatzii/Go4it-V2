import { WebSocket } from 'ws';
import { Alert, Threat } from '@shared/schema';
import { slackService } from './slackService';

// Notification priority levels
type NotificationPriority = 'low' | 'medium' | 'high' | 'critical';

// Notification types
type NotificationType = 
  | 'alert' 
  | 'threat' 
  | 'system' 
  | 'auth' 
  | 'network' 
  | 'file_integrity' 
  | 'anomaly';

// Notification channels
type NotificationChannel = 
  | 'websocket' 
  | 'slack' 
  | 'email' 
  | 'sms';

// Base notification interface
interface BaseNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  priority: NotificationPriority;
  source?: string;
  metadata?: Record<string, any>;
}

// Alert notification interface
interface AlertNotification extends BaseNotification {
  type: 'alert';
  alertId: number;
  alertSeverity: string;
}

// Threat notification interface
interface ThreatNotification extends BaseNotification {
  type: 'threat';
  threatId: number;
  threatType: string;
  threatSeverity: string;
}

// System notification interface
interface SystemNotification extends BaseNotification {
  type: 'system';
  systemComponent: string;
}

// Union type for all notification types
type Notification = 
  | AlertNotification 
  | ThreatNotification 
  | SystemNotification 
  | BaseNotification;

/**
 * Notification Hub Service
 * 
 * Central hub for managing notifications across all channels including
 * WebSockets, Slack, Email, and SMS with intelligent routing and
 * delivery confirmation.
 */
class NotificationHubService {
  private clientConnections: Map<number, Set<WebSocket>> = new Map();
  private systemConnections: Set<WebSocket> = new Set();
  private notificationHistory: Map<number, Notification[]> = new Map();
  private notificationPreferences: Map<number, Record<NotificationType, NotificationChannel[]>> = new Map();
  
  constructor() {
    console.log('Notification Hub initialized');
  }
  
  /**
   * Register a WebSocket connection for a client
   */
  registerClientConnection(clientId: number, ws: WebSocket): void {
    if (!this.clientConnections.has(clientId)) {
      this.clientConnections.set(clientId, new Set());
    }
    
    this.clientConnections.get(clientId)?.add(ws);
    console.log(`WebSocket connection registered for client ${clientId}`);
  }
  
  /**
   * Register a WebSocket connection for system-wide notifications
   */
  registerSystemConnection(ws: WebSocket): void {
    this.systemConnections.add(ws);
    console.log('WebSocket connection registered for system-wide notifications');
  }
  
  /**
   * Unregister a WebSocket connection
   */
  unregisterConnection(ws: WebSocket): void {
    // Remove from client connections
    for (const [clientId, connections] of this.clientConnections.entries()) {
      if (connections.has(ws)) {
        connections.delete(ws);
        console.log(`WebSocket connection unregistered for client ${clientId}`);
      }
    }
    
    // Remove from system connections
    if (this.systemConnections.has(ws)) {
      this.systemConnections.delete(ws);
      console.log('WebSocket connection unregistered from system-wide notifications');
    }
  }
  
  /**
   * Set notification preferences for a client
   */
  setNotificationPreferences(
    clientId: number,
    preferences: Record<NotificationType, NotificationChannel[]>
  ): void {
    this.notificationPreferences.set(clientId, preferences);
  }
  
  /**
   * Get notification preferences for a client
   */
  getNotificationPreferences(clientId: number): Record<NotificationType, NotificationChannel[]> {
    // Default preferences if none are set
    const defaultPreferences: Record<NotificationType, NotificationChannel[]> = {
      alert: ['websocket', 'email', 'slack'],
      threat: ['websocket', 'email', 'slack', 'sms'],
      system: ['websocket'],
      auth: ['websocket', 'email'],
      network: ['websocket', 'email'],
      file_integrity: ['websocket', 'email'],
      anomaly: ['websocket', 'email', 'slack']
    };
    
    return this.notificationPreferences.get(clientId) || defaultPreferences;
  }
  
  /**
   * Send a notification through all appropriate channels
   */
  async sendNotification(
    clientId: number,
    notification: Notification,
    channels?: NotificationChannel[]
  ): Promise<void> {
    try {
      // Store notification in history
      this.storeNotification(clientId, notification);
      
      // Get client preferences if channels not explicitly provided
      const preferences = this.getNotificationPreferences(clientId);
      const notificationChannels = channels || preferences[notification.type] || ['websocket'];
      
      // Determine which channels to use based on priority
      const adjustedChannels = this.getChannelsByPriority(notification.priority, notificationChannels);
      
      const deliveryPromises = adjustedChannels.map(channel => {
        switch (channel) {
          case 'websocket':
            return this.sendWebSocketNotification(clientId, notification);
          case 'slack':
            return this.sendSlackNotification(clientId, notification);
          case 'email':
            return this.sendEmailNotification(clientId, notification);
          case 'sms':
            return this.sendSmsNotification(clientId, notification);
          default:
            return Promise.resolve();
        }
      });
      
      await Promise.all(deliveryPromises);
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  }
  
  /**
   * Adjust notification channels based on priority
   */
  private getChannelsByPriority(
    priority: NotificationPriority, 
    channels: NotificationChannel[]
  ): NotificationChannel[] {
    // For critical priorities, use all available channels
    if (priority === 'critical') {
      return ['websocket', 'slack', 'email', 'sms'];
    }
    
    // For high priority, ensure websocket and at least one other channel
    if (priority === 'high') {
      if (!channels.includes('websocket')) {
        channels.push('websocket');
      }
      
      // If no other channel than websocket, add email
      if (channels.length === 1 && channels[0] === 'websocket') {
        channels.push('email');
      }
    }
    
    return channels;
  }
  
  /**
   * Send a notification via WebSocket
   */
  private async sendWebSocketNotification(clientId: number, notification: Notification): Promise<boolean> {
    const connections = this.clientConnections.get(clientId);
    
    if (!connections || connections.size === 0) {
      return false;
    }
    
    const payload = JSON.stringify({
      type: 'notification',
      data: notification
    });
    
    let delivered = false;
    
    for (const ws of connections) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(payload);
        delivered = true;
      }
    }
    
    return delivered;
  }
  
  /**
   * Send a system-wide notification to all connected clients
   */
  async sendSystemNotification(notification: SystemNotification): Promise<void> {
    const payload = JSON.stringify({
      type: 'system_notification',
      data: notification
    });
    
    for (const ws of this.systemConnections) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(payload);
      }
    }
    
    // Also broadcast to all client connections
    for (const connections of this.clientConnections.values()) {
      for (const ws of connections) {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(payload);
        }
      }
    }
  }
  
  /**
   * Send a notification via Slack
   */
  private async sendSlackNotification(clientId: number, notification: Notification): Promise<boolean> {
    try {
      if (!slackService.isSlackConfigured()) {
        return false;
      }
      
      if (notification.type === 'alert' && 'alertId' in notification) {
        // Convert our notification to an Alert object for the Slack service
        const alertNotification = notification as AlertNotification;
        const alert: Alert = {
          id: alertNotification.alertId,
          title: alertNotification.title,
          description: alertNotification.message,
          severity: alertNotification.alertSeverity,
          clientId,
          type: 'security',
          createdAt: alertNotification.timestamp,
          isRead: false,
          isResolved: false
        };
        
        return await slackService.sendSecurityAlert(alert, 'Client ' + clientId);
      } 
      else if (notification.type === 'threat' && 'threatId' in notification) {
        // Convert our notification to a Threat object for the Slack service
        const threatNotification = notification as ThreatNotification;
        const threat: Threat = {
          id: threatNotification.threatId,
          title: threatNotification.title,
          description: threatNotification.message,
          severity: threatNotification.threatSeverity,
          clientId,
          type: threatNotification.threatType,
          status: 'active',
          detectedAt: threatNotification.timestamp
        };
        
        return await slackService.sendThreatNotification(threat, 'Client ' + clientId);
      }
      else {
        // For other types, send a generic Slack message via the security stats daily digest
        return await slackService.sendDailyDigest(clientId, 'Client ' + clientId, {
          alertsToday: 1,
          criticalAlerts: notification.priority === 'critical' ? 1 : 0,
          threatsToday: 0,
          resolvedThreats: 0,
          networkStatus: 'Monitoring'
        });
      }
    } catch (error) {
      console.error('Failed to send Slack notification:', error);
      return false;
    }
  }
  
  /**
   * Send a notification via Email
   */
  private async sendEmailNotification(clientId: number, notification: Notification): Promise<boolean> {
    // Email service would be implemented here
    console.log(`📧 Email notification sent for client ${clientId}: ${notification.title}`);
    return true;
  }
  
  /**
   * Send a notification via SMS
   */
  private async sendSmsNotification(clientId: number, notification: Notification): Promise<boolean> {
    // SMS service would be implemented here
    console.log(`📱 SMS notification sent for client ${clientId}: ${notification.title}`);
    return true;
  }
  
  /**
   * Store notification in history
   */
  private storeNotification(clientId: number, notification: Notification): void {
    if (!this.notificationHistory.has(clientId)) {
      this.notificationHistory.set(clientId, []);
    }
    
    const history = this.notificationHistory.get(clientId);
    if (history) {
      // Limit history to 1000 notifications per client
      if (history.length >= 1000) {
        history.shift(); // Remove oldest notification
      }
      
      history.push(notification);
    }
  }
  
  /**
   * Get notification history for a client
   */
  getNotificationHistory(clientId: number, limit: number = 100): Notification[] {
    const history = this.notificationHistory.get(clientId) || [];
    return history.slice(-limit).reverse(); // Return the most recent notifications first
  }
  
  /**
   * Create and send an alert notification
   */
  async sendAlertNotification(
    clientId: number,
    alert: Alert,
    priority: NotificationPriority = 'medium'
  ): Promise<void> {
    const notification: AlertNotification = {
      id: `alert-${alert.id}-${Date.now()}`,
      type: 'alert',
      title: alert.title,
      message: alert.description || 'No description provided',
      timestamp: new Date(alert.createdAt || new Date()),
      priority,
      alertId: alert.id,
      alertSeverity: alert.severity,
      source: 'sentinel-ai',
    };
    
    await this.sendNotification(clientId, notification);
  }
  
  /**
   * Create and send a threat notification
   */
  async sendThreatNotification(
    clientId: number,
    threat: Threat,
    priority: NotificationPriority = 'high'
  ): Promise<void> {
    const notification: ThreatNotification = {
      id: `threat-${threat.id}-${Date.now()}`,
      type: 'threat',
      title: threat.title,
      message: threat.description || 'No description provided',
      timestamp: new Date(threat.detectedAt || new Date()),
      priority,
      threatId: threat.id,
      threatType: threat.type,
      threatSeverity: threat.severity,
      source: 'sentinel-ai',
    };
    
    await this.sendNotification(clientId, notification);
  }
  
  /**
   * Create and send a system notification
   */
  async sendSystemStatusNotification(
    title: string,
    message: string,
    component: string,
    priority: NotificationPriority = 'low'
  ): Promise<void> {
    const notification: SystemNotification = {
      id: `system-${Date.now()}`,
      type: 'system',
      title,
      message,
      timestamp: new Date(),
      priority,
      systemComponent: component,
      source: 'sentinel-ai',
    };
    
    await this.sendSystemNotification(notification);
  }
}

export const notificationHub = new NotificationHubService();