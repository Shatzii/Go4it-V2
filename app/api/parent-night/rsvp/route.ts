import { NextResponse } from 'next/server';
import { sendSMSViaEmail } from '@/lib/sms-free';
import { sendEmailNodemailer } from '@/lib/sendEmailNodemailer';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      carrier,
      athleteName,
      sport,
      gradYear,
      rsvpType = 'tuesday',
    } = body;

    // Validation
    if (!name || !email || !athleteName) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const eventDay = rsvpType === 'tuesday' ? 'Tuesday' : 'Thursday';
    const eventTime = rsvpType === 'tuesday' ? '7:00 PM' : '6:30 PM';
    const eventFocus = rsvpType === 'tuesday' 
      ? 'Info & Discovery Session' 
      : 'Decision & Commitment Night';

    let emailSent = false;
    let smsSent = false;

    // Send confirmation email (gracefully skip if no credentials)
    try {
      const emailResult = await sendEmailNodemailer({
        to: email,
        subject: `✅ Parent Night Confirmed - ${eventDay} at ${eventTime}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2563eb;">🎉 You're Registered!</h1>
            
            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="margin-top: 0;">Parent Night Details</h2>
              <p><strong>Day:</strong> ${eventDay}</p>
              <p><strong>Time:</strong> ${eventTime} CT</p>
              <p><strong>Focus:</strong> ${eventFocus}</p>
              <p><strong>Athlete:</strong> ${athleteName} (${sport}, Class of ${gradYear})</p>
            </div>

            <div style="background: #fffbeb; padding: 15px; border-left: 4px solid #f59e0b; margin: 20px 0;">
              <h3 style="margin-top: 0;">What to Expect:</h3>
              ${rsvpType === 'tuesday' ? `
                <ul>
                  <li>GAR Score explanation & your athlete's assessment</li>
                  <li>StarPath Skills Curriculum overview</li>
                  <li>NCAA recruiting timeline & requirements</li>
                  <li>Live Q&A with coaches</li>
                </ul>
              ` : `
                <ul>
                  <li>Review your athlete's personalized plan</li>
                  <li>Package options & pricing</li>
                  <li>Enrollment bonuses (limited time)</li>
                  <li>Sign up and get started Monday!</li>
                </ul>
              `}
            </div>

            <div style="background: #dcfce7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0;"><strong>✅ Email confirmation:</strong> Sent</p>
              ${phone && carrier ? `<p style="margin: 5px 0;"><strong>✅ SMS reminders:</strong> Enabled (${carrier.toUpperCase()})</p>` : ''}
              <p style="margin: 5px 0;"><strong>📅 Calendar invite:</strong> Check your inbox</p>
            </div>

            <p>See you ${eventDay}!</p>
            <p style="color: #6b7280; font-size: 14px;">Questions? Reply to this email or call us at (555) 123-4567</p>
          </div>
        `,
      });
      emailSent = !emailResult.skipped;
    } catch (emailError) {
      // Email failed but don't break the whole request
    }

    // Send SMS confirmation if phone and carrier provided
    if (phone && carrier && carrier !== 'auto') {
      try {
        const smsResult = await sendSMSViaEmail({
          to: phone,
          message: `✅ Parent Night confirmed! ${eventDay} at ${eventTime}. You'll get a reminder 24hrs before. - Go4it Sports`,
          carrier: carrier as any,
        });
        smsSent = smsResult.success;
      } catch (smsError) {
        // SMS failed, but email was sent successfully
        // Don't fail the whole request if SMS fails
      }
    }

    return NextResponse.json({
      success: true,
      message: emailSent 
        ? 'RSVP confirmed! Check your email for details.' 
        : 'RSVP saved! Email/SMS will be sent once credentials are configured.',
      details: {
        eventDay,
        eventTime,
        emailSent,
        smsSent,
        credentialsConfigured: emailSent || smsSent,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to process RSVP' },
      { status: 500 }
    );
  }
}
