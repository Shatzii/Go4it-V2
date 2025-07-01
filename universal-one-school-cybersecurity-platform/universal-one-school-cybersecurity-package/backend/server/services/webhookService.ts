interface WebhookConfiguration {
  clientId: number;
  slackWebhookUrl?: string;
  discordWebhookUrl?: string;
  pagerdutyApiKey?: string;
  customWebhookUrl?: string;
  enabled: boolean;
}

interface AlertPayload {
  alertId: number;
  type: string;
  severity: string;
  title: string;
  description: string;
  timestamp: string;
  clientId: number;
}

class WebhookService {
  private configurations: Map<number, WebhookConfiguration> = new Map();

  async sendAlert(clientId: number, alert: AlertPayload): Promise<void> {
    const config = this.getConfiguration(clientId);
    
    if (!config.enabled) {
      return;
    }

    const promises: Promise<void>[] = [];

    // Send to Slack
    if (config.slackWebhookUrl) {
      promises.push(this.sendSlackAlert(config.slackWebhookUrl, alert));
    }

    // Send to Discord
    if (config.discordWebhookUrl) {
      promises.push(this.sendDiscordAlert(config.discordWebhookUrl, alert));
    }

    // Send to PagerDuty
    if (config.pagerdutyApiKey) {
      promises.push(this.sendPagerDutyAlert(config.pagerdutyApiKey, alert));
    }

    // Send to custom webhook
    if (config.customWebhookUrl) {
      promises.push(this.sendCustomWebhook(config.customWebhookUrl, alert));
    }

    // Wait for all webhooks to complete
    await Promise.allSettled(promises);
  }

  private async sendSlackAlert(webhookUrl: string, alert: AlertPayload): Promise<void> {
    try {
      const severityColors = {
        low: "#3B82F6",
        medium: "#F59E0B", 
        high: "#EF4444",
        critical: "#DC2626"
      };

      const color = severityColors[alert.severity as keyof typeof severityColors] || "#6B7280";
      
      const slackPayload = {
        text: `🚨 Security Alert: ${alert.title}`,
        attachments: [
          {
            color: color,
            fields: [
              {
                title: "Severity",
                value: alert.severity.toUpperCase(),
                short: true
              },
              {
                title: "Type",
                value: alert.type,
                short: true
              },
              {
                title: "Description",
                value: alert.description,
                short: false
              },
              {
                title: "Time",
                value: new Date(alert.timestamp).toLocaleString(),
                short: true
              }
            ],
            footer: "Sentinel AI Cybersecurity Platform",
            ts: Math.floor(new Date(alert.timestamp).getTime() / 1000)
          }
        ]
      };

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(slackPayload)
      });

      if (!response.ok) {
        throw new Error(`Slack webhook failed: ${response.status}`);
      }

      console.log(`✅ Slack alert sent for client ${alert.clientId}`);
    } catch (error) {
      console.error("Error sending Slack alert:", error);
    }
  }

  private async sendDiscordAlert(webhookUrl: string, alert: AlertPayload): Promise<void> {
    try {
      const severityEmojis = {
        low: "🟦",
        medium: "🟨",
        high: "🟥",
        critical: "🚨"
      };

      const emoji = severityEmojis[alert.severity as keyof typeof severityEmojis] || "⚪";
      
      const discordPayload = {
        content: `${emoji} **Security Alert: ${alert.title}**`,
        embeds: [
          {
            title: alert.title,
            description: alert.description,
            color: this.getSeverityColor(alert.severity),
            fields: [
              {
                name: "Severity",
                value: alert.severity.toUpperCase(),
                inline: true
              },
              {
                name: "Type",
                value: alert.type,
                inline: true
              },
              {
                name: "Client ID",
                value: alert.clientId.toString(),
                inline: true
              }
            ],
            timestamp: alert.timestamp,
            footer: {
              text: "Sentinel AI Cybersecurity Platform"
            }
          }
        ]
      };

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(discordPayload)
      });

      if (!response.ok) {
        throw new Error(`Discord webhook failed: ${response.status}`);
      }

      console.log(`✅ Discord alert sent for client ${alert.clientId}`);
    } catch (error) {
      console.error("Error sending Discord alert:", error);
    }
  }

  private async sendPagerDutyAlert(apiKey: string, alert: AlertPayload): Promise<void> {
    try {
      // Only send critical and high severity alerts to PagerDuty
      if (alert.severity !== "critical" && alert.severity !== "high") {
        return;
      }

      const pagerDutyPayload = {
        routing_key: apiKey,
        event_action: "trigger",
        dedup_key: `sentinel-ai-${alert.alertId}`,
        payload: {
          summary: alert.title,
          source: "Sentinel AI",
          severity: alert.severity,
          component: "cybersecurity-platform",
          group: `client-${alert.clientId}`,
          class: alert.type,
          custom_details: {
            description: alert.description,
            alert_id: alert.alertId,
            client_id: alert.clientId,
            timestamp: alert.timestamp
          }
        }
      };

      const response = await fetch("https://events.pagerduty.com/v2/enqueue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(pagerDutyPayload)
      });

      if (!response.ok) {
        throw new Error(`PagerDuty webhook failed: ${response.status}`);
      }

      console.log(`✅ PagerDuty alert sent for client ${alert.clientId}`);
    } catch (error) {
      console.error("Error sending PagerDuty alert:", error);
    }
  }

  private async sendCustomWebhook(webhookUrl: string, alert: AlertPayload): Promise<void> {
    try {
      const payload = {
        event_type: "security_alert",
        alert: alert,
        platform: "sentinel-ai",
        version: "1.0"
      };

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Sentinel-AI-Webhooks/1.0"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Custom webhook failed: ${response.status}`);
      }

      console.log(`✅ Custom webhook sent for client ${alert.clientId}`);
    } catch (error) {
      console.error("Error sending custom webhook:", error);
    }
  }

  private getSeverityColor(severity: string): number {
    const colors = {
      low: 0x3B82F6,      // Blue
      medium: 0xF59E0B,   // Amber
      high: 0xEF4444,     // Red
      critical: 0xDC2626  // Dark Red
    };
    
    return colors[severity as keyof typeof colors] || 0x6B7280;
  }

  private getConfiguration(clientId: number): WebhookConfiguration {
    if (!this.configurations.has(clientId)) {
      // Set default configuration
      this.configurations.set(clientId, {
        clientId,
        enabled: true,
        // In a real implementation, these would be loaded from database or environment variables
        slackWebhookUrl: process.env.SLACK_WEBHOOK_URL,
        discordWebhookUrl: process.env.DISCORD_WEBHOOK_URL,
        pagerdutyApiKey: process.env.PAGERDUTY_API_KEY,
        customWebhookUrl: process.env.CUSTOM_WEBHOOK_URL
      });
    }
    
    return this.configurations.get(clientId)!;
  }

  async updateConfiguration(clientId: number, config: Partial<WebhookConfiguration>): Promise<void> {
    const existingConfig = this.getConfiguration(clientId);
    const newConfig = { ...existingConfig, ...config };
    this.configurations.set(clientId, newConfig);
  }

  async testWebhook(clientId: number, webhookType: string): Promise<boolean> {
    try {
      const testAlert: AlertPayload = {
        alertId: 0,
        type: "test",
        severity: "medium",
        title: "Webhook Test Alert",
        description: "This is a test alert to verify webhook configuration",
        timestamp: new Date().toISOString(),
        clientId: clientId
      };

      const config = this.getConfiguration(clientId);

      switch (webhookType) {
        case "slack":
          if (config.slackWebhookUrl) {
            await this.sendSlackAlert(config.slackWebhookUrl, testAlert);
            return true;
          }
          break;
        case "discord":
          if (config.discordWebhookUrl) {
            await this.sendDiscordAlert(config.discordWebhookUrl, testAlert);
            return true;
          }
          break;
        case "pagerduty":
          if (config.pagerdutyApiKey) {
            await this.sendPagerDutyAlert(config.pagerdutyApiKey, testAlert);
            return true;
          }
          break;
        case "custom":
          if (config.customWebhookUrl) {
            await this.sendCustomWebhook(config.customWebhookUrl, testAlert);
            return true;
          }
          break;
      }

      return false;
    } catch (error) {
      console.error(`Error testing ${webhookType} webhook:`, error);
      return false;
    }
  }

  async getWebhookStatus(clientId: number): Promise<any> {
    const config = this.getConfiguration(clientId);
    
    return {
      enabled: config.enabled,
      integrations: {
        slack: !!config.slackWebhookUrl,
        discord: !!config.discordWebhookUrl,
        pagerduty: !!config.pagerdutyApiKey,
        custom: !!config.customWebhookUrl
      }
    };
  }
}

export const webhookService = new WebhookService();
