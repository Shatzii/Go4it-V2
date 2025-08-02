'use client'

import React from 'react'
import { CheckCircle } from 'lucide-react'

interface VerificationBadgeProps {
  isVerified?: boolean
  garScore?: number
  size?: 'sm' | 'md' | 'lg'
  showScore?: boolean
  className?: string
}

export default function VerificationBadge({ 
  isVerified = false, 
  garScore, 
  size = 'md', 
  showScore = false,
  className = '' 
}: VerificationBadgeProps) {
  if (!isVerified) return null

  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-12 h-12 text-lg'
  }

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-6 h-6'
  }

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div className={`
        ${sizeClasses[size]} 
        neon-border rounded-full flex items-center justify-center 
        neon-glow bg-gradient-to-r from-blue-400 to-cyan-300 
        text-slate-900 font-bold
      `}>
        <CheckCircle className={iconSizes[size]} />
      </div>
      {showScore && garScore && (
        <span className={`neon-text font-bold ${size === 'lg' ? 'text-lg' : size === 'md' ? 'text-sm' : 'text-xs'}`}>
          {garScore.toFixed(1)}
        </span>
      )}
    </div>
  )
}