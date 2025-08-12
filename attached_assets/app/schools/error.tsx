'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Home, RefreshCw, AlertTriangle } from 'lucide-react';

export default function SchoolsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Schools section error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <div className="text-center p-8 max-w-md">
        <AlertTriangle className="h-16 w-16 text-yellow-400 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-white mb-4">Something went wrong</h2>
        <p className="text-white/80 mb-6">
          We encountered an error while loading this school page. This has been logged and we're working to fix it.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => reset()} className="bg-blue-600 hover:bg-blue-700">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Button 
            onClick={() => window.location.href = '/'} 
            variant="outline" 
            className="border-gray-400 text-gray-300 hover:bg-gray-400 hover:text-black"
          >
            <Home className="mr-2 h-4 w-4" />
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}