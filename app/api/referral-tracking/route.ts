import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { referralCode, action, metadata } = await request.json();
    
    // Track referral actions (sign-ups, shares, conversions)
    console.log('Referral tracking:', {
      referralCode,
      action,
      metadata,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || 'unknown'
    });

    // In production, this would save to database
    // For now, we'll return success with tracking data
    
    return NextResponse.json({
      success: true,
      tracked: {
        referralCode,
        action,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error: any) {
    console.error('Referral tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track referral' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const referralCode = url.searchParams.get('code');

    if (!referralCode) {
      return NextResponse.json({ error: 'Missing referral code' }, { status: 400 });
    }

    // In production, this would fetch from database
    // For now, return mock referral stats
    const mockStats = {
      referralCode,
      totalShares: Math.floor(Math.random() * 50) + 10,
      totalClicks: Math.floor(Math.random() * 200) + 50,
      totalSignups: Math.floor(Math.random() * 20) + 5,
      conversionRate: '15.2%',
      ranking: Math.floor(Math.random() * 100) + 1,
      rewards: {
        earned: Math.floor(Math.random() * 500) + 100,
        pending: Math.floor(Math.random() * 200) + 50
      }
    };

    return NextResponse.json({
      success: true,
      stats: mockStats
    });
  } catch (error: any) {
    console.error('Referral stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch referral stats' },
      { status: 500 }
    );
  }
}