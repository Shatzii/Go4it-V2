// Open Source Email Automation System
// Replaces SendGrid with SMTP and custom tracking

import nodemailer from 'nodemailer';
import { db } from '@/server/db';
import { prospects } from '@/shared/schema';
import { eq, sql } from 'drizzle-orm';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  fromName: string;
  fromEmail: string;
}

interface EmailTemplate {
  subject: string;
  htmlBody: string;
  textBody: string;
  trackOpens: boolean;
  trackClicks: boolean;
}

interface EmailResult {
  messageId: string;
  status: 'sent' | 'failed';
  error?: string;
  trackingId?: string;
}

export class OpenSourceEmailSystem {
  private transporter: any;
  private config: EmailConfig;
  private baseUrl: string;

  constructor() {
    // Default to Gmail SMTP (free), can be customized
    this.config = {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || 'your-email@gmail.com',
        pass: process.env.SMTP_PASS || 'your-app-password',
      },
      fromName: 'Go4It Sports Team',
      fromEmail: process.env.SMTP_FROM || 'recruiting@go4itsports.com',
    };

    this.baseUrl = process.env.BASE_URL || 'http://localhost:5000';
    this.setupTransporter();
  }

  private setupTransporter() {
    this.transporter = nodemailer.createTransporter({
      host: this.config.host,
      port: this.config.port,
      secure: this.config.secure,
      auth: this.config.auth,
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  // Generate tracking pixel for email opens
  private generateTrackingPixel(prospectId: string, campaignId: string): string {
    const trackingId = Buffer.from(`${prospectId}-${campaignId}-${Date.now()}`).toString('base64');
    return `<img src="${this.baseUrl}/api/email/track/open?id=${trackingId}" width="1" height="1" style="display:none;" />`;
  }

  // Wrap links with click tracking
  private addClickTracking(htmlBody: string, prospectId: string, campaignId: string): string {
    const trackingBase = `${this.baseUrl}/api/email/track/click`;

    // Replace all href attributes
    return htmlBody.replace(/href="([^"]+)"/g, (match, url) => {
      const trackingId = Buffer.from(`${prospectId}-${campaignId}-${url}-${Date.now()}`).toString(
        'base64',
      );
      return `href="${trackingBase}?id=${trackingId}&url=${encodeURIComponent(url)}"`;
    });
  }

  // Personalize email content
  private personalizeContent(content: string, prospect: any): string {
    const replacements = {
      '{name}': prospect.name || 'Athlete',
      '{sport}': prospect.sport || 'your sport',
      '{position}': prospect.position || 'athlete',
      '{school}': prospect.school || 'your school',
      '{state}': prospect.state || 'your state',
      '{classYear}': prospect.classYear || '2025',
      '{ranking}': prospect.nationalRanking
        ? `#${prospect.nationalRanking} nationally`
        : 'highly ranked',
    };

    let personalizedContent = content;
    Object.entries(replacements).forEach(([placeholder, value]) => {
      personalizedContent = personalizedContent.replace(new RegExp(placeholder, 'g'), value);
    });

    return personalizedContent;
  }

  // Send single email with tracking
  async sendEmail(
    prospect: any,
    template: EmailTemplate,
    campaignId: string,
  ): Promise<EmailResult> {
    try {
      // Personalize content
      const personalizedSubject = this.personalizeContent(template.subject, prospect);
      const personalizedHtml = this.personalizeContent(template.htmlBody, prospect);
      const personalizedText = this.personalizeContent(template.textBody, prospect);

      // Add tracking
      let finalHtml = personalizedHtml;
      if (template.trackClicks) {
        finalHtml = this.addClickTracking(finalHtml, prospect.id, campaignId);
      }
      if (template.trackOpens) {
        finalHtml += this.generateTrackingPixel(prospect.id, campaignId);
      }

      const mailOptions = {
        from: `${this.config.fromName} <${this.config.fromEmail}>`,
        to: prospect.email,
        subject: personalizedSubject,
        text: personalizedText,
        html: finalHtml,
        headers: {
          'X-Campaign-ID': campaignId,
          'X-Prospect-ID': prospect.id,
          'List-Unsubscribe': `<${this.baseUrl}/unsubscribe?id=${prospect.id}>`,
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        },
      };

      const info = await this.transporter.sendMail(mailOptions);

      return {
        messageId: info.messageId,
        status: 'sent',
        trackingId: Buffer.from(`${prospect.id}-${campaignId}`).toString('base64'),
      };
    } catch (error) {
      console.error('Email sending failed:', error);
      return {
        messageId: '',
        status: 'failed',
        error: error.message,
      };
    }
  }

  // Bulk email sending with rate limiting
  async sendBulkEmails(
    prospects: any[],
    template: EmailTemplate,
    campaignId: string,
    options: {
      rateLimit: number; // emails per minute
      batchSize: number;
    } = { rateLimit: 60, batchSize: 10 },
  ): Promise<{ sent: number; failed: number; results: EmailResult[] }> {
    const results: EmailResult[] = [];
    let sent = 0;
    let failed = 0;

    const delayMs = (60 * 1000) / options.rateLimit; // Delay between emails

    for (let i = 0; i < prospects.length; i += options.batchSize) {
      const batch = prospects.slice(i, i + options.batchSize);

      const batchPromises = batch.map(async (prospect) => {
        const result = await this.sendEmail(prospect, template, campaignId);

        // Update prospect record
        await db
          .update(prospects)
          .set({
            campaignId,
            emailStatus: result.status,
            contactAttempts: sql`${prospects.contactAttempts} + 1`,
            lastContactDate: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(prospects.id, prospect.id));

        if (result.status === 'sent') {
          sent++;
        } else {
          failed++;
        }

        return result;
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);

      // Rate limiting delay
      if (i + options.batchSize < prospects.length) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * options.batchSize));
      }
    }

    return { sent, failed, results };
  }

  // Test email configuration
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      await this.transporter.verify();
      return { success: true, message: 'SMTP connection successful' };
    } catch (error) {
      return { success: false, message: `SMTP connection failed: ${error.message}` };
    }
  }

  // Create professional email templates for athlete recruitment
  static getRecruitmentTemplates() {
    return {
      garIntroduction: {
        subject: 'Unlock Your Athletic Potential - Free GAR Analysis',
        htmlBody: `
          <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
            <div style="background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 20px; text-align: center;">
              <h1>Hey {name}! 🏀</h1>
              <p>Your {sport} performance caught our attention</p>
            </div>
            
            <div style="padding: 30px; background: #f8fafc;">
              <p>Hi {name},</p>
              
              <p>I noticed your impressive {sport} performance at {school}. Your skills as a {position} really stand out!</p>
              
              <p><strong>Quick question:</strong> Have you calculated your GAR (Growth & Ability Rating) score yet?</p>
              
              <div style="background: #dbeafe; padding: 15px; border-left: 4px solid #3b82f6; margin: 20px 0;">
                <p><strong>Why GAR Scores Matter:</strong></p>
                <ul>
                  <li>Top college coaches are using GAR for recruiting</li>
                  <li>Athletes like you with strong {position} skills often score higher than expected</li>
                  <li>It's completely free and takes just 2 minutes</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://go4itsports.com/gar-analysis?ref=recruit&prospect={name}" 
                   style="background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                  Get My FREE GAR Analysis
                </a>
              </div>
              
              <p>This could be the game-changer for your recruiting journey.</p>
              
              <p>Best regards,<br>
              Go4It Sports Team<br>
              <em>Helping athletes reach their potential</em></p>
            </div>
            
            <div style="background: #374151; color: #9ca3af; padding: 15px; text-align: center; font-size: 12px;">
              <p>If you no longer wish to receive these emails, you can <a href="#" style="color: #60a5fa;">unsubscribe here</a>.</p>
            </div>
          </div>
        `,
        textBody: `
Hi {name},

I noticed your impressive {sport} performance at {school}. Your skills as a {position} really stand out!

Quick question: Have you calculated your GAR (Growth & Ability Rating) score yet?

Top college coaches are using GAR scores to discover hidden talent. Athletes like you with strong {position} skills often score higher than they expect.

Get your free GAR analysis: https://go4itsports.com/gar-analysis?ref=recruit

This takes just 2 minutes and could be a game-changer for your recruiting journey.

Best regards,
Go4It Sports Team
        `,
        trackOpens: true,
        trackClicks: true,
      },

      followUp: {
        subject: 'Still thinking about your GAR score, {name}?',
        htmlBody: `
          <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
            <div style="padding: 30px; background: #f8fafc;">
              <p>Hi {name},</p>
              
              <p>I reached out a few days ago about your GAR score analysis.</p>
              
              <p>I get it - you're probably getting tons of recruiting emails. But this is different.</p>
              
              <div style="background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 20px 0;">
                <p><strong>Here's what makes GAR special:</strong></p>
                <ul>
                  <li>It's not just another recruiting service</li>
                  <li>We use AI to analyze your actual game footage</li>
                  <li>You get specific improvement recommendations</li>
                  <li>It's helped {ranking} athletes get noticed by D1 coaches</li>
                </ul>
              </div>
              
              <p>As a {position} from {state}, you have qualities that coaches are actively looking for right now.</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://go4itsports.com/gar-analysis?ref=followup" 
                   style="background: #f59e0b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                  Claim My Free Analysis
                </a>
              </div>
              
              <p>Takes 2 minutes. Could change everything.</p>
              
              <p>Best,<br>
              Go4It Sports Team</p>
            </div>
          </div>
        `,
        textBody: `
Hi {name},

I reached out about your GAR score analysis.

As a {position} from {state}, you have qualities that coaches are actively looking for.

Our AI analyzes your actual game footage and gives specific improvement recommendations.

Claim your free analysis: https://go4itsports.com/gar-analysis?ref=followup

Takes 2 minutes. Could change everything.

Best,
Go4It Sports Team
        `,
        trackOpens: true,
        trackClicks: true,
      },
    };
  }
}
