import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import { createSchema } from "./server/create-schema.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add CORS middleware to allow cross-origin requests
app.use(cors({
  origin: true, // Allow all origins
  credentials: true, // Allow cookies to be sent
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Add a simple test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Create schema and start server
try {
  console.log('Creating database schema...');
  await createSchema();
  console.log('Schema created successfully');
  
  // Start server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
} catch (error) {
  console.error(`Error starting server: ${error}`);
}