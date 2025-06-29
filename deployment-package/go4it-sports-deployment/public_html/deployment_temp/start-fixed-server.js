// Simple starter script for fixed server
import { spawn } from 'child_process';
import { createSchema } from './server/create-schema.js';

async function startServer() {
  try {
    console.log('Creating database schema if needed...');
    await createSchema();
    console.log('Database schema created successfully');

    console.log('Starting server with fixed configuration...');
    const serverProcess = spawn('tsx', [
      'server/index.fixed.ts'
    ], {
      stdio: 'inherit',
      env: {
        ...process.env,
        NODE_ENV: 'development'
      }
    });

    serverProcess.on('error', (error) => {
      console.error('Failed to start server:', error);
    });

    process.on('SIGINT', () => {
      console.log('Shutting down...');
      serverProcess.kill('SIGINT');
      process.exit(0);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

startServer();