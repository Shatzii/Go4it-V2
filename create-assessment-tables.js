const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'go4it-academy.db');
const db = new Database(dbPath);

// Create assessment system tables
const createTables = () => {
  // Quizzes table
  db.exec(`
    CREATE TABLE IF NOT EXISTS academy_quizzes (
      id TEXT PRIMARY KEY,
      course_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      instructions TEXT,
      time_limit INTEGER, -- minutes
      total_points INTEGER DEFAULT 0,
      passing_score INTEGER DEFAULT 60, -- percentage
      max_attempts INTEGER DEFAULT 1,
      is_published BOOLEAN DEFAULT 0,
      shuffle_questions BOOLEAN DEFAULT 0,
      shuffle_answers BOOLEAN DEFAULT 0,
      show_results BOOLEAN DEFAULT 1,
      created_by TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (course_id) REFERENCES academy_courses(id)
    )
  `);

  // Quiz questions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS academy_quiz_questions (
      id TEXT PRIMARY KEY,
      quiz_id TEXT NOT NULL,
      question_type TEXT NOT NULL, -- multiple-choice, true-false, short-answer, essay
      question_text TEXT NOT NULL,
      question_image TEXT, -- URL to image
      points INTEGER DEFAULT 1,
      correct_answer TEXT, -- JSON for multiple choice, text for others
      explanation TEXT, -- explanation of correct answer
      options TEXT, -- JSON array for multiple choice options
      order_index INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (quiz_id) REFERENCES academy_quizzes(id) ON DELETE CASCADE
    )
  `);

  // Quiz attempts table
  db.exec(`
    CREATE TABLE IF NOT EXISTS academy_quiz_attempts (
      id TEXT PRIMARY KEY,
      quiz_id TEXT NOT NULL,
      student_id TEXT NOT NULL,
      attempt_number INTEGER DEFAULT 1,
      started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME,
      time_spent INTEGER, -- seconds
      score REAL,
      max_score REAL,
      percentage REAL,
      passed BOOLEAN,
      status TEXT DEFAULT 'in-progress', -- in-progress, completed, timed-out
      answers TEXT, -- JSON object of question_id -> answer
      graded BOOLEAN DEFAULT 0,
      graded_by TEXT,
      graded_at DATETIME,
      feedback TEXT,
      FOREIGN KEY (quiz_id) REFERENCES academy_quizzes(id),
      FOREIGN KEY (student_id) REFERENCES academy_users(id)
    )
  `);

  // Question responses table (for detailed analysis)
  db.exec(`
    CREATE TABLE IF NOT EXISTS academy_question_responses (
      id TEXT PRIMARY KEY,
      attempt_id TEXT NOT NULL,
      question_id TEXT NOT NULL,
      student_answer TEXT,
      is_correct BOOLEAN,
      points_earned REAL,
      time_spent INTEGER, -- seconds on this question
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (attempt_id) REFERENCES academy_quiz_attempts(id) ON DELETE CASCADE,
      FOREIGN KEY (question_id) REFERENCES academy_quiz_questions(id)
    )
  `);

  // Quiz analytics table
  db.exec(`
    CREATE TABLE IF NOT EXISTS academy_quiz_analytics (
      id TEXT PRIMARY KEY,
      quiz_id TEXT NOT NULL,
      total_attempts INTEGER DEFAULT 0,
      average_score REAL,
      average_time INTEGER, -- seconds
      completion_rate REAL, -- percentage
      pass_rate REAL, -- percentage
      question_stats TEXT, -- JSON with per-question statistics
      last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (quiz_id) REFERENCES academy_quizzes(id) ON DELETE CASCADE
    )
  `);

  console.log('Assessment system tables created successfully!');
};

try {
  createTables();
  console.log('All assessment tables created successfully!');
} catch (error) {
  console.error('Error creating assessment tables:', error);
} finally {
  db.close();
}