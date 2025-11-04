import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { parentId, frequency, studentId } = await request.json();

    if (!parentId || !frequency || !studentId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // In production, this would:
    // 1. Store email preferences in database
    // 2. Set up cron job or scheduled task for email generation
    // 3. Use email service (SendGrid, AWS SES, etc.) to send reports

    // Mock implementation
    const emailPreference = {
      id: Math.random().toString(36).substr(2, 9),
      parentId,
      studentId,
      frequency,
      enabled: true,
      lastSent: null,
      nextScheduled: getNextScheduledDate(frequency),
      createdAt: new Date().toISOString(),
    };

    console.log('Email report preference created:', emailPreference);

    return NextResponse.json({
      success: true,
      message: `Email reports will be sent ${frequency}`,
      preference: emailPreference,
    });
  } catch (error) {
    console.error('Error setting up email reports:', error);
    return NextResponse.json(
      { error: 'Failed to set up email reports' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get('parentId');

    if (!parentId) {
      return NextResponse.json(
        { error: 'Parent ID is required' },
        { status: 400 }
      );
    }

    // Mock email preferences
    const preferences = {
      parentId,
      emailReports: {
        frequency: 'weekly',
        enabled: true,
        lastSent: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        nextScheduled: getNextScheduledDate('weekly'),
      },
      alerts: {
        lowGrades: true,
        missingAssignments: true,
        attendanceIssues: true,
        ncaaEligibility: true,
        scholarshipOffers: true,
        starpathAchievements: false,
        teacherMessages: true,
        upcomingDeadlines: false,
      },
    };

    return NextResponse.json({ preferences });
  } catch (error) {
    console.error('Error fetching email preferences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch email preferences' },
      { status: 500 }
    );
  }
}

function getNextScheduledDate(frequency: 'daily' | 'weekly' | 'monthly'): string {
  const now = new Date();
  let nextDate = new Date(now);

  switch (frequency) {
    case 'daily':
      nextDate.setDate(now.getDate() + 1);
      nextDate.setHours(8, 0, 0, 0); // 8 AM next day
      break;
    case 'weekly':
      nextDate.setDate(now.getDate() + (7 - now.getDay() + 1)); // Next Monday
      nextDate.setHours(8, 0, 0, 0);
      break;
    case 'monthly':
      nextDate.setMonth(now.getMonth() + 1);
      nextDate.setDate(1); // First of next month
      nextDate.setHours(8, 0, 0, 0);
      break;
  }

  return nextDate.toISOString();
}
