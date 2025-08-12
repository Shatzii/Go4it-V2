'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Target, Users, Calendar } from 'lucide-react';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function Go4itSportsAcademy() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <section className="py-16 px-4">
          <div className="container mx-auto text-center">
            <div className="mb-8">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
                Go4it Sports Academy
              </h1>
              <p className="text-xl md:text-2xl text-white mb-8 max-w-4xl mx-auto">
                Train Global. Learn Local. Dominate Everywhere.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-xl text-blue-400 flex items-center gap-2">
                    <Trophy className="h-6 w-6" />
                    Elite Training
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    World-class athletic training programs designed for champions.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-xl text-green-400 flex items-center gap-2">
                    <Target className="h-6 w-6" />
                    Academic Excellence
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    Comprehensive education programs supporting athletic development.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                Learn More
              </Button>
            </div>
          </div>
        </section>
      </div>
    </ErrorBoundary>
  );
}