import { useState, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Play,
  Pause,
  RotateCcw,
  Download,
  Eye,
  Activity,
  Brain,
  Zap,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Cpu,
  HardDrive,
  BarChart3,
  Video,
  Camera,
  Layers,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AnalysisResult {
  id: string;
  timestamp: number;
  confidence: number;
  category: 'biomechanics' | 'technique' | 'performance' | 'movement';
  title: string;
  description: string;
  recommendations: string[];
  metrics: {
    accuracy: number;
    speed: number;
    consistency: number;
    power: number;
  };
}

interface ModelInfo {
  id: string;
  name: string;
  version: string;
  type: 'pose_estimation' | 'object_detection' | 'motion_analysis' | 'technique_classification';
  status: 'active' | 'loading' | 'error' | 'offline';
  accuracy: number;
  processingSpeed: number;
  description: string;
  capabilities: string[];
}

const availableModels: ModelInfo[] = [
  {
    id: 'mediapipe-pose',
    name: 'MediaPipe Pose',
    version: '0.10.7',
    type: 'pose_estimation',
    status: 'active',
    accuracy: 94.2,
    processingSpeed: 85,
    description: 'Real-time human pose estimation for biomechanical analysis',
    capabilities: ['Joint tracking', 'Body landmarks', 'Movement patterns', 'Posture analysis']
  },
  {
    id: 'yolo-sports',
    name: 'YOLO Sports Detection',
    version: '8.0.196',
    type: 'object_detection',
    status: 'active',
    accuracy: 91.8,
    processingSpeed: 92,
    description: 'Specialized sports equipment and ball tracking',
    capabilities: ['Ball tracking', 'Equipment detection', 'Player identification', 'Boundary detection']
  },
  {
    id: 'openpose-advanced',
    name: 'OpenPose Advanced',
    version: '1.7.0',
    type: 'pose_estimation',
    status: 'loading',
    accuracy: 96.5,
    processingSpeed: 68,
    description: 'High-precision multi-person pose estimation',
    capabilities: ['Multi-person tracking', 'Facial landmarks', 'Hand keypoints', 'Foot tracking']
  },
  {
    id: 'motion-classifier',
    name: 'Motion Classifier AI',
    version: '2.1.3',
    type: 'motion_analysis',
    status: 'active',
    accuracy: 89.7,
    processingSpeed: 76,
    description: 'Custom-trained motion pattern recognition',
    capabilities: ['Technique scoring', 'Movement efficiency', 'Injury risk assessment', 'Performance metrics']
  }
];

export default function SelfHostedVideoAnalysis() {
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [selectedModels, setSelectedModels] = useState<string[]>(['mediapipe-pose', 'yolo-sports']);
  const [systemStats, setSystemStats] = useState({
    cpuUsage: 45,
    memoryUsage: 62,
    gpuUsage: 78,
    diskSpace: 34
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setUploadedVideo(file);
      setAnalysisResults([]);
      setAnalysisProgress(0);
    }
  };

  const startAnalysis = async () => {
    if (!uploadedVideo) return;

    setIsAnalyzing(true);
    setAnalysisProgress(0);

    // Simulate progressive analysis
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsAnalyzing(false);
          generateAnalysisResults();
          return 100;
        }
        return prev + Math.random() * 10;
      });
    }, 500);
  };

  const generateAnalysisResults = () => {
    const mockResults: AnalysisResult[] = [
      {
        id: '1',
        timestamp: 2.3,
        confidence: 94.2,
        category: 'biomechanics',
        title: 'Optimal Knee Flexion Detected',
        description: 'Excellent knee angle at impact phase showing proper biomechanical form',
        recommendations: [
          'Maintain current knee flexion angle',
          'Focus on consistent timing',
          'Continue strength training for leg stability'
        ],
        metrics: { accuracy: 94, speed: 87, consistency: 91, power: 89 }
      },
      {
        id: '2',
        timestamp: 4.7,
        confidence: 87.6,
        category: 'technique',
        title: 'Hand Position Adjustment Needed',
        description: 'Hand placement shows 15° deviation from optimal position',
        recommendations: [
          'Adjust grip position slightly higher',
          'Practice controlled grip exercises',
          'Work on hand-eye coordination drills'
        ],
        metrics: { accuracy: 76, speed: 92, consistency: 84, power: 88 }
      },
      {
        id: '3',
        timestamp: 7.1,
        confidence: 91.8,
        category: 'performance',
        title: 'Excellent Power Transfer',
        description: 'Kinetic chain shows optimal energy transfer from ground up',
        recommendations: [
          'Replicate this movement pattern',
          'Video analysis for technique reinforcement',
          'Progressive loading exercises'
        ],
        metrics: { accuracy: 89, speed: 95, consistency: 87, power: 96 }
      }
    ];

    setAnalysisResults(mockResults);
  };

  const toggleModel = (modelId: string) => {
    setSelectedModels(prev => 
      prev.includes(modelId) 
        ? prev.filter(id => id !== modelId)
        : [...prev, modelId]
    );
  };

  const getStatusIcon = (status: ModelInfo['status']) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'loading': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'offline': return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const renderModelSelection = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white mb-4">AI Model Configuration</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {availableModels.map((model) => (
          <Card 
            key={model.id} 
            className={cn(
              "cursor-pointer transition-all duration-300 border-2",
              selectedModels.includes(model.id) 
                ? "border-cyan-400 bg-cyan-50 shadow-lg shadow-cyan-400/20" 
                : "border-gray-200 hover:border-cyan-300"
            )}
            onClick={() => toggleModel(model.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{model.name}</CardTitle>
                    <p className="text-sm text-gray-600">v{model.version}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(model.status)}
                  <Badge className={cn(
                    "text-xs",
                    selectedModels.includes(model.id) 
                      ? "bg-cyan-100 text-cyan-700" 
                      : "bg-gray-100 text-gray-700"
                  )}>
                    {selectedModels.includes(model.id) ? 'Selected' : 'Available'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{model.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-cyan-600">{model.accuracy}%</div>
                  <div className="text-xs text-gray-600">Accuracy</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-cyan-600">{model.processingSpeed}</div>
                  <div className="text-xs text-gray-600">Speed Score</div>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium mb-2">Capabilities</div>
                <div className="flex flex-wrap gap-1">
                  {model.capabilities.map((capability) => (
                    <Badge key={capability} variant="outline" className="text-xs">
                      {capability}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderSystemMonitoring = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white mb-4">System Performance</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'CPU Usage', value: systemStats.cpuUsage, icon: Cpu, color: 'text-cyan-500' },
          { label: 'Memory', value: systemStats.memoryUsage, icon: HardDrive, color: 'text-cyan-600' },
          { label: 'GPU Usage', value: systemStats.gpuUsage, icon: Zap, color: 'text-cyan-400' },
          { label: 'Disk Space', value: systemStats.diskSpace, icon: HardDrive, color: 'text-cyan-500' }
        ].map((stat) => (
          <Card key={stat.label} className="p-4">
            <div className="flex items-center justify-between mb-3">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <span className="text-2xl font-bold text-cyan-500">{stat.value}%</span>
            </div>
            <div className="text-sm text-gray-600 mb-2">{stat.label}</div>
            <Progress value={stat.value} className="h-2" />
          </Card>
        ))}
      </div>
    </div>
  );

  const renderAnalysisResults = () => (
    <div className="space-y-4">
      {analysisResults.map((result, index) => (
        <motion.div
          key={result.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    result.category === 'biomechanics' && "bg-cyan-100 text-cyan-600",
                    result.category === 'technique' && "bg-cyan-100 text-cyan-600",
                    result.category === 'performance' && "bg-cyan-100 text-cyan-600",
                    result.category === 'movement' && "bg-cyan-100 text-cyan-600"
                  )}>
                    {result.category === 'biomechanics' && <Activity className="w-5 h-5" />}
                    {result.category === 'technique' && <Target className="w-5 h-5" />}
                    {result.category === 'performance' && <TrendingUp className="w-5 h-5" />}
                    {result.category === 'movement' && <Eye className="w-5 h-5" />}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{result.title}</CardTitle>
                    <p className="text-sm text-gray-600">
                      @ {result.timestamp}s • {result.confidence}% confidence
                    </p>
                  </div>
                </div>
                <Badge className="bg-cyan-100 text-cyan-700 capitalize">
                  {result.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">{result.description}</p>
              
              {/* Metrics */}
              <div className="grid grid-cols-4 gap-4 mb-4">
                {Object.entries(result.metrics).map(([key, value]) => (
                  <div key={key} className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-cyan-600">{value}</div>
                    <div className="text-xs text-gray-600 capitalize">{key}</div>
                  </div>
                ))}
              </div>

              {/* Recommendations */}
              <div>
                <div className="font-medium mb-2">Recommendations</div>
                <ul className="space-y-1">
                  {result.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <Card className="go4it-card">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
            <Brain className="w-6 h-6" />
            Self-Hosted AI Video Analysis
          </CardTitle>
        </CardHeader>
      </Card>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800 border-slate-700">
          <TabsTrigger value="upload" className="flex items-center gap-2 data-[state=active]:bg-cyan-600">
            <Upload className="w-4 h-4" />
            Upload & Analyze
          </TabsTrigger>
          <TabsTrigger value="models" className="flex items-center gap-2 data-[state=active]:bg-cyan-600">
            <Settings className="w-4 h-4" />
            AI Models
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center gap-2 data-[state=active]:bg-cyan-600">
            <BarChart3 className="w-4 h-4" />
            Results
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="flex items-center gap-2 data-[state=active]:bg-cyan-600">
            <Activity className="w-4 h-4" />
            System Monitor
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-6">
          <div className="bg-white rounded-lg p-6 space-y-6">
            {/* Video Upload */}
            <div 
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-300 cursor-pointer",
                "border-gray-300 hover:border-cyan-400 hover:bg-cyan-50"
              )}
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Video className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              {uploadedVideo ? (
                <div>
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    {uploadedVideo.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {(uploadedVideo.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Click to upload your training video
                  </p>
                  <p className="text-sm text-gray-600">
                    Supports MP4, MOV, AVI, MKV • Max 2GB
                  </p>
                </div>
              )}
            </div>

            {/* Selected Models Display */}
            {selectedModels.length > 0 && (
              <div>
                <h4 className="font-medium mb-3">Selected AI Models ({selectedModels.length})</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedModels.map(modelId => {
                    const model = availableModels.find(m => m.id === modelId);
                    return model ? (
                      <Badge key={modelId} className="bg-cyan-100 text-cyan-700">
                        {model.name}
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            {/* Analysis Controls */}
            <div className="flex gap-4">
              <Button 
                onClick={startAnalysis}
                disabled={!uploadedVideo || isAnalyzing}
                className="flex-1"
              >
                {isAnalyzing ? (
                  <>
                    <Activity className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Start AI Analysis
                  </>
                )}
              </Button>
              <Button variant="outline" disabled={!uploadedVideo}>
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
            </div>

            {/* Progress */}
            {isAnalyzing && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Processing with AI models...</span>
                  <span>{Math.round(analysisProgress)}%</span>
                </div>
                <Progress value={analysisProgress} className="h-3" />
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="models" className="mt-6">
          <div className="bg-white rounded-lg p-6">
            {renderModelSelection()}
          </div>
        </TabsContent>

        <TabsContent value="results" className="mt-6">
          <div className="bg-white rounded-lg p-6">
            {analysisResults.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Analysis Results</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export Report
                    </Button>
                    <Button variant="outline" size="sm">
                      <Camera className="w-4 h-4 mr-2" />
                      Generate Highlights
                    </Button>
                  </div>
                </div>
                {renderAnalysisResults()}
              </>
            ) : (
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">No Analysis Results</h3>
                <p className="text-gray-600">
                  Upload and analyze a video to see detailed AI insights
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="mt-6">
          <div className="bg-white rounded-lg p-6">
            {renderSystemMonitoring()}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}