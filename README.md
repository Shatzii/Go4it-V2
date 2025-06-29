# Go4It Sports Platform

> Advanced AI-enhanced sports analytics platform tailored for neurodivergent student athletes, providing adaptive performance tracking and personalized support technologies.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.1.0-blue)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

## 🎯 Overview

Go4It Sports is a comprehensive sports analytics platform designed specifically for neurodivergent student athletes aged 12-18, particularly those with ADHD. The platform combines video analysis, skill progression tracking, AI coaching, and recruitment tools to provide a complete development ecosystem for young athletes.

### ✨ Key Features

- **🎥 Video Analysis System (GAR)**: Proprietary Growth and Ability Rating with AI-powered performance analysis
- **🌟 StarPath Skill Development**: Interactive skill trees with gamified progression
- **🤖 AI Coaching Engine**: ADHD-aware personalized coaching with multiple AI providers
- **🏫 Academic Integration**: NCAA eligibility monitoring and GPA tracking
- **🔍 Recruitment Hub**: Scout monitoring and college matching system
- **👥 Team Management**: Complete system for multiple sports and team coordination

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/go4it-sports-platform.git
   cd go4it-sports-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Initialize database**
   ```bash
   npm run db:push
   ```

5. **Start the application**
   ```bash
   node server.js
   ```

The platform will be available at `http://localhost:5000`

## 🏗️ Architecture

### Technology Stack

- **Frontend**: React.js with TypeScript, Next.js, Tailwind CSS
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Clerk with session bridging
- **AI Services**: OpenAI and Anthropic APIs
- **Real-time**: WebSocket support

### System Design

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │◄──►│  Express Server │◄──►│   PostgreSQL    │
│  (Port 5000)    │    │  (API Routes)   │    │   (Database)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   AI Services   │    │  File Storage   │    │  Authentication │
│ (OpenAI/Claude) │    │   (Uploads)     │    │    (Clerk)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📊 Core Features

### Video Analysis (GAR System)
- Upload and analyze athletic performance videos
- Proprietary Growth and Ability Rating (0-100 scale)
- Frame-by-frame breakdown with AI insights
- Before/after comparison tools

### StarPath Skill Development
- Interactive skill trees with visual progression
- XP-based advancement system
- Achievement badges and milestones
- Personalized training recommendations

### AI Coaching Engine
- ADHD-aware coaching methodologies
- Emotional intelligence analysis
- Frustration detection and intervention
- Multi-provider AI integration (OpenAI, Anthropic)

### Recruitment Hub
- 711 active scout monitors
- 395 transfer portal trackers
- NCAA school database integration
- Communication timeline tracking

## 🔧 Configuration

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/go4it

# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret

# AI Services
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key

# Application
PORT=5000
NODE_ENV=development
```

### Database Schema

The platform uses Drizzle ORM for type-safe database operations. Key tables include:

- `users` - User profiles and authentication
- `videos` - Video uploads and analysis results
- `performances` - Athletic performance data
- `skill_trees` - Progression tracking
- `achievements` - Gamification system

## 🎮 Usage

### For Student Athletes
1. Create profile and select sport
2. Upload performance videos
3. Complete skill tree activities
4. Track academic progress
5. Monitor recruitment opportunities

### For Coaches
1. Manage team rosters
2. Review athlete progress
3. Provide feedback and coaching
4. Monitor team performance metrics

### For Parents
1. Track child's development
2. Receive progress updates
3. Monitor academic eligibility
4. Support recruitment process

## 🛠️ Development

### Project Structure

```
go4it-sports-platform/
├── app/                    # Next.js application pages
├── server/                 # Backend services and APIs
├── shared/                 # Shared schemas and types
├── components/             # React components
├── lib/                    # Utility functions
├── public/                 # Static assets
├── uploads/                # File storage
└── docs/                   # Documentation
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run db:push      # Push database schema
npm run db:studio    # Open database studio
node server.js       # Start optimized server
```

### Health Monitoring

The platform includes comprehensive health monitoring:

- **Health Endpoint**: `GET /api/health`
- **Real-time Status**: All system components monitored
- **Graceful Degradation**: Works even with partial service failures

## 🚢 Deployment

### Replit Deployment
The platform is optimized for Replit with automatic port detection and environment configuration.

### Production Deployment
1. Configure environment variables
2. Setup PostgreSQL database
3. Build the application: `npm run build`
4. Start with: `node server.js`

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Workflow
1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [Full documentation](docs/)
- **Issues**: [GitHub Issues](https://github.com/YOUR_USERNAME/go4it-sports-platform/issues)
- **Discussions**: [GitHub Discussions](https://github.com/YOUR_USERNAME/go4it-sports-platform/discussions)

## 🏆 Acknowledgments

- Designed for neurodivergent student athletes
- Built with accessibility and inclusion in mind
- Powered by cutting-edge AI technology
- Supporting the next generation of athletes

---

**Made with ❤️ for student athletes everywhere**