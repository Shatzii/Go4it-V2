const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'go4it-os.db');
const db = new Database(dbPath);

// Create collaboration tables
const createCollaborationTables = () => {
  console.log('Creating collaboration tables...');

  // Discussion posts table
  db.exec(`
    CREATE TABLE IF NOT EXISTS collaboration_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      course_id INTEGER NOT NULL,
      student_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      type TEXT CHECK(type IN ('discussion', 'question', 'announcement')) DEFAULT 'discussion',
      is_pinned BOOLEAN DEFAULT 0,
      is_anonymous BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (course_id) REFERENCES academy_courses(id) ON DELETE CASCADE,
      FOREIGN KEY (student_id) REFERENCES academy_students(id) ON DELETE CASCADE
    )
  `);

  // Comments on posts
  db.exec(`
    CREATE TABLE IF NOT EXISTS collaboration_comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id INTEGER NOT NULL,
      student_id INTEGER NOT NULL,
      parent_comment_id INTEGER,
      content TEXT NOT NULL,
      is_anonymous BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (post_id) REFERENCES collaboration_posts(id) ON DELETE CASCADE,
      FOREIGN KEY (student_id) REFERENCES academy_students(id) ON DELETE CASCADE,
      FOREIGN KEY (parent_comment_id) REFERENCES collaboration_comments(id) ON DELETE CASCADE
    )
  `);

  // Post likes/reactions
  db.exec(`
    CREATE TABLE IF NOT EXISTS collaboration_reactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id INTEGER,
      comment_id INTEGER,
      student_id INTEGER NOT NULL,
      reaction_type TEXT CHECK(reaction_type IN ('like', 'helpful', 'thanks', 'disagree')) DEFAULT 'like',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (post_id) REFERENCES collaboration_posts(id) ON DELETE CASCADE,
      FOREIGN KEY (comment_id) REFERENCES collaboration_comments(id) ON DELETE CASCADE,
      FOREIGN KEY (student_id) REFERENCES academy_students(id) ON DELETE CASCADE,
      CHECK ((post_id IS NOT NULL AND comment_id IS NULL) OR (post_id IS NULL AND comment_id IS NOT NULL))
    )
  `);

  // Study groups
  db.exec(`
    CREATE TABLE IF NOT EXISTS study_groups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      course_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      max_members INTEGER DEFAULT 10,
      is_private BOOLEAN DEFAULT 0,
      created_by INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (course_id) REFERENCES academy_courses(id) ON DELETE CASCADE,
      FOREIGN KEY (created_by) REFERENCES academy_students(id) ON DELETE CASCADE
    )
  `);

  // Study group members
  db.exec(`
    CREATE TABLE IF NOT EXISTS study_group_members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      group_id INTEGER NOT NULL,
      student_id INTEGER NOT NULL,
      role TEXT CHECK(role IN ('member', 'moderator', 'admin')) DEFAULT 'member',
      joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (group_id) REFERENCES study_groups(id) ON DELETE CASCADE,
      FOREIGN KEY (student_id) REFERENCES academy_students(id) ON DELETE CASCADE,
      UNIQUE(group_id, student_id)
    )
  `);

  // Group messages
  db.exec(`
    CREATE TABLE IF NOT EXISTS group_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      group_id INTEGER NOT NULL,
      student_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      message_type TEXT CHECK(message_type IN ('text', 'file', 'image')) DEFAULT 'text',
      file_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (group_id) REFERENCES study_groups(id) ON DELETE CASCADE,
      FOREIGN KEY (student_id) REFERENCES academy_students(id) ON DELETE CASCADE
    )
  `);

  // Peer reviews
  db.exec(`
    CREATE TABLE IF NOT EXISTS peer_reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      assignment_id INTEGER NOT NULL,
      reviewer_id INTEGER NOT NULL,
      reviewee_id INTEGER NOT NULL,
      submission_id INTEGER NOT NULL,
      rating INTEGER CHECK(rating >= 1 AND rating <= 5),
      feedback TEXT,
      criteria_ratings TEXT, -- JSON string of criteria ratings
      is_completed BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (assignment_id) REFERENCES academy_assignments(id) ON DELETE CASCADE,
      FOREIGN KEY (reviewer_id) REFERENCES academy_students(id) ON DELETE CASCADE,
      FOREIGN KEY (reviewee_id) REFERENCES academy_students(id) ON DELETE CASCADE,
      FOREIGN KEY (submission_id) REFERENCES academy_submissions(id) ON DELETE CASCADE,
      UNIQUE(assignment_id, reviewer_id, reviewee_id)
    )
  `);

  // Resource sharing
  db.exec(`
    CREATE TABLE IF NOT EXISTS shared_resources (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      course_id INTEGER NOT NULL,
      student_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      resource_type TEXT CHECK(resource_type IN ('document', 'link', 'video', 'image', 'other')) DEFAULT 'document',
      file_url TEXT,
      external_url TEXT,
      tags TEXT, -- JSON array of tags
      is_public BOOLEAN DEFAULT 1,
      download_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (course_id) REFERENCES academy_courses(id) ON DELETE CASCADE,
      FOREIGN KEY (student_id) REFERENCES academy_students(id) ON DELETE CASCADE
    )
  `);

  console.log('Collaboration tables created successfully!');
};

try {
  createCollaborationTables();
  console.log('All collaboration tables have been created.');
} catch (error) {
  console.error('Error creating collaboration tables:', error);
} finally {
  db.close();
}