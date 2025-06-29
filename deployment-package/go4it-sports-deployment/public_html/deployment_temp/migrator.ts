import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db } from './server/db';

async function main() {
  try {
    console.log('Starting migration...');
    
    // This will create any missing tables
    await migrate(db, { migrationsFolder: './migrations' });
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
  process.exit(0);
}

main();