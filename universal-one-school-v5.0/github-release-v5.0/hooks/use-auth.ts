import { useState, useEffect } from 'react'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading user data
    setTimeout(() => {
      setUser({ id: 'demo-user', name: 'Demo User', role: 'student' })
      setIsLoading(false)
    }, 1000)
  }, [])

  return {
    user,
    isLoading,
    isAuthenticated: !!user
  }
}