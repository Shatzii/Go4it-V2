const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'go4it-os.db');
const db = new Database(dbPath);

// K-12 Curriculum Data with Sports Integration
const curriculumData = [
  // Grade 7
  {
    grade: 7,
    subjects: [
      {
        name: 'English Language Arts',
        code: 'ELA7',
        department: 'Language Arts',
        instructor: 'Ms. Johnson',
        description: 'Reading, writing, and communication skills with sports journalism focus',
        credits: 1.0,
        subjects: JSON.stringify(['Reading', 'Writing', 'Grammar', 'Sports Journalism'])
      },
      {
        name: 'Mathematics',
        code: 'MATH7',
        department: 'Mathematics',
        instructor: 'Mr. Davis',
        description: 'Pre-algebra and statistics with sports analytics applications',
        credits: 1.0,
        subjects: JSON.stringify(['Pre-Algebra', 'Statistics', 'Sports Analytics'])
      },
      {
        name: 'Science',
        code: 'SCI7',
        department: 'Science',
        instructor: 'Dr. Wilson',
        description: 'Life science and biology with human physiology and sports medicine',
        credits: 1.0,
        subjects: JSON.stringify(['Biology', 'Human Physiology', 'Sports Medicine'])
      },
      {
        name: 'Social Studies',
        code: 'SOC7',
        department: 'Social Studies',
        instructor: 'Mrs. Brown',
        description: 'World history and geography with Olympic history and global sports',
        credits: 1.0,
        subjects: JSON.stringify(['World History', 'Geography', 'Olympic History'])
      },
      {
        name: 'Health & Physical Education',
        code: 'PE7',
        department: 'Physical Education',
        instructor: 'Coach Martinez',
        description: 'Fitness, nutrition, and team sports fundamentals',
        credits: 0.5,
        subjects: JSON.stringify(['Fitness', 'Nutrition', 'Team Sports', 'Athletics'])
      }
    ]
  },
  // Grade 8
  {
    grade: 8,
    subjects: [
      {
        name: 'English Language Arts',
        code: 'ELA8',
        department: 'Language Arts',
        instructor: 'Ms. Johnson',
        description: 'Literature analysis and creative writing with sports literature',
        credits: 1.0,
        subjects: JSON.stringify(['Literature', 'Creative Writing', 'Sports Literature'])
      },
      {
        name: 'Mathematics',
        code: 'MATH8',
        department: 'Mathematics',
        instructor: 'Mr. Davis',
        description: 'Algebra and geometry with sports geometry applications',
        credits: 1.0,
        subjects: JSON.stringify(['Algebra', 'Geometry', 'Sports Geometry'])
      },
      {
        name: 'Science',
        code: 'SCI8',
        department: 'Science',
        instructor: 'Dr. Wilson',
        description: 'Physical science and chemistry with sports physics',
        credits: 1.0,
        subjects: JSON.stringify(['Physics', 'Chemistry', 'Sports Physics'])
      },
      {
        name: 'Social Studies',
        code: 'SOC8',
        department: 'Social Studies',
        instructor: 'Mrs. Brown',
        description: 'American history and civics with sports in American culture',
        credits: 1.0,
        subjects: JSON.stringify(['American History', 'Civics', 'Sports Culture'])
      },
      {
        name: 'Health & Physical Education',
        code: 'PE8',
        department: 'Physical Education',
        instructor: 'Coach Martinez',
        description: 'Advanced fitness training and individual sports skills',
        credits: 0.5,
        subjects: JSON.stringify(['Advanced Fitness', 'Individual Sports', 'Training'])
      }
    ]
  },
  // Grade 9
  {
    grade: 9,
    subjects: [
      {
        name: 'English Language Arts',
        code: 'ELA9',
        department: 'Language Arts',
        instructor: 'Ms. Johnson',
        description: 'Advanced composition and rhetoric with sports communication',
        credits: 1.0,
        subjects: JSON.stringify(['Composition', 'Rhetoric', 'Sports Communication'])
      },
      {
        name: 'Mathematics',
        code: 'MATH9',
        department: 'Mathematics',
        instructor: 'Mr. Davis',
        description: 'Advanced algebra and trigonometry with sports statistics',
        credits: 1.0,
        subjects: JSON.stringify(['Advanced Algebra', 'Trigonometry', 'Sports Statistics'])
      },
      {
        name: 'Science',
        code: 'SCI9',
        department: 'Science',
        instructor: 'Dr. Wilson',
        description: 'Earth science and environmental science with outdoor sports',
        credits: 1.0,
        subjects: JSON.stringify(['Earth Science', 'Environmental Science', 'Outdoor Sports'])
      },
      {
        name: 'Social Studies',
        code: 'SOC9',
        department: 'Social Studies',
        instructor: 'Mrs. Brown',
        description: 'World cultures and economics with global sports industry',
        credits: 1.0,
        subjects: JSON.stringify(['World Cultures', 'Economics', 'Sports Industry'])
      },
      {
        name: 'Health & Physical Education',
        code: 'PE9',
        department: 'Physical Education',
        instructor: 'Coach Martinez',
        description: 'Sports psychology and leadership development',
        credits: 0.5,
        subjects: JSON.stringify(['Sports Psychology', 'Leadership', 'Team Building'])
      }
    ]
  },
  // Grade 10
  {
    grade: 10,
    subjects: [
      {
        name: 'English Language Arts',
        code: 'ELA10',
        department: 'Language Arts',
        instructor: 'Ms. Johnson',
        description: 'American literature and poetry with sports-themed analysis',
        credits: 1.0,
        subjects: JSON.stringify(['American Literature', 'Poetry', 'Sports Analysis'])
      },
      {
        name: 'Mathematics',
        code: 'MATH10',
        department: 'Mathematics',
        instructor: 'Mr. Davis',
        description: 'Geometry and statistics with advanced sports analytics',
        credits: 1.0,
        subjects: JSON.stringify(['Geometry', 'Statistics', 'Advanced Analytics'])
      },
      {
        name: 'Science',
        code: 'SCI10',
        department: 'Science',
        instructor: 'Dr. Wilson',
        description: 'Biology and anatomy with sports physiology',
        credits: 1.0,
        subjects: JSON.stringify(['Biology', 'Anatomy', 'Sports Physiology'])
      },
      {
        name: 'Social Studies',
        code: 'SOC10',
        department: 'Social Studies',
        instructor: 'Mrs. Brown',
        description: 'Modern world history with international sports diplomacy',
        credits: 1.0,
        subjects: JSON.stringify(['Modern History', 'International Relations', 'Sports Diplomacy'])
      },
      {
        name: 'Health & Physical Education',
        code: 'PE10',
        department: 'Physical Education',
        instructor: 'Coach Martinez',
        description: 'Advanced training methods and sports specialization',
        credits: 0.5,
        subjects: JSON.stringify(['Advanced Training', 'Sports Specialization', 'Performance'])
      }
    ]
  },
  // Grade 11
  {
    grade: 11,
    subjects: [
      {
        name: 'English Language Arts',
        code: 'ELA11',
        department: 'Language Arts',
        instructor: 'Ms. Johnson',
        description: 'World literature and critical thinking with sports ethics',
        credits: 1.0,
        subjects: JSON.stringify(['World Literature', 'Critical Thinking', 'Sports Ethics'])
      },
      {
        name: 'Mathematics',
        code: 'MATH11',
        department: 'Mathematics',
        instructor: 'Mr. Davis',
        description: 'Pre-calculus and calculus with sports modeling',
        credits: 1.0,
        subjects: JSON.stringify(['Pre-Calculus', 'Calculus', 'Sports Modeling'])
      },
      {
        name: 'Science',
        code: 'SCI11',
        department: 'Science',
        instructor: 'Dr. Wilson',
        description: 'Chemistry and physics with sports technology',
        credits: 1.0,
        subjects: JSON.stringify(['Chemistry', 'Physics', 'Sports Technology'])
      },
      {
        name: 'Social Studies',
        code: 'SOC11',
        department: 'Social Studies',
        instructor: 'Mrs. Brown',
        description: 'Government and politics with sports policy and law',
        credits: 1.0,
        subjects: JSON.stringify(['Government', 'Politics', 'Sports Law'])
      },
      {
        name: 'Health & Physical Education',
        code: 'PE11',
        department: 'Physical Education',
        instructor: 'Coach Martinez',
        description: 'Sports medicine and injury prevention',
        credits: 0.5,
        subjects: JSON.stringify(['Sports Medicine', 'Injury Prevention', 'Rehabilitation'])
      }
    ]
  },
  // Grade 12
  {
    grade: 12,
    subjects: [
      {
        name: 'English Language Arts',
        code: 'ELA12',
        department: 'Language Arts',
        instructor: 'Ms. Johnson',
        description: 'Senior composition and research with sports journalism capstone',
        credits: 1.0,
        subjects: JSON.stringify(['Senior Composition', 'Research', 'Sports Journalism'])
      },
      {
        name: 'Mathematics',
        code: 'MATH12',
        department: 'Mathematics',
        instructor: 'Mr. Davis',
        description: 'AP Calculus and statistics with professional sports analytics',
        credits: 1.0,
        subjects: JSON.stringify(['AP Calculus', 'Advanced Statistics', 'Professional Analytics'])
      },
      {
        name: 'Science',
        code: 'SCI12',
        department: 'Science',
        instructor: 'Dr. Wilson',
        description: 'Advanced biology and environmental science with sports nutrition',
        credits: 1.0,
        subjects: JSON.stringify(['Advanced Biology', 'Environmental Science', 'Sports Nutrition'])
      },
      {
        name: 'Social Studies',
        code: 'SOC12',
        department: 'Social Studies',
        instructor: 'Mrs. Brown',
        description: 'Senior seminar on contemporary issues with sports sociology',
        credits: 1.0,
        subjects: JSON.stringify(['Contemporary Issues', 'Sociology', 'Sports Sociology'])
      },
      {
        name: 'Health & Physical Education',
        code: 'PE12',
        department: 'Physical Education',
        instructor: 'Coach Martinez',
        description: 'Leadership and coaching certification preparation',
        credits: 0.5,
        subjects: JSON.stringify(['Leadership', 'Coaching', 'Certification Prep'])
      }
    ]
  }
];

try {
  console.log('🏫 Creating K-12 Full Year Curriculum for Grades 7-12...');

  const insertCourse = db.prepare(`
    INSERT INTO academy_courses (
      title, description, code, credits, grade_level, department,
      instructor, difficulty, subjects, is_active
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  let totalCourses = 0;

  for (const gradeData of curriculumData) {
    console.log(`📚 Creating Grade ${gradeData.grade} Courses...`);

    for (const subject of gradeData.subjects) {
      insertCourse.run(
        subject.name,
        subject.description,
        subject.code,
        subject.credits,
        gradeData.grade.toString(),
        subject.department,
        subject.instructor,
        'Intermediate',
        subject.subjects,
        1
      );
      totalCourses++;
    }
  }

  console.log(`✅ Successfully created ${totalCourses} academy courses!`);

  // Verify the data
  const count = db.prepare('SELECT COUNT(*) as count FROM academy_courses').get();
  console.log(`📊 Total courses in database: ${count.count}`);

  // Show sample courses
  const sampleCourses = db.prepare('SELECT title, code, grade_level FROM academy_courses LIMIT 5').all();
  console.log('📝 Sample courses:');
  sampleCourses.forEach(course => {
    console.log(`  - ${course.title} (${course.code}) - Grade ${course.grade_level}`);
  });

} catch (error) {
  console.error('❌ Error seeding curriculum:', error);
} finally {
  db.close();
}