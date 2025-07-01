// State-specific compliance data for Texas, Alabama, Mississippi, Colorado, and Georgia
// Plus English with Sports dual certification requirements

import { z } from 'zod';

export const stateComplianceSchema = z.object({
  stateCode: z.string().length(2),
  stateName: z.string(),
  k12Requirements: z.object({
    graduationCredits: z.number(),
    coreSubjects: z.record(z.string(), z.number()),
    electives: z.number(),
    standardizedTests: z.array(z.string()),
    assessmentWindows: z.array(z.object({
      grade: z.string(),
      subject: z.string(),
      window: z.string(),
      required: z.boolean()
    })),
    specialEducationLaws: z.array(z.string()),
    neurodivergentSupports: z.array(z.string())
  }),
  englishSportsRequirements: z.object({
    totalCredits: z.number(),
    englishCredits: z.number(),
    sportsEducationCredits: z.number(),
    practicum: z.object({
      hours: z.number(),
      requirements: z.array(z.string())
    }),
    certificationExams: z.array(z.string()),
    continuingEducation: z.number()
  }),
  rhythmAdaptations: z.object({
    requiredFeatures: z.array(z.string()),
    accessibilityCompliance: z.array(z.string()),
    reportingRequirements: z.array(z.string())
  })
});

export type StateCompliance = z.infer<typeof stateComplianceSchema>;

// Target state compliance data
export const targetStatesCompliance: StateCompliance[] = [
  {
    stateCode: "TX",
    stateName: "Texas",
    k12Requirements: {
      graduationCredits: 26,
      coreSubjects: {
        "English Language Arts": 4,
        "Mathematics": 4,
        "Science": 4,
        "Social Studies": 3,
        "Physical Education": 1.5,
        "Health": 0.5,
        "Fine Arts": 1,
        "World Languages": 2,
        "Career and Technical Education": 1
      },
      electives: 5,
      standardizedTests: ["STAAR", "EOC Assessments"],
      assessmentWindows: [
        { grade: "3-8", subject: "Reading", window: "April-May", required: true },
        { grade: "3-8", subject: "Mathematics", window: "April-May", required: true },
        { grade: "5,8", subject: "Science", window: "April-May", required: true },
        { grade: "8", subject: "Social Studies", window: "April-May", required: true }
      ],
      specialEducationLaws: ["IDEA", "Section 504", "Texas Education Code Chapter 29"],
      neurodivergentSupports: [
        "ARD Committee processes",
        "Dyslexia services under TEC 38.003",
        "504 accommodation plans",
        "Behavior intervention plans"
      ]
    },
    englishSportsRequirements: {
      totalCredits: 36,
      englishCredits: 18,
      sportsEducationCredits: 12,
      practicum: {
        hours: 300,
        requirements: [
          "Classroom teaching under supervision",
          "Coaching practicum with certified coach",
          "Student assessment and evaluation",
          "Adaptive sports instruction"
        ]
      },
      certificationExams: ["TExES English Language Arts", "TExES Health and Physical Education"],
      continuingEducation: 150
    },
    rhythmAdaptations: {
      requiredFeatures: [
        "STAAR alignment tracking",
        "TEA reporting compatibility",
        "Dyslexia screening integration",
        "Bilingual education support"
      ],
      accessibilityCompliance: ["WCAG 2.1 AA", "Section 508", "Texas Government Code 2054"],
      reportingRequirements: [
        "Student progress monitoring",
        "Intervention documentation",
        "Assessment accommodation tracking"
      ]
    }
  },
  {
    stateCode: "AL",
    stateName: "Alabama",
    k12Requirements: {
      graduationCredits: 24,
      coreSubjects: {
        "English Language Arts": 4,
        "Mathematics": 4,
        "Science": 4,
        "Social Studies": 4,
        "Health and Physical Education": 1,
        "Career Preparedness": 6
      },
      electives: 1,
      standardizedTests: ["Alabama Comprehensive Assessment Program (ACAP)"],
      assessmentWindows: [
        { grade: "3-8", subject: "English Language Arts", window: "April-May", required: true },
        { grade: "3-8", subject: "Mathematics", window: "April-May", required: true },
        { grade: "4,6,8", subject: "Science", window: "April-May", required: true }
      ],
      specialEducationLaws: ["IDEA", "Section 504", "Alabama Administrative Code 290-8-9"],
      neurodivergentSupports: [
        "IEP development and implementation",
        "Response to Instruction framework",
        "Multi-tiered system of supports"
      ]
    },
    englishSportsRequirements: {
      totalCredits: 32,
      englishCredits: 18,
      sportsEducationCredits: 12,
      practicum: {
        hours: 280,
        requirements: [
          "Student teaching in English classroom",
          "Athletic coaching experience",
          "Special populations instruction",
          "Technology integration"
        ]
      },
      certificationExams: ["Praxis Core", "Praxis Subject Assessments"],
      continuingEducation: 60
    },
    rhythmAdaptations: {
      requiredFeatures: [
        "ACAP standards alignment",
        "RTI progress monitoring",
        "Career readiness tracking"
      ],
      accessibilityCompliance: ["WCAG 2.1 AA", "Section 508"],
      reportingRequirements: [
        "Alabama Student Information System integration",
        "Progress monitoring documentation"
      ]
    }
  },
  {
    stateCode: "MS",
    stateName: "Mississippi",
    k12Requirements: {
      graduationCredits: 24,
      coreSubjects: {
        "English": 4,
        "Mathematics": 4,
        "Science": 4,
        "Social Studies": 3,
        "Health and Physical Education": 1.5,
        "Fine Arts": 1,
        "Career and Technical Education": 2
      },
      electives: 4.5,
      standardizedTests: ["Mississippi Academic Assessment Program (MAAP)"],
      assessmentWindows: [
        { grade: "3-8", subject: "English Language Arts", window: "April-May", required: true },
        { grade: "3-8", subject: "Mathematics", window: "April-May", required: true },
        { grade: "5,8", subject: "Science", window: "April-May", required: true }
      ],
      specialEducationLaws: ["IDEA", "Section 504", "Mississippi Special Education Regulations"],
      neurodivergentSupports: [
        "Multi-tiered system of supports",
        "Individualized education programs",
        "Dyslexia therapy services"
      ]
    },
    englishSportsRequirements: {
      totalCredits: 30,
      englishCredits: 18,
      sportsEducationCredits: 12,
      practicum: {
        hours: 250,
        requirements: [
          "English instruction practicum",
          "Athletic coaching practicum",
          "Adaptive physical education",
          "Assessment and evaluation"
        ]
      },
      certificationExams: ["Praxis Core", "Praxis Subject Assessments"],
      continuingEducation: 30
    },
    rhythmAdaptations: {
      requiredFeatures: [
        "MAAP standards alignment",
        "Mississippi Student Information System compatibility",
        "Dyslexia intervention tracking"
      ],
      accessibilityCompliance: ["WCAG 2.1 AA", "Section 508"],
      reportingRequirements: [
        "Student growth documentation",
        "Intervention tracking"
      ]
    }
  },
  {
    stateCode: "CO",
    stateName: "Colorado",
    k12Requirements: {
      graduationCredits: 23,
      coreSubjects: {
        "English": 4,
        "Mathematics": 3,
        "Science": 3,
        "Social Studies": 3,
        "Physical Education": 1,
        "Health": 0.5,
        "Fine Arts": 1,
        "World Languages": 1
      },
      electives: 6.5,
      standardizedTests: ["Colorado Measures of Academic Success (CMAS)", "PSAT", "SAT"],
      assessmentWindows: [
        { grade: "3-8", subject: "English Language Arts", window: "April-May", required: true },
        { grade: "3-8", subject: "Mathematics", window: "April-May", required: true },
        { grade: "5,8,11", subject: "Science", window: "April-May", required: true },
        { grade: "4,7", subject: "Social Studies", window: "April-May", required: true }
      ],
      specialEducationLaws: ["IDEA", "Section 504", "Colorado Special Education Rules"],
      neurodivergentSupports: [
        "Multi-tiered support systems",
        "READ Act interventions",
        "Gifted education programs"
      ]
    },
    englishSportsRequirements: {
      totalCredits: 36,
      englishCredits: 21,
      sportsEducationCredits: 15,
      practicum: {
        hours: 400,
        requirements: [
          "Student teaching in secondary English",
          "Coaching practicum with certification",
          "Adaptive sports instruction",
          "Technology integration in instruction"
        ]
      },
      certificationExams: ["Praxis Core", "Content Area Assessment"],
      continuingEducation: 90
    },
    rhythmAdaptations: {
      requiredFeatures: [
        "Colorado Academic Standards alignment",
        "READ Act compliance tracking",
        "Individual Career and Academic Plans support"
      ],
      accessibilityCompliance: ["WCAG 2.1 AA", "Section 508", "Colorado Anti-Discrimination Act"],
      reportingRequirements: [
        "Student growth measurements",
        "READ Act progress monitoring",
        "Concurrent enrollment tracking"
      ]
    }
  },
  {
    stateCode: "GA",
    stateName: "Georgia",
    k12Requirements: {
      graduationCredits: 23,
      coreSubjects: {
        "English Language Arts": 4,
        "Mathematics": 4,
        "Science": 4,
        "Social Studies": 3,
        "Health and Physical Education": 1,
        "Fine Arts": 1,
        "World Languages": 2,
        "Career, Technical, Agricultural Education": 3
      },
      electives: 1,
      standardizedTests: ["Georgia Milestones Assessment System"],
      assessmentWindows: [
        { grade: "3-8", subject: "English Language Arts", window: "April-May", required: true },
        { grade: "3-8", subject: "Mathematics", window: "April-May", required: true },
        { grade: "5,8", subject: "Science", window: "April-May", required: true },
        { grade: "5,8", subject: "Social Studies", window: "April-May", required: true }
      ],
      specialEducationLaws: ["IDEA", "Section 504", "Georgia Special Needs Scholarship Program"],
      neurodivergentSupports: [
        "Student Support Team process",
        "Response to Intervention framework",
        "Autism program supports"
      ]
    },
    englishSportsRequirements: {
      totalCredits: 34,
      englishCredits: 20,
      sportsEducationCredits: 14,
      practicum: {
        hours: 350,
        requirements: [
          "Student teaching in English Language Arts",
          "Athletic coaching with mentor",
          "Special needs sports instruction",
          "Assessment and data analysis"
        ]
      },
      certificationExams: ["Georgia Assessments for the Certification of Educators (GACE)"],
      continuingEducation: 100
    },
    rhythmAdaptations: {
      requiredFeatures: [
        "Georgia Standards of Excellence alignment",
        "Student Information System compatibility",
        "Georgia Milestones preparation tools"
      ],
      accessibilityCompliance: ["WCAG 2.1 AA", "Section 508", "Georgia Accessibility Standards"],
      reportingRequirements: [
        "Student Learning Objectives tracking",
        "Growth measurement documentation",
        "Special education compliance reporting"
      ]
    }
  }
];

// Enhanced Rhythm language features for state compliance
export const rhythmComplianceFeatures = {
  stateStandardsTracking: {
    description: "Automatic alignment tracking with state standards",
    implementation: "Built-in metadata tags for standards alignment"
  },
  accessibilityCompliance: {
    description: "WCAG 2.1 AA and Section 508 compliance built into all templates",
    implementation: "Automatic accessibility checks and remediation suggestions"
  },
  neurodivergentAdaptations: {
    description: "Built-in adaptations for ADHD, Autism, Dyslexia, and other profiles",
    implementation: "Dynamic content adaptation based on student profile"
  },
  assessmentIntegration: {
    description: "Integration with state assessment systems",
    implementation: "Direct data export to state reporting systems"
  },
  progressMonitoring: {
    description: "Real-time progress tracking against state benchmarks",
    implementation: "Dashboard with state-specific progress indicators"
  },
  englishSportsIntegration: {
    description: "Specialized dual certification tracking for English with Sports programs",
    implementation: "Combined curriculum pathway with dual competency tracking"
  }
};

// AI optimization targets for Copilot/DeepSeeker/ChatGPT4
export const aiOptimizationTargets = {
  rhythmLanguageEnhancements: [
    "Dynamic content adaptation based on real-time student performance",
    "Automatic state standards alignment suggestions",
    "AI-powered accessibility remediation",
    "Intelligent pacing adjustments for neurodivergent learners",
    "Contextual scaffolding generation",
    "Multilingual support for ELL students"
  ],
  contentGeneration: [
    "State-specific curriculum generation",
    "Neurodivergent-friendly activity creation",
    "Sports-integrated English lessons",
    "Assessment item generation with accommodations",
    "Progress report automation",
    "Parent communication templates"
  ],
  adaptiveLearning: [
    "Real-time difficulty adjustment",
    "Learning style detection and adaptation",
    "Attention span optimization for ADHD",
    "Sensory-friendly content modifications",
    "Executive function support integration",
    "Social skills development through sports narratives"
  ],
  complianceAutomation: [
    "Automatic IEP goal tracking",
    "State reporting automation",
    "Accessibility audit automation",
    "Documentation generation for compliance",
    "Progress monitoring automation",
    "Certification requirement tracking"
  ]
};