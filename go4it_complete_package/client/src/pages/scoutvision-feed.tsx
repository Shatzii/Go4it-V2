import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Video,
  Upload,
  Play,
  ChevronLeft,
  Filter,
  Eye,
  Star,
  FileVideo,
  User,
  TrendingUp,
  Calendar,
  Tag,
  Bookmark,
  Share2,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Check,
  ChevronDown,
  Heart,
  Trophy,
  Clock,
  ArrowUp,
  ArrowDown,
  Scissors,
  MoreVertical,
  Sparkles,
  Award
} from "lucide-react";

// Types for scout vision feed
interface HighlightVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  playerName: string;
  playerAvatar?: string;
  sport: string;
  position: string;
  class: string; // Freshman, Sophomore, etc.
  uploadDate: Date;
  duration: string;
  viewCount: number;
  likes: number;
  comments: number;
  tags: string[];
  highlightType: "game" | "practice" | "combine" | "skills" | "other";
  aiScore: number;
  aiTags: {
    tag: string;
    confidence: number;
  }[];
  aiInsights: string[];
  isSaved: boolean;
  isLiked: boolean;
  keyMoments: {
    time: string;
    description: string;
    thumbnail?: string;
  }[];
}

// Filter types
interface VideoFilters {
  sport: string;
  position: string;
  class: string;
  highlightType: string;
  minAiScore: number;
  sortBy: string;
  searchQuery: string;
}

// Comment type
interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  timestamp: Date;
  likes: number;
  isLiked: boolean;
}

export default function ScoutVisionFeed() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [activeVideo, setActiveVideo] = useState<HighlightVideo | null>(null);
  const [filters, setFilters] = useState<VideoFilters>({
    sport: "all",
    position: "all",
    class: "all",
    highlightType: "all",
    minAiScore: 0,
    sortBy: "trending",
    searchQuery: ""
  });
  const [showFilters, setShowFilters] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch videos from API
  const { data: videos, isLoading: isVideosLoading, error: videosError } = useQuery({
    queryKey: ['/api/scoutvision/highlights', filters],
    enabled: !!user,
  });
  
  // Fetch comments for active video
  const { data: comments, isLoading: isCommentsLoading } = useQuery({
    queryKey: ['/api/scoutvision/comments', activeVideo?.id],
    enabled: !!activeVideo,
  });
  
  // Fetch trending tags
  const { data: trendingTags, isLoading: isTagsLoading } = useQuery({
    queryKey: ['/api/scoutvision/trending-tags'],
    enabled: !!user,
  });
  
  // Fetch recommended highlights
  const { data: recommendedVideos, isLoading: isRecommendedLoading } = useQuery({
    queryKey: ['/api/scoutvision/recommended'],
    enabled: !!user,
  });
  
  // Handle like/save mutations
  const likeVideoMutation = useMutation({
    mutationFn: async (videoId: string) => {
      return await apiRequest('POST', `/api/scoutvision/highlights/${videoId}/like`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/scoutvision/highlights'] });
      if (activeVideo) {
        queryClient.invalidateQueries({ queryKey: ['/api/scoutvision/highlights', activeVideo.id] });
      }
    }
  });
  
  const saveVideoMutation = useMutation({
    mutationFn: async (videoId: string) => {
      return await apiRequest('POST', `/api/scoutvision/highlights/${videoId}/save`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/scoutvision/highlights'] });
      queryClient.invalidateQueries({ queryKey: ['/api/scoutvision/saved'] });
    }
  });
  
  const addCommentMutation = useMutation({
    mutationFn: async ({ videoId, content }: { videoId: string, content: string }) => {
      return await apiRequest('POST', `/api/scoutvision/highlights/${videoId}/comments`, { content });
    },
    onSuccess: () => {
      if (activeVideo) {
        queryClient.invalidateQueries({ queryKey: ['/api/scoutvision/comments', activeVideo.id] });
      }
    }
  });
  
  // Mock data until endpoints are ready
  const mockVideos: HighlightVideo[] = [
    {
      id: "1",
      title: "Championship Game Highlights",
      description: "Incredible performance with 32 points, 8 rebounds, and 5 assists in the state championship game.",
      thumbnailUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YmFza2V0YmFsbCUyMGdhbWV8ZW58MHx8MHx8fDA%3D",
      videoUrl: "https://example.com/video1.mp4",
      playerName: "Marcus Johnson",
      playerAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
      sport: "Basketball",
      position: "Point Guard",
      class: "Senior",
      uploadDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      duration: "3:24",
      viewCount: 12483,
      likes: 843,
      comments: 56,
      tags: ["championship", "point guard", "clutch", "scoring"],
      highlightType: "game",
      aiScore: 92,
      aiTags: [
        { tag: "ball handling", confidence: 0.92 },
        { tag: "three-point shooting", confidence: 0.87 },
        { tag: "court vision", confidence: 0.82 },
        { tag: "leadership", confidence: 0.79 }
      ],
      aiInsights: [
        "Excellent court vision and passing ability",
        "High basketball IQ demonstrated in late-game situations",
        "Quick first step when driving to the basket",
        "Shot selection could improve in 3rd quarter sequences"
      ],
      isSaved: false,
      isLiked: true,
      keyMoments: [
        { time: "0:34", description: "Step-back three pointer" },
        { time: "1:15", description: "No-look assist" },
        { time: "2:03", description: "Crossover and drive" },
        { time: "2:47", description: "Game-winning shot" }
      ]
    },
    {
      id: "2",
      title: "Quarterback Showcase - College Combine",
      description: "Showcase of arm talent, accuracy, and mobility at the Elite QB Combine.",
      thumbnailUrl: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YW1lcmljYW4lMjBmb290YmFsbHxlbnwwfHwwfHx8MA%3D%3D",
      videoUrl: "https://example.com/video2.mp4",
      playerName: "Tyler Williams",
      playerAvatar: "https://randomuser.me/api/portraits/men/45.jpg",
      sport: "Football",
      position: "Quarterback",
      class: "Junior",
      uploadDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      duration: "4:17",
      viewCount: 8752,
      likes: 634,
      comments: 42,
      tags: ["quarterback", "combine", "arm talent", "mobility"],
      highlightType: "combine",
      aiScore: 88,
      aiTags: [
        { tag: "throwing mechanics", confidence: 0.91 },
        { tag: "footwork", confidence: 0.85 },
        { tag: "deep ball accuracy", confidence: 0.82 },
        { tag: "pocket presence", confidence: 0.78 }
      ],
      aiInsights: [
        "Exceptional throwing mechanics with clean release point",
        "Consistent footwork in both drops and rollouts",
        "Demonstrates excellent velocity on intermediate throws",
        "Could improve progression reads under pressure"
      ],
      isSaved: true,
      isLiked: false,
      keyMoments: [
        { time: "0:42", description: "60-yard deep throw" },
        { time: "1:32", description: "Roll-out accuracy drill" },
        { time: "2:28", description: "Pressure simulation" },
        { time: "3:45", description: "Mobility showcase" }
      ]
    },
    {
      id: "3",
      title: "Striker Skills Training Highlights",
      description: "Advanced striker training session showcasing finishing, movement, and technical skills.",
      thumbnailUrl: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c29jY2VyJTIwcGxheWVyfGVufDB8fDB8fHww",
      videoUrl: "https://example.com/video3.mp4",
      playerName: "Sofia Rodriguez",
      playerAvatar: "https://randomuser.me/api/portraits/women/28.jpg",
      sport: "Soccer",
      position: "Striker",
      class: "Sophomore",
      uploadDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      duration: "5:03",
      viewCount: 6245,
      likes: 412,
      comments: 38,
      tags: ["striker", "finishing", "technical", "training"],
      highlightType: "skills",
      aiScore: 94,
      aiTags: [
        { tag: "finishing", confidence: 0.95 },
        { tag: "first touch", confidence: 0.91 },
        { tag: "off-ball movement", confidence: 0.87 },
        { tag: "shooting technique", confidence: 0.89 }
      ],
      aiInsights: [
        "Elite finishing ability with both feet",
        "Exceptional first touch under pressure",
        "Creative in tight spaces around the box",
        "High work rate during defensive transitions"
      ],
      isSaved: false,
      isLiked: false,
      keyMoments: [
        { time: "0:38", description: "Volley technique drill" },
        { time: "1:47", description: "First-touch finishing" },
        { time: "3:12", description: "Tight space drills" },
        { time: "4:23", description: "Pressure finishing" }
      ]
    },
    {
      id: "4",
      title: "Defensive End Season Highlights",
      description: "Dominant defensive performance with 12 sacks, 18 TFL, and 3 forced fumbles.",
      thumbnailUrl: "https://images.unsplash.com/photo-1528164344705-47542687000d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGFtZXJpY2FuJTIwZm9vdGJhbGx8ZW58MHx8MHx8fDA%3D",
      videoUrl: "https://example.com/video4.mp4",
      playerName: "Jamal Thompson",
      playerAvatar: "https://randomuser.me/api/portraits/men/18.jpg",
      sport: "Football",
      position: "Defensive End",
      class: "Senior",
      uploadDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
      duration: "6:12",
      viewCount: 9856,
      likes: 721,
      comments: 45,
      tags: ["defensive end", "pass rush", "sacks", "force fumble"],
      highlightType: "game",
      aiScore: 90,
      aiTags: [
        { tag: "pass rush", confidence: 0.93 },
        { tag: "hand technique", confidence: 0.89 },
        { tag: "run defense", confidence: 0.84 },
        { tag: "motor", confidence: 0.91 }
      ],
      aiInsights: [
        "Elite first step off the line of scrimmage",
        "Variety of pass rush moves including swim, rip, and bull rush",
        "Strong at the point of attack against the run",
        "High motor player who pursues from the backside"
      ],
      isSaved: true,
      isLiked: true,
      keyMoments: [
        { time: "0:45", description: "Strip sack" },
        { time: "1:52", description: "TFL on 3rd down" },
        { time: "3:10", description: "Pass rush combo move" },
        { time: "5:23", description: "Game-sealing sack" }
      ]
    },
    {
      id: "5",
      title: "Setter Volleyball Highlights",
      description: "Exceptional setting, serving, and defensive plays throughout championship tournament.",
      thumbnailUrl: "https://images.unsplash.com/photo-1590657366953-54c25c7ef2df?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dm9sbGV5YmFsbHxlbnwwfHwwfHx8MA%3D%3D",
      videoUrl: "https://example.com/video5.mp4",
      playerName: "Emma Chen",
      playerAvatar: "https://randomuser.me/api/portraits/women/33.jpg",
      sport: "Volleyball",
      position: "Setter",
      class: "Junior",
      uploadDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      duration: "4:38",
      viewCount: 5734,
      likes: 398,
      comments: 29,
      tags: ["setter", "volleyball", "assists", "serve"],
      highlightType: "game",
      aiScore: 89,
      aiTags: [
        { tag: "setting technique", confidence: 0.94 },
        { tag: "court awareness", confidence: 0.91 },
        { tag: "serve placement", confidence: 0.88 },
        { tag: "defensive positioning", confidence: 0.85 }
      ],
      aiInsights: [
        "Exceptional hand positioning on sets to different positions",
        "Strategic decision making in offensive distribution",
        "Effective jump serve with targeted placement",
        "Quick defensive reactions and court coverage"
      ],
      isSaved: false,
      isLiked: true,
      keyMoments: [
        { time: "0:32", description: "Back set to outside" },
        { time: "1:24", description: "Jump serve ace" },
        { time: "2:17", description: "Setter dump" },
        { time: "3:45", description: "Defensive dig" }
      ]
    }
  ];
  
  const mockComments: Comment[] = [
    {
      id: "1",
      userId: "user1",
      userName: "Coach Thompson",
      userAvatar: "https://randomuser.me/api/portraits/men/42.jpg",
      content: "Excellent footwork and court awareness. I'd like to see more aggressive drives to the basket in future highlights.",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      likes: 12,
      isLiked: false
    },
    {
      id: "2",
      userId: "user2",
      userName: "Sarah Williams",
      userAvatar: "https://randomuser.me/api/portraits/women/21.jpg",
      content: "That step-back three at 2:15 was incredible! Great shooting form.",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      likes: 8,
      isLiked: true
    },
    {
      id: "3",
      userId: "user3",
      userName: "Michael Carter",
      userAvatar: "https://randomuser.me/api/portraits/men/15.jpg",
      content: "Really impressed with the basketball IQ shown here. Making the right decisions under pressure is key.",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      likes: 5,
      isLiked: false
    }
  ];
  
  const mockTrendingTags = [
    "ball handling", "three-point shooting", "rebounding", "post moves", 
    "passing", "defense", "footwork", "court vision", "leadership",
    "shooting form", "finishing", "athleticism", "combine", "game winner"
  ];
  
  // Use API data if available, otherwise use mock data
  const displayedVideos = videos || mockVideos;
  const displayedComments = comments || (activeVideo ? mockComments : []);
  const displayedTags = trendingTags || mockTrendingTags;
  const displayedRecommended = recommendedVideos || mockVideos.slice(0, 3);
  
  // Handle video play/pause
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
  
  // Update current time during video playback
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };
  
  // Set duration when video metadata is loaded
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };
  
  // Format time in MM:SS
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  // Handle seek on progress bar click
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current && duration > 0) {
      const progressBar = e.currentTarget;
      const rect = progressBar.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / progressBar.offsetWidth;
      videoRef.current.currentTime = pos * duration;
    }
  };
  
  // Handle filter changes
  const handleFilterChange = (key: keyof VideoFilters, value: string | number) => {
    setFilters({ ...filters, [key]: value });
  };
  
  // Apply search query
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, searchQuery: searchValue });
  };
  
  // Handle upload simulation
  const handleUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadDialogOpen(false);
          toast({
            title: "Upload Successful",
            description: "Your highlight video has been uploaded and is being processed.",
          });
          return 0;
        }
        return prev + 5;
      });
    }, 200);
  };
  
  // Jump to a key moment in the video
  const jumpToKeyMoment = (timeString: string) => {
    if (videoRef.current) {
      const [minutes, seconds] = timeString.split(':').map(Number);
      const timeInSeconds = minutes * 60 + seconds;
      videoRef.current.currentTime = timeInSeconds;
    }
  };
  
  // Format number for view counts
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };
  
  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Loading state
  if (isVideosLoading && !displayedVideos.length) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-36" />
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <Skeleton className="h-10 w-full" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <Card key={i}>
                <div className="aspect-video bg-muted">
                  <Skeleton className="h-full w-full" />
                </div>
                <CardHeader>
                  <Skeleton className="h-4 w-2/3 mb-2" />
                  <Skeleton className="h-4 w-1/3" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">ScoutVision Feed</h1>
          <p className="text-muted-foreground">AI-powered highlight analysis and scouting tool</p>
        </div>
        <Button onClick={() => setUploadDialogOpen(true)}>
          <Upload className="mr-2 h-4 w-4" />
          Upload Highlights
        </Button>
      </div>
      
      {/* Search and filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search highlights, players, or skills..."
                className="pl-8"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </form>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center"
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
            <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {filters.sortBy === "trending" && "Trending"}
                {filters.sortBy === "newest" && "Newest"}
                {filters.sortBy === "oldest" && "Oldest"}
                {filters.sortBy === "aiScore" && "AI Score"}
                {filters.sortBy === "views" && "Most Viewed"}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Sort By</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleFilterChange("sortBy", "trending")}>
                <TrendingUp className="mr-2 h-4 w-4" />
                Trending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterChange("sortBy", "newest")}>
                <Calendar className="mr-2 h-4 w-4" />
                Newest
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterChange("sortBy", "oldest")}>
                <Clock className="mr-2 h-4 w-4" />
                Oldest
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterChange("sortBy", "aiScore")}>
                <Award className="mr-2 h-4 w-4" />
                AI Score
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterChange("sortBy", "views")}>
                <Eye className="mr-2 h-4 w-4" />
                Most Viewed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="sport">Sport</Label>
                      <Select 
                        value={filters.sport}
                        onValueChange={(value) => handleFilterChange("sport", value)}
                      >
                        <SelectTrigger id="sport">
                          <SelectValue placeholder="All Sports" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Sports</SelectItem>
                          <SelectItem value="basketball">Basketball</SelectItem>
                          <SelectItem value="football">Football</SelectItem>
                          <SelectItem value="soccer">Soccer</SelectItem>
                          <SelectItem value="volleyball">Volleyball</SelectItem>
                          <SelectItem value="baseball">Baseball</SelectItem>
                          <SelectItem value="lacrosse">Lacrosse</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="position">Position</Label>
                      <Select 
                        value={filters.position}
                        onValueChange={(value) => handleFilterChange("position", value)}
                      >
                        <SelectTrigger id="position">
                          <SelectValue placeholder="All Positions" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Positions</SelectItem>
                          {/* Basketball positions */}
                          <SelectItem value="point_guard">Point Guard</SelectItem>
                          <SelectItem value="shooting_guard">Shooting Guard</SelectItem>
                          <SelectItem value="small_forward">Small Forward</SelectItem>
                          <SelectItem value="power_forward">Power Forward</SelectItem>
                          <SelectItem value="center">Center</SelectItem>
                          {/* Football positions */}
                          <SelectItem value="quarterback">Quarterback</SelectItem>
                          <SelectItem value="running_back">Running Back</SelectItem>
                          <SelectItem value="wide_receiver">Wide Receiver</SelectItem>
                          <SelectItem value="defensive_end">Defensive End</SelectItem>
                          {/* Soccer positions */}
                          <SelectItem value="striker">Striker</SelectItem>
                          <SelectItem value="midfielder">Midfielder</SelectItem>
                          <SelectItem value="defender">Defender</SelectItem>
                          <SelectItem value="goalkeeper">Goalkeeper</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="class">Class</Label>
                      <Select 
                        value={filters.class}
                        onValueChange={(value) => handleFilterChange("class", value)}
                      >
                        <SelectTrigger id="class">
                          <SelectValue placeholder="All Classes" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Classes</SelectItem>
                          <SelectItem value="freshman">Freshman</SelectItem>
                          <SelectItem value="sophomore">Sophomore</SelectItem>
                          <SelectItem value="junior">Junior</SelectItem>
                          <SelectItem value="senior">Senior</SelectItem>
                          <SelectItem value="graduate">Graduate</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="type">Highlight Type</Label>
                      <Select 
                        value={filters.highlightType}
                        onValueChange={(value) => handleFilterChange("highlightType", value)}
                      >
                        <SelectTrigger id="type">
                          <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="game">Game</SelectItem>
                          <SelectItem value="practice">Practice</SelectItem>
                          <SelectItem value="combine">Combine</SelectItem>
                          <SelectItem value="skills">Skills Training</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="aiScore">Minimum AI Score: {filters.minAiScore}</Label>
                      <span className="text-sm text-muted-foreground">
                        {filters.minAiScore} / 100
                      </span>
                    </div>
                    <Slider
                      id="aiScore"
                      min={0}
                      max={100}
                      step={5}
                      value={[filters.minAiScore]}
                      onValueChange={(value) => handleFilterChange("minAiScore", value[0])}
                    />
                  </div>
                  
                  <div className="mt-4 flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setFilters({
                        sport: "all",
                        position: "all",
                        class: "all",
                        highlightType: "all",
                        minAiScore: 0,
                        sortBy: "trending",
                        searchQuery: ""
                      })}
                    >
                      Reset Filters
                    </Button>
                    <Button onClick={() => setShowFilters(false)}>
                      Apply Filters
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Trending tags */}
        <ScrollArea className="w-full whitespace-nowrap pb-2">
          <div className="flex space-x-2">
            {displayedTags.map((tag, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="cursor-pointer hover:bg-primary/10 transition-colors py-1 px-3"
                onClick={() => setSearchValue(tag)}
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        </ScrollArea>
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 gap-6">
        {/* Video player when a video is selected */}
        {activeVideo && (
          <Card className="overflow-hidden">
            <div className="relative">
              <div className="aspect-video bg-black relative">
                <video
                  ref={videoRef}
                  src={activeVideo.videoUrl}
                  poster={activeVideo.thumbnailUrl}
                  className="w-full h-full object-contain"
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onClick={togglePlayPause}
                />
                
                {/* Play/pause overlay */}
                {!isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div 
                      className="h-16 w-16 rounded-full bg-black/70 flex items-center justify-center cursor-pointer hover:bg-black/80 transition-colors"
                      onClick={togglePlayPause}
                    >
                      <Play className="h-8 w-8" />
                    </div>
                  </div>
                )}
                
                {/* Video controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <div className="flex items-center space-x-2 mb-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-white hover:bg-white/20"
                      onClick={togglePlayPause}
                    >
                      {isPlaying ? (
                        <span className="i-lucide-pause h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <span className="text-xs text-white">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>
                  
                  {/* Progress bar */}
                  <div 
                    className="h-1 bg-white/30 rounded overflow-hidden cursor-pointer"
                    onClick={handleSeek}
                  >
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
              <div className="md:col-span-2">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold">{activeVideo.title}</h2>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <Eye className="h-4 w-4 mr-1" />
                      {formatNumber(activeVideo.viewCount)} views
                      <span className="mx-2">•</span>
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(activeVideo.uploadDate)}
                    </div>
                  </div>
                  <Badge className="flex items-center">
                    <Award className="h-4 w-4 mr-1" />
                    AI Score: {activeVideo.aiScore}
                  </Badge>
                </div>
                
                <p className="text-muted-foreground mb-4">
                  {activeVideo.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge variant="secondary">
                    {activeVideo.sport}
                  </Badge>
                  <Badge variant="secondary">
                    {activeVideo.position}
                  </Badge>
                  <Badge variant="secondary">
                    {activeVideo.class}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {activeVideo.highlightType}
                  </Badge>
                  {activeVideo.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={activeVideo.playerAvatar} alt={activeVideo.playerName} />
                      <AvatarFallback>{activeVideo.playerName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{activeVideo.playerName}</div>
                      <div className="text-sm text-muted-foreground">
                        {activeVideo.position} • {activeVideo.class}
                      </div>
                    </div>
                  </div>
                  <Button variant="outline">
                    <User className="mr-2 h-4 w-4" />
                    View Profile
                  </Button>
                </div>
                
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant={activeVideo.isLiked ? "default" : "outline"}
                      size="sm"
                      onClick={() => likeVideoMutation.mutate(activeVideo.id)}
                      className="flex items-center"
                    >
                      <ThumbsUp className="mr-2 h-4 w-4" />
                      {formatNumber(activeVideo.likes)}
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      {formatNumber(activeVideo.comments)}
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant={activeVideo.isSaved ? "default" : "outline"}
                      size="sm"
                      onClick={() => saveVideoMutation.mutate(activeVideo.id)}
                    >
                      <Bookmark className={`mr-2 h-4 w-4 ${activeVideo.isSaved ? "fill-current" : ""}`} />
                      {activeVideo.isSaved ? "Saved" : "Save"}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </div>
                
                <Tabs defaultValue="comments">
                  <TabsList className="mb-4">
                    <TabsTrigger value="comments" className="flex items-center">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Comments
                    </TabsTrigger>
                    <TabsTrigger value="aiAnalysis" className="flex items-center">
                      <Sparkles className="mr-2 h-4 w-4" />
                      AI Analysis
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="comments" className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.profileImage} alt="Your avatar" />
                        <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Textarea 
                          placeholder="Add a comment..."
                          className="resize-none"
                          rows={2}
                        />
                        <div className="flex justify-end mt-2">
                          <Button size="sm">
                            Post Comment
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {displayedComments.length > 0 ? (
                      <div className="space-y-4">
                        {displayedComments.map((comment) => (
                          <div key={comment.id} className="flex items-start gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={comment.userAvatar} alt={comment.userName} />
                              <AvatarFallback>{comment.userName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center">
                                <div className="font-medium">{comment.userName}</div>
                                <span className="mx-2 text-xs text-muted-foreground">•</span>
                                <div className="text-xs text-muted-foreground">
                                  {formatDate(comment.timestamp)}
                                </div>
                              </div>
                              <p className="mt-1 text-sm">{comment.content}</p>
                              <div className="flex items-center mt-1 space-x-2">
                                <button className="text-xs text-muted-foreground hover:text-foreground flex items-center">
                                  <ThumbsUp className={`h-3 w-3 mr-1 ${comment.isLiked ? "text-primary fill-primary" : ""}`} />
                                  {comment.likes > 0 && comment.likes}
                                </button>
                                <button className="text-xs text-muted-foreground hover:text-foreground">
                                  Reply
                                </button>
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>Report Comment</DropdownMenuItem>
                                <DropdownMenuItem>Copy Text</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                        <h3 className="text-lg font-medium">No Comments Yet</h3>
                        <p className="text-sm text-muted-foreground">
                          Be the first to comment on this highlight
                        </p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="aiAnalysis">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center text-lg">
                          <Sparkles className="mr-2 h-5 w-5 text-primary" />
                          AI Skill Analysis
                        </CardTitle>
                        <CardDescription>
                          AI-powered breakdown of player skills and highlights
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div>
                          <h4 className="text-sm font-medium mb-3">Key Skill Tags</h4>
                          <div className="space-y-3">
                            {activeVideo.aiTags.map((tag, index) => (
                              <div key={index}>
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm">{tag.tag}</span>
                                  <span className="text-sm font-medium">{Math.round(tag.confidence * 100)}%</span>
                                </div>
                                <Progress value={tag.confidence * 100} className="h-2" />
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-3">AI Insights</h4>
                          <ul className="space-y-2">
                            {activeVideo.aiInsights.map((insight, index) => (
                              <li key={index} className="flex items-start space-x-2 text-sm">
                                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span>{insight}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-3">Key Moments</h4>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {activeVideo.keyMoments.map((moment, index) => (
                              <Card key={index} className="overflow-hidden cursor-pointer hover:border-primary transition-colors">
                                <div 
                                  className="aspect-video bg-muted relative"
                                  onClick={() => jumpToKeyMoment(moment.time)}
                                >
                                  {moment.thumbnail ? (
                                    <img 
                                      src={moment.thumbnail} 
                                      alt={moment.description} 
                                      className="w-full h-full object-cover" 
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-black/50">
                                      <Play className="h-8 w-8" />
                                    </div>
                                  )}
                                  <div className="absolute top-2 right-2">
                                    <Badge variant="secondary" className="text-xs px-2">
                                      {moment.time}
                                    </Badge>
                                  </div>
                                </div>
                                <CardContent className="p-2">
                                  <p className="text-xs">{moment.description}</p>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Recommended Highlights
                  </h3>
                  <div className="space-y-3">
                    {displayedRecommended.filter(v => v.id !== activeVideo.id).map((video) => (
                      <Card key={video.id} className="overflow-hidden cursor-pointer hover:border-primary transition-colors" onClick={() => setActiveVideo(video)}>
                        <div className="flex">
                          <div className="w-1/3 relative">
                            <div className="aspect-video bg-muted">
                              <img 
                                src={video.thumbnailUrl} 
                                alt={video.title} 
                                className="w-full h-full object-cover" 
                              />
                            </div>
                            <div className="absolute bottom-1 right-1">
                              <Badge variant="secondary" className="text-xs px-1.5">
                                {video.duration}
                              </Badge>
                            </div>
                          </div>
                          <div className="w-2/3 p-3">
                            <h4 className="font-medium text-sm line-clamp-2">{video.title}</h4>
                            <div className="flex items-center mt-1">
                              <span className="text-xs text-muted-foreground">{video.playerName}</span>
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              <Eye className="h-3 w-3 mr-1" />
                              {formatNumber(video.viewCount)}
                              <span className="mx-1">•</span>
                              <span className="text-[10px]">{formatDate(video.uploadDate)}</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
                
                <Button variant="outline" className="w-full justify-start" onClick={() => setActiveVideo(null)}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back to All Highlights
                </Button>
              </div>
            </div>
          </Card>
        )}
        
        {/* Video grid when no video is selected */}
        {!activeVideo && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayedVideos.length > 0 ? (
              displayedVideos.map((video) => (
                <Card 
                  key={video.id} 
                  className="overflow-hidden cursor-pointer hover:border-primary transition-colors"
                  onClick={() => setActiveVideo(video)}
                >
                  <div className="aspect-video bg-muted relative">
                    <img 
                      src={video.thumbnailUrl} 
                      alt={video.title} 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/50">
                      <Play className="h-12 w-12" />
                    </div>
                    <div className="absolute bottom-2 right-2">
                      <Badge variant="secondary" className="px-2 py-1">
                        {video.duration}
                      </Badge>
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge className="flex items-center">
                        <Award className="h-3 w-3 mr-1" />
                        {video.aiScore}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="text-base">{video.title}</CardTitle>
                    <CardDescription className="flex items-center">
                      <Avatar className="h-5 w-5 mr-1">
                        <AvatarImage src={video.playerAvatar} alt={video.playerName} />
                        <AvatarFallback>{video.playerName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="truncate">{video.playerName}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 pt-0">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {video.sport}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {video.position}
                      </Badge>
                      <Badge variant="outline" className="capitalize text-xs">
                        {video.highlightType}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {formatNumber(video.viewCount)}
                        <span className="mx-1">•</span>
                        <ThumbsUp className="h-3 w-3 mr-1" />
                        {formatNumber(video.likes)}
                      </div>
                      <span>{formatDate(video.uploadDate)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-3 py-16 text-center">
                <FileVideo className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">No Highlights Found</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  We couldn't find any highlights matching your current filters. Try adjusting your filters or search query.
                </p>
                <Button onClick={() => setFilters({
                  sport: "all",
                  position: "all",
                  class: "all",
                  highlightType: "all",
                  minAiScore: 0,
                  sortBy: "trending",
                  searchQuery: ""
                })}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Upload dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Upload Highlight Video</DialogTitle>
            <DialogDescription>
              Share your best moments with coaches and scouts.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {isUploading ? (
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-1">Uploading Video...</h3>
                  <p className="text-sm text-muted-foreground mb-4">Please wait while your video is being uploaded</p>
                </div>
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-center text-sm">{uploadProgress}%</p>
              </div>
            ) : (
              <>
                <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors">
                  <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm mb-1">Drag and drop a video file here or click to browse</p>
                  <p className="text-xs text-muted-foreground">
                    MP4 or MOV, up to 500MB
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="upload-title">Title *</Label>
                      <Input id="upload-title" placeholder="Title for your highlight video" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="upload-type">Highlight Type *</Label>
                      <Select>
                        <SelectTrigger id="upload-type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="game">Game</SelectItem>
                          <SelectItem value="practice">Practice</SelectItem>
                          <SelectItem value="combine">Combine</SelectItem>
                          <SelectItem value="skills">Skills Training</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="upload-description">Description</Label>
                    <Textarea id="upload-description" placeholder="Describe your highlight video" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="upload-sport">Sport *</Label>
                      <Select>
                        <SelectTrigger id="upload-sport">
                          <SelectValue placeholder="Select sport" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basketball">Basketball</SelectItem>
                          <SelectItem value="football">Football</SelectItem>
                          <SelectItem value="soccer">Soccer</SelectItem>
                          <SelectItem value="volleyball">Volleyball</SelectItem>
                          <SelectItem value="baseball">Baseball</SelectItem>
                          <SelectItem value="lacrosse">Lacrosse</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="upload-position">Position *</Label>
                      <Input id="upload-position" placeholder="Your position" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="upload-tags">Tags (separate with commas)</Label>
                    <Input id="upload-tags" placeholder="e.g., highlight, game winner, defense" />
                  </div>
                </div>
              </>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setUploadDialogOpen(false)}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpload}
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Upload Video"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}