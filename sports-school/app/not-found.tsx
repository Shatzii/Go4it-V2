'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, Search, BookOpen } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-400 text-center">
            <Search className="w-6 h-6" />
            Page Not Found
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="text-6xl font-bold text-blue-300">404</div>

          <p className="text-blue-200">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <div className="bg-blue-900/20 p-3 rounded-lg">
            <p className="text-sm text-blue-200">
              You might want to check the URL or navigate to one of our schools:
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <Link href="/schools/primary">
              <Button variant="outline" size="sm" className="w-full">
                <BookOpen className="w-4 h-4 mr-1" />
                Primary
              </Button>
            </Link>
            <Link href="/schools/secondary">
              <Button variant="outline" size="sm" className="w-full">
                <BookOpen className="w-4 h-4 mr-1" />
                Secondary
              </Button>
            </Link>
            <Link href="/schools/law">
              <Button variant="outline" size="sm" className="w-full">
                <BookOpen className="w-4 h-4 mr-1" />
                Law
              </Button>
            </Link>
            <Link href="/schools/language">
              <Button variant="outline" size="sm" className="w-full">
                <BookOpen className="w-4 h-4 mr-1" />
                Language
              </Button>
            </Link>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => window.history.back()}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
            <Link href="/" className="flex-1">
              <Button className="w-full bg-purple-600 hover:bg-purple-700" size="sm">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
