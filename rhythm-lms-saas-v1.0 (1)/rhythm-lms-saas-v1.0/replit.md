# Rhythm Engine Application Architecture Guide

## Overview

This repository contains a web-based Rhythm Engine, which is an AI-powered development environment for working with the Rhythm templating language. The application consists of a React frontend with a Node.js/Express backend, uses Drizzle ORM for database operations, and features a custom templating engine.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

The frontend is built with React and uses:
- React for UI components
- TanStack Query for data fetching
- Tailwind CSS for styling
- shadcn/ui component library (based on Radix UI)
- Wouter for routing

The frontend is organized in a modular way:
- `/client/src/components`: UI components including shadcn/ui components
- `/client/src/context`: React context providers
- `/client/src/hooks`: Custom React hooks
- `/client/src/lib`: Utility functions and services
- `/client/src/pages`: Page components

The frontend communicates with the backend through a REST API and WebSockets for real-time updates.

### Backend Architecture

The backend is built with:
- Node.js with Express
- WebSockets for real-time communication
- Drizzle ORM for database operations

The server structure:
- `/server/index.ts`: Main entry point
- `/server/routes.ts`: API route definitions
- `/server/storage.ts`: Database interface
- `/server/services/`: Service modules for business logic

### Database Schema

The database schema is defined in `/shared/schema.ts` using Drizzle ORM. It includes:
- `users`: User accounts
- `activity_logs`: Tracks user activity
- `rhythm_files`: Stores files for the Rhythm language

The schema is designed to be extensible, with primary keys and relationships defined.

## Key Components

1. **Rhythm Parser**: A custom parser (`/server/services/rhythm-parser.ts`) that processes Rhythm template files.

2. **File System Service**: Manages file operations for Rhythm files (`/server/services/file-service.ts`).

3. **AI Service**: Provides AI-powered code generation capabilities (`/server/services/ai-service.ts`).

4. **Real-time Communication**: WebSocket server for providing real-time updates.

5. **Editor Environment**: A code editor with supporting tools like file browser, terminal, and AI assistance.

## Data Flow

1. **User Authentication**:
   - Users can create accounts and authenticate
   - Session management is handled by the backend

2. **File Operations**:
   - Users can create, read, update, and delete Rhythm files
   - File operations are persisted in the database
   - Changes trigger WebSocket updates to all connected clients

3. **AI Code Generation**:
   - Users can request AI assistance for code generation
   - Requests are sent to the AI service
   - Generated code is returned to the user

4. **Rhythm Template Parsing**:
   - Rhythm files are parsed by the server
   - Parsing results are returned to the client
   - Compiled output can be displayed to the user

## External Dependencies

The application depends on:
- Drizzle ORM for database operations
- React and related libraries for frontend
- Express for backend API
- WebSockets for real-time communication
- shadcn/ui and Radix UI for UI components

The package.json shows all dependencies, but key ones include:
- `@tanstack/react-query` for data fetching
- `drizzle-orm` and `drizzle-zod` for database operations
- `@radix-ui/*` for UI component primitives
- Tailwind CSS for styling

## Deployment Strategy

The application is configured for deployment on Replit:

1. **Development Mode**:
   - `npm run dev` starts the development server
   - Vite is used for frontend development
   - Hot module replacement is enabled

2. **Production Build**:
   - `npm run build` creates production build
   - Frontend is built with Vite
   - Backend is bundled with esbuild

3. **Production Start**:
   - `npm run start` runs the production build
   - Server serves both the API and static frontend files

The deployment process is defined in the `.replit` file, which specifies:
- Build command: `npm run build`
- Start command: `npm run start`
- Required Replit modules: nodejs-20, web, postgresql-16

## Database Setup

The application uses PostgreSQL with Drizzle ORM. The database URL is expected in the `DATABASE_URL` environment variable. The schema is defined in `shared/schema.ts` and migrations can be managed with Drizzle Kit.

To set up the database:
1. Ensure PostgreSQL is running
2. Set the `DATABASE_URL` environment variable
3. Run `npm run db:push` to apply the schema

## WebSocket Configuration

The application uses WebSockets for real-time updates:
- WebSocket server is initialized in `server/routes.ts`
- Client-side WebSocket hooks are provided in `client/src/hooks/useWebSocket.ts`
- Different WebSocket paths handle different types of updates (e.g., file changes, terminal output)