'use client';

import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to console for debugging
    console.error('Global Error Boundary caught an error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900 flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-gradient-to-r from-red-500/20 to-pink-500/20 border-red-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-400">
            <AlertTriangle className="w-6 h-6" />
            Something went wrong!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-red-300">
            An unexpected error occurred while loading this page. This might be a temporary issue.
          </p>
          
          <div className="bg-red-900/20 p-3 rounded-lg">
            <p className="text-xs text-red-200 font-mono">
              Error: {error.message || 'Unknown error'}
            </p>
            {error.digest && (
              <p className="text-xs text-red-200 font-mono mt-1">
                Digest: {error.digest}
              </p>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={reset}
              className="flex-1 bg-red-600 hover:bg-red-700"
              size="sm"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button 
              onClick={() => window.location.href = '/'}
              className="flex-1 bg-gray-600 hover:bg-gray-700"
              size="sm"
              variant="outline"
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}