# 🚀 Go4It OS - Enterprise Sports Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.5.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.4-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.1.1-61dafb)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38bdf8)](https://tailwindcss.com/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.45.0-orange)](https://orm.drizzle.team/)
[![Clerk Auth](https://img.shields.io/badge/Clerk_Auth-6.27.0-red)](https://clerk.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **Go4It OS** is a comprehensive enterprise-grade sports analytics platform designed for neurodivergent student athletes, featuring AI-powered performance tracking, cascading accountability models, and multi-location team management.

## ✨ Features

### 🏆 Core Capabilities
- **AI-Powered Analytics**: Advanced video analysis and performance tracking
- **Cascading Accountability**: 5-year → yearly → quarterly → monthly goal hierarchy
- **Multi-Location Support**: Dallas, Merida, Vienna office management
- **Real-time Performance**: Live data and analytics dashboard
- **Mobile-First Design**: Responsive across all devices

### 🔧 Technical Features
- **Enterprise Architecture**: Production-ready with comprehensive logging
- **Type-Safe Database**: Full TypeScript integration with Drizzle ORM
- **Advanced Caching**: Redis/fallback caching with rate limiting
- **Security First**: Comprehensive authentication and authorization
- **API-First Design**: RESTful APIs with OpenAPI documentation

### 📊 Dashboard Features
- **Personal Daily Digest**: Task prioritization and performance metrics
- **Team Management**: Hierarchical team structures with role-based access
- **Project Tracking**: Goal-oriented project management
- **Event Calendar**: Integrated scheduling and notifications
- **Audit Logging**: Complete activity tracking and compliance

## 🚀 Quick Start

### Prerequisites
- **Node.js** 20.x or later
- **npm** 10.x or later
- **PostgreSQL** (optional - SQLite for development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Shatzii/Go4it-V2.git
   cd Go4it-V2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Run automated setup**
   ```bash
   ./setup-go4it-os.sh
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

Visit [http://localhost:5000](http://localhost:5000) to see the application.

## 📁 Project Structure

```
├── app/                    # Next.js 15 App Router
│   ├── api/               # API routes
│   ├── dashboard/         # Main dashboard pages
│   ├── admin/            # Admin interface
│   └── (auth)/           # Authentication pages
├── components/            # Reusable React components
│   ├── ui/               # Base UI components (shadcn/ui)
│   ├── dashboard/        # Dashboard-specific components
│   └── forms/            # Form components
├── lib/                   # Shared utilities and configurations
│   ├── db/               # Database connection and schema
│   ├── auth/             # Authentication utilities
│   ├── logger/           # Enterprise logging system
│   ├── cache/            # Caching infrastructure
│   └── validations/      # Zod validation schemas
├── shared/                # Shared types and schemas
├── public/               # Static assets
├── migrations/           # Database migrations
└── scripts/              # Build and deployment scripts
```

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint issues
npm run type-check      # Run TypeScript type checking

# Database
npm run db:push         # Push schema changes to database
npm run db:studio       # Open Drizzle Studio
npm run db:generate     # Generate migrations

# Testing
npm run test            # Run tests
npm run test:run        # Run tests once
npm run test:coverage   # Run tests with coverage
npm run test:go4it-os   # Run Go4It OS system tests

# Setup
npm run setup:go4it-os  # Run automated setup
npm run setup:database  # Setup database
```

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL="file:./go4it-os.db"  # SQLite for development
# DATABASE_URL="postgresql://..."  # PostgreSQL for production

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
CLERK_WEBHOOK_SECRET="whsec_..."

# Supabase (Optional - for audit logging)
SUPABASE_URL="https://..."
SUPABASE_SERVICE_ROLE_KEY="..."

# Application
NEXT_PUBLIC_APP_URL="http://localhost:5000"
NODE_ENV="development"

# Go4It OS Settings
ENABLE_METRICS="true"
ENABLE_AUDIT_LOGGING="false"
CACHE_TTL="3600"
RATE_LIMIT_WINDOW="900000"
RATE_LIMIT_MAX_REQUESTS="100"
```

## 🧪 Testing

### System Tests
```bash
# Run comprehensive Go4It OS tests
npm run test:go4it-os

# Expected output:
✅ Advanced Social Media Engine operational
✅ Enterprise Logger operational
✅ Metrics & Monitoring operational
✅ Caching Infrastructure operational
✅ Rate Limiting operational
✅ Database Schema operational
✅ API Endpoints operational
✅ Dashboard Components operational
```

### API Testing
```bash
# Test registration flow
node scripts/test-register.js

# Test full authentication flow
node scripts/test-auth-flow.js

# Test health endpoints
node scripts/test-health-and-verify.js
```

## 🚢 Deployment

### Automated Deployment
```bash
# Build for production
npm run build

# Deploy using included scripts
./deploy.sh
```

### Environment Deployment Options

#### Vercel (Recommended)
1. Connect your GitHub repository
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main

#### Docker
```bash
# Build Docker image
docker build -t go4it-os .

# Run container
docker run -p 5000:5000 go4it-os
```

#### Self-Hosted
```bash
# Create deployment package
./create-deployment-package.sh

# Deploy to server
./deploy-to-server.sh
```

## 🔒 Security

- **Authentication**: Clerk-based authentication with role-based access
- **Authorization**: Comprehensive permission system
- **Rate Limiting**: Built-in rate limiting and abuse protection
- **Audit Logging**: Complete activity tracking (requires Supabase)
- **Security Headers**: Comprehensive security headers configuration

## 📊 Monitoring & Analytics

### Built-in Monitoring
- **Enterprise Logger**: Winston-based logging with multiple transports
- **Metrics System**: Performance and usage metrics
- **Health Checks**: Comprehensive health monitoring endpoints
- **Error Tracking**: Sentry integration for error monitoring

### External Monitoring
- **Sentry**: Error tracking and performance monitoring
- **Supabase**: Audit logging and analytics (optional)
- **Vercel Analytics**: Built-in analytics for Vercel deployments

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript strict mode
- Use ESLint and Prettier for code formatting
- Write comprehensive tests for new features
- Update documentation for API changes
- Follow conventional commit messages

## 🧠 Copilot/GPT Master Prompt

For a one‑paste, end‑to‑end prompt that generates the full Go4it OS upgrade (code diffs, scripts, n8n flows, Listmonk templates, PostHog wiring, and the Playwright screenshot service) on Replit, see:

- COPILOT_MASTER_PROMPT.md

Use it with Copilot/GPT to plan changes and return PR‑style diffs that are safe and feature‑flagged.

## 📝 API Documentation

### REST API Endpoints

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/user/me` - Get current user profile

#### Tasks Management
- `GET /api/tasks` - List user tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

#### Goals & Projects
- `GET /api/goals` - List goals
- `POST /api/goals` - Create goal
- `GET /api/projects` - List projects
- `POST /api/projects` - Create project

#### Events
- `GET /api/events` - List events
- `POST /api/events` - Create event
- `PUT /api/events/:id` - Update event

### Webhook Endpoints
- `POST /api/webhooks/clerk` - Clerk authentication webhooks

## 🐛 Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check database connection
npm run db:studio

# Reset database
rm go4it-os.db
npm run db:push
```

#### Build Issues
```bash
# Clear cache and rebuild
npm run clean
npm install
npm run build
```

#### Authentication Issues
```bash
# Check Clerk configuration
# Verify NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY
# Ensure webhook endpoint is configured in Clerk dashboard
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** for the amazing React framework
- **Clerk** for authentication infrastructure
- **Drizzle Team** for the excellent ORM
- **shadcn/ui** for beautiful UI components
- **Tailwind CSS** for utility-first styling

## 📞 Support

- **Documentation**: [Go4It OS Docs](https://docs.go4it.com)
- **Issues**: [GitHub Issues](https://github.com/Shatzii/Go4it-V2/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Shatzii/Go4it-V2/discussions)
- **Email**: support@go4it.com

---

<div align="center">
  <p><strong>Built with ❤️ for neurodivergent student athletes</strong></p>
  <p>
    <a href="#features">Features</a> •
    <a href="#quick-start">Quick Start</a> •
    <a href="#deployment">Deployment</a> •
    <a href="#contributing">Contributing</a> •
    <a href="#support">Support</a>
  </p>
</div>
