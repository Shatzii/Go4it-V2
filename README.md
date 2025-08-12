# Go4It Sports Platform

This repository hosts the Go4It Sports platform (Next.js + TypeScript + Drizzle ORM).

## Recent Enhancements
- SEO: `/sitemap.xml` and `/robots.txt` via Next.js metadata routes
- Headers: Security and caching headers in `middleware.ts` and `next.config.js`
- Logging: Request ID header (X-Request-Id) and minimal request logs
- Structured logs: `lib/logger.ts` wired into auth and health routes
- CI: Workflow builds and runs smoke tests (register, full auth flow, health+verify)

## Quick Start
- Dev: `npm run dev` (port 5000)
- Build: `npm run build`
- Start: `npm start`

## Smoke Test Registration
Requires server listening on BASE_URL (default http://localhost:5000).

```bash
node scripts/test-register.js
# or with custom URL
BASE_URL=http://localhost:5001 node scripts/test-register.js
```

## Additional Smoke Tests
- Full auth flow (register → me → logout → login → me)

```bash
node scripts/test-auth-flow.js
```

- Health and email verify (verify step is skipped in prod where verifyUrl isn’t exposed):

```bash
node scripts/test-health-and-verify.js
```

## Environment
- NEXT_PUBLIC_APP_URL: public base URL (e.g., https://app.example.com)
- JWT_SECRET: required for auth
- Optional: COOKIE_DOMAIN, UPSTASH_REDIS_REST_URL/TOKEN, RESEND_API_KEY, FROM_EMAIL, RECAPTCHA_SECRET_KEY
- Monitoring (optional): SENTRY_DSN, NEXT_PUBLIC_SENTRY_DSN, SENTRY_ORG, SENTRY_PROJECT

## Deployment
- Preferred: git pull on server then build/start
- Fallback: use generated deployment packages and scripts in docs
# Go4It Sports Platform

Advanced AI-enhanced sports analytics platform for neurodivergent student athletes.

## Quick Start

```bash
npm run dev    # Start development server
npm run build  # Build for production
npm run start  # Start production server
```

## Features

- **AI-Powered Analytics**: Advanced video analysis and performance tracking
- **Neurodivergent-Friendly**: Designed specifically for ADHD and other neurodivergent conditions
- **Academic Tracking**: NCAA compliance and grade monitoring
- **Real-time Performance**: Live data and analytics
- **Mobile-First**: Responsive design for all devices

## Recent Fixes Applied

✅ **Disabled Terser minification** to resolve build errors  
✅ **Updated TypeScript configuration** for better compatibility  
✅ **Created proper Next.js configuration** with SWC disabled  
✅ **Added fallback build scripts** for reliable deployment  
✅ **Cleaned up unused files** and optimized project structure  
✅ **Fixed environment variable handling** in Next.js config  

## Project Structure

```
app/                 # Next.js app directory
├── academics/       # Academic tracking pages
├── admin/          # Admin dashboard
├── api/            # API routes
├── auth/           # Authentication pages
├── dashboard/      # Main dashboard
├── profile/        # User profiles
├── teams/          # Team management
└── ...

components/         # Reusable React components
├── ui/            # Base UI components
├── dashboard/     # Dashboard components
├── mobile/        # Mobile-specific components
└── ...

lib/               # Shared utilities
├── auth.ts        # Authentication utilities
├── db.ts          # Database connection
├── schema.ts      # Database schema
└── utils.ts       # General utilities
```

## Environment Variables

Create a `.env.local` file with:

```env
DATABASE_URL=your_database_url
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:5000
```

## Deployment

The application is optimized for deployment on platforms like Vercel, Netlify, or self-hosted servers. The build process now works reliably with all minification issues resolved.

## Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom components
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: NextAuth.js
- **Development**: Hot reload enabled, fast refresh optimized

## Support

For technical support or questions about the platform, please contact the development team.