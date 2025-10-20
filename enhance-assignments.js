const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'go4it-os.db');
const db = new Database(dbPath);

try {
  // Add file attachment support to assignments
  try {
    db.exec(`
      ALTER TABLE academy_assignments
      ADD COLUMN allow_file_uploads INTEGER DEFAULT 1;
    `);
  } catch (e) {
    // Column might already exist
  }

  try {
    db.exec(`
      ALTER TABLE academy_assignments
      ADD COLUMN max_file_size_mb REAL DEFAULT 10.0;
    `);
  } catch (e) {
    // Column might already exist
  }

  try {
    db.exec(`
      ALTER TABLE academy_assignments
      ADD COLUMN allowed_file_types TEXT DEFAULT 'pdf,doc,docx,txt,jpg,jpeg,png';
    `);
  } catch (e) {
    // Column might already exist
  }

  // Add file attachment support to submissions
  try {
    db.exec(`
      ALTER TABLE academy_submissions
      ADD COLUMN attachments TEXT; -- JSON array of file paths/URLs
    `);
  } catch (e) {
    // Column might already exist
  }

  try {
    db.exec(`
      ALTER TABLE academy_submissions
      ADD COLUMN submitted_files TEXT; -- JSON array of uploaded files
    `);
  } catch (e) {
    // Column might already exist
  }

  console.log('✅ Enhanced assignment tables with file upload support');

  // Create assignment_attachments table for better file management
  db.exec(`
    CREATE TABLE IF NOT EXISTS assignment_attachments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      assignment_id INTEGER NOT NULL,
      file_name TEXT NOT NULL,
      file_path TEXT NOT NULL,
      file_size INTEGER,
      file_type TEXT,
      uploaded_by TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (assignment_id) REFERENCES academy_assignments (id) ON DELETE CASCADE
    )
  `);

  // Create submission_attachments table
  db.exec(`
    CREATE TABLE IF NOT EXISTS submission_attachments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      submission_id INTEGER NOT NULL,
      file_name TEXT NOT NULL,
      file_path TEXT NOT NULL,
      file_size INTEGER,
      file_type TEXT,
      uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (submission_id) REFERENCES academy_submissions (id) ON DELETE CASCADE
    )
  `);

  console.log('✅ Created attachment tables for assignments and submissions');

} catch (error) {
  console.error('❌ Error enhancing assignment tables:', error);
} finally {
  db.close();
}