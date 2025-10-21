import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Demo authentication - accept demo credentials
    if (email === 'demo@go4it.com' && password === 'demo123') {
      const response = NextResponse.json({
        success: true,
        token: 'demo_auth_token_12345',
        user: {
          id: 'demo-user',
          email: 'demo@go4it.com',
          name: 'Demo User',
          role: 'student',
          subscription: 'pro',
        },
        message: 'Login successful',
      });

      // Set authentication cookie
      response.cookies.set('auth_token', 'demo_auth_token_12345', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });

      return response;
    }

    // Admin authentication
    if (email === 'admin@go4itsports.org' && password === 'ZoPulaHoSki47$$') {
      const response = NextResponse.json({
        success: true,
        token: 'admin_auth_token_67890',
        user: {
          id: 'admin-user',
          email: 'admin@go4itsports.org',
          name: 'Admin User',
          role: 'admin',
          subscription: 'enterprise',
        },
        message: 'Admin login successful',
      });

      response.cookies.set('auth_token', 'admin_auth_token_67890', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60,
      });

      return response;
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
