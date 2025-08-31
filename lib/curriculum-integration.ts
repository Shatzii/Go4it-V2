// Curriculum Integration System for CK-12 and OER Commons
import { Curriculum, CourseContent } from '@/shared/schema';

export interface CurriculumSource {
  name: string;
  baseUrl: string;
  apiKey?: string;
  contentTypes: string[];
  subjects: string[];
  gradeLevels: string[];
}

export const CURRICULUM_SOURCES: Record<string, CurriculumSource> = {
  ck12: {
    name: 'CK-12 Foundation',
    baseUrl: 'https://www.ck12.org',
    contentTypes: ['flexbook', 'simulation', 'video', 'practice'],
    subjects: ['mathematics', 'science', 'engineering', 'technology'],
    gradeLevels: ['7', '8', '9', '10', '11', '12'],
  },
  oer_commons: {
    name: 'OER Commons',
    baseUrl: 'https://oercommons.org',
    contentTypes: ['textbook', 'lesson', 'activity', 'assessment'],
    subjects: ['mathematics', 'science', 'english', 'history', 'social_studies'],
    gradeLevels: ['7', '8', '9', '10', '11', '12'],
  },
};

// CK-12 Content Structure
export const CK12_CURRICULUM_MAP = {
  mathematics: {
    grade_7: {
      courseId: 'ck12-math-7',
      title: 'CK-12 Middle School Math - Grade 7',
      units: [
        { id: 1, title: 'Integers and Rational Numbers', lessons: 12 },
        { id: 2, title: 'Equations and Inequalities', lessons: 15 },
        { id: 3, title: 'Functions and Coordinate Plane', lessons: 18 },
        { id: 4, title: 'Ratios and Proportions', lessons: 14 },
        { id: 5, title: 'Percent Applications', lessons: 10 },
        { id: 6, title: 'Geometry and Measurement', lessons: 16 },
        { id: 7, title: 'Probability and Statistics', lessons: 12 },
      ],
    },
    grade_8: {
      courseId: 'ck12-math-8',
      title: 'CK-12 Middle School Math - Grade 8',
      units: [
        { id: 1, title: 'Real Numbers and the Number System', lessons: 14 },
        { id: 2, title: 'Expressions and Equations', lessons: 20 },
        { id: 3, title: 'Functions', lessons: 16 },
        { id: 4, title: 'Geometry', lessons: 18 },
        { id: 5, title: 'Statistics and Probability', lessons: 12 },
      ],
    },
    algebra_1: {
      courseId: 'ck12-algebra-1',
      title: 'CK-12 Algebra I',
      units: [
        { id: 1, title: 'Foundations of Algebra', lessons: 15 },
        { id: 2, title: 'Linear Equations and Inequalities', lessons: 22 },
        { id: 3, title: 'Systems of Linear Equations', lessons: 18 },
        { id: 4, title: 'Exponents and Exponential Functions', lessons: 16 },
        { id: 5, title: 'Polynomials and Factoring', lessons: 20 },
        { id: 6, title: 'Quadratic Functions and Equations', lessons: 24 },
        { id: 7, title: 'Radical Functions and Geometry', lessons: 14 },
      ],
    },
    geometry: {
      courseId: 'ck12-geometry',
      title: 'CK-12 Geometry',
      units: [
        { id: 1, title: 'Basics of Geometry', lessons: 16 },
        { id: 2, title: 'Logic and Reasoning', lessons: 12 },
        { id: 3, title: 'Parallel and Perpendicular Lines', lessons: 14 },
        { id: 4, title: 'Triangles and Congruence', lessons: 20 },
        { id: 5, title: 'Relationships with Triangles', lessons: 18 },
        { id: 6, title: 'Similarity', lessons: 16 },
        { id: 7, title: 'Right Triangles and Trigonometry', lessons: 14 },
        { id: 8, title: 'Quadrilaterals', lessons: 12 },
        { id: 9, title: 'Circles', lessons: 18 },
        { id: 10, title: 'Perimeter, Area, and Volume', lessons: 16 },
      ],
    },
    algebra_2: {
      courseId: 'ck12-algebra-2',
      title: 'CK-12 Algebra II',
      units: [
        { id: 1, title: 'Linear Equations and Inequalities', lessons: 18 },
        { id: 2, title: 'Systems of Equations and Inequalities', lessons: 16 },
        { id: 3, title: 'Quadratic Functions', lessons: 20 },
        { id: 4, title: 'Polynomial Functions', lessons: 18 },
        { id: 5, title: 'Radical Functions and Rational Exponents', lessons: 14 },
        { id: 6, title: 'Exponential and Logarithmic Functions', lessons: 16 },
        { id: 7, title: 'Rational Functions', lessons: 12 },
        { id: 8, title: 'Conic Sections', lessons: 14 },
        { id: 9, title: 'Sequences and Series', lessons: 10 },
        { id: 10, title: 'Trigonometric Functions', lessons: 16 },
      ],
    },
    precalculus: {
      courseId: 'ck12-precalculus',
      title: 'CK-12 Precalculus',
      units: [
        { id: 1, title: 'Functions and Graphs', lessons: 16 },
        { id: 2, title: 'Polynomial and Rational Functions', lessons: 18 },
        { id: 3, title: 'Exponential and Logarithmic Functions', lessons: 14 },
        { id: 4, title: 'Trigonometric Functions', lessons: 20 },
        { id: 5, title: 'Analytic Trigonometry', lessons: 16 },
        { id: 6, title: 'Additional Topics in Trigonometry', lessons: 12 },
        { id: 7, title: 'Systems of Equations and Matrices', lessons: 14 },
        { id: 8, title: 'Conic Sections', lessons: 10 },
        { id: 9, title: 'Sequences, Series, and Probability', lessons: 12 },
      ],
    },
  },
  science: {
    life_science: {
      courseId: 'ck12-life-science',
      title: 'CK-12 Life Science',
      units: [
        { id: 1, title: 'Introduction to Life Science', lessons: 8 },
        { id: 2, title: 'Cell Biology', lessons: 16 },
        { id: 3, title: 'Genetics', lessons: 14 },
        { id: 4, title: 'Evolution', lessons: 12 },
        { id: 5, title: 'Classification', lessons: 10 },
        { id: 6, title: 'Plants', lessons: 12 },
        { id: 7, title: 'Animals', lessons: 14 },
        { id: 8, title: 'Human Biology', lessons: 18 },
        { id: 9, title: 'Ecology', lessons: 16 },
      ],
    },
    biology: {
      courseId: 'ck12-biology',
      title: 'CK-12 Biology',
      units: [
        { id: 1, title: 'Introduction to Biology', lessons: 10 },
        { id: 2, title: 'Cell Structure and Function', lessons: 18 },
        { id: 3, title: 'Genetics', lessons: 20 },
        { id: 4, title: 'Evolution', lessons: 16 },
        { id: 5, title: 'Ecology', lessons: 18 },
        { id: 6, title: 'Human Biology', lessons: 22 },
        { id: 7, title: 'Plant Biology', lessons: 14 },
        { id: 8, title: 'Animal Biology', lessons: 16 },
      ],
    },
    chemistry: {
      courseId: 'ck12-chemistry',
      title: 'CK-12 Chemistry',
      units: [
        { id: 1, title: 'Introduction to Chemistry', lessons: 12 },
        { id: 2, title: 'Matter and Change', lessons: 14 },
        { id: 3, title: 'Atomic Structure', lessons: 16 },
        { id: 4, title: 'Electrons in Atoms', lessons: 14 },
        { id: 5, title: 'The Periodic Table', lessons: 12 },
        { id: 6, title: 'Chemical Bonds', lessons: 18 },
        { id: 7, title: 'Chemical Reactions', lessons: 20 },
        { id: 8, title: 'Stoichiometry', lessons: 16 },
        { id: 9, title: 'States of Matter', lessons: 14 },
        { id: 10, title: 'Solutions', lessons: 12 },
        { id: 11, title: 'Acids and Bases', lessons: 14 },
        { id: 12, title: 'Nuclear Chemistry', lessons: 10 },
      ],
    },
    physics: {
      courseId: 'ck12-physics',
      title: 'CK-12 Physics',
      units: [
        { id: 1, title: 'Introduction to Physics', lessons: 10 },
        { id: 2, title: 'Motion', lessons: 18 },
        { id: 3, title: 'Forces', lessons: 16 },
        { id: 4, title: 'Energy', lessons: 14 },
        { id: 5, title: 'Momentum', lessons: 12 },
        { id: 6, title: 'Rotational Motion', lessons: 14 },
        { id: 7, title: 'Vibrations and Waves', lessons: 16 },
        { id: 8, title: 'Sound', lessons: 12 },
        { id: 9, title: 'Light', lessons: 16 },
        { id: 10, title: 'Electricity and Magnetism', lessons: 20 },
        { id: 11, title: 'Modern Physics', lessons: 12 },
      ],
    },
  },
};

// OER Commons Content Structure
export const OER_COMMONS_CURRICULUM_MAP = {
  english: {
    grade_7: {
      courseId: 'oer-english-7',
      title: 'Grade 7 English Language Arts',
      units: [
        { id: 1, title: 'Reading Literature', lessons: 20 },
        { id: 2, title: 'Reading Informational Text', lessons: 18 },
        { id: 3, title: 'Writing', lessons: 22 },
        { id: 4, title: 'Speaking and Listening', lessons: 12 },
        { id: 5, title: 'Language', lessons: 16 },
      ],
    },
    grade_8: {
      courseId: 'oer-english-8',
      title: 'Grade 8 English Language Arts',
      units: [
        { id: 1, title: 'Reading Literature', lessons: 20 },
        { id: 2, title: 'Reading Informational Text', lessons: 18 },
        { id: 3, title: 'Writing', lessons: 24 },
        { id: 4, title: 'Speaking and Listening', lessons: 14 },
        { id: 5, title: 'Language', lessons: 16 },
      ],
    },
    grade_9: {
      courseId: 'oer-english-9',
      title: 'Grade 9 English Language Arts',
      units: [
        { id: 1, title: 'Literature and Fiction', lessons: 24 },
        { id: 2, title: 'Informational Reading', lessons: 20 },
        { id: 3, title: 'Argumentative Writing', lessons: 18 },
        { id: 4, title: 'Narrative Writing', lessons: 16 },
        { id: 5, title: 'Research and Inquiry', lessons: 14 },
        { id: 6, title: 'Media Literacy', lessons: 12 },
      ],
    },
    grade_10: {
      courseId: 'oer-english-10',
      title: 'Grade 10 English Language Arts',
      units: [
        { id: 1, title: 'World Literature', lessons: 26 },
        { id: 2, title: 'Critical Reading', lessons: 22 },
        { id: 3, title: 'Expository Writing', lessons: 20 },
        { id: 4, title: 'Creative Writing', lessons: 16 },
        { id: 5, title: 'Research Methods', lessons: 14 },
        { id: 6, title: 'Digital Literacy', lessons: 12 },
      ],
    },
    grade_11: {
      courseId: 'oer-english-11',
      title: 'Grade 11 English Language Arts',
      units: [
        { id: 1, title: 'American Literature', lessons: 28 },
        { id: 2, title: 'Rhetoric and Argument', lessons: 20 },
        { id: 3, title: 'Research Writing', lessons: 18 },
        { id: 4, title: 'Literary Analysis', lessons: 22 },
        { id: 5, title: 'Contemporary Issues', lessons: 16 },
        { id: 6, title: 'College Preparation', lessons: 14 },
      ],
    },
    grade_12: {
      courseId: 'oer-english-12',
      title: 'Grade 12 English Language Arts',
      units: [
        { id: 1, title: 'British Literature', lessons: 28 },
        { id: 2, title: 'Advanced Composition', lessons: 22 },
        { id: 3, title: 'Critical Theory', lessons: 18 },
        { id: 4, title: 'Independent Reading', lessons: 16 },
        { id: 5, title: 'Senior Portfolio', lessons: 14 },
        { id: 6, title: 'College Writing', lessons: 20 },
      ],
    },
  },
  history: {
    world_history: {
      courseId: 'oer-world-history',
      title: 'World History',
      units: [
        { id: 1, title: 'Ancient Civilizations', lessons: 20 },
        { id: 2, title: 'Classical Period', lessons: 18 },
        { id: 3, title: 'Medieval Period', lessons: 16 },
        { id: 4, title: 'Renaissance and Reformation', lessons: 14 },
        { id: 5, title: 'Age of Exploration', lessons: 12 },
        { id: 6, title: 'Industrial Revolution', lessons: 16 },
        { id: 7, title: 'Modern Era', lessons: 18 },
        { id: 8, title: 'Contemporary World', lessons: 14 },
      ],
    },
    us_history: {
      courseId: 'oer-us-history',
      title: 'United States History',
      units: [
        { id: 1, title: 'Colonial America', lessons: 16 },
        { id: 2, title: 'Revolutionary War', lessons: 14 },
        { id: 3, title: 'Early Republic', lessons: 12 },
        { id: 4, title: 'Westward Expansion', lessons: 14 },
        { id: 5, title: 'Civil War and Reconstruction', lessons: 18 },
        { id: 6, title: 'Industrial Age', lessons: 16 },
        { id: 7, title: 'Progressive Era', lessons: 12 },
        { id: 8, title: 'World Wars', lessons: 20 },
        { id: 9, title: 'Cold War', lessons: 16 },
        { id: 10, title: 'Modern America', lessons: 14 },
      ],
    },
    civics: {
      courseId: 'oer-civics',
      title: 'Civics and Government',
      units: [
        { id: 1, title: 'Foundations of Government', lessons: 14 },
        { id: 2, title: 'Constitution and Bill of Rights', lessons: 16 },
        { id: 3, title: 'Branches of Government', lessons: 18 },
        { id: 4, title: 'Elections and Voting', lessons: 12 },
        { id: 5, title: 'Political Parties', lessons: 10 },
        { id: 6, title: 'Civil Rights and Liberties', lessons: 16 },
        { id: 7, title: 'State and Local Government', lessons: 12 },
        { id: 8, title: 'International Relations', lessons: 10 },
      ],
    },
  },
};

export function getCurriculumByGradeAndSubject(grade: string, subject: string): any {
  if (subject === 'mathematics' || subject === 'science') {
    return CK12_CURRICULUM_MAP[subject as keyof typeof CK12_CURRICULUM_MAP];
  }
  if (subject === 'english' || subject === 'history') {
    return OER_COMMONS_CURRICULUM_MAP[subject as keyof typeof OER_COMMONS_CURRICULUM_MAP];
  }
  return null;
}

export function getAllAvailableCourses(): Array<{
  courseId: string;
  title: string;
  subject: string;
  gradeLevel: string;
}> {
  const courses: Array<{ courseId: string; title: string; subject: string; gradeLevel: string }> =
    [];

  // Add CK-12 Math courses
  Object.entries(CK12_CURRICULUM_MAP.mathematics).forEach(([key, course]) => {
    courses.push({
      courseId: course.courseId,
      title: course.title,
      subject: 'mathematics',
      gradeLevel: key.includes('7')
        ? '7'
        : key.includes('8')
          ? '8'
          : key.includes('algebra_1')
            ? '9'
            : key.includes('geometry')
              ? '10'
              : key.includes('algebra_2')
                ? '11'
                : '12',
    });
  });

  // Add CK-12 Science courses
  Object.entries(CK12_CURRICULUM_MAP.science).forEach(([key, course]) => {
    courses.push({
      courseId: course.courseId,
      title: course.title,
      subject: 'science',
      gradeLevel: key.includes('life')
        ? '7'
        : key.includes('biology')
          ? '9'
          : key.includes('chemistry')
            ? '10'
            : '11',
    });
  });

  // Add OER Commons English courses
  Object.entries(OER_COMMONS_CURRICULUM_MAP.english).forEach(([key, course]) => {
    courses.push({
      courseId: course.courseId,
      title: course.title,
      subject: 'english',
      gradeLevel: key.replace('grade_', ''),
    });
  });

  // Add OER Commons History courses
  Object.entries(OER_COMMONS_CURRICULUM_MAP.history).forEach(([key, course]) => {
    courses.push({
      courseId: course.courseId,
      title: course.title,
      subject: 'history',
      gradeLevel: key.includes('world') ? '9' : key.includes('us') ? '11' : '12',
    });
  });

  return courses;
}
