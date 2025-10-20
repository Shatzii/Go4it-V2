const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'go4it-os.db');
const db = new Database(dbPath);

try {
  // Create academy_lessons table
  db.exec(`
    CREATE TABLE IF NOT EXISTS academy_lessons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      course_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      content TEXT, -- Rich text/markdown content
      order_index INTEGER DEFAULT 0,
      duration_minutes INTEGER DEFAULT 45,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (course_id) REFERENCES academy_courses (id)
    )
  `);

  // Create academy_lesson_content table for multimedia
  db.exec(`
    CREATE TABLE IF NOT EXISTS academy_lesson_content (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lesson_id INTEGER NOT NULL,
      content_type TEXT NOT NULL, -- 'video', 'image', 'document', 'link', 'text'
      title TEXT,
      url TEXT,
      file_path TEXT,
      description TEXT,
      order_index INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (lesson_id) REFERENCES academy_lessons (id)
    )
  `);

  // Create academy_lesson_progress table
  db.exec(`
    CREATE TABLE IF NOT EXISTS academy_lesson_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lesson_id INTEGER NOT NULL,
      user_id TEXT NOT NULL,
      progress_percentage REAL DEFAULT 0.0,
      completed INTEGER DEFAULT 0,
      time_spent_minutes INTEGER DEFAULT 0,
      last_accessed DATETIME DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (lesson_id) REFERENCES academy_lessons (id),
      UNIQUE(lesson_id, user_id)
    )
  `);

  console.log('✅ Lesson content system tables created successfully');

  // Check tables
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'academy_%'").all();
  console.log('Academy tables:', tables.map(t => t.name));

} catch (error) {
  console.error('❌ Error creating lesson tables:', error);
} finally {
  db.close();
}