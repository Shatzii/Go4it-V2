'use client';

import { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Users,
  Target,
  BarChart3,
  LineChart,
  PieChart,
} from 'lucide-react';

interface PerformanceData {
  date: string;
  garScore: number;
  speed: number;
  agility: number;
  strength: number;
  endurance: number;
  technique: number;
}

interface ComparisonData {
  athlete: string;
  garScore: number;
  position: string;
  sport: string;
}

export function PerformanceMetricsDashboard() {
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [comparisonData, setComparisonData] = useState<ComparisonData[]>([]);
  const [selectedRange, setSelectedRange] = useState('3months');
  const [selectedMetric, setSelectedMetric] = useState('garScore');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPerformanceData();
  }, [selectedRange]);

  const fetchPerformanceData = async () => {
    try {
      const response = await fetch(`/api/performance/metrics?range=${selectedRange}`);
      if (response.ok) {
        const data = await response.json();
        setPerformanceData(data.performance);
        setComparisonData(data.comparison);
      }
    } catch (error) {
      console.error('Failed to fetch performance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTrend = (data: PerformanceData[], metric: keyof PerformanceData) => {
    if (data.length < 2) return 0;
    const recent = data.slice(-5);
    const older = data.slice(-10, -5);

    const recentAvg =
      recent.reduce((sum, item) => sum + (item[metric] as number), 0) / recent.length;
    const olderAvg = older.reduce((sum, item) => sum + (item[metric] as number), 0) / older.length;

    return ((recentAvg - olderAvg) / olderAvg) * 100;
  };

  const getMetricColor = (metric: string) => {
    switch (metric) {
      case 'garScore':
        return 'text-blue-500';
      case 'speed':
        return 'text-green-500';
      case 'agility':
        return 'text-yellow-500';
      case 'strength':
        return 'text-red-500';
      case 'endurance':
        return 'text-purple-500';
      case 'technique':
        return 'text-orange-500';
      default:
        return 'text-gray-500';
    }
  };

  const getCurrentValue = (metric: keyof PerformanceData) => {
    if (performanceData.length === 0) return 0;
    return performanceData[performanceData.length - 1][metric] as number;
  };

  const formatMetricName = (metric: string) => {
    switch (metric) {
      case 'garScore':
        return 'GAR Score';
      case 'speed':
        return 'Speed';
      case 'agility':
        return 'Agility';
      case 'strength':
        return 'Strength';
      case 'endurance':
        return 'Endurance';
      case 'technique':
        return 'Technique';
      default:
        return metric;
    }
  };

  const renderLineChart = () => {
    if (performanceData.length === 0) return null;

    const maxValue = Math.max(
      ...performanceData.map((d) => d[selectedMetric as keyof PerformanceData] as number),
    );
    const minValue = Math.min(
      ...performanceData.map((d) => d[selectedMetric as keyof PerformanceData] as number),
    );
    const range = maxValue - minValue;

    return (
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Performance Trend</h3>
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
          >
            <option value="garScore">GAR Score</option>
            <option value="speed">Speed</option>
            <option value="agility">Agility</option>
            <option value="strength">Strength</option>
            <option value="endurance">Endurance</option>
            <option value="technique">Technique</option>
          </select>
        </div>

        <div className="h-64 relative">
          <svg width="100%" height="100%" viewBox="0 0 800 200">
            {/* Grid lines */}
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={i}
                x1="0"
                y1={i * 40}
                x2="800"
                y2={i * 40}
                stroke="#374151"
                strokeWidth="0.5"
              />
            ))}

            {/* Data line */}
            <polyline
              points={performanceData
                .map((d, i) => {
                  const x = (i / (performanceData.length - 1)) * 800;
                  const y =
                    200 -
                    (((d[selectedMetric as keyof PerformanceData] as number) - minValue) / range) *
                      200;
                  return `${x},${y}`;
                })
                .join(' ')}
              fill="none"
              stroke="#3B82F6"
              strokeWidth="2"
            />

            {/* Data points */}
            {performanceData.map((d, i) => {
              const x = (i / (performanceData.length - 1)) * 800;
              const y =
                200 -
                (((d[selectedMetric as keyof PerformanceData] as number) - minValue) / range) * 200;
              return <circle key={i} cx={x} cy={y} r="3" fill="#3B82F6" />;
            })}
          </svg>

          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-slate-400">
            <span>{maxValue.toFixed(1)}</span>
            <span>{((maxValue + minValue) / 2).toFixed(1)}</span>
            <span>{minValue.toFixed(1)}</span>
          </div>
        </div>
      </div>
    );
  };

  const renderMetricCards = () => {
    const metrics = ['garScore', 'speed', 'agility', 'strength', 'endurance', 'technique'];

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {metrics.map((metric) => {
          const trend = calculateTrend(performanceData, metric as keyof PerformanceData);
          const currentValue = getCurrentValue(metric as keyof PerformanceData);

          return (
            <div key={metric} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-slate-400">{formatMetricName(metric)}</h4>
                <div
                  className={`flex items-center gap-1 ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}
                >
                  {trend >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span className="text-xs">{Math.abs(trend).toFixed(1)}%</span>
                </div>
              </div>
              <div className={`text-2xl font-bold ${getMetricColor(metric)}`}>
                {currentValue.toFixed(1)}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderComparison = () => {
    return (
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Position Comparison</h3>

        <div className="space-y-3">
          {comparisonData.map((athlete, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-slate-700 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    index === 0
                      ? 'bg-yellow-500 text-black'
                      : index === 1
                        ? 'bg-gray-400 text-black'
                        : index === 2
                          ? 'bg-orange-500 text-black'
                          : 'bg-slate-600 text-white'
                  }`}
                >
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium text-white">{athlete.athlete}</div>
                  <div className="text-sm text-slate-400">
                    {athlete.position} • {athlete.sport}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-white">{athlete.garScore}</div>
                <div className="text-sm text-slate-400">GAR Score</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Performance Analytics</h1>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-slate-400" />
              <select
                value={selectedRange}
                onChange={(e) => setSelectedRange(e.target.value)}
                className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white"
              >
                <option value="1month">Last Month</option>
                <option value="3months">Last 3 Months</option>
                <option value="6months">Last 6 Months</option>
                <option value="1year">Last Year</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Metric Cards */}
        {renderMetricCards()}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {renderLineChart()}
          {renderComparison()}
        </div>

        {/* Insights */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Performance Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-700 rounded-lg p-4">
              <h4 className="font-medium text-white mb-2">Strengths</h4>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>• Consistent GAR score improvement</li>
                <li>• Strong technique fundamentals</li>
                <li>• Above-average speed metrics</li>
              </ul>
            </div>
            <div className="bg-slate-700 rounded-lg p-4">
              <h4 className="font-medium text-white mb-2">Areas for Improvement</h4>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>• Endurance training needed</li>
                <li>• Strength metrics below position average</li>
                <li>• Agility could be enhanced</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
