import { db } from './server/db';
import { users } from './shared/schema';
import { eq } from 'drizzle-orm';
import { hashPassword } from './server/auth';

async function resetAdminPassword() {
  console.log('Resetting admin password...');
  
  // Check if admin user exists
  const adminUser = await db.select().from(users).where(eq(users.username, 'admin')).execute();
  
  if (adminUser.length === 0) {
    console.log('Admin user not found. Creating admin user...');
    
    const hashedPassword = await hashPassword('adminpass123');
    
    await db.insert(users).values({
      username: 'admin',
      password: hashedPassword,
      email: 'admin@goforit.com',
      name: 'Admin User',
      role: 'admin',
      createdAt: new Date(),
    }).execute();
    
    console.log('Admin user created successfully!');
  } else {
    console.log('Admin user found. Updating password...');
    
    const hashedPassword = await hashPassword('adminpass123');
    
    await db.update(users)
      .set({ password: hashedPassword })
      .where(eq(users.username, 'admin'))
      .execute();
    
    console.log('Admin password updated successfully!');
  }
}

resetAdminPassword()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error resetting admin password:', error);
    process.exit(1);
  });