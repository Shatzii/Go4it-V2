'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Trophy, Target, Users, Calendar, PlayCircle } from 'lucide-react';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function Go4itSportsAcademy() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white drop-shadow-2xl">
                Go4it Sports Academy
              </h1>
              <p className="text-xl md:text-2xl text-white mb-8 max-w-4xl mx-auto font-medium drop-shadow-lg">
                Train Global. Learn Local. Dominate Everywhere.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Join the Waitlist
                </Button>
                <Button size="lg" variant="outline" className="border-green-400 text-green-400 hover:bg-green-400 hover:text-black">
                  <Trophy className="mr-2 h-5 w-5" />
                  Explore Programs
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </ErrorBoundary>
  );
}