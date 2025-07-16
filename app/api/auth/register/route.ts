import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, createJWT } from '@/lib/auth';
import { db } from '@/lib/db';
import { users, insertUserSchema } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = insertUserSchema.parse(body);

    // Check if user already exists (email or username)
    const existingUserByEmail = await db.select().from(users)
      .where(eq(users.email, validatedData.email))
      .limit(1);

    if (existingUserByEmail.length > 0) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    const existingUserByUsername = await db.select().from(users)
      .where(eq(users.username, validatedData.username))
      .limit(1);

    if (existingUserByUsername.length > 0) {
      return NextResponse.json({ error: 'Username already taken' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password);

    // Create user with proper error handling
    const newUser = await db.insert(users).values({
      username: validatedData.username,
      email: validatedData.email,
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      password: hashedPassword,
    }).returning();

    // Create JWT token
    const token = await createJWT(newUser[0].id);

    return NextResponse.json({ 
      user: {
        id: newUser[0].id,
        email: newUser[0].email,
        username: newUser[0].username,
        role: newUser[0].role,
        firstName: newUser[0].firstName,
        lastName: newUser[0].lastName,
        sport: newUser[0].sport,
        position: newUser[0].position
      },
      token 
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle specific database errors
    if (error.code === '23505') {
      if (error.detail?.includes('email')) {
        return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
      }
      if (error.detail?.includes('username')) {
        return NextResponse.json({ error: 'Username already taken' }, { status: 400 });
      }
    }
    
    return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 });
  }
}