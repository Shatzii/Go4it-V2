import { NextRequest, NextResponse } from 'next/server';
import { sendSMS } from '@/lib/sms-router';

export const dynamic = 'force-dynamic';

/**
 * Phone.com Inbound Webhook Handler
 * Receives incoming SMS, calls, and voicemails from Phone.com
 * Routes them to appropriate automation flows
 */

interface PhoneComIncomingMessage {
  from: string;
  to: string;
  type: 'sms' | 'call' | 'voicemail';
  text?: string;
  timestamp: string;
  callId?: string;
  voicemailUrl?: string;
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    
    // Parse Phone.com webhook payload
    const message = parsePhoneComPayload(payload);
    
    if (!message) {
      console.error('[Phone.com Webhook] Invalid payload:', payload);
      return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
    }

    console.log('[Phone.com Webhook] Received:', message);

    // Route based on message type
    switch (message.type) {
      case 'sms':
        await handleIncomingSMS(message);
        break;
      case 'call':
        await handleIncomingCall(message);
        break;
      case 'voicemail':
        await handleVoicemail(message);
        break;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Phone.com Webhook] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Parse Phone.com webhook payload into normalized format
 */
function parsePhoneComPayload(payload: any): PhoneComIncomingMessage | null {
  try {
    // Phone.com SMS format
    if (payload.event === 'sms.received' || payload.text) {
      return {
        from: payload.from || payload.sender,
        to: payload.to || payload.recipient,
        type: 'sms',
        text: payload.text || payload.message,
        timestamp: payload.timestamp || new Date().toISOString(),
      };
    }

    // Phone.com call format
    if (payload.event === 'call.completed' || payload.callId) {
      return {
        from: payload.from || payload.caller,
        to: payload.to || payload.callee,
        type: 'call',
        timestamp: payload.timestamp || new Date().toISOString(),
        callId: payload.callId || payload.id,
      };
    }

    // Phone.com voicemail format
    if (payload.event === 'voicemail.received' || payload.voicemailUrl) {
      return {
        from: payload.from || payload.caller,
        to: payload.to,
        type: 'voicemail',
        timestamp: payload.timestamp || new Date().toISOString(),
        voicemailUrl: payload.voicemailUrl || payload.url,
      };
    }

    return null;
  } catch (error) {
    console.error('[Phone.com Webhook] Parse error:', error);
    return null;
  }
}

/**
 * Handle incoming SMS with keyword routing
 */
async function handleIncomingSMS(message: PhoneComIncomingMessage) {
  const text = (message.text || '').toUpperCase().trim();
  const from = message.from;

  console.log('[SMS Handler] Processing keyword:', text);

  // Keyword routing
  if (text.includes('START') || text.includes('BEGIN')) {
    await sendSMS({
      to: from,
      message: `🎓 Welcome to Go4It Academy! Ready to audit your transcript? Get your Grad-Ability Rating (GAR) here: https://go4itsports.org/transcript-audit\n\nReply STARPATH for pricing info.`,
    });
    
    // TODO: Track lead in database
    console.log('[SMS Handler] New lead from:', from);
  }
  else if (text.includes('PARENT')) {
    await sendSMS({
      to: from,
      message: `👪 Parent Night Info:\n\nTuesday 7:00 PM - Discovery Session\nThursday 6:30 PM - Decision Night\n\nRSVP here: https://go4itsports.org/parent-night\n\nQuestions? Reply anytime!`,
    });
    
    // TODO: Add to parent night interest list
    console.log('[SMS Handler] Parent night interest from:', from);
  }
  else if (text.includes('STARPATH')) {
    await sendSMS({
      to: from,
      message: `⭐ StarPath Pricing:\n\n💎 Gold: $799/mo (Premium)\n🥈 Silver: $499/mo (Standard)\n🥉 Bronze: $299/mo (Basic)\n\nAll include GAR tracking, NCAA monitoring, and scholarship intel.\n\nLearn more: https://go4itsports.org/starpath`,
    });
  }
  else if (text.includes('ACADEMY')) {
    await sendSMS({
      to: from,
      message: `🏫 Go4It Academy: $399/mo\n\nFull access to academic support, study sessions, and transcript optimization.\n\nEnroll: https://go4itsports.org/academy/enroll\n\nQuestions? Text us anytime!`,
    });
  }
  else if (text.includes('COMBINE') || text.includes('EVENT')) {
    await sendSMS({
      to: from,
      message: `🏃‍♂️ Upcoming Events:\n\nSpeed & Agility Combine\nShowcase Tournaments\nCollege Recruiting Days\n\nView schedule: https://go4itsports.org/events\n\nReply EVENT for alerts!`,
    });
  }
  else if (text.includes('AUDIT')) {
    await sendSMS({
      to: from,
      message: `📊 Free Transcript Audit:\n\nGet your Grad-Ability Rating (GAR) and NCAA eligibility status in minutes.\n\nStart here: https://go4itsports.org/transcript-audit\n\nWe'll analyze your credits and send a full report!`,
    });
  }
  else if (text.includes('HELP') || text.includes('INFO')) {
    await sendSMS({
      to: from,
      message: `🏀 Go4It Sports Help Menu:\n\nReply:\n• START - Transcript audit\n• STARPATH - Pricing\n• PARENT - Parent night\n• ACADEMY - Enrollment\n• COMBINE - Events\n\nCall: (303) 970-4655\nEmail: info@go4itsports.org`,
    });
  }
  else if (text.includes('STOP') || text.includes('UNSUBSCRIBE')) {
    // TODO: Add to unsubscribe list
    await sendSMS({
      to: from,
      message: `You've been unsubscribed from Go4It Sports messages. Text START anytime to re-subscribe. Thanks!`,
    });
    console.log('[SMS Handler] Unsubscribe request from:', from);
  }
  else {
    // Generic reply for unrecognized keywords
    await sendSMS({
      to: from,
      message: `Thanks for reaching out to Go4It Sports! 🏀\n\nReply HELP for menu, or call us at (303) 970-4655.\n\nWe're here to help your athlete succeed!`,
    });
  }

  // Log all inbound messages
  console.log('[SMS Handler] Processed inbound SMS:', {
    from,
    text: message.text,
    timestamp: message.timestamp,
  });
}

/**
 * Handle incoming calls (missed calls, etc.)
 */
async function handleIncomingCall(message: PhoneComIncomingMessage) {
  console.log('[Call Handler] Incoming call:', {
    from: message.from,
    callId: message.callId,
    timestamp: message.timestamp,
  });

  // Send follow-up SMS for missed calls
  await sendSMS({
    to: message.from,
    message: `Hi! You called Go4It Sports at (303) 970-4655. We'll call you back ASAP!\n\nIn the meantime, text START for a free transcript audit or HELP for menu.`,
  });

  // TODO: Log call in database, notify staff
}

/**
 * Handle voicemails
 */
async function handleVoicemail(message: PhoneComIncomingMessage) {
  console.log('[Voicemail Handler] New voicemail:', {
    from: message.from,
    url: message.voicemailUrl,
    timestamp: message.timestamp,
  });

  // Send SMS acknowledging voicemail
  await sendSMS({
    to: message.from,
    message: `Thanks for your voicemail! We received it and will respond within 24 hours. For immediate help, text HELP for menu. - Go4It Sports`,
  });

  // TODO: Notify staff, log in database
}
