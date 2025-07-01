'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useQuery, useMutation, UseMutationResult } from '@tanstack/react-query'
import type { User } from '@/shared/types'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: { username: string; password: string }) => Promise<void>
  logout: () => void
  loginMutation: UseMutationResult<User, Error, { username: string; password: string }>
  logoutMutation: UseMutationResult<void, Error, void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Simulate fetching user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        }
      } catch (error) {
        console.log('No authenticated user')
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [])

  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      // Mock login - in a real app this would hit your auth API
      const mockUser: User = {
        id: 'demo_student',
        username: credentials.username,
        email: 'demo@example.com',
        password: 'hidden', // Required by schema but not exposed
        firstName: 'Demo',
        lastName: 'Student',
        role: 'student',
        enrollmentType: 'premium',
        neurotype: 'adhd',
        learningPreferences: {
          visualLearning: true,
          auditoryLearning: false,
          kinestheticLearning: true,
          readingWriting: false
        },
        profileImageUrl: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      setUser(mockUser)
      return mockUser
    },
    onError: (error) => {
      console.error('Login failed:', error)
    }
  })

  const logoutMutation = useMutation({
    mutationFn: async () => {
      setUser(null)
    },
    onError: (error) => {
      console.error('Logout failed:', error)
    }
  })

  const login = async (credentials: { username: string; password: string }) => {
    await loginMutation.mutateAsync(credentials)
  }

  const logout = () => {
    logoutMutation.mutate()
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    loginMutation,
    logoutMutation
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}