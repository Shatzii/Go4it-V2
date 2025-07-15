import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { db } from '@/lib/db'
import { sql } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Mock notifications for now - in production, this would be from a notifications table
    const notifications = [
      {
        id: '1',
        type: 'video',
        title: 'Video Analysis Complete',
        message: 'Your latest performance video has been analyzed. GAR Score: 87.3',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        read: false,
        actionUrl: '/videos/latest'
      },
      {
        id: '2',
        type: 'achievement',
        title: 'Achievement Unlocked!',
        message: 'You earned the "Consistent Performer" badge for 7 days of training',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        read: false,
        actionUrl: '/achievements'
      },
      {
        id: '3',
        type: 'team',
        title: 'Team Practice Reminder',
        message: 'Team practice starts in 1 hour at the main field',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
        read: true,
        actionUrl: '/schedule'
      },
      {
        id: '4',
        type: 'course',
        title: 'Assignment Due Tomorrow',
        message: 'Math assignment "Quadratic Functions" is due tomorrow at 11:59 PM',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
        read: true,
        actionUrl: '/academy/assignments'
      }
    ]

    return NextResponse.json({ notifications })
  } catch (error) {
    console.error('Failed to fetch notifications:', error)
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { type, title, message, actionUrl } = await request.json()

    // In production, this would insert into a notifications table
    const notification = {
      id: Date.now().toString(),
      type,
      title,
      message,
      timestamp: new Date(),
      read: false,
      actionUrl
    }

    return NextResponse.json({ notification })
  } catch (error) {
    console.error('Failed to create notification:', error)
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 })
  }
}