import { cn } from '@/src/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  }

  return (
    <div 
      className={cn(
        'animate-spin rounded-full border-2 border-slate-600 border-t-blue-500',
        sizeClasses[size],
        className
      )}
    />
  )
}

export function PageLoading() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <p className="text-slate-300">Loading Go4It Sports Platform...</p>
      </div>
    </div>
  )
}

export function ComponentLoading({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <LoadingSpinner className="mx-auto mb-2" />
        {children && <p className="text-slate-400 text-sm">{children}</p>}
      </div>
    </div>
  )
}