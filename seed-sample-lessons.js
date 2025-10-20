const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'go4it-os.db');
const db = new Database(dbPath);

try {
  // Get the first course ID
  const course = db.prepare('SELECT id FROM academy_courses LIMIT 1').get();
  if (!course) {
    console.log('❌ No courses found. Please run the curriculum seeding first.');
    process.exit(1);
  }

  const courseId = course.id;
  console.log(`📚 Creating sample lessons for course ID: ${courseId}`);

  // Sample lessons for English Language Arts (Grade 7)
  const lessons = [
    {
      title: 'Introduction to Literary Analysis',
      description: 'Learn the fundamentals of analyzing literature and understanding author\'s purpose',
      content: `# Introduction to Literary Analysis

## Learning Objectives
- Understand the basic elements of literature
- Identify author's purpose and tone
- Practice close reading techniques
- Write basic literary analysis paragraphs

## Key Concepts
1. **Plot**: The sequence of events in a story
2. **Character**: The people or beings in the story
3. **Setting**: When and where the story takes place
4. **Theme**: The main message or lesson
5. **Tone**: The author's attitude toward the subject

## Activities
- Read a short story excerpt
- Identify literary elements
- Write a response paragraph
- Discuss findings with classmates

## Sports Connection
Connect these concepts to sports journalism by analyzing game recaps and player interviews.`,
      order_index: 0,
      duration_minutes: 45
    },
    {
      title: 'Writing Effective Essays',
      description: 'Master the art of essay writing with clear structure and strong arguments',
      content: `# Writing Effective Essays

## The Five-Paragraph Essay Structure

### Introduction Paragraph
- Hook the reader
- Provide background information
- State your thesis clearly

### Body Paragraphs (3)
- Topic sentence
- Supporting evidence
- Explanation/analysis
- Transition to next paragraph

### Conclusion Paragraph
- Restate thesis
- Summarize main points
- End with a strong closing

## Thesis Statement Practice
A thesis statement should be:
- Specific
- Arguable
- Clear
- Concise

## Sports Writing Application
Write essays analyzing sports strategies, player performance, or game outcomes.`,
      order_index: 1,
      duration_minutes: 50
    },
    {
      title: 'Grammar and Style',
      description: 'Improve your writing with proper grammar, punctuation, and stylistic techniques',
      content: `# Grammar and Style

## Essential Grammar Rules

### Subject-Verb Agreement
- Singular subjects need singular verbs
- Plural subjects need plural verbs
- Watch out for intervening phrases

### Punctuation
- Commas: Separate items in lists, clauses, and introductory phrases
- Semicolons: Connect related independent clauses
- Colons: Introduce lists or explanations

### Active vs Passive Voice
- Active: The team won the championship
- Passive: The championship was won by the team

## Style Tips
- Use varied sentence structure
- Choose precise vocabulary
- Maintain consistent tone
- Proofread carefully

## Sports Communication
Apply these skills to writing game summaries, player profiles, and sports commentary.`,
      order_index: 2,
      duration_minutes: 40
    }
  ];

  const insertLesson = db.prepare(`
    INSERT INTO academy_lessons (course_id, title, description, content, order_index, duration_minutes)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const insertContent = db.prepare(`
    INSERT INTO academy_lesson_content (lesson_id, content_type, title, url, description, order_index)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  for (const lesson of lessons) {
    const result = insertLesson.run(
      courseId,
      lesson.title,
      lesson.description,
      lesson.content,
      lesson.order_index,
      lesson.duration_minutes
    );

    const lessonId = result.lastInsertRowid;

    // Add some sample content items
    if (lesson.order_index === 0) {
      // Add a video content item
      insertContent.run(
        lessonId,
        'video',
        'Literary Analysis Introduction Video',
        'https://example.com/literary-analysis-intro',
        'Watch this video to understand the basics of literary analysis',
        0
      );

      // Add a document
      insertContent.run(
        lessonId,
        'document',
        'Literary Elements Worksheet',
        'https://example.com/worksheet.pdf',
        'Download and complete this worksheet on literary elements',
        1
      );
    }

    console.log(`✅ Created lesson: ${lesson.title}`);
  }

  // Verify lessons were created
  const lessonCount = db.prepare('SELECT COUNT(*) as count FROM academy_lessons WHERE course_id = ?').get(courseId);
  console.log(`📊 Total lessons created: ${lessonCount.count}`);

  // Show sample lesson
  const sampleLesson = db.prepare(`
    SELECT l.*, COUNT(c.id) as content_count
    FROM academy_lessons l
    LEFT JOIN academy_lesson_content c ON l.id = c.lesson_id
    WHERE l.course_id = ?
    GROUP BY l.id
    LIMIT 1
  `).get(courseId);

  console.log('📝 Sample lesson created:', {
    title: sampleLesson.title,
    duration: sampleLesson.duration_minutes,
    contentItems: sampleLesson.content_count
  });

} catch (error) {
  console.error('❌ Error seeding lessons:', error);
} finally {
  db.close();
}