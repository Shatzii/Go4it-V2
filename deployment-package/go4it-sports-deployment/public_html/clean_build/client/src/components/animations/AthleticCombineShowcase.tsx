import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  Download, 
  Share2, 
  Zap, 
  Timer, 
  Gauge, 
  ArrowUpRight, 
  Dribbble, 
  User, 
  Activity 
} from 'lucide-react';

interface CombineMetrics {
  dashTime: {
    value: number;
    tier: "elite" | "excellent" | "good" | "average" | "developing";
  };
  verticalJump: {
    value: number;
    tier: "elite" | "excellent" | "good" | "average" | "developing";
  };
  basketballSkill: {
    value: number;
    tier: "elite" | "excellent" | "good" | "average" | "developing";
  };
  agilityScore: {
    value: number;
    tier: "elite" | "excellent" | "good" | "average" | "developing";
  };
}

interface AthleticCombineShowcaseProps {
  athleteName?: string;
  athleteAge?: number;
  sportsFocus?: string;
  className?: string;
  autoPlay?: boolean;
  showControls?: boolean;
  loop?: boolean;
  width?: number | string;
  height?: number | string;
}

/**
 * Athletic Combine Showcase - High-quality 256-bit animation showcasing 
 * 40-yard dash, vertical jump, and basketball skills
 */
const AthleticCombineShowcase: React.FC<AthleticCombineShowcaseProps> = ({
  athleteName = "Demo Athlete",
  athleteAge = 16,
  sportsFocus = "Basketball",
  className = "",
  autoPlay = true,
  showControls = true,
  loop = true,
  width = "100%",
  height = "auto"
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentSegment, setCurrentSegment] = useState<'dash' | 'vertical' | 'basketball'>('dash');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  
  // Simulated metrics
  const [metrics] = useState<CombineMetrics>({
    dashTime: {
      value: 4.52,
      tier: "excellent"
    },
    verticalJump: {
      value: 36.5,
      tier: "elite"
    },
    basketballSkill: {
      value: 87,
      tier: "excellent"
    },
    agilityScore: {
      value: 92,
      tier: "elite"
    }
  });
  
  // Toggle play/pause
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };
  
  // Skip to a specific segment
  const skipToSegment = (segment: 'dash' | 'vertical' | 'basketball') => {
    if (videoRef.current) {
      let skipTime = 0;
      
      // Time markers for each segment in the demo video
      switch (segment) {
        case 'dash':
          skipTime = 0; // Start of video
          break;
        case 'vertical':
          skipTime = 15; // 15 seconds in
          break;
        case 'basketball':
          skipTime = 30; // 30 seconds in
          break;
      }
      
      videoRef.current.currentTime = skipTime;
      setCurrentSegment(segment);
      
      if (!isPlaying) {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };
  
  // Restart the video
  const restartVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsPlaying(true);
      setCurrentSegment('dash');
    }
  };
  
  // Update progress and current segment based on video time
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      
      // Calculate progress percentage
      const progressPercent = (currentTime / duration) * 100;
      setProgress(progressPercent);
      
      // Determine current segment based on time
      if (currentTime < 15) {
        setCurrentSegment('dash');
      } else if (currentTime < 30) {
        setCurrentSegment('vertical');
      } else {
        setCurrentSegment('basketball');
      }
    }
  };
  
  // Handle video end
  const handleVideoEnded = () => {
    if (loop) {
      restartVideo();
    } else {
      setIsPlaying(false);
    }
  };
  
  // Get badge color based on tier
  const getTierColor = (tier: string): "default" | "secondary" | "outline" => {
    switch (tier) {
      case "elite":
        return "default";
      case "excellent":
        return "secondary";
      default:
        return "outline";
    }
  };
  
  // Set up video with delayed loading to simulate processing
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Set up keyboard shortcuts for video control
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case ' ':
          togglePlayPause();
          break;
        case 'f':
          toggleFullscreen();
          break;
        case 'ArrowRight':
          if (currentSegment === 'dash') skipToSegment('vertical');
          else if (currentSegment === 'vertical') skipToSegment('basketball');
          break;
        case 'ArrowLeft':
          if (currentSegment === 'basketball') skipToSegment('vertical');
          else if (currentSegment === 'vertical') skipToSegment('dash');
          break;
        case 'r':
          restartVideo();
          break;
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentSegment]);
  
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">Athletic Combine Showcase</CardTitle>
          <Badge variant="secondary" className="text-xs">256-bit HDR</Badge>
        </div>
        <CardDescription>
          {athleteName}, Age {athleteAge} - {sportsFocus} Focus
        </CardDescription>
      </CardHeader>
      
      <div className="relative" ref={containerRef}>
        {/* Loading overlay */}
        <AnimatePresence>
          {!isReady && (
            <motion.div 
              className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-10"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Zap className="w-12 h-12 text-primary animate-pulse mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Rendering Quantum Animation</h3>
              <p className="text-sm text-gray-300 mb-4">Processing 256-bit HDR Pipeline</p>
              <Progress value={Math.min(100, progress * 2)} className="w-64" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Video player */}
        <div className="aspect-video bg-black">
          {isReady ? (
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay={autoPlay}
              muted
              loop={loop}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleVideoEnded}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              style={{ width, height }}
            >
              <source src="/videos/samples/athletic_combine.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="w-full h-full bg-gradient-to-b from-gray-900 to-black" />
          )}
          
          {/* Controls overlay */}
          {showControls && isReady && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex space-x-2">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-8 w-8 text-white hover:bg-white/20"
                    onClick={togglePlayPause}
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-8 w-8 text-white hover:bg-white/20"
                    onClick={restartVideo}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex-1 mx-4">
                  <Progress value={progress} className="h-1" />
                </div>
                <div className="flex space-x-2">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-8 w-8 text-white hover:bg-white/20"
                    onClick={() => toast({
                      title: "Animation Shared",
                      description: "Link copied to clipboard",
                    })}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-8 w-8 text-white hover:bg-white/20"
                    onClick={toggleFullscreen}
                  >
                    {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              {/* Segment tabs */}
              <Tabs
                value={currentSegment}
                className="w-full"
                onValueChange={(value) => skipToSegment(value as any)}
              >
                <TabsList className="grid grid-cols-3 bg-black/40 w-full">
                  <TabsTrigger value="dash" className="data-[state=active]:bg-primary/30">
                    <Timer className="h-4 w-4 mr-2" />
                    40-Yard Dash
                  </TabsTrigger>
                  <TabsTrigger value="vertical" className="data-[state=active]:bg-primary/30">
                    <ArrowUpRight className="h-4 w-4 mr-2" />
                    Vertical Jump
                  </TabsTrigger>
                  <TabsTrigger value="basketball" className="data-[state=active]:bg-primary/30">
                    <Dribbble className="h-4 w-4 mr-2" />
                    Basketball Skills
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          )}
          
          {/* Current segment metrics */}
          {isReady && (
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg p-3 text-white text-sm">
              <AnimatePresence mode="wait">
                {currentSegment === 'dash' && (
                  <motion.div
                    key="dash-metrics"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <Timer className="h-4 w-4 mr-2 text-primary" />
                        40-Yard Time
                      </span>
                      <Badge variant={getTierColor(metrics.dashTime.tier)}>
                        {metrics.dashTime.value}s
                      </Badge>
                    </div>
                    <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-primary h-full rounded-full" 
                        style={{ width: `${Math.min(100, 100 - (metrics.dashTime.value - 4.2) * 50)}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-300 mt-1">
                      Acceleration: Excellent • Top Speed: Elite
                    </div>
                  </motion.div>
                )}
                
                {currentSegment === 'vertical' && (
                  <motion.div
                    key="vertical-metrics"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <ArrowUpRight className="h-4 w-4 mr-2 text-primary" />
                        Vertical Jump
                      </span>
                      <Badge variant={getTierColor(metrics.verticalJump.tier)}>
                        {metrics.verticalJump.value}"
                      </Badge>
                    </div>
                    <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-primary h-full rounded-full" 
                        style={{ width: `${Math.min(100, (metrics.verticalJump.value / 42) * 100)}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-300 mt-1">
                      Power: Elite • Hang Time: 0.94s
                    </div>
                  </motion.div>
                )}
                
                {currentSegment === 'basketball' && (
                  <motion.div
                    key="basketball-metrics"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <Dribbble className="h-4 w-4 mr-2 text-primary" />
                        Skill Rating
                      </span>
                      <Badge variant={getTierColor(metrics.basketballSkill.tier)}>
                        {metrics.basketballSkill.value}
                      </Badge>
                    </div>
                    <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-primary h-full rounded-full" 
                        style={{ width: `${Math.min(100, metrics.basketballSkill.value)}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-300 mt-1">
                      Handling: 92 • Shooting: 83 • IQ: 88
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
      
      <CardFooter className="p-4 flex justify-between items-center">
        <div className="flex-1">
          <div className="text-sm font-semibold">
            {currentSegment === 'dash' && "40-Yard Dash"}
            {currentSegment === 'vertical' && "Vertical Jump Test"}
            {currentSegment === 'basketball' && "Basketball Skills Assessment"}
          </div>
          <div className="text-xs text-muted-foreground">
            {currentSegment === 'dash' && "Measuring acceleration and top-end speed"}
            {currentSegment === 'vertical' && "Evaluating explosive lower body power"}
            {currentSegment === 'basketball' && "One-on-one skills and game awareness"}
          </div>
        </div>
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => toast({
              title: "Download Started",
              description: "Your video is being prepared for download",
            })}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button size="sm">
            <Activity className="h-4 w-4 mr-2" />
            Full Report
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AthleticCombineShowcase;