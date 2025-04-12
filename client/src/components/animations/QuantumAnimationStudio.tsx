import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { 
  Play, Pause, SkipForward, SkipBack, Rewind, FastForward, Download, 
  Settings, RefreshCw, FilePlus, Trash2, Upload, Repeat, Lightbulb,
  Camera, Video, Cpu, Film, Zap, Gauge, Eye, CheckCircle, AlertCircle, Clock
} from "lucide-react";

// Animation styles enum
enum AnimationStyle {
  CARTOON = 'cartoon',
  REALISTIC = 'realistic',
  STYLIZED = 'stylized',
  ANIME = 'anime',
  SPORTS_BROADCAST = 'sports_broadcast',
  COMMERCIAL = 'commercial',
  DOCUMENTARY = 'documentary',
  GAME_HIGHLIGHTS = 'game_highlights',
  TRAINING_DEMO = 'training_demo'
}

// Animation quality enum
enum AnimationQuality {
  DRAFT = 'draft',
  STANDARD = 'standard',
  HIGH = 'high',
  PREMIUM = 'premium',
  BROADCAST = 'broadcast'
}

// Sport type options
const sportTypeOptions = [
  { value: 'basketball', label: 'Basketball' },
  { value: 'football', label: 'Football' },
  { value: 'soccer', label: 'Soccer' },
  { value: 'baseball', label: 'Baseball' },
  { value: 'volleyball', label: 'Volleyball' },
  { value: 'tennis', label: 'Tennis' },
  { value: 'golf', label: 'Golf' },
  { value: 'track', label: 'Track & Field' },
  { value: 'swimming', label: 'Swimming' },
  { value: 'general', label: 'General Sports' }
];

// Animation style options
const animationStyleOptions = [
  { value: AnimationStyle.CARTOON, label: 'Cartoon' },
  { value: AnimationStyle.REALISTIC, label: 'Realistic' },
  { value: AnimationStyle.STYLIZED, label: 'Stylized' },
  { value: AnimationStyle.ANIME, label: 'Anime' },
  { value: AnimationStyle.SPORTS_BROADCAST, label: 'Sports Broadcast' },
  { value: AnimationStyle.COMMERCIAL, label: 'Commercial' },
  { value: AnimationStyle.DOCUMENTARY, label: 'Documentary' },
  { value: AnimationStyle.GAME_HIGHLIGHTS, label: 'Game Highlights' },
  { value: AnimationStyle.TRAINING_DEMO, label: 'Training Demo' }
];

// Quality options
const qualityOptions = [
  { value: AnimationQuality.DRAFT, label: 'Draft (Fast Preview)' },
  { value: AnimationQuality.STANDARD, label: 'Standard' },
  { value: AnimationQuality.HIGH, label: 'High' },
  { value: AnimationQuality.PREMIUM, label: 'Premium' },
  { value: AnimationQuality.BROADCAST, label: 'Broadcast' }
];

// Demo story templates
const storyTemplates = [
  {
    id: 'basketball-training',
    title: 'Basketball Training Demo',
    description: 'A professional coach demonstrates proper shooting technique',
    text: 'Coach Williams demonstrates the perfect jump shot technique. He starts with proper foot alignment, shoulders square to the basket. He explains the importance of bending knees slightly, keeping your shooting elbow in, and following through with the wrist. The demonstration shows both slow-motion and regular speed examples with overlay graphics highlighting the key form elements.',
    style: AnimationStyle.TRAINING_DEMO,
    sportType: 'basketball',
    duration: 45
  },
  {
    id: 'football-play',
    title: 'Football Play Breakdown',
    description: 'Analysis of a complex offensive play',
    text: 'This breakdown analyzes the "Double Post Wheel" play from multiple angles. The quarterback takes the snap and reads the defense while three receivers run their routes. The analysis shows how the safety is forced to choose between covering the wheel route or the deep post, creating an open receiver. Graphics highlight player movements and defensive responses.',
    style: AnimationStyle.SPORTS_BROADCAST,
    sportType: 'football',
    duration: 60
  },
  {
    id: 'sports-commercial',
    title: 'Athletic Shoe Commercial',
    description: 'Professional commercial for performance footwear',
    text: 'PRODUCT: UltraBoost Pro Elite\nTAGLINE: Elevate Your Performance\nDESCRIPTION: The UltraBoost Pro Elite combines cutting-edge materials with sports science for unmatched cushioning, stability, and energy return. Whether you are making sharp cuts on the court or sprinting for the finish line, these shoes deliver the perfect blend of comfort and explosive power.',
    style: AnimationStyle.COMMERCIAL,
    sportType: 'general',
    duration: 30
  }
];

interface StoryGeneratorFormData {
  text: string;
  style: AnimationStyle;
  sportType: string;
  duration: number;
  quality: AnimationQuality;
}

interface CommercialGeneratorFormData {
  productName: string;
  tagline: string;
  description: string;
  sportType: string;
  duration: number;
  quality: AnimationQuality;
  callToAction: string;
}

// Animation job type
interface AnimationJob {
  id: string;
  title: string;
  type: 'story' | 'commercial';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  previewUrl?: string;  // Using previewUrl to match server response
  createdAt: Date;
  completedAt?: Date;
  outputUrl?: string;
  error?: string;
  parameters?: any;
}

export default function QuantumAnimationStudio() {
  // Tab state
  const [activeTab, setActiveTab] = useState("story");
  const { toast } = useToast();
  
  // Form data
  const [storyForm, setStoryForm] = useState<StoryGeneratorFormData>({
    text: '',
    style: AnimationStyle.TRAINING_DEMO,
    sportType: 'basketball',
    duration: 60,
    quality: AnimationQuality.STANDARD
  });
  
  const [commercialForm, setCommercialForm] = useState<CommercialGeneratorFormData>({
    productName: '',
    tagline: '',
    description: '',
    sportType: 'general',
    duration: 30,
    quality: AnimationQuality.STANDARD,
    callToAction: ''
  });
  
  // Jobs state
  const [jobs, setJobs] = useState<AnimationJob[]>([]);
  const [selectedJob, setSelectedJob] = useState<AnimationJob | null>(null);
  
  // Loading states
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [isGeneratingCommercial, setIsGeneratingCommercial] = useState(false);
  
  // Advanced options state
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  
  // Fetch animation jobs from API
  const fetchAnimationJobs = async () => {
    try {
      // For development/testing, use the debug endpoint
      const response = await fetch('/api/animations/debug/jobs');
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched animation jobs:', data);
      // Use the jobs array from the response
      setJobs(data.jobs || []);
    } catch (error) {
      console.error('Error fetching animation jobs:', error);
      toast({
        title: 'Failed to fetch animation jobs',
        description: 'There was an error loading your animation jobs. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  // Load animation jobs on component mount
  useEffect(() => {
    fetchAnimationJobs();
    
    // Set up polling for job status updates (every 5 seconds)
    const intervalId = setInterval(fetchAnimationJobs, 5000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);
  
  // Handle story template selection
  const handleTemplateSelect = (templateId: string) => {
    const template = storyTemplates.find(t => t.id === templateId);
    if (template) {
      setStoryForm({
        text: template.text,
        style: template.style,
        sportType: template.sportType,
        duration: template.duration,
        quality: storyForm.quality
      });
    }
  };
  
  // Generate a story from text
  const handleGenerateStory = async () => {
    setIsGeneratingStory(true);
    
    try {
      console.log('Generating story animation with parameters:', {
        text: storyForm.text,
        style: storyForm.style,
        sportType: storyForm.sportType,
        duration: storyForm.duration,
        quality: storyForm.quality
      });
      
      // For testing, we'll use the debug endpoint to create a test job
      const response = await fetch('/api/animations/debug/create-test-job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'story',
          parameters: {
            text: storyForm.text,
            style: storyForm.style,
            sportType: storyForm.sportType,
            duration: storyForm.duration,
            quality: storyForm.quality
          }
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Story generation response:', data);
      
      toast({
        title: 'Animation Created',
        description: 'Your sports story animation job has been submitted successfully!',
      });
      
      // Fetch updated jobs from the server
      fetchAnimationJobs();
    } catch (error) {
      console.error('Error generating story animation:', error);
      toast({
        title: 'Animation Generation Failed',
        description: 'There was an error generating your animation. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingStory(false);
    }
  };
  
  // Generate a commercial
  const handleGenerateCommercial = async () => {
    setIsGeneratingCommercial(true);
    
    try {
      console.log('Generating commercial animation with parameters:', {
        productName: commercialForm.productName,
        tagline: commercialForm.tagline,
        description: commercialForm.description,
        sportType: commercialForm.sportType,
        duration: commercialForm.duration,
        quality: commercialForm.quality,
        callToAction: commercialForm.callToAction
      });
      
      // For testing, we'll use the debug endpoint to create a test job
      const response = await fetch('/api/animations/debug/create-test-job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'commercial',
          parameters: {
            productName: commercialForm.productName,
            tagline: commercialForm.tagline,
            description: commercialForm.description,
            sportType: commercialForm.sportType,
            duration: commercialForm.duration,
            quality: commercialForm.quality,
            callToAction: commercialForm.callToAction
          }
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Commercial generation response:', data);
      
      toast({
        title: 'Commercial Created',
        description: 'Your sports commercial animation job has been submitted successfully!',
      });
      
      // Fetch updated jobs from the server
      fetchAnimationJobs();
    } catch (error) {
      console.error('Error generating commercial animation:', error);
      toast({
        title: 'Commercial Generation Failed',
        description: 'There was an error generating your commercial. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingCommercial(false);
    }
  };
  
  // NOTE: simulateJobProgress has been removed as we now use real API calls for job progress tracking
  
  // Get preview image based on style and sport
  const getPreviewImageForStyle = (style: AnimationStyle, sportType: string): string => {
    // In a real implementation, this would return actual preview images
    // For now, return placeholder images
    if (style === AnimationStyle.COMMERCIAL) {
      return '/images/commercial_preview.jpg';
    } else if (style === AnimationStyle.SPORTS_BROADCAST) {
      return '/images/broadcast_preview.jpg';
    } else if (style === AnimationStyle.TRAINING_DEMO) {
      return '/images/training_preview.jpg';
    } else {
      return '/images/animation_preview.jpg';
    }
  };
  
  // Format duration display
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Get style icon
  const getStyleIcon = (style: AnimationStyle) => {
    switch (style) {
      case AnimationStyle.CARTOON:
        return <FilePlus className="mr-2 h-4 w-4" />;
      case AnimationStyle.REALISTIC:
        return <Camera className="mr-2 h-4 w-4" />;
      case AnimationStyle.SPORTS_BROADCAST:
        return <Video className="mr-2 h-4 w-4" />;
      case AnimationStyle.COMMERCIAL:
        return <Zap className="mr-2 h-4 w-4" />;
      case AnimationStyle.TRAINING_DEMO:
        return <Lightbulb className="mr-2 h-4 w-4" />;
      default:
        return <Film className="mr-2 h-4 w-4" />;
    }
  };
  
  // Get quality icon and color
  const getQualityBadge = (quality: AnimationQuality) => {
    let icon = <Cpu className="mr-2 h-4 w-4" />;
    let variantType: "default" | "outline" = "default";
    
    switch (quality) {
      case AnimationQuality.DRAFT:
        variantType = "outline";
        break;
      case AnimationQuality.STANDARD:
        variantType = "default";
        break;
      case AnimationQuality.HIGH:
        variantType = "outline";
        icon = <Gauge className="mr-2 h-4 w-4" />;
        break;
      case AnimationQuality.PREMIUM:
        variantType = "outline";
        icon = <Gauge className="mr-2 h-4 w-4" />;
        break;
      case AnimationQuality.BROADCAST:
        variantType = "outline";
        icon = <Zap className="mr-2 h-4 w-4" />;
        break;
    }
    
    return (
      <Badge variant={variantType} className="ml-2">
        {icon}
        {quality.charAt(0).toUpperCase() + quality.slice(1)}
      </Badge>
    );
  };
  
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Quantum Animation Studio</h1>
        <p className="text-muted-foreground">
          Create high-quality sports animations, commercials, and visualizations from text descriptions
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="story">Story Generator</TabsTrigger>
          <TabsTrigger value="commercial">Commercial Generator</TabsTrigger>
          <TabsTrigger value="jobs">Animation Jobs</TabsTrigger>
        </TabsList>
        
        {/* Story Generator Tab */}
        <TabsContent value="story" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create Animation from Story</CardTitle>
              <CardDescription>
                Enter a description of your sports story or training demonstration and get a professionally animated video
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="col-span-1 md:col-span-3">
                  <Label htmlFor="story-text">Story Description</Label>
                  <Textarea 
                    id="story-text" 
                    placeholder="Describe your story, training demo, or game analysis..."
                    className="h-32 mt-1"
                    value={storyForm.text}
                    onChange={(e) => setStoryForm({...storyForm, text: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="story-style">Animation Style</Label>
                  <Select 
                    value={storyForm.style}
                    onValueChange={(value) => setStoryForm({...storyForm, style: value as AnimationStyle})}
                  >
                    <SelectTrigger id="story-style" className="mt-1">
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                      {animationStyleOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center">
                            {getStyleIcon(option.value as AnimationStyle)}
                            {option.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="story-sport">Sport Type</Label>
                  <Select 
                    value={storyForm.sportType}
                    onValueChange={(value) => setStoryForm({...storyForm, sportType: value})}
                  >
                    <SelectTrigger id="story-sport" className="mt-1">
                      <SelectValue placeholder="Select sport" />
                    </SelectTrigger>
                    <SelectContent>
                      {sportTypeOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="story-duration">Duration: {formatDuration(storyForm.duration)}</Label>
                  <Slider
                    id="story-duration"
                    min={15}
                    max={180}
                    step={15}
                    className="mt-3"
                    value={[storyForm.duration]}
                    onValueChange={(value) => setStoryForm({...storyForm, duration: value[0]})}
                  />
                </div>
                
                <div className="col-span-1 md:col-span-3">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="story-quality">Animation Quality</Label>
                    {getQualityBadge(storyForm.quality)}
                  </div>
                  <Select 
                    value={storyForm.quality}
                    onValueChange={(value) => setStoryForm({...storyForm, quality: value as AnimationQuality})}
                  >
                    <SelectTrigger id="story-quality" className="mt-1">
                      <SelectValue placeholder="Select quality" />
                    </SelectTrigger>
                    <SelectContent>
                      {qualityOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {showAdvancedOptions && (
                  <div className="col-span-1 md:col-span-3 space-y-4">
                    <Separator className="my-4" />
                    <h3 className="font-medium text-lg">Advanced Options</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch id="auto-lip-sync" />
                        <Label htmlFor="auto-lip-sync">Auto Lip Sync</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch id="ray-tracing" />
                        <Label htmlFor="ray-tracing">Ray Tracing</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch id="motion-capture" />
                        <Label htmlFor="motion-capture">Pro Motion Capture</Label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-center">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  {showAdvancedOptions ? "Hide" : "Show"} Advanced Options
                </Button>
                
                <div className="flex gap-2">
                  <Select
                    onValueChange={handleTemplateSelect}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Load Template" />
                    </SelectTrigger>
                    <SelectContent>
                      {storyTemplates.map(template => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleGenerateStory} 
                disabled={isGeneratingStory || !storyForm.text.trim()}
                className="ml-auto"
              >
                {isGeneratingStory ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Generate Animation
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Commercial Generator Tab */}
        <TabsContent value="commercial" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create Sports Commercial</CardTitle>
              <CardDescription>
                Generate a professional-quality commercial for your sports product or service
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="product-name">Product Name</Label>
                  <Input 
                    id="product-name" 
                    placeholder="Enter your product name"
                    className="mt-1"
                    value={commercialForm.productName}
                    onChange={(e) => setCommercialForm({...commercialForm, productName: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input 
                    id="tagline" 
                    placeholder="Enter a catchy tagline"
                    className="mt-1"
                    value={commercialForm.tagline}
                    onChange={(e) => setCommercialForm({...commercialForm, tagline: e.target.value})}
                  />
                </div>
                
                <div className="col-span-1 md:col-span-2">
                  <Label htmlFor="commercial-description">Product Description</Label>
                  <Textarea 
                    id="commercial-description" 
                    placeholder="Describe your product's features and benefits..."
                    className="h-24 mt-1"
                    value={commercialForm.description}
                    onChange={(e) => setCommercialForm({...commercialForm, description: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="call-to-action">Call to Action</Label>
                  <Input 
                    id="call-to-action" 
                    placeholder="e.g., Get yours today!"
                    className="mt-1"
                    value={commercialForm.callToAction}
                    onChange={(e) => setCommercialForm({...commercialForm, callToAction: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="commercial-sport">Sport Focus</Label>
                  <Select 
                    value={commercialForm.sportType}
                    onValueChange={(value) => setCommercialForm({...commercialForm, sportType: value})}
                  >
                    <SelectTrigger id="commercial-sport" className="mt-1">
                      <SelectValue placeholder="Select sport" />
                    </SelectTrigger>
                    <SelectContent>
                      {sportTypeOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="commercial-duration">Duration: {formatDuration(commercialForm.duration)}</Label>
                  <Slider
                    id="commercial-duration"
                    min={15}
                    max={90}
                    step={15}
                    className="mt-3"
                    value={[commercialForm.duration]}
                    onValueChange={(value) => setCommercialForm({...commercialForm, duration: value[0]})}
                  />
                </div>
                
                <div>
                  <div className="flex justify-between items-center">
                    <Label htmlFor="commercial-quality">Animation Quality</Label>
                    {getQualityBadge(commercialForm.quality)}
                  </div>
                  <Select 
                    value={commercialForm.quality}
                    onValueChange={(value) => setCommercialForm({...commercialForm, quality: value as AnimationQuality})}
                  >
                    <SelectTrigger id="commercial-quality" className="mt-1">
                      <SelectValue placeholder="Select quality" />
                    </SelectTrigger>
                    <SelectContent>
                      {qualityOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {showAdvancedOptions && (
                <div className="space-y-4">
                  <Separator className="my-4" />
                  <h3 className="font-medium text-lg">Advanced Commercial Options</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch id="include-logo" />
                      <Label htmlFor="include-logo">Include Logo</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch id="celebrity-voice" />
                      <Label htmlFor="celebrity-voice">Celebrity Voiceover</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch id="custom-music" />
                      <Label htmlFor="custom-music">Custom Music</Label>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
              >
                <Settings className="mr-2 h-4 w-4" />
                {showAdvancedOptions ? "Hide" : "Show"} Advanced Options
              </Button>
              
              <Button 
                onClick={handleGenerateCommercial} 
                disabled={isGeneratingCommercial || !commercialForm.productName.trim() || !commercialForm.description.trim()}
              >
                {isGeneratingCommercial ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Generate Commercial
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Animation Jobs Tab */}
        <TabsContent value="jobs" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1 md:col-span-1">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Animation Jobs</CardTitle>
                  <CardDescription>
                    {jobs.length} job{jobs.length !== 1 ? 's' : ''} created
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[60vh]">
                    <div className="space-y-3">
                      {jobs.length > 0 ? (
                        jobs.map(job => (
                          <div 
                            key={job.id}
                            onClick={() => setSelectedJob(job)}
                            className={`p-3 rounded-md cursor-pointer hover:bg-accent ${selectedJob?.id === job.id ? 'bg-accent' : ''}`}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium truncate" style={{maxWidth: '200px'}}>{job.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {job.type === 'story' ? 'Story' : 'Commercial'}
                                </p>
                              </div>
                              <Badge
                                variant={
                                  job.status === 'completed' ? 'default' :
                                  job.status === 'failed' ? 'destructive' :
                                  job.status === 'processing' ? 'outline' : 'secondary'
                                }
                              >
                                {job.status === 'processing' ? `${Math.round(job.progress)}%` : job.status}
                              </Badge>
                            </div>
                            
                            {job.status === 'processing' && (
                              <div className="w-full bg-secondary h-1 mt-2 rounded-full overflow-hidden">
                                <div 
                                  className="bg-primary h-full rounded-full"
                                  style={{ width: `${job.progress}%` }}
                                ></div>
                              </div>
                            )}
                            
                            <p className="text-xs text-muted-foreground mt-2">
                              Created {job.createdAt.toLocaleTimeString()}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-10 text-muted-foreground">
                          <p>No animation jobs yet</p>
                          <p className="text-sm mt-1">Create a story or commercial to get started</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                  <CardDescription>
                    {selectedJob ? selectedJob.title : 'Select a job to view details'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedJob ? (
                    <div className="space-y-4">
                      <div className="aspect-video bg-black rounded-md flex items-center justify-center overflow-hidden">
                        {selectedJob.status === 'completed' ? (
                          <div className="w-full h-full">
                            {selectedJob.outputUrl ? (
                              <video 
                                controls 
                                className="w-full h-full object-contain bg-black"
                                src={selectedJob.outputUrl} 
                                poster={selectedJob.previewUrl}
                              >
                                Your browser does not support the video tag.
                              </video>
                            ) : (
                              <div className="flex items-center justify-center w-full h-full bg-gray-800">
                                <p className="text-white text-center">
                                  Animation Complete!<br />
                                  <span className="text-sm text-gray-400">
                                    {selectedJob.type === 'story' ? 'Download your story animation' : 'Download your commercial'}
                                  </span>
                                </p>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-center">
                            {selectedJob.status === 'processing' ? (
                              <div>
                                <RefreshCw className="h-10 w-10 mx-auto mb-2 animate-spin text-primary" />
                                <p className="text-white">Processing: {Math.round(selectedJob.progress)}%</p>
                              </div>
                            ) : selectedJob.status === 'failed' ? (
                              <div>
                                <Trash2 className="h-10 w-10 mx-auto mb-2 text-destructive" />
                                <p className="text-white">Failed: {selectedJob.error || 'Unknown error'}</p>
                              </div>
                            ) : (
                              <p className="text-white">Waiting to start...</p>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <div>
                          <p className="text-sm font-medium">Type</p>
                          <p className="text-sm text-muted-foreground capitalize">{selectedJob.type}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Status</p>
                          <p className="text-sm text-muted-foreground capitalize">{selectedJob.status}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Created</p>
                          <p className="text-sm text-muted-foreground">{selectedJob.createdAt.toLocaleString()}</p>
                        </div>
                        {selectedJob.completedAt && (
                          <div>
                            <p className="text-sm font-medium">Completed</p>
                            <p className="text-sm text-muted-foreground">{selectedJob.completedAt.toLocaleString()}</p>
                          </div>
                        )}
                      </div>
                      
                      {selectedJob.status === 'completed' && (
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="outline"
                            onClick={() => {
                              // Re-generate animation with same parameters
                              if (selectedJob.type === 'story') {
                                handleGenerateStory();
                              } else {
                                handleGenerateCommercial();
                              }
                            }}
                          >
                            <Repeat className="mr-2 h-4 w-4" />
                            Regenerate
                          </Button>
                          <Button
                            onClick={() => {
                              if (selectedJob.outputUrl) {
                                // Create temporary anchor to trigger download
                                const link = document.createElement('a');
                                link.href = selectedJob.outputUrl;
                                link.download = `${selectedJob.type === 'story' ? 'sports-story' : 'sports-commercial'}-${selectedJob.id.substring(0, 8)}.mp4`;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                                
                                toast({
                                  title: 'Download Started',
                                  description: 'Your animation is being downloaded.'
                                });
                              }
                            }}
                            disabled={!selectedJob.outputUrl}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                      <p className="text-muted-foreground">Select a job to preview</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}