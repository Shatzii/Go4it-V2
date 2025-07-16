'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { BarChart3, TrendingUp, Target, AlertTriangle, CheckCircle, GraduationCap } from 'lucide-react'

interface AnalyticsData {
  success: boolean
  academicProgress: any
  predictiveAnalytics: any
  ncaaEligibility: any
  dashboardData: any
  timeframe: string
  generatedAt: string
}

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [selectedTimeframe, setSelectedTimeframe] = useState('30days')

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const response = await fetch(`/api/academy/analytics?timeframe=${selectedTimeframe}`)
        const data = await response.json()
        setAnalyticsData(data)
      } catch (error) {
        console.error('Error fetching analytics data:', error)
      }
    }

    fetchAnalyticsData()
  }, [selectedTimeframe])

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-slate-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-white">Loading predictive analytics engine...</p>
          </div>
        </div>
      </div>
    )
  }

  const student = analyticsData.academicProgress.student
  const predictions = analyticsData.predictiveAnalytics

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 text-white p-6 rounded-lg">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <BarChart3 className="w-8 h-8 text-orange-400" />
            Predictive Analytics Engine
          </h1>
          <p className="text-lg text-slate-300">Performance forecasting, NCAA eligibility tracking, and risk assessment</p>
        </div>

        {/* Timeframe Selection */}
        <div className="flex gap-2 mb-6">
          {['7days', '30days', '90days', '1year'].map((timeframe) => (
            <Button
              key={timeframe}
              variant={selectedTimeframe === timeframe ? "default" : "outline"}
              className={selectedTimeframe === timeframe ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-700 border-slate-600 text-white hover:bg-slate-600'}
              onClick={() => setSelectedTimeframe(timeframe)}
            >
              {timeframe === '7days' ? '7 Days' : 
               timeframe === '30days' ? '30 Days' :
               timeframe === '90days' ? '90 Days' : '1 Year'}
            </Button>
          ))}
        </div>

        {/* Academic Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Current GPA</p>
                  <p className="text-2xl font-bold text-white">{student.currentGpa}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Semester GPA</p>
                  <p className="text-2xl font-bold text-white">{student.semesterGpa}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Success Rate</p>
                  <p className="text-2xl font-bold text-white">{predictions.successPrediction.overallProbability}%</p>
                </div>
                <Target className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">NCAA Status</p>
                  <Badge className="bg-green-500 text-white">Eligible</Badge>
                </div>
                <GraduationCap className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              Performance Metrics Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(student.performanceMetrics).map(([metric, value]) => (
                <div key={metric} className="bg-slate-700 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate-400 capitalize">{metric.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="text-lg font-bold text-white">{value}%</span>
                  </div>
                  <Progress value={value as number} className="h-2" />
                  <div className="mt-2 text-xs text-slate-400">
                    {value >= 90 ? 'Excellent' : value >= 80 ? 'Good' : value >= 70 ? 'Average' : 'Needs Improvement'}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Predictive Analytics */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-400" />
              Success Prediction & Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-white mb-3">Risk Factors</h4>
                <div className="space-y-3">
                  {predictions.successPrediction.riskFactors.map((factor: any, index: number) => (
                    <div key={index} className="bg-slate-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-white">{factor.factor}</span>
                        <Badge className={`${
                          factor.risk === 'low' ? 'bg-green-500' :
                          factor.risk === 'medium' ? 'bg-yellow-500' :
                          'bg-red-500'
                        } text-white`}>
                          {factor.risk}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-400">Impact</span>
                        <span className="text-xs text-white">{factor.impact}%</span>
                      </div>
                      <Progress value={factor.impact} className="h-1 mt-1" />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-3">Recommendations</h4>
                <div className="space-y-2">
                  {predictions.successPrediction.recommendations.map((rec: string, index: number) => (
                    <div key={index} className="flex items-start gap-2 bg-slate-700 rounded-lg p-3">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-300">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Forecast */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              Performance Forecast
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-700 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-3">Next Semester Prediction</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Predicted GPA</span>
                    <span className="text-lg font-bold text-white">{predictions.performanceForecast.nextSemester.predictedGpa}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Confidence</span>
                    <span className="text-sm text-white">{predictions.performanceForecast.nextSemester.confidence}%</span>
                  </div>
                  <Progress value={predictions.performanceForecast.nextSemester.confidence} className="h-2" />
                </div>
                <div className="mt-4">
                  <h5 className="font-medium text-white mb-2">Suggested Courses</h5>
                  <div className="space-y-1">
                    {predictions.performanceForecast.nextSemester.suggestedCourses.map((course: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-slate-300 border-slate-500 mr-2">
                        {course}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-slate-700 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-3">Graduation Projection</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Projected GPA</span>
                    <span className="text-lg font-bold text-white">{predictions.performanceForecast.graduation.projectedGpa}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">On Track</span>
                    <Badge className="bg-green-500 text-white">
                      {predictions.performanceForecast.graduation.onTrack ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Credits Remaining</span>
                    <span className="text-sm text-white">{predictions.performanceForecast.graduation.creditsRemaining}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Expected Graduation</span>
                    <span className="text-sm text-white">{new Date(predictions.performanceForecast.graduation.estimatedGraduation).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* NCAA Eligibility Tracking */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-400" />
              NCAA Eligibility Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-700 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-3">Core GPA</h4>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400">Current</span>
                  <span className="text-lg font-bold text-white">{analyticsData.ncaaEligibility.requirements.coreGpa.current}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400">Required</span>
                  <span className="text-sm text-white">{analyticsData.ncaaEligibility.requirements.coreGpa.required}</span>
                </div>
                <Badge className="bg-green-500 text-white w-full justify-center">
                  {analyticsData.ncaaEligibility.requirements.coreGpa.status}
                </Badge>
              </div>
              <div className="bg-slate-700 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-3">Core Courses</h4>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400">Completed</span>
                  <span className="text-lg font-bold text-white">{analyticsData.ncaaEligibility.requirements.coreCourses.completed}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400">Required</span>
                  <span className="text-sm text-white">{analyticsData.ncaaEligibility.requirements.coreCourses.required}</span>
                </div>
                <Progress value={(analyticsData.ncaaEligibility.requirements.coreCourses.completed / analyticsData.ncaaEligibility.requirements.coreCourses.required) * 100} className="h-2 mb-2" />
                <Badge className="bg-yellow-500 text-white w-full justify-center">
                  {analyticsData.ncaaEligibility.requirements.coreCourses.status}
                </Badge>
              </div>
              <div className="bg-slate-700 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-3">Test Scores</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-400">SAT</span>
                    <span className="text-sm text-white">{analyticsData.ncaaEligibility.requirements.testScores.sat}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-400">ACT</span>
                    <span className="text-sm text-white">{analyticsData.ncaaEligibility.requirements.testScores.act}</span>
                  </div>
                  <Badge className="bg-green-500 text-white w-full justify-center">
                    {analyticsData.ncaaEligibility.requirements.testScores.required}
                  </Badge>
                </div>
              </div>
            </div>
            
            {/* NCAA Alerts */}
            <div className="mt-6">
              <h4 className="font-semibold text-white mb-3">Alerts & Recommendations</h4>
              <div className="space-y-2">
                {analyticsData.ncaaEligibility.alerts.map((alert: any, index: number) => (
                  <div key={index} className="flex items-start gap-2 bg-slate-700 rounded-lg p-3">
                    <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-white">{alert.type}</span>
                        <Badge className={`${
                          alert.priority === 'high' ? 'bg-red-500' :
                          alert.priority === 'medium' ? 'bg-yellow-500' :
                          'bg-blue-500'
                        } text-white`}>
                          {alert.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-300">{alert.message}</p>
                      <p className="text-xs text-slate-400 mt-1">Due: {alert.dueDate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <BarChart3 className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            <Target className="w-4 h-4 mr-2" />
            Update Goals
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
            <TrendingUp className="w-4 h-4 mr-2" />
            View Trends
          </Button>
        </div>
      </div>
    </div>
  )
}