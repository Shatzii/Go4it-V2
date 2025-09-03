'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  GitBranch,
  Plus,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  Clock,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  dueDate: string;
}

interface TaskDependency {
  id: string;
  taskId: string;
  dependsOnTaskId: string;
  dependencyType: string;
  createdAt: string;
  dependentTask: {
    id: string;
    title: string;
    status: string;
    priority: string;
  };
}

export function TaskDependencies() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dependencies, setDependencies] = useState<TaskDependency[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState('');

  // New dependency form state
  const [newDependency, setNewDependency] = useState({
    taskId: '',
    dependsOnTaskId: '',
    dependencyType: 'finish_to_start',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tasksRes, depsRes] = await Promise.all([
        fetch('/api/tasks?limit=100'),
        fetch('/api/tasks/dependencies'),
      ]);

      const tasksData = await tasksRes.json();
      const depsData = await depsRes.json();

      setTasks(tasksData.tasks || []);
      setDependencies(depsData || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error('Failed to load task dependencies');
    } finally {
      setLoading(false);
    }
  };

  const createDependency = async () => {
    if (!newDependency.taskId || !newDependency.dependsOnTaskId) {
      toast.error('Please select both tasks');
      return;
    }

    if (newDependency.taskId === newDependency.dependsOnTaskId) {
      toast.error('A task cannot depend on itself');
      return;
    }

    try {
      const response = await fetch('/api/tasks/dependencies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDependency),
      });

      if (response.ok) {
        setShowCreateForm(false);
        setNewDependency({
          taskId: '',
          dependsOnTaskId: '',
          dependencyType: 'finish_to_start',
        });
        fetchData();
        toast.success('Dependency created successfully');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to create dependency');
      }
    } catch (error) {
      console.error('Failed to create dependency:', error);
      toast.error('Failed to create dependency');
    }
  };

  const deleteDependency = async (dependencyId: string) => {
    try {
      const response = await fetch(`/api/tasks/dependencies?id=${dependencyId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchData();
        toast.success('Dependency removed');
      }
    } catch (error) {
      console.error('Failed to delete dependency:', error);
      toast.error('Failed to remove dependency');
    }
  };

  const getTaskById = (id: string) => tasks.find(task => task.id === id);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'backlog': return 'bg-gray-100 text-gray-800';
      case 'blocked': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDependencyTypeLabel = (type: string) => {
    switch (type) {
      case 'finish_to_start': return 'Finish to Start';
      case 'start_to_start': return 'Start to Start';
      case 'finish_to_finish': return 'Finish to Finish';
      case 'start_to_finish': return 'Start to Finish';
      default: return type;
    }
  };

  const canStartTask = (taskId: string) => {
    // Check if all dependencies are completed
    const taskDeps = dependencies.filter(dep => dep.taskId === taskId);
    return taskDeps.every(dep => {
      const dependentTask = getTaskById(dep.dependsOnTaskId);
      return dependentTask?.status === 'completed';
    });
  };

  const getBlockedTasks = () => {
    return tasks.filter(task => {
      if (task.status === 'blocked') return false; // Already blocked
      return !canStartTask(task.id);
    });
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
          <GitBranch className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-bold">Task Dependencies</h2>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Dependency
        </Button>
      </div>

      {/* Blocked Tasks Alert */}
      {getBlockedTasks().length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <h3 className="font-semibold text-yellow-800">Tasks Waiting on Dependencies</h3>
            </div>
            <div className="space-y-2">
              {getBlockedTasks().map((task) => (
                <div key={task.id} className="flex items-center justify-between p-2 bg-white rounded border">
                  <span className="font-medium">{task.title}</span>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    Waiting for dependencies
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Dependency Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create Task Dependency</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Task (depends on another task)</label>
              <Select
                value={newDependency.taskId}
                onValueChange={(value) => setNewDependency({...newDependency, taskId: value})}
              >
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
              <label className="block text-sm font-medium mb-2">Depends On Task</label>
              <Select
                value={newDependency.dependsOnTaskId}
                onValueChange={(value) => setNewDependency({...newDependency, dependsOnTaskId: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select task this depends on" />
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
              <label className="block text-sm font-medium mb-2">Dependency Type</label>
              <Select
                value={newDependency.dependencyType}
                onValueChange={(value) => setNewDependency({...newDependency, dependencyType: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="finish_to_start">Finish to Start (most common)</SelectItem>
                  <SelectItem value="start_to_start">Start to Start</SelectItem>
                  <SelectItem value="finish_to_finish">Finish to Finish</SelectItem>
                  <SelectItem value="start_to_finish">Start to Finish</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button onClick={createDependency} className="flex-1">
                Create Dependency
              </Button>
              <Button onClick={() => setShowCreateForm(false)} variant="outline">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dependencies List */}
      <Card>
        <CardHeader>
          <CardTitle>Task Dependencies</CardTitle>
        </CardHeader>
        <CardContent>
          {dependencies.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <GitBranch className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No task dependencies yet. Create dependencies to manage task relationships.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {dependencies.map((dependency) => {
                const mainTask = getTaskById(dependency.taskId);
                const dependentTask = dependency.dependentTask;

                return (
                  <div key={dependency.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      {/* Dependent Task */}
                      <div className="text-center">
                        <div className="w-24 p-2 border rounded bg-gray-50">
                          <div className="text-xs text-gray-500 mb-1">Depends On</div>
                          <div className="font-medium text-sm">{dependentTask.title}</div>
                          <Badge className={`mt-1 ${getStatusColor(dependentTask.status)}`}>
                            {dependentTask.status}
                          </Badge>
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className="flex flex-col items-center">
                        <ArrowRight className="w-6 h-6 text-gray-400" />
                        <div className="text-xs text-gray-500 mt-1">
                          {getDependencyTypeLabel(dependency.dependencyType)}
                        </div>
                      </div>

                      {/* Main Task */}
                      <div className="text-center">
                        <div className="w-24 p-2 border rounded bg-blue-50">
                          <div className="text-xs text-gray-500 mb-1">Task</div>
                          <div className="font-medium text-sm">{mainTask?.title}</div>
                          <Badge className={`mt-1 ${getStatusColor(mainTask?.status || 'unknown')}`}>
                            {mainTask?.status}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {canStartTask(dependency.taskId) ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Ready
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          <Clock className="w-3 h-3 mr-1" />
                          Waiting
                        </Badge>
                      )}

                      <Button
                        onClick={() => deleteDependency(dependency.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dependency Graph Visualization Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Dependency Graph</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <GitBranch className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Interactive dependency graph visualization coming soon.</p>
            <p className="text-sm mt-2">This will show a visual representation of all task relationships.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
