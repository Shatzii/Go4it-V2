// Open Source SMS Automation System
// Replaces Twilio with multiple SMS provider options and custom logic

import { db } from '@/server/db';
import { prospects } from '@/shared/schema';
import { eq, sql } from 'drizzle-orm';

interface SMSConfig {
  provider: 'twilio' | 'textbelt' | 'clicksend' | 'vonage' | 'free';
  apiKey?: string;
  apiSecret?: string;
  fromNumber?: string;
  webhookUrl?: string;
}

interface SMSResult {
  messageId: string;
  status: 'sent' | 'failed' | 'pending';
  cost?: number;
  error?: string;
}

export class OpenSourceSMSSystem {
  private config: SMSConfig;
  private baseUrl: string;

  constructor(config?: SMSConfig) {
    this.config = config || {
      provider: 'free', // Start with free option
      fromNumber: '+1234567890',
    };
    this.baseUrl = process.env.BASE_URL || 'http://localhost:5000';
  }

  // Send SMS via multiple providers (fallback system)
  async sendSMS(
    phoneNumber: string,
    message: string,
    prospectId?: string,
    campaignId?: string,
  ): Promise<SMSResult> {
    // Clean phone number
    const cleanNumber = this.cleanPhoneNumber(phoneNumber);

    try {
      switch (this.config.provider) {
        case 'textbelt':
          return await this.sendViaTextBelt(cleanNumber, message);
        case 'clicksend':
          return await this.sendViaClickSend(cleanNumber, message);
        case 'vonage':
          return await this.sendViaVonage(cleanNumber, message);
        case 'free':
          return await this.sendViaFreeService(cleanNumber, message);
        default:
          return await this.sendViaFallback(cleanNumber, message);
      }
    } catch (error) {
      console.error('SMS sending failed:', error);
      return {
        messageId: '',
        status: 'failed',
        error: error.message,
      };
    }
  }

  // TextBelt API (very affordable - $0.02/text)
  private async sendViaTextBelt(phoneNumber: string, message: string): Promise<SMSResult> {
    const response = await fetch('https://textbelt.com/text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: phoneNumber,
        message: message,
        key: this.config.apiKey || 'textbelt', // 'textbelt' for testing, real key for production
      }),
    });

    const result = await response.json();

    return {
      messageId: result.textId || Math.random().toString(36),
      status: result.success ? 'sent' : 'failed',
      cost: 0.02,
      error: result.error,
    };
  }

  // ClickSend API
  private async sendViaClickSend(phoneNumber: string, message: string): Promise<SMSResult> {
    const auth = Buffer.from(`${this.config.apiKey}:${this.config.apiSecret}`).toString('base64');

    const response = await fetch('https://rest.clicksend.com/v3/sms/send', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            from: this.config.fromNumber,
            to: phoneNumber,
            body: message,
          },
        ],
      }),
    });

    const result = await response.json();

    return {
      messageId: result.data?.messages?.[0]?.message_id || Math.random().toString(36),
      status: result.response_code === 'SUCCESS' ? 'sent' : 'failed',
      cost: result.data?.messages?.[0]?.message_price || 0.03,
    };
  }

  // Vonage (formerly Nexmo) API
  private async sendViaVonage(phoneNumber: string, message: string): Promise<SMSResult> {
    const response = await fetch('https://rest.nexmo.com/sms/json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        api_key: this.config.apiKey!,
        api_secret: this.config.apiSecret!,
        from: this.config.fromNumber!,
        to: phoneNumber,
        text: message,
      }),
    });

    const result = await response.json();

    return {
      messageId: result.messages?.[0]?.['message-id'] || Math.random().toString(36),
      status: result.messages?.[0]?.status === '0' ? 'sent' : 'failed',
      cost: parseFloat(result.messages?.[0]?.['message-price'] || '0.04'),
    };
  }

  // Free SMS service (limited but good for testing)
  private async sendViaFreeService(phoneNumber: string, message: string): Promise<SMSResult> {
    // Simulate SMS sending for development/testing
    console.log(`📱 SMS to ${phoneNumber}: ${message}`);

    // In a real implementation, you could use services like:
    // - FreeSMS APIs (limited daily quota)
    // - Email-to-SMS gateways
    // - Integration with carrier APIs

    return {
      messageId: `free_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'sent',
      cost: 0,
    };
  }

  // Fallback with multiple providers
  private async sendViaFallback(phoneNumber: string, message: string): Promise<SMSResult> {
    const providers = [
      () => this.sendViaTextBelt(phoneNumber, message),
      () => this.sendViaClickSend(phoneNumber, message),
      () => this.sendViaVonage(phoneNumber, message),
    ];

    for (const provider of providers) {
      try {
        const result = await provider();
        if (result.status === 'sent') {
          return result;
        }
      } catch (error) {
        continue; // Try next provider
      }
    }

    // All providers failed
    return {
      messageId: '',
      status: 'failed',
      error: 'All SMS providers failed',
    };
  }

  // Clean and validate phone numbers
  private cleanPhoneNumber(phoneNumber: string): string {
    // Remove all non-digits
    let cleaned = phoneNumber.replace(/\D/g, '');

    // Add country code if missing (assume US +1)
    if (cleaned.length === 10) {
      cleaned = '1' + cleaned;
    }

    return '+' + cleaned;
  }

  // Personalize SMS content
  private personalizeSMS(message: string, prospect: any): string {
    const replacements = {
      '{name}': prospect.name?.split(' ')[0] || 'Athlete', // First name only for SMS
      '{sport}': prospect.sport || 'your sport',
      '{position}': prospect.position || 'athlete',
      '{school}': prospect.school || 'your school',
    };

    let personalizedMessage = message;
    Object.entries(replacements).forEach(([placeholder, value]) => {
      personalizedMessage = personalizedMessage.replace(new RegExp(placeholder, 'g'), value);
    });

    return personalizedMessage;
  }

  // Send bulk SMS with rate limiting
  async sendBulkSMS(
    prospects: any[],
    messageTemplate: string,
    campaignId: string,
    options: {
      rateLimit: number; // SMS per minute
      batchSize: number;
    } = { rateLimit: 30, batchSize: 5 },
  ): Promise<{ sent: number; failed: number; totalCost: number }> {
    let sent = 0;
    let failed = 0;
    let totalCost = 0;

    const delayMs = (60 * 1000) / options.rateLimit;

    for (let i = 0; i < prospects.length; i += options.batchSize) {
      const batch = prospects.slice(i, i + options.batchSize);

      const batchPromises = batch.map(async (prospect) => {
        if (!prospect.phoneNumber) return null;

        const personalizedMessage = this.personalizeSMS(messageTemplate, prospect);
        const result = await this.sendSMS(
          prospect.phoneNumber,
          personalizedMessage,
          prospect.id,
          campaignId,
        );

        // Update prospect record
        await db
          .update(prospects)
          .set({
            campaignId,
            contactAttempts: sql`${prospects.contactAttempts} + 1`,
            lastContactDate: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(prospects.id, prospect.id));

        if (result.status === 'sent') {
          sent++;
        } else {
          failed++;
        }

        totalCost += result.cost || 0;
        return result;
      });

      await Promise.all(batchPromises);

      // Rate limiting delay
      if (i + options.batchSize < prospects.length) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * options.batchSize));
      }
    }

    return { sent, failed, totalCost };
  }

  // SMS Templates for athlete recruitment
  static getRecruitmentSMSTemplates() {
    return {
      garIntroduction: {
        message: `Hey {name}! 🏀 Saw your {sport} highlights. Want a FREE AI analysis of your game? Could help with recruiting: go4it.co/gar Reply STOP to opt out`,
        cost: 0.02,
      },

      followUp: {
        message: `{name}, still interested in that free GAR score? Takes 2 min, could change your recruiting game. Many {position}s see big improvements: go4it.co/gar`,
        cost: 0.02,
      },

      urgentOpportunity: {
        message: `{name}! College coaches in {state} are actively looking for {position}s. Your GAR score could get you noticed. Free analysis: go4it.co/gar`,
        cost: 0.02,
      },

      socialProof: {
        message: `{name}, 500+ athletes used GAR to improve their game this month. Want to join them? Free for {school} athletes: go4it.co/gar`,
        cost: 0.02,
      },
    };
  }

  // Get SMS provider costs and limits
  static getProviderInfo() {
    return {
      textbelt: {
        cost: 0.02,
        dailyLimit: 1000,
        features: ['Simple API', 'No setup required', 'Pay per message'],
      },
      clicksend: {
        cost: 0.03,
        dailyLimit: 10000,
        features: ['Professional dashboard', 'Delivery reports', 'Global coverage'],
      },
      vonage: {
        cost: 0.04,
        dailyLimit: 50000,
        features: ['Enterprise grade', 'Two-way messaging', 'Analytics'],
      },
      free: {
        cost: 0,
        dailyLimit: 50,
        features: ['Testing only', 'No real delivery', 'Development mode'],
      },
    };
  }
}
