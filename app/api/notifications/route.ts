import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Mock notifications data - in production, this would come from database
    const notifications = [
      {
        id: '1',
        type: 'video',
        title: 'New Video Analysis Complete',
        message: 'Your football performance video has been analyzed with a GAR score of 87.3',
        timestamp: new Date('2024-07-15T14:30:00Z'),
        read: false,
        actionUrl: '/video-analysis/12345',
        priority: 'high'
      },
      {
        id: '2',
        type: 'achievement',
        title: 'Achievement Unlocked: Speed Demon',
        message: 'You achieved a new personal best in the 40-yard dash!',
        timestamp: new Date('2024-07-15T12:15:00Z'),
        read: false,
        actionUrl: '/achievements',
        priority: 'medium'
      },
      {
        id: '3',
        type: 'team',
        title: 'Team Practice Reminder',
        message: 'Football practice scheduled for tomorrow at 3:30 PM',
        timestamp: new Date('2024-07-15T10:00:00Z'),
        read: true,
        actionUrl: '/teams/schedule',
        priority: 'medium'
      },
      {
        id: '4',
        type: 'course',
        title: 'Assignment Due Soon',
        message: 'Math homework is due in 2 days',
        timestamp: new Date('2024-07-14T16:20:00Z'),
        read: true,
        actionUrl: '/academy/assignments',
        priority: 'low'
      },
      {
        id: '5',
        type: 'system',
        title: 'Platform Update',
        message: 'New features have been added to the recruitment center',
        timestamp: new Date('2024-07-14T09:45:00Z'),
        read: false,
        actionUrl: '/recruitment',
        priority: 'low'
      }
    ]

    return NextResponse.json({ notifications })
  } catch (error) {
    console.error('Failed to fetch notifications:', error)
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 })
  }
}