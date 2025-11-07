/**
 * Unified SMS Router
 * Routes SMS through Phone.com (primary) or Email-to-SMS (fallback)
 * This is the ONLY function the app should use for sending SMS
 */

import { sendSmsViaPhoneCom, isPhoneComConfigured } from './phonecom-client';
import { sendSMSViaEmail } from './sms-free';

export type SmsProvider = 'phonecom' | 'email-to-sms' | 'none';

export type CarrierType = 'att' | 'verizon' | 'tmobile' | 'sprint' | 'uscellular' | 'boost' | 'cricket' | 'metropcs' | 'auto';

export interface SendSmsOptions {
  to: string;
  message: string;
  carrierHint?: CarrierType; // For email-to-SMS fallback
}

export interface SendSmsResult {
  success: boolean;
  provider: SmsProvider;
  error?: string;
  messageId?: string;
}

/**
 * Send SMS via best available provider
 * 
 * Priority:
 * 1. Phone.com (if configured and USE_PHONECOM_SMS=true)
 * 2. Email-to-SMS (existing free system)
 * 3. Fail gracefully
 */
export async function sendSMS(options: SendSmsOptions): Promise<SendSmsResult> {
  const { to, message, carrierHint } = options;
  
  // Check if Phone.com is enabled via feature flag
  const usePhoneCom = process.env.USE_PHONECOM_SMS === 'true';
  
  // Try Phone.com first if enabled and configured
  if (usePhoneCom && isPhoneComConfigured()) {
    console.log('[SMS Router] Attempting Phone.com for:', to);
    
    const result = await sendSmsViaPhoneCom({ to, message });
    
    if (result.success) {
      console.log('[SMS Router] ✓ Sent via Phone.com');
      return {
        success: true,
        provider: 'phonecom',
        messageId: result.messageId,
      };
    }
    
    // Phone.com failed, log and fall back
    console.warn('[SMS Router] Phone.com failed, falling back to email-to-SMS:', result.error);
  }
  
  // Fall back to email-to-SMS (existing system)
  console.log('[SMS Router] Using email-to-SMS fallback for:', to);
  
  try {
    const emailResult = await sendSMSViaEmail({
      to,
      message,
      carrier: carrierHint || 'auto',
    });
    
    if (emailResult.success) {
      console.log('[SMS Router] ✓ Sent via email-to-SMS');
      return {
        success: true,
        provider: 'email-to-sms',
      };
    }
    
    // Email result has 'reason' not 'error'
    const errorMsg = emailResult.skipped ? emailResult.reason : 'Email-to-SMS failed';
    console.error('[SMS Router] Email-to-SMS failed:', errorMsg);
    return {
      success: false,
      provider: 'none',
      error: errorMsg,
    };
  } catch (error) {
    console.error('[SMS Router] Email-to-SMS exception:', error);
    return {
      success: false,
      provider: 'none',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get current SMS provider configuration
 */
export function getSmsProviderStatus() {
  const phoneComEnabled = process.env.USE_PHONECOM_SMS === 'true';
  const phoneComConfigured = isPhoneComConfigured();
  
  let primaryProvider: SmsProvider = 'none';
  let fallbackProvider: SmsProvider = 'none';
  
  if (phoneComEnabled && phoneComConfigured) {
    primaryProvider = 'phonecom';
    fallbackProvider = 'email-to-sms';
  } else {
    primaryProvider = 'email-to-sms';
  }
  
  return {
    primary: primaryProvider,
    fallback: fallbackProvider,
    phoneComEnabled,
    phoneComConfigured,
  };
}
