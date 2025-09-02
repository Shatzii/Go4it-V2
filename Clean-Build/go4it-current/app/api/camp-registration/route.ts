import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { campRegistrations, users } from '@/shared/schema';
import { hash } from 'bcryptjs';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    let userId = null;
    let accountCreated = false;

    // Check if user is creating a new account
    if (data.createAccount && data.username && data.password) {
      try {
        // Check if username/email already exists
        const existingUser = await db
          .select()
          .from(users)
          .where(eq(users.email, data.email))
          .limit(1);

        if (existingUser.length > 0) {
          return NextResponse.json(
            { error: 'An account with this email already exists. Please log in first.' },
            { status: 400 },
          );
        }

        // Hash password
        const hashedPassword = await hash(data.password, 12);

        // Create new user account
        const [newUser] = await db
          .insert(users)
          .values({
            username: data.username,
            email: data.email,
            password: hashedPassword,
            firstName: data.firstName,
            lastName: data.lastName,
            dateOfBirth: new Date(data.dateOfBirth),
            position: data.position,
            sport: 'football',
            role: 'athlete',
          })
          .returning();

        userId = newUser.id;
        accountCreated = true;
      } catch (error) {
        console.error('Account creation error:', error);
        return NextResponse.json(
          { error: 'Failed to create account. Please try again.' },
          { status: 500 },
        );
      }
    }

    // Create camp registration
    const registrationData = {
      userId,
      campId: data.campId,
      campName: data.campName,
      campDates: data.campDates,
      campLocation: data.campLocation,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      dateOfBirth: new Date(data.dateOfBirth),
      parentName: data.parentName,
      parentEmail: data.parentEmail,
      emergencyContact: data.emergencyContact,
      emergencyPhone: data.emergencyPhone,
      position: data.position,
      experience: data.experience,
      garAnalysis: data.garAnalysis || true,
      usaFootballMembership: data.usaFootballMembership || true,
      actionNetworkOptIn: data.actionNetworkOptIn || true,
      registrationFee: data.registrationFee,
      status: 'pending',
      paymentStatus: 'pending',
    };

    const [registration] = await db.insert(campRegistrations).values(registrationData).returning();

    // TODO: Integrate with Action Network API
    // This is where you would send the registration to Action Network
    if (data.actionNetworkOptIn) {
      try {
        // Action Network API integration would go here
        // const actionNetworkResponse = await submitToActionNetwork(registrationData);
        // registration.actionNetworkId = actionNetworkResponse.id;

        console.log('Action Network integration needed for:', registration.id);
      } catch (error) {
        console.error('Action Network integration error:', error);
        // Don't fail the registration if Action Network fails
      }
    }

    return NextResponse.json({
      success: true,
      registrationId: registration.id,
      accountCreated,
      message: 'Registration submitted successfully',
    });
  } catch (error) {
    console.error('Camp registration error:', error);
    return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 });
  }
}

// TODO: Action Network integration function
// async function submitToActionNetwork(registrationData: any) {
//   const actionNetworkAPI = process.env.ACTION_NETWORK_API_KEY;
//   const actionNetworkUrl = process.env.ACTION_NETWORK_URL;
//
//   if (!actionNetworkAPI || !actionNetworkUrl) {
//     throw new Error('Action Network credentials not configured');
//   }
//
//   const response = await fetch(actionNetworkUrl, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${actionNetworkAPI}`
//     },
//     body: JSON.stringify({
//       email: registrationData.email,
//       first_name: registrationData.firstName,
//       last_name: registrationData.lastName,
//       phone: registrationData.phone,
//       custom_fields: {
//         camp_id: registrationData.campId,
//         position: registrationData.position,
//         parent_email: registrationData.parentEmail
//       }
//     })
//   });
//
//   if (!response.ok) {
//     throw new Error('Action Network submission failed');
//   }
//
//   return await response.json();
// }
