const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'go4it-os.db');
const db = new Database(dbPath);

// Create parent portal tables
const createParentPortalTables = () => {
  console.log('Creating parent portal tables...');

  // Parent accounts table
  db.exec(`
    CREATE TABLE IF NOT EXISTS parent_accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      phone TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login DATETIME,
      is_active BOOLEAN DEFAULT 1
    )
  `);

  // Parent-student relationships
  db.exec(`
    CREATE TABLE IF NOT EXISTS parent_student_links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      parent_id INTEGER NOT NULL,
      student_id INTEGER NOT NULL,
      relationship TEXT CHECK(relationship IN ('parent', 'guardian', 'grandparent', 'other')) DEFAULT 'parent',
      is_primary BOOLEAN DEFAULT 0,
      can_view_grades BOOLEAN DEFAULT 1,
      can_view_assignments BOOLEAN DEFAULT 1,
      can_view_attendance BOOLEAN DEFAULT 1,
      can_communicate BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (parent_id) REFERENCES parent_accounts(id) ON DELETE CASCADE,
      FOREIGN KEY (student_id) REFERENCES academy_students(id) ON DELETE CASCADE,
      UNIQUE(parent_id, student_id)
    )
  `);

  // Parent notifications
  db.exec(`
    CREATE TABLE IF NOT EXISTS parent_notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      parent_id INTEGER NOT NULL,
      student_id INTEGER,
      type TEXT CHECK(type IN ('grade', 'assignment', 'attendance', 'announcement', 'message')) NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      is_read BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (parent_id) REFERENCES parent_accounts(id) ON DELETE CASCADE,
      FOREIGN KEY (student_id) REFERENCES academy_students(id) ON DELETE CASCADE
    )
  `);

  // Parent messages to teachers
  db.exec(`
    CREATE TABLE IF NOT EXISTS parent_teacher_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      parent_id INTEGER NOT NULL,
      teacher_id INTEGER NOT NULL,
      student_id INTEGER,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      is_from_parent BOOLEAN DEFAULT 1,
      is_read BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (parent_id) REFERENCES parent_accounts(id) ON DELETE CASCADE,
      FOREIGN KEY (teacher_id) REFERENCES academy_teachers(id) ON DELETE CASCADE,
      FOREIGN KEY (student_id) REFERENCES academy_students(id) ON DELETE CASCADE
    )
  `);

  // Parent progress reports
  db.exec(`
    CREATE TABLE IF NOT EXISTS parent_progress_reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      parent_id INTEGER NOT NULL,
      student_id INTEGER NOT NULL,
      report_period TEXT NOT NULL, -- e.g., '2024-Q1', '2024-09'
      overall_grade TEXT,
      attendance_percentage REAL,
      strengths TEXT,
      areas_for_improvement TEXT,
      teacher_comments TEXT,
      generated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (parent_id) REFERENCES parent_accounts(id) ON DELETE CASCADE,
      FOREIGN KEY (student_id) REFERENCES academy_students(id) ON DELETE CASCADE
    )
  `);

  console.log('Parent portal tables created successfully!');
};

try {
  createParentPortalTables();
  console.log('All parent portal tables have been created.');
} catch (error) {
  console.error('Error creating parent portal tables:', error);
} finally {
  db.close();
}