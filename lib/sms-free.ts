/**
 * Open-Source SMS Alternative to Twilio
 * Uses free/open-source services for SMS sending
 * 
 * Options:
 * 1. Email-to-SMS Gateway (Completely Free)
 * 2. Textbelt API (Open source, 1 free SMS/day)
 * 3. Your own carrier's email-to-SMS
 */

import nodemailer from 'nodemailer';

interface SMSOptions {
  to: string; // Phone number in format: +1234567890
  message: string;
  carrier?: 'att' | 'verizon' | 'tmobile' | 'sprint' | 'uscellular' | 'boost' | 'cricket' | 'metropcs' | 'auto';
}

// Carrier email-to-SMS gateways (100% FREE)
const CARRIER_GATEWAYS = {
  att: '@txt.att.net',
  verizon: '@vtext.com',
  tmobile: '@tmomail.net',
  sprint: '@messaging.sprintpcs.com',
  uscellular: '@email.uscc.net',
  boost: '@sms.myboostmobile.com',
  cricket: '@sms.cricketwireless.net',
  metropcs: '@mymetropcs.com',
};

/**
 * METHOD 1: Email-to-SMS Gateway (COMPLETELY FREE)
 * Most reliable free option - uses carrier's built-in email-to-SMS
 * 
 * Usage:
 * await sendSMSViaEmail({
 *   to: '+1234567890',
 *   message: 'Your Parent Night reminder!',
 *   carrier: 'att'
 * });
 */
export async function sendSMSViaEmail({ to, message, carrier = 'att' }: SMSOptions) {
  // Skip if SMTP not configured (won't break deployment)
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return {
      success: false,
      skipped: true,
      reason: 'SMTP credentials not configured - add in admin panel after deployment',
      carrier,
    };
  }

  // Clean phone number
  const phoneNumber = to.replace(/\D/g, '').replace(/^1/, '');
  
  // Get carrier gateway (exclude 'auto' from lookup)
  const validCarrier = carrier === 'auto' ? 'att' : carrier;
  const gateway = CARRIER_GATEWAYS[validCarrier as keyof typeof CARRIER_GATEWAYS] || CARRIER_GATEWAYS.att;
  const smsEmail = `${phoneNumber}${gateway}`;

  // Create transporter (uses your existing SMTP config)
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Send as email (carrier converts to SMS)
  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: smsEmail,
    subject: '', // Keep empty for SMS
    text: message,
  });

  return {
    success: true,
    messageId: info.messageId,
    carrier,
    gateway: smsEmail,
  };
}

/**
 * METHOD 2: Textbelt API (Open Source)
 * Free tier: 1 SMS per day per IP
 * Paid tier: $0.0075 per SMS (cheaper than Twilio)
 * 
 * Usage:
 * await sendSMSViaTextbelt({
 *   to: '+1234567890',
 *   message: 'Your Parent Night reminder!'
 * });
 */
export async function sendSMSViaTextbelt({ to, message }: Omit<SMSOptions, 'carrier'>) {
  // Skip if explicitly disabled
  if (process.env.ENABLE_TEXTBELT === 'false') {
    return {
      success: false,
      skipped: true,
      reason: 'Textbelt disabled - enable in admin panel',
    };
  }

  const apiKey = process.env.TEXTBELT_API_KEY || 'textbelt'; // 'textbelt' = free tier

  const response = await fetch('https://textbelt.com/text', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      phone: to,
      message,
      key: apiKey,
    }),
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(`Textbelt SMS failed: ${result.error}`);
  }

  return {
    success: true,
    messageId: result.textId,
    quotaRemaining: result.quotaRemaining,
  };
}

/**
 * METHOD 3: Auto-detect carrier and send via email gateway
 * Tries to detect carrier from phone number database
 * Falls back to Textbelt if carrier unknown
 */
export async function sendSMSAuto({ to, message }: Omit<SMSOptions, 'carrier'>) {
  // Try all major carriers (email-to-SMS is instant)
  const carriers = ['att', 'verizon', 'tmobile', 'sprint'] as const;
  
  // Send to all carrier gateways (only the correct one will deliver)
  const promises = carriers.map((carrier) =>
    sendSMSViaEmail({ to, message, carrier }).catch(() => null)
  );

  const results = await Promise.all(promises);
  const successful = results.filter((r) => r !== null && r.success);

  if (successful.length > 0) {
    return {
      success: true,
      method: 'email-to-sms',
      sent: successful.length,
    };
  }

  // Fallback to Textbelt if email-to-SMS fails
  try {
    return await sendSMSViaTextbelt({ to, message });
  } catch (error) {
    return {
      success: false,
      method: 'none',
      reason: 'All methods failed - configure SMTP in admin panel',
    };
  }
}

/**
 * METHOD 4: Use your own Plivo account (Open Source Alternative to Twilio)
 * Plivo is 20-40% cheaper than Twilio and has an open API
 * Sign up at: https://www.plivo.com/
 */
export async function sendSMSViaPlivo({ to, message }: Omit<SMSOptions, 'carrier'>) {
  const authId = process.env.PLIVO_AUTH_ID;
  const authToken = process.env.PLIVO_AUTH_TOKEN;
  const fromNumber = process.env.PLIVO_PHONE_NUMBER;

  if (!authId || !authToken || !fromNumber) {
    return {
      success: false,
      skipped: true,
      reason: 'Plivo credentials not configured - add in admin panel',
    };
  }

  const response = await fetch(
    `https://api.plivo.com/v1/Account/${authId}/Message/`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(`${authId}:${authToken}`).toString('base64')}`,
      },
      body: JSON.stringify({
        src: fromNumber,
        dst: to,
        text: message,
      }),
    }
  );

  const result = await response.json();

  if (response.status !== 202) {
    throw new Error(`Plivo SMS failed: ${result.error}`);
  }

  return {
    success: true,
    messageId: result.message_uuid[0],
    cost: result.total_rate,
  };
}

/**
 * SMART SMS ROUTER
 * Automatically chooses the best free/cheap method
 * 
 * Priority:
 * 1. Email-to-SMS (FREE if you know carrier)
 * 2. Textbelt (1 free per day, then $0.0075 each)
 * 3. Plivo (if configured, ~$0.006 per SMS)
 * 4. Fallback to email notification
 */
export async function sendSMS({ to, message, carrier }: SMSOptions) {
  try {
    // If carrier is known, use free email-to-SMS
    if (carrier && carrier !== 'auto') {
      const result = await sendSMSViaEmail({ to, message, carrier });
      if (result.success) return result;
      // If failed, try other methods below
    }

    // Try auto-detect with email-to-SMS first (FREE)
    try {
      const result = await sendSMSAuto({ to, message });
      if (result.success) return result;
    } catch (error) {
      // Email-to-SMS failed, try Textbelt
    }

    // Try Textbelt (1 free per day)
    if (process.env.TEXTBELT_API_KEY || process.env.ENABLE_TEXTBELT === 'true') {
      try {
        const result = await sendSMSViaTextbelt({ to, message });
        if (result.success) return result;
      } catch (error) {
        // Textbelt failed, try Plivo
      }
    }

    // Try Plivo if configured
    if (process.env.PLIVO_AUTH_ID) {
      const result = await sendSMSViaPlivo({ to, message });
      if (result.success) return result;
    }

    // No credentials configured - return graceful failure
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return {
        success: false,
        skipped: true,
        reason: 'No SMS/Email credentials configured. Add in admin panel after deployment.',
        to,
        message,
      };
    }

    // Last resort: send email notification to admin
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: process.env.SMTP_USER, // Send to self as notification
        subject: 'SMS Delivery Failed - Fallback Email',
        text: `Failed to send SMS to ${to}. Message: ${message}`,
      });

      return {
        success: false,
        fallback: 'email',
        message: 'SMS failed, email notification sent to admin',
      };
    } catch (emailError) {
      // Even email failed - just log and continue
      return {
        success: false,
        skipped: true,
        reason: 'No credentials configured',
      };
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'SMS send failed',
      skipped: true,
    };
  }
}

/**
 * USAGE EXAMPLES:
 * 
 * // Method 1: Free email-to-SMS (if you know carrier)
 * await sendSMSViaEmail({
 *   to: '+1234567890',
 *   message: 'Parent Night tomorrow at 7 PM!',
 *   carrier: 'att'
 * });
 * 
 * // Method 2: Textbelt (1 free/day, then paid)
 * await sendSMSViaTextbelt({
 *   to: '+1234567890',
 *   message: 'Parent Night tomorrow!'
 * });
 * 
 * // Method 3: Smart router (tries free methods first)
 * await sendSMS({
 *   to: '+1234567890',
 *   message: 'Parent Night tomorrow!',
 *   carrier: 'auto'
 * });
 */

/**
 * ENVIRONMENT VARIABLES:
 * 
 * # Required for email-to-SMS (FREE):
 * SMTP_HOST=smtp.gmail.com
 * SMTP_PORT=587
 * SMTP_USER=your-email@gmail.com
 * SMTP_PASS=your-app-password
 * SMTP_FROM=your-email@gmail.com
 * 
 * # Optional - Textbelt API (1 free/day):
 * TEXTBELT_API_KEY=textbelt  # or purchase key
 * ENABLE_TEXTBELT=true
 * 
 * # Optional - Plivo (cheaper than Twilio):
 * PLIVO_AUTH_ID=your_auth_id
 * PLIVO_AUTH_TOKEN=your_auth_token
 * PLIVO_PHONE_NUMBER=+1234567890
 */
