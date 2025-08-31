'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home, Bug, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
}

export class ErrorBoundaryEnhanced extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to monitoring service
    this.logError(error, errorInfo);

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private logError(error: Error, errorInfo: ErrorInfo) {
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
      url: typeof window !== 'undefined' ? window.location.href : 'server',
    };

    console.error('ErrorBoundary caught an error:', errorData);

    // In production, you would send this to your error monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to error monitoring service
      // errorMonitoringService.captureException(error, errorData);
    }
  }

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    });
  };

  private handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  private handleGoHome = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  private toggleDetails = () => {
    this.setState((prev) => ({ showDetails: !prev.showDetails }));
  };

  private getErrorCategory(error: Error): string {
    if (error.message.includes('ChunkLoadError') || error.message.includes('Loading chunk')) {
      return 'network';
    }
    if (error.message.includes('fetch')) {
      return 'api';
    }
    if (error.stack?.includes('React')) {
      return 'component';
    }
    return 'unknown';
  }

  private getErrorSuggestion(category: string): string {
    switch (category) {
      case 'network':
        return 'This looks like a network issue. Try refreshing the page or check your internet connection.';
      case 'api':
        return 'There was a problem connecting to our servers. Please try again in a moment.';
      case 'component':
        return 'A component failed to render properly. Try refreshing the page.';
      default:
        return 'An unexpected error occurred. Please try refreshing the page.';
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const errorCategory = this.state.error ? this.getErrorCategory(this.state.error) : 'unknown';
      const suggestion = this.getErrorSuggestion(errorCategory);

      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl bg-slate-800 border-slate-700">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-red-400" />
                </div>
              </div>
              <CardTitle className="text-2xl text-white">Something went wrong</CardTitle>
              <p className="text-slate-400 mt-2">
                We're sorry for the inconvenience. An error occurred while loading this page.
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Bug className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-white mb-1">What happened?</h3>
                    <p className="text-sm text-slate-300">{suggestion}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={this.handleRetry} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Button
                  onClick={this.handleReload}
                  variant="outline"
                  className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reload Page
                </Button>
                <Button
                  onClick={this.handleGoHome}
                  variant="outline"
                  className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Button>
              </div>

              {/* Error Details (collapsible) */}
              <div className="border-t border-slate-600 pt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={this.toggleDetails}
                  className="text-slate-400 hover:text-slate-300"
                >
                  {this.state.showDetails ? (
                    <>
                      <ChevronUp className="w-4 h-4 mr-2" />
                      Hide Details
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4 mr-2" />
                      Show Technical Details
                    </>
                  )}
                </Button>

                {this.state.showDetails && (
                  <div className="mt-4 space-y-4">
                    {this.state.error && (
                      <div>
                        <h4 className="text-sm font-medium text-slate-300 mb-2">Error Message:</h4>
                        <pre className="text-xs bg-slate-900 border border-slate-600 rounded p-3 overflow-x-auto text-red-400">
                          {this.state.error.message}
                        </pre>
                      </div>
                    )}

                    {this.state.error?.stack && (
                      <div>
                        <h4 className="text-sm font-medium text-slate-300 mb-2">Stack Trace:</h4>
                        <pre className="text-xs bg-slate-900 border border-slate-600 rounded p-3 overflow-x-auto text-slate-400 max-h-48 overflow-y-auto">
                          {this.state.error.stack}
                        </pre>
                      </div>
                    )}

                    {this.state.errorInfo?.componentStack && (
                      <div>
                        <h4 className="text-sm font-medium text-slate-300 mb-2">
                          Component Stack:
                        </h4>
                        <pre className="text-xs bg-slate-900 border border-slate-600 rounded p-3 overflow-x-auto text-slate-400 max-h-48 overflow-y-auto">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="text-center text-sm text-slate-500">
                If this problem persists, please contact support with the error details above.
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// HOC for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode,
) {
  return function WrappedComponent(props: P) {
    return (
      <ErrorBoundaryEnhanced fallback={fallback}>
        <Component {...props} />
      </ErrorBoundaryEnhanced>
    );
  };
}

// Async error boundary for handling promise rejections
export function AsyncErrorBoundary({ children }: { children: ReactNode }) {
  React.useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      // You could trigger error boundary or show notification
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return <>{children}</>;
}
