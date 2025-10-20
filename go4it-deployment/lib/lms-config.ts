export const LMS_CONFIG = {
  // Open source LMS configuration
  moodle: {
    enabled: true,
    url: process.env.LMS_URL || 'http://localhost:5000/lms',
    wsToken: process.env.LMS_WS_TOKEN,
    apiEndpoint: '/webservice/rest/server.php',
    functions: {
      getUserInfo: 'core_user_get_users_by_field',
      getCourses: 'core_course_get_courses',
      enrollUser: 'enrol_manual_enrol_users',
      getGrades: 'core_grades_get_grades',
      createUser: 'core_user_create_users',
      updateGrade: 'core_grades_update_grades',
    },
  },
  content: {
    sportsScience: {
      enabled: true,
      courses: [
        'Biomechanics Fundamentals',
        'Sports Psychology',
        'Exercise Physiology',
        'Nutrition for Athletes',
        'Injury Prevention',
      ],
    },
    ncaaCompliance: {
      enabled: true,
      courses: [
        'NCAA Eligibility Rules',
        'Academic Standards',
        'Recruiting Guidelines',
        'Amateurism Certification',
      ],
    },
    physicalEducation: {
      enabled: true,
      gradeLevel: 'K-12',
      courses: [
        'Elementary PE Fundamentals',
        'Middle School Sports',
        'High School Athletics',
        'Fitness & Wellness',
      ],
    },
  },
  integration: {
    syncUsers: true,
    syncGrades: true,
    ssoEnabled: true,
    parentPortal: true,
  },
};

export type LMSCourse = {
  id: string;
  title: string;
  description: string;
  gradeLevel?: string;
  credits: number;
  instructor: string;
  modules: LMSModule[];
  assessments: LMSAssessment[];
};

export type LMSModule = {
  id: string;
  title: string;
  content: string;
  videoUrl?: string;
  resources: LMSResource[];
  order: number;
};

export type LMSResource = {
  id: string;
  title: string;
  type: 'video' | 'document' | 'quiz' | 'assignment';
  url: string;
  description?: string;
};

export type LMSAssessment = {
  id: string;
  title: string;
  type: 'quiz' | 'assignment' | 'project';
  points: number;
  dueDate?: Date;
  instructions: string;
  rubric?: string;
};
