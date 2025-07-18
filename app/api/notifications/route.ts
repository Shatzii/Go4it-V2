import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Mock notifications for now - in a real app, this would fetch from database
    const notifications = [
      {
        id: '1',
        type: 'achievement',
        title: 'New Achievement Unlocked!',
        message: 'You have successfully completed your first video analysis',
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        read: false,
        actionUrl: '/dashboard',
        priority: 'medium'
      },
      {
        id: '2',
        type: 'video',
        title: 'Video Analysis Complete',
        message: 'Your recent training video has been analyzed with a GAR score of 85',
        timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
        read: false,
        actionUrl: '/video-analysis',
        priority: 'high'
      },
      {
        id: '3',
        type: 'system',
        title: 'Platform Update',
        message: 'New features have been added to the AI coaching system',
        timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
        read: true,
        priority: 'low'
      }
    ]

    return NextResponse.json({ notifications })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 })
  }
}