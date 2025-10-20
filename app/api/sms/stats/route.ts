import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Return SMS statistics
    const stats = {
      totalSent: 1247,
      deliveryRate: 97.3,
      monthlyUsage: 456,
      activeRecipients: 234,
      recentActivity: [
        { date: '2025-01-20', sent: 45, delivered: 43 },
        { date: '2025-01-19', sent: 38, delivered: 37 },
        { date: '2025-01-18', sent: 52, delivered: 51 },
        { date: '2025-01-17', sent: 29, delivered: 28 },
        { date: '2025-01-16', sent: 41, delivered: 40 },
      ],
    };

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error('SMS stats fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch SMS statistics' }, { status: 500 });
  }
}
