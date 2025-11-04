import { NextResponse } from 'next/server';

/**
 * Parent Night Automation API
 * Handles automated SMS and Email sequences for Parent Night funnel:
 * - Tuesday RSVP → Confirmation + Reminder
 * - Thursday RSVP → Confirmation + Reminder  
 * - Monday Onboarding → Welcome sequence
 */

interface ParentLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  athleteName?: string;
  sport?: string;
  gradYear?: string;
  timezone?: string;
  rsvpType: 'tuesday' | 'thursday' | 'monday';
  rsvpDate: string;
  status: 'confirmed' | 'reminded' | 'attended' | 'no-show';
}

interface AutomationSequence {
  type: 'sms' | 'email';
  trigger: string;
  delay: string;
  template: string;
  sent: boolean;
  scheduledFor: string;
}

// SMS Templates for Parent Night
const SMS_TEMPLATES = {
  tuesday_confirmation: `Hi {name}! ✅ You're registered for Parent Night TUESDAY at {time}. We'll cover NCAA eligibility, GAR testing, and how Go4it helps athletes succeed. Zoom link: {link} - Go4it Team`,
  
  tuesday_reminder_24h: `👋 {name}, Parent Night is TOMORROW (Tuesday) at {time}! Get ready to discover how 342 parents found clarity on their athlete's path. Link: {link}`,
  
  tuesday_reminder_1h: `🎓 {name}, Parent Night starts in 1 HOUR! Join us at {time}. Link ready: {link}. See you soon!`,
  
  thursday_confirmation: `Hi {name}! ✅ Registered for THURSDAY Parent Night at {time}. This is where decisions happen! We'll answer all your questions. Link: {link} - Go4it`,
  
  thursday_reminder_24h: `Hi {name}! Parent Night THURSDAY at {time}. 89% of Thursday attendees enroll - let's find your athlete's path. Link: {link}`,
  
  thursday_reminder_1h: `🔥 {name}, it's time! Parent Night starts in 1 HOUR ({time}). This could change everything for {athlete}. Link: {link}`,
  
  monday_onboarding: `Welcome to Go4it, {name}! 🎉 Your Monday onboarding is at {time}. We're excited to help {athlete} succeed. Link: {link}. Questions? Reply here!`,
  
  monday_reminder: `📚 {name}, onboarding TODAY at {time}! We'll set up {athlete}'s account, schedule GAR testing, and plan the first month. Ready? {link}`,
};

// Email Templates
const EMAIL_TEMPLATES = {
  tuesday_confirmation: {
    subject: '✅ You\'re Registered for Parent Night (Tuesday)',
    html: `
      <h2>Welcome, {name}!</h2>
      <p>You're confirmed for <strong>Parent Night - Tuesday at {time}</strong>.</p>
      
      <h3>What We'll Cover:</h3>
      <ul>
        <li>📋 NCAA Eligibility Requirements Explained</li>
        <li>⭐ GAR Testing: What It Is & Why It Matters</li>
        <li>🎓 Academic + Athletic Balance</li>
        <li>🌍 International Athletes Welcome</li>
        <li>❓ Live Q&A Session</li>
      </ul>
      
      <p><strong>Zoom Link:</strong> <a href="{link}">{link}</a></p>
      
      <p>See you Tuesday!</p>
      <p>- The Go4it Team</p>
    `,
  },
  
  thursday_confirmation: {
    subject: '✅ Thursday Parent Night Confirmed - Decision Time!',
    html: `
      <h2>Hi {name},</h2>
      <p>You're registered for <strong>Thursday Parent Night at {time}</strong>!</p>
      
      <p>This session is where clarity happens. We'll:</p>
      <ul>
        <li>💡 Review your athlete's specific situation</li>
        <li>📊 Show you the exact path forward</li>
        <li>💰 Discuss pricing and payment plans</li>
        <li>📝 Answer every single question</li>
        <li>🚀 Help you make the right decision</li>
      </ul>
      
      <p><strong>89% of Thursday attendees enroll.</strong> Let's see if Go4it is right for {athlete}.</p>
      
      <p><strong>Join Here:</strong> <a href="{link}">{link}</a></p>
      
      <p>See you Thursday!</p>
    `,
  },
  
  monday_onboarding: {
    subject: '🎉 Welcome to Go4it! Monday Onboarding Details',
    html: `
      <h2>Welcome to the Go4it Family, {name}!</h2>
      <p>We're thrilled to have {athlete} join us. Your <strong>Monday Onboarding</strong> is scheduled for <strong>{time}</strong>.</p>
      
      <h3>What to Expect:</h3>
      <ol>
        <li>🔐 Account setup & platform walkthrough</li>
        <li>📅 Schedule {athlete}'s GAR testing</li>
        <li>🎯 Set academic & athletic goals</li>
        <li>📚 Choose first courses (if applicable)</li>
        <li>💪 Create training plan</li>
      </ol>
      
      <h3>What to Bring:</h3>
      <ul>
        <li>Current transcript (if available)</li>
        <li>Athletic resume/highlights</li>
        <li>Questions!</li>
      </ul>
      
      <p><strong>Onboarding Link:</strong> <a href="{link}">{link}</a></p>
      
      <p>Questions before Monday? Reply to this email.</p>
      
      <p>Let's Go4it! 🚀</p>
    `,
  },
};

export async function POST(request: Request) {
  try {
    const lead: ParentLead = await request.json();

    // Validate required fields
    if (!lead.name || !lead.email || !lead.rsvpType) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, email, rsvpType' },
        { status: 400 }
      );
    }

    // Generate automation sequences
    const sequences: AutomationSequence[] = [];
    const now = new Date();
    const rsvpDate = new Date(lead.rsvpDate || now);

    // Tuesday RSVP Sequence
    if (lead.rsvpType === 'tuesday') {
      // Immediate confirmation
      sequences.push({
        type: 'sms',
        trigger: 'immediate',
        delay: '0 minutes',
        template: 'tuesday_confirmation',
        sent: false,
        scheduledFor: now.toISOString(),
      });

      sequences.push({
        type: 'email',
        trigger: 'immediate',
        delay: '0 minutes',
        template: 'tuesday_confirmation',
        sent: false,
        scheduledFor: now.toISOString(),
      });

      // 24-hour reminder
      const reminder24h = new Date(rsvpDate);
      reminder24h.setHours(reminder24h.getHours() - 24);
      sequences.push({
        type: 'sms',
        trigger: '24h before',
        delay: '24 hours before event',
        template: 'tuesday_reminder_24h',
        sent: false,
        scheduledFor: reminder24h.toISOString(),
      });

      // 1-hour reminder
      const reminder1h = new Date(rsvpDate);
      reminder1h.setHours(reminder1h.getHours() - 1);
      sequences.push({
        type: 'sms',
        trigger: '1h before',
        delay: '1 hour before event',
        template: 'tuesday_reminder_1h',
        sent: false,
        scheduledFor: reminder1h.toISOString(),
      });
    }

    // Thursday RSVP Sequence
    if (lead.rsvpType === 'thursday') {
      sequences.push({
        type: 'sms',
        trigger: 'immediate',
        delay: '0 minutes',
        template: 'thursday_confirmation',
        sent: false,
        scheduledFor: now.toISOString(),
      });

      sequences.push({
        type: 'email',
        trigger: 'immediate',
        delay: '0 minutes',
        template: 'thursday_confirmation',
        sent: false,
        scheduledFor: now.toISOString(),
      });

      const reminder24h = new Date(rsvpDate);
      reminder24h.setHours(reminder24h.getHours() - 24);
      sequences.push({
        type: 'sms',
        trigger: '24h before',
        delay: '24 hours before event',
        template: 'thursday_reminder_24h',
        sent: false,
        scheduledFor: reminder24h.toISOString(),
      });

      const reminder1h = new Date(rsvpDate);
      reminder1h.setHours(reminder1h.getHours() - 1);
      sequences.push({
        type: 'sms',
        trigger: '1h before',
        delay: '1 hour before event',
        template: 'thursday_reminder_1h',
        sent: false,
        scheduledFor: reminder1h.toISOString(),
      });
    }

    // Monday Onboarding Sequence
    if (lead.rsvpType === 'monday') {
      sequences.push({
        type: 'email',
        trigger: 'immediate',
        delay: '0 minutes',
        template: 'monday_onboarding',
        sent: false,
        scheduledFor: now.toISOString(),
      });

      sequences.push({
        type: 'sms',
        trigger: 'immediate',
        delay: '0 minutes',
        template: 'monday_onboarding',
        sent: false,
        scheduledFor: now.toISOString(),
      });

      // Morning reminder
      const morningReminder = new Date(rsvpDate);
      morningReminder.setHours(9, 0, 0, 0);
      sequences.push({
        type: 'sms',
        trigger: 'morning of',
        delay: 'Morning of event',
        template: 'monday_reminder',
        sent: false,
        scheduledFor: morningReminder.toISOString(),
      });
    }

    // In production, save to database and trigger actual SMS/email services
    // await saveLeadToDatabase(lead);
    // await scheduleAutomations(sequences, lead);

    return NextResponse.json({
      success: true,
      lead: {
        id: lead.id || `lead_${Date.now()}`,
        ...lead,
        status: 'confirmed',
      },
      automations: sequences,
      summary: {
        totalMessages: sequences.length,
        smsCount: sequences.filter((s) => s.type === 'sms').length,
        emailCount: sequences.filter((s) => s.type === 'email').length,
        nextMessage: sequences[0],
      },
      message: `Successfully enrolled ${lead.name} in ${lead.rsvpType} Parent Night automation`,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to set up automation',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Parent Night automation system operational',
    sequences: {
      tuesday: [
        'Immediate: SMS + Email confirmation',
        '24h before: SMS reminder',
        '1h before: SMS reminder',
      ],
      thursday: [
        'Immediate: SMS + Email confirmation',
        '24h before: SMS reminder',
        '1h before: SMS reminder',
      ],
      monday: [
        'Immediate: Email + SMS welcome',
        'Morning of: SMS reminder',
      ],
    },
    templates: {
      sms: Object.keys(SMS_TEMPLATES),
      email: Object.keys(EMAIL_TEMPLATES),
    },
    usage: {
      endpoint: 'POST /api/automation/parent-night',
      example: {
        name: 'Jennifer Martinez',
        email: 'jennifer@example.com',
        phone: '+1234567890',
        athleteName: 'Marcus',
        sport: 'Basketball',
        gradYear: '2026',
        rsvpType: 'tuesday',
        rsvpDate: '2024-11-05T19:00:00Z',
      },
    },
  });
}
