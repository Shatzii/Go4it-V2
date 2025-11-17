# COPILOT SERVER FIX PROMPT - EXECUTE ALL FIXES DIRECTLY

## CRITICAL DEPLOYMENT ISSUE
The main shatzii.com platform cannot deploy due to TypeScript build errors and legacy Universal One School files blocking both shatzii.com and schools.shatzii.com domains.

## EXECUTE ALL FIXES IMMEDIATELY

### 1. Remove Legacy Files Blocking Domains

```bash
# Create backup and remove blocking files
mkdir -p server/public/legacy-backup
mv server/public/*.html server/public/legacy-backup/ 2>/dev/null || true
mv server/public/css server/public/legacy-backup/ 2>/dev/null || true  
mv server/public/js server/public/legacy-backup/ 2>/dev/null || true
mv server/public/elementary-pages server/public/legacy-backup/ 2>/dev/null || true

# Verify clean directory
ls -la server/public/  # Should only show legacy-backup folder
```

### 2. Create Missing Icon Components

Create `components/ui/missing-icons.tsx`:

```typescript
import React from 'react';

interface IconProps {
  className?: string;
  size?: string | number;
}

export const Screen: React.FC<IconProps> = ({ className, ...props }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
    <line x1="8" y1="21" x2="16" y2="21"/>
    <line x1="12" y1="17" x2="12" y2="21"/>
  </svg>
);

export const Cube: React.FC<IconProps> = ({ className, ...props }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27,6.96 12,12.01 20.73,6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);

export const Future: React.FC<IconProps> = ({ className, ...props }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12,6 12,12 16,14"/>
    <path d="M16 4l4 4-4 4"/>
  </svg>
);

export const Trophy: React.FC<IconProps> = ({ className, ...props }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
    <path d="M4 22h16"/>
    <path d="M10 14.66V17c0 .55.47.98.97 1.21C12.15 18.75 14 20 14 20s1.85-1.25 3.03-1.79c.5-.23.97-.66.97-1.21v-2.34"/>
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
  </svg>
);
```

### 3. Fix Component Icon Imports

**Fix `components/virtual-classroom/interactive-classroom.tsx`:**
```typescript
// Remove Screen from lucide-react import
import { 
  Video, VideoOff, Mic, MicOff, Users, MessageCircle, Hand,
  BookOpen, Lightbulb, Heart, Star, Send, Monitor, Camera,
  Volume2, VolumeX, Settings, UserPlus, Award, Brain
} from 'lucide-react'
// Add missing icon import
import { Screen } from '@/components/ui/missing-icons'
```

**Fix `components/breakthrough-innovations/holographic-learning-space.tsx`:**
```typescript
// Remove Cube from lucide-react import
import { 
  Zap, Layers, RotateCcw, ZoomIn, ZoomOut, Play, Pause, SkipForward,
  SkipBack, Volume2, VolumeX, Maximize, Minimize, MoreHorizontal,
  ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Eye, EyeOff,
  Settings, Download, Share2, BookOpen, Lightbulb, Globe,
  Atom, Dna, Heart, Mountain
} from 'lucide-react'
// Add missing icon import  
import { Cube } from '@/components/ui/missing-icons'
```

**Fix `components/breakthrough-innovations/time-dimension-learning.tsx`:**
```typescript
// Remove Future and Trophy from lucide-react import
import { /* existing imports without Future and Trophy */ } from 'lucide-react'
// Add missing icons import
import { Future, Trophy } from '@/components/ui/missing-icons'
```

### 4. Fix Badge Component Props

**Fix `components/breakthrough-innovations/quantum-collaboration-hub.tsx`:**
```typescript
// Remove all size="..." props from Badge components
<Badge className="..." variant="...">
  {children}
</Badge>
// Do not include: size="sm" or any size prop
```

### 5. Fix Authentication System Types

**Update `hooks/use-auth.tsx`:**
```typescript
import type { User } from '@/shared/schema';

// Ensure AuthProvider is properly exported
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // ... existing implementation
}

// Update mock user to match schema
const mockUser: User = {
  id: 'demo_student',
  username: credentials.username,
  email: 'demo@example.com',
  password: 'hidden',
  firstName: 'Demo',
  lastName: 'Student',
  role: 'student',
  enrollmentType: 'premium',
  neurotype: 'adhd',
  learningPreferences: { /* ... */ },
  profileImageUrl: null,
  createdAt: new Date(),
  updatedAt: new Date()
};
```

### 6. Fix API Route Type Safety

**Update `app/api/ai/chat/route.ts`:**
```typescript
// Add proper typing for responses object
const responses: Record<string, {
  response: string;
  insights?: string[];
  recommendations?: string[];
  emotion?: string;
  support?: string[];
  adaptations?: string[];
}> = {
  neural_interface: { /* ... */ },
  emotional_companion: { /* ... */ },
  default: { response: "AI assistant ready to help.", insights: [], recommendations: [] }
};

// Safe property access
const agentKey = agentType as keyof typeof responses;
const aiResponse = responses[agentKey] || responses.default;
```

### 7. Fix Dashboard Component User Types

**Update `app/creator-dashboard/page.tsx` and `components/dashboard/student-dashboard.tsx`:**
```typescript
import type { User } from '@/shared/schema';

// Use proper type guards
const user = useAuth().user;
if (user && 'id' in user) {
  // Safe access to user.id, user.firstName, user.username, user.role
  const userId = user.id;
  const userRole = user.role;
}
```

### 8. Create Centralized Types

Create `shared/types.ts`:
```typescript
export * from './schema';
import type { User } from './schema';
export type { User };

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => void;
  loginMutation: any;
  logoutMutation: any;
}

export interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}
```

### 9. Verify TypeScript Build

```bash
# Test compilation
npx tsc --noEmit --project .

# Should return 0 errors
# If errors persist, check specific files mentioned
```

### 10. Production Deployment Commands

```bash
# Build and start applications
npm run build
npm start

# Or with PM2 for production
pm2 start npm --name "shatzii-main" -- start -- --port 3000
pm2 start server/index.ts --name "universal-one-school" --interpreter tsx -- --port 5000
```

## EXECUTION PRIORITY

1. **HIGHEST**: Remove legacy files from server/public/ (blocking domains)
2. **HIGH**: Fix missing icon imports (build errors)
3. **HIGH**: Fix authentication type exports
4. **MEDIUM**: Fix Badge component props
5. **MEDIUM**: Fix API route type safety
6. **LOW**: Fix dashboard user type guards

## SUCCESS VERIFICATION

After executing all fixes:
- `npx tsc --noEmit` returns 0 errors
- `server/public/` directory only contains `legacy-backup/` folder
- Both domains serve correct content:
  - shatzii.com → main platform (port 3000)
  - schools.shatzii.com → Universal One School (port 5000)
- No CSS-less pages displaying

## AUTOMATED EXECUTION

Use the provided `SERVER_DEPLOYMENT_FIX.sh` script to execute all fixes automatically:

```bash
chmod +x SERVER_DEPLOYMENT_FIX.sh
sudo ./SERVER_DEPLOYMENT_FIX.sh
```

This script handles all the above fixes plus nginx configuration and PM2 process management for complete deployment resolution.