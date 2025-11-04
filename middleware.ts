import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/login(.*)',
  '/register(.*)',
  '/api/public(.*)',
  '/api/webhook(.*)',
])

const isAdminRoute = createRouteMatcher([
  '/admin(.*)',
])

export default clerkMiddleware(async (auth, request) => {
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
