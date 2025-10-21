const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'go4it-os.db');
const db = new Database(dbPath);

try {
  // Create academy_courses table
  db.exec(`
    CREATE TABLE IF NOT EXISTS academy_courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      code TEXT,
      credits REAL DEFAULT 1.0,
      grade_level TEXT,
      department TEXT,
      instructor TEXT,
      difficulty TEXT DEFAULT 'Beginner',
      subjects TEXT, -- JSON string for SQLite
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create academy_enrollments table
  db.exec(`
    CREATE TABLE IF NOT EXISTS academy_enrollments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      course_id INTEGER NOT NULL,
      enrollment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      status TEXT DEFAULT 'active',
      progress REAL DEFAULT 0.0,
      grade TEXT,
      completed_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (course_id) REFERENCES academy_courses (id)
    )
  `);

  // Create academy_assignments table
  db.exec(`
    CREATE TABLE IF NOT EXISTS academy_assignments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      course_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      type TEXT DEFAULT 'homework',
      due_date DATETIME,
      points INTEGER DEFAULT 100,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (course_id) REFERENCES academy_courses (id)
    )
  `);

  // Create academy_submissions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS academy_submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      assignment_id INTEGER NOT NULL,
      user_id TEXT NOT NULL,
      content TEXT,
      submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      grade REAL,
      feedback TEXT,
      status TEXT DEFAULT 'submitted',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (assignment_id) REFERENCES academy_assignments (id)
    )
  `);

  console.log('✅ Academy tables created successfully');

  // Check tables
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'academy_%'").all();
  console.log('Academy tables:', tables.map(t => t.name));

} catch (error) {
  console.error('❌ Error creating tables:', error);
} finally {
  db.close();
}