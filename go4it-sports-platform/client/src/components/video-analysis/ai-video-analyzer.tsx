import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  Upload,
  Eye,
  Target,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Zap,
  Clock,
  Activity,
  Camera,
  Brain,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BiomechanicsPoint {
  x: number;
  y: number;
  confidence: number;
  joint: string;
}

interface FrameAnalysis {
  frameNumber: number;
  timestamp: number;
  biomechanics: BiomechanicsPoint[];
  formScore: number;
  criticalIssues: string[];
  suggestions: string[];
  velocity: number;
  acceleration: number;
  balance: number;
}

interface VideoAnalysisResult {
  overallGarScore: number;
  skillBreakdown: {
    speed: number;
    accuracy: number;
    decision: number;
    technique: number;
  };
  keyFrames: FrameAnalysis[];
  improvements: {
    priority: 'high' | 'medium' | 'low';
    category: string;
    description: string;
    timeframe: string;
  }[];
  strengthAreas: string[];
  comparisonData: {
    personalBest: number;
    peerAverage: number;
    professionalBenchmark: number;
  };
}

interface AIVideoAnalyzerProps {
  onAnalysisComplete: (result: VideoAnalysisResult) => void;
  existingVideo?: string;
}

export default function AIVideoAnalyzer({ onAnalysisComplete, existingVideo }: AIVideoAnalyzerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(existingVideo || null);
  const [analysisResult, setAnalysisResult] = useState<VideoAnalysisResult | null>(null);
  const [selectedFrame, setSelectedFrame] = useState<FrameAnalysis | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const analysisPhases = [
    { name: 'Processing Video', duration: 2000 },
    { name: 'Extracting Key Frames', duration: 1500 },
    { name: 'Analyzing Biomechanics', duration: 3000 },
    { name: 'Calculating GAR Metrics', duration: 2000 },
    { name: 'Generating Recommendations', duration: 1500 }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setAnalysisResult(null);
    }
  };

  const startAnalysis = async () => {
    if (!videoUrl) return;

    setIsAnalyzing(true);
    setProgress(0);
    
    let totalProgress = 0;
    
    for (let i = 0; i < analysisPhases.length; i++) {
      const phase = analysisPhases[i];
      setCurrentPhase(phase.name);
      
      await new Promise(resolve => {
        const interval = setInterval(() => {
          totalProgress += 20 / (phase.duration / 100);
          setProgress(Math.min(totalProgress, (i + 1) * 20));
        }, 100);
        
        setTimeout(() => {
          clearInterval(interval);
          resolve(void 0);
        }, phase.duration);
      });
    }

    // Simulate AI analysis with realistic data patterns
    const mockResult: VideoAnalysisResult = {
      overallGarScore: 87.5,
      skillBreakdown: {
        speed: 92,
        accuracy: 85,
        decision: 88,
        technique: 85
      },
      keyFrames: [
        {
          frameNumber: 45,
          timestamp: 1.5,
          biomechanics: [
            { x: 150, y: 100, confidence: 0.95, joint: 'shoulder' },
            { x: 160, y: 150, confidence: 0.92, joint: 'elbow' },
            { x: 180, y: 200, confidence: 0.88, joint: 'wrist' }
          ],
          formScore: 88,
          criticalIssues: ['Slight forward lean'],
          suggestions: ['Keep chest up', 'Engage core'],
          velocity: 12.5,
          acceleration: 8.2,
          balance: 85
        },
        {
          frameNumber: 120,
          timestamp: 4.0,
          biomechanics: [
            { x: 200, y: 90, confidence: 0.97, joint: 'shoulder' },
            { x: 210, y: 140, confidence: 0.94, joint: 'elbow' },
            { x: 230, y: 190, confidence: 0.91, joint: 'wrist' }
          ],
          formScore: 94,
          criticalIssues: [],
          suggestions: ['Perfect form - maintain this position'],
          velocity: 15.8,
          acceleration: 10.1,
          balance: 92
        }
      ],
      improvements: [
        {
          priority: 'high',
          category: 'Form Correction',
          description: 'Focus on maintaining upright posture during acceleration phase',
          timeframe: '2-3 weeks'
        },
        {
          priority: 'medium',
          category: 'Speed Development',
          description: 'Increase stride frequency while maintaining form',
          timeframe: '4-6 weeks'
        }
      ],
      strengthAreas: ['Acceleration mechanics', 'Balance control', 'Decision timing'],
      comparisonData: {
        personalBest: 85.2,
        peerAverage: 78.5,
        professionalBenchmark: 95.0
      }
    };

    setAnalysisResult(mockResult);
    setIsAnalyzing(false);
    setProgress(100);
    onAnalysisComplete(mockResult);
  };

  return (
    <div className="space-y-6">
      <Card className="go4it-card">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
            <Brain className="w-6 h-6" />
            AI Video Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!videoUrl ? (
            <div className="text-center py-12">
              <Camera className="w-16 h-16 mx-auto mb-4 text-slate-400" />
              <h3 className="text-lg font-semibold text-white mb-2">Upload Training Video</h3>
              <p className="text-slate-300 mb-6">Get instant AI-powered biomechanics analysis and form feedback</p>
              
              <input
                type="file"
                accept="video/*"
                onChange={handleFileUpload}
                ref={fileInputRef}
                className="hidden"
              />
              
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose Video File
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  src={videoUrl}
                  controls
                  className="w-full h-auto"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
                
                {selectedFrame && (
                  <div className="absolute top-4 left-4 bg-black/80 rounded-lg p-3 text-white">
                    <div className="text-sm font-semibold mb-1">Frame Analysis</div>
                    <div className="text-xs space-y-1">
                      <div>Form Score: {selectedFrame.formScore}%</div>
                      <div>Velocity: {selectedFrame.velocity} m/s</div>
                      <div>Balance: {selectedFrame.balance}%</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4">
                <Button
                  onClick={startAnalysis}
                  disabled={isAnalyzing}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isAnalyzing ? (
                    <>
                      <Activity className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Start AI Analysis
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    setVideoFile(null);
                    setVideoUrl(null);
                    setAnalysisResult(null);
                  }}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Upload New Video
                </Button>
              </div>

              {isAnalyzing && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-800 rounded-lg p-4 border border-slate-700"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Activity className="w-5 h-5 text-blue-400 animate-spin" />
                    <span className="text-white font-medium">{currentPhase}</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <div className="text-xs text-slate-400 mt-2">{Math.round(progress)}% complete</div>
                </motion.div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <AnimatePresence>
        {analysisResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <Card className="go4it-card">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white">Analysis Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-lg text-white">
                    <div className="text-3xl font-bold">{analysisResult.overallGarScore}</div>
                    <div className="text-sm opacity-90">Overall GAR Score</div>
                    <div className="text-xs mt-1">
                      +{(analysisResult.overallGarScore - analysisResult.comparisonData.personalBest).toFixed(1)} from personal best
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {Object.entries(analysisResult.skillBreakdown).map(([skill, value]) => (
                      <div key={skill} className="flex justify-between items-center">
                        <span className="text-slate-300 capitalize">{skill}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-slate-700 rounded">
                            <div 
                              className="h-2 bg-blue-500 rounded"
                              style={{ width: `${value}%` }}
                            />
                          </div>
                          <span className="text-white font-medium">{value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-white mb-2">Strength Areas</h4>
                    {analysisResult.strengthAreas.map((area, index) => (
                      <Badge key={index} variant="secondary" className="mr-1 mb-1">
                        {area}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-white mb-2">Comparison</h4>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-300">Personal Best</span>
                        <span className="text-white">{analysisResult.comparisonData.personalBest}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300">Peer Average</span>
                        <span className="text-white">{analysisResult.comparisonData.peerAverage}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300">Pro Benchmark</span>
                        <span className="text-white">{analysisResult.comparisonData.professionalBenchmark}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardContent className="p-0">
                <Tabs defaultValue="improvements" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="improvements">Improvements</TabsTrigger>
                    <TabsTrigger value="keyframes">Key Frames</TabsTrigger>
                    <TabsTrigger value="biomechanics">Biomechanics</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="improvements" className="p-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Recommended Improvements</h3>
                      {analysisResult.improvements.map((improvement, index) => (
                        <div key={index} className="flex items-start gap-3 p-4 border rounded-lg">
                          <div className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center text-white text-xs",
                            improvement.priority === 'high' && "bg-red-500",
                            improvement.priority === 'medium' && "bg-yellow-500",
                            improvement.priority === 'low' && "bg-green-500"
                          )}>
                            {improvement.priority === 'high' && <AlertTriangle className="w-3 h-3" />}
                            {improvement.priority === 'medium' && <Clock className="w-3 h-3" />}
                            {improvement.priority === 'low' && <CheckCircle className="w-3 h-3" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{improvement.category}</h4>
                              <Badge variant="outline" className="text-xs">
                                {improvement.timeframe}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">{improvement.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="keyframes" className="p-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Key Frame Analysis</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {analysisResult.keyFrames.map((frame, index) => (
                          <div 
                            key={index} 
                            className={cn(
                              "p-4 border rounded-lg cursor-pointer transition-all",
                              selectedFrame?.frameNumber === frame.frameNumber 
                                ? "border-blue-500 bg-blue-50" 
                                : "hover:border-gray-300"
                            )}
                            onClick={() => {
                              setSelectedFrame(frame);
                              if (videoRef.current) {
                                videoRef.current.currentTime = frame.timestamp;
                              }
                            }}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">Frame {frame.frameNumber}</span>
                              <Badge variant="outline">{frame.timestamp}s</Badge>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Form Score:</span>
                                <span className="font-medium">{frame.formScore}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Velocity:</span>
                                <span className="font-medium">{frame.velocity} m/s</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Balance:</span>
                                <span className="font-medium">{frame.balance}%</span>
                              </div>
                              {frame.criticalIssues.length > 0 && (
                                <div className="mt-2">
                                  <div className="text-red-600 text-xs font-medium mb-1">Issues:</div>
                                  {frame.criticalIssues.map((issue, i) => (
                                    <div key={i} className="text-xs text-red-600">• {issue}</div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="biomechanics" className="p-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Biomechanics Analysis</h3>
                      {selectedFrame ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                              <div className="text-2xl font-bold text-blue-600">{selectedFrame.velocity}</div>
                              <div className="text-sm text-gray-600">Velocity (m/s)</div>
                            </div>
                            <div className="text-center p-3 bg-green-50 rounded-lg">
                              <div className="text-2xl font-bold text-green-600">{selectedFrame.acceleration}</div>
                              <div className="text-sm text-gray-600">Acceleration (m/s²)</div>
                            </div>
                            <div className="text-center p-3 bg-purple-50 rounded-lg">
                              <div className="text-2xl font-bold text-purple-600">{selectedFrame.balance}%</div>
                              <div className="text-sm text-gray-600">Balance Score</div>
                            </div>
                            <div className="text-center p-3 bg-orange-50 rounded-lg">
                              <div className="text-2xl font-bold text-orange-600">{selectedFrame.formScore}%</div>
                              <div className="text-sm text-gray-600">Form Score</div>
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium mb-2">Detected Joint Points</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                              {selectedFrame.biomechanics.map((point, index) => (
                                <div key={index} className="flex justify-between items-center p-2 bg-white rounded">
                                  <span className="capitalize">{point.joint}</span>
                                  <span className="text-sm font-medium">{Math.round(point.confidence * 100)}%</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {selectedFrame.suggestions.length > 0 && (
                            <div className="bg-green-50 p-4 rounded-lg">
                              <h4 className="font-medium text-green-800 mb-2">Suggestions</h4>
                              {selectedFrame.suggestions.map((suggestion, index) => (
                                <div key={index} className="text-sm text-green-700">• {suggestion}</div>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          Select a key frame to view detailed biomechanics analysis
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}