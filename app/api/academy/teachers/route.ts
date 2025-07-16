import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Go4It Sports Academy AI Teachers
    const teachers = [
      {
        id: 'coach-thompson',
        name: 'Coach Thompson',
        subject: 'Athletic Development',
        specialty: 'Strength & Conditioning',
        status: 'online',
        lastHelped: '1 hour ago',
        avatar: '/avatars/coach-thompson.png',
        rating: 4.9,
        expertise: ['Plyometrics', 'Sport-Specific Training', 'Recovery'],
        studentsHelped: 247,
        responseTime: '< 2 minutes'
      },
      {
        id: 'dr-martinez',
        name: 'Dr. Martinez',
        subject: 'Sports Science',
        specialty: 'Exercise Physiology',
        status: 'online',
        lastHelped: '2 hours ago',
        avatar: '/avatars/dr-martinez.png',
        rating: 4.8,
        expertise: ['Biomechanics', 'Performance Analysis', 'Sports Psychology'],
        studentsHelped: 189,
        responseTime: '< 3 minutes'
      },
      {
        id: 'prof-ncaa',
        name: 'Prof. NCAA',
        subject: 'NCAA Compliance',
        specialty: 'Eligibility Requirements',
        status: 'busy',
        lastHelped: '30 minutes ago',
        avatar: '/avatars/prof-ncaa.png',
        rating: 4.7,
        expertise: ['Academic Standards', 'Recruiting Rules', 'Amateurism'],
        studentsHelped: 312,
        responseTime: '< 5 minutes'
      },
      {
        id: 'ms-academic',
        name: 'Ms. Academic',
        subject: 'Academic Support',
        specialty: 'Study Skills',
        status: 'online',
        lastHelped: '45 minutes ago',
        avatar: '/avatars/ms-academic.png',
        rating: 4.9,
        expertise: ['Time Management', 'Test Preparation', 'Learning Strategies'],
        studentsHelped: 156,
        responseTime: '< 1 minute'
      },
      {
        id: 'dr-mind',
        name: 'Dr. Mind',
        subject: 'Mental Performance',
        specialty: 'Sports Psychology',
        status: 'online',
        lastHelped: '3 hours ago',
        avatar: '/avatars/dr-mind.png',
        rating: 4.8,
        expertise: ['Visualization', 'Goal Setting', 'Pressure Management'],
        studentsHelped: 203,
        responseTime: '< 4 minutes'
      },
      {
        id: 'dr-nutrition',
        name: 'Dr. Nutrition',
        subject: 'Sports Nutrition',
        specialty: 'Performance Nutrition',
        status: 'online',
        lastHelped: '1 hour ago',
        avatar: '/avatars/dr-nutrition.png',
        rating: 4.9,
        expertise: ['Meal Planning', 'Recovery Nutrition', 'Hydration'],
        studentsHelped: 178,
        responseTime: '< 2 minutes'
      }
    ];

    return NextResponse.json({
      success: true,
      teachers,
      availableTeachers: teachers.filter(t => t.status === 'online').length,
      totalTeachers: teachers.length,
      averageRating: Math.round(teachers.reduce((sum, t) => sum + t.rating, 0) / teachers.length * 10) / 10
    });

  } catch (error) {
    console.error('Error fetching academy teachers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch teachers' },
      { status: 500 }
    );
  }
}