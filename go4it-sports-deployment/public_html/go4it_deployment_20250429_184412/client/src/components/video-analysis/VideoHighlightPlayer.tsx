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
import { Award, Brain, ChevronLeft, ChevronRight, Clock, Dumbbell, ExternalLink, Maximize, Pause, Play, Share2, ThumbsUp, Volume2, VolumeX, X, Zap } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

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

interface VideoHighlightPlayerProps {
  highlight: any;
  onClose: () => void;
}

const VideoHighlightPlayer: React.FC<VideoHighlightPlayerProps> = ({ highlight, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  
  useEffect(() => {
    // Reset state when highlight changes
    setIsPlaying(false);
    setCurrentTime(0);
    
    // Auto play when a new highlight is selected
    const timer = setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(err => console.error('Error playing video:', err));
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [highlight]);
  
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
  
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    
    setCurrentTime(videoRef.current.currentTime);
  };
  
  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    
    setDuration(videoRef.current.duration);
  };
  
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    
    const newTime = parseFloat(e.target.value);
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };
  
  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };
  
  const videoUrl = highlight?.highlightPath || '';
  const scoreData = highlight?.scoreBreakdown || null;
  
  // Format created time
  const createdTime = highlight?.createdAt ? 
    formatDistanceToNow(new Date(highlight.createdAt), { addSuffix: true }) : 
    'recently';
  
  return (
    <Card className="overflow-hidden">
      <div className="relative bg-black aspect-video">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full object-contain"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
        />
        
        {/* Video Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center justify-between mb-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/20" 
              onClick={togglePlay}
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </Button>
            
            <div className="flex items-center space-x-2">
              <span className="text-white text-xs">
                {formatVideoTime(currentTime)} / {formatVideoTime(duration)}
              </span>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-white/20" 
                onClick={toggleMute}
              >
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-white/20"
              >
                <Maximize className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div className="w-full">
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 bg-white/30 rounded-full appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{highlight?.title}</CardTitle>
            <CardDescription>
              {highlight?.description || 'No description available'}
            </CardDescription>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="flex items-center">
            <Clock className="mr-1 h-3 w-3" />
            {createdTime}
          </Badge>
          
          {highlight?.sportType && (
            <Badge variant="outline" className="bg-primary/10">
              {highlight.sportType}
            </Badge>
          )}
          
          {highlight?.tags?.map((tag: string, index: number) => (
            <Badge key={index} variant="secondary" className="bg-secondary/10">
              {tag}
            </Badge>
          ))}
        </div>
        
        {highlight?.garScore && (
          <Card className="border border-primary/10">
            <CardHeader className="py-3">
              <CardTitle className="text-lg flex items-center">
                <Award className="w-5 h-5 mr-2 text-primary" />
                GAR Score
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between mb-2">
                <div className="text-3xl font-bold flex items-baseline">
                  <span className={getScoreColor(highlight.garScore)}>
                    {typeof highlight.garScore === 'number' ? highlight.garScore.toFixed(1) : '?'}
                  </span>
                  <span className="text-sm text-muted-foreground ml-1">/10</span>
                </div>
              </div>
              <Progress 
                value={highlight.garScore * 10}
                className="h-2" 
                indicatorClassName={getProgressColor(highlight.garScore)} 
              />
            </CardContent>
          </Card>
        )}
        
        {scoreData?.categories && (
          <Tabs defaultValue="categories">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="strengths">Strengths</TabsTrigger>
              <TabsTrigger value="improvements">Improvements</TabsTrigger>
            </TabsList>
            
            <TabsContent value="categories" className="pt-4 space-y-3">
              {scoreData.categories.map((category: any, idx: number) => (
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
              {scoreData.strengths?.length > 0 ? (
                <ul className="space-y-2">
                  {scoreData.strengths.map((strength: string, idx: number) => (
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
              {scoreData.improvementAreas?.length > 0 ? (
                <ul className="space-y-2">
                  {scoreData.improvementAreas.map((area: string, idx: number) => (
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
      </CardContent>
      
      <CardFooter className="flex justify-between pt-0">
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="flex items-center">
            <ThumbsUp className="w-4 h-4 mr-1" />
            Like
          </Button>
          <Button variant="outline" size="sm" className="flex items-center">
            <Share2 className="w-4 h-4 mr-1" />
            Share
          </Button>
        </div>
        
        <Button variant="outline" size="sm" className="flex items-center">
          <ExternalLink className="w-4 h-4 mr-1" />
          Full Analysis
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VideoHighlightPlayer;