// Core User Types
export interface User {
  id: number
  username: string
  email: string
  role: 'athlete' | 'coach' | 'parent' | 'admin'
  firstName?: string
  lastName?: string
  dateOfBirth?: Date
  sport?: string
  position?: string
  graduationYear?: number
  gpa?: number
  isActive: boolean
  createdAt: Date
  lastLoginAt?: Date
}

// Video Analysis Types
export interface VideoAnalysis {
  id: number
  userId: number
  fileName: string
  filePath: string
  sport: string
  garScore?: number
  analysisData?: any
  feedback?: string
  createdAt: Date
}

// StarPath Types
export interface StarPathProgress {
  id: number
  userId: number
  skillId: string
  skillName: string
  currentLevel: number
  totalXp: number
  isUnlocked: boolean
  completedAt?: Date
  lastUpdated: Date
}

export interface Achievement {
  id: number
  userId: number
  achievementId: string
  achievementName: string
  achievementType: string
  earnedAt: Date
  points: number
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Form Types
export interface LoginForm {
  username: string
  password: string
}

export interface RegisterForm {
  username: string
  email: string
  password: string
  confirmPassword: string
  firstName?: string
  lastName?: string
  sport?: string
  role?: string
}

// Component Props Types
export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{error: Error}>
}