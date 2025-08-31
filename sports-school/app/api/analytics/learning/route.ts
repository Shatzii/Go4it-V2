import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || 'week';
    const subject = searchParams.get('subject') || 'all';

    // Mock learning analytics data
    const analyticsData = generateMockAnalytics(timeRange, subject);

    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}

function generateMockAnalytics(timeRange: string, subject: string) {
  const baseData = {
    totalHours: 145,
    completedLessons: 87,
    averageScore: 85,
    streakDays: 12,
    improvement: 15,
    timeSpent: [
      { subject: 'Mathematics', hours: 45, color: '#3b82f6' },
      { subject: 'Science', hours: 38, color: '#10b981' },
      { subject: 'English', hours: 32, color: '#8b5cf6' },
      { subject: 'History', hours: 30, color: '#f59e0b' },
    ],
    progressBySubject: [
      { subject: 'Mathematics', progress: 85, target: 90, color: '#3b82f6' },
      { subject: 'Science', progress: 78, target: 85, color: '#10b981' },
      { subject: 'English', progress: 92, target: 95, color: '#8b5cf6' },
      { subject: 'History', progress: 67, target: 80, color: '#f59e0b' },
    ],
    weeklyActivity: generateWeeklyActivity(timeRange),
    performanceByTopic: [
      { topic: 'Algebra', score: 92, attempts: 45, improvement: 12 },
      { topic: 'Geometry', score: 78, attempts: 32, improvement: 8 },
      { topic: 'Chemistry', score: 85, attempts: 38, improvement: 15 },
      { topic: 'Physics', score: 81, attempts: 29, improvement: 10 },
      { topic: 'Literature', score: 89, attempts: 42, improvement: 7 },
    ],
    learningGoals: [
      {
        id: '1',
        title: 'Complete Algebra Course',
        progress: 85,
        target: 100,
        deadline: '2024-02-15',
        status: 'on-track',
      },
      {
        id: '2',
        title: 'Improve Science Grades',
        progress: 60,
        target: 100,
        deadline: '2024-01-30',
        status: 'behind',
      },
      {
        id: '3',
        title: 'Read 5 Classic Novels',
        progress: 100,
        target: 100,
        deadline: '2024-01-15',
        status: 'completed',
      },
    ],
  };

  // Filter by subject if specified
  if (subject !== 'all') {
    const filteredData = {
      ...baseData,
      timeSpent: baseData.timeSpent.filter((item) =>
        item.subject.toLowerCase().includes(subject.toLowerCase()),
      ),
      progressBySubject: baseData.progressBySubject.filter((item) =>
        item.subject.toLowerCase().includes(subject.toLowerCase()),
      ),
    };

    // Adjust totals based on filtered data
    filteredData.totalHours = filteredData.timeSpent.reduce((sum, item) => sum + item.hours, 0);
    filteredData.completedLessons = Math.round(filteredData.totalHours * 0.6);

    return filteredData;
  }

  return baseData;
}

function generateWeeklyActivity(timeRange: string) {
  const activities = [];
  const now = new Date();

  let days = 7;
  if (timeRange === 'month') days = 30;
  else if (timeRange === 'quarter') days = 90;
  else if (timeRange === 'year') days = 365;

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    activities.push({
      date: date.toISOString().split('T')[0],
      hours: Math.random() * 4 + 1, // 1-5 hours
      lessons: Math.floor(Math.random() * 6) + 1, // 1-6 lessons
      score: Math.floor(Math.random() * 20) + 80, // 80-100 score
    });
  }

  return activities;
}

export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json();

    switch (action) {
      case 'track_activity':
        // Track learning activity
        return NextResponse.json({ success: true, message: 'Activity tracked' });

      case 'set_goal':
        // Set learning goal
        return NextResponse.json({ success: true, message: 'Goal set' });

      case 'update_progress':
        // Update progress
        return NextResponse.json({ success: true, message: 'Progress updated' });

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Analytics POST error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
