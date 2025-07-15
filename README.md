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