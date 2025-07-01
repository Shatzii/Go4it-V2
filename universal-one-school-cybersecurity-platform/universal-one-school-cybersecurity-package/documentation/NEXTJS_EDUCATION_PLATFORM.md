# Next.js Educational Cybersecurity Platform Architecture

## Project Structure Optimization for Next.js

### Core Architecture
```
educational-cybersecurity-platform/
├── apps/
│   ├── web/                     # Next.js 14+ App Router
│   │   ├── app/
│   │   │   ├── (dashboard)/     # Route groups for authenticated pages
│   │   │   │   ├── dashboard/
│   │   │   │   ├── schools/
│   │   │   │   ├── students/
│   │   │   │   ├── social-media/
│   │   │   │   └── security/
│   │   │   ├── (auth)/          # Authentication pages
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── api/             # API routes
│   │   │   │   ├── auth/
│   │   │   │   ├── users/
│   │   │   │   ├── social-media/
│   │   │   │   └── alerts/
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/
│   │   │   ├── ui/              # shadcn/ui components
│   │   │   ├── dashboard/
│   │   │   ├── social-media/
│   │   │   └── security/
│   │   ├── lib/
│   │   │   ├── auth.ts
│   │   │   ├── db.ts
│   │   │   └── utils.ts
│   │   ├── hooks/
│   │   ├── types/
│   │   └── middleware.ts
│   └── api/                     # Separate Express.js API server
│       ├── src/
│       │   ├── routes/
│       │   ├── services/
│       │   ├── middleware/
│       │   └── utils/
│       └── server.ts
├── packages/
│   ├── database/                # Shared database schema & migrations
│   ├── ui/                      # Shared UI components
│   ├── auth/                    # Authentication utilities
│   └── types/                   # Shared TypeScript types
├── turbo.json                   # Turborepo configuration
└── package.json
```

## Next.js App Router Implementation

### 1. App Router Structure
```typescript
// app/layout.tsx - Root layout with providers
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/components/auth-provider'
import { QueryProvider } from '@/components/query-provider'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <AuthProvider>
            <QueryProvider>
              {children}
              <Toaster />
            </QueryProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

// app/(dashboard)/layout.tsx - Dashboard layout with sidebar
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardHeader } from '@/components/dashboard/header'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  
  if (!session) {
    redirect('/login')
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
```

### 2. Social Media Management Components
```typescript
// app/(dashboard)/social-media/page.tsx
import { Suspense } from 'react'
import { SocialMediaAccountList } from '@/components/social-media/account-list'
import { AddAccountDialog } from '@/components/social-media/add-account-dialog'
import { SocialMediaAlerts } from '@/components/social-media/alerts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function SocialMediaPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Social Media Management</h1>
        <AddAccountDialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Account
          </Button>
        </AddAccountDialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Connected Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading accounts...</div>}>
              <SocialMediaAccountList />
            </Suspense>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Safety Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading alerts...</div>}>
              <SocialMediaAlerts />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// components/social-media/account-list.tsx
'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Settings, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useSession } from 'next-auth/react'

export function SocialMediaAccountList() {
  const { data: session } = useSession()
  
  const { data: accounts, isLoading } = useQuery({
    queryKey: ['social-media-accounts', session?.user?.id],
    queryFn: async () => {
      const response = await fetch(`/api/users/${session?.user?.id}/social-media`)
      if (!response.ok) throw new Error('Failed to fetch accounts')
      return response.json()
    },
    enabled: !!session?.user?.id,
  })

  if (isLoading) {
    return <div>Loading social media accounts...</div>
  }

  return (
    <div className="space-y-4">
      {accounts?.map((account: any) => (
        <Card key={account.id} className="relative">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                  {account.platform.charAt(0).toUpperCase()}
                </div>
                <div>
                  <CardTitle className="text-sm">{account.displayName}</CardTitle>
                  <p className="text-xs text-muted-foreground">@{account.username}</p>
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <Badge 
                  variant={account.riskLevel === 'low' ? 'default' : 
                          account.riskLevel === 'medium' ? 'secondary' : 'destructive'}
                >
                  {account.riskLevel} risk
                </Badge>
                {account.monitoringEnabled && (
                  <Badge variant="outline">Monitored</Badge>
                )}
              </div>
              
              <div className="text-sm text-muted-foreground">
                Safety Score: {account.safetyScore}/100
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// components/social-media/add-account-dialog.tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { toast } from '@/hooks/use-toast'

const addAccountSchema = z.object({
  platform: z.enum(['instagram', 'tiktok', 'snapchat', 'discord', 'twitter', 'youtube']),
  username: z.string().min(1, 'Username is required'),
  displayName: z.string().optional(),
  profileUrl: z.string().url().optional().or(z.literal('')),
  isPublic: z.boolean().default(true),
  parentalConsent: z.boolean().default(false),
  monitoringEnabled: z.boolean().default(true),
})

export function AddAccountDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const { data: session } = useSession()
  const queryClient = useQueryClient()

  const form = useForm<z.infer<typeof addAccountSchema>>({
    resolver: zodResolver(addAccountSchema),
    defaultValues: {
      platform: 'instagram',
      username: '',
      displayName: '',
      profileUrl: '',
      isPublic: true,
      parentalConsent: false,
      monitoringEnabled: true,
    },
  })

  const addAccountMutation = useMutation({
    mutationFn: async (data: z.infer<typeof addAccountSchema>) => {
      const response = await fetch(`/api/users/${session?.user?.id}/social-media`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Failed to add account')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-media-accounts'] })
      toast({ title: 'Account added successfully!' })
      setOpen(false)
      form.reset()
    },
    onError: () => {
      toast({ title: 'Failed to add account', variant: 'destructive' })
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Social Media Account</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => addAccountMutation.mutate(data))} className="space-y-4">
            <FormField
              control={form.control}
              name="platform"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Platform</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                      <SelectItem value="snapchat">Snapchat</SelectItem>
                      <SelectItem value="discord">Discord</SelectItem>
                      <SelectItem value="twitter">Twitter/X</SelectItem>
                      <SelectItem value="youtube">YouTube</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="@username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Display name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="profileUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <FormField
                control={form.control}
                name="monitoringEnabled"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Enable Safety Monitoring</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Monitor for cyberbullying, inappropriate content, and safety risks
                      </div>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="parentalConsent"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Parental Consent</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Parent/guardian has provided consent for monitoring
                      </div>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={addAccountMutation.isPending}>
                {addAccountMutation.isPending ? 'Adding...' : 'Add Account'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
```

### 3. API Routes with App Router
```typescript
// app/api/users/[userId]/social-media/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { storage } from '@/lib/storage'
import { z } from 'zod'

const addAccountSchema = z.object({
  platform: z.string(),
  username: z.string(),
  displayName: z.string().optional(),
  profileUrl: z.string().optional(),
  isPublic: z.boolean().default(true),
  parentalConsent: z.boolean().default(false),
  monitoringEnabled: z.boolean().default(true),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = parseInt(params.userId)
    if (userId !== session.user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const accounts = await storage.getSocialMediaAccounts(userId)
    return NextResponse.json(accounts)
  } catch (error) {
    console.error('Error fetching social media accounts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch social media accounts' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = parseInt(params.userId)
    if (userId !== session.user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const body = await request.json()
    const accountData = addAccountSchema.parse({ ...body, userId })

    const account = await storage.createSocialMediaAccount(accountData)
    return NextResponse.json(account, { status: 201 })
  } catch (error) {
    console.error('Error creating social media account:', error)
    return NextResponse.json(
      { error: 'Failed to create social media account' },
      { status: 500 }
    )
  }
}

// app/api/social-media/[accountId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { storage } from '@/lib/storage'

export async function PUT(
  request: NextRequest,
  { params }: { params: { accountId: string } }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const accountId = parseInt(params.accountId)
    const updates = await request.json()
    
    // Remove sensitive fields
    delete updates.userId
    delete updates.id
    delete updates.connectedAt

    await storage.updateSocialMediaAccount(accountId, updates)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating social media account:', error)
    return NextResponse.json(
      { error: 'Failed to update social media account' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { accountId: string } }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const accountId = parseInt(params.accountId)
    await storage.deleteSocialMediaAccount(accountId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting social media account:', error)
    return NextResponse.json(
      { error: 'Failed to delete social media account' },
      { status: 500 }
    )
  }
}
```

### 4. Authentication with NextAuth.js
```typescript
// lib/auth.ts
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { storage } from './storage'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        const user = await storage.getUserByUsername(credentials.username as string)
        if (!user) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id.toString(),
          username: user.username,
          email: user.email,
          role: user.role,
          clientId: user.clientId,
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.clientId = user.clientId
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = parseInt(token.sub!)
      session.user.role = token.role as string
      session.user.clientId = token.clientId as number
      return session
    }
  }
})

// middleware.ts
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { pathname } = req.nextUrl
  
  // Protected routes
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/api')) {
    if (!req.auth) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  // Role-based access
  if (pathname.startsWith('/admin')) {
    if (req.auth?.user?.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}
```

### 5. Performance Optimizations
```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['bcryptjs']
  },
  images: {
    domains: ['avatars.githubusercontent.com', 'cdn.discordapp.com'],
  },
  webpack: (config) => {
    config.externals.push('@node-rs/argon2', '@node-rs/bcrypt')
    return config
  }
}

module.exports = nextConfig

// app/manifest.ts
import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Educational Cybersecurity Platform',
    short_name: 'EduCyberSec',
    description: 'AI-powered cybersecurity and social media safety for educational institutions',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#3b82f6',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
```

### 6. Database Integration with Prisma (Alternative to Drizzle)
```typescript
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  username  String   @unique
  email     String   @unique
  password  String
  role      String   @default("student")
  clientId  Int?
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())

  client             Client?              @relation(fields: [clientId], references: [id])
  socialMediaAccounts SocialMediaAccount[]
  socialMediaAlerts   SocialMediaAlert[]

  @@map("users")
}

model SocialMediaAccount {
  id               Int      @id @default(autoincrement())
  userId           Int
  platform         String
  username         String
  displayName      String?
  profileUrl       String?
  avatarUrl        String?
  isVerified       Boolean  @default(false)
  isPublic         Boolean  @default(true)
  followerCount    Int      @default(0)
  followingCount   Int      @default(0)
  parentalConsent  Boolean  @default(false)
  monitoringEnabled Boolean @default(true)
  riskLevel        String   @default("low")
  safetyScore      Int      @default(100)
  lastSafetyCheck  DateTime?
  connectedAt      DateTime @default(now())
  updatedAt        DateTime @updatedAt

  user         User                      @relation(fields: [userId], references: [id], onDelete: Cascade)
  interactions SocialMediaInteraction[]
  alerts       SocialMediaAlert[]

  @@map("social_media_accounts")
}

// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

## Deployment Configuration

### Vercel Deployment
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "DATABASE_URL": "@database-url",
    "NEXTAUTH_SECRET": "@nextauth-secret",
    "NEXTAUTH_URL": "@nextauth-url"
  }
}
```

### Docker Configuration
```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

This Next.js architecture provides:
- **Better Performance**: App Router with React Server Components
- **Improved SEO**: Server-side rendering and metadata API
- **Enhanced Security**: Built-in CSRF protection and secure headers
- **Scalable Structure**: Modular component organization
- **Real-time Features**: WebSocket integration for live updates
- **Mobile Optimization**: Progressive Web App capabilities
- **Type Safety**: Full TypeScript integration with proper typing