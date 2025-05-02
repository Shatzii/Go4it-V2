# Go4It Sports Platform

A comprehensive sports performance platform designed for neurodivergent student athletes aged 12-18, particularly those with ADHD. It connects athletes with coaches while providing tools for development, performance analysis, and recruitment.

## Overview

The Go4It Sports platform centers around video analysis with the proprietary GAR (Growth and Ability Rating) scoring system, complemented by a PlayStation 5-quality interactive experience called "StarPath". The platform supports multiple domains and integrates with AI engines for video analysis, player development, and media creation.

## Key Features

- **Video Analysis**: Upload and analyze sports performance videos with AI-powered insights
- **GAR Scoring**: Proprietary Growth and Ability Rating system for comprehensive athlete assessment
- **Transfer Portal**: Monitor athlete movements and recommend best-fit schools
- **Blog Content Generator**: AI-powered sports content creation
- **StarPath Progression**: Interactive development path for athletes
- **Highlight Generator**: Create compelling highlight reels automatically
- **Athlete Scouting**: Identify and track promising talent

## Tech Stack

- **Frontend**: React.js with TypeScript, Tailwind CSS, Shadcn UI components
- **Backend**: Node.js with Express, PostgreSQL with Drizzle ORM
- **AI Services**: Integrated AI engine with OpenAI and Anthropic capabilities
- **Authentication**: Passport.js with session-based auth
- **File Storage**: Local file system with cloud storage options

## Deployment Instructions

### Prerequisites

- Node.js v20+
- PostgreSQL database
- Required API keys (OpenAI, Anthropic)

### Installation

1. Extract the deployment package:
   ```
   unzip go4it-deployment.zip
   ```

2. Configure environment variables in `.env` file:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/go4it
   SESSION_SECRET=your-random-secret-key
   OPENAI_API_KEY=your-openai-api-key
   ANTHROPIC_API_KEY=your-anthropic-api-key
   USE_MOCK_AI_DATA=false
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Set up the database:
   ```
   npm run db:push
   ```

5. Build the client:
   ```
   npm run build
   ```

6. Start the production server:
   ```
   node start-production.js
   ```

### Production Setup with PM2

For running in production with process management:

1. Install PM2:
   ```
   npm install -g pm2
   ```

2. Start the application with PM2:
   ```
   pm2 start start-production.js --name "go4it"
   ```

3. Configure PM2 to start on system boot:
   ```
   pm2 save
   pm2 startup
   ```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | - |
| `PORT` | Server port | 5000 |
| `SESSION_SECRET` | Secret for session encryption | - |
| `OPENAI_API_KEY` | API key for OpenAI | - |
| `ANTHROPIC_API_KEY` | API key for Anthropic | - |
| `USE_MOCK_AI_DATA` | Use mock data instead of AI API calls | false |
| `AI_ENGINE_URL` | URL for external AI engine | - |

## AI Engine Integration

The platform is designed to work with an external AI engine hosted on a separate server. Until that service is fully implemented, the system can operate in three modes:

1. **Mock Mode**: Uses deterministic mock data for development and testing
2. **Direct API Mode**: Makes direct API calls to OpenAI and Anthropic (requires API keys)
3. **AI Engine Mode**: Connects to the external AI engine microservice (when available)

To use mock mode, set `USE_MOCK_AI_DATA=true` in your environment variables.

## Documentation

For more detailed information, refer to:

- [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)
- [Production Optimizations](./PRODUCTION_OPTIMIZATIONS.md)

## Support

For assistance with deployment or technical issues, please contact the Go4It Sports technical team at admin@go4itsports.org.

## License

© 2025 Go4It Sports. All rights reserved.