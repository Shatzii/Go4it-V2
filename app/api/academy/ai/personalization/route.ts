import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
const dbPath = path.join(process.cwd(), 'go4it-academy.db');
const db = new Database(dbPath);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');

    if (!studentId) {
      return NextResponse.json(
        { error: 'Student ID is required' },
        { status: 400 }
      );
    }

    // Get student's personalization profile
    const profile = db.prepare(`
      SELECT * FROM ai_personalization_profiles WHERE user_id = ?
    `).get(studentId);

    if (profile) {
      return NextResponse.json({
        profile: {
          ...profile,
          accommodations: profile.accommodations ? JSON.parse(profile.accommodations) : [],
          subjectPreferences: profile.subject_preferences ? JSON.parse(profile.subject_preferences) : {},
        }
      });
    } else {
      return NextResponse.json({ profile: null });
    }

  } catch (error) {
    console.error('Error fetching personalization profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      studentId,
      teacherId,
      learningStyle,
      preferredDifficulty,
      accommodations,
      subjectPreferences,
      communicationStyle,
    } = body;

    if (!studentId || !teacherId) {
      return NextResponse.json(
        { error: 'Student ID and Teacher ID are required' },
        { status: 400 }
      );
    }

    // Insert or update personalization profile
    const insert = db.prepare(`
      INSERT INTO ai_personalization_profiles (
        id, user_id, learning_style, preferred_difficulty, accommodations,
        subject_preferences, communication_style, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id) DO UPDATE SET
        learning_style = excluded.learning_style,
        preferred_difficulty = excluded.preferred_difficulty,
        accommodations = excluded.accommodations,
        subject_preferences = excluded.subject_preferences,
        communication_style = excluded.communication_style,
        updated_at = CURRENT_TIMESTAMP
    `);

    const profileId = `profile_${studentId}`;

    insert.run(
      profileId,
      studentId,
      learningStyle || null,
      preferredDifficulty || 'intermediate',
      accommodations ? JSON.stringify(accommodations) : null,
      subjectPreferences ? JSON.stringify(subjectPreferences) : null,
      communicationStyle || 'balanced'
    );

    return NextResponse.json({
      success: true,
      message: 'Personalization profile saved successfully'
    });

  } catch (error) {
    console.error('Error saving personalization profile:', error);
    return NextResponse.json(
      { error: 'Failed to save profile' },
      { status: 500 }
    );
  }
}