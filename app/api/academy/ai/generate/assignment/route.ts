import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const dbPath = path.join(process.cwd(), 'go4it-academy.db');
const db = new Database(dbPath);

const AI_ENGINE_URL = process.env.AI_ENGINE_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      subject,
      gradeLevel,
      topic,
      instructions,
      points = 100,
      difficulty = 'intermediate',
      dueDate,
      rubric,
      courseId,
      teacherId,
    } = body;

    if (!subject || !gradeLevel || !topic || !teacherId) {
      return NextResponse.json(
        { error: 'Missing required fields: subject, gradeLevel, topic, teacherId' },
        { status: 400 }
      );
    }

    // Generate assignment prompt for AI
    const assignmentPrompt = `
Generate a comprehensive ${difficulty} level ${subject} assignment for grade ${gradeLevel} students.

Topic: ${topic}
${instructions ? `Instructions: ${instructions}` : ''}
Points: ${points}
${rubric ? `Rubric: ${rubric}` : ''}
${dueDate ? `Due Date: ${dueDate}` : ''}

Please include:
1. Clear assignment objectives
2. Detailed instructions
3. Assessment criteria
4. Point breakdown
5. Any required materials or resources
6. Submission guidelines
`;

    // Call AI engine to generate assignment
    const aiResponse = await fetch(`${AI_ENGINE_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: 'You are an expert educational content creator specializing in creating high-quality assignments and assessments.',
          },
          {
            role: 'user',
            content: assignmentPrompt,
          },
        ],
        model: 'educational-llama-7b',
        max_tokens: 1500,
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok) {
      throw new Error('AI engine request failed');
    }

    const aiData = await aiResponse.json();
    const generatedContent = aiData.choices[0]?.message?.content || 'Assignment generation failed';

    // Save to database
    const contentId = uuidv4();
    const insert = db.prepare(`
      INSERT INTO ai_generated_lessons (
        id, course_id, subject, grade_level, topic, content,
        content_type, difficulty, generated_by, metadata
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const metadata = {
      points,
      dueDate,
      rubric,
      instructions,
      generatedAt: new Date().toISOString(),
    };

    insert.run(
      contentId,
      courseId || null,
      subject,
      gradeLevel,
      topic,
      generatedContent,
      'assignment',
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
      'assignment',
      assignmentPrompt,
      JSON.stringify({ subject, gradeLevel, topic, points, difficulty, dueDate }),
      generatedContent,
      aiData.model || 'educational-llama-7b',
      aiData.usage?.total_tokens || 0,
      0 // processing time not available from this endpoint
    );

    return NextResponse.json({
      id: contentId,
      content: generatedContent,
      metadata,
      success: true,
    });

  } catch (error) {
    console.error('Error generating assignment:', error);
    return NextResponse.json(
      { error: 'Failed to generate assignment' },
      { status: 500 }
    );
  }
}