import nodemailer from 'nodemailer';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  from?: string;
}

export async function sendEmailNodemailer({ to, subject, text, html, from }: EmailOptions) {
  // Skip if SMTP not configured (won't break deployment)
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return {
      messageId: 'skipped-no-credentials',
      accepted: [],
      rejected: [],
      pending: [],
      skipped: true,
      reason: 'SMTP credentials not configured - add in admin panel after deployment',
    };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: from || process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
    html,
  });
  return info;
}
