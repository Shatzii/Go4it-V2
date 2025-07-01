import { storage } from "../storage";
import { webhookService } from "./webhookService";
import { slackService } from "./slackService";
import { notificationHub } from "./notificationHub";

interface AlertConfiguration {
  clientId: number;
  emailEnabled: boolean;
  webhookEnabled: boolean;
  slackEnabled: boolean;
  smsEnabled: boolean;
  severityThreshold: "low" | "medium" | "high" | "critical";
}

class AlertSystemService {
  private alertConfigurations: Map<number, AlertConfiguration> = new Map();

  async createAlert(clientId: number, alertData: {
    type: string;
    severity: "low" | "medium" | "high" | "critical";
    title: string;
    description: string;
  }): Promise<void> {
    try {
      // Create alert in database
      const alert = await storage.createAlert({
        clientId,
        ...alertData
      });

      // Legacy alert configuration (will be migrated to NotificationHub)
      const config = this.getAlertConfiguration(clientId);
      
      // Use the centralized notification hub to send the alert
      await notificationHub.sendNotification(clientId, {
        title: alertData.title,
        description: alertData.description,
        severity: alertData.severity,
        type: alertData.type,
        source: "alert_system"
      });

      console.log(`Alert created for client ${clientId}: ${alertData.title}`);
    } catch (error) {
      console.error("Error creating alert:", error);
    }
  }

  private getAlertConfiguration(clientId: number): AlertConfiguration {
    // Default configuration if not set
    if (!this.alertConfigurations.has(clientId)) {
      const defaultConfig: AlertConfiguration = {
        clientId,
        emailEnabled: true,
        webhookEnabled: true,
        slackEnabled: true,
        smsEnabled: false,
        severityThreshold: "medium"
      };
      this.alertConfigurations.set(clientId, defaultConfig);
    }
    
    return this.alertConfigurations.get(clientId)!;
  }

  private shouldSendAlert(alertSeverity: string, threshold: string): boolean {
    const severityLevels = ["low", "medium", "high", "critical"];
    const alertLevel = severityLevels.indexOf(alertSeverity);
    const thresholdLevel = severityLevels.indexOf(threshold);
    
    return alertLevel >= thresholdLevel;
  }

  private async sendNotifications(clientId: number, alert: any, config: AlertConfiguration): Promise<void> {
    const promises: Promise<void>[] = [];
    
    try {
      // Get client information for better notification context
      const client = await storage.getClient(clientId);
      const clientName = client?.name || `Client #${clientId}`;

      // Send Slack notification (if enabled)
      if (config.slackEnabled) {
        promises.push(this.sendSlackNotification(clientId, alert, clientName));
      }

      // Send webhook notification
      if (config.webhookEnabled) {
        promises.push(this.sendWebhookNotification(clientId, alert));
      }

      // Send email notification (simulated)
      if (config.emailEnabled) {
        promises.push(this.sendEmailNotification(clientId, alert));
      }

      // Send SMS notification (simulated) - only for high/critical alerts
      if (config.smsEnabled && (alert.severity === "high" || alert.severity === "critical")) {
        promises.push(this.sendSmsNotification(clientId, alert));
      }

      // Wait for all notifications to complete
      await Promise.allSettled(promises);
    } catch (error) {
      console.error("Error sending notifications:", error);
    }
  }
  
  private async sendSlackNotification(clientId: number, alert: any, clientName: string): Promise<void> {
    try {
      await slackService.sendSecurityAlert({
        title: alert.title,
        severity: alert.severity,
        description: alert.description,
        clientName: clientName,
        type: alert.type,
        timestamp: alert.createdAt || new Date()
      });
      
      // Log Slack sending for tracking
      await storage.createLog({
        clientId,
        level: "info",
        source: "alert_system",
        message: `Slack alert sent: ${alert.title}`,
        metadata: {
          alertId: alert.id,
          severity: alert.severity
        }
      });
    } catch (error) {
      console.error("Error sending Slack notification:", error);
    }
  }

  private async sendWebhookNotification(clientId: number, alert: any): Promise<void> {
    try {
      await webhookService.sendAlert(clientId, {
        alertId: alert.id,
        type: alert.type,
        severity: alert.severity,
        title: alert.title,
        description: alert.description,
        timestamp: alert.createdAt,
        clientId: clientId
      });
    } catch (error) {
      console.error("Error sending webhook notification:", error);
    }
  }

  private async sendEmailNotification(clientId: number, alert: any): Promise<void> {
    try {
      // Simulate email sending
      console.log(`📧 Email alert sent for client ${clientId}: ${alert.title}`);
      
      // In a real implementation, you would use a service like SendGrid, AWS SES, or Nodemailer
      const emailData = {
        to: await this.getClientEmailAddresses(clientId),
        subject: `🚨 Security Alert: ${alert.title}`,
        html: this.generateEmailTemplate(alert),
        priority: alert.severity === "critical" ? "high" : "normal"
      };

      // Log email sending for simulation
      await storage.createLog({
        clientId,
        level: "info",
        source: "alert_system",
        message: `Email alert sent: ${alert.title}`,
        metadata: {
          alertId: alert.id,
          emailData: emailData
        }
      });
    } catch (error) {
      console.error("Error sending email notification:", error);
    }
  }

  private async sendSmsNotification(clientId: number, alert: any): Promise<void> {
    try {
      // Simulate SMS sending
      console.log(`📱 SMS alert sent for client ${clientId}: ${alert.title}`);
      
      const smsMessage = `🚨 SECURITY ALERT: ${alert.title}. Severity: ${alert.severity.toUpperCase()}. Check your dashboard immediately.`;
      
      // Log SMS sending for simulation
      await storage.createLog({
        clientId,
        level: "info",
        source: "alert_system",
        message: `SMS alert sent: ${alert.title}`,
        metadata: {
          alertId: alert.id,
          message: smsMessage
        }
      });
    } catch (error) {
      console.error("Error sending SMS notification:", error);
    }
  }

  private async broadcastAlert(clientId: number, alert: any): Promise<void> {
    try {
      const wsServer = (global as any).wsServer;
      if (!wsServer) return;

      const alertMessage = JSON.stringify({
        type: "new_alert",
        data: alert,
        clientId: clientId
      });

      // Broadcast to all connected clients
      wsServer.clients.forEach((client: any) => {
        if (client.readyState === 1) { // WebSocket.OPEN
          client.send(alertMessage);
        }
      });
    } catch (error) {
      console.error("Error broadcasting alert:", error);
    }
  }

  private async getClientEmailAddresses(clientId: number): Promise<string[]> {
    try {
      const users = await storage.getUsersByClient(clientId);
      return users.map(user => user.email).filter(Boolean);
    } catch (error) {
      console.error("Error getting client email addresses:", error);
      return [];
    }
  }

  private generateEmailTemplate(alert: any): string {
    const severityColors = {
      low: "#3B82F6",      // Blue
      medium: "#F59E0B",   // Amber
      high: "#EF4444",     // Red
      critical: "#DC2626"  // Dark Red
    };

    const severityColor = severityColors[alert.severity as keyof typeof severityColors] || "#6B7280";

    return `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <title>Security Alert</title>
          <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #0D1B2A; color: white; padding: 20px; text-align: center; }
              .alert-badge { 
                  display: inline-block; 
                  padding: 5px 15px; 
                  background: ${severityColor}; 
                  color: white; 
                  border-radius: 20px; 
                  font-weight: bold;
                  text-transform: uppercase;
              }
              .content { background: #f8f9fa; padding: 20px; margin: 20px 0; }
              .footer { text-align: center; color: #666; font-size: 12px; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>🛡️ Sentinel AI Security Alert</h1>
              </div>
              
              <div class="content">
                  <h2>${alert.title}</h2>
                  <p><span class="alert-badge">${alert.severity}</span></p>
                  <p><strong>Description:</strong> ${alert.description}</p>
                  <p><strong>Type:</strong> ${alert.type}</p>
                  <p><strong>Time:</strong> ${new Date(alert.createdAt).toLocaleString()}</p>
                  
                  <hr>
                  
                  <p><strong>Recommended Actions:</strong></p>
                  <ul>
                      <li>Log into your Sentinel AI dashboard immediately</li>
                      <li>Review the full alert details and context</li>
                      <li>Take appropriate remediation steps</li>
                      <li>Contact your security team if needed</li>
                  </ul>
              </div>
              
              <div class="footer">
                  <p>This is an automated security alert from Sentinel AI Cybersecurity Platform</p>
                  <p>Please do not reply to this email</p>
              </div>
          </div>
      </body>
      </html>
    `;
  }

  async configurateAlerts(clientId: number, config: Partial<AlertConfiguration>): Promise<void> {
    const existingConfig = this.getAlertConfiguration(clientId);
    const newConfig = { ...existingConfig, ...config };
    this.alertConfigurations.set(clientId, newConfig);
  }

  async getAlertStatistics(clientId: number): Promise<any> {
    const alerts = await storage.getAlerts(clientId, 1000);
    
    const stats = {
      total: alerts.length,
      unread: alerts.filter(a => !a.isRead).length,
      bySeverity: alerts.reduce((acc, alert) => {
        acc[alert.severity] = (acc[alert.severity] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      byType: alerts.reduce((acc, alert) => {
        acc[alert.type] = (acc[alert.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      recentActivity: this.getHourlyAlertActivity(alerts)
    };

    return stats;
  }

  private getHourlyAlertActivity(alerts: any[]): number[] {
    const hourlyData = new Array(24).fill(0);
    
    alerts.forEach(alert => {
      const hour = new Date(alert.createdAt).getHours();
      hourlyData[hour]++;
    });

    return hourlyData;
  }

  async markAllAlertsAsRead(clientId: number): Promise<void> {
    const alerts = await storage.getAlerts(clientId);
    const unreadAlerts = alerts.filter(alert => !alert.isRead);
    
    for (const alert of unreadAlerts) {
      await storage.markAlertAsRead(alert.id);
    }
  }

  async getRecentCriticalAlerts(clientId: number): Promise<any[]> {
    const alerts = await storage.getAlerts(clientId, 50);
    return alerts.filter(alert => 
      alert.severity === "critical" && 
      new Date().getTime() - new Date(alert.createdAt!).getTime() < 24 * 60 * 60 * 1000
    );
  }
}

export const alertSystemService = new AlertSystemService();
