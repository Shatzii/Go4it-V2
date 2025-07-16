import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Go4It Sports Academy courses specifically designed for student athletes
    const courses = [
      {
        id: 'sports-science',
        title: 'Sports Science & Performance',
        description: 'Advanced sports science curriculum designed for student athletes',
        difficulty: 'Advanced',
        subjects: ['Exercise Physiology', 'Sports Psychology', 'Biomechanics', 'Nutrition'],
        progress: 75,
        nextLesson: 'Biomechanical Analysis',
        estimatedTime: '45 mins',
        instructor: 'Dr. Martinez',
        credits: 3,
        prerequisites: ['Basic Biology', 'Introductory Psychology']
      },
      {
        id: 'ncaa-compliance',
        title: 'NCAA Compliance & Eligibility',
        description: 'Understanding NCAA requirements and maintaining eligibility',
        difficulty: 'Intermediate',
        subjects: ['Academic Standards', 'Amateurism Rules', 'Recruiting Guidelines'],
        progress: 60,
        nextLesson: 'Academic Progress Rate',
        estimatedTime: '30 mins',
        instructor: 'Prof. NCAA',
        credits: 2,
        prerequisites: ['Student-Athlete Orientation']
      },
      {
        id: 'athletic-development',
        title: 'Athletic Development & Training',
        description: 'Comprehensive athletic training and development program',
        difficulty: 'Advanced',
        subjects: ['Strength Training', 'Speed & Agility', 'Sport-Specific Skills'],
        progress: 85,
        nextLesson: 'Plyometric Training',
        estimatedTime: '60 mins',
        instructor: 'Coach Thompson',
        credits: 4,
        prerequisites: ['Anatomy & Physiology', 'Sports Medicine Basics']
      },
      {
        id: 'academic-support',
        title: 'Academic Support for Athletes',
        description: 'Specialized academic support for student athletes',
        difficulty: 'Beginner',
        subjects: ['Time Management', 'Study Skills', 'Test Preparation'],
        progress: 40,
        nextLesson: 'Time Management Strategies',
        estimatedTime: '25 mins',
        instructor: 'Ms. Academic',
        credits: 1,
        prerequisites: []
      },
      {
        id: 'mental-performance',
        title: 'Mental Performance & Psychology',
        description: 'Mental training for peak athletic performance',
        difficulty: 'Intermediate',
        subjects: ['Sports Psychology', 'Visualization', 'Goal Setting', 'Pressure Management'],
        progress: 55,
        nextLesson: 'Visualization Techniques',
        estimatedTime: '40 mins',
        instructor: 'Dr. Mind',
        credits: 3,
        prerequisites: ['Introduction to Psychology']
      },
      {
        id: 'nutrition-recovery',
        title: 'Sports Nutrition & Recovery',
        description: 'Optimal nutrition and recovery strategies for athletes',
        difficulty: 'Intermediate',
        subjects: ['Sports Nutrition', 'Recovery Methods', 'Hydration', 'Supplements'],
        progress: 70,
        nextLesson: 'Post-Workout Recovery',
        estimatedTime: '35 mins',
        instructor: 'Dr. Nutrition',
        credits: 2,
        prerequisites: ['Basic Nutrition']
      }
    ];

    return NextResponse.json({
      success: true,
      courses,
      totalCourses: courses.length,
      enrolledCourses: courses.length,
      completedCourses: courses.filter(c => c.progress >= 100).length,
      averageProgress: Math.round(courses.reduce((sum, c) => sum + c.progress, 0) / courses.length)
    });

  } catch (error) {
    console.error('Error fetching academy courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}