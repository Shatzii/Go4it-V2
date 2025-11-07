/**
 * Phone.com SMS Client
 * Handles outbound SMS via Phone.com API
 * Account: Alonzo Barrett (a.barrett@go4itsports.org)
 * Phone: (303) 970-4655
 */

interface PhoneComConfig {
  apiKey?: string;
  accountId?: string;
  fromNumber?: string;
  apiUrl: string;
}

const config: PhoneComConfig = {
  apiKey: process.env.PHONECOM_API_KEY,
  accountId: process.env.PHONECOM_ACCOUNT_ID || '3845638',
  fromNumber: process.env.PHONECOM_FROM_NUMBER || '+13039704655',
  apiUrl: 'https://api.phone.com/v4',
};

export interface SendSmsResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Send SMS via Phone.com
 * Safe to call even if not configured - returns error instead of throwing
 */
export async function sendSmsViaPhoneCom(params: {
  to: string;
  message: string;
}): Promise<SendSmsResult> {
  // Check if Phone.com is configured
  if (!config.apiKey || !config.accountId) {
    return {
      success: false,
      error: 'Phone.com not configured (missing PHONECOM_API_KEY or PHONECOM_ACCOUNT_ID)',
    };
  }

  try {
    // Normalize phone number to E.164 format
    const toNumber = normalizePhoneNumber(params.to);
    if (!toNumber) {
      return {
        success: false,
        error: `Invalid phone number format: ${params.to}`,
      };
    }

    // Send SMS via Phone.com API
    const response = await fetch(
      `${config.apiUrl}/accounts/${config.accountId}/sms`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: config.fromNumber,
          to: toNumber,
          text: params.message,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error('[Phone.com] SMS send failed:', response.status, errorText);
      return {
        success: false,
        error: `Phone.com API error: ${response.status}`,
      };
    }

    const data = await response.json();
    console.log('[Phone.com] SMS sent successfully:', {
      to: toNumber,
      messageId: data.id,
    });

    return {
      success: true,
      messageId: data.id,
    };
  } catch (error) {
    console.error('[Phone.com] SMS send exception:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Normalize phone number to E.164 format (+1234567890)
 */
function normalizePhoneNumber(phone: string): string | null {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Handle US numbers
  if (digits.length === 10) {
    return `+1${digits}`;
  }
  if (digits.length === 11 && digits.startsWith('1')) {
    return `+${digits}`;
  }
  
  // Already in E.164 format
  if (phone.startsWith('+') && digits.length >= 10) {
    return `+${digits}`;
  }
  
  return null;
}

/**
 * Check if Phone.com is configured and ready to use
 */
export function isPhoneComConfigured(): boolean {
  return !!(config.apiKey && config.accountId && config.fromNumber);
}

/**
 * Get Phone.com configuration status (safe to call, no secrets exposed)
 */
export function getPhoneComStatus() {
  return {
    configured: isPhoneComConfigured(),
    accountId: config.accountId,
    fromNumber: config.fromNumber,
    hasApiKey: !!config.apiKey,
  };
}
