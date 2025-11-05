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
      questionCount = 10,
      difficulty = 'intermediate',
      questionTypes = ['multiple-choice', 'true-false'],
      timeLimit = 30,
      courseId,
      teacherId,
    } = body;

    if (!subject || !gradeLevel || !topic || !teacherId) {
      return NextResponse.json(
        { error: 'Missing required fields: subject, gradeLevel, topic, teacherId' },
        { status: 400 }
      );
    }

    // Generate quiz prompt for AI
    const quizPrompt = `
Generate a ${difficulty} level ${subject} quiz for grade ${gradeLevel} students.

Topic: ${topic}
Number of Questions: ${questionCount}
Question Types: ${questionTypes.join(', ')}
Time Limit: ${timeLimit} minutes

Please create a comprehensive quiz with:
1. A mix of ${questionTypes.join(' and ')} questions
2. Clear, unambiguous questions
3. Correct answers and explanations
4. Appropriate difficulty for ${gradeLevel} grade level
5. Questions that test understanding of ${topic}

Format the quiz professionally with proper numbering and clear answer keys.
`;

    // Call AI engine to generate quiz
    const aiResponse = await fetch(`${AI_ENGINE_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: 'You are an expert quiz creator who generates high-quality, educational assessments with clear questions and accurate answers.',
          },
          {
            role: 'user',
            content: quizPrompt,
          },
        ],
        model: 'educational-llama-7b',
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok) {
      throw new Error('AI engine request failed');
    }

    const aiData = await aiResponse.json();
    const generatedContent = aiData.choices[0]?.message?.content || 'Quiz generation failed';

    // Save to database
    const contentId = uuidv4();
    const insert = db.prepare(`
      INSERT INTO ai_generated_lessons (
        id, course_id, subject, grade_level, topic, content,
        content_type, difficulty, generated_by, metadata
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const metadata = {
      questionCount,
      questionTypes,
      timeLimit,
      difficulty,
      generatedAt: new Date().toISOString(),
    };

    insert.run(
      contentId,
      courseId || null,
      subject,
      gradeLevel,
      topic,
      generatedContent,
      'quiz',
      difficulty,
      teacherId,
      JSON.stringify(metadata)
    );

    // Log generation history
    const historyInsert = db.prepare(`
      INSERT INTO ai_generation_history (
        id, user_id, content_type, prompt, parameters, response,
        model_used, tokens_used, processing_time
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    historyInsert.run(
      uuidv4(),
      teacherId,
      'quiz',
      quizPrompt,
      JSON.stringify({ subject, gradeLevel, topic, questionCount, questionTypes, timeLimit, difficulty }),
      generatedContent,
      aiData.model || 'educational-llama-7b',
      aiData.usage?.total_tokens || 0,
      0
    );

    return NextResponse.json({
      id: contentId,
      content: generatedContent,
      metadata,
      success: true,
    });

  } catch (error) {
    console.error('Error generating quiz:', error);
    return NextResponse.json(
      { error: 'Failed to generate quiz' },
      { status: 500 }
    );
  }
}
 */
