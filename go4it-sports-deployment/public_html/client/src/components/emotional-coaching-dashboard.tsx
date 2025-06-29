import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain,
  Heart,
  Smile,
  Frown,
  Zap,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3
} from 'lucide-react';

interface EmotionalState {
  timestamp: number;
  emotions: {
    confidence: number;
    frustration: number;
    focus: number;
    motivation: number;
    anxiety: number;
    excitement: number;
  };
  adhdIndicators: {
    hyperactivityLevel: number;
    impulsivityMarkers: number;
    attentionSpan: number;
    fidgetingLevel: number;
  };
  facialAnalysis: {
    eyeContact: number;
    facialTension: number;
    smileIntensity: number;
    browFurrow: number;
  };
  bodyLanguage: {
    posture: 'alert' | 'slouched' | 'tense' | 'relaxed';
    gestureFrequency: number;
    restlessness: number;
  };
}

interface CoachingAdaptation {
  communicationStyle: 'energetic' | 'calm' | 'encouraging' | 'directive';
  sessionAdjustments: {
    breakNeeded: boolean;
    simplifyInstructions: boolean;
    increasePositiveReinforcement: boolean;
    changeActivity: boolean;
  };
  personalizedMessage: string;
  motivationalStrategy: string;
  adhdSpecificTips: string[];
}

interface FrustrationAlert {
  frustrationLevel: 'low' | 'moderate' | 'high' | 'critical';
  interventionNeeded: boolean;
  suggestedIntervention: string;
  preventiveStrategies: string[];
}

export function EmotionalCoachingDashboard({ 
  athleteId, 
  athleteProfile,
  isActive = false 
}: { 
  athleteId: string; 
  athleteProfile: any;
  isActive?: boolean;
}) {
  const [currentState, setCurrentState] = useState<EmotionalState | null>(null);
  const [adaptation, setAdaptation] = useState<CoachingAdaptation | null>(null);
  const [frustrationAlert, setFrustrationAlert] = useState<FrustrationAlert | null>(null);
  const [emotionalHistory, setEmotionalHistory] = useState<EmotionalState[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (isActive && isMonitoring) {
      startEmotionalMonitoring();
    } else {
      stopEmotionalMonitoring();
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isActive, isMonitoring]);

  const startEmotionalMonitoring = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user' // Front camera for facial analysis
        } 
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Start emotional analysis
      const analysisInterval = setInterval(async () => {
        await analyzeEmotionalState();
      }, 3000); // Analyze every 3 seconds

      return () => clearInterval(analysisInterval);
    } catch (error) {
      console.error('Error starting emotional monitoring:', error);
    }
  };

  const stopEmotionalMonitoring = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const analyzeEmotionalState = async () => {
    if (!videoRef.current) return;

    try {
      // Capture frame from video
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) return;

      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);

      canvas.toBlob(async (blob) => {
        if (!blob) return;

        const formData = new FormData();
        formData.append('image', blob);
        formData.append('athleteId', athleteId);
        formData.append('contextInfo', JSON.stringify({
          activityType: 'training',
          sessionDuration: emotionalHistory.length * 3 / 60, // Convert to minutes
          previousPerformance: 'stable'
        }));

        const response = await fetch('/api/emotional-intelligence/analyze', {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          const emotionalState: EmotionalState = await response.json();
          setCurrentState(emotionalState);
          setEmotionalHistory(prev => [...prev.slice(-19), emotionalState]); // Keep last 20 readings

          // Get coaching adaptation
          await getCoachingAdaptation(emotionalState);
          
          // Check for frustration patterns
          if (emotionalHistory.length >= 5) {
            await checkFrustrationPattern([...emotionalHistory.slice(-4), emotionalState]);
          }
        }
      }, 'image/jpeg', 0.8);
    } catch (error) {
      console.error('Emotional analysis error:', error);
    }
  };

  const getCoachingAdaptation = async (state: EmotionalState) => {
    try {
      const response = await fetch('/api/emotional-intelligence/coaching-adaptation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          athleteId,
          currentState: state,
          athleteProfile
        })
      });

      if (response.ok) {
        const adaptationData: CoachingAdaptation = await response.json();
        setAdaptation(adaptationData);
      }
    } catch (error) {
      console.error('Coaching adaptation error:', error);
    }
  };

  const checkFrustrationPattern = async (recentStates: EmotionalState[]) => {
    try {
      const response = await fetch('/api/emotional-intelligence/frustration-detection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          athleteId,
          recentStates
        })
      });

      if (response.ok) {
        const alertData: FrustrationAlert = await response.json();
        setFrustrationAlert(alertData);
      }
    } catch (error) {
      console.error('Frustration detection error:', error);
    }
  };

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
  };

  const getEmotionColor = (emotion: string, value: number) => {
    const colors = {
      confidence: value >= 70 ? 'text-green-600' : value >= 50 ? 'text-yellow-600' : 'text-red-600',
      frustration: value <= 30 ? 'text-green-600' : value <= 60 ? 'text-yellow-600' : 'text-red-600',
      focus: value >= 70 ? 'text-green-600' : value >= 50 ? 'text-yellow-600' : 'text-red-600',
      motivation: value >= 70 ? 'text-green-600' : value >= 50 ? 'text-yellow-600' : 'text-red-600',
      anxiety: value <= 30 ? 'text-green-600' : value <= 60 ? 'text-yellow-600' : 'text-red-600',
      excitement: value >= 60 ? 'text-green-600' : value >= 40 ? 'text-yellow-600' : 'text-red-600'
    };
    return colors[emotion as keyof typeof colors] || 'text-gray-600';
  };

  const getCommunicationStyleIcon = (style: string) => {
    const icons = {
      energetic: <Zap className="h-4 w-4 text-orange-500" />,
      calm: <Heart className="h-4 w-4 text-blue-500" />,
      encouraging: <Smile className="h-4 w-4 text-green-500" />,
      directive: <Target className="h-4 w-4 text-purple-500" />
    };
    return icons[style as keyof typeof icons] || <Brain className="h-4 w-4" />;
  };

  const getPostureIcon = (posture: string) => {
    const icons = {
      alert: <CheckCircle className="h-4 w-4 text-green-500" />,
      relaxed: <Smile className="h-4 w-4 text-blue-500" />,
      tense: <AlertCircle className="h-4 w-4 text-yellow-500" />,
      slouched: <Frown className="h-4 w-4 text-red-500" />
    };
    return icons[posture as keyof typeof icons] || <AlertCircle className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Monitoring Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Emotional Intelligence Coaching
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-32 h-24 rounded-lg border"
              />
              <div>
                <p className="text-sm text-gray-600">AI-powered emotion detection</p>
                <p className="text-xs text-gray-500">ADHD-aware coaching adaptations</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={toggleMonitoring}
                variant={isMonitoring ? "destructive" : "default"}
                className="flex items-center gap-2"
              >
                {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Critical Alerts */}
      {frustrationAlert && frustrationAlert.interventionNeeded && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <div className="font-semibold text-red-800">
                Frustration Level: {frustrationAlert.frustrationLevel.toUpperCase()}
              </div>
              <div className="text-red-700">
                {frustrationAlert.suggestedIntervention}
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Coaching Adaptation */}
      {adaptation && currentState && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              {getCommunicationStyleIcon(adaptation.communicationStyle)}
              Personalized Coaching Mode: {adaptation.communicationStyle}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Heart className="h-4 w-4" />
              <AlertDescription className="font-medium">
                {adaptation.personalizedMessage}
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-white rounded-lg">
                <h4 className="font-medium text-sm text-gray-600 mb-2">Session Adjustments</h4>
                <div className="space-y-1 text-sm">
                  {adaptation.sessionAdjustments.breakNeeded && (
                    <Badge variant="secondary">Break Recommended</Badge>
                  )}
                  {adaptation.sessionAdjustments.simplifyInstructions && (
                    <Badge variant="outline">Simplify Instructions</Badge>
                  )}
                  {adaptation.sessionAdjustments.increasePositiveReinforcement && (
                    <Badge variant="default">More Positive Reinforcement</Badge>
                  )}
                  {adaptation.sessionAdjustments.changeActivity && (
                    <Badge variant="destructive">Change Activity</Badge>
                  )}
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg">
                <h4 className="font-medium text-sm text-gray-600 mb-2">Motivational Strategy</h4>
                <p className="text-sm">{adaptation.motivationalStrategy}</p>
              </div>
            </div>

            <div className="p-3 bg-white rounded-lg">
              <h4 className="font-medium text-sm text-gray-600 mb-2">ADHD-Specific Tips</h4>
              <ul className="text-sm space-y-1">
                {adaptation.adhdSpecificTips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Emotional State Dashboard */}
      {currentState && (
        <Tabs defaultValue="emotions" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="emotions">Emotions</TabsTrigger>
            <TabsTrigger value="adhd">ADHD Metrics</TabsTrigger>
            <TabsTrigger value="facial">Facial Analysis</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="emotions" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(currentState.emotions).map(([emotion, value]) => (
                <Card key={emotion}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium capitalize">{emotion}</span>
                      <span className={`text-sm font-bold ${getEmotionColor(emotion, value)}`}>
                        {value}%
                      </span>
                    </div>
                    <Progress value={value} className="h-2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="adhd" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Activity Levels
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Hyperactivity</span>
                      <span>{currentState.adhdIndicators.hyperactivityLevel}%</span>
                    </div>
                    <Progress value={currentState.adhdIndicators.hyperactivityLevel} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Fidgeting</span>
                      <span>{currentState.adhdIndicators.fidgetingLevel}%</span>
                    </div>
                    <Progress value={currentState.adhdIndicators.fidgetingLevel} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Restlessness</span>
                      <span>{currentState.bodyLanguage.restlessness}%</span>
                    </div>
                    <Progress value={currentState.bodyLanguage.restlessness} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Attention & Focus
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.round(currentState.adhdIndicators.attentionSpan / 60)}m
                    </div>
                    <div className="text-sm text-gray-600">Attention Span</div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Impulsivity</span>
                      <span>{currentState.adhdIndicators.impulsivityMarkers}%</span>
                    </div>
                    <Progress value={currentState.adhdIndicators.impulsivityMarkers} className="h-2" />
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    {getPostureIcon(currentState.bodyLanguage.posture)}
                    <span>Posture: {currentState.bodyLanguage.posture}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="facial" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {currentState.facialAnalysis.eyeContact}%
                  </div>
                  <div className="text-sm text-gray-600">Eye Contact</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {currentState.facialAnalysis.smileIntensity}%
                  </div>
                  <div className="text-sm text-gray-600">Smile Intensity</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {currentState.facialAnalysis.facialTension}%
                  </div>
                  <div className="text-sm text-gray-600">Facial Tension</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {currentState.facialAnalysis.browFurrow}%
                  </div>
                  <div className="text-sm text-gray-600">Concentration</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Session Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                {emotionalHistory.length > 0 ? (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {Math.round(emotionalHistory.reduce((sum, state) => sum + state.emotions.focus, 0) / emotionalHistory.length)}%
                      </div>
                      <div className="text-sm text-gray-600">Avg Focus</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {Math.round(emotionalHistory.reduce((sum, state) => sum + state.emotions.confidence, 0) / emotionalHistory.length)}%
                      </div>
                      <div className="text-sm text-gray-600">Avg Confidence</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {Math.round(emotionalHistory.reduce((sum, state) => sum + state.emotions.motivation, 0) / emotionalHistory.length)}%
                      </div>
                      <div className="text-sm text-gray-600">Avg Motivation</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    Start monitoring to see emotional trends
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}