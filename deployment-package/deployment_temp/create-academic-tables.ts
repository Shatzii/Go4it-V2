import { db } from "./server/db";
import { sql } from "drizzle-orm";

async function createAcademicTables() {
  try {
    console.log("Creating academic tables if they don't exist...");
    
    // Create academic_subjects table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS academic_subjects (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        category TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Created academic_subjects table");
    
    // Create academic_courses table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS academic_courses (
        id SERIAL PRIMARY KEY,
        subject_id INTEGER REFERENCES academic_subjects(id),
        name TEXT NOT NULL,
        course_level TEXT,
        grade_level INTEGER,
        credits REAL,
        description TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        is_core BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Created academic_courses table");
    
    // Create course_enrollments table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS course_enrollments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        course_id INTEGER NOT NULL REFERENCES academic_courses(id),
        semester TEXT NOT NULL,
        current_grade TEXT,
        current_percentage REAL,
        status TEXT DEFAULT 'active' NOT NULL,
        teacher_name TEXT,
        notes TEXT,
        start_date DATE,
        end_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Created course_enrollments table");
    
    // Create academic_assignments table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS academic_assignments (
        id SERIAL PRIMARY KEY,
        course_enrollment_id INTEGER NOT NULL REFERENCES course_enrollments(id),
        title TEXT NOT NULL,
        description TEXT,
        due_date DATE,
        status TEXT DEFAULT 'pending' NOT NULL,
        grade TEXT,
        percentage REAL,
        weight REAL DEFAULT 1.0,
        assignment_type TEXT,
        submitted_date DATE,
        feedback TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Created academic_assignments table");
    
    // Create academic_terms table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS academic_terms (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        term_name TEXT NOT NULL,
        start_date DATE,
        end_date DATE,
        overall_gpa REAL,
        total_credits REAL,
        status TEXT DEFAULT 'active' NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Created academic_terms table");
    
    // Create adhd_study_strategies table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS adhd_study_strategies (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        effectiveness INTEGER,
        implementation_difficulty INTEGER,
        recommended_subjects TEXT[],
        tips TEXT[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Created adhd_study_strategies table");
    
    // Create student_study_strategies table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS student_study_strategies (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        strategy_id INTEGER NOT NULL REFERENCES adhd_study_strategies(id),
        implementation_date DATE DEFAULT CURRENT_DATE,
        effectiveness INTEGER,
        notes TEXT,
        usage_frequency TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Created student_study_strategies table");
    
    // Create academic_athletic_analytics table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS academic_athletic_analytics (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        current_gpa REAL,
        gpa_time_series JSONB,
        strongest_subjects TEXT[],
        weakest_subjects TEXT[],
        study_hours_per_week INTEGER,
        athletic_performance_correlation REAL,
        cognitive_influence_factor REAL,
        academic_improvement_rate REAL,
        athletic_improvement_rate REAL,
        balance_score REAL,
        recommended_study_patterns JSONB,
        recommended_subject_focus TEXT,
        timestamp_recorded TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    console.log("Created academic_athletic_analytics table");
    
    // Insert sample academic subjects
    const subjectsResult = await db.execute(sql`SELECT COUNT(*) FROM academic_subjects`);
    if (parseInt(subjectsResult.rows[0].count) === 0) {
      const subjects = [
        { name: 'Mathematics', category: 'Core' },
        { name: 'English', category: 'Core' },
        { name: 'Science', category: 'Core' },
        { name: 'History', category: 'Core' },
        { name: 'Foreign Language', category: 'Core' },
        { name: 'Physical Education', category: 'Elective' },
        { name: 'Art', category: 'Elective' },
        { name: 'Music', category: 'Elective' },
        { name: 'Computer Science', category: 'Elective' }
      ];
      
      for (const subject of subjects) {
        await db.execute(sql`
          INSERT INTO academic_subjects (name, category)
          VALUES (${subject.name}, ${subject.category})
        `);
      }
      console.log("Inserted sample academic subjects");
    }
    
    // Insert sample courses for each subject
    const coursesResult = await db.execute(sql`SELECT COUNT(*) FROM academic_courses`);
    if (parseInt(coursesResult.rows[0].count) === 0) {
      // Get all subjects
      const subjects = await db.execute(sql`SELECT id, name FROM academic_subjects`);
      
      for (const subject of subjects.rows) {
        const courses = [];
        
        if (subject.name === 'Mathematics') {
          courses.push(
            { name: 'Algebra I', level: 'Standard', grade: 9, isCore: true },
            { name: 'Geometry', level: 'Standard', grade: 10, isCore: true },
            { name: 'Algebra II', level: 'Standard', grade: 11, isCore: true },
            { name: 'Pre-Calculus', level: 'Honors', grade: 11, isCore: true },
            { name: 'AP Calculus AB', level: 'AP', grade: 12, isCore: true }
          );
        } else if (subject.name === 'English') {
          courses.push(
            { name: 'English 9', level: 'Standard', grade: 9, isCore: true },
            { name: 'English 10', level: 'Standard', grade: 10, isCore: true },
            { name: 'English 11', level: 'Standard', grade: 11, isCore: true },
            { name: 'AP English Language', level: 'AP', grade: 11, isCore: true },
            { name: 'AP English Literature', level: 'AP', grade: 12, isCore: true }
          );
        } else if (subject.name === 'Science') {
          courses.push(
            { name: 'Biology', level: 'Standard', grade: 9, isCore: true },
            { name: 'Chemistry', level: 'Standard', grade: 10, isCore: true },
            { name: 'Physics', level: 'Standard', grade: 11, isCore: true },
            { name: 'AP Biology', level: 'AP', grade: 11, isCore: true },
            { name: 'AP Chemistry', level: 'AP', grade: 12, isCore: true }
          );
        } else if (subject.name === 'History') {
          courses.push(
            { name: 'World History', level: 'Standard', grade: 9, isCore: true },
            { name: 'US History', level: 'Standard', grade: 10, isCore: true },
            { name: 'Government', level: 'Standard', grade: 11, isCore: true },
            { name: 'AP US History', level: 'AP', grade: 11, isCore: true },
            { name: 'AP Government', level: 'AP', grade: 12, isCore: true }
          );
        } else if (subject.name === 'Foreign Language') {
          courses.push(
            { name: 'Spanish I', level: 'Standard', grade: 9, isCore: true },
            { name: 'Spanish II', level: 'Standard', grade: 10, isCore: true },
            { name: 'Spanish III', level: 'Honors', grade: 11, isCore: true },
            { name: 'AP Spanish', level: 'AP', grade: 12, isCore: true }
          );
        } else if (subject.name === 'Physical Education') {
          courses.push(
            { name: 'PE 9', level: 'Standard', grade: 9, isCore: false },
            { name: 'PE 10', level: 'Standard', grade: 10, isCore: false },
            { name: 'Health', level: 'Standard', grade: 9, isCore: false },
            { name: 'Weight Training', level: 'Standard', grade: 11, isCore: false }
          );
        } else {
          courses.push(
            { name: `${subject.name} I`, level: 'Standard', grade: 9, isCore: false },
            { name: `${subject.name} II`, level: 'Standard', grade: 10, isCore: false },
            { name: `Advanced ${subject.name}`, level: 'Honors', grade: 11, isCore: false }
          );
        }
        
        for (const course of courses) {
          await db.execute(sql`
            INSERT INTO academic_courses (
              subject_id, name, course_level, grade_level, credits, is_core
            ) VALUES (
              ${subject.id}, ${course.name}, ${course.level}, ${course.grade}, ${course.level === 'AP' ? 1.0 : 0.5}, ${course.isCore}
            )
          `);
        }
      }
      console.log("Inserted sample academic courses");
    }
    
    // Insert sample ADHD study strategies
    const strategiesResult = await db.execute(sql`SELECT COUNT(*) FROM adhd_study_strategies`);
    if (parseInt(strategiesResult.rows[0].count) === 0) {
      const strategies = [
        {
          title: 'Pomodoro Technique',
          description: 'Work in focused sprints of 25 minutes followed by 5-minute breaks',
          category: 'focus',
          effectiveness: 9,
          difficulty: 3,
          tips: ['Use a timer app', 'Start with fewer pomodoros and build up', 'Take longer breaks after 4 pomodoros']
        },
        {
          title: 'Body Doubling',
          description: 'Study with someone else in the room to maintain focus and accountability',
          category: 'focus',
          effectiveness: 8,
          difficulty: 2,
          tips: ['Study with a friend', 'Use virtual body doubling services if needed', 'Agree on quiet periods and break times']
        },
        {
          title: 'Color-Coding Notes',
          description: 'Use different colors to organize information and make it more engaging',
          category: 'organization',
          effectiveness: 7,
          difficulty: 3,
          tips: ['Create a consistent color system', 'Use digital tools with color options', 'Don\'t overuse colors - 3-4 is enough']
        },
        {
          title: 'Mind Mapping',
          description: 'Create visual diagrams to connect ideas and concepts',
          category: 'comprehension',
          effectiveness: 8,
          difficulty: 4,
          tips: ['Start with a central concept', 'Use colors and images', 'Add branches for related ideas']
        },
        {
          title: 'Task Chunking',
          description: 'Break large assignments into smaller, manageable chunks',
          category: 'planning',
          effectiveness: 9,
          difficulty: 3,
          tips: ['Break tasks down by time or completion goals', 'Reward yourself after completing chunks', 'Create a visual progress tracker']
        },
        {
          title: 'Background White Noise',
          description: 'Use white noise or ambient sounds to mask distractions',
          category: 'environment',
          effectiveness: 7,
          difficulty: 1,
          tips: ['Try different sounds to find what works', 'Use noise-cancelling headphones', 'Keep volume at a moderate level']
        },
        {
          title: 'Movement Breaks',
          description: 'Incorporate physical movement breaks to reset focus',
          category: 'focus',
          effectiveness: 8,
          difficulty: 2,
          tips: ['Set a timer for breaks', 'Do jumping jacks or stretches', 'Consider a standing desk']
        },
        {
          title: 'Fidget Tools',
          description: 'Use fidget toys to help channel excess energy',
          category: 'focus',
          effectiveness: 7,
          difficulty: 1,
          tips: ['Choose quiet fidget tools', 'Keep them easily accessible', 'Replace if they become too distracting']
        }
      ];
      
      for (const strategy of strategies) {
        await db.execute(sql`
          INSERT INTO adhd_study_strategies (
            title, description, category, effectiveness, implementation_difficulty, tips
          ) VALUES (
            ${strategy.title}, ${strategy.description}, ${strategy.category}, 
            ${strategy.effectiveness}, ${strategy.difficulty}, ${strategy.tips}
          )
        `);
      }
      console.log("Inserted sample ADHD study strategies");
    }
    
    console.log("Academic tables setup completed successfully");
  } catch (error) {
    console.error("Error creating academic tables:", error);
  } finally {
    process.exit(0);
  }
}

// Run the function
createAcademicTables();
