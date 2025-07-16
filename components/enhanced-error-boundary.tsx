'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react'
// import { SmoothTransition, FadeInUp } from './smooth-transitions'

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
  retryCount: number
}

export class EnhancedErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimer?: NodeJS.Timeout

  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      retryCount: 0
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Enhanced Error Boundary caught an error:', error, errorInfo)
    
    this.setState({
      errorInfo
    })

    // Call custom error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // Report to error monitoring service
    this.reportError(error, errorInfo)
  }

  private reportError = (error: Error, errorInfo: React.ErrorInfo) => {
    // In a real app, you would send this to an error monitoring service
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      retryCount: this.state.retryCount
    }

    console.error('Error Report:', errorReport)
    
    // You could send this to services like Sentry, LogRocket, etc.
    // Example: Sentry.captureException(error, { extra: errorReport })
  }

  private handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      retryCount: prevState.retryCount + 1
    }))
  }

  private handleGoHome = () => {
    window.location.href = '/'
  }

  private handleReportBug = () => {
    const { error, errorInfo } = this.state
    const subject = `Bug Report: ${error?.message || 'Unknown Error'}`
    const body = `Error Details:
${error?.stack || 'No stack trace available'}

Component Stack:
${errorInfo?.componentStack || 'No component stack available'}

Steps to Reproduce:
1. 
2. 
3. 

Additional Information:
- URL: ${window.location.href}
- User Agent: ${navigator.userAgent}
- Timestamp: ${new Date().toISOString()}
`

    const mailtoLink = `mailto:support@go4itsports.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.open(mailtoLink)
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      const { error, retryCount } = this.state
      const isNetworkError = error?.message?.includes('fetch') || error?.message?.includes('network')
      const isChunkError = error?.message?.includes('chunk') || error?.message?.includes('Loading')
      const maxRetries = 3

      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
          <Card className="bg-slate-800 border-slate-700 max-w-2xl w-full">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-400">
                <AlertTriangle className="w-6 h-6" />
                <span>Something went wrong</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-slate-300">
                {isNetworkError ? (
                  <div>
                    <p className="mb-2">A network error occurred. Please check your connection and try again.</p>
                    <p className="text-sm text-slate-400">
                      This might be due to a temporary connectivity issue or server maintenance.
                    </p>
                  </div>
                ) : isChunkError ? (
                  <div>
                    <p className="mb-2">A loading error occurred. This usually resolves with a page refresh.</p>
                    <p className="text-sm text-slate-400">
                      This can happen when the application is updated while you're using it.
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="mb-2">An unexpected error occurred in the application.</p>
                    <p className="text-sm text-slate-400">
                      {error?.message || 'Unknown error'}
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-slate-700 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">What you can do:</h4>
                <ul className="space-y-1 text-sm text-slate-300">
                  <li>• Try refreshing the page or clicking "Try Again" below</li>
                  <li>• Check your internet connection</li>
                  <li>• Clear your browser cache and cookies</li>
                  <li>• Try again in a few minutes</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={this.handleRetry}
                  disabled={retryCount >= maxRetries}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again {retryCount > 0 && `(${retryCount}/${maxRetries})`}
                </Button>
                
                <Button
                  onClick={this.handleGoHome}
                  variant="outline"
                  className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go to Homepage
                </Button>
              </div>

              <div className="border-t border-slate-600 pt-4">
                <Button
                  onClick={this.handleReportBug}
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-slate-300"
                >
                  <Bug className="w-4 h-4 mr-2" />
                  Report this issue
                </Button>
              </div>

              {process.env.NODE_ENV === 'development' && (
                <details className="bg-slate-700 rounded-lg p-4">
                  <summary className="cursor-pointer text-sm font-semibold text-slate-300 mb-2">
                    Developer Information
                  </summary>
                  <div className="text-xs text-slate-400 space-y-2">
                    <div>
                      <strong>Error:</strong> {error?.message}
                    </div>
                    <div>
                      <strong>Stack:</strong>
                      <pre className="mt-1 overflow-x-auto whitespace-pre-wrap">
                        {error?.stack}
                      </pre>
                    </div>
                    {this.state.errorInfo && (
                      <div>
                        <strong>Component Stack:</strong>
                        <pre className="mt-1 overflow-x-auto whitespace-pre-wrap">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

// HOC for easier usage
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  return function WrappedComponent(props: P) {
    return (
      <EnhancedErrorBoundary {...errorBoundaryProps}>
        <Component {...props} />
      </EnhancedErrorBoundary>
    )
  }
}

// Simple error fallback component
export function SimpleErrorFallback({ error, retry }: { error: Error; retry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <AlertTriangle className="w-12 h-12 text-red-400 mb-4" />
      <h2 className="text-xl font-semibold text-white mb-2">Something went wrong</h2>
      <p className="text-slate-400 mb-4">{error.message}</p>
      <Button onClick={retry} className="bg-blue-600 hover:bg-blue-700 text-white">
        Try Again
      </Button>
    </div>
  )
}