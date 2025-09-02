import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const {
      email,
      password,
      firstName,
      lastName,
      position,
      sport = 'football',
      grade,
      acceptTerms,
    } = data;

    // Validation
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Email, password, first name, and last name are required' },
        { status: 400 },
      );
    }

    if (acceptTerms !== true) {
      return NextResponse.json(
        { error: 'You must accept the Terms of Service and Privacy Policy' },
        { status: 400 },
      );
    }

    // Basic validation
    const emailOk = /.+@.+\..+/.test(email);
    if (!emailOk) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    if (String(password).length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 },
      );
    }

    // For development, create user directly
    const newUser = {
      id: `user-${Date.now()}`,
      email: email,
      firstName: firstName,
      lastName: lastName,
      sport: sport,
      position: position,
      grade: grade,
      garScore: 0,
      isVerified: false,
      subscriptionTier: 'free',
      profileSetupComplete: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Set auth cookie
    const response = NextResponse.json({
      success: true,
      token: 'dev-session',
      message: 'Registration successful! Welcome to Go4It Sports.',
      user: newUser,
    });

    response.cookies.set('auth-token', 'dev-session', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 });
  }
}
