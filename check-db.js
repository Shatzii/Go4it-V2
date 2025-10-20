const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'go4it-os.db');
const db = new Database(dbPath);

try {
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log('Tables in database:');
  tables.forEach(table => {
    console.log(`- ${table.name}`);
  });

  // Check if academy_courses exists
  const academyCoursesExists = tables.some(table => table.name === 'academy_courses');
  if (academyCoursesExists) {
    const count = db.prepare("SELECT COUNT(*) as count FROM academy_courses").get();
    console.log(`\nAcademy courses count: ${count.count}`);
  } else {
    console.log('\nAcademy courses table does not exist');
  }
} catch (error) {
  console.error('Error:', error);
} finally {
  db.close();
}