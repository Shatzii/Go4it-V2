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
// AI Engine integration
const AI_ENGINE_URL = process.env.AI_ENGINE_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
// Build-time safety: skip during static generation
if (process.env.NEXT_PHASE === 'phase-production-build') {
  return NextResponse.json({ error: 'Service temporarily unavailable during build' }, { status: 503 });
}

    try {
    const body = await request.json();
    const {
      subject,
      gradeLevel,
      topic,
      learningObjectives,
      difficulty = 'intermediate',
      learningStyle = 'mixed',
      accommodations = [],
      duration = 45,
      courseId,
      teacherId,
    } = body;

    if (!subject || !gradeLevel || !topic || !teacherId) {
      return NextResponse.json(
        { error: 'Missing required fields: subject, gradeLevel, topic, teacherId' },
        { status: 400 }
      );
    }

    // Generate lesson using AI engine
    const aiResponse = await fetch(`${AI_ENGINE_URL}/v1/generate/lesson`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject,
        grade: gradeLevel,
        topic,
        learningStyle,
        accommodations,
        duration,
      }),
    });

    if (!aiResponse.ok) {
      throw new Error('AI engine request failed');
    }

    const aiData = await aiResponse.json();

    // Save to database
    const contentId = uuidv4();
    const insert = db.prepare(`
      INSERT INTO ai_generated_lessons (
        id, course_id, subject, grade_level, topic, learning_objectives,
        content, content_type, difficulty, learning_style, accommodations,
        generated_by, metadata
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insert.run(
      contentId,
      courseId || null,
      subject,
      gradeLevel,
      topic,
      learningObjectives || '',
      aiData.content || aiData.lesson,
      'lesson',
      difficulty,
      learningStyle,
      JSON.stringify(accommodations),
      teacherId,
      JSON.stringify(aiData.metadata || {})
    );

    // Log generation history
    const historyInsert = db.prepare(`
      INSERT INTO ai_generation_history (
        id, user_id, content_type, prompt, parameters, response,
        model_used, processing_time
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const prompt = `Generate a ${difficulty} level ${subject} lesson for grade ${gradeLevel} about ${topic}`;
    historyInsert.run(
      uuidv4(),
      teacherId,
      'lesson',
      prompt,
      JSON.stringify({ subject, gradeLevel, topic, learningObjectives, difficulty, learningStyle, accommodations }),
      aiData.content || aiData.lesson,
      aiData.model || 'educational-llama-7b',
      aiData.processingTime || 0
    );

    return NextResponse.json({
      id: contentId,
      content: aiData.content || aiData.lesson,
      metadata: aiData.metadata || {},
      success: true,
    });

  } catch (error) {
    console.error('Error generating lesson:', error);
    return NextResponse.json(
      { error: 'Failed to generate lesson' },
      { status: 500 }
    );
  }
}
 */
