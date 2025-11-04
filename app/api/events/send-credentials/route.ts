import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, firstName, lastName, password, userId } = body;

    const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL}/sign-in`;

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Go4It Sports Account</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  
  <!-- Header -->
  <div style="background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="margin: 0; font-size: 28px;">🎉 Welcome to Go4It Sports!</h1>
    <p style="margin: 10px 0 0; font-size: 16px; opacity: 0.9;">Your Account is Ready</p>
  </div>

  <!-- Main Content -->
  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
    
    <p style="font-size: 16px; margin-top: 0;">Hi ${firstName},</p>
    
    <p style="font-size: 16px;">
      Great news! We've created your free account so you can start exploring the Go4It Sports platform 
      right away. Use the credentials below to log in:
    </p>

    <!-- Login Credentials Box -->
    <div style="background: white; border: 2px solid #3b82f6; padding: 25px; margin: 25px 0; border-radius: 10px;">
      <h2 style="margin-top: 0; color: #3b82f6; font-size: 20px; text-align: center;">🔐 Your Login Credentials</h2>
      
      <div style="background: #f3f4f6; padding: 15px; border-radius: 5px; margin: 15px 0;">
        <p style="margin: 5px 0; font-size: 14px; color: #6b7280;">Email Address:</p>
        <p style="margin: 5px 0; font-size: 16px; font-weight: bold; color: #1f2937;">${email}</p>
      </div>

      <div style="background: #f3f4f6; padding: 15px; border-radius: 5px; margin: 15px 0;">
        <p style="margin: 5px 0; font-size: 14px; color: #6b7280;">Temporary Password:</p>
        <p style="margin: 5px 0; font-size: 18px; font-weight: bold; color: #1f2937; font-family: 'Courier New', monospace; letter-spacing: 1px;">${password}</p>
      </div>

      <div style="background: #fef3c7; padding: 12px; border-radius: 5px; margin: 15px 0;">
        <p style="margin: 0; font-size: 13px; color: #92400e;">
          ⚠️ <strong>Important:</strong> Please change your password after your first login for security.
        </p>
      </div>
    </div>

    <!-- Login Button -->
    <div style="text-align: center; margin: 30px 0;">
      <a href="${loginUrl}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-weight: bold; font-size: 16px;">
        Log In Now
      </a>
    </div>

    <!-- What You Can Do -->
    <div style="margin: 30px 0;">
      <h3 style="color: #1f2937; font-size: 18px;">What You Can Do Right Now:</h3>
      <ul style="padding-left: 20px;">
        <li style="margin: 12px 0;">
          <strong>Explore Demo Videos:</strong> See how our AI analyzes athletic performance
        </li>
        <li style="margin: 12px 0;">
          <strong>View Sample Profiles:</strong> Check out example athlete dashboards
        </li>
        <li style="margin: 12px 0;">
          <strong>Learn About Programs:</strong> Discover our training and recruiting support
        </li>
        <li style="margin: 12px 0;">
          <strong>Browse Resources:</strong> Access guides, tips, and educational content
        </li>
        <li style="margin: 12px 0;">
          <strong>Schedule Consultation:</strong> Book a 1-on-1 session with our team
        </li>
      </ul>
    </div>

    <!-- Account Benefits -->
    <div style="background: #e0f2fe; border-left: 4px solid #0ea5e9; padding: 20px; margin: 25px 0; border-radius: 5px;">
      <h3 style="margin-top: 0; color: #0ea5e9; font-size: 18px;">✨ Your Free Account Includes:</h3>
      <ul style="padding-left: 20px; margin: 10px 0;">
        <li style="margin: 8px 0;">Access to demo content and tutorials</li>
        <li style="margin: 8px 0;">Ability to explore platform features</li>
        <li style="margin: 8px 0;">Priority access to parent night events</li>
        <li style="margin: 8px 0;">Educational resources and guides</li>
        <li style="margin: 8px 0;">Special upgrade offers (coming soon!)</li>
      </ul>
    </div>

    <!-- Next Steps -->
    <div style="background: #f3f4f6; padding: 20px; margin: 25px 0; border-radius: 5px;">
      <h3 style="margin-top: 0; color: #1f2937; font-size: 18px;">📝 Next Steps:</h3>
      <ol style="padding-left: 20px; margin: 10px 0;">
        <li style="margin: 10px 0;">Log in using the credentials above</li>
        <li style="margin: 10px 0;">Change your password in account settings</li>
        <li style="margin: 10px 0;">Complete your athlete's profile</li>
        <li style="margin: 10px 0;">Explore the dashboard and features</li>
        <li style="margin: 10px 0;">Attend the parent night event!</li>
      </ol>
    </div>

    <!-- Security Tips -->
    <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
      <h4 style="color: #6b7280; font-size: 14px; margin: 10px 0;">🔒 Security Tips:</h4>
      <ul style="font-size: 13px; color: #6b7280; padding-left: 20px;">
        <li style="margin: 5px 0;">Change your password immediately after logging in</li>
        <li style="margin: 5px 0;">Use a strong, unique password</li>
        <li style="margin: 5px 0;">Never share your login credentials</li>
        <li style="margin: 5px 0;">Enable two-factor authentication (recommended)</li>
      </ul>
    </div>

    <!-- Questions -->
    <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
      <p style="font-size: 14px; color: #6b7280;">
        Need help getting started? Our support team is here for you!
        <br>
        Email: <a href="mailto:support@go4itsports.com" style="color: #3b82f6;">support@go4itsports.com</a>
        <br>
        Or visit our <a href="${process.env.NEXT_PUBLIC_APP_URL}/help" style="color: #3b82f6;">Help Center</a>
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
    <p style="margin-top: 15px; font-size: 11px;">
      This email contains sensitive information. Please keep it secure.
    </p>
  </div>

</body>
</html>
    `;

    await resend.emails.send({
      from: 'Go4It Sports <accounts@go4itsports.com>',
      to: email,
      subject: '🎉 Your Go4It Sports Account is Ready!',
      html: emailHtml,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to send credentials email' },
      { status: 500 }
    );
  }
}
