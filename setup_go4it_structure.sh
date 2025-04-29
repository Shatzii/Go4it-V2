#!/bin/bash

# Go4It Sports - Site Structure Setup Script
# This script cleans up old directories and creates the complete site structure

# Set color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Web root directory - modify this if your web root is different
WEB_ROOT="/var/www/html"

# Application name
APP_NAME="go4it"

# Full path to the application
APP_PATH="${WEB_ROOT}/${APP_NAME}"

# Display script header
echo -e "${GREEN}========================================================${NC}"
echo -e "${GREEN}    Go4It Sports - Site Structure Setup Script${NC}"
echo -e "${GREEN}========================================================${NC}"
echo -e "${YELLOW}This script will create the complete Go4It site structure${NC}"
echo

# Ask for confirmation before proceeding
echo -e "${RED}WARNING: This will remove any existing Go4It installation at ${APP_PATH}${NC}"
echo -e "${YELLOW}Do you want to continue? (y/n)${NC}"
read -r confirm

if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
    echo -e "${RED}Operation cancelled.${NC}"
    exit 1
fi

# Check if the web root directory exists
if [ ! -d "$WEB_ROOT" ]; then
    echo -e "${YELLOW}Web root directory doesn't exist. Creating it...${NC}"
    mkdir -p "$WEB_ROOT"
    if [ $? -ne 0 ]; then
        echo -e "${RED}Failed to create web root directory. Check permissions.${NC}"
        exit 1
    fi
fi

# Remove existing application directory if it exists
if [ -d "$APP_PATH" ]; then
    echo -e "${YELLOW}Removing existing application directory...${NC}"
    rm -rf "$APP_PATH"
    if [ $? -ne 0 ]; then
        echo -e "${RED}Failed to remove existing application directory. Check permissions.${NC}"
        exit 1
    fi
fi

# Create main application directory
echo -e "${YELLOW}Creating main application directory...${NC}"
mkdir -p "$APP_PATH"
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to create application directory. Check permissions.${NC}"
    exit 1
fi

# Define the full directory structure
echo -e "${YELLOW}Creating directory structure...${NC}"

# Main directories
mkdir -p "$APP_PATH/public"
mkdir -p "$APP_PATH/server"
mkdir -p "$APP_PATH/client"
mkdir -p "$APP_PATH/shared"
mkdir -p "$APP_PATH/uploads"
mkdir -p "$APP_PATH/logs"
mkdir -p "$APP_PATH/backups"
mkdir -p "$APP_PATH/scripts"
mkdir -p "$APP_PATH/docs"

# Public directories
mkdir -p "$APP_PATH/public/images"
mkdir -p "$APP_PATH/public/videos"
mkdir -p "$APP_PATH/public/css"
mkdir -p "$APP_PATH/public/js"
mkdir -p "$APP_PATH/public/fonts"
mkdir -p "$APP_PATH/public/assets"

# Client directories
mkdir -p "$APP_PATH/client/src/components"
mkdir -p "$APP_PATH/client/src/pages"
mkdir -p "$APP_PATH/client/src/contexts"
mkdir -p "$APP_PATH/client/src/hooks"
mkdir -p "$APP_PATH/client/src/utils"
mkdir -p "$APP_PATH/client/src/services"
mkdir -p "$APP_PATH/client/public"

# Client component subdirectories
mkdir -p "$APP_PATH/client/src/components/ui"
mkdir -p "$APP_PATH/client/src/components/layout"
mkdir -p "$APP_PATH/client/src/components/forms"
mkdir -p "$APP_PATH/client/src/components/auth"
mkdir -p "$APP_PATH/client/src/components/video"
mkdir -p "$APP_PATH/client/src/components/gar"
mkdir -p "$APP_PATH/client/src/components/admin"
mkdir -p "$APP_PATH/client/src/components/athlete"
mkdir -p "$APP_PATH/client/src/components/coach"
mkdir -p "$APP_PATH/client/src/components/messaging"
mkdir -p "$APP_PATH/client/src/components/starpath"

# Client page subdirectories
mkdir -p "$APP_PATH/client/src/pages/athlete"
mkdir -p "$APP_PATH/client/src/pages/coach"
mkdir -p "$APP_PATH/client/src/pages/admin"
mkdir -p "$APP_PATH/client/src/pages/auth"
mkdir -p "$APP_PATH/client/src/pages/analytics"
mkdir -p "$APP_PATH/client/src/pages/video"
mkdir -p "$APP_PATH/client/src/pages/messaging"
mkdir -p "$APP_PATH/client/src/pages/starpath"

# Server directories
mkdir -p "$APP_PATH/server/routes"
mkdir -p "$APP_PATH/server/controllers"
mkdir -p "$APP_PATH/server/services"
mkdir -p "$APP_PATH/server/middleware"
mkdir -p "$APP_PATH/server/models"
mkdir -p "$APP_PATH/server/utils"
mkdir -p "$APP_PATH/server/config"
mkdir -p "$APP_PATH/server/types"
mkdir -p "$APP_PATH/server/mock-api"

# Server service subdirectories
mkdir -p "$APP_PATH/server/services/auth"
mkdir -p "$APP_PATH/server/services/video"
mkdir -p "$APP_PATH/server/services/analytics"
mkdir -p "$APP_PATH/server/services/messaging"
mkdir -p "$APP_PATH/server/services/ai"
mkdir -p "$APP_PATH/server/services/storage"

# Uploads directories
mkdir -p "$APP_PATH/uploads/videos"
mkdir -p "$APP_PATH/uploads/profile-images"
mkdir -p "$APP_PATH/uploads/documents"
mkdir -p "$APP_PATH/uploads/temp"

# Shared directories
mkdir -p "$APP_PATH/shared/types"
mkdir -p "$APP_PATH/shared/utils"
mkdir -p "$APP_PATH/shared/constants"

# Pharaoh Command Panel (Monaco Editor + Star Coder)
mkdir -p "$APP_PATH/public/pharaoh"
mkdir -p "$APP_PATH/public/pharaoh/js"
mkdir -p "$APP_PATH/public/pharaoh/css"
mkdir -p "$APP_PATH/public/pharaoh/assets"

# Create placeholder files
echo -e "${YELLOW}Creating placeholder files...${NC}"

# Create placeholder HTML file for Pharaoh Command Panel
cat > "$APP_PATH/public/pharaoh/command_panel.html" << 'EOL'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pharaoh Command Panel</title>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <header>
        <h1>Pharaoh Command Panel</h1>
    </header>
    <main>
        <div id="editor-container" style="width: 100%; height: 600px; border: 1px solid #ccc;"></div>
    </main>
    <footer>
        <p>Go4It Sports Admin Panel</p>
    </footer>

    <!-- Load scripts -->
    <script src="js/direct_integration.js"></script>
    <script src="js/monaco-setup.js"></script>
</body>
</html>
EOL

# Create Monaco setup placeholder file
cat > "$APP_PATH/public/pharaoh/js/monaco-setup.js" << 'EOL'
// Monaco Editor Setup

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Configure require for Monaco
    require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.36.1/min/vs' }});
    
    // Load Monaco Editor
    require(['vs/editor/editor.main'], function() {
        // Create editor instance
        const editor = monaco.editor.create(document.getElementById('editor-container'), {
            value: '// Type your code here\nconsole.log("Hello, Go4It Sports!");\n',
            language: 'javascript',
            theme: 'vs-dark',
            automaticLayout: true
        });
        
        // Integrate Star Coder with Monaco Editor
        if (typeof integrateStarCoderWithMonaco === 'function') {
            integrateStarCoderWithMonaco(monaco, editor);
            console.log('Star Coder integration initialized');
        } else {
            console.error('Star Coder integration function not found');
        }
    });
});
EOL

# Create placeholder CSS file
cat > "$APP_PATH/public/pharaoh/css/styles.css" << 'EOL'
body {
    font-family: 'Arial', sans-serif;
    margin: 0;
    padding: 0;
    background-color: #1e1e1e;
    color: #f0f0f0;
}

header {
    background-color: #2c2c2c;
    padding: 1rem;
    text-align: center;
    border-bottom: 1px solid #444;
}

h1 {
    margin: 0;
    font-size: 1.5rem;
    color: #0078d7;
}

main {
    padding: 1rem;
    max-width: 1200px;
    margin: 0 auto;
}

footer {
    text-align: center;
    padding: 1rem;
    background-color: #2c2c2c;
    border-top: 1px solid #444;
    font-size: 0.8rem;
    color: #888;
}
EOL

# Create main README file
cat > "$APP_PATH/README.md" << 'EOL'
# Go4It Sports Platform

This is the main directory structure for the Go4It Sports platform.

## Directory Structure

- `/public` - Static assets and publicly accessible files
- `/client` - Frontend React application
- `/server` - Backend Node.js application
- `/shared` - Shared code between client and server
- `/uploads` - User uploaded content
- `/logs` - Application logs
- `/scripts` - Utility scripts
- `/docs` - Documentation

## Monaco Editor + Star Coder Integration

The Monaco Editor with Star Coder AI integration is available at:
`/public/pharaoh/command_panel.html`

## Getting Started

1. Install dependencies: `npm install`
2. Start the development server: `npm run dev`
3. Build for production: `npm run build`

## Contributing

Follow the contribution guidelines in the CONTRIBUTING.md file.
EOL

# Create main .env.example file
cat > "$APP_PATH/.env.example" << 'EOL'
# Go4It Sports Environment Variables

# Node Environment
NODE_ENV=development

# Server Configuration
PORT=5000
HOST=0.0.0.0

# Database Configuration
DATABASE_URL=postgres://username:password@localhost:5432/go4it
PGDATABASE=go4it
PGUSER=username
PGPASSWORD=password
PGHOST=localhost
PGPORT=5432

# Authentication
SESSION_SECRET=replace_with_random_string
JWT_SECRET=replace_with_random_string
JWT_EXPIRY=7d

# Services API Keys
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# External APIs
NCAA_API_URL=https://api.ncaa.org/v1
SCOUT_VISION_API_URL=https://api.scoutvision.com/v1

# Redis Cache (Optional)
REDIS_URL=redis://localhost:6379

# File Storage
UPLOAD_DIR=uploads
MAX_UPLOAD_SIZE=50mb

# Logging
LOG_LEVEL=info
EOL

# Create main package.json file
cat > "$APP_PATH/package.json" << 'EOL'
{
  "name": "go4it-sports",
  "version": "1.0.0",
  "description": "Advanced sports performance and development platform",
  "main": "server/index.js",
  "scripts": {
    "dev": "node server/index.js",
    "build": "npm run build:client && npm run build:server",
    "build:client": "vite build",
    "build:server": "tsc -p server/tsconfig.json",
    "start": "node dist/server/index.js",
    "db:push": "drizzle-kit push:pg"
  },
  "dependencies": {
    "@antropic-ai/sdk": "^0.10.1",
    "@monaco-editor/react": "^4.6.0",
    "@neondatabase/serverless": "^0.6.0",
    "@tanstack/react-query": "^5.8.4",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "drizzle-orm": "^0.28.6",
    "drizzle-zod": "^0.5.1",
    "express": "^4.18.2",
    "express-session": "^1.17.3",
    "jsonwebtoken": "^9.0.2",
    "monaco-editor": "^0.43.0",
    "openai": "^4.20.0",
    "passport": "^0.6.0",
    "passport-local": "^1.0.0",
    "pg": "^8.11.3",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.48.2",
    "redis": "^4.6.10",
    "tailwindcss": "^3.3.5",
    "typescript": "^5.2.2",
    "wouter": "^2.12.0",
    "ws": "^8.14.2",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.9.0",
    "@types/pg": "^8.10.9",
    "@types/react": "^18.2.37",
    "@types/react-dom": "^18.2.15",
    "@vitejs/plugin-react": "^4.2.0",
    "drizzle-kit": "^0.19.13",
    "nodemon": "^3.0.1",
    "ts-node": "^10.9.1",
    "vite": "^5.0.0"
  },
  "author": "Go4It Sports",
  "license": "UNLICENSED",
  "private": true
}
EOL

# Create placeholder index.js file
cat > "$APP_PATH/server/index.js" << 'EOL'
/**
 * Go4It Sports Server
 */
const express = require('express');
const path = require('path');
const cors = require('cors');
const session = require('express-session');

// Import configuration
require('dotenv').config();

// Create Express app
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: process.env.MAX_UPLOAD_SIZE || '50mb' }));
app.use(express.urlencoded({ extended: true, limit: process.env.MAX_UPLOAD_SIZE || '50mb' }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'go4it-dev-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Static files
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Catch-all route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start server
app.listen(port, () => {
  console.log(`Go4It Sports server running on port ${port}`);
});
EOL

# Create placeholder App.jsx file
mkdir -p "$APP_PATH/client/src"
cat > "$APP_PATH/client/src/App.jsx" << 'EOL'
import { Switch, Route } from 'wouter';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-900 text-white">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route component={NotFoundPage} />
        </Switch>
      </div>
    </QueryClientProvider>
  );
}
EOL

# Create placeholder HomePage.jsx file
mkdir -p "$APP_PATH/client/src/pages"
cat > "$APP_PATH/client/src/pages/HomePage.jsx" << 'EOL'
export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center text-blue-500 mb-8">
        Welcome to Go4It Sports
      </h1>
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-xl mb-8">
          Advanced sports performance and development platform for neurodivergent athletes.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature Cards */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-blue-400 mb-2">Video Analysis</h3>
            <p>State-of-the-art video analysis with proprietary GAR scoring system.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-blue-400 mb-2">StarPath</h3>
            <p>Interactive development path with PS5-quality gaming experience.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-blue-400 mb-2">ADHD Support</h3>
            <p>Specialized tools and guidance for athletes with ADHD and neurodiversity.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
EOL

# Create placeholder NotFoundPage.jsx file
cat > "$APP_PATH/client/src/pages/NotFoundPage.jsx" << 'EOL'
import { Link } from 'wouter';

export default function NotFoundPage() {
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h1 className="text-4xl font-bold text-red-500 mb-4">404 - Page Not Found</h1>
      <p className="text-xl mb-8">The page you are looking for does not exist.</p>
      <Link href="/">
        <a className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Return to Home
        </a>
      </Link>
    </div>
  );
}
EOL

# Create placeholder index.html file
mkdir -p "$APP_PATH/public"
cat > "$APP_PATH/public/index.html" << 'EOL'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Go4It Sports</title>
    <link rel="stylesheet" href="/css/styles.css">
    <meta name="description" content="Advanced sports performance and development platform for neurodivergent athletes">
</head>
<body>
    <div id="root"></div>
    <script type="module" src="/client/src/main.jsx"></script>
</body>
</html>
EOL

# Create placeholder schema.ts file
mkdir -p "$APP_PATH/shared"
cat > "$APP_PATH/shared/schema.ts" << 'EOL'
import { pgTable, serial, text, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  role: text("role").notNull().default("athlete"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Create schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Athlete profiles table
export const athleteProfiles = pgTable("athlete_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  sport: text("sport").notNull(),
  position: text("position"),
  height: text("height"),
  weight: text("weight"),
  school: text("school"),
  graduationYear: integer("graduation_year"),
  bio: text("bio"),
  hasADHD: boolean("has_adhd").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Create schemas
export const insertAthleteProfileSchema = createInsertSchema(athleteProfiles).omit({ id: true });
export type InsertAthleteProfile = z.infer<typeof insertAthleteProfileSchema>;
export type AthleteProfile = typeof athleteProfiles.$inferSelect;

// Coach profiles table
export const coachProfiles = pgTable("coach_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  sport: text("sport").notNull(),
  institution: text("institution"),
  position: text("position"),
  bio: text("bio"),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Create schemas
export const insertCoachProfileSchema = createInsertSchema(coachProfiles).omit({ id: true });
export type InsertCoachProfile = z.infer<typeof insertCoachProfileSchema>;
export type CoachProfile = typeof coachProfiles.$inferSelect;

// Videos table
export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  filePath: text("file_path").notNull(),
  thumbnailPath: text("thumbnail_path"),
  sport: text("sport").notNull(),
  category: text("category"),
  duration: integer("duration"),
  processed: boolean("processed").default(false),
  public: boolean("public").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Create schemas
export const insertVideoSchema = createInsertSchema(videos).omit({ id: true });
export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type Video = typeof videos.$inferSelect;

// GAR Scores table
export const garScores = pgTable("gar_scores", {
  id: serial("id").primaryKey(),
  videoId: integer("video_id").notNull().references(() => videos.id),
  userId: integer("user_id").notNull().references(() => users.id),
  overallScore: integer("overall_score").notNull(),
  techniqueScore: integer("technique_score").notNull(),
  athleticismScore: integer("athleticism_score").notNull(),
  gameIQScore: integer("game_iq_score").notNull(),
  mentalScore: integer("mental_score").notNull(),
  analysis: text("analysis"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Create schemas
export const insertGarScoreSchema = createInsertSchema(garScores).omit({ id: true });
export type InsertGarScore = z.infer<typeof insertGarScoreSchema>;
export type GarScore = typeof garScores.$inferSelect;
EOL

# Create a placeholder drizzle config file
cat > "$APP_PATH/drizzle.config.ts" << 'EOL'
import type { Config } from "drizzle-kit";

export default {
  schema: "./shared/schema.ts",
  out: "./migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/go4it",
  },
} satisfies Config;
EOL

# Create a .gitignore file
cat > "$APP_PATH/.gitignore" << 'EOL'
# Dependencies
node_modules/
npm-debug.log
yarn-error.log
.pnp
.pnp.js

# Build
dist/
build/
out/
.next/

# Environment
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
logs/
*.log

# OS
.DS_Store
Thumbs.db

# Editors
.idea/
.vscode/
*.swp
*.swo

# Uploads
uploads/*
!uploads/.gitkeep

# Cache
.cache/
.parcel-cache/

# Testing
coverage/

# Misc
.temp/
.tmp/
tmp/
EOL

# Make sure we keep the uploads directory in git
touch "$APP_PATH/uploads/.gitkeep"

# Set permissions
echo -e "${YELLOW}Setting permissions...${NC}"
find "$APP_PATH" -type d -exec chmod 755 {} \;
find "$APP_PATH" -type f -exec chmod 644 {} \;
chmod +x "$APP_PATH/scripts"/*.sh 2>/dev/null || true

# Make a placeholder for the Star Coder integration
echo -e "${YELLOW}Creating Star Coder integration placeholder...${NC}"
cp /direct_integration.js "$APP_PATH/public/pharaoh/js/" 2>/dev/null || echo "No integration file to copy"
cp /monaco_integration_instructions.md "$APP_PATH/docs/" 2>/dev/null || echo "No instructions file to copy"
cp /verify_integration.sh "$APP_PATH/scripts/" 2>/dev/null || echo "No verification script to copy"
chmod +x "$APP_PATH/scripts/verify_integration.sh" 2>/dev/null || true

# Display completion message
echo -e "${GREEN}========================================================${NC}"
echo -e "${GREEN}    Go4It Site Structure Created Successfully!${NC}"
echo -e "${GREEN}========================================================${NC}"
echo -e "${BLUE}Directory structure created at:${NC} $APP_PATH"
echo
echo -e "${YELLOW}Key files and directories:${NC}"
echo -e "  - Main application: $APP_PATH"
echo -e "  - Monaco Editor: $APP_PATH/public/pharaoh/command_panel.html"
echo -e "  - Star Coder integration: $APP_PATH/public/pharaoh/js/direct_integration.js"
echo
echo -e "${YELLOW}Next steps:${NC}"
echo -e "1. Install your application code into this structure"
echo -e "2. Update the configuration files as needed"
echo -e "3. Set up your database using the schema"
echo -e "4. Start the application"
echo
echo -e "${GREEN}Done!${NC}"