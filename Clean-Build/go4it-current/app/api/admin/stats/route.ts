import { NextRequest, NextResponse } from 'next/server';

// Admin stats endpoint
export async function GET(request: NextRequest) {
  try {
    // In a real system, you would:
    // 1. Verify admin access first
    // 2. Query database for actual statistics
    // 3. Return real data

    // For now, return mock data for demo purposes
    const stats = {
      totalStudents: 247,
      totalCourses: 68,
      activeEnrollments: 1824,
      systemHealth: 'operational',
      pendingApprovals: 3,
      recentActivity: [
        {
          id: 1,
          type: 'enrollment',
          message: 'New student enrollment: Sarah Martinez (11th Grade)',
          timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
          status: 'success',
        },
        {
          id: 2,
          type: 'course',
          message: 'Course created: Advanced Chemistry Lab',
          timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
          status: 'info',
        },
        {
          id: 3,
          type: 'schedule',
          message: 'Schedule updated: Period 3 room change',
          timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
          status: 'update',
        },
        {
          id: 4,
          type: 'enrollment',
          message: 'Batch enrollment: 23 new 9th grade students',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
          status: 'success',
        },
      ],
      analytics: {
        courseCompletionRate: 89,
        studentEngagement: 76,
        systemUtilization: 92,
        ncaaCompliance: 100,
      },
      monthlyGrowth: {
        students: 12,
        enrollments: 89,
        courses: 5,
      },
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ error: 'Failed to fetch admin statistics' }, { status: 500 });
  }
}
