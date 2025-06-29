import { hashPassword } from './server/auth';

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