import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users, athleteProfiles } from '@/lib/schema';
import { hashPassword, setAuthCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, email, password, name, role = 'student' } = await request.json();

    if (!username || !email || !password || !name) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        username,
        email,
        password: hashedPassword,
        name,
        role,
      })
      .returning();

    // Create athlete profile if role is student
    if (role === 'student') {
      await db.insert(athleteProfiles).values({
        userId: newUser.id,
        bio: `Welcome to Go4It Sports, ${name}!`,
        verifiedStatus: false,
      });
    }

    // Set auth cookie
    await setAuthCookie(newUser.id, newUser.role || 'student');

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = newUser;
    return NextResponse.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}