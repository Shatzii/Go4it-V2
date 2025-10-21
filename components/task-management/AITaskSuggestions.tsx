'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Sparkles, Plus, Clock, Target, Users } from 'lucide-react';
import { toast } from 'sonner';

interface TaskSuggestion {
  title: string;
  description: string;
  estimatedHours: number;
  priority: string;
  dependencies: string[];
  tags: string[];
  id: string;
  suggestedBy: string;
  confidence: number;
}

export function AITaskSuggestions() {
  const [projectDescription, setProjectDescription] = useState('');
  const [projectType, setProjectType] = useState('');
  const [suggestions, setSuggestions] = useState<TaskSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSuggestions, setSelectedSuggestions] = useState<Set<string>>(new Set());

  const generateSuggestions = async () => {
    if (!projectDescription.trim()) {
      toast.error('Please enter a project description');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/ai/task-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectDescription,
          projectType: projectType || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate suggestions');
      }

      const data = await response.json();
      setSuggestions(data.suggestions);
      toast.success(`Generated ${data.suggestions.length} task suggestions`);
    } catch (error) {
      console.error('Error generating suggestions:', error);
      toast.error('Failed to generate task suggestions');
    } finally {
      setLoading(false);
    }
  };

  const toggleSuggestion = (suggestionId: string) => {
    const newSelected = new Set(selectedSuggestions);
    if (newSelected.has(suggestionId)) {
      newSelected.delete(suggestionId);
    } else {
      newSelected.add(suggestionId);
    }
    setSelectedSuggestions(newSelected);
  };

  const createSelectedTasks = async () => {
    const tasksToCreate = suggestions.filter(s => selectedSuggestions.has(s.id));

    if (tasksToCreate.length === 0) {
      toast.error('Please select at least one task to create');
      return;
    }

    try {
      const createdTasks = [];
      for (const suggestion of tasksToCreate) {
        const response = await fetch('/api/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: suggestion.title,
            description: suggestion.description,
            priority: suggestion.priority,
            estimatedHours: suggestion.estimatedHours,
            tags: suggestion.tags,
            status: 'backlog',
          }),
        });

        if (response.ok) {
          const task = await response.json();
          createdTasks.push(task);
        }
      }

      toast.success(`Created ${createdTasks.length} tasks successfully`);
      setSelectedSuggestions(new Set());
      // Optionally refresh the task list or navigate to tasks view
    } catch (error) {
      console.error('Error creating tasks:', error);
      toast.error('Failed to create some tasks');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Sparkles className="w-6 h-6 text-purple-600" />
        <h2 className="text-2xl font-bold">AI Task Suggestions</h2>
      </div>

      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Task Suggestions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Project Type</label>
            <Select value={projectType} onValueChange={setProjectType}>
              <SelectTrigger>
                <SelectValue placeholder="Select project type (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="software">Software Development</SelectItem>
                <SelectItem value="marketing">Marketing Campaign</SelectItem>
                <SelectItem value="construction">Construction</SelectItem>
                <SelectItem value="research">Research Project</SelectItem>
                <SelectItem value="event">Event Planning</SelectItem>
                <SelectItem value="education">Educational Program</SelectItem>
                <SelectItem value="product">Product Launch</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Project Description</label>
            <Textarea
              placeholder="Describe your project in detail. What needs to be accomplished? What are the main objectives? Any specific requirements or constraints?"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              rows={6}
              className="resize-none"
            />
          </div>

          <Button
            onClick={generateSuggestions}
            disabled={loading || !projectDescription.trim()}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Suggestions...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate AI Suggestions
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Suggestions Section */}
      {suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>AI-Generated Task Suggestions</CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {selectedSuggestions.size} of {suggestions.length} selected
                </span>
                <Button
                  onClick={createSelectedTasks}
                  disabled={selectedSuggestions.size === 0}
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Selected Tasks
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {suggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className={`border rounded-lg p-4 transition-all ${
                    selectedSuggestions.has(suggestion.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedSuggestions.has(suggestion.id)}
                        onChange={() => toggleSuggestion(suggestion.id)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <h3 className="font-semibold text-lg">{suggestion.title}</h3>
                      <Badge className={getPriorityColor(suggestion.priority)}>
                        {suggestion.priority} priority
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {suggestion.estimatedHours}h
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        {Math.round(suggestion.confidence * 100)}% confidence
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-3">{suggestion.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {suggestion.tags && suggestion.tags.length > 0 && (
                        <div className="flex gap-1">
                          {suggestion.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {suggestion.dependencies && suggestion.dependencies.length > 0 && (
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Users className="w-4 h-4" />
                          Depends on: {suggestion.dependencies.join(', ')}
                        </div>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleSuggestion(suggestion.id)}
                    >
                      {selectedSuggestions.has(suggestion.id) ? 'Deselect' : 'Select'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {suggestions.length === 0 && !loading && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Ready to Generate Task Suggestions
              </h3>
              <p className="text-gray-500">
                Describe your project above and let AI help you break it down into actionable tasks.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
