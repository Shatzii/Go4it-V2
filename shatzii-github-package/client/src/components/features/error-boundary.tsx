import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });
    
    // Log error to analytics
    if (typeof window !== 'undefined') {
      fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          userAgent: navigator.userAgent
        })
      }).catch(() => {
        // Silently fail if error logging fails
      });
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-slate-900/95 backdrop-blur-xl border-red-500/20">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <AlertTriangle className="h-12 w-12 text-red-400" />
              </div>
              <CardTitle className="text-red-400">Something went wrong</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-300 text-center">
                We encountered an unexpected error. The development team has been notified.
              </p>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="bg-slate-800/50 rounded-lg p-3">
                  <summary className="text-xs text-slate-400 cursor-pointer">
                    Error Details
                  </summary>
                  <pre className="text-xs text-red-300 mt-2 overflow-auto">
                    {this.state.error.message}
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
              
              <div className="flex gap-2">
                <Button 
                  onClick={this.handleReload}
                  className="flex-1 bg-cyan-600 hover:bg-cyan-700"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reload Page
                </Button>
                <Button 
                  onClick={this.handleGoHome}
                  variant="outline"
                  className="flex-1 border-cyan-500/20 text-slate-300 hover:bg-slate-800/50"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}