'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Zap,
  Plus,
  Play,
  Settings,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  triggerType: string;
  triggerConditions: any;
  actions: any[];
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export function WorkflowAutomation() {
  const [workflows, setWorkflows] = useState<WorkflowTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowTemplate | null>(null);

  // New workflow form state
  const [newWorkflow, setNewWorkflow] = useState({
    name: '',
    description: '',
    triggerType: 'task.status_changed',
    triggerConditions: {},
    actions: [],
    isActive: true,
  });

  // Current action being added
  const [currentAction, setCurrentAction] = useState({
    type: 'create_task',
    title: '',
    description: '',
    status: 'backlog',
    priority: 'medium',
    projectId: '',
    assignedTo: '',
    tags: [],
  });

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    try {
      const response = await fetch('/api/workflows');
      const data = await response.json();
      setWorkflows(data || []);
    } catch (error) {
      console.error('Failed to fetch workflows:', error);
      toast.error('Failed to load workflows');
    } finally {
      setLoading(false);
    }
  };

  const createWorkflow = async () => {
    if (!newWorkflow.name || !newWorkflow.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch('/api/workflows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newWorkflow),
      });

      if (response.ok) {
        setShowCreateForm(false);
        setNewWorkflow({
          name: '',
          description: '',
          triggerType: 'task.status_changed',
          triggerConditions: {},
          actions: [],
          isActive: true,
        });
        fetchWorkflows();
        toast.success('Workflow created successfully');
      }
    } catch (error) {
      console.error('Failed to create workflow:', error);
      toast.error('Failed to create workflow');
    }
  };

  const executeWorkflow = async (workflowId: string) => {
    try {
      const response = await fetch('/api/workflows', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          triggerData: {
            // Mock trigger data for testing
            taskId: 'test-task-id',
            projectId: 'test-project-id',
            userId: 'test-user-id',
            status: 'completed',
          },
        }),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(`Workflow executed: ${result.actionsExecuted} actions performed`);
      }
    } catch (error) {
      console.error('Failed to execute workflow:', error);
      toast.error('Failed to execute workflow');
    }
  };

  const addAction = () => {
    if (!currentAction.title && currentAction.type === 'create_task') {
      toast.error('Please fill in the task title');
      return;
    }

    setNewWorkflow({
      ...newWorkflow,
      actions: [...newWorkflow.actions, { ...currentAction }],
    });

    setCurrentAction({
      type: 'create_task',
      title: '',
      description: '',
      status: 'backlog',
      priority: 'medium',
      projectId: '',
      assignedTo: '',
      tags: [],
    });
  };

  const removeAction = (index: number) => {
    setNewWorkflow({
      ...newWorkflow,
      actions: newWorkflow.actions.filter((_, i) => i !== index),
    });
  };

  const getTriggerTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      'task.created': 'Task Created',
      'task.status_changed': 'Task Status Changed',
      'task.due_date_approaching': 'Due Date Approaching',
      'project.created': 'Project Created',
      'time_entry.created': 'Time Entry Created',
      'user.joined': 'User Joined',
    };
    return labels[type] || type;
  };

  const getActionTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      'create_task': 'Create Task',
      'update_task': 'Update Task',
      'send_notification': 'Send Notification',
      'update_project': 'Update Project',
    };
    return labels[type] || type;
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
          <Zap className="w-6 h-6 text-orange-600" />
          <h2 className="text-2xl font-bold">Workflow Automation</h2>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Workflow
        </Button>
      </div>

      {/* Create Workflow Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create Workflow</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Workflow Name</label>
                <Input
                  value={newWorkflow.name}
                  onChange={(e) => setNewWorkflow({...newWorkflow, name: e.target.value})}
                  placeholder="e.g., Auto-assign review task"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Trigger Type</label>
                <Select
                  value={newWorkflow.triggerType}
                  onValueChange={(value) => setNewWorkflow({...newWorkflow, triggerType: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="task.created">Task Created</SelectItem>
                    <SelectItem value="task.status_changed">Task Status Changed</SelectItem>
                    <SelectItem value="task.due_date_approaching">Due Date Approaching</SelectItem>
                    <SelectItem value="project.created">Project Created</SelectItem>
                    <SelectItem value="time_entry.created">Time Entry Created</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                value={newWorkflow.description}
                onChange={(e) => setNewWorkflow({...newWorkflow, description: e.target.value})}
                placeholder="Describe what this workflow does"
                rows={3}
              />
            </div>

            {/* Actions Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Actions</h3>

              {/* Add Action Form */}
              <Card className="mb-4">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Action Type</label>
                      <Select
                        value={currentAction.type}
                        onValueChange={(value) => setCurrentAction({...currentAction, type: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="create_task">Create Task</SelectItem>
                          <SelectItem value="update_task">Update Task</SelectItem>
                          <SelectItem value="send_notification">Send Notification</SelectItem>
                          <SelectItem value="update_project">Update Project</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {currentAction.type === 'create_task' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium mb-2">Task Title</label>
                          <Input
                            value={currentAction.title}
                            onChange={(e) => setCurrentAction({...currentAction, title: e.target.value})}
                            placeholder="Task title"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Priority</label>
                          <Select
                            value={currentAction.priority}
                            onValueChange={(value) => setCurrentAction({...currentAction, priority: value})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="low">Low</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Status</label>
                          <Select
                            value={currentAction.status}
                            onValueChange={(value) => setCurrentAction({...currentAction, status: value})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="backlog">Backlog</SelectItem>
                              <SelectItem value="in_progress">In Progress</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    )}
                  </div>

                  {currentAction.type === 'create_task' && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium mb-2">Description</label>
                      <Textarea
                        value={currentAction.description}
                        onChange={(e) => setCurrentAction({...currentAction, description: e.target.value})}
                        placeholder="Task description"
                        rows={2}
                      />
                    </div>
                  )}

                  <Button onClick={addAction} className="mt-4">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Action
                  </Button>
                </CardContent>
              </Card>

              {/* Actions List */}
              {newWorkflow.actions.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Actions to perform:</h4>
                  {newWorkflow.actions.map((action, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <Badge variant="outline">{getActionTypeLabel(action.type)}</Badge>
                        {action.type === 'create_task' && (
                          <span className="ml-2">{action.title} ({action.priority} priority)</span>
                        )}
                      </div>
                      <Button
                        onClick={() => removeAction(index)}
                        variant="outline"
                        size="sm"
                        className="text-red-600"
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button onClick={createWorkflow} className="flex-1">
                Create Workflow
              </Button>
              <Button onClick={() => setShowCreateForm(false)} variant="outline">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Workflows List */}
      <Card>
        <CardHeader>
          <CardTitle>Active Workflows</CardTitle>
        </CardHeader>
        <CardContent>
          {workflows.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Zap className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No workflows yet. Create automated workflows to streamline your processes.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {workflows.map((workflow) => (
                <div key={workflow.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{workflow.name}</h3>
                      <Badge className={workflow.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {workflow.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-2">{workflow.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Settings className="w-4 h-4" />
                        Trigger: {getTriggerTypeLabel(workflow.triggerType)}
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        {workflow.actions.length} actions
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Created {new Date(workflow.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => executeWorkflow(workflow.id)}
                      variant="outline"
                      size="sm"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Test Run
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Workflow Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Workflow Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg hover:border-blue-300 cursor-pointer">
              <h4 className="font-medium mb-2">Task Completion Follow-up</h4>
              <p className="text-sm text-gray-600 mb-3">
                Automatically create a review task when a high-priority task is completed.
              </p>
              <Badge variant="outline">Task Management</Badge>
            </div>

            <div className="p-4 border rounded-lg hover:border-blue-300 cursor-pointer">
              <h4 className="font-medium mb-2">Overdue Task Alerts</h4>
              <p className="text-sm text-gray-600 mb-3">
                Send notifications when tasks are approaching their due date.
              </p>
              <Badge variant="outline">Notifications</Badge>
            </div>

            <div className="p-4 border rounded-lg hover:border-blue-300 cursor-pointer">
              <h4 className="font-medium mb-2">Project Status Updates</h4>
              <p className="text-sm text-gray-600 mb-3">
                Update project status based on task completion percentages.
              </p>
              <Badge variant="outline">Project Management</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
