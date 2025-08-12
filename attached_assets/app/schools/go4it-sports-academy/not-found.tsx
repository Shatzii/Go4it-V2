import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <div className="text-center p-8">
        <div className="text-6xl mb-8">🏈</div>
        <h1 className="text-4xl font-bold text-white mb-4">Page Not Found</h1>
        <p className="text-white/70 mb-8">The Go4it Sports Academy page you're looking for doesn't exist.</p>
        <div className="flex gap-4 justify-center">
          <Link href="/schools">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Home className="mr-2 h-4 w-4" />
              Back to Schools
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="border-gray-400 text-gray-300">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}