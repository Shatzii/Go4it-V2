import { NextRequest, NextResponse } from 'next/server';


// TODO: This route uses raw SQLite queries and needs migration to Drizzle ORM
// Temporarily disabled during PostgreSQL migration

const MIGRATION_MESSAGE = {
  error: 'Academy feature requires database migration',
  message: 'This endpoint uses legacy SQLite and is being migrated to PostgreSQL',
  status: 'under_maintenance'
};

export async function GET(request: NextRequest) {
  return NextResponse.json(MIGRATION_MESSAGE, { status: 503 });
}

export async function POST(request: NextRequest) {
  return NextResponse.json(MIGRATION_MESSAGE, { status: 503 });
}

export async function PUT(request: NextRequest) {
  return NextResponse.json(MIGRATION_MESSAGE, { status: 503 });
}

export async function DELETE(request: NextRequest) {
  return NextResponse.json(MIGRATION_MESSAGE, { status: 503 });
}

export async function PATCH(request: NextRequest) {
  return NextResponse.json(MIGRATION_MESSAGE, { status: 503 });
}

/* 
 * ORIGINAL CODE BELOW - NEEDS MIGRATION TO DRIZZLE ORM
 * ====================================================
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
// Build-time safety: skip during static generation
if (process.env.NEXT_PHASE === 'phase-production-build') {
  return NextResponse.json({ error: 'Service temporarily unavailable during build' }, { status: 503 });
}

    try {
    const body = await request.json();
    const { contentId, rating, teacherId, feedback } = body;

    if (!contentId || !rating || !teacherId) {
      return NextResponse.json(
        { error: 'Missing required fields: contentId, rating, teacherId' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Insert or update rating
    const insert = db.prepare(`
      INSERT INTO ai_content_feedback (id, content_id, user_id, rating, feedback)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(content_id, user_id) DO UPDATE SET
        rating = excluded.rating,
        feedback = excluded.feedback,
        created_at = CURRENT_TIMESTAMP
    `);

    insert.run(uuidv4(), contentId, teacherId, rating, feedback || '');

    // Update average rating in the content table
    const updateRating = db.prepare(`
      UPDATE ai_generated_lessons
      SET rating = (
        SELECT AVG(rating) FROM ai_content_feedback WHERE content_id = ?
      )
      WHERE id = ?
    `);

    updateRating.run(contentId, contentId);

    return NextResponse.json({ success: true, message: 'Rating submitted successfully' });

  } catch (error) {
    console.error('Error rating content:', error);
    return NextResponse.json(
      { error: 'Failed to submit rating' },
      { status: 500 }
    );
  }
}
 */
