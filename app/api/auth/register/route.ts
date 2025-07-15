import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, createSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { users, insertUserSchema } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = insertUserSchema.parse(body);

    // Check if user already exists
    const existingUser = await db.select().from(users)
      .where(eq(users.email, validatedData.email))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password);

    // Create user
    const newUser = await db.insert(users).values({
      ...validatedData,
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
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}