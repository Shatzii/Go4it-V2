import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'go4it-academy.db');
const db = new Database(dbPath);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contentId, courseId, teacherId } = body;

    if (!contentId || !teacherId) {
      return NextResponse.json(
        { error: 'Missing required fields: contentId, teacherId' },
        { status: 400 }
      );
    }

    // Update the content to mark it as approved/saved
    const update = db.prepare(`
      UPDATE ai_generated_lessons
      SET approved = 1, approved_by = ?, approved_at = CURRENT_TIMESTAMP, usage_count = usage_count + 1
      WHERE id = ? AND generated_by = ?
    `);

    const result = update.run(teacherId, contentId, teacherId);

    if (result.changes === 0) {
      return NextResponse.json(
        { error: 'Content not found or access denied' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Content saved successfully' });

  } catch (error) {
    console.error('Error saving content:', error);
    return NextResponse.json(
      { error: 'Failed to save content' },
      { status: 500 }
    );
  }
}