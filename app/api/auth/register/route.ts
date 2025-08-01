import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/server/storage';
import { sign } from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { username, email, password, firstName, lastName, dateOfBirth, position, sport = 'football' } = data;

    // Validation
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Username, email, and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await storage.getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    const existingUsername = await storage.getUserByUsername(username);
    if (existingUsername) {
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 409 }
      );
    }

    // Create user
    const userData = {
      username,
      email,
      password,
      firstName: firstName || '',
      lastName: lastName || '',
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      position: position || '',
      sport,
      role: 'athlete',
      garScore: '0.0',
      subscriptionPlan: 'free',
      subscriptionStatus: 'active'
    };

    const newUser = await storage.createUser(userData);

    // Generate JWT token
    const token = sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    // Set cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
        sport: newUser.sport
      }
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return response;

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}