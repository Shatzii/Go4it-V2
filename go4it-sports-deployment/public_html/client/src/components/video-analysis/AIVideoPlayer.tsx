import React, { useState, useRef, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from '@/hooks/use-toast';
import {
  Award,
  Brain,
  ChevronLeft,
  ChevronRight,
  Clock,
  Dumbbell,
  ExternalLink,
  Eye,
  Maximize,
  Minimize,
  Pause,
  Play,
  Share2,
  ThumbsUp,
  Volume2,
  VolumeX,
  X,
  Zap,
  Camera,
  FileVideo,
  Upload,
  CheckCircle2
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

// Types
export type VideoPlayerMode = 'workout' | 'highlights' | 'analysis' | 'stream' | 'match';

export interface MotionMarker {
  x: number;
  y: number;
  name?: string;
  color?: string;
}

export interface AnalysisPoint {
  timestamp: number;
  label: string;
  description?: string;
}

interface VideoMetadata {
  title?: string;
  description?: string;
  uploadDate?: Date;
  duration?: number;
  sport?: string;
  tags?: string[];
  views?: number;
}

export interface AIVideoPlayerProps {
  src: string;
  thumbnail?: string;
  mode: VideoPlayerMode;
  motionMarkers?: MotionMarker[];
  keyFrameTimestamps?: number[];
  analysisPoints?: AnalysisPoint[];
  garScore?: number;
  scoreBreakdown?: any;
  metadata?: VideoMetadata;
  onClose?: () => void;
  onAnalyze?: () => void;
  onVerify?: (verificationData: any) => void;
  className?: string;
  controls?: {
    showFullscreen?: boolean;
    showShare?: boolean;
    showAnalysisPanel?: boolean;
  };
}

// Helper function to format seconds to MM:SS
const formatVideoTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

// Helper function to determine score color
const getScoreColor = (score: number): string => {
  if (score >= 8.5) return 'text-emerald-500';
  if (score >= 7) return 'text-green-500';
  if (score >= 5.5) return 'text-amber-500';
  if (score >= 4) return 'text-orange-500';
  return 'text-red-500';
};

// Helper function to get progress color
const getProgressColor = (score: number): string => {
  if (score >= 8.5) return 'bg-emerald-500';
  if (score >= 7) return 'bg-green-500';
  if (score >= 5.5) return 'bg-amber-500';
  if (score >= 4) return 'bg-orange-500';
  return 'bg-red-500';
};

// Helper function to get category icon
const getCategoryIcon = (category: string) => {
  switch (category?.toLowerCase()) {
    case 'physical':
      return <Dumbbell className="w-5 h-5 mr-2" />;
    case 'psychological':
      return <Brain className="w-5 h-5 mr-2" />;
    case 'technical':
      return <Zap className="w-5 h-5 mr-2" />;
    default:
      return <Award className="w-5 h-5 mr-2" />;
  }
};

const AIVideoPlayer: React.FC<AIVideoPlayerProps> = ({
  src,
  thumbnail,
  mode,
  motionMarkers = [],
  keyFrameTimestamps = [],
  analysisPoints = [],
  garScore,
  scoreBreakdown,
  metadata = {},
  onClose,
  onAnalyze,
  onVerify,
  className,
  controls = {
    showFullscreen: true,
    showShare: true,
    showAnalysisPanel: true
  }
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [hideControlsTimeout, setHideControlsTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(controls.showAnalysisPanel !== false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  useEffect(() => {
    // Reset state when video changes
    setIsPlaying(false);
    setCurrentTime(0);
    
    // Auto play when a new video is selected
    const timer = setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(err => console.error('Error playing video:', err));
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [src]);
  
  useEffect(() => {
    // Initialize video when component mounts
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (video) {
        video.currentTime = 0;
      }
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
    };
  }, []);
  
  // Handle fullscreen mode
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  // Handle auto-hide controls
  useEffect(() => {
    if (!showControls) return;
    
    const resetTimer = () => {
      if (hideControlsTimeout) {
        clearTimeout(hideControlsTimeout);
      }
      
      const timeout = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false);
        }
      }, 3000); // Hide after 3 seconds of inactivity
      
      setHideControlsTimeout(timeout);
    };
    
    resetTimer();
    
    return () => {
      if (hideControlsTimeout) {
        clearTimeout(hideControlsTimeout);
      }
    };
  }, [showControls, isPlaying]);
  
  // UI interaction handlers
  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };
  
  const toggleMute = () => {
    if (!videoRef.current) return;
    
    const newMutedState = !isMuted;
    videoRef.current.muted = newMutedState;
    setIsMuted(newMutedState);
  };
  
  const handleSeek = (value: number[]) => {
    if (!videoRef.current) return;
    
    const newTime = value[0];
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };
  
  const jumpToKeyFrame = (timestamp: number) => {
    if (!videoRef.current) return;
    
    videoRef.current.currentTime = timestamp;
    setCurrentTime(timestamp);
    if (!isPlaying) {
      togglePlay();
    }
  };
  
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };
  
  const handleMouseMove = () => {
    setShowControls(true);
  };
  
  const handleVolumeChange = (value: number[]) => {
    if (!videoRef.current) return;
    
    const newVolume = value[0];
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };
  
  // Function to handle workout verification
  const handleVerifyWorkout = () => {
    if (!onVerify) return;
    
    setIsVerifying(true);
    
    // This would normally analyze the workout video
    // and send the verification data back
    setTimeout(() => {
      const mockVerificationData = {
        isCompleted: true,
        accuracy: 85,
        form: 'good',
        repetitions: 12,
        feedback: 'Good form overall, keep your core engaged throughout the movement.'
      };
      
      onVerify(mockVerificationData);
      setIsVerifying(false);
      
      toast({
        title: 'Workout Verified',
        description: 'Your workout has been analyzed and verified.',
      });
    }, 2000);
  };
  
  // Function to handle video analysis
  const handleAnalyzeVideo = () => {
    if (!onAnalyze) return;
    
    setIsAnalyzing(true);
    
    // Trigger the provided analysis function
    onAnalyze();
    
    // For demonstration purposes
    setTimeout(() => {
      setIsAnalyzing(false);
      
      toast({
        title: 'Analysis Complete',
        description: 'Your video has been analyzed with AI.',
      });
    }, 2000);
  };
  
  // Function to capture the current frame
  const captureFrame = () => {
    if (!videoRef.current) return;
    
    // Pause the video
    videoRef.current.pause();
    setIsPlaying(false);
    
    // Create a canvas element to capture the current frame
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Draw the current video frame onto the canvas
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      
      // Convert the canvas to a data URL and trigger a download
      try {
        const dataUrl = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `${metadata.title || 'frame'}-${Math.floor(currentTime)}.png`;
        a.click();
        
        toast({
          title: 'Frame Captured',
          description: 'The current frame has been saved to your downloads.',
        });
      } catch (error) {
        console.error('Error capturing frame:', error);
        toast({
          variant: 'destructive',
          title: 'Capture Failed',
          description: 'There was an error capturing the current frame.',
        });
      }
    }
  };
  
  // Determine which mode-specific controls and UI to show
  const renderModeSpecificControls = () => {
    switch (mode) {
      case 'workout':
        return (
          <Button 
            variant="default" 
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={handleVerifyWorkout}
            disabled={isVerifying}
          >
            {isVerifying ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Verifying...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Verify Workout
              </>
            )}
          </Button>
        );
        
      case 'analysis':
        return (
          <Button 
            variant="default" 
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleAnalyzeVideo}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Analyzing...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Analyze
              </>
            )}
          </Button>
        );
        
      case 'highlights':
      case 'match':
      case 'stream':
      default:
        return null;
    }
  };
  
  // Format created time
  const createdTime = metadata?.uploadDate ? 
    formatDistanceToNow(new Date(metadata.uploadDate), { addSuffix: true }) : 
    'recently';
  
  return (
    <div 
      className={cn("relative bg-card rounded-lg overflow-hidden shadow-lg", className)}
      ref={containerRef}
      onMouseMove={handleMouseMove}
    >
      <div className="relative bg-black aspect-video">
        <video
          ref={videoRef}
          src={src}
          className="w-full h-full object-contain"
          poster={thumbnail}
          preload="metadata"
          onClick={togglePlay}
        />
        
        {/* Motion analysis markers */}
        {motionMarkers.map((marker, index) => (
          <div
            key={index}
            className={cn(
              "absolute border-2 rounded-full animate-pulse",
              marker.color ? `border-${marker.color}` : "border-secondary"
            )}
            style={{
              top: `${marker.y * 100}%`,
              left: `${marker.x * 100}%`,
              width: "15px",
              height: "15px",
              transform: "translate(-50%, -50%)",
            }}
            title={marker.name || `Marker ${index + 1}`}
          />
        ))}
        
        {/* Play button overlay when paused */}
        {!isPlaying && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 cursor-pointer"
            onClick={togglePlay}
          >
            <div className="bg-white bg-opacity-90 rounded-full p-3 hover:bg-opacity-100 transition">
              <Play className="h-8 w-8 text-primary" />
            </div>
          </div>
        )}
        
        {/* Video Controls */}
        {showControls && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-white hover:bg-white/20" 
                        onClick={togglePlay}
                      >
                        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isPlaying ? 'Pause' : 'Play'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <span className="text-white text-xs">
                  {formatVideoTime(currentTime)} / {formatVideoTime(duration)}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                {/* Volume control */}
                <div className="flex items-center space-x-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-white hover:bg-white/20" 
                          onClick={toggleMute}
                        >
                          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{isMuted ? 'Unmute' : 'Mute'}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <div className="w-20 hidden sm:block">
                    <Slider
                      value={[isMuted ? 0 : volume]}
                      max={1}
                      step={0.01}
                      onValueChange={handleVolumeChange}
                      className="cursor-pointer"
                    />
                  </div>
                </div>
                
                {/* Capture frame button */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-white hover:bg-white/20"
                        onClick={captureFrame}
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Capture Frame</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                {/* Fullscreen button */}
                {controls.showFullscreen && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-white hover:bg-white/20"
                          onClick={toggleFullscreen}
                        >
                          {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                
                {/* Toggle analysis panel */}
                {controls.showAnalysisPanel && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-white hover:bg-white/20"
                          onClick={() => setShowAnalysis(!showAnalysis)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{showAnalysis ? 'Hide Analysis' : 'Show Analysis'}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                
                {/* Close button if provided */}
                {onClose && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-white hover:bg-white/20"
                          onClick={onClose}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Close</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>
            
            <div className="w-full">
              <Slider
                value={[currentTime]}
                max={duration || 100}
                step={0.1}
                onValueChange={handleSeek}
                className="cursor-pointer"
              />
            </div>
            
            {/* Key frame timestamps */}
            {keyFrameTimestamps.length > 0 && (
              <div className="flex flex-wrap items-center mt-2 gap-2">
                <span className="text-xs text-white">Key moments:</span>
                {keyFrameTimestamps.map((timestamp, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs bg-primary/20 hover:bg-primary/30 border-primary/30 text-white cursor-pointer"
                    onClick={() => jumpToKeyFrame(timestamp)}
                  >
                    {formatVideoTime(timestamp)}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Video Information and Analysis Panel */}
      {showAnalysis && (
        <div className="p-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold">{metadata?.title || 'Video Title'}</h3>
              <p className="text-sm text-muted-foreground">
                {metadata?.description || 'No description available'}
              </p>
              
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <Badge variant="outline" className="flex items-center">
                  <Clock className="mr-1 h-3 w-3" />
                  {createdTime}
                </Badge>
                
                {metadata?.sport && (
                  <Badge variant="outline" className="bg-primary/10">
                    {metadata.sport}
                  </Badge>
                )}
                
                {metadata?.views !== undefined && (
                  <Badge variant="outline">
                    <Eye className="mr-1 h-3 w-3" />
                    {metadata.views.toLocaleString()} views
                  </Badge>
                )}
                
                {metadata?.tags?.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="bg-secondary/10">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            {renderModeSpecificControls()}
          </div>
          
          {/* GAR Score if available */}
          {garScore !== undefined && (
            <Card className="border border-primary/10 mb-4">
              <CardHeader className="py-3">
                <CardTitle className="text-lg flex items-center">
                  <Award className="w-5 h-5 mr-2 text-primary" />
                  GAR Score
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-3xl font-bold flex items-baseline">
                    <span className={getScoreColor(garScore)}>
                      {typeof garScore === 'number' ? garScore.toFixed(1) : '?'}
                    </span>
                    <span className="text-sm text-muted-foreground ml-1">/10</span>
                  </div>
                </div>
                <Progress 
                  value={garScore * 10}
                  className="h-2" 
                />
              </CardContent>
            </Card>
          )}
          
          {/* Analysis Points */}
          {analysisPoints && analysisPoints.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold mb-2 flex items-center">
                <Brain className="w-4 h-4 mr-2" />
                Analysis Points
              </h4>
              <div className="space-y-2">
                {analysisPoints.map((point, index) => (
                  <div 
                    key={index} 
                    className="border rounded-lg p-3 flex items-center justify-between cursor-pointer hover:bg-accent"
                    onClick={() => jumpToKeyFrame(point.timestamp)}
                  >
                    <div>
                      <div className="font-medium">{point.label}</div>
                      {point.description && (
                        <p className="text-sm text-muted-foreground">{point.description}</p>
                      )}
                    </div>
                    <Badge variant="outline" className="ml-2">
                      {formatVideoTime(point.timestamp)}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Score Breakdown if available */}
          {scoreBreakdown && (
            <Tabs defaultValue="categories" className="mb-4">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="categories">Categories</TabsTrigger>
                <TabsTrigger value="strengths">Strengths</TabsTrigger>
                <TabsTrigger value="improvements">Areas to Improve</TabsTrigger>
              </TabsList>
              
              <TabsContent value="categories" className="pt-4 space-y-3">
                {scoreBreakdown.categories?.map((category: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center">
                      {getCategoryIcon(category.category)}
                      <span>{category.category}</span>
                    </div>
                    <Badge variant="outline" className={getScoreColor(category.overallScore)}>
                      {category.overallScore.toFixed(1)}/10
                    </Badge>
                  </div>
                ))}
              </TabsContent>
              
              <TabsContent value="strengths" className="pt-4">
                {scoreBreakdown.strengths?.length > 0 ? (
                  <ul className="space-y-2">
                    {scoreBreakdown.strengths.map((strength: string, idx: number) => (
                      <li key={idx} className="flex items-start">
                        <ChevronRight className="w-5 h-5 mr-2 text-primary shrink-0 mt-0.5" />
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No strengths data available</p>
                )}
              </TabsContent>
              
              <TabsContent value="improvements" className="pt-4">
                {scoreBreakdown.improvementAreas?.length > 0 ? (
                  <ul className="space-y-2">
                    {scoreBreakdown.improvementAreas.map((area: string, idx: number) => (
                      <li key={idx} className="flex items-start">
                        <ChevronRight className="w-5 h-5 mr-2 text-primary shrink-0 mt-0.5" />
                        <span>{area}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No improvement data available</p>
                )}
              </TabsContent>
            </Tabs>
          )}
          
          {/* Action buttons */}
          <div className="flex justify-between">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex items-center">
                <ThumbsUp className="w-4 h-4 mr-1" />
                Like
              </Button>
              {controls.showShare && (
                <Button variant="outline" size="sm" className="flex items-center">
                  <Share2 className="w-4 h-4 mr-1" />
                  Share
                </Button>
              )}
            </div>
            
            <Button variant="outline" size="sm" className="flex items-center" onClick={handleAnalyzeVideo}>
              <FileVideo className="w-4 h-4 mr-1" />
              Full Analysis
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIVideoPlayer;