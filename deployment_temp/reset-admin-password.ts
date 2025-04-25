import { db } from './server/db';
import { users } from './shared/schema';
import { eq } from 'drizzle-orm';
import { hashPassword } from './server/auth';

async function resetAdminPassword() {
  console.log('Resetting admin password...');

  const hashedPassword = await hashPassword('MyTime$$');

  // Check if admin user exists
  const adminUser = await db.select().from(users).where(eq(users.username, 'admin')).execute();

  if (adminUser.length === 0) {
    console.error('Admin user not found. Cannot reset password.');
    process.exit(1); //Exit with an error code.
  } else {
    // Update admin user password
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