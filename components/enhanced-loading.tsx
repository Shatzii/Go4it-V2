'use client'

import { useState, useEffect } from 'react'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, Brain, Zap } from 'lucide-react'

interface EnhancedLoadingProps {
  message?: string
  progress?: number
  type?: 'default' | 'analysis' | 'upload' | 'processing'
  showProgress?: boolean
  animated?: boolean
}

export function EnhancedLoading({
  message = 'Loading...',
  progress = 0,
  type = 'default',
  showProgress = false,
  animated = true
}: EnhancedLoadingProps) {
  const [dots, setDots] = useState('')
  const [animatedProgress, setAnimatedProgress] = useState(0)

  useEffect(() => {
    if (animated) {
      const interval = setInterval(() => {
        setDots(prev => prev.length >= 3 ? '' : prev + '.')
      }, 500)

      return () => clearInterval(interval)
    }
  }, [animated])

  useEffect(() => {
    if (showProgress && progress > animatedProgress) {
      const timer = setTimeout(() => {
        setAnimatedProgress(prev => Math.min(prev + 1, progress))
      }, 50)

      return () => clearTimeout(timer)
    }
  }, [progress, animatedProgress, showProgress])

  const getIcon = () => {
    switch (type) {
      case 'analysis':
        return <Brain className="w-6 h-6 text-blue-400 animate-pulse" />
      case 'upload':
        return <Zap className="w-6 h-6 text-green-400 animate-pulse" />
      case 'processing':
        return <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
      default:
        return <Loader2 className="w-6 h-6 text-white animate-spin" />
    }
  }

  const getBackgroundColor = () => {
    switch (type) {
      case 'analysis':
        return 'bg-blue-900/20 border-blue-500/30'
      case 'upload':
        return 'bg-green-900/20 border-green-500/30'
      case 'processing':
        return 'bg-purple-900/20 border-purple-500/30'
      default:
        return 'bg-slate-800 border-slate-700'
    }
  }

  return (
    <Card className={`${getBackgroundColor()} transition-all duration-300`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-center space-x-3 mb-4">
          {getIcon()}
          <h3 className="text-lg font-semibold text-white">
            {message}{animated && dots}
          </h3>
        </div>
        
        {showProgress && (
          <div className="space-y-2">
            <Progress 
              value={animatedProgress} 
              className="w-full h-2"
            />
            <div className="flex justify-between text-sm text-slate-400">
              <span>{animatedProgress}% complete</span>
              <span>{Math.round((animatedProgress / 100) * 60)}s estimated</span>
            </div>
          </div>
        )}
        
        <div className="mt-4 text-center text-sm text-slate-400">
          {type === 'analysis' && 'Analyzing your athletic performance...'}
          {type === 'upload' && 'Uploading and processing your content...'}
          {type === 'processing' && 'Processing data with AI models...'}
          {type === 'default' && 'Please wait while we prepare your dashboard...'}
        </div>
      </CardContent>
    </Card>
  )
}

export function SkeletonCard() {
  return (
    <Card className="bg-slate-800 border-slate-700 animate-pulse">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="h-4 bg-slate-600 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-slate-600 rounded"></div>
            <div className="h-3 bg-slate-600 rounded w-5/6"></div>
          </div>
          <div className="flex space-x-2">
            <div className="h-6 bg-slate-600 rounded w-16"></div>
            <div className="h-6 bg-slate-600 rounded w-20"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function SkeletonList({ items = 5 }: { items?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center space-x-3 animate-pulse">
          <div className="w-10 h-10 bg-slate-600 rounded-full"></div>
          <div className="flex-1 space-y-1">
            <div className="h-4 bg-slate-600 rounded w-1/2"></div>
            <div className="h-3 bg-slate-600 rounded w-1/4"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function SkeletonTable({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex space-x-4 animate-pulse">
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="h-4 bg-slate-600 rounded flex-1"></div>
          ))}
        </div>
      ))}
    </div>
  )
}