import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Activity, 
  Camera, 
  Play, 
  Pause, 
  RotateCcw, 
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface BiomechanicalData {
  timestamp: number;
  jointAngles: {
    shoulder: { left: number; right: number };
    elbow: { left: number; right: number };
    hip: { left: number; right: number };
    knee: { left: number; right: number };
    ankle: { left: number; right: number };
  };
  velocityPatterns: {
    peakVelocity: number;
    accelerationPhase: number;
    decelerationPhase: number;
  };
  formEfficiency: {
    symmetryScore: number;
    stabilityScore: number;
    powerTransferScore: number;
  };
  adhdMetrics: {
    focusLevel: number;
    consistencyScore: number;
    fatigueIndicator: number;
  };
}

interface RealTimeFeedback {
  immediateAction: string;
  visualCue: string;
  adhdFriendlyTip: string;
  confidenceBooster: string;
}

export function RealTimeBiomechanics({ 
  athleteId, 
  sport = 'flag-football' 
}: { 
  athleteId: string; 
  sport: string; 
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [currentData, setCurrentData] = useState<BiomechanicalData | null>(null);
  const [feedback, setFeedback] = useState<RealTimeFeedback | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<BiomechanicalData[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (isRecording) {
      startAnalysis();
    } else {
      stopAnalysis();
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isRecording]);

  const startAnalysis = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 1280, 
          height: 720,
          facingMode: 'environment' // Use back camera if available
        } 
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Start real-time analysis
      const analysisInterval = setInterval(async () => {
        await captureAndAnalyze();
      }, 1000); // Analyze every second

      return () => clearInterval(analysisInterval);
    } catch (error) {
      console.error('Error starting video analysis:', error);
    }
  };

  const stopAnalysis = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const video = videoRef.current;

    if (!context) return;

    // Capture frame
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    // Convert to blob for analysis
    canvas.toBlob(async (blob) => {
      if (!blob) return;

      try {
        const formData = new FormData();
        formData.append('frame', blob);
        formData.append('athleteId', athleteId);
        formData.append('sport', sport);

        const response = await fetch('/api/biomechanical/analyze-frame', {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          const data: BiomechanicalData = await response.json();
          setCurrentData(data);
          setAnalysisHistory(prev => [...prev.slice(-19), data]); // Keep last 20 readings

          // Get real-time feedback
          const feedbackResponse = await fetch('/api/biomechanical/real-time-feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ currentData: data, sport })
          });

          if (feedbackResponse.ok) {
            const feedbackData: RealTimeFeedback = await feedbackResponse.json();
            setFeedback(feedbackData);
          }
        }
      } catch (error) {
        console.error('Analysis error:', error);
      }
    }, 'image/jpeg', 0.8);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const resetSession = () => {
    setAnalysisHistory([]);
    setCurrentData(null);
    setFeedback(null);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreVariant = (score: number): "default" | "secondary" | "destructive" | "outline" => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  return (
    <div className="space-y-6">
      {/* Video Feed and Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Real-Time Biomechanical Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full max-w-2xl mx-auto rounded-lg"
            />
            <canvas
              ref={canvasRef}
              className="hidden"
            />
            
            {/* Overlay indicators */}
            {currentData && isRecording && (
              <div className="absolute top-4 left-4 space-y-2">
                <Badge variant="destructive" className="animate-pulse">
                  LIVE
                </Badge>
                <Badge variant={getScoreVariant(currentData.formEfficiency.symmetryScore)}>
                  Form: {currentData.formEfficiency.symmetryScore}%
                </Badge>
              </div>
            )}
          </div>

          <div className="flex justify-center gap-4 mt-4">
            <Button
              onClick={toggleRecording}
              variant={isRecording ? "destructive" : "default"}
              className="flex items-center gap-2"
            >
              {isRecording ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isRecording ? 'Stop Analysis' : 'Start Analysis'}
            </Button>
            
            <Button
              onClick={resetSession}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Session
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Real-Time Feedback */}
      {feedback && isRecording && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Target className="h-5 w-5" />
              Live Coaching Feedback
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription className="font-semibold">
                {feedback.immediateAction}
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-white rounded-lg">
                <h4 className="font-medium text-sm text-gray-600 mb-1">Visual Cue</h4>
                <p className="text-sm">{feedback.visualCue}</p>
              </div>
              
              <div className="p-3 bg-white rounded-lg">
                <h4 className="font-medium text-sm text-gray-600 mb-1">ADHD-Friendly Tip</h4>
                <p className="text-sm">{feedback.adhdFriendlyTip}</p>
              </div>
            </div>
            
            <div className="p-3 bg-green-100 rounded-lg">
              <p className="text-sm text-green-800 font-medium">{feedback.confidenceBooster}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Metrics Dashboard */}
      {currentData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Form Efficiency
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Symmetry</span>
                  <span className={getScoreColor(currentData.formEfficiency.symmetryScore)}>
                    {currentData.formEfficiency.symmetryScore}%
                  </span>
                </div>
                <Progress value={currentData.formEfficiency.symmetryScore} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Stability</span>
                  <span className={getScoreColor(currentData.formEfficiency.stabilityScore)}>
                    {currentData.formEfficiency.stabilityScore}%
                  </span>
                </div>
                <Progress value={currentData.formEfficiency.stabilityScore} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Power Transfer</span>
                  <span className={getScoreColor(currentData.formEfficiency.powerTransferScore)}>
                    {currentData.formEfficiency.powerTransferScore}%
                  </span>
                </div>
                <Progress value={currentData.formEfficiency.powerTransferScore} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                ADHD Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Focus Level</span>
                  <span className={getScoreColor(currentData.adhdMetrics.focusLevel * 10)}>
                    {currentData.adhdMetrics.focusLevel}/10
                  </span>
                </div>
                <Progress value={currentData.adhdMetrics.focusLevel * 10} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Consistency</span>
                  <span className={getScoreColor(currentData.adhdMetrics.consistencyScore)}>
                    {currentData.adhdMetrics.consistencyScore}%
                  </span>
                </div>
                <Progress value={currentData.adhdMetrics.consistencyScore} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Energy</span>
                  <span className={getScoreColor(100 - currentData.adhdMetrics.fatigueIndicator)}>
                    {100 - currentData.adhdMetrics.fatigueIndicator}%
                  </span>
                </div>
                <Progress value={100 - currentData.adhdMetrics.fatigueIndicator} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Velocity Patterns</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Peak Velocity</span>
                <span className="font-medium">{currentData.velocityPatterns.peakVelocity.toFixed(1)} m/s</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Acceleration</span>
                <span className="font-medium">{currentData.velocityPatterns.accelerationPhase.toFixed(2)}s</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Deceleration</span>
                <span className="font-medium">{currentData.velocityPatterns.decelerationPhase.toFixed(2)}s</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Joint Angles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Knee (L/R)</span>
                <span>{currentData.jointAngles.knee.left}° / {currentData.jointAngles.knee.right}°</span>
              </div>
              <div className="flex justify-between">
                <span>Hip (L/R)</span>
                <span>{currentData.jointAngles.hip.left}° / {currentData.jointAngles.hip.right}°</span>
              </div>
              <div className="flex justify-between">
                <span>Ankle (L/R)</span>
                <span>{currentData.jointAngles.ankle.left}° / {currentData.jointAngles.ankle.right}°</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Session Progress */}
      {analysisHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Session Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                Analysis Points: {analysisHistory.length} | 
                Session Duration: {Math.round((Date.now() - analysisHistory[0].timestamp) / 60000)} minutes
              </div>
              
              {/* Progress trends */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round(analysisHistory.reduce((sum, data) => sum + data.formEfficiency.symmetryScore, 0) / analysisHistory.length)}%
                  </div>
                  <div className="text-sm text-gray-600">Avg Symmetry</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round(analysisHistory.reduce((sum, data) => sum + data.adhdMetrics.focusLevel, 0) / analysisHistory.length * 10)}%
                  </div>
                  <div className="text-sm text-gray-600">Avg Focus</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round(analysisHistory.reduce((sum, data) => sum + data.adhdMetrics.consistencyScore, 0) / analysisHistory.length)}%
                  </div>
                  <div className="text-sm text-gray-600">Consistency</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ADHD-Specific Alerts */}
      {currentData && currentData.adhdMetrics.fatigueIndicator > 70 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Energy levels are getting low. Consider taking a 2-3 minute break to recharge your focus.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}