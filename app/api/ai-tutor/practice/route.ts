import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { logger } from '@/lib/logger';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const DEFAULT_MODEL_STR = "claude-sonnet-4-20250514";

// POST /api/ai-tutor/practice - Generate practice problems
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      subject,
      topic,
      difficulty = 'medium',
      count = 5,
      problemType = 'multiple-choice', // multiple-choice, short-answer, step-by-step
      weaknesses = [],
    } = body;

    if (!subject || !topic) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: subject, topic' },
        { status: 400 }
      );
    }

    const difficultyDescriptions = {
      easy: 'introductory level, basic concepts',
      medium: 'intermediate level, requires understanding of core concepts',
      hard: 'advanced level, requires deep understanding and application',
    };

    const problemTypeDescriptions = {
      'multiple-choice': 'Multiple choice questions with 4 options (A, B, C, D) and one correct answer',
      'short-answer': 'Short answer questions requiring brief explanations',
      'step-by-step': 'Problems requiring detailed step-by-step solutions',
      'word-problem': 'Real-world application problems with context',
    };

    const weaknessContext = weaknesses.length > 0
      ? `\n\nFocus on these areas where the student needs improvement: ${weaknesses.join(', ')}`
      : '';

    const systemPrompt = `You are an expert educational content creator specializing in practice problem generation.
Create high-quality, pedagogically sound practice problems that help students learn effectively.`;

    const userPrompt = `Generate ${count} ${problemType} practice problems for:

**Subject:** ${subject}
**Topic:** ${topic}
**Difficulty:** ${difficulty} (${difficultyDescriptions[difficulty as keyof typeof difficultyDescriptions]})
**Problem Type:** ${problemTypeDescriptions[problemType as keyof typeof problemTypeDescriptions]}${weaknessContext}

For each problem, provide:
1. The problem statement (clear and well-formatted)
2. The correct answer
3. A detailed explanation of the solution
4. Common mistakes students might make
5. Related concepts to review

Format as JSON array with this structure:
[
  {
    "id": 1,
    "question": "...",
    "options": ["A) ...", "B) ...", "C) ...", "D) ..."], // for multiple-choice only
    "correctAnswer": "...",
    "explanation": "...",
    "commonMistakes": ["...", "..."],
    "relatedConcepts": ["...", "..."],
    "estimatedTime": 3 // in minutes
  }
]

Make problems progressively more challenging within the set.
Use real-world examples when appropriate.
Ensure explanations are clear and educational.`;

    const response = await anthropic.messages.create({
      model: DEFAULT_MODEL_STR,
      max_tokens: 4000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const content = (response.content[0] as any).text || '';
    
    // Extract JSON from response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    let problems = [];

    if (jsonMatch) {
      try {
        problems = JSON.parse(jsonMatch[0]);
      } catch (parseError) {
        logger.error('Failed to parse problems JSON', { parseError });
      }
    }

    // If parsing failed, create a simple structure
    if (problems.length === 0) {
      problems = [{
        id: 1,
        question: content.substring(0, 500),
        correctAnswer: 'See explanation',
        explanation: content,
        commonMistakes: [],
        relatedConcepts: [topic],
        estimatedTime: 5,
      }];
    }

    logger.info('Generated practice problems', {
      userId,
      subject,
      topic,
      count: problems.length,
      difficulty,
    });

    return NextResponse.json({
      success: true,
      data: {
        problems,
        subject,
        topic,
        difficulty,
        totalProblems: problems.length,
        estimatedTime: problems.reduce((sum: number, p: any) => sum + (p.estimatedTime || 5), 0),
      },
    });
  } catch (error) {
    logger.error('Failed to generate practice problems', { error });
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate practice problems',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// GET /api/ai-tutor/practice - Get recommended practice based on progress
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const subject = searchParams.get('subject');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Missing userId parameter' },
        { status: 400 }
      );
    }

    // Fetch user's progress to recommend topics
    const progressResponse = await fetch(
      `${request.nextUrl.origin}/api/ai-tutor/progress?userId=${userId}${subject ? `&subject=${subject}` : ''}`,
      { headers: request.headers }
    );

    if (!progressResponse.ok) {
      throw new Error('Failed to fetch progress data');
    }

    const progressData = await progressResponse.json();

    // Analyze progress and generate recommendations
    const recommendations = [];

    for (const progress of progressData.data) {
      const masteryLevel = Number(progress.masteryLevel || 0);
      
      // Recommend practice for topics with lower mastery
      if (masteryLevel < 70) {
        recommendations.push({
          subject: progress.subject,
          topic: progress.topic,
          reason: masteryLevel < 40 ? 'Needs significant practice' : 'Could use more practice',
          recommendedDifficulty: masteryLevel < 40 ? 'easy' : 'medium',
          priority: 100 - masteryLevel, // Higher priority for lower mastery
          weaknesses: progress.weaknesses ? JSON.parse(progress.weaknesses) : [],
        });
      }
    }

    // Sort by priority
    recommendations.sort((a, b) => b.priority - a.priority);

    return NextResponse.json({
      success: true,
      data: recommendations.slice(0, 10), // Top 10 recommendations
      message: recommendations.length > 0
        ? 'Here are practice topics recommended based on your progress'
        : 'Great job! Keep practicing to maintain your skills',
    });
  } catch (error) {
    logger.error('Failed to get practice recommendations', { error });
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get practice recommendations',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
