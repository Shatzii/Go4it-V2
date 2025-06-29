import { db } from './server/db';
import { users } from './shared/schema';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcryptjs';

async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function resetCoachPassword() {
  try {
    const username = 'coachwilliams';
    const newPassword = 'coach123'; // Simple password for testing
    
    const hashedPassword = await hashPassword(newPassword);
    
    // Update the user's password
    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.username, username));
    
    console.log(`Password reset successful for user: ${username}`);
    console.log(`New credentials: username: ${username}, password: ${newPassword}`);
  } catch (error) {
    console.error('Error resetting password:', error);
  } finally {
    process.exit(0);
  }
}

resetCoachPassword();