import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

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

export default clerkMiddleware(async (auth, request) => {
  // Skip auth check if no valid Clerk keys (local testing)
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

  // Add additional admin check if needed
  if (isAdminRoute(request)) {
    await auth.protect((has) => {
      return has({ role: 'org:admin' }) || has({ permission: 'org:admin:access' })
    })
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
