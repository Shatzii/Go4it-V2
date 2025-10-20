import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const dbPath = path.join(process.cwd(), 'go4it-academy.db');
const db = new Database(dbPath);

export async function POST(request: NextRequest) {
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