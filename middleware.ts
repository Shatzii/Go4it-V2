import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/getverified(.*)',
  '/academy(.*)',
  '/login(.*)',
  '/register(.*)',
  '/api/public(.*)',
  '/api/webhook(.*)',
  '/api/health(.*)',
])

const isAdminRoute = createRouteMatcher([
  '/admin(.*)',
])

const isTeacherRoute = createRouteMatcher([
  '/teacher(.*)',
])

export default clerkMiddleware(async (auth, request) => {
  const hasClerkKeys =
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
    !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('YOUR_KEY_HERE') &&
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.length > 20

  if (!hasClerkKeys) {
    // Local testing mode - allow all public routes
    return
  }

  // Protect all non-public routes
  if (!isPublicRoute(request)) {
    await auth.protect()
  }

  // Teacher routes: require role 'teacher' or 'admin'
  if (isTeacherRoute(request)) {
    await auth.protect((has) => {
      return has({ role: 'teacher' }) || has({ role: 'admin' })
    })
  }

  // Admin routes: require org admin
  if (isAdminRoute(request)) {
    await auth.protect((has) => {
      return has({ role: 'org:admin' }) || has({ permission: 'org:admin:access' }) || has({ role: 'admin' })
    })
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
