const bcrypt = require('bcryptjs');
const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');

const sql = postgres(process.env.DATABASE_URL);
const db = drizzle(sql);

async function createAdmin() {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash('password123', 12);

    // Insert or update admin user
    const result = await sql`
      INSERT INTO users (username, email, password, role, first_name, last_name, is_active)
      VALUES ('admin', 'admin@goforit.com', ${hashedPassword}, 'admin', 'System', 'Administrator', true)
      ON CONFLICT (email) 
      DO UPDATE SET 
        password = ${hashedPassword},
        role = 'admin',
        is_active = true
      RETURNING id, username, email, role;
    `;

    console.log('Admin user created/updated successfully:', result);
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await sql.end();
  }
}

createAdmin();
