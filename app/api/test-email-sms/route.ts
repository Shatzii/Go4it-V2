import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { credentials, testEmail, testPhone, testCarrier } = body;

    if (!credentials?.smtpUser || !credentials?.smtpPass) {
      return NextResponse.json(
        { success: false, error: 'SMTP credentials required' },
        { status: 400 }
      );
    }

    // Create transporter with provided credentials
    const transporter = nodemailer.createTransport({
      host: credentials.smtpHost || 'smtp.gmail.com',
      port: Number(credentials.smtpPort) || 587,
      secure: false,
      auth: {
        user: credentials.smtpUser,
        pass: credentials.smtpPass,
      },
    });

    // Test email
    const emailResult = await transporter.sendMail({
      from: credentials.smtpFrom || credentials.smtpUser,
      to: testEmail || credentials.smtpUser,
      subject: '✅ Go4it Email Test - Success!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2563eb;">🎉 Email Configuration Successful!</h1>
          
          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="margin-top: 0;">✅ Your SMTP is Working!</h2>
            <p>Your email and SMS system is now ready to use.</p>
            <p><strong>What's enabled:</strong></p>
            <ul>
              <li>✅ Parent Night confirmations</li>
              <li>✅ SMS reminders (via email-to-SMS)</li>
              <li>✅ Automation sequences</li>
              <li>✅ All email features</li>
            </ul>
          </div>

          <div style="background: #dcfce7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">💰 Cost: $0/month</h3>
            <p style="margin: 0;">No Twilio needed - saving $1,296/year!</p>
          </div>

          <div style="background: #fffbeb; padding: 15px; border-left: 4px solid #f59e0b; margin: 20px 0;">
            <h3 style="margin-top: 0;">📝 Next Step:</h3>
            <p>Add these credentials to your Replit Secrets:</p>
            <pre style="background: #fef3c7; padding: 10px; border-radius: 4px; overflow-x: auto;">
SMTP_HOST=${credentials.smtpHost}
SMTP_PORT=${credentials.smtpPort}
SMTP_USER=${credentials.smtpUser}
SMTP_PASS=your-app-password
SMTP_FROM=${credentials.smtpFrom || credentials.smtpUser}
            </pre>
          </div>

          <p style="color: #6b7280; font-size: 14px;">
            This is a test email from your Go4it Sports platform.
          </p>
        </div>
      `,
    });

    // Test SMS if phone provided
    let smsResult = null;
    if (testPhone && testCarrier) {
      const phoneNumber = testPhone.replace(/\D/g, '').replace(/^1/, '');
      const carriers: Record<string, string> = {
        att: '@txt.att.net',
        verizon: '@vtext.com',
        tmobile: '@tmomail.net',
        sprint: '@messaging.sprintpcs.com',
      };
      const gateway = carriers[testCarrier] || carriers.att;
      const smsEmail = `${phoneNumber}${gateway}`;

      try {
        smsResult = await transporter.sendMail({
          from: credentials.smtpFrom || credentials.smtpUser,
          to: smsEmail,
          subject: '',
          text: '✅ Go4it SMS Test - Success! Your FREE SMS is working.',
        });
      } catch (smsError: any) {
        smsResult = { error: smsError.message };
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Email test successful!',
      email: {
        sent: true,
        messageId: emailResult.messageId,
        to: testEmail || credentials.smtpUser,
      },
      sms: smsResult ? { 
        sent: !('error' in smsResult), 
        details: smsResult 
      } : null,
      credentials: {
        host: credentials.smtpHost,
        port: credentials.smtpPort,
        user: credentials.smtpUser,
        configured: true,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to send test email',
        details: error.toString(),
      },
      { status: 500 }
    );
  }
}
