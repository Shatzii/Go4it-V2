import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Check for authentication token in cookies or headers
    const authToken =
      request.cookies.get('auth_token')?.value ||
      request.headers.get('Authorization')?.replace('Bearer ', '');

    if (!authToken) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Mock user data - in production, verify JWT and fetch from database
    const user = {
      id: 'demo-user',
      email: 'demo@go4it.com',
      name: 'Demo User',
      role: 'student',
      subscription: 'pro',
      profileImage: null,
      preferences: {
        sport: 'Basketball',
        notifications: true,
        theme: 'dark',
      },
      stats: {
        garScore: 8.7,
        rank: 42,
        achievements: 18,
        streak: 15,
      },
    };

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('User authentication error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
