'use client'

import { useState, useEffect } from 'react'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, TrendingDown, Target, Trophy, Calendar, Activity } from 'lucide-react'

interface PerformanceData {
  date: string
  garScore: number
  speed: number
  agility: number
  strength: number
  endurance: number
  technique: number
}

interface ComparisonData {
  athlete: string
  garScore: number
  position: string
  sport: string
}

export function PerformanceMetricsDashboard() {
  const [timeRange, setTimeRange] = useState('3months')
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([])
  const [comparisonData, setComparisonData] = useState<ComparisonData[]>([])
  const [selectedMetric, setSelectedMetric] = useState('garScore')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPerformanceData()
  }, [timeRange])

  const fetchPerformanceData = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/performance/metrics?range=${timeRange}`)
      if (response.ok) {
        const data = await response.json()
        setPerformanceData(data.performance || [])
        setComparisonData(data.comparison || [])
      }
    } catch (error) {
      console.error('Failed to fetch performance data:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateTrend = (data: PerformanceData[], metric: string) => {
    if (data.length < 2) return 0
    const recent = data.slice(-5)
    const older = data.slice(-10, -5)
    
    const recentAvg = recent.reduce((sum, item) => sum + item[metric as keyof PerformanceData] as number, 0) / recent.length
    const olderAvg = older.reduce((sum, item) => sum + item[metric as keyof PerformanceData] as number, 0) / older.length
    
    return ((recentAvg - olderAvg) / olderAvg) * 100
  }

  const getLatestScore = (metric: string) => {
    if (performanceData.length === 0) return 0
    return performanceData[performanceData.length - 1][metric as keyof PerformanceData] as number
  }

  const formatMetricName = (metric: string) => {
    const names: { [key: string]: string } = {
      garScore: 'GAR Score',
      speed: 'Speed',
      agility: 'Agility',
      strength: 'Strength',
      endurance: 'Endurance',
      technique: 'Technique'
    }
    return names[metric] || metric
  }

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

  const skillDistribution = [
    { name: 'Speed', value: getLatestScore('speed'), color: '#3b82f6' },
    { name: 'Agility', value: getLatestScore('agility'), color: '#10b981' },
    { name: 'Strength', value: getLatestScore('strength'), color: '#f59e0b' },
    { name: 'Endurance', value: getLatestScore('endurance'), color: '#ef4444' },
    { name: 'Technique', value: getLatestScore('technique'), color: '#8b5cf6' }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Performance Analytics</h2>
        <div className="flex gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white"
          >
            <option value="1month">Last Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white"
          >
            <option value="garScore">GAR Score</option>
            <option value="speed">Speed</option>
            <option value="agility">Agility</option>
            <option value="strength">Strength</option>
            <option value="endurance">Endurance</option>
            <option value="technique">Technique</option>
          </select>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {['garScore', 'speed', 'agility', 'strength'].map((metric) => {
          const trend = calculateTrend(performanceData, metric)
          const latestScore = getLatestScore(metric)
          
          return (
            <div key={metric} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-slate-400">{formatMetricName(metric)}</h3>
                {trend > 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {latestScore.toFixed(1)}
              </div>
              <div className={`text-xs ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {trend > 0 ? '+' : ''}{trend.toFixed(1)}% from last period
              </div>
            </div>
          )
        })}
      </div>

      {/* Performance Trend Chart */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Performance Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="date" 
              stroke="#9ca3af"
              fontSize={12}
            />
            <YAxis 
              stroke="#9ca3af"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#ffffff'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey={selectedMetric} 
              stroke="#3b82f6" 
              strokeWidth={2}
              name={formatMetricName(selectedMetric)}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Skill Distribution and Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skill Distribution */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Skill Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={skillDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value.toFixed(1)}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {skillDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#ffffff'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Comparison with Similar Athletes */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Comparison with Similar Athletes</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="athlete" 
                stroke="#9ca3af"
                fontSize={12}
              />
              <YAxis 
                stroke="#9ca3af"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#ffffff'
                }}
              />
              <Bar dataKey="garScore" fill="#3b82f6" name="GAR Score" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Predictions and Goals */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Predictive Analytics & Goals</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-blue-500" />
              <h4 className="font-medium text-white">Next Goal</h4>
            </div>
            <p className="text-2xl font-bold text-white">85.0</p>
            <p className="text-sm text-slate-400">GAR Score Target</p>
          </div>
          
          <div className="bg-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-green-500" />
              <h4 className="font-medium text-white">Projected Improvement</h4>
            </div>
            <p className="text-2xl font-bold text-white">+3.2%</p>
            <p className="text-sm text-slate-400">Next 30 days</p>
          </div>
          
          <div className="bg-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <h4 className="font-medium text-white">Ranking</h4>
            </div>
            <p className="text-2xl font-bold text-white">#12</p>
            <p className="text-sm text-slate-400">In your position</p>
          </div>
        </div>
      </div>
    </div>
  )
}