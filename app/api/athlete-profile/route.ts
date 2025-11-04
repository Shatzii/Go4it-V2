import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { athleteProfiles, users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

export const dynamic = 'force-dynamic';
const createAthleteProfileSchema = z.object({
  userId: z.number(),
  height: z.string().optional(),
  weight: z.string().optional(),
  dominantHand: z.enum(['left', 'right', 'both']).optional(),
  yearsPlaying: z.number().optional(),
  previousInjuries: z.string().optional(),
  phoneNumber: z.string().optional(),
  parentContactName: z.string().optional(),
  parentContactPhone: z.string().optional(),
  parentContactEmail: z.string().email().optional(),
  coachName: z.string().optional(),
  coachPhone: z.string().optional(),
  coachEmail: z.string().email().optional(),
  achievements: z.array(z.string()).optional(),
  specialties: z.array(z.string()).optional(),
  goals: z.string().optional(),
  bio: z.string().optional(),
  socialMediaLinks: z.record(z.string()).optional(),
  profileVisibility: z.enum(['public', 'private', 'coaches-only']).default('public'),
});

const updateAthleteProfileSchema = createAthleteProfileSchema.partial();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createAthleteProfileSchema.parse(body);

    // Check if user exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, validatedData.userId))
      .limit(1);
    if (existingUser.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if profile already exists
    const existingProfile = await db
      .select()
      .from(athleteProfiles)
      .where(eq(athleteProfiles.userId, validatedData.userId))
      .limit(1);
    if (existingProfile.length > 0) {
      return NextResponse.json({ error: 'Profile already exists' }, { status: 400 });
    }

    // Create new athlete profile
    const newProfile = await db
      .insert(athleteProfiles)
      .values({
        ...validatedData,
        isProfileComplete: false,
      })
      .returning();

    return NextResponse.json({ success: true, profile: newProfile[0] });
  } catch (error) {
    console.error('Error creating athlete profile:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 },
      );
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const profile = await db
      .select()
      .from(athleteProfiles)
      .where(eq(athleteProfiles.userId, parseInt(userId)))
      .limit(1);

    if (profile.length === 0) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json({ profile: profile[0] });
  } catch (error) {
    console.error('Error fetching athlete profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, ...updateData } = updateAthleteProfileSchema.parse(body);

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Check if profile exists
    const existingProfile = await db
      .select()
      .from(athleteProfiles)
      .where(eq(athleteProfiles.userId, userId))
      .limit(1);
    if (existingProfile.length === 0) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Update profile
    const updatedProfile = await db
      .update(athleteProfiles)
      .set({
        ...updateData,
        updatedAt: new Date(),
        isProfileComplete: Object.keys(updateData).length >= 5, // Mark as complete if enough fields are filled
      })
      .where(eq(athleteProfiles.userId, userId))
      .returning();

    return NextResponse.json({ success: true, profile: updatedProfile[0] });
  } catch (error) {
    console.error('Error updating athlete profile:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 },
      );
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
