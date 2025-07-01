/**
 * Email Service with SendGrid and SMTP Support
 * Real email sending with templates and tracking
 */

import sgMail from '@sendgrid/mail';
import nodemailer from 'nodemailer';
import { emailTemplates } from './email-templates';

interface EmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  template?: string;
  templateData?: Record<string, any>;
}

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export class EmailService {
  private sendgridClient: typeof sgMail;
  private smtpTransporter: nodemailer.Transporter | null = null;
  private templates: Map<string, EmailTemplate> = new Map();

  constructor() {
    // Initialize SendGrid if API key is available
    if (process.env.SENDGRID_API_KEY) {
      this.sendgridClient = sgMail;
      this.sendgridClient.setApiKey(process.env.SENDGRID_API_KEY);
      console.log('📧 SendGrid email service initialized');
    }

    // Initialize SMTP if configured
    if (process.env.SMTP_HOST) {
      this.smtpTransporter = nodemailer.createTransporter({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
      console.log('📧 SMTP email service initialized');
    }

    this.initializeTemplates();
  }

  private initializeTemplates(): void {
    console.log('📧 Email service initialized - templates handled by external module');
  }

  private processTemplate(templateName: string, data: Record<string, any>): EmailTemplate {
    const template = this.templates.get(templateName);
    if (!template) {
      throw new Error(`Email template '${templateName}' not found`);
    }

    const processText = (text: string): string => {
      return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        return data[key] || match;
      });
    };

    return {
      subject: processText(template.subject),
      html: processText(template.html),
      text: processText(template.text)
    };
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      let emailContent: { subject: string; html?: string; text?: string };

      if (options.template) {
        const processedTemplate = this.processTemplate(options.template, options.templateData || {});
        emailContent = processedTemplate;
      } else {
        emailContent = {
          subject: options.subject,
          html: options.html,
          text: options.text
        };
      }

      const fromEmail = options.from || process.env.DEFAULT_FROM_EMAIL || 'noreply@shatzii.com';

      // Try SendGrid first
      if (this.sendgridClient && process.env.SENDGRID_API_KEY) {
        const msg = {
          to: Array.isArray(options.to) ? options.to : [options.to],
          from: fromEmail,
          subject: emailContent.subject,
          text: emailContent.text,
          html: emailContent.html
        };

        await this.sendgridClient.send(msg);
        console.log(`📧 Email sent via SendGrid to: ${options.to}`);
        return true;
      }

      // Fallback to SMTP
      if (this.smtpTransporter) {
        const mailOptions = {
          from: fromEmail,
          to: options.to,
          subject: emailContent.subject,
          text: emailContent.text,
          html: emailContent.html
        };

        await this.smtpTransporter.sendMail(mailOptions);
        console.log(`📧 Email sent via SMTP to: ${options.to}`);
        return true;
      }

      // If no email service is configured, log the email
      console.log('📧 No email service configured. Email content:');
      console.log(`To: ${options.to}`);
      console.log(`Subject: ${emailContent.subject}`);
      console.log(`Text: ${emailContent.text}`);
      
      return false;
    } catch (error) {
      console.error('📧 Email sending failed:', error);
      return false;
    }
  }

  async sendWelcomeEmail(userEmail: string, userName: string): Promise<boolean> {
    const templateData = {
      name: userName,
      dashboardUrl: `${process.env.BASE_URL || 'http://localhost:5000'}/dashboard`
    };

    return this.sendEmail({
      to: userEmail,
      subject: emailTemplates.welcome.subject,
      html: emailTemplates.welcome.html(templateData),
      text: emailTemplates.welcome.text(templateData)
    });
  }

  async sendDemoConfirmation(demoData: {
    email: string;
    name: string;
    company: string;
    industry: string;
    useCase: string;
  }): Promise<boolean> {
    return this.sendEmail({
      to: demoData.email,
      subject: emailTemplates.demoConfirmation.subject,
      html: emailTemplates.demoConfirmation.html(demoData),
      text: emailTemplates.demoConfirmation.text(demoData)
    });
  }

  async sendRevenueAlert(userEmail: string, userName: string, opportunity: {
    amount: number;
    type: string;
    confidence: number;
    timeline: string;
    id: string;
  }): Promise<boolean> {
    const templateData = {
      name: userName,
      amount: opportunity.amount.toLocaleString(),
      type: opportunity.type,
      confidence: opportunity.confidence.toString(),
      timeline: opportunity.timeline,
      opportunityUrl: `${process.env.BASE_URL || 'http://localhost:5000'}/revenue-recovery?opportunity=${opportunity.id}`
    };

    return this.sendEmail({
      to: userEmail,
      subject: emailTemplates.revenueAlert.subject(templateData),
      html: emailTemplates.revenueAlert.html(templateData),
      text: emailTemplates.revenueAlert.text(templateData)
    });
  }

  getServiceStatus(): { sendgrid: boolean; smtp: boolean; templates: number } {
    return {
      sendgrid: !!process.env.SENDGRID_API_KEY,
      smtp: !!this.smtpTransporter,
      templates: this.templates.size
    };
  }
}

export const emailService = new EmailService();