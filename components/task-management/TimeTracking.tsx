'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Play,
  Pause,
  Square,
  Clock,
  Calendar,
  DollarSign,
  BarChart3,
  Timer,
  Plus,
} from 'lucide-react';
import { toast } from 'sonner';

interface TimeEntry {
  id: string;
  taskId: string;
  projectId: string;
  startTime: string;
  endTime: string | null;
  duration: number;
  description: string;
  isBillable: boolean;
  task: {
    id: string;
    title: string;
    status: string;
  };
  project: {
    id: string;
    title: string;
    type: string;
  };
}

interface Task {
  id: string;
  title: string;
  projectId: string;
  status: string;
}

export function TimeTracking() {
  const [activeTimer, setActiveTimer] = useState<TimeEntry | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewEntry, setShowNewEntry] = useState(false);

  // New entry form state
  const [newEntry, setNewEntry] = useState({
    taskId: '',
    projectId: '',
    description: '',
    isBillable: false,
    startTime: '',
    endTime: '',
    duration: '',
  });

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      if (activeTimer) {
        setCurrentTime(Date.now() - new Date(activeTimer.startTime).getTime());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTimer]);

  const fetchData = async () => {
    try {
      const [entriesRes, tasksRes, projectsRes] = await Promise.all([
        fetch('/api/time-tracking'),
        fetch('/api/tasks?limit=100'),
        fetch('/api/projects'),
      ]);

      const entriesData = await entriesRes.json();
      const tasksData = await tasksRes.json();
      const projectsData = await projectsRes.json();

      setTimeEntries(entriesData.entries || []);
      setTasks(tasksData.tasks || []);
      setProjects(projectsData || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error('Failed to load time tracking data');
    } finally {
      setLoading(false);
    }
  };

  const startTimer = async (taskId: string, projectId: string) => {
    try {
      const response = await fetch('/api/time-tracking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskId,
          projectId,
          startTime: new Date().toISOString(),
          description: `Working on task: ${tasks.find(t => t.id === taskId)?.title}`,
          isBillable: false,
        }),
      });

      if (response.ok) {
        const entry = await response.json();
        setActiveTimer(entry);
        toast.success('Timer started');
      }
    } catch (error) {
      console.error('Failed to start timer:', error);
      toast.error('Failed to start timer');
    }
  };

  const stopTimer = async () => {
    if (!activeTimer) return;

    try {
      const endTime = new Date().toISOString();
      const duration = Math.round((new Date(endTime).getTime() - new Date(activeTimer.startTime).getTime()) / (1000 * 60));

      const response = await fetch('/api/time-tracking', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endTime,
          duration,
        }),
      });

      if (response.ok) {
        setActiveTimer(null);
        setCurrentTime(0);
        fetchData(); // Refresh data
        toast.success('Timer stopped');
      }
    } catch (error) {
      console.error('Failed to stop timer:', error);
      toast.error('Failed to stop timer');
    }
  };

  const createManualEntry = async () => {
    try {
      const response = await fetch('/api/time-tracking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskId: newEntry.taskId,
          projectId: newEntry.projectId,
          startTime: newEntry.startTime,
          endTime: newEntry.endTime,
          duration: parseInt(newEntry.duration),
          description: newEntry.description,
          isBillable: newEntry.isBillable,
        }),
      });

      if (response.ok) {
        setShowNewEntry(false);
        setNewEntry({
          taskId: '',
          projectId: '',
          description: '',
          isBillable: false,
          startTime: '',
          endTime: '',
          duration: '',
        });
        fetchData();
        toast.success('Time entry created');
      }
    } catch (error) {
      console.error('Failed to create time entry:', error);
      toast.error('Failed to create time entry');
    }
  };

  const formatDuration = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDurationMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold">Time Tracking</h2>
        </div>
        <Button onClick={() => setShowNewEntry(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Manual Entry
        </Button>
      </div>

      {/* Active Timer */}
      {activeTimer && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-green-800">Timer Running</h3>
                <p className="text-green-600">{activeTimer.task.title}</p>
                <div className="text-2xl font-mono font-bold text-green-800 mt-2">
                  {formatDuration(currentTime)}
                </div>
              </div>
              <Button onClick={stopTimer} variant="destructive">
                <Square className="w-4 h-4 mr-2" />
                Stop Timer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Start Timer */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Start Timer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.slice(0, 6).map((task) => (
              <div key={task.id} className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">{task.title}</h4>
                <Badge className={`mb-3 ${
                  task.status === 'completed' ? 'bg-green-100 text-green-800' :
                  task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {task.status}
                </Badge>
                <Button
                  onClick={() => startTimer(task.id, task.projectId)}
                  disabled={!!activeTimer}
                  className="w-full"
                  size="sm"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Timer
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Manual Entry Form */}
      {showNewEntry && (
        <Card>
          <CardHeader>
            <CardTitle>Add Manual Time Entry</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Task</label>
                <Select value={newEntry.taskId} onValueChange={(value) => setNewEntry({...newEntry, taskId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select task" />
                  </SelectTrigger>
                  <SelectContent>
                    {tasks.map((task) => (
                      <SelectItem key={task.id} value={task.id}>
                        {task.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Project</label>
                <Select value={newEntry.projectId} onValueChange={(value) => setNewEntry({...newEntry, projectId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Start Time</label>
                <Input
                  type="datetime-local"
                  value={newEntry.startTime}
                  onChange={(e) => setNewEntry({...newEntry, startTime: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">End Time</label>
                <Input
                  type="datetime-local"
                  value={newEntry.endTime}
                  onChange={(e) => setNewEntry({...newEntry, endTime: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
              <Input
                type="number"
                value={newEntry.duration}
                onChange={(e) => setNewEntry({...newEntry, duration: e.target.value})}
                placeholder="Enter duration in minutes"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                value={newEntry.description}
                onChange={(e) => setNewEntry({...newEntry, description: e.target.value})}
                placeholder="What did you work on?"
                rows={3}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isBillable"
                checked={newEntry.isBillable}
                onChange={(e) => setNewEntry({...newEntry, isBillable: e.target.checked})}
                className="w-4 h-4"
              />
              <label htmlFor="isBillable" className="text-sm">Billable time</label>
            </div>

            <div className="flex gap-2">
              <Button onClick={createManualEntry} className="flex-1">
                Create Entry
              </Button>
              <Button onClick={() => setShowNewEntry(false)} variant="outline">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Time Entries List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Time Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {timeEntries.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{entry.task.title}</h4>
                    {entry.isBillable && (
                      <Badge className="bg-green-100 text-green-800">
                        <DollarSign className="w-3 h-3 mr-1" />
                        Billable
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{entry.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(entry.startTime).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(entry.startTime).toLocaleTimeString()} - {entry.endTime ? new Date(entry.endTime).toLocaleTimeString() : 'Running'}
                    </div>
                    <div className="flex items-center gap-1">
                      <Timer className="w-3 h-3" />
                      {formatDurationMinutes(entry.duration)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">
                    {formatDurationMinutes(entry.duration)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {entry.project.title}
                  </div>
                </div>
              </div>
            ))}

            {timeEntries.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No time entries yet. Start tracking your work!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
