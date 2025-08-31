// Populate K-12 Full Year Core Subject Classes for Grades 7-12
const { Pool } = require('@neondatabase/serverless');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Core subjects for each grade level
const CORE_SUBJECTS = {
  'English Language Arts': {
    description: 'Reading, writing, speaking, listening, and language skills',
    sportsFocus: 'Sports journalism, athletic narratives, communication',
  },
  Mathematics: {
    description: 'Mathematical concepts, problem-solving, and analytical thinking',
    sportsFocus: 'Sports statistics, performance analytics, game strategy',
  },
  Science: {
    description: 'Scientific inquiry, experimentation, and understanding',
    sportsFocus: 'Sports science, exercise physiology, biomechanics',
  },
  'Social Studies': {
    description: 'History, geography, civics, and cultural understanding',
    sportsFocus: 'Sports history, ethics, global athletics',
  },
  'Health & Physical Education': {
    description: 'Physical fitness, health education, and wellness',
    sportsFocus: 'Athletic training, injury prevention, nutrition',
  },
  'Career & Technical Education': {
    description: 'Career preparation and technical skills',
    sportsFocus: 'Sports management, athletic training, sports media',
  },
};

// Grade-specific curriculum data
const GRADE_CURRICULUM = {
  7: {
    'English Language Arts': {
      topics: [
        'Literary Analysis',
        'Narrative Writing',
        'Research Skills',
        'Vocabulary Development',
        'Grammar & Mechanics',
      ],
      standards: [
        'CCSS.ELA-LITERACY.RL.7.1',
        'CCSS.ELA-LITERACY.W.7.1',
        'CCSS.ELA-LITERACY.SL.7.1',
      ],
      sportsTopics: [
        'Sports Biography Reading',
        'Game Report Writing',
        'Athletic Interview Skills',
      ],
    },
    Mathematics: {
      topics: [
        'Ratios & Proportions',
        'Integers',
        'Expressions & Equations',
        'Geometry',
        'Statistics & Probability',
      ],
      standards: ['CCSS.MATH.7.RP', 'CCSS.MATH.7.NS', 'CCSS.MATH.7.EE', 'CCSS.MATH.7.G'],
      sportsTopics: ['Team Statistics', 'Player Performance Ratios', 'Field Measurements'],
    },
    Science: {
      topics: ['Life Science', 'Earth Science', 'Physical Science', 'Scientific Method'],
      standards: ['MS-LS1-1', 'MS-ESS1-1', 'MS-PS1-1'],
      sportsTopics: ['Human Body Systems', 'Weather & Sports', 'Physics of Motion'],
    },
    'Social Studies': {
      topics: ['World Geography', 'Ancient Civilizations', 'Cultural Studies', 'Civic Ideals'],
      standards: ['NCSS.D2.Geo.1.6-8', 'NCSS.D2.His.1.6-8'],
      sportsTopics: ['Olympic History', 'Sports Around the World', 'Athletic Traditions'],
    },
  },
  8: {
    'English Language Arts': {
      topics: [
        'Literary Devices',
        'Persuasive Writing',
        'Media Literacy',
        'Speaking & Presentation',
      ],
      standards: [
        'CCSS.ELA-LITERACY.RL.8.1',
        'CCSS.ELA-LITERACY.W.8.1',
        'CCSS.ELA-LITERACY.SL.8.4',
      ],
      sportsTopics: ['Sports Editorials', 'Athletic Documentaries', 'Team Presentation Skills'],
    },
    Mathematics: {
      topics: ['Linear Functions', 'Systems of Equations', 'Transformations', 'Data Analysis'],
      standards: ['CCSS.MATH.8.F', 'CCSS.MATH.8.EE', 'CCSS.MATH.8.G'],
      sportsTopics: ['Performance Trends', 'Training Progressions', 'Game Analytics'],
    },
    Science: {
      topics: ['Chemistry Basics', 'Forces & Motion', 'Genetics', 'Earth Systems'],
      standards: ['MS-PS1-2', 'MS-PS2-1', 'MS-LS3-1', 'MS-ESS2-1'],
      sportsTopics: ['Sports Nutrition Chemistry', 'Biomechanics', 'Athletic Genetics'],
    },
    'Social Studies': {
      topics: ['American History', 'Constitution', 'Economics', 'Current Events'],
      standards: ['NCSS.D2.His.2.6-8', 'NCSS.D2.Civ.1.6-8'],
      sportsTopics: ['Sports in American History', 'Title IX', 'Sports Economics'],
    },
  },
  9: {
    'English Language Arts': {
      topics: [
        'World Literature',
        'Argumentative Writing',
        'Critical Thinking',
        'Digital Citizenship',
      ],
      standards: ['CCSS.ELA-LITERACY.RL.9-10.1', 'CCSS.ELA-LITERACY.W.9-10.1'],
      sportsTopics: ['Sports Literature', 'Athletic Ethics Essays', 'Social Media Responsibility'],
    },
    Mathematics: {
      topics: ['Algebra I', 'Linear & Quadratic Functions', 'Exponential Functions', 'Statistics'],
      standards: ['HSA-SSE.A.1', 'HSA-CED.A.1', 'HSF-IF.A.1'],
      sportsTopics: ['Performance Modeling', 'Training Optimization', 'Recruitment Statistics'],
    },
    Science: {
      topics: ['Biology', 'Cell Structure', 'Genetics', 'Evolution', 'Ecology'],
      standards: ['HS-LS1-1', 'HS-LS3-1', 'HS-LS4-1'],
      sportsTopics: ['Exercise Physiology', 'Sports Genetics', 'Athletic Performance Biology'],
    },
    'Social Studies': {
      topics: ['World History', 'Global Cultures', 'Human Rights', 'Government Systems'],
      standards: ['NCSS.D2.His.1.9-12', 'NCSS.D2.Civ.2.9-12'],
      sportsTopics: ['Olympics & Politics', 'Global Sports Culture', 'Athletic Human Rights'],
    },
  },
  10: {
    'English Language Arts': {
      topics: ['American Literature', 'Research Methods', 'Rhetoric', 'Creative Writing'],
      standards: ['CCSS.ELA-LITERACY.RL.9-10.2', 'CCSS.ELA-LITERACY.W.9-10.7'],
      sportsTopics: [
        'American Sports Stories',
        'Athletic Research Projects',
        'Sports Commentary Writing',
      ],
    },
    Mathematics: {
      topics: ['Geometry', 'Proofs', 'Trigonometry', 'Coordinate Geometry'],
      standards: ['HSG-CO.A.1', 'HSG-SRT.A.1', 'HSG-GPE.A.1'],
      sportsTopics: ['Field Geometry', 'Trajectory Analysis', 'Sports Architecture'],
    },
    Science: {
      topics: ['Chemistry', 'Atomic Structure', 'Chemical Reactions', 'Organic Chemistry'],
      standards: ['HS-PS1-1', 'HS-PS1-2', 'HS-PS1-3'],
      sportsTopics: [
        'Sports Biochemistry',
        'Performance Enhancement Chemistry',
        'Drug Testing Science',
      ],
    },
    'Social Studies': {
      topics: ['U.S. History', 'Civil Rights', 'Economic Systems', 'Foreign Policy'],
      standards: ['NCSS.D2.His.3.9-12', 'NCSS.D2.Eco.1.9-12'],
      sportsTopics: [
        'Sports & Civil Rights',
        'Athletic Industry Economics',
        'International Sports Diplomacy',
      ],
    },
  },
  11: {
    'English Language Arts': {
      topics: ['Contemporary Literature', 'Technical Writing', 'Public Speaking', 'Media Analysis'],
      standards: ['CCSS.ELA-LITERACY.RL.11-12.1', 'CCSS.ELA-LITERACY.W.11-12.1'],
      sportsTopics: [
        'Modern Sports Literature',
        'Athletic Training Manuals',
        'Sports Broadcasting',
      ],
    },
    Mathematics: {
      topics: ['Algebra II', 'Advanced Functions', 'Logarithms', 'Data Analysis'],
      standards: ['HSA-APR.A.1', 'HSF-BF.A.1', 'HSS-ID.A.1'],
      sportsTopics: [
        'Advanced Sports Analytics',
        'Performance Prediction Models',
        'Recruitment Algorithms',
      ],
    },
    Science: {
      topics: ['Physics', 'Mechanics', 'Waves', 'Electricity & Magnetism'],
      standards: ['HS-PS2-1', 'HS-PS4-1', 'HS-PS3-1'],
      sportsTopics: ['Sports Physics', 'Biomechanics', 'Equipment Technology'],
    },
    'Social Studies': {
      topics: [
        'Modern World History',
        'Globalization',
        'International Relations',
        'Environmental Issues',
      ],
      standards: ['NCSS.D2.His.14.9-12', 'NCSS.D2.Geo.2.9-12'],
      sportsTopics: [
        'Global Sports Industry',
        'Environmental Impact of Sports',
        'International Athletic Regulations',
      ],
    },
  },
  12: {
    'English Language Arts': {
      topics: [
        'Advanced Composition',
        'Literary Criticism',
        'College Prep Writing',
        'Career Communication',
      ],
      standards: ['CCSS.ELA-LITERACY.RL.11-12.2', 'CCSS.ELA-LITERACY.W.11-12.2'],
      sportsTopics: [
        'Sports Journalism',
        'Athletic Scholarship Essays',
        'Professional Communication',
      ],
    },
    Mathematics: {
      topics: ['Pre-Calculus', 'Calculus Prep', 'Statistics', 'Mathematical Modeling'],
      standards: ['HSF-TF.A.1', 'HSS-ID.B.6', 'HSA-CED.A.3'],
      sportsTopics: [
        'Advanced Performance Analytics',
        'Calculus in Sports Science',
        'Statistical Modeling',
      ],
    },
    Science: {
      topics: [
        'Advanced Biology',
        'Environmental Science',
        'Anatomy & Physiology',
        'Research Methods',
      ],
      standards: ['HS-LS1-2', 'HS-ESS3-1', 'HS-LS1-3'],
      sportsTopics: ['Exercise Science', 'Sports Medicine', 'Athletic Performance Research'],
    },
    'Social Studies': {
      topics: ['Government', 'Economics', 'Psychology', 'Sociology'],
      standards: ['NCSS.D2.Civ.10.9-12', 'NCSS.D2.Eco.2.9-12'],
      sportsTopics: ['Sports Law & Policy', 'Athletic Economics', 'Sports Psychology'],
    },
  },
};

async function createK12Curriculum() {
  console.log('🏫 Creating K-12 Full Year Curriculum for Grades 7-12...\n');

  try {
    // Create courses for each grade and subject
    for (const grade of [7, 8, 9, 10, 11, 12]) {
      console.log(`📚 Creating Grade ${grade} Courses...`);

      for (const [subject, subjectInfo] of Object.entries(CORE_SUBJECTS)) {
        const gradeData = GRADE_CURRICULUM[grade][subject];
        if (!gradeData) continue;

        const courseCode = `G${grade}${subject.replace(/[^A-Z]/g, '').substring(0, 3)}`;
        const courseTitle = `Grade ${grade} ${subject}`;

        // Create full-year course
        const courseQuery = `
          INSERT INTO academy_courses (
            title, description, code, credits, instructor, difficulty, 
            subjects, grade_level, duration, academic_year, semester,
            learning_objectives, assessments, resources, standards_alignment,
            sports_integration, created_at, updated_at, is_active
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19
          ) ON CONFLICT (code) DO UPDATE SET
            updated_at = CURRENT_TIMESTAMP,
            learning_objectives = EXCLUDED.learning_objectives,
            sports_integration = EXCLUDED.sports_integration
        `;

        const courseValues = [
          courseTitle,
          `${subjectInfo.description} for Grade ${grade} students with integrated sports applications`,
          courseCode,
          1.0, // Full year credit
          grade <= 8 ? 'Middle School Faculty' : 'High School Faculty',
          grade <= 8 ? 'Intermediate' : grade <= 10 ? 'Advanced' : 'College Prep',
          JSON.stringify(gradeData.topics),
          grade,
          'Full Year',
          '2024-2025',
          'Full Year',
          JSON.stringify(gradeData.topics),
          JSON.stringify([
            'Quarterly Exams',
            'Projects',
            'Presentations',
            'Sports Integration Assignments',
          ]),
          JSON.stringify([
            'Digital Textbook',
            'Online Resources',
            'Sports Case Studies',
            'Athletic Performance Data',
          ]),
          JSON.stringify(gradeData.standards),
          JSON.stringify({
            focus: subjectInfo.sportsFocus,
            topics: gradeData.sportsTopics,
            integration: 'Embedded throughout curriculum',
          }),
          new Date(),
          new Date(),
          true,
        ];

        await pool.query(courseQuery, courseValues);

        // Create semester courses for more detailed tracking
        for (const semester of ['Fall', 'Spring']) {
          const semesterCode = `${courseCode}-${semester.substring(0, 1)}`;
          const semesterTitle = `${courseTitle} - ${semester} Semester`;

          const semesterQuery = `
            INSERT INTO academy_courses (
              title, description, code, credits, instructor, difficulty,
              subjects, grade_level, duration, academic_year, semester,
              learning_objectives, assessments, resources, standards_alignment,
              sports_integration, created_at, updated_at, is_active
            ) VALUES (
              $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19
            ) ON CONFLICT (code) DO UPDATE SET
              updated_at = CURRENT_TIMESTAMP
          `;

          const semesterValues = [
            semesterTitle,
            `${semester} semester of ${subject} for Grade ${grade} with sports integration`,
            semesterCode,
            0.5,
            courseValues[5], // instructor
            courseValues[6], // difficulty
            JSON.stringify(gradeData.topics.slice(0, Math.ceil(gradeData.topics.length / 2))),
            grade,
            semester,
            '2024-2025',
            semester,
            JSON.stringify(gradeData.topics.slice(0, Math.ceil(gradeData.topics.length / 2))),
            JSON.stringify([
              `${semester} Midterm`,
              'Monthly Projects',
              'Sports Case Study',
              'Final Assessment',
            ]),
            courseValues[14], // resources
            courseValues[15], // standards
            courseValues[16], // sports integration
            new Date(),
            new Date(),
            true,
          ];

          await pool.query(semesterQuery, semesterValues);
        }

        console.log(`  ✅ Created ${courseTitle} (Full Year + Semesters)`);
      }
    }

    // Create specialized sports courses for grades 9-12
    console.log('\n🏃 Creating Specialized Sports Courses...');

    const sportsCourses = [
      {
        title: 'Sports Science & Performance',
        code: 'SPSC101',
        grade: '9-12',
        description:
          'Advanced study of human performance, exercise physiology, and athletic optimization',
      },
      {
        title: 'Sports Medicine & Athletic Training',
        code: 'SMED101',
        grade: '10-12',
        description: 'Injury prevention, rehabilitation, and sports medicine principles',
      },
      {
        title: 'Sports Management & Business',
        code: 'SMGT101',
        grade: '11-12',
        description: 'Business principles applied to sports organizations and athletic programs',
      },
      {
        title: 'Sports Psychology & Mental Performance',
        code: 'SPSY101',
        grade: '9-12',
        description:
          'Mental training, performance psychology, and cognitive enhancement for athletes',
      },
      {
        title: 'Sports Journalism & Media',
        code: 'SJOU101',
        grade: '10-12',
        description: 'Sports writing, broadcasting, and digital media in athletics',
      },
      {
        title: 'NCAA Compliance & Eligibility',
        code: 'NCAA101',
        grade: '9-12',
        description:
          'Understanding NCAA rules, eligibility requirements, and recruitment processes',
      },
    ];

    for (const course of sportsCourses) {
      const sportsQuery = `
        INSERT INTO academy_courses (
          title, description, code, credits, instructor, difficulty,
          subjects, grade_level, duration, academic_year, semester,
          learning_objectives, sports_integration, created_at, updated_at, is_active
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
        ) ON CONFLICT (code) DO UPDATE SET
          updated_at = CURRENT_TIMESTAMP
      `;

      await pool.query(sportsQuery, [
        course.title,
        course.description,
        course.code,
        0.5,
        'Sports Faculty',
        'Advanced',
        JSON.stringify(['Sports Specialization']),
        course.grade,
        'Semester',
        '2024-2025',
        'Fall/Spring',
        JSON.stringify([
          'Advanced athletic concepts',
          'Real-world application',
          'Career preparation',
          'Performance optimization',
        ]),
        JSON.stringify({
          focus: 'Sports-specific curriculum',
          integration: 'Primary focus',
          applications: 'Direct athletic application',
        }),
        new Date(),
        new Date(),
        true,
      ]);

      console.log(`  ✅ Created ${course.title}`);
    }

    // Get final count
    const countResult = await pool.query(`
      SELECT COUNT(*) as total_courses,
             COUNT(CASE WHEN grade_level BETWEEN 7 AND 12 THEN 1 END) as k12_courses,
             COUNT(CASE WHEN subjects::text LIKE '%Sports%' THEN 1 END) as sports_courses
      FROM academy_courses 
      WHERE is_active = true
    `);

    const stats = countResult.rows[0];

    console.log('\n📊 CURRICULUM CREATION COMPLETE');
    console.log('=================================');
    console.log(`Total Courses Created: ${stats.total_courses}`);
    console.log(`K-12 Core Courses (Grades 7-12): ${stats.k12_courses}`);
    console.log(`Sports Integration Courses: ${stats.sports_courses}`);
    console.log(`Coverage: 6 grades × 4 core subjects × 3 formats = 72+ courses`);
    console.log(`Plus specialized sports courses for high school`);

    console.log('\n✅ K-12 curriculum successfully populated!');
    console.log('Students can now enroll in grade-appropriate, sports-integrated courses.');
  } catch (error) {
    console.error('❌ Error creating K-12 curriculum:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run if called directly
if (require.main === module) {
  createK12Curriculum().catch(console.error);
}

module.exports = { createK12Curriculum };
