const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'go4it-os.db');
const db = new Database(dbPath);

try {
  // Create progress tracking tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS student_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      course_id INTEGER NOT NULL,
      lesson_id INTEGER,
      assignment_id INTEGER,
      progress_type TEXT NOT NULL, -- 'lesson', 'assignment', 'course'
      progress_percentage REAL DEFAULT 0.0,
      status TEXT DEFAULT 'not_started', -- 'not_started', 'in_progress', 'completed'
      time_spent_minutes INTEGER DEFAULT 0,
      completed_at DATETIME,
      grade REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (course_id) REFERENCES academy_courses (id),
      FOREIGN KEY (lesson_id) REFERENCES academy_lessons (id),
      FOREIGN KEY (assignment_id) REFERENCES academy_assignments (id),
      UNIQUE(user_id, course_id, lesson_id, assignment_id, progress_type)
    )
  `);

  // Create grade tracking table
  db.exec(`
    CREATE TABLE IF NOT EXISTS grade_reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      course_id INTEGER NOT NULL,
      assignment_id INTEGER,
      grade REAL NOT NULL,
      max_points REAL NOT NULL,
      percentage REAL NOT NULL,
      letter_grade TEXT,
      feedback TEXT,
      graded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (course_id) REFERENCES academy_courses (id),
      FOREIGN KEY (assignment_id) REFERENCES academy_assignments (id)
    )
  `);

  // Create course analytics table
  db.exec(`
    CREATE TABLE IF NOT EXISTS course_analytics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      course_id INTEGER NOT NULL,
      total_enrollments INTEGER DEFAULT 0,
      active_students INTEGER DEFAULT 0,
      completion_rate REAL DEFAULT 0.0,
      average_grade REAL DEFAULT 0.0,
      total_assignments INTEGER DEFAULT 0,
      graded_assignments INTEGER DEFAULT 0,
      last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (course_id) REFERENCES academy_courses (id),
      UNIQUE(course_id)
    )
  `);

  console.log('✅ Progress tracking tables created successfully');

} catch (error) {
  console.error('❌ Error creating progress tracking tables:', error);
} finally {
  db.close();
}