import { NextRequest, NextResponse } from 'next/server';

// Mock study session data - in a real app this would come from a database
const studySessions = [
  {
    id: '1',
    studentId: 'dev-user-123',
    subject: 'Algebra I',
    topic: 'Linear Functions',
    duration: 45,
    score: 85,
    date: '2025-01-20',
    completedExercises: 12,
    totalExercises: 15,
    conceptsStudied: ['slope', 'y-intercept', 'graphing'],
    difficultyLevel: 'medium',
    studyMethod: 'practice_problems',
  },
  {
    id: '2',
    studentId: 'dev-user-123',
    subject: 'Biology I',
    topic: 'Cell Structure',
    duration: 30,
    score: 92,
    date: '2025-01-19',
    completedExercises: 8,
    totalExercises: 8,
    conceptsStudied: ['organelles', 'cell membrane', 'nucleus'],
    difficultyLevel: 'easy',
    studyMethod: 'interactive_diagrams',
  },
  {
    id: '3',
    studentId: 'dev-user-123',
    subject: 'World History',
    topic: 'Ancient Egypt',
    duration: 25,
    score: 78,
    date: '2025-01-18',
    completedExercises: 5,
    totalExercises: 7,
    conceptsStudied: ['pharaohs', 'pyramids', 'hieroglyphics'],
    difficultyLevel: 'medium',
    studyMethod: 'reading_and_notes',
  },
  {
    id: '4',
    studentId: 'dev-user-123',
    subject: 'Algebra I',
    topic: 'Quadratic Equations',
    duration: 35,
    score: 65,
    date: '2025-01-17',
    completedExercises: 7,
    totalExercises: 12,
    conceptsStudied: ['factoring', 'quadratic_formula', 'graphing_parabolas'],
    difficultyLevel: 'hard',
    studyMethod: 'guided_practice',
  },
  {
    id: '5',
    studentId: 'dev-user-123',
    subject: 'English Literature',
    topic: 'Shakespeare Analysis',
    duration: 40,
    score: 88,
    date: '2025-01-16',
    completedExercises: 3,
    totalExercises: 4,
    conceptsStudied: ['character_analysis', 'themes', 'literary_devices'],
    difficultyLevel: 'medium',
    studyMethod: 'essay_writing',
  },
];

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const studentId = url.searchParams.get('studentId') || 'dev-user-123';
    const subject = url.searchParams.get('subject');
    const limit = parseInt(url.searchParams.get('limit') || '10');

    let filteredSessions = studySessions.filter((session) => session.studentId === studentId);

    if (subject) {
      filteredSessions = filteredSessions.filter((session) =>
        session.subject.toLowerCase().includes(subject.toLowerCase()),
      );
    }

    // Sort by date (most recent first) and limit results
    filteredSessions = filteredSessions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);

    return NextResponse.json({
      sessions: filteredSessions,
      totalSessions: filteredSessions.length,
    });
  } catch (error) {
    console.error('Study Sessions Error:', error);
    return NextResponse.json({ error: 'Failed to load study sessions' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const sessionData = await req.json();

    const newSession = {
      id: (studySessions.length + 1).toString(),
      studentId: sessionData.studentId || 'dev-user-123',
      subject: sessionData.subject,
      topic: sessionData.topic,
      duration: sessionData.duration,
      score: sessionData.score,
      date: new Date().toISOString().split('T')[0],
      completedExercises: sessionData.completedExercises || 0,
      totalExercises: sessionData.totalExercises || 0,
      conceptsStudied: sessionData.conceptsStudied || [],
      difficultyLevel: sessionData.difficultyLevel || 'medium',
      studyMethod: sessionData.studyMethod || 'practice_problems',
    };

    studySessions.push(newSession);

    return NextResponse.json({
      session: newSession,
      message: 'Study session recorded successfully',
    });
  } catch (error) {
    console.error('Create Study Session Error:', error);
    return NextResponse.json({ error: 'Failed to create study session' }, { status: 500 });
  }
}
