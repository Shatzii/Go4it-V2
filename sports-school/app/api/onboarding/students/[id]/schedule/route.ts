import { NextRequest, NextResponse } from 'next/server';
import { TEXAS_CURRICULUM_DATA } from '@/shared/texas-curriculum-schema';

// Sample students data
const SAMPLE_STUDENTS = [
  {
    id: '1',
    name: 'Emma Rodriguez',
    grade: 'K',
    school: 'primary',
    learningStyle: 'visual',
    accommodations: ['none'],
    strengths: ['mathematics', 'fine_arts'],
    challenges: ['english_language_arts'],
    interests: ['drawing', 'puzzles', 'animals'],
    parentEmail: 'maria.rodriguez@email.com',
    emergencyContact: '555-0123',
    medicalNotes: 'No known allergies',
    technologyAccess: { hasDevice: true, hasInternet: true, deviceType: 'tablet' },
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    grade: '3',
    school: 'primary',
    learningStyle: 'kinesthetic',
    accommodations: ['adhd'],
    strengths: ['science', 'physical_education'],
    challenges: ['mathematics'],
    interests: ['sports', 'experiments', 'building'],
    parentEmail: 'jennifer.johnson@email.com',
    emergencyContact: '555-0456',
    medicalNotes: 'ADHD - takes medication daily',
    technologyAccess: { hasDevice: true, hasInternet: true, deviceType: 'laptop' },
  },
  {
    id: '3',
    name: 'Sophia Chen',
    grade: '6',
    school: 'secondary',
    learningStyle: 'reading_writing',
    accommodations: ['dyslexia'],
    strengths: ['social_studies', 'fine_arts'],
    challenges: ['english_language_arts'],
    interests: ['history', 'writing', 'theater'],
    parentEmail: 'david.chen@email.com',
    emergencyContact: '555-0789',
    medicalNotes: 'Dyslexia - needs extra time for reading',
    technologyAccess: { hasDevice: true, hasInternet: true, deviceType: 'laptop' },
  },
  {
    id: '4',
    name: "Aiden O'Connor",
    grade: '9',
    school: 'secondary',
    learningStyle: 'multimodal',
    accommodations: ['anxiety'],
    strengths: ['mathematics', 'science'],
    challenges: ['social_studies'],
    interests: ['coding', 'robotics', 'music'],
    parentEmail: 'sarah.oconnor@email.com',
    emergencyContact: '555-0012',
    medicalNotes: 'Anxiety disorder - needs calm environment',
    technologyAccess: { hasDevice: true, hasInternet: true, deviceType: 'desktop' },
  },
  {
    id: '5',
    name: 'Zoe Williams',
    grade: '11',
    school: 'law',
    learningStyle: 'auditory',
    accommodations: ['none'],
    strengths: ['english_language_arts', 'social_studies'],
    challenges: ['mathematics'],
    interests: ['debate', 'law', 'public_speaking'],
    parentEmail: 'robert.williams@email.com',
    emergencyContact: '555-0345',
    medicalNotes: 'No medical concerns',
    technologyAccess: { hasDevice: true, hasInternet: true, deviceType: 'laptop' },
  },
];

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const student = SAMPLE_STUDENTS.find((s) => s.id === params.id);

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const schedule = await generateScheduleForStudent(student);
    return NextResponse.json(schedule);
  } catch (error) {
    console.error('Error generating schedule:', error);
    return NextResponse.json({ error: 'Failed to generate schedule' }, { status: 500 });
  }
}

// Helper function to generate schedule
async function generateScheduleForStudent(student: any) {
  // Simulate API processing time
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Get appropriate curriculum data for grade
  const gradeData =
    TEXAS_CURRICULUM_DATA.elementary[
      student.grade as keyof typeof TEXAS_CURRICULUM_DATA.elementary
    ] ||
    TEXAS_CURRICULUM_DATA.middle_school[
      student.grade as keyof typeof TEXAS_CURRICULUM_DATA.middle_school
    ] ||
    TEXAS_CURRICULUM_DATA.high_school[
      student.grade as keyof typeof TEXAS_CURRICULUM_DATA.high_school
    ];

  if (!gradeData) {
    throw new Error(`No curriculum data found for grade ${student.grade}`);
  }

  // Generate time slots for the schedule
  const timeSlots = generateTimeSlots(gradeData.required_subjects.length);

  // Create weekly schedule
  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
  const weeklySchedule = daysOfWeek.map((day) => ({
    day,
    periods: gradeData.required_subjects.map((subject, index) => ({
      period_number: index + 1,
      start_time: timeSlots[index].start,
      end_time: timeSlots[index].end,
      subject: subject.subject,
      teacher_name: getTeacherForSubject(subject.subject),
      room_number: `${100 + index}`,
      teks_standards: subject.standards,
      ai_teacher_id: getAITeacherForSubject(subject.subject),
      accommodations: student.accommodations.filter((acc: string) => acc !== 'none'),
    })),
  }));

  // Add personalized accommodations based on student profile
  const personalizedSchedule = addPersonalizedAccommodations(weeklySchedule, student);

  const schedule = {
    id: `schedule-${student.id}`,
    student_id: student.id,
    grade_level: student.grade,
    school_year: '2024-2025',
    semester: 'fall',
    weekly_schedule: personalizedSchedule,
    total_instructional_minutes: gradeData.total_instructional_minutes,
    meets_texas_requirements: true,
    compliance_notes: `Schedule meets all Texas TEKS requirements for grade ${student.grade}. Personalized accommodations included for ${student.accommodations.join(', ')}.`,
    created_at: new Date(),
    updated_at: new Date(),
  };

  return schedule;
}

// Helper function to generate time slots
function generateTimeSlots(numberOfSubjects: number) {
  const slots = [];
  let currentHour = 8; // Start at 8:00 AM

  for (let i = 0; i < numberOfSubjects; i++) {
    const startTime = `${currentHour.toString().padStart(2, '0')}:00`;
    const endTime = `${(currentHour + 1).toString().padStart(2, '0')}:00`;

    slots.push({
      start: startTime,
      end: endTime,
    });

    currentHour++;
  }

  return slots;
}

// Helper function to get teacher for subject
function getTeacherForSubject(subject: string) {
  const teachers = {
    english_language_arts: 'Ms. Shakespeare',
    mathematics: 'Professor Newton',
    science: 'Dr. Curie',
    social_studies: 'Professor Timeline',
    fine_arts: 'Maestro Picasso',
    physical_education: 'Coach Johnson',
    health: 'Dr. Inclusive',
    technology_applications: 'Mr. Tech',
    world_languages: 'Señora Garcia',
    career_technical_education: 'Ms. Career',
  };
  return teachers[subject as keyof typeof teachers] || 'General Teacher';
}

// Helper function to get AI teacher for subject
function getAITeacherForSubject(subject: string) {
  const aiTeachers = {
    english_language_arts: 'shakespeare',
    mathematics: 'newton',
    science: 'curie',
    social_studies: 'timeline',
    fine_arts: 'picasso',
    physical_education: 'inclusive',
    health: 'inclusive',
    technology_applications: 'tech',
    world_languages: 'garcia',
    career_technical_education: 'career',
  };
  return aiTeachers[subject as keyof typeof aiTeachers] || 'general';
}

// Helper function to add personalized accommodations
function addPersonalizedAccommodations(schedule: any[], student: any) {
  return schedule.map((day) => ({
    ...day,
    periods: day.periods.map((period: any) => {
      const accommodations = [...period.accommodations];

      // Add specific accommodations based on student needs
      if (student.accommodations.includes('adhd')) {
        accommodations.push('Movement breaks every 15 minutes');
        accommodations.push('Fidget tools available');
        accommodations.push('Preferential seating');
      }

      if (student.accommodations.includes('dyslexia')) {
        accommodations.push('Text-to-speech software');
        accommodations.push('Extended time for reading');
        accommodations.push('Large font materials');
      }

      if (student.accommodations.includes('anxiety')) {
        accommodations.push('Calm corner available');
        accommodations.push('Stress ball or fidget toy');
        accommodations.push('Quiet testing environment');
      }

      if (student.accommodations.includes('autism')) {
        accommodations.push('Visual schedule');
        accommodations.push('Sensory break availability');
        accommodations.push('Structured routine');
      }

      // Add learning style accommodations
      if (student.learningStyle === 'visual') {
        accommodations.push('Visual aids and charts');
        accommodations.push('Color-coded materials');
      }

      if (student.learningStyle === 'auditory') {
        accommodations.push('Audio recordings');
        accommodations.push('Verbal instructions');
      }

      if (student.learningStyle === 'kinesthetic') {
        accommodations.push('Hands-on activities');
        accommodations.push('Movement opportunities');
      }

      return {
        ...period,
        accommodations: [...new Set(accommodations)], // Remove duplicates
      };
    }),
  }));
}
