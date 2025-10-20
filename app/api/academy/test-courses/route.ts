import { NextRequest, NextResponse } from 'next/server';

// Mock data for testing
const mockCourses = [
  {
    id: 1,
    title: 'Algebra I',
    description:
      'Foundational mathematics covering linear equations, graphing, and problem solving',
    code: 'MATH-ALG1',
    instructor: 'Dr. Sarah Johnson',
    difficulty: 'Beginner',
    credits: 1.0,
    gradeLevel: '9th Grade',
    isActive: true,
    enrollmentCount: 24,
  },
  {
    id: 2,
    title: 'Biology I',
    description: 'Introduction to life sciences, cell biology, genetics, and ecology',
    code: 'SCI-BIO1',
    instructor: 'Dr. Michael Chen',
    difficulty: 'Beginner',
    credits: 1.0,
    gradeLevel: '9th Grade',
    isActive: true,
    enrollmentCount: 19,
  },
  {
    id: 3,
    title: 'English Literature',
    description: 'Analysis of classic and contemporary literature with focus on critical thinking',
    code: 'ENG-LIT',
    instructor: 'Prof. Emily Rodriguez',
    difficulty: 'Intermediate',
    credits: 1.0,
    gradeLevel: '10th Grade',
    isActive: true,
    enrollmentCount: 22,
  },
  {
    id: 4,
    title: 'World History',
    description: 'Survey of global civilizations from ancient times to modern era',
    code: 'SOC-WH',
    instructor: 'Dr. James Thompson',
    difficulty: 'Beginner',
    credits: 1.0,
    gradeLevel: '9th Grade',
    isActive: true,
    enrollmentCount: 27,
  },
  {
    id: 5,
    title: 'Chemistry I',
    description: 'Basic principles of chemistry including atomic structure and chemical reactions',
    code: 'SCI-CHEM1',
    instructor: 'Dr. Lisa Park',
    difficulty: 'Intermediate',
    credits: 1.0,
    gradeLevel: '10th Grade',
    isActive: true,
    enrollmentCount: 18,
  },
  {
    id: 6,
    title: 'Geometry',
    description: 'Study of geometric shapes, proofs, and spatial reasoning',
    code: 'MATH-GEO',
    instructor: 'Mr. David Wilson',
    difficulty: 'Intermediate',
    credits: 1.0,
    gradeLevel: '10th Grade',
    isActive: true,
    enrollmentCount: 21,
  },
];

export async function GET(_req: NextRequest) {
  try {
    return NextResponse.json({ courses: mockCourses });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}
