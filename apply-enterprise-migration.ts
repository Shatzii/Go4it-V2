import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';

async function applyEnterpriseMigration() {
  try {
    console.log('🚀 Applying enterprise social media migration...');

    // Initialize database connection
    const sql = neon(process.env.DATABASE_URL!);

    // Read the migration file
    const migrationSQL = readFileSync('./migrations/enterprise/0000_mean_kingpin.sql', 'utf-8');

    // Split by statement-breakpoint and execute each statement
    const statements = migrationSQL.split('--> statement-breakpoint');

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      if (statement) {
        console.log(`Executing statement ${i + 1}/${statements.length}...`);
        await sql.unsafe(statement);
      }
    }

    console.log('✅ Enterprise migration applied successfully!');
    console.log('📊 Created tables:');
    console.log('  - audit_events (enterprise audit logging)');
    console.log('  - metrics (performance monitoring)');
    console.log('  - cache_entries (caching infrastructure)');
    console.log('  - rate_limits (rate limiting)');
    console.log('  - social_media_metrics (social media analytics)');
    console.log('  - generated_content (AI-generated content)');
    console.log('  - social_media_posts (posted content tracking)');
    console.log('  - athlete_profiles (athlete discovery data)');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

applyEnterpriseMigration();
