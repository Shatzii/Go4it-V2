import { Suspense } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  TaskManagementDashboard,
  AITaskSuggestions,
  TimeTracking,
  TaskDependencies,
  WorkflowAutomation,
} from '@/components/task-management';
import {
  BarChart3,
  Brain,
  Clock,
  GitBranch,
  Zap,
  Target,
} from 'lucide-react';

export default function TaskManagementPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Go4It Task Management</h1>
        <p className="text-xl text-gray-600">
          AI-powered operational command center for managing tasks, projects, and workflows
        </p>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="ai-suggestions" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            AI Suggestions
          </TabsTrigger>
          <TabsTrigger value="time-tracking" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Time Tracking
          </TabsTrigger>
          <TabsTrigger value="dependencies" className="flex items-center gap-2">
            <GitBranch className="w-4 h-4" />
            Dependencies
          </TabsTrigger>
          <TabsTrigger value="workflows" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Workflows
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <Suspense fallback={<div>Loading dashboard...</div>}>
            <TaskManagementDashboard />
          </Suspense>
        </TabsContent>

        <TabsContent value="ai-suggestions">
          <Suspense fallback={<div>Loading AI suggestions...</div>}>
            <AITaskSuggestions />
          </Suspense>
        </TabsContent>

        <TabsContent value="time-tracking">
          <Suspense fallback={<div>Loading time tracking...</div>}>
            <TimeTracking />
          </Suspense>
        </TabsContent>

        <TabsContent value="dependencies">
          <Suspense fallback={<div>Loading dependencies...</div>}>
            <TaskDependencies />
          </Suspense>
        </TabsContent>

        <TabsContent value="workflows">
          <Suspense fallback={<div>Loading workflows...</div>}>
            <WorkflowAutomation />
          </Suspense>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold mb-2">Advanced Analytics Coming Soon</h3>
            <p className="text-gray-600">
              Comprehensive analytics dashboard with KPIs, productivity metrics, and performance insights.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
