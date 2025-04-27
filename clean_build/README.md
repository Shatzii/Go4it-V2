# Go4It Sports Platform

A comprehensive sports performance platform for student athletes aged 12-18, focusing on comprehensive development and personalized insights for neurodivergent individuals.

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file based on the `.env.template` provided

3. Start the development server:
   ```bash
   npm run dev
   ```

## Key Features

- GAR (Growth and Ability Rating) scoring system
- Personalized Star Path progression system
- Video analysis and performance tracking
- Skill Tree progression
- Achievement and reward system
- Coach-athlete connection platform

## Project Structure

- `/client` - React.js with TypeScript frontend
- `/server` - Node.js backend with Express
- `/shared` - Shared types and utilities

## Database Setup

1. Ensure PostgreSQL is installed and running
2. Run database migrations:
   ```bash
   npm run db:push
   ```

## Required API Keys

- OpenAI API key for AI analysis features
- Anthropic API key for AI coach features (optional)
- Twilio API key for SMS notifications (optional)

For more detailed documentation, see the complete USER_GUIDE.md in the original repository.