/**
 * Migration script to move headless content (content/courses and data/enrollments.json)
 * into the server storage implementation (Drizzle-backed) when available.
 *
 * Usage: set FEATURE_STUDIO_DB=true and run with node:
 *   FEATURE_STUDIO_DB=true node scripts/migrate_headless_to_db.js
 */

const fs = require('fs').promises;
const path = require('path');

async function main() {
  if (process.env.FEATURE_STUDIO_DB !== 'true') {
    console.error('FEATURE_STUDIO_DB must be true to run this migration.');
    process.exit(1);
  }

  let storage;
  try {
    storage = require('../server/storage').storage;
    if (!storage) throw new Error('storage not found');
  } catch (err) {
    console.error('Could not import server storage:', err);
    process.exit(1);
  }

  const coursesDir = path.join(process.cwd(), 'content', 'courses');
  const enrollFile = path.join(process.cwd(), 'data', 'enrollments.json');

  // Migrate courses
  try {
    const files = await fs.readdir(coursesDir);
    for (const f of files) {
      if (!f.endsWith('.md')) continue;
      const slug = f.replace(/\.md$/, '');
      const txt = await fs.readFile(path.join(coursesDir, f), 'utf-8');
      console.log('Migrating course', slug);
      try {
        if (storage.createCourse) {
          await storage.createCourse({ slug, title: slug, description: txt });
        }
      } catch (e) {
        console.error('Failed to create course', slug, e);
      }
    }
  } catch (err) {
    console.warn('No courses to migrate:', err.message);
  }

  // Migrate enrollments
  try {
    const raw = await fs.readFile(enrollFile, 'utf-8');
    const enrollments = JSON.parse(raw || '[]');
    for (const e of enrollments) {
      try {
        console.log('Migrating enrollment', e.id);
        if (storage.enrollStudentInCourse) {
          // storage.enrollStudentInCourse expects studentId and courseId in db world; best-effort
          await storage.enrollStudentInCourse(e.studentEmail || e.studentName, e.courseSlug);
        }
      } catch (err) {
        console.error('Failed to migrate enrollment', e.id, err);
      }
    }
  } catch (err) {
    console.warn('No enrollments to migrate or file missing:', err.message);
  }

  console.log('Migration complete. Verify data in your DB and then remove headless files if desired.');
}

main();
