import sgMail from '@sendgrid/mail';

/**
 * Email notification configuration
 */
interface EmailNotification {
  to: string;
  from: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Initialize SendGrid with API key if available
 */
function initSendGrid() {
  if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    return true;
  }
  return false;
}

/**
 * Send an email notification
 * Falls back to console logging if SendGrid is not configured
 * 
 * @param notification - Email notification data
 * @returns Promise that resolves when email is sent
 */
export async function sendEmailNotification(notification: EmailNotification): Promise<boolean> {
  try {
    const sendGridInitialized = initSendGrid();
    
    if (!sendGridInitialized) {
      // Log the email details for development/testing
      console.log('SendGrid not configured. Email would be sent with the following details:');
      console.log(`To: ${notification.to}`);
      console.log(`From: ${notification.from}`);
      console.log(`Subject: ${notification.subject}`);
      console.log('HTML Content:', notification.html);
      
      // In development, we'll simulate success
      return true;
    }
    
    // Prepare the email
    const msg = {
      to: notification.to,
      from: notification.from,
      subject: notification.subject,
      html: notification.html,
      text: notification.text || notification.html.replace(/<[^>]*>/g, '')
    };
    
    // Send the email
    await sgMail.send(msg);
    console.log(`Email sent to ${notification.to}`);
    return true;
  } catch (error) {
    console.error('Error sending email notification:', error);
    return false;
  }
}