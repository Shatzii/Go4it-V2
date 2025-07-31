'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Camera, 
  Brain, 
  Target,
  TrendingUp,
  AlertTriangle,
  Award,
  Activity
} from 'lucide-react'
import { initializeAI, analyzeVideoPerformance, type PerformanceAnalysis } from '@/lib/ai-engine'

interface AdvancedVideoAnalyzerProps {
  videoUrl?: string
  sport: string
  onAnalysisComplete?: (analysis: PerformanceAnalysis) => void
}

export function AdvancedVideoAnalyzer({ 
  videoUrl, 
  sport, 
  onAnalysisComplete 
}: AdvancedVideoAnalyzerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [analysis, setAnalysis] = useState<PerformanceAnalysis | null>(null)
  const [aiInitialized, setAiInitialized] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    initializeAIEngine()
  }, [])

  const initializeAIEngine = async () => {
    try {
      const initialized = await initializeAI()
      setAiInitialized(initialized)
      if (!initialized) {
        setError('Failed to initialize AI engine')
      }
    } catch (err) {
      setError('Error initializing AI engine')
      console.error(err)
    }
  }

  const togglePlayback = () => {
    if (!videoRef.current) return

    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const restartVideo = () => {
    if (!videoRef.current) return
    
    videoRef.current.currentTime = 0
    if (isPlaying) {
      videoRef.current.play()
    }
  }

  const analyzeVideo = async () => {
    if (!videoRef.current || !aiInitialized) {
      setError('Video or AI engine not ready')
      return
    }

    setIsAnalyzing(true)
    setAnalysisProgress(0)
    setError(null)

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const result = await analyzeVideoPerformance(videoRef.current, sport)
      
      clearInterval(progressInterval)
      setAnalysisProgress(100)
      setAnalysis(result)
      onAnalysisComplete?.(result)

    } catch (err) {
      setError('Analysis failed. Please try again.')
      console.error(err)
    } finally {
      setIsAnalyzing(false)
      setTimeout(() => setAnalysisProgress(0), 1000)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500'
    if (score >= 60) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default'
    if (score >= 60) return 'secondary'
    return 'destructive'
  }

  return (
    <div className="space-y-6">
      {/* Video Player Section */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Camera className="w-5 h-5 text-primary" />
            Advanced Video Analysis
          </CardTitle>
          <CardDescription>
            AI-powered biomechanical analysis for {sport}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <video
              ref={videoRef}
              className="w-full rounded-lg bg-black"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              crossOrigin="anonymous"
            >
              {videoUrl && <source src={videoUrl} type="video/mp4" />}
              Your browser does not support the video tag.
            </video>
            
            {/* Video Overlay Canvas for Pose Detection */}
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-75"
              style={{ mixBlendMode: 'overlay' }}
            />
            
            {/* Video Controls */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={togglePlayback}
                  disabled={!videoUrl}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={restartVideo}
                  disabled={!videoUrl}
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
              
              <Button
                onClick={analyzeVideo}
                disabled={!videoUrl || !aiInitialized || isAnalyzing}
                className="bg-primary hover:bg-primary/90"
              >
                <Brain className="w-4 h-4 mr-2" />
                {isAnalyzing ? 'Analyzing...' : 'Analyze Performance'}
              </Button>
            </div>
            
            {/* Analysis Progress */}
            {isAnalyzing && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400">Processing video...</span>
                  <span className="text-sm text-slate-400">{analysisProgress}%</span>
                </div>
                <Progress value={analysisProgress} className="h-2" />
              </div>
            )}
            
            {/* Error Display */}
            {error && (
              <div className="mt-4 p-3 bg-red-900/20 border border-red-800 rounded-lg">
                <div className="flex items-center gap-2 text-red-400">
                  <AlertTriangle className="w-4 h-4" />
                  {error}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysis && (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="technique">Technique</TabsTrigger>
            <TabsTrigger value="biomechanics">Biomechanics</TabsTrigger>
            <TabsTrigger value="prediction">Prediction</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Overall Score */}
                  <div className="text-center">
                    <div className={`text-4xl font-bold ${getScoreColor(analysis.technique.score)}`}>
                      {analysis.technique.score.toFixed(1)}
                    </div>
                    <div className="text-slate-400 text-sm">Overall Score</div>
                    <Badge variant={getScoreBadgeVariant(analysis.technique.score)} className="mt-2">
                      {analysis.technique.score >= 80 ? 'Excellent' : 
                       analysis.technique.score >= 60 ? 'Good' : 'Needs Work'}
                    </Badge>
                  </div>
                  
                  {/* Peer Comparison */}
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-400">
                      {analysis.comparison.peerPercentile.toFixed(0)}%
                    </div>
                    <div className="text-slate-400 text-sm">Peer Percentile</div>
                    <div className="text-xs text-slate-500 mt-1">
                      Better than {analysis.comparison.peerPercentile.toFixed(0)}% of peers
                    </div>
                  </div>
                  
                  {/* Professional Gap */}
                  <div className="text-center">
                    <div className="text-4xl font-bold text-purple-400">
                      {analysis.comparison.professionalGap.toFixed(1)}
                    </div>
                    <div className="text-slate-400 text-sm">Points to Pro Level</div>
                    <div className="text-xs text-slate-500 mt-1">
                      Professional level: 90+
                    </div>
                  </div>
                </div>
                
                {/* Strengths */}
                <div className="mt-6">
                  <h4 className="text-white font-medium mb-3">Key Strengths</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.comparison.strengthAreas.map((strength, index) => (
                      <Badge key={index} variant="outline" className="text-green-400 border-green-400">
                        {strength}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Technique Tab */}
          <TabsContent value="technique">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Technique Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Feedback */}
                  <div>
                    <h4 className="text-white font-medium mb-3">Coach Feedback</h4>
                    <div className="space-y-2">
                      {analysis.technique.feedback.map((feedback, index) => (
                        <div key={index} className="flex items-start gap-2 text-slate-300">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                          {feedback}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Improvements */}
                  <div>
                    <h4 className="text-white font-medium mb-3">Recommended Improvements</h4>
                    <div className="space-y-2">
                      {analysis.technique.improvements.map((improvement, index) => (
                        <div key={index} className="flex items-start gap-2 text-slate-300">
                          <TrendingUp className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                          {improvement}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Biomechanics Tab */}
          <TabsContent value="biomechanics">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Biomechanical Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  {/* Balance */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-300">Balance</span>
                      <span className={`font-medium ${getScoreColor(analysis.biomechanics.balance)}`}>
                        {analysis.biomechanics.balance.toFixed(1)}
                      </span>
                    </div>
                    <Progress value={analysis.biomechanics.balance} className="h-2" />
                  </div>
                  
                  {/* Coordination */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-300">Coordination</span>
                      <span className={`font-medium ${getScoreColor(analysis.biomechanics.coordination)}`}>
                        {analysis.biomechanics.coordination.toFixed(1)}
                      </span>
                    </div>
                    <Progress value={analysis.biomechanics.coordination} className="h-2" />
                  </div>
                  
                  {/* Efficiency */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-300">Efficiency</span>
                      <span className={`font-medium ${getScoreColor(analysis.biomechanics.efficiency)}`}>
                        {analysis.biomechanics.efficiency.toFixed(1)}
                      </span>
                    </div>
                    <Progress value={analysis.biomechanics.efficiency} className="h-2" />
                  </div>
                </div>
                
                {/* Risk Factors */}
                {analysis.biomechanics.riskFactors.length > 0 && (
                  <div>
                    <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-400" />
                      Risk Factors
                    </h4>
                    <div className="space-y-2">
                      {analysis.biomechanics.riskFactors.map((risk, index) => (
                        <div key={index} className="flex items-start gap-2 text-yellow-300">
                          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          {risk}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Prediction Tab */}
          <TabsContent value="prediction">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  Performance Prediction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Potential Rating */}
                  <div>
                    <h4 className="text-white font-medium mb-3">Potential Rating</h4>
                    <div className="flex items-center gap-4">
                      <div className={`text-3xl font-bold ${getScoreColor(analysis.prediction.potentialRating)}`}>
                        {analysis.prediction.potentialRating.toFixed(1)}
                      </div>
                      <div className="flex-1">
                        <Progress value={analysis.prediction.potentialRating} className="h-3" />
                        <div className="text-xs text-slate-400 mt-1">
                          Based on current performance and improvement trajectory
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Timeline */}
                  <div>
                    <h4 className="text-white font-medium mb-3">Improvement Timeline</h4>
                    <div className="p-4 bg-slate-700/50 rounded-lg">
                      <div className="text-slate-300">{analysis.prediction.timelineEstimate}</div>
                    </div>
                  </div>
                  
                  {/* Focus Areas */}
                  <div>
                    <h4 className="text-white font-medium mb-3">Priority Focus Areas</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {analysis.prediction.improvementAreas.map((area, index) => (
                        <div key={index} className="p-3 bg-slate-700/50 rounded-lg">
                          <div className="text-slate-300 text-sm">{area}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}