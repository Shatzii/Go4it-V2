'use client'

import React, { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Smartphone, 
  Camera, 
  Upload, 
  PlayCircle,
  Brain,
  Target,
  Activity,
  CheckCircle,
  AlertCircle,
  Zap
} from 'lucide-react'

export default function MobileAnalysisPage() {
  const [isRecording, setIsRecording] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState<'record' | 'upload' | 'analyze' | 'results'>('record')
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }, 
        audio: false 
      })
      
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setIsRecording(true)
    } catch (error) {
      console.error('Error accessing camera:', error)
    }
  }

  const stopRecording = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
    }
    setIsRecording(false)
    simulateUpload()
  }

  const simulateUpload = () => {
    setCurrentStep('upload')
    setUploadProgress(0)
    
    const uploadInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(uploadInterval)
          simulateAnalysis()
          return 100
        }
        return prev + 5
      })
    }, 100)
  }

  const simulateAnalysis = () => {
    setCurrentStep('analyze')
    setAnalysisProgress(0)
    
    const analysisInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(analysisInterval)
          setCurrentStep('results')
          return 100
        }
        return prev + 3
      })
    }, 150)
  }

  const features = [
    {
      icon: Camera,
      title: 'Real-time Recording',
      description: 'Direct camera integration with live preview and horizontal guidance'
    },
    {
      icon: Brain,
      title: 'Edge Processing',
      description: 'AI analysis happens locally on your device for instant results'
    },
    {
      icon: Zap,
      title: 'Instant Feedback',
      description: 'Get performance insights in under 10 seconds'
    },
    {
      icon: Target,
      title: 'Sport-Specific',
      description: 'Optimized analysis for basketball, football, soccer, and more'
    }
  ]

  const steps = [
    { id: 'record', title: 'Record', description: 'Capture your technique' },
    { id: 'upload', title: 'Upload', description: 'Process video data' },
    { id: 'analyze', title: 'Analyze', description: 'AI performance analysis' },
    { id: 'results', title: 'Results', description: 'View insights' }
  ]

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
            Mobile Performance Analysis
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Record, analyze, and improve your athletic performance directly from your mobile device 
            with professional-grade AI analysis
          </p>
          <div className="flex items-center justify-center gap-2">
            <Badge variant="outline" className="text-green-400 border-green-400">
              <Smartphone className="w-3 h-3 mr-1" />
              Mobile Optimized
            </Badge>
            <Badge variant="outline" className="text-blue-400 border-blue-400">
              <Brain className="w-3 h-3 mr-1" />
              Edge AI
            </Badge>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <Card key={index} className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4 text-center">
                <feature.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                <h3 className="font-medium text-white text-sm mb-1">{feature.title}</h3>
                <p className="text-xs text-slate-400">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Progress Steps */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    currentStep === step.id ? 'border-primary bg-primary text-white' :
                    steps.findIndex(s => s.id === currentStep) > index ? 'border-green-500 bg-green-500 text-white' :
                    'border-slate-600 text-slate-400'
                  }`}>
                    {steps.findIndex(s => s.id === currentStep) > index ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <span className="text-xs font-medium">{index + 1}</span>
                    )}
                  </div>
                  <div className="ml-2 text-sm">
                    <div className={`font-medium ${currentStep === step.id ? 'text-primary' : 
                      steps.findIndex(s => s.id === currentStep) > index ? 'text-green-400' : 'text-slate-400'}`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-slate-500">{step.description}</div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-0.5 mx-4 ${
                      steps.findIndex(s => s.id === currentStep) > index ? 'bg-green-500' : 'bg-slate-600'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Recording Interface */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Camera className="w-5 h-5 text-primary" />
              {currentStep === 'record' && 'Record Your Performance'}
              {currentStep === 'upload' && 'Uploading Video...'}
              {currentStep === 'analyze' && 'AI Analysis in Progress...'}
              {currentStep === 'results' && 'Analysis Complete!'}
            </CardTitle>
            <CardDescription>
              {currentStep === 'record' && 'Position your device horizontally and start recording your athletic movement'}
              {currentStep === 'upload' && 'Processing video data and preparing for analysis'}
              {currentStep === 'analyze' && 'Our AI is analyzing your performance using advanced computer vision'}
              {currentStep === 'results' && 'View your comprehensive performance analysis below'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentStep === 'record' && (
              <div className="space-y-4">
                <div className="aspect-video bg-slate-800 rounded-lg flex items-center justify-center relative overflow-hidden">
                  {isRecording ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <Camera className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                      <p className="text-slate-400">Camera preview will appear here</p>
                    </div>
                  )}
                  
                  {isRecording && (
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-white text-sm font-medium">Recording</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-center gap-4">
                  {!isRecording ? (
                    <Button onClick={startRecording} size="lg" className="bg-red-600 hover:bg-red-700">
                      <Camera className="w-4 h-4 mr-2" />
                      Start Recording
                    </Button>
                  ) : (
                    <Button onClick={stopRecording} size="lg" variant="outline">
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Stop Recording
                    </Button>
                  )}
                </div>
                
                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-400" />
                    Recording Tips
                  </h4>
                  <ul className="text-sm text-slate-400 space-y-1">
                    <li>• Hold your device horizontally (landscape mode)</li>
                    <li>• Ensure good lighting and clear view of your full body</li>
                    <li>• Record 10-30 seconds of your athletic movement</li>
                    <li>• Keep the camera steady for best analysis results</li>
                  </ul>
                </div>
              </div>
            )}

            {currentStep === 'upload' && (
              <div className="space-y-4">
                <div className="text-center">
                  <Upload className="w-16 h-16 text-primary mx-auto mb-4 animate-pulse" />
                  <h3 className="text-xl font-semibold text-white mb-2">Uploading Video</h3>
                  <p className="text-slate-400 mb-4">Processing your recording for AI analysis</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Upload Progress</span>
                    <span className="text-white">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              </div>
            )}

            {currentStep === 'analyze' && (
              <div className="space-y-4">
                <div className="text-center">
                  <Brain className="w-16 h-16 text-primary mx-auto mb-4 animate-pulse" />
                  <h3 className="text-xl font-semibold text-white mb-2">AI Analysis in Progress</h3>
                  <p className="text-slate-400 mb-4">Our advanced computer vision is analyzing your performance</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Analysis Progress</span>
                    <span className="text-white">{analysisProgress}%</span>
                  </div>
                  <Progress value={analysisProgress} className="h-2" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-slate-700/50 p-3 rounded-lg">
                    <Activity className="w-6 h-6 text-blue-400 mx-auto mb-1" />
                    <div className="text-xs text-slate-400">Pose Detection</div>
                  </div>
                  <div className="bg-slate-700/50 p-3 rounded-lg">
                    <Target className="w-6 h-6 text-green-400 mx-auto mb-1" />
                    <div className="text-xs text-slate-400">Technique Analysis</div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 'results' && (
              <div className="space-y-6">
                <div className="text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Analysis Complete!</h3>
                  <p className="text-slate-400">Your performance analysis is ready</p>
                </div>

                {/* Sample Results */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-slate-700/50 border-slate-600">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-400 mb-1">87.5</div>
                      <div className="text-sm text-slate-400">Overall Score</div>
                      <Badge variant="outline" className="mt-2 text-green-400 border-green-400">
                        Excellent
                      </Badge>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-slate-700/50 border-slate-600">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-400 mb-1">92%</div>
                      <div className="text-sm text-slate-400">Form Quality</div>
                      <Badge variant="outline" className="mt-2 text-blue-400 border-blue-400">
                        Superior
                      </Badge>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-slate-700/50 border-slate-600">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-purple-400 mb-1">Low</div>
                      <div className="text-sm text-slate-400">Injury Risk</div>
                      <Badge variant="outline" className="mt-2 text-purple-400 border-purple-400">
                        Safe
                      </Badge>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex items-center justify-center gap-4">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    View Full Analysis
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => setCurrentStep('record')}>
                    Record Another
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mobile Optimization Features */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-primary" />
              Mobile-First Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-white">Optimized Performance</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Analysis Speed</span>
                    <span className="text-green-400">Sub-10 seconds</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Battery Usage</span>
                    <span className="text-green-400">Minimal impact</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Offline Capability</span>
                    <span className="text-green-400">Full support</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Storage Required</span>
                    <span className="text-green-400">< 50MB</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium text-white">Supported Devices</h4>
                <div className="space-y-2 text-sm text-slate-400">
                  <div>• iPhone 12 and newer</div>
                  <div>• Android 10+ with 4GB+ RAM</div>
                  <div>• iPad Pro and iPad Air</div>
                  <div>• Samsung Galaxy S20+</div>
                  <div>• Google Pixel 6+</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}