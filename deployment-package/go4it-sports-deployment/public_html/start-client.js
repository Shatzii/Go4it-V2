// Simple server to serve static files
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

// Serve the static files from the client folder
app.use(express.static(path.join(__dirname, 'client')));

// Handle all routes by serving index.html
app.get('*', (req, res) => {
  // Special handling for routes we know we have files for
  if (req.path === '/auth') {
    res.sendFile(path.join(__dirname, 'client', 'auth.html'));
  } else if (req.path === '/dashboard') {
    res.sendFile(path.join(__dirname, 'client', 'dashboard.html'));
  } else {
    // Default to index.html for other routes
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Static Server] Running on port ${PORT}`);
  console.log('[Static Server] Available routes: /, /auth, /dashboard');
});