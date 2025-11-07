/**
 * Phone.com VoIP Integration
 * Account: Alonzo Barrett (a.barrett@go4itsports.org)
 * Phone: (303) 970-4655
 */

export const PHONE_COM_CONFIG = {
  // Account Information
  email: 'a.barrett@go4itsports.org',
  voipId: '3454731',
  accountId: '3845638',
  expressServiceCode: '70476520',
  phoneNumber: '+13039704655',
  displayNumber: '(303) 970-4655',
  
  // API Configuration (v4.7.0)
  apiBaseUrl: 'https://api.phone.com/v4',
  apiVersion: '4.7.0',
  
  // Get API token from environment
  get apiToken() {
    return process.env.PHONE_COM_API_TOKEN;
  },
  
  // Feature flags
  features: {
    voicemail: true,
    sms: true,
    callForwarding: true,
    callRecording: true,
    conferencing: true,
  },
};

/**
 * Phone.com API Client
 */
export class PhoneComClient {
  private baseUrl: string;
  private token: string;

  constructor(token?: string) {
    this.baseUrl = PHONE_COM_CONFIG.apiBaseUrl;
    this.token = token || PHONE_COM_CONFIG.apiToken || '';
    
    if (!this.token) {
      console.warn('[Phone.com] API token not configured. Set PHONE_COM_API_TOKEN environment variable.');
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    if (!this.token) {
      throw new Error('Phone.com API token not configured');
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': `Go4It-Platform/${PHONE_COM_CONFIG.apiVersion}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Phone.com API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get account information
   */
  async getAccount() {
    return this.request(`/accounts/${PHONE_COM_CONFIG.accountId}`);
  }

  /**
   * List phone numbers
   */
  async listPhoneNumbers() {
    return this.request(`/accounts/${PHONE_COM_CONFIG.accountId}/phone-numbers`);
  }

  /**
   * Get call history
   */
  async getCallHistory(params?: {
    startDate?: string;
    endDate?: string;
    limit?: number;
  }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request(`/accounts/${PHONE_COM_CONFIG.accountId}/calls?${query}`);
  }

  /**
   * Send SMS
   */
  async sendSMS(to: string, message: string) {
    return this.request(`/accounts/${PHONE_COM_CONFIG.accountId}/sms`, {
      method: 'POST',
      body: JSON.stringify({
        from: PHONE_COM_CONFIG.phoneNumber,
        to,
        message,
      }),
    });
  }

  /**
   * Get voicemail list
   */
  async getVoicemails() {
    return this.request(`/accounts/${PHONE_COM_CONFIG.accountId}/voicemails`);
  }

  /**
   * Make a call
   */
  async makeCall(to: string, from?: string) {
    return this.request(`/accounts/${PHONE_COM_CONFIG.accountId}/calls`, {
      method: 'POST',
      body: JSON.stringify({
        from: from || PHONE_COM_CONFIG.phoneNumber,
        to,
      }),
    });
  }

  /**
   * Get call recording
   */
  async getCallRecording(callId: string) {
    return this.request(`/accounts/${PHONE_COM_CONFIG.accountId}/calls/${callId}/recording`);
  }

  /**
   * Get SMS messages
   */
  async getSMSMessages(params?: {
    startDate?: string;
    endDate?: string;
    limit?: number;
  }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request(`/accounts/${PHONE_COM_CONFIG.accountId}/sms?${query}`);
  }

  /**
   * Set call forwarding
   */
  async setCallForwarding(extensionId: string, forwardTo: string, enabled: boolean) {
    return this.request(`/accounts/${PHONE_COM_CONFIG.accountId}/extensions/${extensionId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        call_forwarding: {
          enabled,
          forward_to: forwardTo,
        },
      }),
    });
  }

  /**
   * Get extensions
   */
  async getExtensions() {
    return this.request(`/accounts/${PHONE_COM_CONFIG.accountId}/extensions`);
  }

  /**
   * Get queues (call center queues)
   */
  async getQueues() {
    return this.request(`/accounts/${PHONE_COM_CONFIG.accountId}/queues`);
  }

  /**
   * Get call logs (detailed analytics)
   */
  async getCallLogs(params?: {
    direction?: 'inbound' | 'outbound';
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
  }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request(`/accounts/${PHONE_COM_CONFIG.accountId}/call-logs?${query}`);
  }
}

// Export singleton instance
export const phoneComClient = new PhoneComClient();
