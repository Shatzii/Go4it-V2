'use client';

interface LoadingFallbackProps {
  message?: string;
}

export function LoadingFallback({
  message = 'Loading your athlete dashboard...',
}: LoadingFallbackProps) {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400 mx-auto mb-4"></div>
        <p className="text-white text-lg">{message}</p>
        <div className="mt-4 text-slate-400 text-sm">Initializing student athlete features...</div>
      </div>
    </div>
  );
}

export default LoadingFallback;
