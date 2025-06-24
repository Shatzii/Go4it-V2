const { spawn } = require('child_process');

const port = process.env.PORT || 5000;
const host = '0.0.0.0';

console.log(`Starting Next.js server on ${host}:${port}`);

const nextProcess = spawn('npx', ['next', 'dev', '-p', port, '-H', host], {
  stdio: 'inherit',
  env: { ...process.env, PORT: port }
});

nextProcess.on('close', (code) => {
  console.log(`Next.js process exited with code ${code}`);
});

nextProcess.on('error', (error) => {
  console.error('Failed to start Next.js:', error);
});