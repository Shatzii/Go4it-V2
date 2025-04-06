// Simple script to test database connection
import { testConnection } from './server/db-wrapper.js';

async function main() {
  console.log('Testing database connection...');
  
  try {
    const result = await testConnection();
    
    if (result.success) {
      console.log('✅ ' + result.message);
    } else {
      console.error('❌ ' + result.message);
      if (result.error) {
        console.error('Error details:', result.error);
      }
    }
  } catch (err) {
    console.error('Unexpected error testing database connection:', err);
  }
}

main().catch(console.error);