import { WebClient, ChatPostMessageArguments, Block, KnownBlock } from '@slack/web-api';
import { log } from '../vite';

// Initialize Slack client with the bot token
const slackToken = process.env.SLACK_BOT_TOKEN;
const slackChannelId = process.env.SLACK_CHANNEL_ID;

let slackClient: WebClient | null = null;

// Initialize the Slack client if token is available
if (slackToken) {
  slackClient = new WebClient(slackToken);
  log('Slack client initialized', 'slack');
} else {
  log('Slack integration not configured. Missing SLACK_BOT_TOKEN', 'slack');
}

/**
 * Slack Service
 * 
 * Handles sending messages, alerts, and interactive components to Slack
 */
export class SlackService {
  /**
   * Send a simple text message to Slack
   */
  async sendMessage(message: string, channel?: string): Promise<void> {
    if (!slackClient) {
      throw new Error('Slack client is not initialized');
    }
    
    try {
      await slackClient.chat.postMessage({
        channel: channel || slackChannelId || '',
        text: message,
      });
    } catch (error) {
      log(`Error sending Slack message: ${error}`, 'slack');
      throw error;
    }
  }
  
  /**
   * Send a security alert to Slack with interactive buttons
   */
  async sendSecurityAlert(alertData: {
    title: string;
    description: string;
    severity: string;
    source: string;
    alertId: string;
    ipAddress?: string;
    timestamp: string;
    affectedSystem?: string;
  }): Promise<void> {
    if (!slackClient) {
      throw new Error('Slack client is not initialized');
    }
    
    try {
      // Create severity color based on alert level
      const severityColor = this.getSeverityColor(alertData.severity);
      
      // Create blocks for the message
      const blocks: (Block | KnownBlock)[] = [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `🚨 Security Alert: ${alertData.title}`,
            emoji: true
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: alertData.description
          }
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Severity:*\n${this.formatSeverity(alertData.severity)}`
            },
            {
              type: 'mrkdwn',
              text: `*Source:*\n${alertData.source}`
            },
            {
              type: 'mrkdwn',
              text: `*Time:*\n${new Date(alertData.timestamp).toLocaleString()}`
            },
            {
              type: 'mrkdwn',
              text: `*Alert ID:*\n${alertData.alertId}`
            }
          ]
        }
      ];
      
      // Add IP address if provided
      if (alertData.ipAddress) {
        blocks.push({
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*IP Address:* \`${alertData.ipAddress}\``
          }
        });
      }
      
      // Add affected system if provided
      if (alertData.affectedSystem) {
        blocks.push({
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Affected System:* ${alertData.affectedSystem}`
          }
        });
      }
      
      // Add action buttons
      blocks.push({
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'Acknowledge',
              emoji: true
            },
            style: 'primary',
            value: `acknowledge_${alertData.alertId}`,
            action_id: 'acknowledge_alert'
          },
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'Investigate',
              emoji: true
            },
            value: `investigate_${alertData.alertId}`,
            action_id: 'investigate_alert'
          },
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'View Details',
              emoji: true
            },
            value: `view_${alertData.alertId}`,
            action_id: 'view_alert_details'
          }
        ]
      });
      
      // Add divider
      blocks.push({ type: 'divider' });
      
      // Send the message
      await slackClient.chat.postMessage({
        channel: slackChannelId || '',
        blocks,
        text: `Security Alert: ${alertData.title}`, // Fallback text
        attachments: [
          {
            color: severityColor,
            fallback: `Security Alert: ${alertData.title}`
          }
        ]
      });
    } catch (error) {
      log(`Error sending Slack alert: ${error}`, 'slack');
      throw error;
    }
  }
  
  /**
   * Process an interactive response from Slack
   */
  async processInteractiveResponse(payload: any): Promise<void> {
    try {
      const action = payload.actions[0];
      const actionId = action.action_id;
      const value = action.value;
      const [actionType, alertId] = value.split('_');
      const user = payload.user.name;
      
      // Handle different action types
      switch (actionId) {
        case 'acknowledge_alert':
          await this.handleAlertAcknowledgement(alertId, user, payload.response_url);
          break;
        case 'investigate_alert':
          await this.handleAlertInvestigation(alertId, user, payload.response_url);
          break;
        case 'view_alert_details':
          await this.handleViewAlertDetails(alertId, payload.response_url);
          break;
        default:
          log(`Unknown action type: ${actionId}`, 'slack');
      }
    } catch (error) {
      log(`Error processing interactive response: ${error}`, 'slack');
      throw error;
    }
  }
  
  /**
   * Handle alert acknowledgement action
   */
  private async handleAlertAcknowledgement(alertId: string, user: string, responseUrl: string): Promise<void> {
    try {
      // In a real implementation, update the alert status in the database
      // For now, just update the message
      
      // Send confirmation to Slack
      await fetch(responseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          replace_original: false,
          text: `✅ Alert ${alertId} acknowledged by ${user}`
        })
      });
      
      // Log the acknowledgement
      log(`Alert ${alertId} acknowledged by ${user}`, 'slack');
    } catch (error) {
      log(`Error handling alert acknowledgement: ${error}`, 'slack');
      throw error;
    }
  }
  
  /**
   * Handle alert investigation action
   */
  private async handleAlertInvestigation(alertId: string, user: string, responseUrl: string): Promise<void> {
    try {
      // In a real implementation, update the alert status in the database
      // For now, just update the message
      
      // Send confirmation to Slack
      await fetch(responseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          replace_original: false,
          text: `🔍 Alert ${alertId} is being investigated by ${user}`
        })
      });
      
      // Log the investigation
      log(`Alert ${alertId} is being investigated by ${user}`, 'slack');
    } catch (error) {
      log(`Error handling alert investigation: ${error}`, 'slack');
      throw error;
    }
  }
  
  /**
   * Handle view alert details action
   */
  private async handleViewAlertDetails(alertId: string, responseUrl: string): Promise<void> {
    try {
      // In a real implementation, generate a deep link to the alert details
      const alertDetailsUrl = `https://sentinelai.example.com/alerts/${alertId}`;
      
      // Send the link to Slack
      await fetch(responseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          replace_original: false,
          text: `📋 Alert details: ${alertDetailsUrl}`
        })
      });
      
      // Log the view action
      log(`Alert ${alertId} details requested`, 'slack');
    } catch (error) {
      log(`Error handling view alert details: ${error}`, 'slack');
      throw error;
    }
  }
  
  /**
   * Get the severity color for Slack attachment
   */
  private getSeverityColor(severity: string): string {
    switch (severity.toLowerCase()) {
      case 'critical':
        return '#FF0000'; // Red
      case 'high':
        return '#FFA500'; // Orange
      case 'medium':
        return '#FFFF00'; // Yellow
      case 'low':
        return '#00FF00'; // Green
      default:
        return '#808080'; // Gray for unknown
    }
  }
  
  /**
   * Format severity with emoji
   */
  private formatSeverity(severity: string): string {
    switch (severity.toLowerCase()) {
      case 'critical':
        return '❗❗ Critical';
      case 'high':
        return '❗ High';
      case 'medium':
        return '⚠️ Medium';
      case 'low':
        return '✓ Low';
      default:
        return severity;
    }
  }
}

export const slackService = new SlackService();