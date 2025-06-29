import React, { useState } from 'react';
import { Play, Video, Film, FileVideo, Upload, RefreshCw, PlusCircle, Link2, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

// Animation types and their details
const animationTypes = [
  {
    id: 'sprint',
    name: '40-Yard Dash',
    description: '40-yard sprint test animation with timing and velocity metrics',
    videoPath: '/videos/40_yard_dash.mp4',
    htmlPath: '/videos/hd/40_yard_dash.html',
    status: 'active',
    metrics: ['Time (seconds)', 'Speed (mph)'],
    lastUpdated: '2025-04-10',
  },
  {
    id: 'vertical',
    name: 'Vertical Jump',
    description: 'Vertical leap measurement with height and power metrics',
    videoPath: '/videos/vertical_jump.mp4',
    htmlPath: '/videos/hd/vertical_jump.html',
    status: 'active',
    metrics: ['Height (inches)', 'Power (watts)'],
    lastUpdated: '2025-04-10',
  },
  {
    id: 'agility',
    name: 'Agility Drill',
    description: '5-10-5 shuttle run with timing and agility metrics',
    videoPath: '/videos/agility_drill.mp4',
    htmlPath: '/videos/hd/agility_drill.html',
    status: 'active',
    metrics: ['Time (seconds)', 'Change Direction Speed'],
    lastUpdated: '2025-04-10',
  },
  {
    id: 'strength',
    name: 'Bench Press',
    description: 'Bench press strength test with rep counting and power metrics',
    videoPath: '/videos/bench_press.mp4',
    htmlPath: '/videos/hd/bench_press.html',
    status: 'active',
    metrics: ['Weight (lbs)', 'Reps'],
    lastUpdated: '2025-04-10',
  },
];

const AnimationDashboard = () => {
  const [activeTab, setActiveTab] = useState('animations');
  const [selectedAnimation, setSelectedAnimation] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewAnimation, setPreviewAnimation] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  // Handle preview animation
  const handlePreviewAnimation = (animation) => {
    setPreviewAnimation(animation);
    setDialogOpen(true);
  };

  // Handle upload animation simulation
  const handleUploadAnimation = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          toast({
            title: "Upload Complete",
            description: "Animation has been uploaded successfully.",
          });
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  // Handle regenerate HTML from video
  const handleRegenerateHTML = (animation) => {
    toast({
      title: "Regenerating HTML",
      description: `Starting HTML generation for ${animation.name}...`,
    });
    
    // Simulate regeneration process
    setTimeout(() => {
      toast({
        title: "HTML Regenerated",
        description: `HTML animation for ${animation.name} has been regenerated successfully.`,
      });
    }, 2000);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center">
          <Video className="mr-2 h-5 w-5" />
          Animation System Dashboard
        </CardTitle>
        <CardDescription>
          Manage the 128-bit animation system including video assets, HTML animations, and performance metrics
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="animations" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="animations" className="flex items-center gap-1">
              <Play className="h-4 w-4" /> Animations
            </TabsTrigger>
            <TabsTrigger value="uploads" className="flex items-center gap-1">
              <Upload className="h-4 w-4" /> Upload
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-1">
              <RefreshCw className="h-4 w-4" /> HTML Generator
            </TabsTrigger>
          </TabsList>
          
          {/* Animations Tab */}
          <TabsContent value="animations" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {animationTypes.map((animation) => (
                <Card key={animation.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">{animation.name}</CardTitle>
                      <Badge variant="outline" className={animation.status === 'active' ? 'text-green-500' : 'text-amber-500'}>
                        {animation.status === 'active' ? (
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                        ) : (
                          <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                        )}
                        {animation.status === 'active' ? 'Active' : 'Needs Attention'}
                      </Badge>
                    </div>
                    <CardDescription>{animation.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="p-4 pt-2">
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Video File:</span>
                        <span className="font-mono text-xs">{animation.videoPath}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>HTML File:</span>
                        <span className="font-mono text-xs">{animation.htmlPath}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Metrics:</span>
                        <span>{animation.metrics.join(', ')}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Last Updated:</span>
                        <span>{animation.lastUpdated}</span>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="p-4 pt-0 flex justify-between gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handlePreviewAnimation(animation)}
                    >
                      <Play className="h-4 w-4 mr-1" /> Preview
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => {
                        setSelectedAnimation(animation);
                        setActiveTab('settings');
                      }}
                    >
                      <RefreshCw className="h-4 w-4 mr-1" /> Generate HTML
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          {/* Upload Tab */}
          <TabsContent value="uploads" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upload Animation Video</CardTitle>
                <CardDescription>
                  Upload a new MP4 video file to be used in the animation system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="animation-type">Animation Type</Label>
                  <Select>
                    <SelectTrigger id="animation-type">
                      <SelectValue placeholder="Select animation type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sprint">40-Yard Dash</SelectItem>
                      <SelectItem value="vertical">Vertical Jump</SelectItem>
                      <SelectItem value="agility">Agility Drill</SelectItem>
                      <SelectItem value="strength">Bench Press</SelectItem>
                      <SelectItem value="new">New Animation Type</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="video-file">Video File (MP4)</Label>
                  <div className="flex items-center gap-2">
                    <Input id="video-file" type="file" accept="video/mp4" />
                  </div>
                </div>
                
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Enter a description for this animation"
                  />
                </div>
                
                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} />
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleUploadAnimation} 
                  disabled={isUploading}
                >
                  <Upload className="h-4 w-4 mr-1" /> Upload Animation
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* HTML Generator Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>HTML Animation Generator</CardTitle>
                <CardDescription>
                  Generate HTML interactive animations from video files
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="animation-select">Select Animation</Label>
                  <Select 
                    value={selectedAnimation?.id} 
                    onValueChange={(value) => {
                      const animation = animationTypes.find(a => a.id === value);
                      setSelectedAnimation(animation);
                    }}
                  >
                    <SelectTrigger id="animation-select">
                      <SelectValue placeholder="Select animation" />
                    </SelectTrigger>
                    <SelectContent>
                      {animationTypes.map(animation => (
                        <SelectItem key={animation.id} value={animation.id}>
                          {animation.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedAnimation && (
                  <>
                    <div className="grid w-full items-center gap-1.5">
                      <Label htmlFor="video-source">Video Source</Label>
                      <Input 
                        id="video-source" 
                        value={selectedAnimation.videoPath} 
                        readOnly
                      />
                    </div>
                    
                    <div className="grid w-full items-center gap-1.5">
                      <Label htmlFor="html-output">HTML Output Path</Label>
                      <Input 
                        id="html-output" 
                        defaultValue={selectedAnimation.htmlPath} 
                      />
                    </div>
                    
                    <div className="grid w-full items-center gap-1.5">
                      <Label>Animation Metrics</Label>
                      <div className="flex flex-col gap-2 mt-1">
                        {selectedAnimation.metrics.map((metric, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              value={metric}
                              className="w-full"
                            />
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-8 w-8"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button variant="outline" size="sm" className="mt-2 w-full">
                          <PlusCircle className="h-4 w-4 mr-1" /> Add Metric
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="enable-motion-tracking">Enable Motion Tracking</Label>
                        <Switch id="enable-motion-tracking" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="enable-data-overlay">Enable Data Overlay</Label>
                        <Switch id="enable-data-overlay" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="enable-hd-badge">Show HD Quality Badge</Label>
                        <Switch id="enable-hd-badge" defaultChecked />
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Reset</Button>
                <Button 
                  onClick={() => selectedAnimation && handleRegenerateHTML(selectedAnimation)}
                  disabled={!selectedAnimation}
                >
                  <RefreshCw className="h-4 w-4 mr-1" /> Generate HTML Animation
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      {/* Preview Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl">
          {previewAnimation && (
            <>
              <DialogHeader>
                <DialogTitle>Animation Preview: {previewAnimation.name}</DialogTitle>
                <DialogDescription>
                  128-bit Ultra HD animation with interactive elements
                </DialogDescription>
              </DialogHeader>
              
              <div className="aspect-video bg-black rounded-md overflow-hidden">
                <iframe
                  src={previewAnimation.htmlPath}
                  className="w-full h-full border-0"
                  allow="autoplay"
                ></iframe>
              </div>
              
              <div className="flex flex-col gap-2 text-sm">
                <div>
                  <span className="font-semibold">Video Source:</span> {previewAnimation.videoPath}
                </div>
                <div>
                  <span className="font-semibold">HTML Animation:</span> {previewAnimation.htmlPath}
                </div>
                <div className="text-muted-foreground text-xs">
                  Animation uses interactive HTML5 with SVG overlays and motion tracking
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Close</Button>
                <Button asChild>
                  <a href={previewAnimation.htmlPath} target="_blank" rel="noopener noreferrer">
                    <Link2 className="h-4 w-4 mr-1" /> Open in New Tab
                  </a>
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AnimationDashboard;