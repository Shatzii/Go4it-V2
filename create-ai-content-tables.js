const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'go4it-academy.db');
const db = new Database(dbPath);

// Create AI-generated content tables
const createTables = () => {
  // AI-generated lessons table
  db.exec(`
    CREATE TABLE IF NOT EXISTS ai_generated_lessons (
      id TEXT PRIMARY KEY,
      course_id TEXT NOT NULL,
      lesson_id TEXT,
      subject TEXT NOT NULL,
      grade_level TEXT NOT NULL,
      topic TEXT NOT NULL,
      learning_objectives TEXT,
      content TEXT NOT NULL,
      content_type TEXT DEFAULT 'lesson', -- lesson, quiz, assignment, activity
      difficulty TEXT DEFAULT 'intermediate',
      learning_style TEXT, -- visual, auditory, kinesthetic, reading
      accommodations TEXT, -- JSON array of accommodations
      generated_by TEXT NOT NULL,
      generated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      approved BOOLEAN DEFAULT 0,
      approved_by TEXT,
      approved_at DATETIME,
      usage_count INTEGER DEFAULT 0,
      rating REAL,
      feedback TEXT,
      metadata TEXT, -- JSON metadata
      FOREIGN KEY (course_id) REFERENCES academy_courses(id),
      FOREIGN KEY (lesson_id) REFERENCES academy_lessons(id)
    )
  `);

  // AI content templates table
  db.exec(`
    CREATE TABLE IF NOT EXISTS ai_content_templates (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      subject TEXT NOT NULL,
      grade_level TEXT NOT NULL,
      template_type TEXT NOT NULL, -- lesson, quiz, assignment, activity
      template_data TEXT NOT NULL, -- JSON template structure
      created_by TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      is_public BOOLEAN DEFAULT 0,
      usage_count INTEGER DEFAULT 0,
      rating REAL,
      tags TEXT -- JSON array of tags
    )
  `);

  // AI generation history table
  db.exec(`
    CREATE TABLE IF NOT EXISTS ai_generation_history (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      content_type TEXT NOT NULL,
      prompt TEXT NOT NULL,
      parameters TEXT, -- JSON parameters used
      response TEXT,
      tokens_used INTEGER,
      processing_time INTEGER, -- milliseconds
      success BOOLEAN DEFAULT 1,
      error_message TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      model_used TEXT,
      cost REAL
    )
  `);

  // AI content feedback table
  db.exec(`
    CREATE TABLE IF NOT EXISTS ai_content_feedback (
      id TEXT PRIMARY KEY,
      content_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      rating INTEGER CHECK(rating >= 1 AND rating <= 5),
      feedback TEXT,
      improvements TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (content_id) REFERENCES ai_generated_lessons(id)
    )
  `);

  // AI personalization profiles table
  db.exec(`
    CREATE TABLE IF NOT EXISTS ai_personalization_profiles (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      learning_style TEXT,
      preferred_difficulty TEXT,
      accommodations TEXT, -- JSON array
      subject_preferences TEXT, -- JSON object
      communication_style TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id)
    )
  `);

  console.log('AI content integration tables created successfully!');
};

try {
  createTables();
  console.log('All AI content tables created successfully!');
} catch (error) {
  console.error('Error creating AI content tables:', error);
} finally {
  db.close();
}