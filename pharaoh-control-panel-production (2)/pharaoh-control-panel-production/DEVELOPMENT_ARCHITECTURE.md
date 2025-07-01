# Pharaoh Control Panel - Development Architecture & Guidelines

## 🏗️ Project Structure & Architecture

### Core Architecture Principles
1. **Component-Based Design** - Modular, reusable components
2. **Clear Separation of Concerns** - UI, Business Logic, Data Management
3. **Type Safety** - Comprehensive TypeScript usage
4. **Real-time Capabilities** - WebSocket integration for live updates
5. **Database-First Design** - Schema-driven development

## 📁 File Organization

```
client/src/
├── components/
│   ├── ui/           # Reusable UI components (buttons, cards, etc.)
│   ├── layout/       # Layout components (sidebar, navigation)
│   └── dashboard/    # Feature-specific components
├── pages/            # Route-based page components
│   ├── ai-analyzer/
│   ├── deployment/
│   ├── servers/
│   └── subscription/
├── hooks/            # Custom React hooks
├── lib/              # Utility functions and configurations
├── contexts/         # React context providers
└── App.tsx           # Main application component

server/
├── ai/               # AI engine and analysis logic
├── controllers/      # Business logic handlers
├── services/         # External service integrations
├── middlewares/      # Request/response processing
└── routes.ts         # API endpoint definitions

shared/
├── schema.ts         # Database schema and types
└── types.ts          # Shared TypeScript types
```

## 🔧 Development Guidelines

### 1. Component Development Standards

**Always follow this pattern for new components:**

```typescript
// ComponentName.tsx
import React from 'react';
import { ComponentProps } from '@/shared/types';

interface ComponentNameProps {
  // Define all props with proper types
  title: string;
  data: SomeDataType;
  onAction?: (id: string) => void;
}

export default function ComponentName({ title, data, onAction }: ComponentNameProps) {
  // Component logic here
  
  return (
    <div className="component-container">
      {/* JSX content */}
    </div>
  );
}
```

### 2. Database-First Development

**Before adding any feature:**
1. Update `shared/schema.ts` with required tables/columns
2. Run `npm run db:push` to sync database
3. Update storage interface in `server/storage.ts`
4. Add API endpoints in `server/routes.ts`
5. Create frontend components

### 3. API Development Pattern

```typescript
// In server/routes.ts
app.get('/api/feature/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await storage.getFeatureById(id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### 4. Frontend Data Fetching

```typescript
// In React components
import { useQuery } from '@tanstack/react-query';

const { data, isLoading, error } = useQuery({
  queryKey: ['/api/feature', id],
  enabled: !!id,
});
```

## 🎯 Feature Development Workflow

### Step 1: Planning
- Define feature requirements clearly
- Identify database schema changes needed
- Plan component hierarchy
- Consider real-time update requirements

### Step 2: Backend Implementation
1. Update database schema in `shared/schema.ts`
2. Add storage methods in `server/storage.ts`
3. Create API endpoints in `server/routes.ts`
4. Add WebSocket events if real-time updates needed

### Step 3: Frontend Implementation
1. Create page component in appropriate `pages/` subdirectory
2. Build reusable UI components in `components/`
3. Add route to `App.tsx`
4. Update navigation in `Sidebar.tsx` if needed

### Step 4: Integration & Testing
1. Test database operations
2. Verify API endpoints
3. Test real-time updates
4. Ensure responsive design

## 🚀 Code Quality Standards

### TypeScript Usage
- Always use proper types for props, state, and API responses
- Define interfaces for all data structures
- Use union types for status/state management
- Leverage utility types for better code reuse

### Error Handling
```typescript
// Backend
try {
  const result = await someOperation();
  res.json(result);
} catch (error) {
  console.error('Operation failed:', error);
  res.status(500).json({ error: 'Operation failed' });
}

// Frontend
const { data, error, isLoading } = useQuery({
  queryKey: ['data'],
  retry: 3,
  onError: (error) => {
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive"
    });
  }
});
```

### Real-time Updates
```typescript
// WebSocket event handling
useEffect(() => {
  socket.on('data:updated', (newData) => {
    queryClient.invalidateQueries(['data']);
  });
  
  return () => {
    socket.off('data:updated');
  };
}, []);
```

## 🎨 UI/UX Standards

### Component Styling
- Use Tailwind CSS utility classes
- Follow dark theme color scheme (slate-950 background)
- Maintain consistent spacing and typography
- Use Shadcn/UI components as base building blocks

### Responsive Design
- Mobile-first approach
- Use Tailwind breakpoints (sm, md, lg, xl)
- Test on multiple screen sizes
- Ensure touch-friendly interfaces

### Color Scheme
```css
Background: slate-950
Cards: slate-900
Borders: slate-800
Text Primary: white
Text Secondary: slate-400
Accent: blue-600
Success: green-600
Warning: yellow-600
Error: red-600
```

## 🔄 Real-time Architecture

### WebSocket Integration
- Server broadcasts events to all connected clients
- Client components subscribe to relevant events
- Automatic cache invalidation on data updates
- Graceful fallback for offline scenarios

### Socket Events Pattern
```typescript
// Server-side
io.emit('server:metrics', { serverId, metrics });
io.emit('deployment:status', { deploymentId, status });

// Client-side
socket.on('server:metrics', (data) => {
  // Update metrics display
});
```

## 📊 Performance Optimization

### Database Queries
- Use indexed columns for frequent lookups
- Implement pagination for large datasets
- Cache frequently accessed data
- Use database relations efficiently

### Frontend Performance
- Lazy load components where appropriate
- Implement virtual scrolling for large lists
- Use React Query for intelligent caching
- Optimize bundle size with code splitting

## 🛡️ Security Best Practices

### API Security
- Validate all input data
- Use parameterized queries
- Implement rate limiting
- Secure WebSocket connections

### Frontend Security
- Sanitize user inputs
- Validate data before display
- Handle errors gracefully
- Never expose sensitive data in client code

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Database operations
npm run db:push          # Push schema changes
npm run db:studio        # Open database GUI

# Code quality
npm run type-check       # TypeScript checking
npm run lint             # Code linting

# Production
npm run build           # Build for production
npm run start           # Start production server
```

## 📝 Adding New Features

### Checklist for New Features:
- [ ] Database schema updated
- [ ] Storage interface methods added
- [ ] API endpoints created
- [ ] Frontend components built
- [ ] Navigation updated (if needed)
- [ ] Real-time events added (if needed)
- [ ] Error handling implemented
- [ ] Types defined properly
- [ ] Responsive design verified

### Common Patterns:
1. **Data Management**: Always use React Query for server state
2. **Form Handling**: Use React Hook Form with Zod validation
3. **UI Components**: Extend Shadcn/UI components when possible
4. **State Management**: Use React context for global state, local state for component-specific data
5. **Error Boundaries**: Implement error boundaries for robust error handling

This architecture ensures maintainable, scalable, and robust feature development while maintaining code quality and consistency.