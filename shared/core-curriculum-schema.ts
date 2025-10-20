// Core Curriculum Structure for Student Scheduling
export interface CoreClass {
  id: string;
  subject: 'Math' | 'Science' | 'English' | 'Social Studies';
  title: string;
  gradeLevel: string;
  credits: number;
  duration: string; // "50 minutes"
  prerequisite?: string;
  description: string;
  textbook?: string;
  standards: string[];
}

export interface ClassSchedule {
  classId: string;
  period: number;
  startTime: string;
  endTime: string;
  days: string[]; // ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  room: string;
  instructor: string;
  maxStudents: number;
  currentEnrollment: number;
}

export interface StudentSchedule {
  studentId: string;
  grade: string;
  coreClasses: {
    math: string;
    science: string;
    english: string;
    socialStudies: string;
  };
  electives: string[];
  totalCredits: number;
  isNCAACompliant: boolean;
}

// Core Classes by Grade Level
export const CORE_CLASSES: CoreClass[] = [
  // 7th Grade Core
  {
    id: 'math-7-pre-algebra',
    subject: 'Math',
    title: 'Pre-Algebra',
    gradeLevel: '7th',
    credits: 1.0,
    duration: '50 minutes',
    description: 'Introduction to algebraic concepts and problem-solving',
    textbook: 'Glencoe Pre-Algebra',
    standards: ['7.EE.1', '7.EE.2', '7.EE.3', '7.EE.4'],
  },
  {
    id: 'science-7-life-science',
    subject: 'Science',
    title: 'Life Science',
    gradeLevel: '7th',
    credits: 1.0,
    duration: '50 minutes',
    description: 'Study of living organisms and biological processes',
    textbook: 'Holt Life Science',
    standards: ['7.LS.1', '7.LS.2', '7.LS.3'],
  },
  {
    id: 'english-7-language-arts',
    subject: 'English',
    title: 'English Language Arts 7',
    gradeLevel: '7th',
    credits: 1.0,
    duration: '50 minutes',
    description: 'Reading comprehension, writing, and communication skills',
    textbook: 'Pearson Literature Grade 7',
    standards: ['7.RL.1', '7.RL.2', '7.W.1', '7.SL.1'],
  },
  {
    id: 'social-7-world-geography',
    subject: 'Social Studies',
    title: 'World Geography',
    gradeLevel: '7th',
    credits: 1.0,
    duration: '50 minutes',
    description: 'Study of world regions, cultures, and geographic concepts',
    textbook: 'National Geographic World Geography',
    standards: ['7.G.1', '7.G.2', '7.G.3', '7.H.1'],
  },

  // 8th Grade Core
  {
    id: 'math-8-algebra1',
    subject: 'Math',
    title: 'Algebra I',
    gradeLevel: '8th',
    credits: 1.0,
    duration: '50 minutes',
    prerequisite: 'math-7-pre-algebra',
    description: 'Linear equations, systems, and quadratic functions',
    textbook: 'Pearson Algebra 1',
    standards: ['A.CED.1', 'A.CED.2', 'A.REI.3', 'F.IF.4'],
  },
  {
    id: 'science-8-physical-science',
    subject: 'Science',
    title: 'Physical Science',
    gradeLevel: '8th',
    credits: 1.0,
    duration: '50 minutes',
    description: 'Introduction to chemistry and physics concepts',
    textbook: 'Glencoe Physical Science',
    standards: ['8.PS.1', '8.PS.2', '8.PS.3', '8.PS.4'],
  },
  {
    id: 'english-8-language-arts',
    subject: 'English',
    title: 'English Language Arts 8',
    gradeLevel: '8th',
    credits: 1.0,
    duration: '50 minutes',
    description: 'Advanced reading, writing, and literary analysis',
    textbook: 'Holt Literature Grade 8',
    standards: ['8.RL.1', '8.RL.2', '8.W.1', '8.SL.1'],
  },
  {
    id: 'social-8-american-history',
    subject: 'Social Studies',
    title: 'American History',
    gradeLevel: '8th',
    credits: 1.0,
    duration: '50 minutes',
    description: 'United States history from colonial period to Civil War',
    textbook: 'McGraw-Hill United States History',
    standards: ['8.H.1', '8.H.2', '8.H.3', '8.C.1'],
  },

  // 9th Grade Core (Freshman)
  {
    id: 'math-9-geometry',
    subject: 'Math',
    title: 'Geometry',
    gradeLevel: '9th',
    credits: 1.0,
    duration: '50 minutes',
    prerequisite: 'math-8-algebra1',
    description: 'Geometric proofs, area, volume, and coordinate geometry',
    textbook: 'Holt McDougal Geometry',
    standards: ['G.CO.1', 'G.SRT.5', 'G.GMD.3', 'G.MG.1'],
  },
  {
    id: 'science-9-biology',
    subject: 'Science',
    title: 'Biology',
    gradeLevel: '9th',
    credits: 1.0,
    duration: '50 minutes',
    description: 'Cell biology, genetics, evolution, and ecology',
    textbook: 'Pearson Miller & Levine Biology',
    standards: ['B.LS.1', 'B.LS.2', 'B.LS.3', 'B.LS.4'],
  },
  {
    id: 'english-9-literature',
    subject: 'English',
    title: 'English 9',
    gradeLevel: '9th',
    credits: 1.0,
    duration: '50 minutes',
    description: 'World literature, essay writing, and critical thinking',
    textbook: 'Prentice Hall Literature Grade 9',
    standards: ['9.RL.1', '9.RL.2', '9.W.1', '9.SL.4'],
  },
  {
    id: 'social-9-world-history',
    subject: 'Social Studies',
    title: 'World History',
    gradeLevel: '9th',
    credits: 1.0,
    duration: '50 minutes',
    description: 'Ancient civilizations through modern global history',
    textbook: 'Holt World History',
    standards: ['9.H.1', '9.H.2', '9.G.1', '9.C.1'],
  },

  // 10th Grade Core (Sophomore)
  {
    id: 'math-10-algebra2',
    subject: 'Math',
    title: 'Algebra II',
    gradeLevel: '10th',
    credits: 1.0,
    duration: '50 minutes',
    prerequisite: 'math-9-geometry',
    description: 'Advanced algebra, trigonometry, and polynomial functions',
    textbook: 'Glencoe Algebra 2',
    standards: ['A.APR.1', 'F.TF.1', 'F.TF.5', 'S.ID.6'],
  },
  {
    id: 'science-10-chemistry',
    subject: 'Science',
    title: 'Chemistry',
    gradeLevel: '10th',
    credits: 1.0,
    duration: '50 minutes',
    description: 'Atomic structure, chemical reactions, and stoichiometry',
    textbook: 'Pearson Chemistry',
    standards: ['C.PS.1', 'C.PS.2', 'C.PS.3', 'C.ETS.1'],
  },
  {
    id: 'english-10-literature',
    subject: 'English',
    title: 'English 10',
    gradeLevel: '10th',
    credits: 1.0,
    duration: '50 minutes',
    description: 'American literature, research writing, and rhetoric',
    textbook: 'Prentice Hall Literature Grade 10',
    standards: ['10.RL.1', '10.RL.3', '10.W.1', '10.SL.3'],
  },
  {
    id: 'social-10-world-studies',
    subject: 'Social Studies',
    title: 'Modern World Studies',
    gradeLevel: '10th',
    credits: 1.0,
    duration: '50 minutes',
    description: 'Contemporary global issues and comparative government',
    textbook: 'Pearson World Studies',
    standards: ['10.H.1', '10.C.1', '10.E.1', '10.G.1'],
  },

  // 11th Grade Core (Junior)
  {
    id: 'math-11-precalculus',
    subject: 'Math',
    title: 'Pre-Calculus',
    gradeLevel: '11th',
    credits: 1.0,
    duration: '50 minutes',
    prerequisite: 'math-10-algebra2',
    description: 'Advanced functions, trigonometry, and limits',
    textbook: 'Larson Pre-Calculus',
    standards: ['PC.A.1', 'PC.F.1', 'PC.T.1', 'PC.G.1'],
  },
  {
    id: 'science-11-physics',
    subject: 'Science',
    title: 'Physics',
    gradeLevel: '11th',
    credits: 1.0,
    duration: '50 minutes',
    description: 'Mechanics, waves, electricity, and modern physics',
    textbook: 'Holt Physics',
    standards: ['P.PS.1', 'P.PS.2', 'P.PS.3', 'P.ETS.1'],
  },
  {
    id: 'english-11-american-lit',
    subject: 'English',
    title: 'American Literature',
    gradeLevel: '11th',
    credits: 1.0,
    duration: '50 minutes',
    description: 'Survey of American literature and advanced composition',
    textbook: 'Pearson American Literature',
    standards: ['11.RL.1', '11.RL.4', '11.W.1', '11.SL.4'],
  },
  {
    id: 'social-11-us-history',
    subject: 'Social Studies',
    title: 'U.S. History',
    gradeLevel: '11th',
    credits: 1.0,
    duration: '50 minutes',
    description: 'American history from Reconstruction to present',
    textbook: 'Holt American Nation',
    standards: ['11.H.1', '11.H.2', '11.C.1', '11.E.1'],
  },

  // 12th Grade Core (Senior)
  {
    id: 'math-12-calculus',
    subject: 'Math',
    title: 'AP Calculus AB',
    gradeLevel: '12th',
    credits: 1.0,
    duration: '50 minutes',
    prerequisite: 'math-11-precalculus',
    description: 'Differential and integral calculus',
    textbook: 'Larson Calculus',
    standards: ['AP.CALC.1', 'AP.CALC.2', 'AP.CALC.3'],
  },
  {
    id: 'science-12-ap-bio',
    subject: 'Science',
    title: 'AP Biology',
    gradeLevel: '12th',
    credits: 1.0,
    duration: '50 minutes',
    description: 'College-level biology with laboratory investigations',
    textbook: 'Campbell Biology in Focus AP Edition',
    standards: ['AP.BIO.1', 'AP.BIO.2', 'AP.BIO.3', 'AP.BIO.4'],
  },
  {
    id: 'english-12-british-lit',
    subject: 'English',
    title: 'British Literature',
    gradeLevel: '12th',
    credits: 1.0,
    duration: '50 minutes',
    description: 'Survey of British literature and college preparation',
    textbook: 'Pearson British Literature',
    standards: ['12.RL.1', '12.RL.6', '12.W.1', '12.SL.4'],
  },
  {
    id: 'social-12-government',
    subject: 'Social Studies',
    title: 'Government & Economics',
    gradeLevel: '12th',
    credits: 1.0,
    duration: '50 minutes',
    description: 'American government systems and economic principles',
    textbook: "Pearson Magruder's American Government",
    standards: ['12.C.1', '12.C.2', '12.E.1', '12.E.2'],
  },
];

// Elective Classes Available
export const ELECTIVE_CLASSES = [
  {
    id: 'art-visual-arts',
    title: 'Visual Arts',
    department: 'Fine Arts',
    credits: 0.5,
    description: 'Drawing, painting, and design fundamentals',
  },
  {
    id: 'music-band',
    title: 'Concert Band',
    department: 'Fine Arts',
    credits: 1.0,
    description: 'Instrumental music performance and music theory',
  },
  {
    id: 'music-choir',
    title: 'Choir',
    department: 'Fine Arts',
    credits: 1.0,
    description: 'Vocal music performance and sight-reading',
  },
  {
    id: 'cs-programming',
    title: 'Computer Programming',
    department: 'Technology',
    credits: 1.0,
    description: 'Introduction to coding in Python and JavaScript',
  },
  {
    id: 'pe-health',
    title: 'Physical Education & Health',
    department: 'Health & PE',
    credits: 1.0,
    description: 'Physical fitness, health education, and wellness',
  },
  {
    id: 'lang-spanish1',
    title: 'Spanish I',
    department: 'World Languages',
    credits: 1.0,
    description: 'Beginning Spanish language and culture',
  },
  {
    id: 'lang-spanish2',
    title: 'Spanish II',
    department: 'World Languages',
    credits: 1.0,
    description: 'Intermediate Spanish language and culture',
    prerequisite: 'lang-spanish1',
  },
  {
    id: 'bus-entrepreneurship',
    title: 'Entrepreneurship',
    department: 'Business',
    credits: 0.5,
    description: 'Business planning, marketing, and financial literacy',
  },
  {
    id: 'eng-journalism',
    title: 'Journalism',
    department: 'English',
    credits: 0.5,
    description: 'News writing, media literacy, and digital publishing',
  },
  {
    id: 'sci-environmental',
    title: 'Environmental Science',
    department: 'Science',
    credits: 0.5,
    description: 'Ecology, sustainability, and environmental issues',
  },
];
