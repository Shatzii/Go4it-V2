'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Admin page error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Admin Access Error</h2>
          <p className="text-slate-300">
            There was an issue loading the admin dashboard. Please try logging in again.
          </p>
        </div>
        <div className="space-y-4">
          <Button 
            onClick={reset}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Try Again
          </Button>
          <Button 
            onClick={() => {
              localStorage.removeItem('auth-token');
              window.location.href = '/auth';
            }}
            variant="outline"
            className="w-full bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
          >
            Login Again
          </Button>
        </div>
      </div>
    </div>
  )
}