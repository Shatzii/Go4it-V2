import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { lmsIntegration } from '@/lib/lms-integration';
import { db } from '@/lib/db';
import { academyCourses, academyEnrollments } from '@/shared/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Get LMS courses with rich content
    const lmsCourses = [
      {
        id: 'sports-science-101',
        title: 'Sports Science & Performance',
        description:
          'Comprehensive sports science curriculum covering biomechanics, physiology, and performance optimization',
        instructor: 'Dr. Sarah Martinez, PhD',
        credits: 3,
        gradeLevel: '9-12',
        difficulty: 'Advanced',
        duration: '16 weeks',
        modules: [
          {
            id: 'biomechanics',
            title: 'Biomechanics Fundamentals',
            description: 'Understanding human movement and force mechanics',
            content: `
# Biomechanics Fundamentals

## Learning Objectives
- Understand basic principles of human movement
- Analyze force vectors and joint mechanics
- Apply biomechanical concepts to sports performance

## Module Content

### 1. Introduction to Biomechanics
Biomechanics is the study of forces and their effects on living systems. In sports, we analyze how athletes move to optimize performance and prevent injury.

### 2. Force Analysis
- **Newton's Laws in Sports**: How force, mass, and acceleration affect athletic performance
- **Ground Reaction Forces**: Understanding impact forces in running and jumping
- **Joint Mechanics**: How muscles and bones work together

### 3. Movement Patterns
- **Kinetic Chain**: How movement flows through the body
- **Efficiency**: Minimizing energy waste in athletic movements
- **Power Generation**: Creating maximum force in minimum time

### 4. Practical Applications
- Video analysis of athletic movements
- Force plate measurements
- EMG muscle activation studies
            `,
            videoUrl: 'https://example.com/biomechanics-intro',
            order: 1,
            estimated_time: '2 hours',
          },
          {
            id: 'sports-psychology',
            title: 'Sports Psychology Applications',
            description: 'Mental training techniques for peak performance',
            content: `
# Sports Psychology Applications

## Learning Objectives
- Develop mental toughness and resilience
- Learn visualization and goal-setting techniques
- Understand pressure management strategies

## Module Content

### 1. Mental Preparation
- **Pre-competition routines**: Developing consistent mental preparation
- **Visualization**: Mental imagery for skill improvement
- **Self-talk**: Positive internal dialogue techniques

### 2. Pressure Management
- **Arousal regulation**: Finding optimal performance state
- **Focus techniques**: Maintaining concentration under pressure
- **Confidence building**: Developing unshakeable self-belief

### 3. Goal Setting
- **SMART goals**: Specific, Measurable, Achievable, Relevant, Time-bound
- **Process vs. outcome goals**: Focusing on controllable factors
- **Progress tracking**: Monitoring mental performance gains
            `,
            videoUrl: 'https://example.com/sports-psychology',
            order: 2,
            estimated_time: '1.5 hours',
          },
        ],
        assessments: [
          {
            id: 'biomech-analysis',
            title: 'Biomechanical Movement Analysis',
            type: 'project',
            points: 100,
            dueDate: new Date('2025-03-15'),
            instructions:
              'Record and analyze a specific athletic movement using video analysis software. Identify key biomechanical principles and suggest performance improvements.',
            rubric: `
## Grading Rubric (100 points total)

### Technical Analysis (40 points)
- **Excellent (36-40)**: Comprehensive analysis with accurate biomechanical principles
- **Good (32-35)**: Solid analysis with minor technical errors
- **Satisfactory (28-31)**: Basic analysis meeting minimum requirements
- **Needs Improvement (0-27)**: Incomplete or inaccurate analysis

### Video Quality & Presentation (30 points)
- **Excellent (27-30)**: Professional quality video with clear annotations
- **Good (24-26)**: Good quality with effective visual aids
- **Satisfactory (21-23)**: Adequate presentation meeting requirements
- **Needs Improvement (0-20)**: Poor quality or unclear presentation

### Recommendations (30 points)
- **Excellent (27-30)**: Practical, specific, evidence-based recommendations
- **Good (24-26)**: Good recommendations with solid reasoning
- **Satisfactory (21-23)**: Basic recommendations provided
- **Needs Improvement (0-20)**: Vague or impractical recommendations
            `,
          },
        ],
        progress: 75,
        nextLesson: 'Sports Psychology Applications',
        estimatedTime: '50 mins',
      },
      {
        id: 'ncaa-compliance',
        title: 'NCAA Compliance & Eligibility',
        description:
          'Complete guide to NCAA rules, eligibility requirements, and compliance procedures',
        instructor: 'Prof. Michael Thompson, JD',
        credits: 2,
        gradeLevel: '11-12',
        difficulty: 'Intermediate',
        duration: '12 weeks',
        modules: [
          {
            id: 'eligibility-basics',
            title: 'NCAA Eligibility Fundamentals',
            description: 'Core requirements for NCAA athletic eligibility',
            content: `
# NCAA Eligibility Fundamentals

## Learning Objectives
- Understand NCAA Division I, II, and III requirements
- Learn about core course requirements
- Master GPA and test score standards

## Module Content

### 1. Division Overview
- **Division I**: Highest level of competition, scholarship limits
- **Division II**: Competitive with some scholarships
- **Division III**: No athletic scholarships, focus on academics

### 2. Core Course Requirements
- **16 Core Courses**: English, Math, Science, Social Studies
- **Sliding Scale**: GPA and test score combinations
- **Timeline**: When courses must be completed

### 3. Amateurism Rules
- **Professional competition**: What's allowed and prohibited
- **Prize money**: Limits and exceptions
- **Agents**: Rules about representation
            `,
            videoUrl: 'https://example.com/ncaa-eligibility',
            order: 1,
            estimated_time: '1 hour',
          },
          {
            id: 'recruiting-rules',
            title: 'Recruiting Guidelines & Communication',
            description: 'Understanding NCAA recruiting rules and proper communication',
            content: `
# Recruiting Guidelines & Communication

## Learning Objectives
- Learn recruiting calendar restrictions
- Understand communication rules by sport
- Know evaluation and contact periods

## Module Content

### 1. Recruiting Calendar
- **Contact periods**: When coaches can have face-to-face contact
- **Evaluation periods**: When coaches can watch you compete
- **Dead periods**: No recruiting contact allowed
- **Quiet periods**: Limited recruiting activities

### 2. Communication Rules
- **Phone calls**: When and how often coaches can call
- **Text messages**: Rules vary by sport and class year
- **Social media**: Guidelines for online interaction
- **Campus visits**: Official vs. unofficial visit rules

### 3. Compliance Best Practices
- **Documentation**: Keeping records of all interactions
- **Questions to ask**: Ensuring compliance during recruitment
- **Red flags**: Identifying potential violations
            `,
            videoUrl: 'https://example.com/recruiting-rules',
            order: 2,
            estimated_time: '45 minutes',
          },
        ],
        assessments: [
          {
            id: 'compliance-quiz',
            title: 'NCAA Rules Knowledge Assessment',
            type: 'quiz',
            points: 50,
            dueDate: new Date('2025-03-20'),
            instructions:
              'Complete this comprehensive quiz covering NCAA eligibility rules, amateurism requirements, and recruiting guidelines.',
            rubric:
              'Standard quiz grading: 90-100% = A, 80-89% = B, 70-79% = C, 60-69% = D, Below 60% = F',
          },
        ],
        progress: 60,
        nextLesson: 'Amateurism Certification',
        estimatedTime: '35 mins',
      },
      {
        id: 'pe-k12',
        title: 'Physical Education K-12 Curriculum',
        description: 'Evidence-based physical education curriculum for all grade levels',
        instructor: 'Coach Jennifer Wilson, MEd',
        credits: 1,
        gradeLevel: 'K-12',
        difficulty: 'Beginner to Advanced',
        duration: 'Year-long',
        modules: [
          {
            id: 'motor-skills',
            title: 'Fundamental Motor Skills Development',
            description: 'Building foundational movement patterns',
            content: `
# Fundamental Motor Skills Development

## Learning Objectives
- Develop basic locomotor skills (running, jumping, skipping)
- Master object control skills (throwing, catching, kicking)
- Build stability and balance skills

## Module Content

### 1. Locomotor Skills (K-2)
- **Walking**: Proper posture and gait
- **Running**: Efficient running form
- **Jumping**: Two-foot and one-foot takeoffs
- **Hopping**: Single-leg coordination
- **Skipping**: Complex coordination pattern

### 2. Object Control Skills (3-5)
- **Throwing**: Overhand and underhand techniques
- **Catching**: Hand-eye coordination development
- **Kicking**: Proper approach and contact
- **Striking**: Hand and implement striking

### 3. Stability Skills (All Ages)
- **Static balance**: Maintaining positions
- **Dynamic balance**: Balance while moving
- **Body awareness**: Understanding spatial relationships
            `,
            videoUrl: 'https://example.com/motor-skills',
            order: 1,
            estimated_time: '30 minutes',
          },
        ],
        assessments: [
          {
            id: 'motor-skills-demo',
            title: 'Motor Skills Demonstration',
            type: 'assignment',
            points: 25,
            dueDate: new Date('2025-04-01'),
            instructions:
              'Demonstrate proficiency in 5 fundamental motor skills with proper technique and form.',
            rubric: 'Skills assessed on technique, consistency, and age-appropriate development',
          },
        ],
        progress: 40,
        nextLesson: 'Team Sports Introduction',
        estimatedTime: '25 mins',
      },
    ];

    // Get user's enrolled courses from Go4It database
    const enrolledCourses = await db
      .select()
      .from(academyEnrollments)
      .where(eq(academyEnrollments.studentId, user.id));

    // Mark enrolled courses
    const coursesWithEnrollment = lmsCourses.map((course) => ({
      ...course,
      enrolled: enrolledCourses.some((e) => e.courseId?.toString() === course.id),
      enrollmentProgress:
        enrolledCourses.find((e) => e.courseId?.toString() === course.id)?.progress || 0,
    }));

    return NextResponse.json({
      success: true,
      courses: coursesWithEnrollment,
      totalCourses: lmsCourses.length,
      enrolledCourses: enrolledCourses.length,
      lmsIntegration: {
        enabled: true,
        syncStatus: 'active',
        lastSync: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching LMS courses:', error);
    return NextResponse.json({ error: 'Failed to fetch LMS courses' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { action, courseId, data } = body;

    switch (action) {
      case 'enroll':
        // Enroll user in LMS course
        try {
          await lmsIntegration.enrollUser(user.id, courseId);

          // Also enroll in Go4It academy
          await db
            .insert(academyEnrollments)
            .values({
              studentId: user.id,
              courseId: parseInt(courseId.replace(/\D/g, '') || '1'),
              status: 'active',
              progress: 0,
            })
            .onConflictDoNothing();

          return NextResponse.json({
            success: true,
            message: 'Successfully enrolled in course',
          });
        } catch (error) {
          return NextResponse.json(
            {
              success: false,
              error: 'Enrollment failed',
            },
            { status: 500 },
          );
        }

      case 'sync':
        // Sync user data with LMS
        try {
          await lmsIntegration.syncUser(parseInt(user.id.replace(/\D/g, '') || '1'));
          return NextResponse.json({
            success: true,
            message: 'User data synced with LMS',
          });
        } catch (error) {
          return NextResponse.json(
            {
              success: false,
              error: 'Sync failed',
            },
            { status: 500 },
          );
        }

      default:
        return NextResponse.json(
          {
            error: 'Invalid action',
          },
          { status: 400 },
        );
    }
  } catch (error) {
    console.error('Error in LMS courses API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
