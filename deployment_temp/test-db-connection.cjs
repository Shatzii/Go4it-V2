// Simple script to test database connection directly with PostgreSQL
const { Pool } = require('pg');

// Get DB connection parameters from environment variables
const {
  PGHOST,
  PGDATABASE,
  PGUSER,
  PGPASSWORD,
  PGPORT,
  DATABASE_URL
} = process.env;

async function testConnection() {
  // Log the environment variables (masking sensitive information)
  console.log('Database environment variables:');
  console.log(`- PGHOST: ${PGHOST ? 'Available (hidden)' : 'Not set'}`);
  console.log(`- PGDATABASE: ${PGDATABASE ? 'Available (hidden)' : 'Not set'}`);
  console.log(`- PGUSER: ${PGUSER ? 'Available (hidden)' : 'Not set'}`);
  console.log(`- PGPASSWORD: ${PGPASSWORD ? 'Available (hidden)' : 'Not set'}`);
  console.log(`- PGPORT: ${PGPORT ? PGPORT : 'Not set'}`);
  console.log(`- DATABASE_URL: ${DATABASE_URL ? 'Available (hidden)' : 'Not set'}`);

  // Create a connection pool with SSL enabled
  const pool = new Pool({
    ssl: {
      rejectUnauthorized: false, // needed for some PostgreSQL providers
      require: true
    }
  });
  
  try {
    console.log('Attempting to connect to PostgreSQL database...');
    
    // Test the connection
    const client = await pool.connect();
    
    try {
      // Execute a simple query to verify connection is working
      const result = await client.query('SELECT current_timestamp as time, current_database() as db');
      
      console.log(`✅ Successfully connected to PostgreSQL database: ${result.rows[0].db}`);
      console.log(`✅ Current database time: ${result.rows[0].time}`);
      
      // Try to get a list of tables
      try {
        console.log('Retrieving database tables...');
        const tablesResult = await client.query(`
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'public'
          ORDER BY table_name;
        `);
        
        if (tablesResult.rows.length > 0) {
          console.log(`✅ Found ${tablesResult.rows.length} tables in the database:`);
          tablesResult.rows.forEach((row, index) => {
            console.log(`   ${index + 1}. ${row.table_name}`);
          });
        } else {
          console.log('⚠️ No tables found in the database. Schema may not be initialized.');
        }
      } catch (tableErr) {
        console.error('❌ Error listing tables:', tableErr.message);
      }
      
      return { success: true, message: 'Database connection successful' };
    } finally {
      // Release the client back to the pool
      client.release();
    }
  } catch (err) {
    console.error('❌ Database connection error:', err.message);
    return { 
      success: false, 
      message: 'Failed to connect to the database', 
      error: err.message 
    };
  } finally {
    // End the pool
    await pool.end();
  }
}

// Run the test
testConnection().catch(err => {
  console.error('Unexpected error:', err);
});