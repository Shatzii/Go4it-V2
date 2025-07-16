import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Go4It Sports Academy student progress
    const progress = {
      studentId: user.id,
      academicStats: {
        currentGPA: 3.8,
        cumulativeGPA: 3.7,
        creditsCompleted: 45,
        totalCredits: 120,
        progressPercentage: 37.5,
        ncaaEligible: true,
        expectedGraduation: '2026-05-15'
      },
      athleticStats: {
        garScore: 87,
        trainingSessions: 24,
        totalSessions: 30,
        skillProgression: 'Advanced',
        strengthGains: 15,
        speedImprovement: 8,
        enduranceLevel: 'High'
      },
      achievements: [
        {
          id: 'sports-scholar',
          title: 'Sports Scholar',
          description: 'Completed 5 sports science courses',
          tier: 'Gold',
          points: 500,
          unlocked: true,
          category: 'academic',
          unlockedAt: new Date('2024-01-15')
        },
        {
          id: 'ncaa-ready',
          title: 'NCAA Ready',
          description: 'Passed NCAA eligibility requirements',
          tier: 'Silver',
          points: 300,
          unlocked: true,
          category: 'compliance',
          unlockedAt: new Date('2024-02-01')
        },
        {
          id: 'athletic-excellence',
          title: 'Athletic Excellence',
          description: 'Achieved 90% in athletic training',
          tier: 'Gold',
          points: 750,
          unlocked: false,
          category: 'athletic'
        },
        {
          id: 'study-streak',
          title: 'Study Streak',
          description: '30-day learning streak',
          tier: 'Bronze',
          points: 200,
          unlocked: true,
          category: 'engagement',
          unlockedAt: new Date('2024-01-20')
        }
      ],
      studyStreak: 15,
      totalPoints: 1000,
      level: 'Advanced Student-Athlete',
      nextLevelPoints: 1500,
      weeklyGoals: [
        { title: 'Complete Sports Science Module', completed: true, subject: 'Sports Science' },
        { title: 'Review NCAA Compliance Rules', completed: false, subject: 'NCAA Compliance' },
        { title: 'Athletic Training Session', completed: false, subject: 'Athletic Development' },
        { title: 'Submit Academic Progress Report', completed: true, subject: 'Academic Support' }
      ],
      upcomingAssignments: [
        {
          id: 'biomechanics-project',
          title: 'Biomechanical Analysis Project',
          course: 'Sports Science & Performance',
          dueDate: '2024-03-15',
          priority: 'High',
          completed: false
        },
        {
          id: 'nutrition-plan',
          title: 'Personal Nutrition Plan',
          course: 'Sports Nutrition & Recovery',
          dueDate: '2024-03-20',
          priority: 'Medium',
          completed: false
        }
      ]
    };

    return NextResponse.json({
      success: true,
      progress,
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching academy progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    );
  }
}