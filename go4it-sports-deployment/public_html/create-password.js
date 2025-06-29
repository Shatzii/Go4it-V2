import crypto from 'crypto';
import { promisify } from 'util';

const { scrypt, randomBytes } = crypto;

const scryptAsync = promisify(scrypt);

async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}

async function main() {
  // Use provided password or default to 'password123'
  const password = process.argv[2] || 'password123';
  const hashedPassword = await hashPassword(password);
  console.log('Password:', password);
  console.log('Hashed password:', hashedPassword);
  console.log('SQL command:');
  console.log(`UPDATE users SET password='${hashedPassword}' WHERE username='testuser';`);
}

main().then(() => {
  console.log('Done!');
}).catch((err) => {
  console.error('Error:', err);
});