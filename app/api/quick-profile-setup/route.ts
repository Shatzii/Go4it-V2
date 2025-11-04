import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { quickProfileSetup, users, athleteProfiles } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
const quickSetupSchema = z.object({
  userId: z.number(),
  setupStep: z.enum(['basic-info', 'athletics', 'contacts', 'goals', 'complete']),
  setupData: z.record(z.any()).optional(),
});

const oneClickSetupSchema = z.object({
  userId: z.number(),
  sport: z.string(),
  position: z.string(),
  graduationYear: z.number(),
  height: z.string().optional(),
  weight: z.string().optional(),
  yearsPlaying: z.number().optional(),
  goals: z.string().optional(),
  phoneNumber: z.string().optional(),
  parentContactName: z.string().optional(),
  parentContactPhone: z.string().optional(),
  parentContactEmail: z.string().email().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = quickSetupSchema.parse(body);

    // Check if user exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, validatedData.userId))
      .limit(1);
    if (existingUser.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create or update quick setup record
    const existingSetup = await db
      .select()
      .from(quickProfileSetup)
      .where(eq(quickProfileSetup.userId, validatedData.userId))
      .limit(1);

    if (existingSetup.length > 0) {
      // Update existing setup
      const updatedSetup = await db
        .update(quickProfileSetup)
        .set({
          setupStep: validatedData.setupStep,
          setupData: validatedData.setupData,
          isCompleted: validatedData.setupStep === 'complete',
          updatedAt: new Date(),
        })
        .where(eq(quickProfileSetup.userId, validatedData.userId))
        .returning();

      return NextResponse.json({ success: true, setup: updatedSetup[0] });
    } else {
      // Create new setup
      const newSetup = await db
        .insert(quickProfileSetup)
        .values({
          ...validatedData,
          isCompleted: validatedData.setupStep === 'complete',
        })
        .returning();

      return NextResponse.json({ success: true, setup: newSetup[0] });
    }
  } catch (error) {
    console.error('Error creating/updating quick profile setup:', error);
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

    const setup = await db
      .select()
      .from(quickProfileSetup)
      .where(eq(quickProfileSetup.userId, parseInt(userId)))
      .limit(1);

    if (setup.length === 0) {
      return NextResponse.json({ error: 'Setup not found' }, { status: 404 });
    }

    return NextResponse.json({ setup: setup[0] });
  } catch (error) {
    console.error('Error fetching quick profile setup:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// One-click profile creation endpoint
export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'one-click-create') {
      const body = await request.json();
      const validatedData = oneClickSetupSchema.parse(body);

      // Check if user exists
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.id, validatedData.userId))
        .limit(1);
      if (existingUser.length === 0) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // Update user basic info
      await db
        .update(users)
        .set({
          sport: validatedData.sport,
          position: validatedData.position,
          graduationYear: validatedData.graduationYear,
        })
        .where(eq(users.id, validatedData.userId));

      // Create or update athlete profile
      const existingProfile = await db
        .select()
        .from(athleteProfiles)
        .where(eq(athleteProfiles.userId, validatedData.userId))
        .limit(1);

      if (existingProfile.length > 0) {
        // Update existing profile
        const updatedProfile = await db
          .update(athleteProfiles)
          .set({
            height: validatedData.height,
            weight: validatedData.weight,
            yearsPlaying: validatedData.yearsPlaying,
            goals: validatedData.goals,
            phoneNumber: validatedData.phoneNumber,
            parentContactName: validatedData.parentContactName,
            parentContactPhone: validatedData.parentContactPhone,
            parentContactEmail: validatedData.parentContactEmail,
            isProfileComplete: true,
            updatedAt: new Date(),
          })
          .where(eq(athleteProfiles.userId, validatedData.userId))
          .returning();

        // Mark quick setup as complete
        await db
          .update(quickProfileSetup)
          .set({
            setupStep: 'complete',
            isCompleted: true,
            updatedAt: new Date(),
          })
          .where(eq(quickProfileSetup.userId, validatedData.userId));

        return NextResponse.json({
          success: true,
          message: 'Profile created successfully!',
          profile: updatedProfile[0],
        });
      } else {
        // Create new profile
        const newProfile = await db
          .insert(athleteProfiles)
          .values({
            userId: validatedData.userId,
            height: validatedData.height,
            weight: validatedData.weight,
            yearsPlaying: validatedData.yearsPlaying,
            goals: validatedData.goals,
            phoneNumber: validatedData.phoneNumber,
            parentContactName: validatedData.parentContactName,
            parentContactPhone: validatedData.parentContactPhone,
            parentContactEmail: validatedData.parentContactEmail,
            isProfileComplete: true,
            profileVisibility: 'public',
          })
          .returning();

        // Create quick setup record
        await db.insert(quickProfileSetup).values({
          userId: validatedData.userId,
          setupStep: 'complete',
          setupData: validatedData,
          isCompleted: true,
        });

        return NextResponse.json({
          success: true,
          message: 'Profile created successfully!',
          profile: newProfile[0],
        });
      }
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in one-click profile creation:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 },
      );
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
