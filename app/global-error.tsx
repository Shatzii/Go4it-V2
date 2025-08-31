'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-slate-800 rounded-lg p-6 text-center">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-white mb-2">Something went wrong!</h2>
              <p className="text-slate-300 text-sm">
                An error occurred while loading this page. Our team has been notified.
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <div className="mb-4 p-3 bg-red-900/20 border border-red-700 rounded text-left">
                <p className="text-red-300 text-xs font-mono">{error.message}</p>
                {error.digest && (
                  <p className="text-red-400 text-xs mt-2">Error ID: {error.digest}</p>
                )}
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={reset}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
              >
                Try again
              </button>

              <button
                onClick={() => (window.location.href = '/')}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white font-medium py-2 px-4 rounded transition-colors"
              >
                Go to Homepage
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
