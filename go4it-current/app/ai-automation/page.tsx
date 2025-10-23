'use client';

import { useState, useEffect } from 'react';

interface AutomationStats {
  totalWorkflows: number;
  activePipelines: number;
  aiRequestsToday: number;
  contentGenerated: number;
  alertsTriggered: number;
}

interface Workflow {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'error';
  lastRun: string;
  nextRun: string;
  successRate: number;
}

export default function AIAutomationDashboard() {
  const [stats, setStats] = useState<AutomationStats>({
    totalWorkflows: 0,
    activePipelines: 0,
    aiRequestsToday: 0,
    contentGenerated: 0,
    alertsTriggered: 0
  });

  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [selectedTab, setSelectedTab] = useState('overview');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load mock data - in production, this would fetch from your APIs
      setStats({
        totalWorkflows: 12,
        activePipelines: 8,
        aiRequestsToday: 247,
        contentGenerated: 89,
        alertsTriggered: 3
      });

      setWorkflows([
        {
          id: 'daily-analytics',
          name: 'Daily Athlete Analytics',
          status: 'active',
          lastRun: '2025-10-22T06:00:00Z',
          nextRun: '2025-10-23T06:00:00Z',
          successRate: 98.5
        },
        {
          id: 'lead-nurture',
          name: 'Lead Nurture Automation',
          status: 'active',
          lastRun: '2025-10-22T12:30:00Z',
          nextRun: '2025-10-22T13:00:00Z',
          successRate: 95.2
        },
        {
          id: 'content-generation',
          name: 'Automated Content Creation',
          status: 'active',
          lastRun: '2025-10-22T08:00:00Z',
          nextRun: '2025-10-22T14:00:00Z',
          successRate: 92.1
        }
      ]);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  const runWorkflow = async (workflowId: string) => {
    try {
      const response = await fetch('/api/ai/enhance/pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pipelineId: workflowId,
          executeNow: true
        })
      });

      if (response.ok) {
        alert(`Workflow ${workflowId} executed successfully!`);
        loadDashboardData(); // Refresh data
      } else {
        alert('Failed to execute workflow');
      }
    } catch (error) {
      console.error('Workflow execution error:', error);
      alert('Error executing workflow');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🤖 AI Automation Dashboard
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Supercharged Go4it Sports GPT - Automated Excellence
          </p>
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-4 max-w-4xl mx-auto">
            <p className="text-lg">
              ⚡ <strong>Powered by Open Source:</strong> Hugging Face • LangChain • Apache Airflow • Elasticsearch • Metabase
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totalWorkflows}</div>
            <div className="text-gray-600">Total Workflows</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{stats.activePipelines}</div>
            <div className="text-gray-600">Active Pipelines</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">{stats.aiRequestsToday}</div>
            <div className="text-gray-600">AI Requests Today</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">{stats.contentGenerated}</div>
            <div className="text-gray-600">Content Generated</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">{stats.alertsTriggered}</div>
            <div className="text-gray-600">Alerts Triggered</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: '📊' },
                { id: 'workflows', label: 'Workflows', icon: '⚙️' },
                { id: 'ai-models', label: 'AI Models', icon: '🧠' },
                { id: 'pipelines', label: 'Data Pipelines', icon: '🔄' },
                { id: 'content', label: 'Content Automation', icon: '📝' },
                { id: 'monitoring', label: 'Monitoring', icon: '📈' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    selectedTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {selectedTab === 'overview' && <OverviewTab stats={stats} />}
            {selectedTab === 'workflows' && <WorkflowsTab workflows={workflows} onRunWorkflow={runWorkflow} />}
            {selectedTab === 'ai-models' && <AIModelsTab />}
            {selectedTab === 'pipelines' && <PipelinesTab />}
            {selectedTab === 'content' && <ContentTab />}
            {selectedTab === 'monitoring' && <MonitoringTab />}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">🚀 Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Generate Athlete Profile
            </button>
            <button className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors">
              Run Analytics Pipeline
            </button>
            <button className="bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors">
              Create Social Content
            </button>
            <button className="bg-orange-600 text-white px-4 py-3 rounded-lg hover:bg-orange-700 transition-colors">
              Send Automated Emails
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function OverviewTab({ stats }: { stats: AutomationStats }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">System Overview</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">🤖 AI Capabilities</h3>
          <ul className="space-y-2 text-gray-600">
            <li>✅ Hugging Face Model Integration</li>
            <li>✅ LangChain Workflow Orchestration</li>
            <li>✅ Automated Content Generation</li>
            <li>✅ Sentiment Analysis & Insights</li>
            <li>✅ Multi-language Translation</li>
            <li>✅ Image Generation & Processing</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">🔄 Automation Features</h3>
          <ul className="space-y-2 text-gray-600">
            <li>✅ Data Pipeline Orchestration</li>
            <li>✅ Real-time Alert System</li>
            <li>✅ Scheduled Report Generation</li>
            <li>✅ Lead Nurture Automation</li>
            <li>✅ Performance Monitoring</li>
            <li>✅ API Integration Hub</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function WorkflowsTab({ workflows, onRunWorkflow }: { workflows: Workflow[], onRunWorkflow: (id: string) => void }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Active Workflows</h2>
      <div className="space-y-4">
        {workflows.map(workflow => (
          <div key={workflow.id} className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-gray-800">{workflow.name}</h3>
                <p className="text-sm text-gray-600">ID: {workflow.id}</p>
              </div>
              <div className="text-right">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  workflow.status === 'active' ? 'bg-green-100 text-green-800' :
                  workflow.status === 'error' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {workflow.status}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Last Run:</span>
                <div className="font-medium">{new Date(workflow.lastRun).toLocaleString()}</div>
              </div>
              <div>
                <span className="text-gray-500">Next Run:</span>
                <div className="font-medium">{new Date(workflow.nextRun).toLocaleString()}</div>
              </div>
              <div>
                <span className="text-gray-500">Success Rate:</span>
                <div className="font-medium">{workflow.successRate}%</div>
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={() => onRunWorkflow(workflow.id)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Run Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AIModelsTab() {
  const models = [
    { name: 'GPT-4', provider: 'OpenAI', purpose: 'Advanced reasoning & content generation' },
    { name: 'Claude', provider: 'Anthropic', purpose: 'Long-form content & analysis' },
    { name: 'BERT Sentiment', provider: 'Hugging Face', purpose: 'Sentiment analysis' },
    { name: 'T5 Translation', provider: 'Hugging Face', purpose: 'Multi-language translation' },
    { name: 'Stable Diffusion', provider: 'Hugging Face', purpose: 'Image generation' }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">AI Models Integration</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {models.map(model => (
          <div key={model.name} className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">{model.name}</h3>
            <p className="text-sm text-blue-600 mb-2">{model.provider}</p>
            <p className="text-sm text-gray-600">{model.purpose}</p>
            <div className="mt-3">
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                Active
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PipelinesTab() {
  const pipelines = [
    { name: 'Daily Analytics', schedule: '6:00 AM Daily', status: 'active' },
    { name: 'Lead Nurture', schedule: 'Every 30 min', status: 'active' },
    { name: 'Revenue Reports', schedule: '8:00 AM Monday', status: 'active' },
    { name: 'Content Generation', schedule: '2:00 PM Daily', status: 'active' }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Data Pipelines</h2>
      <div className="space-y-4">
        {pipelines.map(pipeline => (
          <div key={pipeline.name} className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-gray-800">{pipeline.name}</h3>
              <p className="text-sm text-gray-600">{pipeline.schedule}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              pipeline.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {pipeline.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContentTab() {
  const templates = [
    { name: 'Athlete Profile', category: 'Marketing', usage: '247 generated' },
    { name: 'Event Announcement', category: 'Marketing', usage: '89 generated' },
    { name: 'Social Media Post', category: 'Social', usage: '156 generated' },
    { name: 'Email Newsletter', category: 'Communication', usage: '78 generated' }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Content Automation</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map(template => (
          <div key={template.name} className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">{template.name}</h3>
            <p className="text-sm text-blue-600 mb-2">{template.category}</p>
            <p className="text-sm text-gray-600">{template.usage}</p>
            <button className="mt-3 bg-purple-600 text-white px-3 py-1 rounded-lg hover:bg-purple-700 transition-colors text-sm">
              Generate
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function MonitoringTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">System Monitoring</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">📊 Performance Metrics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>API Response Time</span>
              <span className="font-medium">245ms</span>
            </div>
            <div className="flex justify-between">
              <span>AI Model Latency</span>
              <span className="font-medium">1.2s</span>
            </div>
            <div className="flex justify-between">
              <span>Pipeline Success Rate</span>
              <span className="font-medium">96.8%</span>
            </div>
            <div className="flex justify-between">
              <span>System Uptime</span>
              <span className="font-medium">99.9%</span>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">🚨 Recent Alerts</h3>
          <div className="space-y-3">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">⚠️ Lead nurture pipeline delayed by 5 minutes</p>
              <p className="text-xs text-yellow-600 mt-1">2 hours ago</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-800">✅ Daily analytics pipeline completed successfully</p>
              <p className="text-xs text-green-600 mt-1">4 hours ago</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">📈 Content generation exceeded daily target</p>
              <p className="text-xs text-blue-600 mt-1">6 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}