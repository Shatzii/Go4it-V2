import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { userPreferences } from '@/shared/enhanced-schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const preferences = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, user.id))
      .limit(1);

    if (preferences.length === 0) {
      // Create default preferences
      const [defaultPrefs] = await db
        .insert(userPreferences)
        .values({
          userId: user.id,
          theme: 'default',
          sensoryPreferences: {
            reduceAnimations: false,
            highContrast: false,
            largeText: false,
            reducedMotion: false
          },
          audioDescriptions: false,
          focusMode: false,
          executiveSupport: {
            timers: true,
            reminders: true,
            taskBreaking: true,
            progressTracking: true
          },
          language: 'en',
          culturalSettings: {
            region: 'US',
            timeFormat: '12h',
            dateFormat: 'MM/DD/YYYY'
          }
        })
        .returning();

      return NextResponse.json(defaultPrefs);
    }

    return NextResponse.json(preferences[0]);

  } catch (error) {
    console.error('User preferences fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch preferences' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const updates = await request.json();

    const [updatedPreferences] = await db
      .update(userPreferences)
      .set(updates)
      .where(eq(userPreferences.userId, user.id))
      .returning();

    return NextResponse.json(updatedPreferences);

  } catch (error) {
    console.error('User preferences update error:', error);
    return NextResponse.json(
      { error: 'Failed to update preferences' },
      { status: 500 }
    );
  }
}