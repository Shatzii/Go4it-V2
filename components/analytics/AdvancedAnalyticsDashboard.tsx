'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Line, Bar, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface AnalyticsDashboardProps {
  userId: string;
  timeRange?: '7d' | '30d' | '90d' | '1y';
}

export function AdvancedAnalyticsDashboard({ userId: _userId, timeRange: _timeRange = '30d' }: AnalyticsDashboardProps) {
  // Performance trend data
  const performanceTrend = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    datasets: [
      {
        label: 'GAR Score',
        data: [65, 68, 72, 75, 78, 82],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Predicted Trend',
        data: [null, null, null, null, 80, 84, 87],
        borderColor: 'rgb(16, 185, 129)',
        borderDash: [5, 5],
        fill: false,
        tension: 0.4,
      },
    ],
  };

  // Skill breakdown radar
  const skillBreakdown = {
    labels: ['Technical', 'Physical', 'Mental', 'Tactical', 'Leadership', 'Teamwork'],
    datasets: [
      {
        label: 'Current',
        data: [82, 75, 88, 70, 65, 78],
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgb(59, 130, 246)',
        pointBackgroundColor: 'rgb(59, 130, 246)',
      },
      {
        label: 'Target',
        data: [90, 85, 90, 85, 80, 85],
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        borderColor: 'rgb(16, 185, 129)',
        pointBackgroundColor: 'rgb(16, 185, 129)',
      },
    ],
  };

  // Training volume comparison
  const trainingVolume = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Training Hours',
        data: [45, 52, 48, 60, 58, 65],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
      },
      {
        label: 'Competition Hours',
        data: [8, 10, 12, 15, 18, 20],
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
      },
    ],
  };

  // Predictive analytics
  const predictedMetrics = [
    { metric: 'Next GAR Score', current: 82, predicted: 87, confidence: 85 },
    { metric: 'NCAA Eligibility', current: 89, predicted: 94, confidence: 92 },
    { metric: 'D1 Readiness', current: 72, predicted: 82, confidence: 78 },
    { metric: 'Recruitment Interest', current: 65, predicted: 78, confidence: 70 },
  ];

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Current GAR</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">82.5</div>
            <div className="text-sm text-green-600 flex items-center mt-1">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              +5.2% this month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Predicted Next</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">87.0</div>
            <div className="text-sm text-gray-500 mt-1">
              85% confidence
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Training Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">65</div>
            <div className="text-sm text-gray-500 mt-1">
              This month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">D1 Readiness</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">72%</div>
            <div className="text-sm text-gray-500 mt-1">
              → 82% projected
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Trend & Prediction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Line data={performanceTrend} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        {/* Skill Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Skill Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Radar data={skillBreakdown} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        {/* Training Volume */}
        <Card>
          <CardHeader>
            <CardTitle>Training Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Bar data={trainingVolume} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        {/* Predictive Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Predictive Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {predictedMetrics.map((item) => (
                <div key={item.metric} className="border-b last:border-0 pb-4 last:pb-0">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{item.metric}</span>
                    <span className="text-sm text-gray-500">{item.confidence}% confidence</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <div className="text-2xl font-bold text-gray-700">{item.current}</div>
                      <div className="text-xs text-gray-500">Current</div>
                    </div>
                    <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <div className="flex-1">
                      <div className="text-2xl font-bold text-green-600">{item.predicted}</div>
                      <div className="text-xs text-gray-500">Predicted</div>
                    </div>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(item.predicted / 100) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comparative Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Peer Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { label: 'National Average (Position)', value: 75, yours: 82 },
              { label: 'State Average', value: 78, yours: 82 },
              { label: 'Top 10% Threshold', value: 88, yours: 82 },
              { label: 'D1 Commit Average', value: 85, yours: 82 },
            ].map((comp) => (
              <div key={comp.label} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{comp.label}</span>
                  <span className="font-medium">
                    You: {comp.yours} | Avg: {comp.value}
                  </span>
                </div>
                <div className="relative w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="absolute bg-gray-400 h-3 rounded-full"
                    style={{ width: `${comp.value}%` }}
                  />
                  <div
                    className="absolute bg-blue-600 h-3 rounded-full border-2 border-white"
                    style={{ width: `${comp.yours}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
