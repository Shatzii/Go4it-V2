'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, AlertCircle, Calendar } from 'lucide-react';

// Define TypeScript interfaces based on our DB schema
interface User {
  id: string;
  firstName: string | null;
  lastName: string | null;
  location: string | null;
}

interface Task {
  id: string;
  title: string;
  status: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: string | null; // ISO string
}

interface Event {
  id: string;
  title: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  type: string;
}

export default function PersonalDailyDigest() {
  const [user, setUser] = useState<User | null>(null);
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const [todaysEvents, setTodaysEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be a single API call to your endpoint
        // that aggregates all this data for the logged-in user.
        const [userRes, tasksRes, eventsRes] = await Promise.all([
          fetch('/api/user/me'),
          fetch('/api/tasks?view=today'),
          fetch('/api/events?view=today')
        ]);

        const userData = await userRes.json();
        const tasksData = await tasksRes.json();
        const eventsData = await eventsRes.json();

        setUser(userData);
        setTodayTasks(tasksData);
        setTodaysEvents(eventsData);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  if (isLoading) {
    return <div>Loading your personalized digest...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <Card>
        <CardContent className="pt-6">
          <h1 className="text-3xl font-bold">
            Good morning, {user?.firstName || 'Team Member'}!{' '}
            <span className="text-2xl text-muted-foreground">👋</span>
          </h1>
          <p className="text-muted-foreground">
            Here's your priorities for today in {user?.location || 'your location'}.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Today's Top Tasks Card */}
        <Card className="md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-semibold">Your Top Tasks</CardTitle>
            <Badge variant="outline">{todayTasks.length}</Badge>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {todayTasks.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No tasks due today. Enjoy the focus time!</p>
              ) : (
                todayTasks.map((task) => (
                  <li key={task.id} className="flex items-center justify-between gap-2 p-2 border rounded-md">
                    <div className="flex items-center gap-3">
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <CheckCircle2 className="h-4 w-4" />
                      </Button>
                      <span className="text-sm font-medium">{task.title}</span>
                    </div>
                    <Badge variant={getPriorityVariant(task.priority)} className="ml-2">
                      {task.priority}
                    </Badge>
                  </li>
                ))
              )}
            </ul>
          </CardContent>
        </Card>

        {/* Today's Schedule Card */}
        <Card className="md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-semibold">Today's Schedule</CardTitle>
            <Calendar className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {todaysEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No events scheduled. Focus on deep work.</p>
              ) : (
                todaysEvents.map((event) => (
                  <li key={event.id} className="flex items-start gap-3 p-2 border rounded-md">
                    <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{event.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {' '}
                        {new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Card */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">12</p>
              <p className="text-xs text-muted-foreground">Tasks Closed</p>
            </div>
            <div>
              <p className="text-2xl font-bold">7</p>
              <p className="text-xs text-muted-foreground">Calls Made</p>
            </div>
            <div>
              <p className="text-2xl font-bold">2</p>
              <p className="text-xs text-muted-foreground">Meetings</p>
            </div>
            <div>
              <p className="text-2xl font-bold">98%</p>
              <p className="text-xs text-muted-foreground">On Time</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
