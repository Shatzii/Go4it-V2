// instrumentation.ts - Run once on server startup before any requests
// This ensures database is initialized before static generation

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Ensure database directory exists
    const DATABASE_URL = process.env.DATABASE_URL ?? 'file:./go4it-os.db';
    const isSQLite = DATABASE_URL.startsWith('file:') || DATABASE_URL.startsWith('sqlite:');
    
    if (isSQLite) {
      const fs = require('fs');
      const path = require('path');
      const filePath = DATABASE_URL.replace(/^file:/, '');
      const dbDir = path.dirname(filePath);
      
      if (!fs.existsSync(dbDir)) {
        console.log('[Instrumentation] Creating database directory:', dbDir);
        fs.mkdirSync(dbDir, { recursive: true });
      }
      
      // Create empty database file if it doesn't exist
      if (!fs.existsSync(filePath)) {
        console.log('[Instrumentation] Creating empty database file:', filePath);
        fs.writeFileSync(filePath, '');
      }
    }
  }
}
