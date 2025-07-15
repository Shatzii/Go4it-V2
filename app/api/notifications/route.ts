import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Mock notifications data
    const notifications = [
      {
        id: 1,
        type: 'achievement',
        title: 'New Achievement Unlocked!',
        message: 'You completed your first video analysis.',
        timestamp: new Date().toISOString(),
        read: false
      },
      {
        id: 2,
        type: 'reminder',
        title: 'Training Session Reminder',
        message: 'Your training session starts in 30 minutes.',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: false
      },
      {
        id: 3,
        type: 'update',
        title: 'GAR Score Updated',
        message: 'Your latest GAR score is now available.',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        read: true
      }
    ]
    
    return NextResponse.json({ notifications })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}