import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { registration, event } = body;

    const meetingLink = `${process.env.NEXT_PUBLIC_APP_URL}/live/${event.roomId}`;
    const eventDate = new Date(event.startTime).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const eventTime = new Date(event.startTime).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
    });

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Parent Night Registration Confirmed</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  
  <!-- Header -->
  <div style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="margin: 0; font-size: 28px;">You're Registered!</h1>
    <p style="margin: 10px 0 0; font-size: 16px; opacity: 0.9;">Parent Information Night</p>
  </div>

  <!-- Main Content -->
  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
    
    <p style="font-size: 16px; margin-top: 0;">Hi ${registration.firstName},</p>
    
    <p style="font-size: 16px;">
      Thank you for registering for our Parent Information Night! We're excited to show you how Go4It Sports 
      can help ${registration.athleteName} reach their athletic potential.
    </p>

    <!-- Event Details Box -->
    <div style="background: white; border-left: 4px solid #3b82f6; padding: 20px; margin: 25px 0; border-radius: 5px;">
      <h2 style="margin-top: 0; color: #3b82f6; font-size: 20px;">📅 Event Details</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold; width: 100px;">Date:</td>
          <td style="padding: 8px 0;">${eventDate}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Time:</td>
          <td style="padding: 8px 0;">${eventTime}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Duration:</td>
          <td style="padding: 8px 0;">60-70 minutes</td>
        </tr>
      </table>
    </div>

    <!-- Join Meeting Button -->
    <div style="text-align: center; margin: 30px 0;">
      <a href="${meetingLink}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-weight: bold; font-size: 16px;">
        Join Live Session
      </a>
      <p style="font-size: 12px; color: #6b7280; margin-top: 10px;">
        Save this link - you'll need it on event day
      </p>
    </div>

    <!-- Account Info -->
    <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 25px 0; border-radius: 5px;">
      <h3 style="margin-top: 0; color: #f59e0b; font-size: 18px;">🎉 Your Free Account is Ready!</h3>
      <p style="margin: 10px 0;">
        We've created a free account for you to explore the platform before the event. 
        Check your email for login credentials (separate email).
      </p>
    </div>

    <!-- What to Expect -->
    <div style="margin: 25px 0;">
      <h3 style="color: #1f2937; font-size: 18px;">What to Expect:</h3>
      <ul style="padding-left: 20px;">
        <li style="margin: 10px 0;">Live platform demonstration</li>
        <li style="margin: 10px 0;">AI-powered video analysis walkthrough</li>
        <li style="margin: 10px 0;">NCAA recruiting support overview</li>
        <li style="margin: 10px 0;">Q&A with coaches and experts</li>
        <li style="margin: 10px 0;">Special attendee-only offers</li>
      </ul>
    </div>

    <!-- Technical Requirements -->
    <div style="background: #e0f2fe; border-left: 4px solid #0ea5e9; padding: 20px; margin: 25px 0; border-radius: 5px;">
      <h3 style="margin-top: 0; color: #0ea5e9; font-size: 18px;">💻 Before the Event:</h3>
      <ul style="padding-left: 20px; margin: 10px 0;">
        <li style="margin: 8px 0;">Test your camera and microphone</li>
        <li style="margin: 8px 0;">Use Chrome, Firefox, or Safari for best experience</li>
        <li style="margin: 8px 0;">Join from a quiet location</li>
        <li style="margin: 8px 0;">Have questions ready for Q&A!</li>
      </ul>
    </div>

    <!-- Reminders -->
    <p style="font-size: 14px; color: #6b7280;">
      <strong>Reminders:</strong> You'll receive email reminders 24 hours and 1 hour before the event. 
      The session will be recorded and sent to all registrants.
    </p>

    <!-- Add to Calendar -->
    <div style="text-align: center; margin: 30px 0;">
      <p style="font-size: 14px; color: #6b7280; margin-bottom: 10px;">Add to your calendar:</p>
      <a href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${new Date(event.startTime).toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${new Date(event.endTime).toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent(meetingLink)}" 
         style="display: inline-block; color: #3b82f6; text-decoration: none; margin: 5px 10px;">
        Google Calendar
      </a>
    </div>

    <!-- Questions -->
    <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
      <p style="font-size: 14px; color: #6b7280;">
        Questions? Reply to this email or contact us at 
        <a href="mailto:support@go4itsports.com" style="color: #3b82f6;">support@go4itsports.com</a>
      </p>
    </div>

  </div>

  <!-- Footer -->
  <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
    <p>Go4It Sports Platform | Empowering Student Athletes</p>
    <p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="color: #3b82f6; text-decoration: none;">Visit Website</a> | 
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/privacy" style="color: #3b82f6; text-decoration: none;">Privacy Policy</a>
    </p>
  </div>

</body>
</html>
    `;

    await resend.emails.send({
      from: 'Go4It Sports <events@go4itsports.com>',
      to: registration.email,
      subject: `You're Registered! Parent Night on ${eventDate}`,
      html: emailHtml,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to send confirmation email' },
      { status: 500 }
    );
  }
}
