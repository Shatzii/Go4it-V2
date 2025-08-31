import { NextRequest, NextResponse } from 'next/server';
import { storage } from '../../../server/storage';

// Mock email service - replace with actual service like SendGrid when keys are available
const mockEmailService = {
  async sendEmail(to: string, subject: string, content: string, type: string = 'html') {
    console.log(`Mock Email Sent:
      To: ${to}
      Subject: ${subject}
      Type: ${type}
      Content: ${content}
    `);

    return {
      messageId: `msg_${Date.now()}`,
      status: 'sent',
      timestamp: new Date().toISOString(),
    };
  },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, userId, recipientEmail, type, data } = body;

    switch (action) {
      case 'send-notification':
        if (!userId || !type) {
          return NextResponse.json(
            { error: 'User ID and notification type required' },
            { status: 400 },
          );
        }

        const notification = await createNotification(userId, type, data);

        // Send email if recipient email is provided
        if (recipientEmail) {
          await sendEmailNotification(recipientEmail, type, data);
        }

        return NextResponse.json({
          success: true,
          notificationId: notification.id,
          message: 'Notification sent successfully',
        });

      case 'get-notifications':
        if (!userId) {
          return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        const notifications = await storage.getUserNotifications(userId);
        return NextResponse.json(notifications);

      case 'mark-read':
        const { notificationId } = body;
        if (!notificationId) {
          return NextResponse.json({ error: 'Notification ID required' }, { status: 400 });
        }

        await storage.markNotificationAsRead(notificationId);
        return NextResponse.json({ success: true });

      case 'get-notification-settings':
        if (!userId) {
          return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        const settings = await storage.getNotificationSettings(userId);
        return NextResponse.json(settings);

      case 'update-notification-settings':
        const { settings: newSettings } = body;
        if (!userId || !newSettings) {
          return NextResponse.json({ error: 'User ID and settings required' }, { status: 400 });
        }

        await storage.updateNotificationSettings(userId, newSettings);
        return NextResponse.json({ success: true });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Notification error:', error);
    return NextResponse.json({ error: 'Notification processing failed' }, { status: 500 });
  }
}

async function createNotification(userId: string, type: string, data: any) {
  const notification = {
    id: `notif_${Date.now()}`,
    userId,
    type,
    title: getNotificationTitle(type, data),
    message: getNotificationMessage(type, data),
    data,
    read: false,
    createdAt: new Date().toISOString(),
  };

  await storage.createNotification(notification);
  return notification;
}

async function sendEmailNotification(email: string, type: string, data: any) {
  const subject = getNotificationTitle(type, data);
  const content = getEmailContent(type, data);

  return await mockEmailService.sendEmail(email, subject, content);
}

function getNotificationTitle(type: string, data: any): string {
  switch (type) {
    case 'assignment-due':
      return `Assignment Due: ${data.assignmentName}`;
    case 'grade-posted':
      return `New Grade Posted: ${data.courseName}`;
    case 'achievement-earned':
      return `Achievement Unlocked: ${data.achievementName}`;
    case 'safety-alert':
      return `Safety Alert: ${data.alertType}`;
    case 'progress-report':
      return `Progress Report Available`;
    case 'enrollment-confirmed':
      return `Enrollment Confirmed: ${data.courseName}`;
    case 'payment-confirmed':
      return `Payment Confirmed`;
    case 'parent-teacher-conference':
      return `Parent-Teacher Conference Scheduled`;
    default:
      return 'Notification from Universal One School';
  }
}

function getNotificationMessage(type: string, data: any): string {
  switch (type) {
    case 'assignment-due':
      return `Your assignment "${data.assignmentName}" is due on ${data.dueDate}.`;
    case 'grade-posted':
      return `Your grade for "${data.assignmentName}" is now available: ${data.grade}%`;
    case 'achievement-earned':
      return `Congratulations! You've earned the "${data.achievementName}" achievement.`;
    case 'safety-alert':
      return `A safety concern has been identified. Please review the details.`;
    case 'progress-report':
      return `Your progress report is ready for review.`;
    case 'enrollment-confirmed':
      return `You have been successfully enrolled in ${data.courseName}.`;
    case 'payment-confirmed':
      return `Your payment of $${data.amount} has been processed successfully.`;
    case 'parent-teacher-conference':
      return `Your conference is scheduled for ${data.date} at ${data.time}.`;
    default:
      return 'You have a new notification from Universal One School.';
  }
}

function getEmailContent(type: string, data: any): string {
  const baseStyle = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0;">Universal One School</h1>
      </div>
      <div style="background: white; padding: 20px; border: 1px solid #e0e0e0; border-radius: 0 0 8px 8px;">
  `;

  const baseFooter = `
      </div>
      <div style="text-align: center; padding: 20px; color: #666;">
        <p>© 2025 Universal One School. All rights reserved.</p>
        <p style="font-size: 12px;">This is an automated message from our educational platform.</p>
      </div>
    </div>
  `;

  switch (type) {
    case 'assignment-due':
      return `${baseStyle}
        <h2 style="color: #333;">Assignment Due Reminder</h2>
        <p>Dear Student,</p>
        <p>This is a reminder that your assignment <strong>"${data.assignmentName}"</strong> is due on <strong>${data.dueDate}</strong>.</p>
        <p>Please make sure to submit your work on time to avoid any late penalties.</p>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <p><strong>Course:</strong> ${data.courseName}</p>
          <p><strong>Due Date:</strong> ${data.dueDate}</p>
          <p><strong>Assignment:</strong> ${data.assignmentName}</p>
        </div>
        <p>Best regards,<br>The Universal One School Team</p>
        ${baseFooter}`;

    case 'grade-posted':
      return `${baseStyle}
        <h2 style="color: #333;">New Grade Posted</h2>
        <p>Dear Student,</p>
        <p>Your grade for <strong>"${data.assignmentName}"</strong> has been posted.</p>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <p><strong>Course:</strong> ${data.courseName}</p>
          <p><strong>Assignment:</strong> ${data.assignmentName}</p>
          <p><strong>Grade:</strong> <span style="color: #28a745; font-size: 18px; font-weight: bold;">${data.grade}%</span></p>
        </div>
        <p>Keep up the great work!</p>
        <p>Best regards,<br>The Universal One School Team</p>
        ${baseFooter}`;

    case 'achievement-earned':
      return `${baseStyle}
        <h2 style="color: #333;">🏆 Achievement Unlocked!</h2>
        <p>Dear Student,</p>
        <p>Congratulations! You've earned a new achievement: <strong>"${data.achievementName}"</strong></p>
        <div style="background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%); padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <div style="font-size: 48px; margin-bottom: 10px;">🏆</div>
          <h3 style="margin: 0; color: #333;">${data.achievementName}</h3>
          <p style="margin: 10px 0 0 0; color: #666;">${data.description}</p>
        </div>
        <p>Keep up the excellent work and continue your learning journey!</p>
        <p>Best regards,<br>The Universal One School Team</p>
        ${baseFooter}`;

    case 'safety-alert':
      return `${baseStyle}
        <h2 style="color: #dc3545;">🔒 Safety Alert</h2>
        <p>Dear Parent/Guardian,</p>
        <p>This is an important safety notification regarding your child's account.</p>
        <div style="background: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <p><strong>Alert Type:</strong> ${data.alertType}</p>
          <p><strong>Severity:</strong> ${data.severity}</p>
          <p><strong>Description:</strong> ${data.description}</p>
        </div>
        <p>Please log into your parent portal to review the full details and take any necessary actions.</p>
        <p>If you have any concerns, please contact our support team immediately.</p>
        <p>Best regards,<br>The Universal One School Safety Team</p>
        ${baseFooter}`;

    default:
      return `${baseStyle}
        <h2 style="color: #333;">Notification</h2>
        <p>Dear User,</p>
        <p>You have received a new notification from Universal One School.</p>
        <p>Please log into your account to view the details.</p>
        <p>Best regards,<br>The Universal One School Team</p>
        ${baseFooter}`;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    let notifications;
    if (type) {
      notifications = await storage.getUserNotificationsByType(userId, type);
    } else {
      notifications = await storage.getUserNotifications(userId);
    }

    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}
