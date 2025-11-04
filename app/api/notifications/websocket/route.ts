import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
// Real-time notification types
interface Notification {
  id: string;
  type: 'gar_complete' | 'achievement' | 'message' | 'ranking_update' | 'training_reminder';
  title: string;
  message: string;
  userId: string;
  timestamp: number;
  priority: 'low' | 'medium' | 'high';
  read: boolean;
  actionUrl?: string;
}

// In-memory notification store (in production, use Redis/database)
const notifications: Map<string, Notification[]> = new Map();

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Get user notifications
    const userNotifications = notifications.get(userId) || [];

    // Generate sample real-time notifications if none exist
    if (userNotifications.length === 0) {
      const sampleNotifications: Notification[] = [
        {
          id: 'gar_' + Date.now(),
          type: 'gar_complete',
          title: 'GAR Analysis Complete',
          message: 'Your video analysis is ready! GAR Score: 85/100',
          userId,
          timestamp: Date.now(),
          priority: 'high',
          read: false,
          actionUrl: '/video-analysis',
        },
        {
          id: 'achievement_' + Date.now(),
          type: 'achievement',
          title: 'New Achievement Unlocked!',
          message: 'You earned the "Technique Master" badge',
          userId,
          timestamp: Date.now() - 3600000,
          priority: 'medium',
          read: false,
          actionUrl: '/starpath',
        },
        {
          id: 'ranking_' + Date.now(),
          type: 'ranking_update',
          title: 'Ranking Update',
          message: 'You moved up 3 positions in the regional rankings!',
          userId,
          timestamp: Date.now() - 7200000,
          priority: 'medium',
          read: false,
          actionUrl: '/rankings',
        },
      ];

      notifications.set(userId, sampleNotifications);
      return NextResponse.json({
        success: true,
        notifications: sampleNotifications,
        unreadCount: sampleNotifications.filter((n) => !n.read).length,
      });
    }

    return NextResponse.json({
      success: true,
      notifications: userNotifications,
      unreadCount: userNotifications.filter((n) => !n.read).length,
    });
  } catch (error) {
    console.error('Notifications fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, type, title, message, priority = 'medium', actionUrl } = body;

    if (!userId || !type || !title || !message) {
      return NextResponse.json(
        {
          error: 'userId, type, title, and message are required',
        },
        { status: 400 },
      );
    }

    const notification: Notification = {
      id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      title,
      message,
      userId,
      timestamp: Date.now(),
      priority,
      read: false,
      actionUrl,
    };

    // Add to user's notifications
    const userNotifications = notifications.get(userId) || [];
    userNotifications.unshift(notification); // Add to beginning

    // Keep only last 50 notifications per user
    if (userNotifications.length > 50) {
      userNotifications.splice(50);
    }

    notifications.set(userId, userNotifications);

    return NextResponse.json({
      success: true,
      notification,
      message: 'Notification sent successfully',
    });
  } catch (error) {
    console.error('Notification send error:', error);
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, notificationId, read } = body;

    if (!userId || !notificationId) {
      return NextResponse.json(
        {
          error: 'userId and notificationId are required',
        },
        { status: 400 },
      );
    }

    const userNotifications = notifications.get(userId) || [];
    const notification = userNotifications.find((n) => n.id === notificationId);

    if (!notification) {
      return NextResponse.json(
        {
          error: 'Notification not found',
        },
        { status: 404 },
      );
    }

    notification.read = read !== undefined ? read : true;
    notifications.set(userId, userNotifications);

    return NextResponse.json({
      success: true,
      message: 'Notification updated successfully',
    });
  } catch (error) {
    console.error('Notification update error:', error);
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
  }
}
