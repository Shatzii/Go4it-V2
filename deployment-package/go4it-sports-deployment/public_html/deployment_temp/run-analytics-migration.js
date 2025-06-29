const { execSync } = require('child_process');
const path = require('path');

console.log('Running Analytics Tables Migration Script');

try {
  // Run the TypeScript file with tsx
  execSync('npx tsx migrations/analytics_tables_creation.ts', {
    stdio: 'inherit',
  });
  
  console.log('Analytics tables migration completed successfully');
} catch (error) {
  console.error('Error running analytics tables migration:', error);
  process.exit(1);
}