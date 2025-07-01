import { storage } from '../storage';
import { notificationHub } from './notificationHub';
import { Alert, InsertAlert } from '@shared/schema';

/**
 * Alert Management System
 * 
 * Centralizes creation, tracking, and management of security alerts
 * with features for alert verification, resolution, and reporting
 */
class AlertManagementSystem {
  // Track active alerts in memory for quick access
  private activeAlerts: Map<number, Set<number>> = new Map();
  
  constructor() {
    this.initialize();
  }
  
  /**
   * Initialize the alert management system
   */
  private async initialize(): Promise<void> {
    console.log('Alert Management System initialized');
  }
  
  /**
   * Create a new security alert
   */
  async createAlert(clientId: number, alertData: {
    title: string;
    message: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    source: string;
    sourceType: string;
    metadata?: Record<string, any>;
  }): Promise<Alert | null> {
    try {
      // Prepare alert data
      const insertData: InsertAlert = {
        clientId,
        title: alertData.title,
        message: alertData.message,
        severity: alertData.severity,
        source: alertData.source,
        sourceType: alertData.sourceType,
        isRead: false,
        timestamp: new Date(),
        metadata: alertData.metadata || {}
      };
      
      // Create alert in storage
      const alert = await storage.createAlert(insertData);
      console.log(`Alert created for client ${clientId}: ${alertData.title}`);
      
      // Track in memory cache
      if (!this.activeAlerts.has(clientId)) {
        this.activeAlerts.set(clientId, new Set());
      }
      this.activeAlerts.get(clientId)?.add(alert.id);
      
      // Send notification
      await notificationHub.processSecurityEvent(clientId, 'alert', {
        title: alertData.title,
        message: alertData.message,
        severity: alertData.severity,
        timestamp: alert.timestamp,
        id: alert.id,
        source: alertData.source
      });
      
      return alert;
    } catch (error) {
      console.error(`Failed to create alert for client ${clientId}:`, error);
      return null;
    }
  }
  
  /**
   * Get active alerts for a client
   */
  async getActiveAlerts(clientId: number, limit?: number): Promise<Alert[]> {
    try {
      // Get alerts from storage
      return await storage.getAlerts(clientId, limit);
    } catch (error) {
      console.error(`Failed to get alerts for client ${clientId}:`, error);
      return [];
    }
  }
  
  /**
   * Get a single alert by ID
   */
  async getAlertById(alertId: number): Promise<Alert | undefined> {
    try {
      // This would be implemented in the storage interface
      const alerts = await storage.getAlerts(0, 1);
      return alerts.find(a => a.id === alertId);
    } catch (error) {
      console.error(`Failed to get alert ${alertId}:`, error);
      return undefined;
    }
  }
  
  /**
   * Mark an alert as read
   */
  async markAlertAsRead(alertId: number): Promise<boolean> {
    try {
      await storage.markAlertAsRead(alertId);
      
      // Update in-memory cache
      for (const [clientId, alerts] of this.activeAlerts.entries()) {
        if (alerts.has(alertId)) {
          // The alert is still tracked for statistics, but marked as read
          // For full removal, implement a separate method
        }
      }
      
      return true;
    } catch (error) {
      console.error(`Failed to mark alert ${alertId} as read:`, error);
      return false;
    }
  }
  
  /**
   * Get alert statistics for a client
   */
  async getAlertStatistics(clientId: number): Promise<any> {
    try {
      // Count of unread alerts
      const unreadCount = await storage.getUnreadAlertCount(clientId);
      
      // Count by severity
      const alerts = await storage.getAlerts(clientId, 1000);
      const bySeverity = {
        low: 0,
        medium: 0,
        high: 0,
        critical: 0
      };
      
      // Count by source
      const bySource: Record<string, number> = {};
      
      // Last 24 hours
      const last24Hours = new Date();
      last24Hours.setHours(last24Hours.getHours() - 24);
      let last24HoursCount = 0;
      
      // Process alerts
      for (const alert of alerts) {
        // Count by severity
        if (alert.severity in bySeverity) {
          bySeverity[alert.severity as keyof typeof bySeverity]++;
        }
        
        // Count by source
        if (alert.source) {
          if (!bySource[alert.source]) {
            bySource[alert.source] = 0;
          }
          bySource[alert.source]++;
        }
        
        // Last 24 hours count
        if (alert.timestamp && new Date(alert.timestamp) >= last24Hours) {
          last24HoursCount++;
        }
      }
      
      return {
        totalAlerts: alerts.length,
        unreadAlerts: unreadCount,
        alertsLast24Hours: last24HoursCount,
        bySeverity,
        bySource
      };
    } catch (error) {
      console.error(`Failed to get alert statistics for client ${clientId}:`, error);
      return null;
    }
  }
  
  /**
   * Generate a test alert for demo purposes
   */
  async generateTestAlert(clientId: number, severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'): Promise<Alert | null> {
    const sources = ['Firewall', 'IDS', 'Endpoint', 'Network', 'Application', 'Database'];
    const sourceTypes = ['Detection', 'Prevention', 'Monitoring', 'Analysis'];
    
    const titles = {
      low: [
        'Unusual Login Attempt',
        'Configuration Change Detected',
        'New Device Connected',
        'Unusual Traffic Pattern'
      ],
      medium: [
        'Multiple Failed Login Attempts',
        'Suspicious File Download',
        'Unusual User Activity',
        'Port Scan Detected'
      ],
      high: [
        'Potential Data Exfiltration',
        'Unauthorized Access Attempt',
        'Malware Detected',
        'Critical Vulnerability Exploit Attempt'
      ],
      critical: [
        'Active Intrusion Detected',
        'Ransomware Activity',
        'Data Breach in Progress',
        'Critical System Compromise'
      ]
    };
    
    const messages = {
      low: [
        'A non-critical security event was detected that requires monitoring.',
        'A minor security policy violation was detected.',
        'An unusual but non-threatening activity was observed.'
      ],
      medium: [
        'A security event that requires attention was detected.',
        'A potential security threat was identified.',
        'Suspicious activity that requires investigation was observed.'
      ],
      high: [
        'A significant security threat was detected.',
        'A security breach attempt was identified.',
        'An active security incident requires immediate response.'
      ],
      critical: [
        'A critical security breach is in progress.',
        'An active attack has been detected in your environment.',
        'Immediate security response is required to prevent data loss.'
      ]
    };
    
    // Generate random alert data
    const randomSource = sources[Math.floor(Math.random() * sources.length)];
    const randomSourceType = sourceTypes[Math.floor(Math.random() * sourceTypes.length)];
    const randomTitles = titles[severity];
    const randomTitle = randomTitles[Math.floor(Math.random() * randomTitles.length)];
    const randomMessages = messages[severity];
    const randomMessage = randomMessages[Math.floor(Math.random() * randomMessages.length)];
    
    // Create metadata with demo information
    const metadata = {
      ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      username: ['admin', 'user', 'system', 'service_account'][Math.floor(Math.random() * 4)],
      timestamp: new Date().toISOString(),
      isTest: true
    };
    
    // Create the alert
    return await this.createAlert(clientId, {
      title: randomTitle,
      message: randomMessage,
      severity,
      source: randomSource,
      sourceType: randomSourceType,
      metadata
    });
  }
  
  /**
   * Mark all alerts as read for a client
   */
  async markAllAlertsAsRead(clientId: number): Promise<boolean> {
    try {
      // Get all unread alerts
      const alerts = await storage.getAlerts(clientId);
      const unreadAlerts = alerts.filter(alert => !alert.isRead);
      
      // Mark each alert as read
      for (const alert of unreadAlerts) {
        await this.markAlertAsRead(alert.id);
      }
      
      return true;
    } catch (error) {
      console.error(`Failed to mark all alerts as read for client ${clientId}:`, error);
      return false;
    }
  }
  
  /**
   * Get critical alerts for the past 24 hours
   */
  async getCriticalAlerts(clientId: number): Promise<Alert[]> {
    try {
      // Get all alerts
      const alerts = await storage.getAlerts(clientId);
      
      // Filter for critical severity and last 24 hours
      const last24Hours = new Date();
      last24Hours.setHours(last24Hours.getHours() - 24);
      
      return alerts.filter(alert => 
        alert.severity === 'critical' && 
        alert.timestamp && 
        new Date(alert.timestamp) >= last24Hours
      );
    } catch (error) {
      console.error(`Failed to get critical alerts for client ${clientId}:`, error);
      return [];
    }
  }
}

// Create a singleton instance
export const alertManagementSystem = new AlertManagementSystem();