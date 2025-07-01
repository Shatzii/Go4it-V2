'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light' | 'system'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
  attribute?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}

const ThemeProviderContext = createContext<{
  theme: Theme
  setTheme: (theme: Theme) => void
} | undefined>(undefined)

export function ThemeProvider({
  children,
  defaultTheme = 'dark', // Default to dark for Universal One School 2.0
  storageKey = 'ui-theme',
  attribute = 'class',
  enableSystem = true,
  disableTransitionOnChange = false,
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const root = window.document.documentElement
    
    // Remove previous theme classes
    root.classList.remove('light', 'dark')
    
    let systemTheme: Theme = 'dark'
    if (theme === 'system' && enableSystem) {
      systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    
    const themeToApply = theme === 'system' ? systemTheme : theme
    
    if (attribute === 'class') {
      root.classList.add(themeToApply)
    } else {
      root.setAttribute(attribute, themeToApply)
    }
    
    // Store theme preference
    try {
      localStorage.setItem(storageKey, theme)
    } catch (error) {
      // Handle localStorage errors in incognito mode
      console.warn('Failed to save theme preference:', error)
    }
  }, [theme, mounted, attribute, storageKey, enableSystem])

  useEffect(() => {
    if (!mounted) return
    
    // Load saved theme preference
    try {
      const savedTheme = localStorage.getItem(storageKey) as Theme
      if (savedTheme && ['dark', 'light', 'system'].includes(savedTheme)) {
        setTheme(savedTheme)
      }
    } catch (error) {
      console.warn('Failed to load theme preference:', error)
    }
  }, [mounted, storageKey])

  useEffect(() => {
    if (!enableSystem || theme !== 'system' || !mounted) return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = () => {
      const root = window.document.documentElement
      root.classList.remove('light', 'dark')
      root.classList.add(mediaQuery.matches ? 'dark' : 'light')
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme, enableSystem, mounted])

  // Prevent hydration mismatch
  if (!mounted) {
    return null
  }

  return (
    <ThemeProviderContext.Provider 
      {...props} 
      value={{ 
        theme, 
        setTheme: (newTheme: Theme) => {
          if (!disableTransitionOnChange) {
            // Add transition class temporarily
            const root = window.document.documentElement
            root.style.transition = 'background-color 0.3s ease, color 0.3s ease'
            setTimeout(() => {
              root.style.transition = ''
            }, 300)
          }
          setTheme(newTheme)
        }
      }}
    >
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}