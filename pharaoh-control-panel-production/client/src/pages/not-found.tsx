import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

const NotFound: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-6 text-center">
      <div className="rounded-lg border border-slate-800 bg-slate-900 p-8 shadow-lg max-w-md w-full">
        <h1 className="mb-2 text-4xl font-bold text-white">404</h1>
        <h2 className="mb-6 text-2xl font-semibold text-slate-300">Page Not Found</h2>
        <p className="mb-8 text-slate-400">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/">
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800">
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;