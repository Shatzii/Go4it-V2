import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

const MessagingResponse = twilio.twiml.MessagingResponse;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const body = Object.fromEntries(formData);

    const incomingMessage = (body.Body as string)?.toLowerCase() || '';
    const fromNumber = body.From as string;
    const messageId = body.MessageSid as string;

    console.log(`Incoming SMS from ${fromNumber}: ${incomingMessage}`);

    const twiml = new MessagingResponse();

    // Handle different SMS commands
    if (incomingMessage.includes('subscribe') || incomingMessage.includes('join')) {
      // Subscribe user to notifications
      await handleSubscription(fromNumber, 'subscribe');
      twiml.message(
        "🔥 Welcome to Go4It Sports notifications! You'll receive updates about scores, achievements, and more. Text STOP to unsubscribe anytime.",
      );
    } else if (incomingMessage.includes('stop') || incomingMessage.includes('unsubscribe')) {
      // Unsubscribe user from notifications
      await handleSubscription(fromNumber, 'unsubscribe');
      twiml.message(
        "You've been unsubscribed from Go4It Sports notifications. Text JOIN to resubscribe anytime.",
      );
    } else if (incomingMessage.includes('help') || incomingMessage.includes('info')) {
      // Provide help information
      twiml.message(
        'Go4It Sports Commands:\n• JOIN - Subscribe to notifications\n• STOP - Unsubscribe\n• HELP - This message\n• STATUS - Check your subscription\n\nVisit go4it.app for more options!',
      );
    } else if (incomingMessage.includes('status')) {
      // Check subscription status
      const status = await getSubscriptionStatus(fromNumber);
      twiml.message(
        `Your notification status: ${status ? 'SUBSCRIBED' : 'NOT SUBSCRIBED'}. Text JOIN to subscribe or STOP to unsubscribe.`,
      );
    } else if (incomingMessage.includes('schedule') || incomingMessage.includes('sessions')) {
      // Quick access to schedule
      twiml.message(
        '📅 View your upcoming sessions and schedule at: go4it.app/schedule\n\nNeed to book a coach? Visit: go4it.app/coaches-corner',
      );
    } else if (incomingMessage.includes('scores') || incomingMessage.includes('gar')) {
      // Quick access to GAR scores
      twiml.message(
        '🏆 Check your latest GAR scores and performance analytics at: go4it.app/gar-analysis\n\nUpload new videos for analysis: go4it.app/upload',
      );
    } else {
      // Default response for unrecognized commands
      twiml.message(
        'Thanks for texting Go4It Sports! 🏆\n\nCommands: JOIN, STOP, HELP, STATUS, SCHEDULE, SCORES\n\nOr visit: go4it.app',
      );
    }

    // Log interaction for analytics
    await logSMSInteraction(fromNumber, incomingMessage, messageId);

    return new Response(twiml.toString(), {
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  } catch (error) {
    console.error('SMS webhook error:', error);

    const twiml = new MessagingResponse();
    twiml.message(
      "Sorry, we're experiencing technical difficulties. Please try again later or visit go4it.app",
    );

    return new Response(twiml.toString(), {
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  }
}

// Helper functions
async function handleSubscription(phoneNumber: string, action: 'subscribe' | 'unsubscribe') {
  try {
    // In production, this would update the database
    // For now, we'll log the action
    console.log(`SMS subscription ${action}: ${phoneNumber}`);

    // TODO: Update user preferences in database
    // await updateUserSMSPreferences(phoneNumber, action === 'subscribe');

    return true;
  } catch (error) {
    console.error(`Failed to ${action} user:`, error);
    return false;
  }
}

async function getSubscriptionStatus(phoneNumber: string): Promise<boolean> {
  try {
    // In production, this would check the database
    // For now, we'll return a default status
    console.log(`Checking SMS subscription status for: ${phoneNumber}`);

    // TODO: Query user SMS preferences from database
    // return await getUserSMSPreferences(phoneNumber);

    return true; // Default to subscribed for now
  } catch (error) {
    console.error('Failed to get subscription status:', error);
    return false;
  }
}

async function logSMSInteraction(phoneNumber: string, message: string, messageId: string) {
  try {
    // Log SMS interaction for analytics
    console.log(`SMS interaction logged: ${messageId} from ${phoneNumber}`);

    // TODO: Store in database for analytics
    // await storeSMSInteraction({
    //   phoneNumber,
    //   message,
    //   messageId,
    //   timestamp: new Date(),
    //   type: 'incoming'
    // });
  } catch (error) {
    console.error('Failed to log SMS interaction:', error);
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Go4It Sports SMS Webhook endpoint',
    supportedCommands: [
      'JOIN/SUBSCRIBE - Subscribe to notifications',
      'STOP/UNSUBSCRIBE - Unsubscribe from notifications',
      'HELP/INFO - Show help information',
      'STATUS - Check subscription status',
      'SCHEDULE/SESSIONS - Quick access to schedule',
      'SCORES/GAR - Quick access to performance scores',
    ],
  });
}
