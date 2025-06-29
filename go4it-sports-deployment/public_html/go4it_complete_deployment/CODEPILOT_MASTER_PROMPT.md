# CodePilot Master Integration Prompt - Go4It Sports Platform

## **Situation Analysis**

You have a comprehensive sports analytics platform with:
- **100% operational Express backend** with 711 athlete scouts, 395 transfer portal monitors, skill tree system, AI coaching service, and full database
- **75% complete Next.js frontend** with authentication, dashboard, and StarPath components
- **Critical deployment issue**: Architecture mismatch preventing frontend-backend integration

## **Your Mission: Complete Integration & Deployment**

Transform this into a fully functional, deployable platform by implementing the hybrid architecture solution outlined below.

## **Implementation Tasks**

### **Task 1: Fix Authentication Architecture**

Create middleware to bridge Clerk (frontend) with Express sessions (backend):

```typescript
// Create: middleware.ts
import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  afterAuth(auth, req) {
    if (auth.userId) {
      const response = NextResponse.next();
      response.headers.set('x-user-id', auth.userId);
      return response;
    }
  },
  publicRoutes: ["/", "/sign-in", "/sign-up"]
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
```

### **Task 2: Create API Proxy System**

Build Next.js API routes that forward to the operational Express backend:

```typescript
// Create: app/api/skill-tree/[...path]/route.ts
import { auth } from '@clerk/nextjs';
import { NextRequest } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  const { userId } = auth();
  const path = params.path.join('/');
  
  const response = await fetch(`${BACKEND_URL}/api/skill-tree/${path}?${request.nextUrl.searchParams}`, {
    headers: {
      'x-user-id': userId || '',
      'cookie': request.headers.get('cookie') || '',
    }
  });
  
  return Response.json(await response.json());
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  const { userId } = auth();
  const path = params.path.join('/');
  const body = await request.json();
  
  const response = await fetch(`${BACKEND_URL}/api/skill-tree/${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': userId || '',
    },
    body: JSON.stringify(body)
  });
  
  return Response.json(await response.json());
}
```

Repeat this pattern for:
- `app/api/player/[...path]/route.ts`
- `app/api/academic/[...path]/route.ts`
- `app/api/coach/[...path]/route.ts`

### **Task 3: Update Express Backend**

Add Clerk bridge middleware to existing Express server:

```typescript
// Add to: server/middleware/clerk-bridge.ts
import { Request, Response, NextFunction } from 'express';

export function clerkBridge(req: Request, res: Response, next: NextFunction) {
  const userId = req.headers['x-user-id'] as string;
  
  if (userId) {
    req.user = { id: parseInt(userId) };
  }
  
  next();
}

// Update: server/index.ts
import { clerkBridge } from './middleware/clerk-bridge';

// Add before existing routes
app.use('/api', clerkBridge);
```

### **Task 4: Configure Dual Server Setup**

Update package.json for concurrent frontend/backend:

```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
    "dev:backend": "tsx server/index.ts",
    "dev:frontend": "next dev -p 3000",
    "build": "next build",
    "start": "concurrently \"npm run start:backend\" \"npm run start:frontend\"",
    "start:backend": "node server/index.js",
    "start:frontend": "next start -p 3000"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
```

### **Task 5: Complete Missing Frontend Pages**

**Academic Progress Tracker**: `app/academics/page.tsx`
```typescript
'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';

interface AcademicProgress {
  gpa: number;
  eligibilityStatus: string;
  coursesCompleted: number;
  coursesRequired: number;
}

export default function AcademicsPage() {
  const { isLoaded, userId } = useAuth();
  const [progress, setProgress] = useState<AcademicProgress | null>(null);

  useEffect(() => {
    if (isLoaded && userId) {
      fetch('/api/academic/progress')
        .then(res => res.json())
        .then(setProgress);
    }
  }, [isLoaded, userId]);

  // Build comprehensive NCAA compliance interface using real academic service data
}
```

**Coach Portal**: `app/coach/page.tsx`
```typescript
'use client';
import { useState, useEffect } from 'react';

export default function CoachPage() {
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    // Connect to operational coach service endpoints
    fetch('/api/coach/teams').then(res => res.json()).then(setTeams);
    fetch('/api/coach/players').then(res => res.json()).then(setPlayers);
  }, []);

  // Build team management interface using real coach service data
}
```

### **Task 6: Environment Configuration**

Create proper environment setup:

```bash
# .env.local
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
BACKEND_URL=http://localhost:3001
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-...
```

### **Task 7: Fix StarPath Integration**

Update existing StarPath component to use new API routing:

```typescript
// Update: app/starpath/page.tsx
const loadSkillData = async () => {
  try {
    setLoading(true);
    
    // These now route through Next.js API to Express backend
    const nodesResponse = await fetch(`/api/skill-tree/nodes?sport=${selectedSport}`);
    const nodesData = await nodesResponse.json();
    setSkillNodes(nodesData.nodes || []);
    
    const userResponse = await fetch('/api/skill-tree/user');
    const userData = await userResponse.json();
    setUserSkills(userData || []);
    
    const statsResponse = await fetch(`/api/skill-tree/stats?sport=${selectedSport}`);
    const statsData = await statsResponse.json();
    setStats(statsData);
    
  } catch (error) {
    console.error('Error loading skill data:', error);
  } finally {
    setLoading(false);
  }
};
```

## **Critical Success Metrics**

After implementation, verify:
- [ ] User can authenticate with Clerk and access protected pages
- [ ] StarPath displays real skill tree data from your 711 scouts
- [ ] Dashboard shows actual player progress from database
- [ ] Academic page connects to NCAA compliance tracking
- [ ] Coach portal accesses team management features
- [ ] All Express backend services remain operational
- [ ] Frontend and backend run on separate ports (3000/3001)

## **Data Integrity Requirements**

- Never use placeholder data when real data is available from operational services
- All athlete information must come from your 711 active scouts
- Academic progress must use real NCAA tracking data
- Coach portal must display actual team and player information
- Skill progression must use authentic XP calculations from backend

## **Deployment Readiness**

Once integration is complete:
1. Both servers should start successfully
2. Authentication flow should work end-to-end
3. All API endpoints should respond with real data
4. Frontend should display operational backend information
5. Platform should be ready for production deployment

Your comprehensive backend infrastructure (711 scouts, transfer portal monitoring, AI coaching) is fully operational and waiting for frontend integration completion.