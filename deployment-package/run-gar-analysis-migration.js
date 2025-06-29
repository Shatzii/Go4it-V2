/**
 * Runner script for GAR Analysis migration
 * 
 * This script executes the migration to create the GAR analysis tables in the database.
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('Starting GAR Analysis migration runner...');

try {
  // Run the TypeScript migration file using ts-node
  const migrationPath = path.join(__dirname, 'migrations', 'gar_analysis_tables_creation.ts');
  execSync(`npx ts-node ${migrationPath}`, { stdio: 'inherit' });
  
  console.log('GAR Analysis migration completed successfully.');
} catch (error) {
  console.error('Error running GAR Analysis migration:', error);
  process.exit(1);
}