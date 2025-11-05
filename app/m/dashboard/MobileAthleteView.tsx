/**
 * Mobile Athlete Dashboard Client Component
 * 
 * Mobile-first UI for athletes to view and manage their training
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, Play, Award, TrendingUp, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface Assignment {
  id: string;
  drillId: string;
  dueDate?: Date;
  priority: string;
  status: string;
  drill?: {
    title: string;
    sport: string;
    category: string;
    duration?: number;
    xpReward: number;
  };
}

interface MobileAthleteViewProps {
  userId: string;
  assignments: Assignment[];
  completedCount: number;
  totalAssigned: number;
  dueTodayCount: number;
  weeklyXP: number;
}

export default function MobileAthleteView({
  userId,
  assignments,
  completedCount,
  totalAssigned,
  dueTodayCount,
  weeklyXP,
}: MobileAthleteViewProps) {
  const [activeTab, setActiveTab] = useState<'today' | 'all'>('today');

  const todayAssignments = assignments.filter(a => {
    const dueDate = a.dueDate ? new Date(a.dueDate) : null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return dueDate && dueDate >= today && dueDate < tomorrow;
  });

  const displayedAssignments = activeTab === 'today' ? todayAssignments : assignments;
  const completionRate = totalAssigned > 0 ? (completedCount / (completedCount + totalAssigned)) * 100 : 0;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-6 pb-8 rounded-b-3xl">
        <h1 className="text-2xl font-bold mb-2">My Training</h1>
        <p className="text-primary-foreground/80">Keep grinding! 💪</p>
      </header>

      {/* Stats Grid */}
      <div className="px-4 -mt-6 mb-6 grid grid-cols-2 gap-3">
        <Card className="shadow-lg">
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <Badge variant="secondary">{completedCount}</Badge>
            </div>
            <p className="text-xs text-muted-foreground">Completed This Week</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center justify-between mb-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <Badge variant="secondary">{dueTodayCount}</Badge>
            </div>
            <p className="text-xs text-muted-foreground">Due Today</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center justify-between mb-2">
              <Award className="h-5 w-5 text-yellow-500" />
              <Badge variant="secondary">+{weeklyXP}</Badge>
            </div>
            <p className="text-xs text-muted-foreground">XP This Week</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              <Badge variant="secondary">{Math.round(completionRate)}%</Badge>
            </div>
            <p className="text-xs text-muted-foreground">Completion Rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-2 gap-3">
          <Link href="/m/drills">
            <Button variant="outline" className="w-full h-16">
              <div className="text-center">
                <Calendar className="h-5 w-5 mx-auto mb-1" />
                <span className="text-xs">Browse Drills</span>
              </div>
            </Button>
          </Link>
          
          <Link href="/starpath">
            <Button variant="outline" className="w-full h-16">
              <div className="text-center">
                <TrendingUp className="h-5 w-5 mx-auto mb-1" />
                <span className="text-xs">My StarPath</span>
              </div>
            </Button>
          </Link>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="px-4 mb-4">
        <div className="flex gap-2 p-1 bg-muted rounded-lg">
          <button
            onClick={() => setActiveTab('today')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'today'
                ? 'bg-background shadow-sm'
                : 'text-muted-foreground'
            }`}
          >
            Today ({dueTodayCount})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'all'
                ? 'bg-background shadow-sm'
                : 'text-muted-foreground'
            }`}
          >
            All ({totalAssigned})
          </button>
        </div>
      </div>

      {/* Assignment List */}
      <div className="px-4 space-y-3">
        {displayedAssignments.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">
                {activeTab === 'today' 
                  ? "No drills due today. You're all caught up! 🎉"
                  : "No assignments yet. Check back soon!"}
              </p>
              <Link href="/m/drills">
                <Button variant="outline">
                  Browse Drill Library
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          displayedAssignments.map(assignment => (
            <Card key={assignment.id} className="shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1 line-clamp-2">
                      {assignment.drill?.title || 'Untitled Drill'}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {assignment.drill?.sport}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {assignment.drill?.category}
                      </Badge>
                      {assignment.priority === 'high' && (
                        <Badge variant="destructive" className="text-xs">
                          High Priority
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                  {assignment.drill?.duration && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{assignment.drill.duration} min</span>
                    </div>
                  )}
                  {assignment.drill?.xpReward && (
                    <div className="flex items-center gap-1">
                      <Award className="h-4 w-4 text-yellow-500" />
                      <span>+{assignment.drill.xpReward} XP</span>
                    </div>
                  )}
                  {assignment.dueDate && (
                    <span className="text-xs">
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>

                <Link href={`/m/workout?assignmentId=${assignment.id}`}>
                  <Button className="w-full">
                    <Play className="h-4 w-4 mr-2" />
                    Start Drill
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Bottom Navigation Spacer */}
      <div className="h-20" />

      {/* Bottom Navigation (fixed) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border">
        <div className="grid grid-cols-4 h-16">
          <Link href="/m/dashboard" className="flex flex-col items-center justify-center text-primary">
            <Calendar className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">Training</span>
          </Link>
          <Link href="/m/drills" className="flex flex-col items-center justify-center text-muted-foreground hover:text-foreground">
            <Play className="h-5 w-5 mb-1" />
            <span className="text-xs">Drills</span>
          </Link>
          <Link href="/starpath" className="flex flex-col items-center justify-center text-muted-foreground hover:text-foreground">
            <TrendingUp className="h-5 w-5 mb-1" />
            <span className="text-xs">Progress</span>
          </Link>
          <Link href="/dashboard" className="flex flex-col items-center justify-center text-muted-foreground hover:text-foreground">
            <Award className="h-5 w-5 mb-1" />
            <span className="text-xs">Dashboard</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
