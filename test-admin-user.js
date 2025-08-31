import { db } from './lib/db.js';
import { users } from './shared/schema.js';
import bcrypt from 'bcryptjs';

async function createTestAdmin() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 12);

    const [newUser] = await db
      .insert(users)
      .values({
        username: 'admin_test',
        email: 'admin@test.com',
        password: hashedPassword,
        role: 'admin',
        firstName: 'Admin',
        lastName: 'User',
      })
      .returning();

    console.log('Created admin user:', newUser.email);
    return newUser;
  } catch (error) {
    console.log('Admin user might already exist, or error:', error.message);
  }
}

createTestAdmin().then(() => process.exit(0));
