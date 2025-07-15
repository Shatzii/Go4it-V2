'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft,
  TrendingUp, 
  TrendingDown,
  Calendar,
  BarChart3,
  PieChart,
  LineChart,
  Target,
  Clock,
  Award,
  BookOpen,
  Users,
  Activity,
  Filter,
  Download,
  RefreshCw,
  Info,
  ChevronUp,
  ChevronDown
} from 'lucide-react'

interface AnalyticsData {
  timeRange: string
  metrics: {
    overallGrade: { current: number, previous: number, trend: number }
    attendance: { current: number, previous: number, trend: number }
    assignmentCompletion: { current: number, previous: number, trend: number }
    participation: { current: number, previous: number, trend: number }
  }
  subjectTrends: {
    subject: string
    data: { week: string, grade: number }[]
    currentGrade: number
    change: number
  }[]
  weeklyActivity: {
    week: string
    hoursStudied: number
    assignmentsCompleted: number
    testsGrades: number
  }[]
  goalProgress: {
    goal: string
    target: number
    current: number
    deadline: string
    status: 'on-track' | 'behind' | 'ahead'
  }[]
}

export default function ParentAnalytics() {
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month')
  const [selectedStudent, setSelectedStudent] = useState('emma')
  const [selectedMetric, setSelectedMetric] = useState<'grades' | 'attendance' | 'participation' | 'assignments'>('grades')

  const students = [
    { id: 'emma', name: 'Emma Rodriguez', grade: 'K' },
    { id: 'marcus', name: 'Marcus Johnson', grade: '3' }
  ]

  const analyticsData: AnalyticsData = {
    timeRange: 'Last 30 Days',
    metrics: {
      overallGrade: { current: 92, previous: 89, trend: 3.4 },
      attendance: { current: 98, previous: 96, trend: 2.1 },
      assignmentCompletion: { current: 94, previous: 91, trend: 3.3 },
      participation: { current: 96, previous: 93, trend: 3.2 }
    },
    subjectTrends: [
      {
        subject: 'Mathematics',
        data: [
          { week: 'Week 1', grade: 88 },
          { week: 'Week 2', grade: 92 },
          { week: 'Week 3', grade: 94 },
          { week: 'Week 4', grade: 95 }
        ],
        currentGrade: 95,
        change: 7
      },
      {
        subject: 'English Language Arts',
        data: [
          { week: 'Week 1', grade: 85 },
          { week: 'Week 2', grade: 87 },
          { week: 'Week 3', grade: 89 },
          { week: 'Week 4', grade: 89 }
        ],
        currentGrade: 89,
        change: 4
      },
      {
        subject: 'Science',
        data: [
          { week: 'Week 1', grade: 90 },
          { week: 'Week 2', grade: 91 },
          { week: 'Week 3', grade: 93 },
          { week: 'Week 4', grade: 92 }
        ],
        currentGrade: 92,
        change: 2
      }
    ],
    weeklyActivity: [
      { week: 'Week 1', hoursStudied: 8, assignmentsCompleted: 5, testsGrades: 88 },
      { week: 'Week 2', hoursStudied: 10, assignmentsCompleted: 6, testsGrades: 92 },
      { week: 'Week 3', hoursStudied: 9, assignmentsCompleted: 4, testsGrades: 94 },
      { week: 'Week 4', hoursStudied: 11, assignmentsCompleted: 7, testsGrades: 95 }
    ],
    goalProgress: [
      {
        goal: 'Improve Math Grade to A',
        target: 95,
        current: 95,
        deadline: '2024-08-15',
        status: 'ahead'
      },
      {
        goal: 'Complete Reading Challenge',
        target: 20,
        current: 14,
        deadline: '2024-07-30',
        status: 'on-track'
      },
      {
        goal: 'Perfect Attendance',
        target: 100,
        current: 98,
        deadline: '2024-08-30',
        status: 'behind'
      }
    ]
  }

  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case 'grades': return <BarChart3 className="w-5 h-5" />
      case 'attendance': return <Calendar className="w-5 h-5" />
      case 'participation': return <Users className="w-5 h-5" />
      case 'assignments': return <BookOpen className="w-5 h-5" />
      default: return <Activity className="w-5 h-5" />
    }
  }

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="w-4 h-4 text-green-500" />
    if (trend < 0) return <TrendingDown className="w-4 h-4 text-red-500" />
    return <div className="w-4 h-4 bg-gray-400 rounded-full" />
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ahead': return 'text-green-600 bg-green-100'
      case 'on-track': return 'text-blue-600 bg-blue-100'
      case 'behind': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const selectedStudentData = students.find(s => s.id === selectedStudent)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/parent-dashboard" className="text-blue-600 hover:text-blue-700">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">Student Analytics</h1>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Student</label>
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Range</label>
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Focus Metric</label>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="grades">Academic Grades</option>
                <option value="attendance">Attendance Rate</option>
                <option value="participation">Class Participation</option>
                <option value="assignments">Assignment Completion</option>
              </select>
            </div>

            <div className="flex items-end">
              <div className="w-full">
                <div className="text-sm font-medium text-gray-700 mb-2">Current Period</div>
                <div className="px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-600">
                  {analyticsData.timeRange}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {Object.entries(analyticsData.metrics).map(([key, metric]) => (
            <div key={key} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${
                  selectedMetric === key ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {getMetricIcon(key)}
                </div>
                <div className="flex items-center gap-1">
                  {getTrendIcon(metric.trend)}
                  <span className={`text-sm font-medium ${
                    metric.trend > 0 ? 'text-green-600' : metric.trend < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {metric.trend > 0 ? '+' : ''}{metric.trend}%
                  </span>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{metric.current}%</div>
              <div className="text-sm text-gray-600 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Previous: {metric.previous}%
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            {/* Subject Trends Chart */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Subject Performance Trends</h3>
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Weekly grades over last month</span>
                </div>
              </div>
              
              <div className="space-y-6">
                {analyticsData.subjectTrends.map((subject) => (
                  <div key={subject.subject} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-900">{subject.subject}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-900">{subject.currentGrade}%</span>
                        <span className={`text-sm font-medium ${
                          subject.change > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {subject.change > 0 ? '+' : ''}{subject.change}%
                        </span>
                      </div>
                    </div>
                    
                    {/* Simple trend visualization */}
                    <div className="flex items-end gap-2 h-16">
                      {subject.data.map((week, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center">
                          <div 
                            className="w-full bg-blue-500 rounded-t"
                            style={{ height: `${(week.grade / 100) * 100}%` }}
                          ></div>
                          <div className="text-xs text-gray-500 mt-1">{week.week.split(' ')[1]}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Activity */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Weekly Learning Activity</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="pb-3 text-sm font-medium text-gray-600">Week</th>
                      <th className="pb-3 text-sm font-medium text-gray-600">Study Hours</th>
                      <th className="pb-3 text-sm font-medium text-gray-600">Assignments</th>
                      <th className="pb-3 text-sm font-medium text-gray-600">Test Average</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.weeklyActivity.map((week, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="py-3 text-sm text-gray-900">{week.week}</td>
                        <td className="py-3 text-sm text-gray-600">{week.hoursStudied}h</td>
                        <td className="py-3 text-sm text-gray-600">{week.assignmentsCompleted}</td>
                        <td className="py-3">
                          <span className={`text-sm font-medium ${
                            week.testsGrades >= 90 ? 'text-green-600' : 
                            week.testsGrades >= 80 ? 'text-blue-600' : 'text-yellow-600'
                          }`}>
                            {week.testsGrades}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Goal Progress */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Learning Goals</h3>
              <div className="space-y-4">
                {analyticsData.goalProgress.map((goal, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-medium text-gray-900 text-sm">{goal.goal}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(goal.status)}`}>
                        {goal.status.replace('-', ' ')}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Progress</span>
                        <span className="text-sm font-semibold">{goal.current}/{goal.target}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            goal.status === 'ahead' ? 'bg-green-500' :
                            goal.status === 'on-track' ? 'bg-blue-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(100, (goal.current / goal.target) * 100)}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500">
                        Due: {new Date(goal.deadline).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Insights */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">AI Insights</h3>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-800">Strong Improvement</h4>
                      <p className="text-sm text-green-700 mt-1">
                        Math performance has improved 7% this month. Consistent practice is showing results.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-3">
                    <Target className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-800">Goal Achievement</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Emma is ahead of schedule on her math goal and may be ready for advanced challenges.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800">Attention Needed</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        Reading goal progress is slightly behind. Consider increasing daily reading time.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50">
                  <Target className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium">Set New Goal</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50">
                  <Calendar className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium">Schedule Study Time</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50">
                  <Award className="w-5 h-5 text-purple-500" />
                  <span className="text-sm font-medium">View Achievements</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}