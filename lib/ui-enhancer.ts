// UI Enhancement utilities for smooth animations and better UX
import { toast } from '@/hooks/use-toast'

export class UIEnhancer {
  private static instance: UIEnhancer
  private loadingStates: Map<string, boolean> = new Map()
  private animationObserver: IntersectionObserver | null = null

  static getInstance(): UIEnhancer {
    if (!UIEnhancer.instance) {
      UIEnhancer.instance = new UIEnhancer()
    }
    return UIEnhancer.instance
  }

  constructor() {
    this.initializeAnimationObserver()
  }

  // Enhanced loading states with better UX
  setLoading(key: string, isLoading: boolean, message?: string) {
    this.loadingStates.set(key, isLoading)
    
    if (isLoading && message) {
      toast({
        title: "Processing",
        description: message,
        variant: "default"
      })
    }
  }

  isLoading(key: string): boolean {
    return this.loadingStates.get(key) || false
  }

  // Smooth page transitions
  async transitionTo(href: string, options?: { smooth?: boolean; delay?: number }) {
    const { smooth = true, delay = 0 } = options || {}
    
    if (smooth) {
      document.body.style.opacity = '0.8'
      document.body.style.transition = 'opacity 0.3s ease'
    }
    
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay))
    }
    
    window.location.href = href
  }

  // Enhanced error handling with better user feedback
  handleError(error: Error, context?: string, showToast: boolean = true) {
    console.error(`[Error${context ? ` - ${context}` : ''}]:`, error)
    
    if (showToast) {
      const isNetworkError = error.message.includes('fetch') || error.message.includes('network')
      const isAuthError = error.message.includes('401') || error.message.includes('Unauthorized')
      
      let title = 'Error'
      let description = error.message
      let variant: 'default' | 'destructive' = 'destructive'
      
      if (isNetworkError) {
        title = 'Connection Error'
        description = 'Please check your internet connection and try again'
      } else if (isAuthError) {
        title = 'Authentication Required'
        description = 'Please sign in to continue'
        variant = 'default'
      }
      
      toast({
        title,
        description,
        variant
      })
    }
    
    return {
      isNetworkError: error.message.includes('fetch'),
      isAuthError: error.message.includes('401'),
      shouldRetry: error.message.includes('timeout') || error.message.includes('network')
    }
  }

  // Smooth scroll to element with better UX
  scrollToElement(
    elementId: string, 
    options?: { 
      behavior?: 'smooth' | 'auto'
      block?: 'start' | 'center' | 'end'
      offset?: number
    }
  ) {
    const element = document.getElementById(elementId)
    if (!element) return

    const { behavior = 'smooth', block = 'start', offset = 0 } = options || {}
    
    const elementPosition = element.offsetTop - offset
    
    window.scrollTo({
      top: elementPosition,
      behavior
    })
  }

  // Enhanced mobile responsiveness detection
  isMobile(): boolean {
    return window.innerWidth <= 768
  }

  isTablet(): boolean {
    return window.innerWidth > 768 && window.innerWidth <= 1024
  }

  getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    if (this.isMobile()) return 'mobile'
    if (this.isTablet()) return 'tablet'
    return 'desktop'
  }

  // Better form validation with enhanced UX
  validateForm(formData: Record<string, any>, rules: Record<string, any>): {
    isValid: boolean
    errors: Record<string, string>
    firstErrorField?: string
  } {
    const errors: Record<string, string> = {}
    
    for (const [field, value] of Object.entries(formData)) {
      const rule = rules[field]
      if (!rule) continue
      
      // Required validation
      if (rule.required && (!value || value.toString().trim() === '')) {
        errors[field] = `${field} is required`
        continue
      }
      
      // Email validation
      if (rule.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) {
          errors[field] = 'Please enter a valid email address'
        }
      }
      
      // Min length validation
      if (rule.minLength && value && value.length < rule.minLength) {
        errors[field] = `${field} must be at least ${rule.minLength} characters`
      }
      
      // Max length validation
      if (rule.maxLength && value && value.length > rule.maxLength) {
        errors[field] = `${field} must be no more than ${rule.maxLength} characters`
      }
      
      // Custom validation
      if (rule.validate && typeof rule.validate === 'function') {
        const customError = rule.validate(value)
        if (customError) {
          errors[field] = customError
        }
      }
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      firstErrorField: Object.keys(errors)[0]
    }
  }

  // Enhanced file upload with progress and validation
  async uploadWithProgress(
    file: File,
    endpoint: string,
    options?: {
      maxSize?: number
      allowedTypes?: string[]
      onProgress?: (progress: number) => void
    }
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    const { maxSize = 500 * 1024 * 1024, allowedTypes = [], onProgress } = options || {}
    
    // File validation
    if (file.size > maxSize) {
      return {
        success: false,
        error: `File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`
      }
    }
    
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: `File type ${file.type} is not allowed`
      }
    }
    
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest()
      const formData = new FormData()
      formData.append('file', file)
      
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable && onProgress) {
          const progress = (e.loaded / e.total) * 100
          onProgress(progress)
        }
      }
      
      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve({
            success: true,
            data: JSON.parse(xhr.responseText)
          })
        } else {
          resolve({
            success: false,
            error: `Upload failed: ${xhr.statusText}`
          })
        }
      }
      
      xhr.onerror = () => {
        resolve({
          success: false,
          error: 'Upload failed due to network error'
        })
      }
      
      xhr.open('POST', endpoint)
      xhr.send(formData)
    })
  }

  // Animation utilities
  private initializeAnimationObserver() {
    if (typeof window === 'undefined') return
    
    this.animationObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in')
        }
      })
    }, {
      threshold: 0.1,
      rootMargin: '50px'
    })
  }

  observeForAnimation(element: HTMLElement) {
    if (this.animationObserver) {
      this.animationObserver.observe(element)
    }
  }

  // Enhanced loading skeletons
  createSkeletonLoader(type: 'card' | 'list' | 'table' | 'text' = 'card'): HTMLElement {
    const skeleton = document.createElement('div')
    skeleton.className = 'animate-pulse'
    
    switch (type) {
      case 'card':
        skeleton.innerHTML = `
          <div class="bg-slate-700 rounded-lg p-6 space-y-4">
            <div class="h-4 bg-slate-600 rounded w-3/4"></div>
            <div class="space-y-2">
              <div class="h-3 bg-slate-600 rounded"></div>
              <div class="h-3 bg-slate-600 rounded w-5/6"></div>
            </div>
          </div>
        `
        break
      case 'list':
        skeleton.innerHTML = `
          <div class="space-y-3">
            ${Array.from({ length: 5 }, () => `
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-slate-600 rounded-full"></div>
                <div class="flex-1 space-y-1">
                  <div class="h-4 bg-slate-600 rounded w-1/2"></div>
                  <div class="h-3 bg-slate-600 rounded w-1/4"></div>
                </div>
              </div>
            `).join('')}
          </div>
        `
        break
      case 'table':
        skeleton.innerHTML = `
          <div class="space-y-3">
            ${Array.from({ length: 3 }, () => `
              <div class="flex space-x-4">
                <div class="h-4 bg-slate-600 rounded w-1/4"></div>
                <div class="h-4 bg-slate-600 rounded w-1/4"></div>
                <div class="h-4 bg-slate-600 rounded w-1/4"></div>
                <div class="h-4 bg-slate-600 rounded w-1/4"></div>
              </div>
            `).join('')}
          </div>
        `
        break
      case 'text':
        skeleton.innerHTML = `
          <div class="space-y-2">
            <div class="h-4 bg-slate-600 rounded w-full"></div>
            <div class="h-4 bg-slate-600 rounded w-11/12"></div>
            <div class="h-4 bg-slate-600 rounded w-4/5"></div>
          </div>
        `
        break
    }
    
    return skeleton
  }

  // Keyboard navigation enhancement
  enhanceKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // ESC key to close modals
      if (e.key === 'Escape') {
        const modals = document.querySelectorAll('[role="dialog"]')
        modals.forEach(modal => {
          if (modal.classList.contains('open')) {
            modal.classList.remove('open')
          }
        })
      }
      
      // Tab navigation improvements
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation')
      }
    })
    
    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation')
    })
  }

  // Performance monitoring for UI
  measureRenderTime(componentName: string, renderFunction: () => void) {
    const start = performance.now()
    renderFunction()
    const end = performance.now()
    
    console.log(`[UI Performance] ${componentName}: ${(end - start).toFixed(2)}ms`)
  }

  // Enhanced focus management
  trapFocus(element: HTMLElement) {
    const focusableElements = element.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
    )
    
    const firstFocusable = focusableElements[0] as HTMLElement
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement
    
    element.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            lastFocusable.focus()
            e.preventDefault()
          }
        } else {
          if (document.activeElement === lastFocusable) {
            firstFocusable.focus()
            e.preventDefault()
          }
        }
      }
    })
  }
}

// Global instance
export const uiEnhancer = UIEnhancer.getInstance()

// Initialize on page load
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    uiEnhancer.enhanceKeyboardNavigation()
  })
}