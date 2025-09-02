import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { username, email, password, firstName, lastName, dateOfBirth, sport, position } = data;

    // Validation
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Username, email, and password are required' },
        { status: 400 },
      );
    }

    // Direct SQL insert using the exact database structure
    const hashedPassword = await hash(password, 12);

    // Use dynamic import to avoid module loading issues
    const { db } = await import('@/server/db');
    const { sql } = await import('drizzle-orm');

    try {
      // Check if user exists
      const existingUsers = await db.execute(
        sql`SELECT id FROM users WHERE email = ${email} OR username = ${username} LIMIT 1`,
      );

      if (existingUsers.length > 0) {
        return NextResponse.json(
          { error: 'User with this email or username already exists' },
          { status: 409 },
        );
      }

      // Insert new user with exact column names from database
      const result = await db.execute(sql`
        INSERT INTO users (
          username, 
          email, 
          password, 
          first_name, 
          last_name, 
          date_of_birth, 
          sport, 
          position, 
          role,
          is_active,
          created_at
        ) VALUES (
          ${username},
          ${email},
          ${hashedPassword},
          ${firstName || ''},
          ${lastName || ''},
          ${dateOfBirth ? new Date(dateOfBirth) : null},
          ${sport || 'football'},
          ${position || ''},
          'athlete',
          true,
          NOW()
        )
        RETURNING id, username, email, first_name, last_name
      `);

      if (result.length > 0) {
        const newUser = result[0];
        return NextResponse.json({
          success: true,
          message: 'Account created successfully',
          user: {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            firstName: newUser.first_name,
            lastName: newUser.last_name,
          },
        });
      } else {
        throw new Error('Failed to create user');
      }
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json({ error: 'Database error. Please try again.' }, { status: 500 });
    }
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 });
  }
}
