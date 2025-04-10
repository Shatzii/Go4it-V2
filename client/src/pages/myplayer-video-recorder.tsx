import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/auth-context';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { toast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ChevronLeft, Trophy, Info, Medal } from 'lucide-react';
import VideoRecorder from '@/components/video/VideoRecorder';

// Sport options for recording context
const sportOptions = [
  { value: 'basketball', label: 'Basketball' },
  { value: 'volleyball', label: 'Volleyball' },
  { value: 'soccer', label: 'Soccer' },
  { value: 'baseball', label: 'Baseball' },
  { value: 'football', label: 'Football' },
  { value: 'track', label: 'Track & Field' },
  { value: 'swimming', label: 'Swimming' },
  { value: 'tennis', label: 'Tennis' },
  { value: 'golf', label: 'Golf' },
  { value: 'other', label: 'Other' },
];

// Drill options per sport (simplified example)
const drillOptions: Record<string, { value: string, label: string, xp: number }[]> = {
  basketball: [
    { value: 'free-throw', label: 'Free Throw Shot', xp: 30 },
    { value: 'dribbling', label: 'Dribbling Practice', xp: 25 },
    { value: 'three-point', label: 'Three-Point Shot', xp: 40 },
    { value: 'layup', label: 'Layup Drill', xp: 20 },
  ],
  football: [
    { value: 'passing', label: 'Passing Drill', xp: 30 },
    { value: 'catching', label: 'Catching Practice', xp: 25 },
    { value: 'sprinting', label: 'Sprint Drill', xp: 20 },
    { value: 'agility', label: 'Agility Course', xp: 35 },
  ],
  soccer: [
    { value: 'dribbling', label: 'Dribbling Practice', xp: 25 },
    { value: 'shooting', label: 'Goal Shooting', xp: 30 },
    { value: 'passing', label: 'Passing Drill', xp: 20 },
    { value: 'juggling', label: 'Ball Juggling', xp: 15 },
  ],
  // Default drills for all other sports
  default: [
    { value: 'skill-1', label: 'Fundamental Skill Practice', xp: 25 },
    { value: 'skill-2', label: 'Advanced Technique Drill', xp: 35 },
    { value: 'skill-3', label: 'Agility Training', xp: 30 },
    { value: 'skill-4', label: 'Speed Drill', xp: 20 },
  ]
};

export default function MyPlayerVideoRecorder() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  
  const [selectedSport, setSelectedSport] = useState<string>('');
  const [selectedDrill, setSelectedDrill] = useState<string>('');
  const [videoUploaded, setVideoUploaded] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [loadingVerification, setLoadingVerification] = useState(false);
  
  // Get drill options based on selected sport
  const availableDrills = selectedSport 
    ? (drillOptions[selectedSport] || drillOptions.default)
    : [];
  
  // Get XP amount for selected drill
  const getXpAmount = () => {
    if (!selectedDrill) return 0;
    
    const drill = availableDrills.find(d => d.value === selectedDrill);
    return drill ? drill.xp : 0;
  };
  
  // Handle video submission
  const videoUploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return apiRequest('/api/videos/upload', {
        method: 'POST',
        data: formData,
        isFormData: true,
      });
    },
    onSuccess: (data) => {
      setVideoUploaded(true);
      toast({
        title: 'Video Uploaded',
        description: 'Your drill video has been uploaded successfully',
        variant: 'default',
      });
      
      // Start the verification process
      verifyWorkoutMutation.mutate({
        videoId: data.videoId,
        drillType: selectedDrill,
        sportType: selectedSport,
      });
    },
    onError: (error) => {
      toast({
        title: 'Upload Failed',
        description: error.message || 'There was an error uploading your video',
        variant: 'destructive',
      });
    }
  });
  
  // Verify workout when video is uploaded
  const verifyWorkoutMutation = useMutation({
    mutationFn: (data: { videoId: number, drillType: string, sportType: string }) => {
      setLoadingVerification(true);
      return apiRequest('/api/player/verify-workout', {
        method: 'POST',
        data,
      });
    },
    onSuccess: () => {
      setIsVerified(true);
      setLoadingVerification(false);
      
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/player/progress'] });
      queryClient.invalidateQueries({ queryKey: ['/api/player/star-path', user?.id] });
      
      toast({
        title: 'Workout Verified!',
        description: `You've earned ${getXpAmount()} XP for completing this drill!`,
        variant: 'default',
      });
    },
    onError: (error) => {
      setLoadingVerification(false);
      toast({
        title: 'Verification Failed',
        description: error.message || 'There was an error verifying your workout',
        variant: 'destructive',
      });
    }
  });
  
  // Handle video recording completion
  const handleVideoSaved = (videoBlob: Blob, metadata: { title: string; description: string }) => {
    if (!selectedSport || !selectedDrill) {
      toast({
        title: 'Missing Information',
        description: 'Please select a sport and drill type',
        variant: 'destructive',
      });
      return;
    }
    
    const formData = new FormData();
    formData.append('video', videoBlob, `${selectedDrill}_${Date.now()}.webm`);
    formData.append('title', metadata.title || `${selectedSport} - ${selectedDrill} Drill`);
    formData.append('description', metadata.description || '');
    formData.append('sportType', selectedSport);
    formData.append('drillType', selectedDrill);
    
    videoUploadMutation.mutate(formData);
  };

  if (!user) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Please log in to access this feature</h1>
        <Button onClick={() => navigate('/login')}>Log In</Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Record Workout</h1>
          <p className="text-muted-foreground">Record your training to earn XP and progress your Star Path</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate('/myplayer-star-path')}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Star Path
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Medal className="mr-2 h-5 w-5" />
                Drill Recording
              </CardTitle>
              <CardDescription>
                Record yourself completing a drill to earn XP and improve your star path progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Sport and Drill Selection */}
              {!videoUploaded && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="sport-select">Select Sport</Label>
                    <Select 
                      value={selectedSport}
                      onValueChange={value => {
                        setSelectedSport(value);
                        setSelectedDrill('');
                      }}
                      disabled={videoUploaded}
                    >
                      <SelectTrigger id="sport-select">
                        <SelectValue placeholder="Choose a sport" />
                      </SelectTrigger>
                      <SelectContent>
                        {sportOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="drill-select">Select Drill</Label>
                    <Select 
                      value={selectedDrill}
                      onValueChange={setSelectedDrill}
                      disabled={!selectedSport || videoUploaded}
                    >
                      <SelectTrigger id="drill-select">
                        <SelectValue placeholder="Choose a drill" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableDrills.map(drill => (
                          <SelectItem key={drill.value} value={drill.value}>
                            {drill.label} (+{drill.xp} XP)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              
              {/* Video Recorder Component */}
              {selectedSport && selectedDrill && !isVerified ? (
                <VideoRecorder 
                  onVideoSaved={handleVideoSaved}
                  showControls={!videoUploaded}
                />
              ) : isVerified ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trophy className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-green-700 mb-2">Workout Verified!</h3>
                  <p className="text-green-600 mb-4">
                    Congratulations! You've earned {getXpAmount()} XP for completing this drill.
                  </p>
                  <Button onClick={() => navigate('/myplayer-star-path')}>
                    View Your Progress
                  </Button>
                </div>
              ) : (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-blue-700">Getting Started</h3>
                      <p className="text-blue-600 mt-1">
                        Please select a sport and drill type to start recording your workout.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Loading state during verification */}
              {loadingVerification && (
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-blue-700">Verifying your workout...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="mr-2 h-5 w-5" />
                Recording Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="bg-primary/10 p-1 rounded-full mr-2 mt-0.5">
                    <span className="text-xs font-bold">1</span>
                  </div>
                  <p className="text-sm">Position yourself so your full body is visible in the frame</p>
                </li>
                <li className="flex items-start">
                  <div className="bg-primary/10 p-1 rounded-full mr-2 mt-0.5">
                    <span className="text-xs font-bold">2</span>
                  </div>
                  <p className="text-sm">Ensure good lighting so the AI can accurately track your movements</p>
                </li>
                <li className="flex items-start">
                  <div className="bg-primary/10 p-1 rounded-full mr-2 mt-0.5">
                    <span className="text-xs font-bold">3</span>
                  </div>
                  <p className="text-sm">Execute the full drill from beginning to end without interruption</p>
                </li>
                <li className="flex items-start">
                  <div className="bg-primary/10 p-1 rounded-full mr-2 mt-0.5">
                    <span className="text-xs font-bold">4</span>
                  </div>
                  <p className="text-sm">Record in landscape orientation for better analysis results</p>
                </li>
              </ul>
              
              {selectedDrill && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-medium mb-2">Reward for completion:</h3>
                  <div className="flex items-center space-x-2 text-amber-600">
                    <Trophy className="h-5 w-5" />
                    <span className="font-bold">{getXpAmount()} XP</span>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <div className="text-xs text-muted-foreground">
                Note: All videos are analyzed by our AI to verify workout completion and improve your form feedback
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}