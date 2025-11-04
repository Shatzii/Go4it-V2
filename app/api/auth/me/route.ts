import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    // For development mode, always return a mock user to allow testing
    // This prevents authentication blocking during development
    const mockUser = {
      id: 'dev-user-123',
      email: 'demo@go4it.com',
      firstName: 'Demo',
      lastName: 'User',
      profileImageUrl: null,
      sport: 'football',
      position: 'quarterback',
      grade: '11th',
      garScore: 78,
      isVerified: true,
      subscriptionTier: 'pro',
      profileSetupComplete: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      user: mockUser,
    });
  } catch (error) {
    console.error('Error in /api/auth/me:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
