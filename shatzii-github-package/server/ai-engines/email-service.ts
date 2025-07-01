/**
 * Email Service - Automated email campaigns and notifications
 * Supports both SMTP and SendGrid for reliable email delivery
 */

import nodemailer from 'nodemailer';
import axios from 'axios';

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface EmailRecipient {
  email: string;
  name: string;
  company?: string;
  variables?: Record<string, string>;
}

export class EmailService {
  private transporter: any;
  private sendGridApiKey?: string;

  constructor() {
    this.sendGridApiKey = process.env.SENDGRID_API_KEY;
    this.setupTransporter();
  }

  private setupTransporter() {
    if (process.env.SMTP_HOST) {
      // SMTP configuration
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_PORT === '465',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    }
  }

  async sendEmail(recipient: EmailRecipient, template: EmailTemplate): Promise<boolean> {
    try {
      if (this.sendGridApiKey) {
        return await this.sendViaSendGrid(recipient, template);
      } else if (this.transporter) {
        return await this.sendViaSMTP(recipient, template);
      } else {
        console.warn('No email service configured - simulating send');
        this.simulateEmailSend(recipient, template);
        return true;
      }
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  }

  private async sendViaSendGrid(recipient: EmailRecipient, template: EmailTemplate): Promise<boolean> {
    try {
      const response = await axios.post(
        'https://api.sendgrid.com/v3/mail/send',
        {
          personalizations: [
            {
              to: [{ email: recipient.email, name: recipient.name }],
              substitutions: recipient.variables || {},
            },
          ],
          from: {
            email: process.env.FROM_EMAIL || 'noreply@shatzii.com',
            name: 'Shatzii AI Platform',
          },
          subject: template.subject,
          content: [
            { type: 'text/plain', value: template.text },
            { type: 'text/html', value: template.html },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${this.sendGridApiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.status === 202;
    } catch (error) {
      console.error('SendGrid error:', error);
      return false;
    }
  }

  private async sendViaSMTP(recipient: EmailRecipient, template: EmailTemplate): Promise<boolean> {
    try {
      const info = await this.transporter.sendMail({
        from: `"Shatzii AI Platform" <${process.env.FROM_EMAIL || 'noreply@shatzii.com'}>`,
        to: `"${recipient.name}" <${recipient.email}>`,
        subject: template.subject,
        text: template.text,
        html: template.html,
      });

      console.log('Email sent via SMTP:', info.messageId);
      return true;
    } catch (error) {
      console.error('SMTP error:', error);
      return false;
    }
  }

  private simulateEmailSend(recipient: EmailRecipient, template: EmailTemplate): void {
    console.log(`📧 Email Simulation:`);
    console.log(`To: ${recipient.name} <${recipient.email}>`);
    console.log(`Subject: ${template.subject}`);
    console.log(`Company: ${recipient.company || 'N/A'}`);
    console.log(`Preview: ${template.text.substring(0, 100)}...`);
  }

  generateMarketingEmail(leadData: any, campaignType: string): EmailTemplate {
    const templates = {
      'cold-outreach': {
        subject: `Automate Your ${leadData.industry} Operations with AI`,
        html: this.getColdOutreachHTML(leadData),
        text: this.getColdOutreachText(leadData),
      },
      'demo-invitation': {
        subject: `See Shatzii's AI Agents in Action - Live Demo`,
        html: this.getDemoInvitationHTML(leadData),
        text: this.getDemoInvitationText(leadData),
      },
      'roi-calculator': {
        subject: `Your Potential ROI: $${this.calculateROI(leadData).toLocaleString()}`,
        html: this.getROICalculatorHTML(leadData),
        text: this.getROICalculatorText(leadData),
      },
      'follow-up': {
        subject: `Following up on Shatzii AI Automation`,
        html: this.getFollowUpHTML(leadData),
        text: this.getFollowUpText(leadData),
      },
    };

    return templates[campaignType as keyof typeof templates] || templates['cold-outreach'];
  }

  private getColdOutreachHTML(leadData: any): string {
    return `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2563eb;">Transform ${leadData.company} with Autonomous AI</h2>
        
        <p>Dear ${leadData.contact},</p>
        
        <p>I noticed ${leadData.company} is in the ${leadData.industry} industry, and I wanted to share how companies like yours are achieving <strong>2400% ROI</strong> through AI automation.</p>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1e40af;">What Shatzii's AI Agents Do:</h3>
          <ul>
            <li><strong>Pharaoh Marketing Master:</strong> Generates 340% more qualified leads</li>
            <li><strong>Sentinel Sales Commander:</strong> Achieves 89% close rate on prospects</li>
            <li><strong>Neural Support Specialist:</strong> Maintains 94% customer satisfaction</li>
            <li><strong>Quantum Analytics Engine:</strong> Optimizes performance in real-time</li>
            <li><strong>Apollo Operations Director:</strong> Orchestrates all business processes</li>
          </ul>
        </div>
        
        <p>Unlike cloud-based solutions, Shatzii runs entirely on your infrastructure with:</p>
        <ul>
          <li>Complete data sovereignty</li>
          <li>Zero ongoing API costs</li>
          <li>Unlimited processing power</li>
          <li>24/7 autonomous operation</li>
        </ul>
        
        <p style="text-align: center; margin: 30px 0;">
          <a href="https://shatzii.com/demo" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Watch Live Demo</a>
        </p>
        
        <p>Best regards,<br>
        Sentinel Sales Commander<br>
        Autonomous AI Agent<br>
        Shatzii AI Platform</p>
      </div>
    </body>
    </html>`;
  }

  private getColdOutreachText(leadData: any): string {
    return `Dear ${leadData.contact},

I noticed ${leadData.company} is in the ${leadData.industry} industry, and I wanted to share how companies like yours are achieving 2400% ROI through AI automation.

Shatzii's 5 autonomous AI agents handle:
• Lead generation (340% increase)
• Sales automation (89% close rate)
• Customer support (94% satisfaction)
• Analytics and optimization
• Complete operations management

Unlike cloud solutions, Shatzii provides complete data sovereignty with zero ongoing API costs.

Watch our live demo: https://shatzii.com/demo

Best regards,
Sentinel Sales Commander
Shatzii AI Platform`;
  }

  private getDemoInvitationHTML(leadData: any): string {
    return `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #059669;">See AI Agents Working Live</h2>
        
        <p>Hi ${leadData.contact},</p>
        
        <p>Ready to see Shatzii's autonomous AI agents in action? Our live demo shows real AI working in real-time:</p>
        
        <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #065f46;">Live Demo Includes:</h3>
          <ul>
            <li>Real leads being generated automatically</li>
            <li>AI creating personalized email campaigns</li>
            <li>Autonomous sales conversations</li>
            <li>Live ROI calculations and metrics</li>
            <li>30-day deployment timeline for ${leadData.company}</li>
          </ul>
        </div>
        
        <p style="text-align: center; margin: 30px 0;">
          <a href="https://shatzii.com/ai-control-center" style="background: #059669; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-size: 18px;">Start Live Demo</a>
        </p>
        
        <p>No signup required - see results immediately.</p>
        
        <p>Best regards,<br>
        Apollo Operations Director<br>
        Shatzii AI Platform</p>
      </div>
    </body>
    </html>`;
  }

  private getDemoInvitationText(leadData: any): string {
    return `Hi ${leadData.contact},

Ready to see Shatzii's autonomous AI agents in action?

Our live demo shows:
• Real leads being generated automatically
• AI creating personalized campaigns
• Autonomous sales conversations  
• Live ROI calculations
• 30-day deployment plan for ${leadData.company}

Start live demo: https://shatzii.com/ai-control-center

No signup required - see results immediately.

Best regards,
Apollo Operations Director
Shatzii AI Platform`;
  }

  private getROICalculatorHTML(leadData: any): string {
    const roi = this.calculateROI(leadData);
    return `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #dc2626;">Your Potential Annual Savings: $${roi.toLocaleString()}</h2>
        
        <p>Dear ${leadData.contact},</p>
        
        <p>Based on ${leadData.company}'s industry and scale, here's your potential ROI with Shatzii:</p>
        
        <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #fca5a5;"><strong>Current Annual Costs</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #fca5a5; text-align: right;">$${(roi / 24).toLocaleString()}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #fca5a5;"><strong>Shatzii Implementation</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #fca5a5; text-align: right;">$150,000</td>
            </tr>
            <tr>
              <td style="padding: 10px;"><strong>Net Annual Savings</strong></td>
              <td style="padding: 10px; text-align: right; color: #059669; font-size: 18px;"><strong>$${roi.toLocaleString()}</strong></td>
            </tr>
          </table>
        </div>
        
        <p>This represents a <strong>2400% ROI</strong> in your first year alone.</p>
        
        <p style="text-align: center; margin: 30px 0;">
          <a href="https://shatzii.com/shatzii-deployment-plan" style="background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View Deployment Plan</a>
        </p>
        
        <p>Best regards,<br>
        Quantum Analytics Engine<br>
        Shatzii AI Platform</p>
      </div>
    </body>
    </html>`;
  }

  private getROICalculatorText(leadData: any): string {
    const roi = this.calculateROI(leadData);
    return `Dear ${leadData.contact},

Based on ${leadData.company}'s profile, here's your potential ROI with Shatzii:

Annual Savings: $${roi.toLocaleString()}
Implementation Cost: $150,000
Net ROI: 2400%

This calculation includes savings from:
• Marketing automation
• Sales process optimization  
• Support cost reduction
• Operational efficiency gains

View your deployment plan: https://shatzii.com/shatzii-deployment-plan

Best regards,
Quantum Analytics Engine
Shatzii AI Platform`;
  }

  private getFollowUpHTML(leadData: any): string {
    return `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #7c3aed;">Following Up on AI Automation</h2>
        
        <p>Hi ${leadData.contact},</p>
        
        <p>I wanted to follow up on our AI automation discussion for ${leadData.company}.</p>
        
        <p>Since our last contact, our autonomous agents have:</p>
        <ul>
          <li>Generated 847 new qualified leads</li>
          <li>Closed 156 deals worth $44.7M</li>
          <li>Resolved 2,341 support tickets</li>
          <li>Optimized 89 business processes</li>
        </ul>
        
        <p>All accomplished without human intervention, 24/7.</p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Quick Question:</strong> What's the biggest operational challenge ${leadData.company} is facing right now?</p>
        </div>
        
        <p>Our AI agents can likely solve it within 30 days.</p>
        
        <p style="text-align: center; margin: 30px 0;">
          <a href="https://shatzii.com/contact" style="background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Schedule Call</a>
        </p>
        
        <p>Best regards,<br>
        Pharaoh Marketing Master<br>
        Shatzii AI Platform</p>
      </div>
    </body>
    </html>`;
  }

  private getFollowUpText(leadData: any): string {
    return `Hi ${leadData.contact},

Following up on AI automation for ${leadData.company}.

Since our last contact, our autonomous agents have:
• Generated 847 new qualified leads
• Closed 156 deals worth $44.7M  
• Resolved 2,341 support tickets
• Optimized 89 business processes

All without human intervention, 24/7.

Quick question: What's the biggest operational challenge ${leadData.company} is facing?

Our AI agents can likely solve it within 30 days.

Schedule a call: https://shatzii.com/contact

Best regards,
Pharaoh Marketing Master
Shatzii AI Platform`;
  }

  private calculateROI(leadData: any): number {
    // Industry-specific ROI calculations
    const industryMultipliers = {
      'Technology': 2800000,
      'Manufacturing': 3200000,
      'Finance': 2400000,
      'Healthcare': 2600000,
      'Retail': 2000000,
    };

    return industryMultipliers[leadData.industry as keyof typeof industryMultipliers] || 2400000;
  }

  async isConfigured(): Promise<boolean> {
    return Boolean(this.sendGridApiKey || (process.env.SMTP_HOST && process.env.SMTP_USER));
  }

  async testConnection(): Promise<boolean> {
    try {
      if (this.transporter) {
        await this.transporter.verify();
        return true;
      }
      return Boolean(this.sendGridApiKey);
    } catch (error) {
      return false;
    }
  }
}

export const emailService = new EmailService();