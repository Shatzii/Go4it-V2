import twilio from 'twilio';

interface SMSOptions {
  to: string;
  body: string;
  from?: string;
}

class SMSService {
  private client: any = null;
  private defaultPhoneNumber: string | null = null;
  private isConfigured: boolean = false;

  constructor() {
    this.initializeClient();
  }

  private initializeClient(): void {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const phoneNumber = process.env.TWILIO_PHONE_NUMBER;

    if (accountSid && authToken) {
      this.client = twilio(accountSid, authToken);
      this.defaultPhoneNumber = phoneNumber || null;
      this.isConfigured = true;
      console.log('SMS service initialized successfully');
    } else {
      console.warn('SMS service not configured. Missing Twilio credentials.');
      this.isConfigured = false;
    }
  }

  /**
   * Send an SMS message
   * @param options SMS message options
   * @returns Promise resolving to success status and message data or error
   */
  async sendMessage(options: SMSOptions): Promise<{ success: boolean; data?: any; error?: string }> {
    if (!this.isConfigured || !this.client) {
      return {
        success: false,
        error: 'SMS service not configured. Missing Twilio credentials.'
      };
    }

    if (!options.to) {
      return {
        success: false,
        error: 'Recipient phone number is required'
      };
    }

    if (!options.body) {
      return {
        success: false,
        error: 'Message body is required'
      };
    }

    try {
      // Format the phone number if it doesn't start with +
      const to = options.to.startsWith('+') ? options.to : `+${options.to}`;
      const from = options.from || this.defaultPhoneNumber;
      
      if (!from) {
        return {
          success: false,
          error: 'Sender phone number is required. Either provide it in options or set TWILIO_PHONE_NUMBER environment variable.'
        };
      }

      const message = await this.client.messages.create({
        body: options.body,
        from,
        to
      });

      return {
        success: true,
        data: {
          sid: message.sid,
          status: message.status,
          to: message.to
        }
      };
    } catch (error) {
      console.error('Error sending SMS:', error);
      return {
        success: false,
        error: error.message || 'Failed to send SMS'
      };
    }
  }

  /**
   * Check if the SMS service is properly configured
   * @returns boolean indicating if the service is ready to use
   */
  isReady(): boolean {
    return this.isConfigured && this.client !== null;
  }

  /**
   * Reinitialize the SMS client (useful if environment variables were updated)
   */
  reinitialize(): void {
    this.initializeClient();
  }
}

// Create a singleton instance
const smsService = new SMSService();

export default smsService;