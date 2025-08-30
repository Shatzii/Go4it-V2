import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { Client as DiscordClient, GatewayIntentBits } from 'discord.js';
import { Client as WhatsAppClient } from 'whatsapp-web.js';

// Message types for different platforms
export type MessagePlatform = 'sms' | 'discord' | 'whatsapp' | 'email';

export interface MessageOptions {
  to: string;
  message: string;
  platform?: MessagePlatform[];
  priority?: 'low' | 'normal' | 'high' | 'emergency';
  mediaUrl?: string;
  title?: string;
}

class MessagingService {
  private snsClient: SNSClient | null = null;
  private discordClient: DiscordClient | null = null;
  private whatsappClient: WhatsAppClient | null = null;
  private initialized = false;

  constructor() {
    this.initializeClients();
  }

  private async initializeClients() {
    try {
      // Initialize AWS SNS (for SMS)
      if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
        this.snsClient = new SNSClient({
          region: process.env.AWS_REGION || 'us-east-1',
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          },
        });
      }

      // Initialize Discord Bot (for team communication)
      if (process.env.DISCORD_BOT_TOKEN) {
        this.discordClient = new DiscordClient({
          intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
        });
        await this.discordClient.login(process.env.DISCORD_BOT_TOKEN);
      }

      // Initialize WhatsApp (for direct messaging)
      if (process.env.WHATSAPP_ENABLED === 'true') {
        this.whatsappClient = new WhatsAppClient({});
        // Note: WhatsApp requires QR code scan for first-time setup
      }

      this.initialized = true;
    } catch (error) {
      console.warn('Some messaging services failed to initialize:', error);
      // Continue without throwing - fallback to available services
    }
  }

  async sendMessage(options: MessageOptions): Promise<{
    success: boolean;
    results: Record<MessagePlatform, boolean>;
    errors?: string[];
  }> {
    const { to, message, platform = ['sms'], priority = 'normal', mediaUrl, title } = options;
    const results: Record<MessagePlatform, boolean> = {};
    const errors: string[] = [];

    // Send via SMS (AWS SNS)
    if (platform.includes('sms') && this.snsClient) {
      try {
        const command = new PublishCommand({
          PhoneNumber: to,
          Message: message,
        });
        await this.snsClient.send(command);
        results.sms = true;
      } catch (error) {
        results.sms = false;
        errors.push(`SMS failed: ${error}`);
      }
    }

    // Send via Discord
    if (platform.includes('discord') && this.discordClient) {
      try {
        const channel = await this.discordClient.channels.fetch(to);
        if (channel?.isTextBased()) {
          await channel.send({
            content: title ? `**${title}**\n${message}` : message,
            files: mediaUrl ? [mediaUrl] : undefined,
          });
          results.discord = true;
        }
      } catch (error) {
        results.discord = false;
        errors.push(`Discord failed: ${error}`);
      }
    }

    // Send via WhatsApp
    if (platform.includes('whatsapp') && this.whatsappClient) {
      try {
        await this.whatsappClient.sendMessage(to, message);
        results.whatsapp = true;
      } catch (error) {
        results.whatsapp = false;
        errors.push(`WhatsApp failed: ${error}`);
      }
    }

    // Email fallback
    if (platform.includes('email')) {
      try {
        // Use existing email service if available
        const emailSent = await this.sendEmailFallback(to, title || 'Notification', message);
        results.email = emailSent;
      } catch (error) {
        results.email = false;
        errors.push(`Email failed: ${error}`);
      }
    }

    const success = Object.values(results).some(result => result === true);
    
    return {
      success,
      results,
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  private async sendEmailFallback(to: string, subject: string, message: string): Promise<boolean> {
    // Implementation depends on your existing email service
    // This is a placeholder - replace with your actual email service
    console.log(`Email fallback: ${to} - ${subject}: ${message}`);
    return true;
  }

  // Convenience methods for common use cases
  async sendSMS(to: string, message: string): Promise<boolean> {
    const result = await this.sendMessage({ to, message, platform: ['sms'] });
    return result.success;
  }

  async sendDiscordNotification(channelId: string, message: string, title?: string): Promise<boolean> {
    const result = await this.sendMessage({ 
      to: channelId, 
      message, 
      title,
      platform: ['discord'] 
    });
    return result.success;
  }

  async sendWhatsAppMessage(to: string, message: string): Promise<boolean> {
    const result = await this.sendMessage({ to, message, platform: ['whatsapp'] });
    return result.success;
  }

  // Multi-platform broadcast for important announcements
  async broadcast(options: Omit<MessageOptions, 'to'> & { 
    recipients: { platform: MessagePlatform; address: string }[] 
  }): Promise<{ successCount: number; totalCount: number; errors: string[] }> {
    const { recipients, ...messageOptions } = options;
    let successCount = 0;
    const errors: string[] = [];

    for (const recipient of recipients) {
      try {
        const result = await this.sendMessage({
          ...messageOptions,
          to: recipient.address,
          platform: [recipient.platform],
        });
        if (result.success) successCount++;
        if (result.errors) errors.push(...result.errors);
      } catch (error) {
        errors.push(`Failed to send to ${recipient.address}: ${error}`);
      }
    }

    return {
      successCount,
      totalCount: recipients.length,
      errors,
    };
  }

  // Check which services are available
  getAvailableServices(): MessagePlatform[] {
    const available: MessagePlatform[] = [];
    if (this.snsClient) available.push('sms');
    if (this.discordClient) available.push('discord');
    if (this.whatsappClient) available.push('whatsapp');
    available.push('email'); // Always available as fallback
    return available;
  }
}

// Export singleton instance
export const messagingService = new MessagingService();

// Backward compatibility with existing Twilio code
export const sendSMS = (to: string, message: string) => 
  messagingService.sendSMS(to, message);

export default messagingService;