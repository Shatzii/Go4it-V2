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
    console.error('Go4it Sports Academy Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-white mb-4">Something went wrong</h2>
        <p className="text-white/70 mb-6">We're working on fixing this issue</p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => reset()} className="bg-blue-600 hover:bg-blue-700">
            Try Again
          </Button>
          <Button
            onClick={() => (window.location.href = '/schools')}
            variant="outline"
            className="border-gray-400 text-gray-300"
          >
            Go to Schools
          </Button>
        </div>
      </div>
    </div>
  );
}
