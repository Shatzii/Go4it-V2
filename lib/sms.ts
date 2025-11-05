/**
 * SMS Service - Email-to-SMS Gateway (100% FREE)
 * Uses carrier email gateways to send SMS via SMTP
 * No Twilio, no paid services - completely free!
 */

import nodemailer from 'nodemailer';

interface SMSOptions {
  to: string; // Phone number: +1234567890
  message: string;
  carrier?: string; // att, verizon, tmobile, sprint, etc.
}

// Major US carrier email-to-SMS gateways (100% FREE)
export const CARRIER_GATEWAYS: Record<string, string> = {
  att: '@txt.att.net',
  verizon: '@vtext.com',
  tmobile: '@tmomail.net',
  sprint: '@messaging.sprintpcs.com',
  uscellular: '@email.uscc.net',
  boost: '@sms.myboostmobile.com',
  cricket: '@sms.cricketwireless.net',
  metropcs: '@mymetropcs.com',
  virgin: '@vmobl.com',
  tracfone: '@mmst5.tracfone.com',
  'consumer-cellular': '@mailmymobile.net',
  'c-spire': '@cspire1.com',
  'page-plus': '@vtext.com',
};

/**
 * Send SMS via Email-to-SMS Gateway (FREE)
 * Uses your existing Gmail SMTP to send texts
 * 
 * @param to - Phone number with country code: +1234567890
 * @param message - SMS text (keep under 160 chars for best results)
 * @param carrier - Carrier code (att, verizon, tmobile, etc.)
 */
export async function sendSMS({ to, message, carrier = 'att' }: SMSOptions) {
  try {
    // Clean phone number (remove +1, spaces, dashes, etc.)
    const phoneNumber = to.replace(/\D/g, '').replace(/^1/, '');
    
    // Get carrier gateway
    const gateway = CARRIER_GATEWAYS[carrier.toLowerCase()] || CARRIER_GATEWAYS.att;
    const smsEmail = `${phoneNumber}${gateway}`;

    // Create SMTP transporter (uses your Gmail credentials)
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false, // Use TLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Send email (carrier converts to SMS automatically)
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: smsEmail,
      subject: '', // Leave empty for SMS
      text: message, // SMS body
    });

    return {
      success: true,
      messageId: info.messageId,
      carrier,
      gateway: smsEmail,
      cost: 0, // FREE!
    };
  } catch (error: any) {
    
    return {
      success: false,
      error: error.message,
      carrier,
    };
  }
}

/**
 * Send SMS to multiple carriers (when you don't know which one)
 * Sends to top 4 carriers - one will deliver
 * Still FREE since it's just email
 */
export async function sendSMSMultiCarrier({ to, message }: Omit<SMSOptions, 'carrier'>) {
  const topCarriers = ['att', 'verizon', 'tmobile', 'sprint'];
  
  const results = await Promise.allSettled(
    topCarriers.map((carrier) => sendSMS({ to, message, carrier }))
  );

  const successful = results.filter((r) => r.status === 'fulfilled');

  return {
    success: successful.length > 0,
    sent: successful.length,
    carriers: topCarriers,
  };
}

/**
 * Batch send SMS to multiple numbers
 * Example: Send Parent Night reminders to all RSVPs
 */
export async function sendSMSBatch(recipients: Array<{ phone: string; carrier: string; message: string }>) {
  const results = await Promise.allSettled(
    recipients.map(({ phone, carrier, message }) =>
      sendSMS({ to: phone, message, carrier })
    )
  );

  const successful = results.filter((r) => r.status === 'fulfilled').length;
  const failed = results.length - successful;

  return {
    total: results.length,
    successful,
    failed,
    cost: 0, // Always free!
  };
}

/**
 * USAGE EXAMPLES:
 * 
 * // Single SMS (if you know carrier)
 * await sendSMS({
 *   to: '+12145551234',
 *   message: 'Parent Night tomorrow at 7 PM! Reply Y to confirm.',
 *   carrier: 'att'
 * });
 * 
 * // Multiple carriers (if unknown)
 * await sendSMSMultiCarrier({
 *   to: '+12145551234',
 *   message: 'Parent Night reminder!'
 * });
 * 
 * // Batch send (Parent Night reminders)
 * await sendSMSBatch([
 *   { phone: '+12145551234', carrier: 'att', message: 'See you Tuesday!' },
 *   { phone: '+13105559876', carrier: 'verizon', message: 'See you Tuesday!' },
 * ]);
 */

/**
 * REQUIRED ENVIRONMENT VARIABLES:
 * 
 * SMTP_HOST=smtp.gmail.com
 * SMTP_PORT=587
 * SMTP_USER=youremail@gmail.com
 * SMTP_PASS=your-app-password
 * SMTP_FROM=youremail@gmail.com
 * 
 * Get Gmail app password: https://myaccount.google.com/apppasswords
 */
