const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'go4it-os.db');
const db = new Database(dbPath);

// Create certification system tables
const createCertificationTables = () => {
  console.log('Creating certification tables...');

  // Certificate templates
  db.exec(`
    CREATE TABLE IF NOT EXISTS certificate_templates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT CHECK(type IN ('course_completion', 'achievement', 'honor_roll', 'graduation')) DEFAULT 'course_completion',
      title TEXT NOT NULL,
      subtitle TEXT,
      description TEXT,
      background_image TEXT,
      signature_image TEXT,
      signature_title TEXT DEFAULT 'Instructor',
      template_html TEXT,
      is_active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Student certificates
  db.exec(`
    CREATE TABLE IF NOT EXISTS certificates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      template_id INTEGER NOT NULL,
      course_id INTEGER,
      title TEXT NOT NULL,
      description TEXT,
      issued_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      expiry_date DATETIME,
      certificate_number TEXT UNIQUE NOT NULL,
      verification_code TEXT UNIQUE NOT NULL,
      status TEXT CHECK(status IN ('active', 'revoked', 'expired')) DEFAULT 'active',
      issued_by INTEGER NOT NULL,
      metadata TEXT, -- JSON string for additional data
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES academy_students(id) ON DELETE CASCADE,
      FOREIGN KEY (template_id) REFERENCES certificate_templates(id),
      FOREIGN KEY (course_id) REFERENCES academy_courses(id),
      FOREIGN KEY (issued_by) REFERENCES academy_teachers(id)
    )
  `);

  // Transcript records
  db.exec(`
    CREATE TABLE IF NOT EXISTS transcripts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      academic_year TEXT NOT NULL,
      semester TEXT,
      course_id INTEGER NOT NULL,
      course_name TEXT NOT NULL,
      course_code TEXT,
      grade TEXT,
      grade_points REAL,
      credits REAL DEFAULT 1.0,
      status TEXT CHECK(status IN ('completed', 'in_progress', 'withdrawn', 'failed')) DEFAULT 'completed',
      instructor_name TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES academy_students(id) ON DELETE CASCADE,
      FOREIGN KEY (course_id) REFERENCES academy_courses(id)
    )
  `);

  // Academic achievements
  db.exec(`
    CREATE TABLE IF NOT EXISTS academic_achievements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      achievement_type TEXT CHECK(achievement_type IN ('honor_roll', 'perfect_attendance', 'subject_excellence', 'leadership', 'community_service')) NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      academic_year TEXT,
      semester TEXT,
      awarded_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      awarded_by INTEGER NOT NULL,
      metadata TEXT, -- JSON string for additional data
      FOREIGN KEY (student_id) REFERENCES academy_students(id) ON DELETE CASCADE,
      FOREIGN KEY (awarded_by) REFERENCES academy_teachers(id)
    )
  `);

  // GPA calculations
  db.exec(`
    CREATE TABLE IF NOT EXISTS gpa_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      academic_year TEXT NOT NULL,
      semester TEXT,
      cumulative_gpa REAL,
      semester_gpa REAL,
      total_credits REAL,
      total_grade_points REAL,
      calculated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES academy_students(id) ON DELETE CASCADE
    )
  `);

  // Insert default certificate templates
  const insertTemplate = db.prepare(`
    INSERT OR IGNORE INTO certificate_templates
    (name, type, title, subtitle, description, template_html)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  insertTemplate.run(
    'Course Completion',
    'course_completion',
    'Certificate of Completion',
    'has successfully completed',
    'This certificate recognizes the successful completion of the course with satisfactory performance.',
    '<div style="text-align: center; font-family: Arial, sans-serif;">{{certificate_content}}</div>'
  );

  insertTemplate.run(
    'Honor Roll',
    'honor_roll',
    'Honor Roll Certificate',
    'has achieved Honor Roll status',
    'This certificate recognizes outstanding academic achievement.',
    '<div style="text-align: center; font-family: Arial, sans-serif;">{{certificate_content}}</div>'
  );

  console.log('Certification tables created successfully!');
};

try {
  createCertificationTables();
  console.log('All certification tables have been created.');
} catch (error) {
  console.error('Error creating certification tables:', error);
} finally {
  db.close();
}