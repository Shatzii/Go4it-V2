// Academic standards and curriculum mapping system for 50 states
import { z } from 'zod';

// Base types for academic standards system
export const stateStandardSchema = z.object({
  id: z.string(),
  stateCode: z.string().length(2),
  stateName: z.string(),
  subject: z.string(),
  gradeLevel: z.string(),
  standardCode: z.string(),
  description: z.string(),
  category: z.string(),
  subcategory: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  dateAdopted: z.string().optional(),
  dateUpdated: z.string().optional(),
});

export const learningObjectiveSchema = z.object({
  id: z.string(),
  standardId: z.string(),
  description: z.string(),
  bloomsLevel: z.enum(['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create']),
  difficultyLevel: z.enum(['Introductory', 'Developing', 'Proficient', 'Advanced']),
  neurodivergentConsiderations: z.array(z.object({
    type: z.enum(['ADHD', 'Autism', 'Dyslexia', 'Dyscalculia', 'General']),
    adaptations: z.string(),
    strengths: z.string(),
    supportStrategies: z.string()
  })).optional(),
});

export const lessonPlanSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  gradeLevel: z.string(),
  subject: z.string(),
  authorId: z.number(),
  standards: z.array(z.string()), // Standard IDs covered
  objectives: z.array(z.string()), // Learning Objective IDs
  duration: z.number(), // in minutes
  materials: z.array(z.string()),
  preparation: z.string(),
  procedure: z.string(),
  assessment: z.string(),
  differentiation: z.object({
    adhd: z.string().optional(),
    autism: z.string().optional(),
    dyslexia: z.string().optional(),
    dyscalculia: z.string().optional(),
    gifted: z.string().optional(),
    ell: z.string().optional(),
    other: z.string().optional(),
  }),
  extensions: z.array(z.string()).optional(),
  resources: z.array(z.object({
    title: z.string(),
    url: z.string().optional(),
    type: z.enum(['Video', 'Article', 'Worksheet', 'Interactive', 'Audio', 'Game', 'Other']),
    description: z.string().optional(),
  })).optional(),
  tags: z.array(z.string()).optional(),
  visibility: z.enum(['Private', 'School', 'District', 'Public']),
  status: z.enum(['Draft', 'Review', 'Published', 'Archived']),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const academicUnitSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  gradeLevel: z.string(),
  subject: z.string(),
  authorId: z.number(),
  lessons: z.array(z.string()), // Lesson Plan IDs
  duration: z.number(), // in days
  essential_questions: z.array(z.string()),
  big_ideas: z.array(z.string()),
  assessments: z.array(z.object({
    title: z.string(),
    type: z.enum(['Formative', 'Summative', 'Diagnostic', 'Performance']),
    description: z.string(),
    differentiation: z.object({
      adhd: z.string().optional(),
      autism: z.string().optional(),
      dyslexia: z.string().optional(),
      dyscalculia: z.string().optional(),
      gifted: z.string().optional(),
      ell: z.string().optional(),
      other: z.string().optional(),
    }).optional(),
  })),
  visibility: z.enum(['Private', 'School', 'District', 'Public']),
  status: z.enum(['Draft', 'Review', 'Published', 'Archived']),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Additional common U.S. educational structures
export const schoolYearSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  startDate: z.string(),
  endDate: z.string(),
  units: z.array(z.string()), // Academic Unit IDs
  gradeLevel: z.string(),
  subject: z.string(),
  authorId: z.number(),
  standards: z.array(z.string()), // Standard IDs covered
});

// Types based on schemas
export type StateStandard = z.infer<typeof stateStandardSchema>;
export type LearningObjective = z.infer<typeof learningObjectiveSchema>;
export type LessonPlan = z.infer<typeof lessonPlanSchema>;
export type AcademicUnit = z.infer<typeof academicUnitSchema>;
export type SchoolYear = z.infer<typeof schoolYearSchema>;

// Neurodivergent learning profiles with considerations and adaptations
export const neurodivergentProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['ADHD', 'Autism', 'Dyslexia', 'Dyscalculia', 'Combined', 'Other']),
  description: z.string(),
  learningStrengths: z.array(z.string()),
  learningChallenges: z.array(z.string()),
  recommendedAccommodations: z.array(z.object({
    category: z.enum(['Environmental', 'Instructional', 'Assessment', 'Social', 'Executive Function']),
    accommodations: z.array(z.string())
  })),
  preferredLearningStyles: z.array(z.enum(['Visual', 'Auditory', 'Kinesthetic', 'Reading/Writing'])),
  interestAreas: z.array(z.string()).optional(),
  sensoryConsiderations: z.array(z.object({
    senseType: z.enum(['Visual', 'Auditory', 'Tactile', 'Olfactory', 'Proprioceptive', 'Vestibular']),
    preferences: z.array(z.string()),
    sensitivities: z.array(z.string())
  })).optional(),
  executiveFunctionSupports: z.array(z.object({
    area: z.enum(['Planning', 'Organization', 'Time Management', 'Working Memory', 'Emotional Regulation', 'Task Initiation', 'Flexibility']),
    strategies: z.array(z.string())
  })).optional(),
  colorSchemePreference: z.enum(['Standard', 'High Contrast', 'Reduced Blue Light', 'Pastel', 'Neutral']).optional(),
  fontPreference: z.enum(['Standard', 'Dyslexia Friendly', 'Large Print', 'Spaced']).optional(),
});

export type NeurodivergentProfile = z.infer<typeof neurodivergentProfileSchema>;

// State-specific education requirements and regulations
export interface StateEducationRequirements {
  stateCode: string;
  stateName: string;
  graduationRequirements: {
    totalCredits: number;
    coreSubjects: Record<string, number>; // Subject -> credits required
    electiveCredits: number;
    specialRequirements: string[];
  };
  testingRequirements: {
    standardizedTests: string[];
    gradeLevels: string[];
    proficiencyRequirements: string;
  };
  specialEducationProvisions: {
    laws: string[];
    accommodationRequirements: string;
    iepGuidelines: string;
  };
}

// Curriculum path with personalization options based on neurodivergent profile
export const curriculumPathSchema = z.object({
  id: z.string(),
  studentId: z.string().optional(), // Optional if creating a generic path
  profileId: z.string().optional(), // Link to NeurodivergentProfile if used
  gradeLevel: z.string(),
  subject: z.string(),
  stateCode: z.string().length(2),
  standardsVersion: z.string(),
  units: z.array(z.object({
    unitId: z.string(),
    adaptations: z.array(z.object({
      original: z.string(),
      adapted: z.string(),
      reason: z.string()
    })).optional()
  })),
  pace: z.enum(['Accelerated', 'Standard', 'Extended']),
  presentationPreferences: z.object({
    visualElements: z.enum(['Standard', 'Enhanced', 'Reduced']),
    audioElements: z.enum(['Standard', 'Enhanced', 'Reduced']),
    textElements: z.enum(['Standard', 'Enhanced', 'Reduced', 'Simplified']),
    interactiveElements: z.enum(['Standard', 'Enhanced', 'Reduced']),
  }),
  assessmentAdaptations: z.object({
    timeModifications: z.boolean(),
    formatModifications: z.boolean(),
    contentModifications: z.boolean(),
    environmentalModifications: z.boolean(),
    details: z.string().optional()
  }),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type CurriculumPath = z.infer<typeof curriculumPathSchema>;