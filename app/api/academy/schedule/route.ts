import { NextResponse } from 'next/server';
import { CORE_CLASSES, ELECTIVE_CLASSES } from '@/shared/core-curriculum-schema';

// Master Schedule Template
const MASTER_SCHEDULE = {
  periods: [
    { period: 1, startTime: '8:00 AM', endTime: '8:50 AM' },
    { period: 2, startTime: '9:00 AM', endTime: '9:50 AM' },
    { period: 3, startTime: '10:00 AM', endTime: '10:50 AM' },
    { period: 4, startTime: '11:00 AM', endTime: '11:50 AM' },
    { period: 5, startTime: '12:30 PM', endTime: '1:20 PM' }, // After lunch
    { period: 6, startTime: '1:30 PM', endTime: '2:20 PM' },
    { period: 7, startTime: '2:30 PM', endTime: '3:20 PM' },
  ],
  lunch: { startTime: '11:50 AM', endTime: '12:30 PM' },
};

// Sample Class Offerings with Real Instructors
const CLASS_SCHEDULE = [
  // 7th Grade Core Classes
  {
    classId: 'math-7-pre-algebra',
    period: 1,
    startTime: '8:00 AM',
    endTime: '8:50 AM',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    room: 'Math 101',
    instructor: 'Ms. Rodriguez',
    maxStudents: 28,
    currentEnrollment: 24,
    gradeLevel: '7th',
  },
  {
    classId: 'science-7-life-science',
    period: 2,
    startTime: '9:00 AM',
    endTime: '9:50 AM',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    room: 'Science Lab A',
    instructor: 'Mr. Thompson',
    maxStudents: 24,
    currentEnrollment: 22,
    gradeLevel: '7th',
  },
  {
    classId: 'english-7-language-arts',
    period: 3,
    startTime: '10:00 AM',
    endTime: '10:50 AM',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    room: 'English 201',
    instructor: 'Mrs. Johnson',
    maxStudents: 26,
    currentEnrollment: 25,
    gradeLevel: '7th',
  },
  {
    classId: 'social-7-world-geography',
    period: 4,
    startTime: '11:00 AM',
    endTime: '11:50 AM',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    room: 'Social Studies 301',
    instructor: 'Mr. Davis',
    maxStudents: 28,
    currentEnrollment: 26,
    gradeLevel: '7th',
  },

  // 8th Grade Core Classes
  {
    classId: 'math-8-algebra1',
    period: 1,
    startTime: '8:00 AM',
    endTime: '8:50 AM',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    room: 'Math 102',
    instructor: 'Ms. Chen',
    maxStudents: 26,
    currentEnrollment: 23,
    gradeLevel: '8th',
  },
  {
    classId: 'science-8-physical-science',
    period: 2,
    startTime: '9:00 AM',
    endTime: '9:50 AM',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    room: 'Science Lab B',
    instructor: 'Dr. Martinez',
    maxStudents: 24,
    currentEnrollment: 21,
    gradeLevel: '8th',
  },
  {
    classId: 'english-8-language-arts',
    period: 3,
    startTime: '10:00 AM',
    endTime: '10:50 AM',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    room: 'English 202',
    instructor: 'Mr. Wilson',
    maxStudents: 26,
    currentEnrollment: 24,
    gradeLevel: '8th',
  },
  {
    classId: 'social-8-american-history',
    period: 4,
    startTime: '11:00 AM',
    endTime: '11:50 AM',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    room: 'Social Studies 302',
    instructor: 'Mrs. Brown',
    maxStudents: 28,
    currentEnrollment: 27,
    gradeLevel: '8th',
  },

  // 9th Grade Core Classes
  {
    classId: 'math-9-geometry',
    period: 2,
    startTime: '9:00 AM',
    endTime: '9:50 AM',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    room: 'Math 201',
    instructor: 'Mr. Anderson',
    maxStudents: 28,
    currentEnrollment: 26,
    gradeLevel: '9th',
  },
  {
    classId: 'science-9-biology',
    period: 3,
    startTime: '10:00 AM',
    endTime: '10:50 AM',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    room: 'Biology Lab',
    instructor: 'Dr. Taylor',
    maxStudents: 24,
    currentEnrollment: 22,
    gradeLevel: '9th',
  },
  {
    classId: 'english-9-literature',
    period: 4,
    startTime: '11:00 AM',
    endTime: '11:50 AM',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    room: 'English 301',
    instructor: 'Ms. Garcia',
    maxStudents: 26,
    currentEnrollment: 24,
    gradeLevel: '9th',
  },
  {
    classId: 'social-9-world-history',
    period: 5,
    startTime: '12:30 PM',
    endTime: '1:20 PM',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    room: 'Social Studies 401',
    instructor: 'Mr. Lee',
    maxStudents: 28,
    currentEnrollment: 25,
    gradeLevel: '9th',
  },

  // Elective Classes
  {
    classId: 'art-visual-arts',
    period: 5,
    startTime: '12:30 PM',
    endTime: '1:20 PM',
    days: ['Monday', 'Wednesday', 'Friday'],
    room: 'Art Studio',
    instructor: 'Ms. Parker',
    maxStudents: 20,
    currentEnrollment: 18,
    gradeLevel: 'All',
  },
  {
    classId: 'music-band',
    period: 6,
    startTime: '1:30 PM',
    endTime: '2:20 PM',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    room: 'Band Hall',
    instructor: 'Mr. Miller',
    maxStudents: 40,
    currentEnrollment: 35,
    gradeLevel: 'All',
  },
  {
    classId: 'pe-health',
    period: 6,
    startTime: '1:30 PM',
    endTime: '2:20 PM',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    room: 'Gymnasium',
    instructor: 'Coach Williams',
    maxStudents: 30,
    currentEnrollment: 28,
    gradeLevel: 'All',
  },
  {
    classId: 'cs-programming',
    period: 7,
    startTime: '2:30 PM',
    endTime: '3:20 PM',
    days: ['Tuesday', 'Thursday'],
    room: 'Computer Lab',
    instructor: 'Ms. Kim',
    maxStudents: 24,
    currentEnrollment: 19,
    gradeLevel: '9th-12th',
  },
  {
    classId: 'lang-spanish1',
    period: 7,
    startTime: '2:30 PM',
    endTime: '3:20 PM',
    days: ['Monday', 'Wednesday', 'Friday'],
    room: 'Language Lab',
    instructor: 'Señora Morales',
    maxStudents: 25,
    currentEnrollment: 22,
    gradeLevel: 'All',
  },
];

// Sample Student Schedules
const STUDENT_SCHEDULES = [
  {
    studentId: 'demo-student',
    studentName: 'Alex Johnson',
    grade: '9th',
    coreClasses: {
      math: 'math-9-geometry',
      science: 'science-9-biology',
      english: 'english-9-literature',
      socialStudies: 'social-9-world-history',
    },
    electives: ['pe-health', 'music-band', 'cs-programming'],
    totalCredits: 7.0,
    isNCAACompliant: true,
    schedule: [
      {
        period: 1,
        classId: 'study-hall',
        title: 'Study Hall',
        room: 'Library',
        instructor: 'Ms. Adams',
      },
      {
        period: 2,
        classId: 'math-9-geometry',
        title: 'Geometry',
        room: 'Math 201',
        instructor: 'Mr. Anderson',
      },
      {
        period: 3,
        classId: 'science-9-biology',
        title: 'Biology',
        room: 'Biology Lab',
        instructor: 'Dr. Taylor',
      },
      {
        period: 4,
        classId: 'english-9-literature',
        title: 'English 9',
        room: 'English 301',
        instructor: 'Ms. Garcia',
      },
      {
        period: 5,
        classId: 'social-9-world-history',
        title: 'World History',
        room: 'Social Studies 401',
        instructor: 'Mr. Lee',
      },
      {
        period: 6,
        classId: 'pe-health',
        title: 'Physical Education',
        room: 'Gymnasium',
        instructor: 'Coach Williams',
      },
      {
        period: 7,
        classId: 'cs-programming',
        title: 'Computer Programming',
        room: 'Computer Lab',
        instructor: 'Ms. Kim',
      },
    ],
  },
];

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: {
        masterSchedule: MASTER_SCHEDULE,
        classSchedule: CLASS_SCHEDULE,
        coreClasses: CORE_CLASSES,
        electives: ELECTIVE_CLASSES,
        studentSchedules: STUDENT_SCHEDULES,
      },
    });
  } catch (error) {
    console.error('Schedule API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch schedule data',
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, studentId, gradeLevel } = body;

    if (action === 'generateSchedule') {
      // Auto-generate core class schedule for a grade level
      const coreClassesForGrade = CORE_CLASSES.filter((cls) => cls.gradeLevel === gradeLevel);
      const availableElectives = ELECTIVE_CLASSES;

      // Create recommended schedule
      const recommendedSchedule = {
        studentId,
        gradeLevel,
        coreClasses: coreClassesForGrade.reduce((acc, cls) => {
          acc[cls.subject.toLowerCase().replace(' ', '')] = cls.id;
          return acc;
        }, {} as any),
        availableElectives,
        totalCredits: coreClassesForGrade.reduce((sum, cls) => sum + cls.credits, 0),
        isNCAACompliant: true,
      };

      return NextResponse.json({
        success: true,
        data: recommendedSchedule,
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Invalid action',
      },
      { status: 400 },
    );
  } catch (error) {
    console.error('Schedule API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process schedule request',
      },
      { status: 500 },
    );
  }
}
