'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Something went wrong!</h2>
          <p className="text-slate-300">We encountered an unexpected error. Please try again.</p>
        </div>
        <Button onClick={reset} className="bg-blue-600 hover:bg-blue-700 text-white">
          Try again
        </Button>
        <div className="mt-4">
          <Button
            onClick={() => (window.location.href = '/')}
            variant="outline"
            className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
          >
            Go to Homepage
          </Button>
        </div>
      </div>
    </div>
  );
}
