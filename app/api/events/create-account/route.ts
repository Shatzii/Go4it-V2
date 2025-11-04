import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, firstName, lastName, registrationId } = body;

    // Generate a random password
    const password = generateSecurePassword();

    try {
      // Create Clerk user
      const clerk = await clerkClient();
      const user = await clerk.users.createUser({
        emailAddress: [email],
        firstName,
        lastName,
        password,
        publicMetadata: {
          role: 'parent',
          registrationId,
          accountType: 'parent_night_attendee',
        },
      });

      // Send welcome email with credentials
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/events/send-credentials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          firstName,
          lastName,
          password,
          userId: user.id,
        }),
      });

      return NextResponse.json({
        success: true,
        userId: user.id,
        message: 'Account created successfully',
      });
    } catch (clerkError: any) {
      // User might already exist
      if (clerkError.code === 'form_identifier_exists') {
        return NextResponse.json({
          success: true,
          message: 'Account already exists',
        });
      }
      throw clerkError;
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}

function generateSecurePassword(): string {
  const length = 12;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  
  // Ensure at least one of each type
  password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
  password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
  password += '0123456789'[Math.floor(Math.random() * 10)];
  password += '!@#$%^&*'[Math.floor(Math.random() * 8)];
  
  // Fill the rest
  for (let i = password.length; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }
  
  // Shuffle
  return password.split('').sort(() => Math.random() - 0.5).join('');
}
