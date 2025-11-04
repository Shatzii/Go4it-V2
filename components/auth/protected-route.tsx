'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string
  allowedRoles?: string[]
  fallbackPath?: string
}

export default function ProtectedRoute({ 
  children, 
  requiredRole, 
  allowedRoles,
  fallbackPath = '/login'
}: ProtectedRouteProps) {
  const { user, isLoaded } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && !user) {
      router.push(fallbackPath)
    }

    if (isLoaded && user && (requiredRole || allowedRoles)) {
      const userRole = user.publicMetadata?.role as string
      
      if (requiredRole && userRole !== requiredRole) {
        router.push(fallbackPath)
      }
      
      if (allowedRoles && !allowedRoles.includes(userRole)) {
        router.push(fallbackPath)
      }
    }
  }, [isLoaded, user, router, fallbackPath, requiredRole, allowedRoles])

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-sm text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (requiredRole || allowedRoles) {
    const userRole = user.publicMetadata?.role as string
    
    if (requiredRole && userRole !== requiredRole) {
      return null
    }
    
    if (allowedRoles && !allowedRoles.includes(userRole)) {
      return null
    }
  }

  return <>{children}</>
}
