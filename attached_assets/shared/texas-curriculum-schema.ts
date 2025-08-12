import { z } from 'zod'

// Texas Essential Knowledge and Skills (TEKS) Schema for 2024-2025
export const TexasGradeLevelSchema = z.enum([
  'K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'
])

export const TexasSubjectSchema = z.enum([
  'english_language_arts',
  'mathematics',
  'science',
  'social_studies',
  'technology_applications',
  'fine_arts',
  'health',
  'physical_education',
  'career_technical_education',
  'world_languages'
])

export const TexasCurriculumStandardSchema = z.object({
  id: z.string(),
  grade_level: TexasGradeLevelSchema,
  subject: TexasSubjectSchema,
  standard_code: z.string(), // e.g., "K.2.A", "1.3.B"
  standard_text: z.string(),
  knowledge_skills: z.array(z.string()),
  assessment_type: z.enum(['readiness', 'supporting']),
  cross_curricular_connections: z.array(TexasSubjectSchema).optional(),
  created_at: z.date().default(() => new Date()),
  updated_at: z.date().default(() => new Date())
})

export const TexasStudentOnboardingSchema = z.object({
  id: z.string(),
  student_id: z.string(),
  grade_level: TexasGradeLevelSchema,
  school_type: z.enum(['primary', 'secondary', 'law', 'language', 'sports']),
  learning_style: z.enum(['visual', 'auditory', 'kinesthetic', 'reading_writing', 'multimodal']),
  neurodivergent_accommodations: z.array(z.enum([
    'adhd', 'dyslexia', 'autism', 'processing_disorder', 'anxiety', 'none'
  ])),
  academic_strengths: z.array(TexasSubjectSchema),
  academic_challenges: z.array(TexasSubjectSchema),
  extracurricular_interests: z.array(z.string()),
  parent_email: z.string().email(),
  emergency_contact: z.string(),
  medical_considerations: z.string().optional(),
  transportation_needs: z.string().optional(),
  technology_access: z.object({
    has_device: z.boolean(),
    has_internet: z.boolean(),
    device_type: z.enum(['laptop', 'tablet', 'smartphone', 'desktop', 'none']).optional()
  }),
  created_at: z.date().default(() => new Date()),
  updated_at: z.date().default(() => new Date())
})

export const TexasClassScheduleSchema = z.object({
  id: z.string(),
  student_id: z.string(),
  grade_level: TexasGradeLevelSchema,
  school_year: z.string(), // e.g., "2024-2025"
  semester: z.enum(['fall', 'spring', 'summer']),
  weekly_schedule: z.array(z.object({
    day: z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday']),
    periods: z.array(z.object({
      period_number: z.number(),
      start_time: z.string(), // e.g., "08:00"
      end_time: z.string(), // e.g., "08:50"
      subject: TexasSubjectSchema,
      teacher_name: z.string(),
      room_number: z.string().optional(),
      teks_standards: z.array(z.string()), // Array of standard codes
      ai_teacher_id: z.string().optional(),
      accommodations: z.array(z.string()).optional()
    }))
  })),
  total_instructional_minutes: z.number(), // Texas requires minimum minutes per subject
  meets_texas_requirements: z.boolean(),
  compliance_notes: z.string().optional(),
  created_at: z.date().default(() => new Date()),
  updated_at: z.date().default(() => new Date())
})

export const TexasGradeRequirementsSchema = z.object({
  grade_level: TexasGradeLevelSchema,
  required_subjects: z.array(z.object({
    subject: TexasSubjectSchema,
    min_minutes_per_week: z.number(),
    min_minutes_per_day: z.number().optional(),
    required_standards: z.array(z.string()),
    assessment_requirements: z.array(z.string())
  })),
  total_instructional_minutes: z.number(),
  graduation_requirements: z.object({
    credits_needed: z.number().optional(),
    required_courses: z.array(z.string()).optional(),
    elective_options: z.array(z.string()).optional()
  }).optional()
})

// Texas-specific curriculum data
export const TEXAS_CURRICULUM_DATA = {
  elementary: {
    'K': {
      required_subjects: [
        { subject: 'english_language_arts', min_minutes_per_week: 315, standards: ['K.1.A', 'K.1.B', 'K.2.A'] },
        { subject: 'mathematics', min_minutes_per_week: 225, standards: ['K.2.A', 'K.2.B', 'K.3.A'] },
        { subject: 'science', min_minutes_per_week: 100, standards: ['K.1.A', 'K.2.A', 'K.3.A'] },
        { subject: 'social_studies', min_minutes_per_week: 100, standards: ['K.1.A', 'K.2.A', 'K.3.A'] },
        { subject: 'fine_arts', min_minutes_per_week: 90, standards: ['K.1.A', 'K.2.A'] },
        { subject: 'health', min_minutes_per_week: 30, standards: ['K.1.A', 'K.2.A'] },
        { subject: 'physical_education', min_minutes_per_week: 90, standards: ['K.1.A', 'K.2.A'] }
      ],
      total_instructional_minutes: 950
    },
    '1': {
      required_subjects: [
        { subject: 'english_language_arts', min_minutes_per_week: 315, standards: ['1.1.A', '1.1.B', '1.2.A'] },
        { subject: 'mathematics', min_minutes_per_week: 225, standards: ['1.2.A', '1.2.B', '1.3.A'] },
        { subject: 'science', min_minutes_per_week: 100, standards: ['1.1.A', '1.2.A', '1.3.A'] },
        { subject: 'social_studies', min_minutes_per_week: 100, standards: ['1.1.A', '1.2.A', '1.3.A'] },
        { subject: 'fine_arts', min_minutes_per_week: 90, standards: ['1.1.A', '1.2.A'] },
        { subject: 'health', min_minutes_per_week: 30, standards: ['1.1.A', '1.2.A'] },
        { subject: 'physical_education', min_minutes_per_week: 90, standards: ['1.1.A', '1.2.A'] }
      ],
      total_instructional_minutes: 950
    },
    '2': {
      required_subjects: [
        { subject: 'english_language_arts', min_minutes_per_week: 315, standards: ['2.1.A', '2.1.B', '2.2.A'] },
        { subject: 'mathematics', min_minutes_per_week: 225, standards: ['2.2.A', '2.2.B', '2.3.A'] },
        { subject: 'science', min_minutes_per_week: 100, standards: ['2.1.A', '2.2.A', '2.3.A'] },
        { subject: 'social_studies', min_minutes_per_week: 100, standards: ['2.1.A', '2.2.A', '2.3.A'] },
        { subject: 'fine_arts', min_minutes_per_week: 90, standards: ['2.1.A', '2.2.A'] },
        { subject: 'health', min_minutes_per_week: 30, standards: ['2.1.A', '2.2.A'] },
        { subject: 'physical_education', min_minutes_per_week: 90, standards: ['2.1.A', '2.2.A'] }
      ],
      total_instructional_minutes: 950
    },
    '3': {
      required_subjects: [
        { subject: 'english_language_arts', min_minutes_per_week: 315, standards: ['3.1.A', '3.1.B', '3.2.A'] },
        { subject: 'mathematics', min_minutes_per_week: 225, standards: ['3.2.A', '3.2.B', '3.3.A'] },
        { subject: 'science', min_minutes_per_week: 100, standards: ['3.1.A', '3.2.A', '3.3.A'] },
        { subject: 'social_studies', min_minutes_per_week: 100, standards: ['3.1.A', '3.2.A', '3.3.A'] },
        { subject: 'fine_arts', min_minutes_per_week: 90, standards: ['3.1.A', '3.2.A'] },
        { subject: 'health', min_minutes_per_week: 30, standards: ['3.1.A', '3.2.A'] },
        { subject: 'physical_education', min_minutes_per_week: 90, standards: ['3.1.A', '3.2.A'] }
      ],
      total_instructional_minutes: 950
    },
    '4': {
      required_subjects: [
        { subject: 'english_language_arts', min_minutes_per_week: 315, standards: ['4.1.A', '4.1.B', '4.2.A'] },
        { subject: 'mathematics', min_minutes_per_week: 225, standards: ['4.2.A', '4.2.B', '4.3.A'] },
        { subject: 'science', min_minutes_per_week: 100, standards: ['4.1.A', '4.2.A', '4.3.A'] },
        { subject: 'social_studies', min_minutes_per_week: 100, standards: ['4.1.A', '4.2.A', '4.3.A'] },
        { subject: 'fine_arts', min_minutes_per_week: 90, standards: ['4.1.A', '4.2.A'] },
        { subject: 'health', min_minutes_per_week: 30, standards: ['4.1.A', '4.2.A'] },
        { subject: 'physical_education', min_minutes_per_week: 90, standards: ['4.1.A', '4.2.A'] }
      ],
      total_instructional_minutes: 950
    },
    '5': {
      required_subjects: [
        { subject: 'english_language_arts', min_minutes_per_week: 315, standards: ['5.1.A', '5.1.B', '5.2.A'] },
        { subject: 'mathematics', min_minutes_per_week: 225, standards: ['5.2.A', '5.2.B', '5.3.A'] },
        { subject: 'science', min_minutes_per_week: 100, standards: ['5.1.A', '5.2.A', '5.3.A'] },
        { subject: 'social_studies', min_minutes_per_week: 100, standards: ['5.1.A', '5.2.A', '5.3.A'] },
        { subject: 'fine_arts', min_minutes_per_week: 90, standards: ['5.1.A', '5.2.A'] },
        { subject: 'health', min_minutes_per_week: 30, standards: ['5.1.A', '5.2.A'] },
        { subject: 'physical_education', min_minutes_per_week: 90, standards: ['5.1.A', '5.2.A'] }
      ],
      total_instructional_minutes: 950
    }
  },
  middle_school: {
    '6': {
      required_subjects: [
        { subject: 'english_language_arts', min_minutes_per_week: 250, standards: ['6.1.A', '6.1.B', '6.2.A'] },
        { subject: 'mathematics', min_minutes_per_week: 250, standards: ['6.2.A', '6.2.B', '6.3.A'] },
        { subject: 'science', min_minutes_per_week: 200, standards: ['6.1.A', '6.2.A', '6.3.A'] },
        { subject: 'social_studies', min_minutes_per_week: 200, standards: ['6.1.A', '6.2.A', '6.3.A'] },
        { subject: 'fine_arts', min_minutes_per_week: 150, standards: ['6.1.A', '6.2.A'] },
        { subject: 'health', min_minutes_per_week: 75, standards: ['6.1.A', '6.2.A'] },
        { subject: 'physical_education', min_minutes_per_week: 225, standards: ['6.1.A', '6.2.A'] }
      ],
      total_instructional_minutes: 1350
    },
    '7': {
      required_subjects: [
        { subject: 'english_language_arts', min_minutes_per_week: 250, standards: ['7.1.A', '7.1.B', '7.2.A'] },
        { subject: 'mathematics', min_minutes_per_week: 250, standards: ['7.2.A', '7.2.B', '7.3.A'] },
        { subject: 'science', min_minutes_per_week: 200, standards: ['7.1.A', '7.2.A', '7.3.A'] },
        { subject: 'social_studies', min_minutes_per_week: 200, standards: ['7.1.A', '7.2.A', '7.3.A'] },
        { subject: 'fine_arts', min_minutes_per_week: 150, standards: ['7.1.A', '7.2.A'] },
        { subject: 'health', min_minutes_per_week: 75, standards: ['7.1.A', '7.2.A'] },
        { subject: 'physical_education', min_minutes_per_week: 225, standards: ['7.1.A', '7.2.A'] }
      ],
      total_instructional_minutes: 1350
    },
    '8': {
      required_subjects: [
        { subject: 'english_language_arts', min_minutes_per_week: 250, standards: ['8.1.A', '8.1.B', '8.2.A'] },
        { subject: 'mathematics', min_minutes_per_week: 250, standards: ['8.2.A', '8.2.B', '8.3.A'] },
        { subject: 'science', min_minutes_per_week: 200, standards: ['8.1.A', '8.2.A', '8.3.A'] },
        { subject: 'social_studies', min_minutes_per_week: 200, standards: ['8.1.A', '8.2.A', '8.3.A'] },
        { subject: 'fine_arts', min_minutes_per_week: 150, standards: ['8.1.A', '8.2.A'] },
        { subject: 'health', min_minutes_per_week: 75, standards: ['8.1.A', '8.2.A'] },
        { subject: 'physical_education', min_minutes_per_week: 225, standards: ['8.1.A', '8.2.A'] }
      ],
      total_instructional_minutes: 1350
    }
  },
  high_school: {
    '9': {
      required_subjects: [
        { subject: 'english_language_arts', min_minutes_per_week: 250, standards: ['ELA.9.1.A', 'ELA.9.1.B'] },
        { subject: 'mathematics', min_minutes_per_week: 250, standards: ['ALG.1.A', 'ALG.1.B'] },
        { subject: 'science', min_minutes_per_week: 250, standards: ['BIO.1.A', 'BIO.1.B'] },
        { subject: 'social_studies', min_minutes_per_week: 250, standards: ['WH.1.A', 'WH.1.B'] },
        { subject: 'fine_arts', min_minutes_per_week: 150, standards: ['FA.1.A', 'FA.1.B'] },
        { subject: 'health', min_minutes_per_week: 75, standards: ['HE.1.A', 'HE.1.B'] },
        { subject: 'physical_education', min_minutes_per_week: 225, standards: ['PE.1.A', 'PE.1.B'] }
      ],
      total_instructional_minutes: 1450
    }
  }
}

// Types for TypeScript usage
export type TexasGradeLevel = z.infer<typeof TexasGradeLevelSchema>
export type TexasSubject = z.infer<typeof TexasSubjectSchema>
export type TexasCurriculumStandard = z.infer<typeof TexasCurriculumStandardSchema>
export type TexasStudentOnboarding = z.infer<typeof TexasStudentOnboardingSchema>
export type TexasClassSchedule = z.infer<typeof TexasClassScheduleSchema>
export type TexasGradeRequirements = z.infer<typeof TexasGradeRequirementsSchema>