import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');

    // Generate sample SMS logs
    const logs = [
      {
        id: '1',
        recipient: '+1 (555) 123-4567',
        message: 'Your GAR analysis is complete! Score: 8.5/10',
        status: 'delivered',
        timestamp: '2025-01-20T14:30:00',
        type: 'gar_completion'
      },
      {
        id: '2',
        recipient: '+1 (555) 987-6543',
        message: 'New challenge available: Speed Burst Challenge',
        status: 'delivered',
        timestamp: '2025-01-20T12:15:00',
        type: 'challenge_notification'
      },
      {
        id: '3',
        recipient: '+1 (555) 456-7890',
        message: 'Payment successful for Pro subscription renewal',
        status: 'delivered',
        timestamp: '2025-01-20T10:45:00',
        type: 'payment_confirmation'
      },
      {
        id: '4',
        recipient: '+1 (555) 321-9876',
        message: 'Weekly progress update: You have improved by 15%!',
        status: 'sent',
        timestamp: '2025-01-20T09:00:00',
        type: 'progress_update'
      },
      {
        id: '5',
        recipient: '+1 (555) 654-3210',
        message: 'Academy class reminder: Physics at 2 PM today',
        status: 'failed',
        timestamp: '2025-01-19T19:30:00',
        type: 'academy_reminder'
      }
    ];

    return NextResponse.json({
      success: true,
      logs: logs.slice(0, limit)
    });

  } catch (error) {
    console.error('SMS logs fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch SMS logs' },
      { status: 500 }
    );
  }
}