/**
 * Email Templates with Safe String Interpolation
 */

export const emailTemplates = {
  welcome: {
    subject: 'Welcome to Shatzii - Your AI Platform is Ready',
    html: (data: { name: string; dashboardUrl: string }) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #0ea5e9;">Welcome to Shatzii!</h1>
        <p>Hi ${data.name},</p>
        <p>Your AI-powered business automation platform is now ready. You can start optimizing your operations immediately.</p>
        <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>What's Next:</h3>
          <ul>
            <li>Set up your first AI automation workflow</li>
            <li>Configure your business metrics tracking</li>
            <li>Start capturing lost revenue opportunities</li>
          </ul>
        </div>
        <a href="${data.dashboardUrl}" style="background: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Access Your Dashboard</a>
        <p>Questions? Reply to this email or contact our support team.</p>
        <p>Best regards,<br>The Shatzii Team</p>
      </div>
    `,
    text: (data: { name: string; dashboardUrl: string }) => 
      `Welcome to Shatzii!\n\nHi ${data.name},\n\nYour AI-powered business automation platform is ready. Access your dashboard: ${data.dashboardUrl}\n\nBest regards,\nThe Shatzii Team`
  },

  demoConfirmation: {
    subject: 'Demo Request Confirmed - Let\'s Show You Shatzii in Action',
    html: (data: { name: string; company: string; industry: string; useCase: string }) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #10b981;">Demo Request Confirmed</h1>
        <p>Hi ${data.name},</p>
        <p>Thanks for requesting a demo of Shatzii. We're excited to show you how our AI platform can transform your business operations.</p>
        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
          <h3>Demo Details:</h3>
          <p><strong>Company:</strong> ${data.company}</p>
          <p><strong>Industry:</strong> ${data.industry}</p>
          <p><strong>Use Case:</strong> ${data.useCase}</p>
        </div>
        <p>Our team will contact you within 24 hours to schedule your personalized demo.</p>
        <p>In the meantime, feel free to explore our platform capabilities.</p>
        <p>Best regards,<br>The Shatzii Sales Team</p>
      </div>
    `,
    text: (data: { name: string; company: string; industry: string; useCase: string }) =>
      `Demo Request Confirmed\n\nHi ${data.name},\n\nThanks for requesting a demo. We'll contact you within 24 hours to schedule.\n\nCompany: ${data.company}\nIndustry: ${data.industry}\n\nBest regards,\nThe Shatzii Sales Team`
  },

  revenueAlert: {
    subject: (data: { amount: string }) => `Revenue Opportunity Detected - $${data.amount} Recovery Potential`,
    html: (data: { name: string; amount: string; type: string; confidence: string; timeline: string; opportunityUrl: string }) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #ef4444;">Revenue Opportunity Alert</h1>
        <p>Hi ${data.name},</p>
        <p>Our AI has identified a significant revenue recovery opportunity for your business.</p>
        <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
          <h3>Opportunity Details:</h3>
          <p><strong>Recovery Potential:</strong> $${data.amount}</p>
          <p><strong>Type:</strong> ${data.type}</p>
          <p><strong>Confidence:</strong> ${data.confidence}%</p>
          <p><strong>Implementation:</strong> ${data.timeline}</p>
        </div>
        <a href="${data.opportunityUrl}" style="background: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View Full Analysis</a>
        <p>Don't let this revenue slip away. Take action now to capture this opportunity.</p>
        <p>Best regards,<br>Your Shatzii AI Assistant</p>
      </div>
    `,
    text: (data: { name: string; amount: string; type: string; confidence: string; timeline: string; opportunityUrl: string }) =>
      `Revenue Opportunity Alert\n\nHi ${data.name},\n\nRecovery Potential: $${data.amount}\nType: ${data.type}\nConfidence: ${data.confidence}%\n\nView analysis: ${data.opportunityUrl}\n\nBest regards,\nYour Shatzii AI Assistant`
  }
};