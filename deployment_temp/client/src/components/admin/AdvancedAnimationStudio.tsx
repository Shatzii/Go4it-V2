import React, { useState, useRef, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Video, 
  Code, 
  Upload, 
  Download, 
  Settings, 
  Wand2, 
  GitMerge, 
  MousePointer, 
  MousePointerClick, 
  HandMetal, 
  Waypoints, 
  Box, 
  Camera, 
  Clapperboard, 
  FileVideo, 
  FilePlus, 
  SquareUser,
  Users,
  Brain,
  PenTool,
  ActivitySquare,
  Layers,
  Repeat,
  Play,
  Pause,
  CheckSquare,
  XSquare,
  Eye,
  EyeOff,
  Trash2,
  Save,
  Share2,
  FileJson,
  RotateCw,
  Search
} from 'lucide-react';

// Define animation presets and their details
const animationPresets = [
  {
    id: 'sprint_40',
    name: '40-Yard Dash',
    category: 'sprint',
    description: 'Advanced 40-yard sprint animation with real-time tracking',
    status: 'active',
    version: '3.2.1',
    frameRate: 60,
    duration: 5.2,
    resolution: '4K',
    fileSize: 28.4,
    lastModified: '2025-04-12T08:30:00Z',
    dependencies: ['core-motion', 'physics-engine', 'motion-blur'],
    metrics: [
      { id: 'time', name: 'Time', unit: 'seconds', precision: 2 },
      { id: 'acceleration', name: 'Acceleration', unit: 'm/s²', precision: 1 },
      { id: 'top_speed', name: 'Top Speed', unit: 'mph', precision: 1 },
      { id: 'stride_length', name: 'Stride Length', unit: 'inches', precision: 0 },
      { id: 'stride_rate', name: 'Stride Rate', unit: 'steps/s', precision: 1 }
    ],
    assets: [
      { id: 'video_file', name: 'Base Video', path: '/videos/40_yard_dash.mp4', type: 'video' },
      { id: 'html_file', name: 'HTML Renderer', path: '/videos/hd/40_yard_dash.html', type: 'html' },
      { id: 'motion_data', name: 'Motion Capture Data', path: '/data/sprint/motion_40yd.json', type: 'json' },
      { id: 'character_model', name: 'Athlete Model', path: '/models/athlete_sprint.glb', type: 'model' }
    ]
  },
  {
    id: 'vertical_jump',
    name: 'Vertical Jump',
    category: 'jump',
    description: 'Vertical leap measurement with power and height analytics',
    status: 'active',
    version: '3.0.5',
    frameRate: 120,
    duration: 3.5,
    resolution: '4K',
    fileSize: 22.7,
    lastModified: '2025-04-10T14:22:00Z',
    dependencies: ['core-motion', 'physics-engine', 'gravity-system'],
    metrics: [
      { id: 'height', name: 'Jump Height', unit: 'inches', precision: 1 },
      { id: 'power', name: 'Power Output', unit: 'watts', precision: 0 },
      { id: 'hang_time', name: 'Hang Time', unit: 'seconds', precision: 2 },
      { id: 'approach_speed', name: 'Approach Speed', unit: 'mph', precision: 1 }
    ],
    assets: [
      { id: 'video_file', name: 'Base Video', path: '/videos/vertical_jump.mp4', type: 'video' },
      { id: 'html_file', name: 'HTML Renderer', path: '/videos/hd/vertical_jump.html', type: 'html' },
      { id: 'motion_data', name: 'Motion Capture Data', path: '/data/jump/motion_vertical.json', type: 'json' },
      { id: 'character_model', name: 'Athlete Model', path: '/models/athlete_jump.glb', type: 'model' }
    ]
  },
  {
    id: 'agility_shuttle',
    name: 'Agility Drill',
    category: 'agility',
    description: '5-10-5 shuttle run with direction change analysis',
    status: 'active',
    version: '2.9.3',
    frameRate: 60,
    duration: 6.0,
    resolution: '4K',
    fileSize: 31.2,
    lastModified: '2025-04-11T11:15:00Z',
    dependencies: ['core-motion', 'physics-engine', 'direction-system'],
    metrics: [
      { id: 'time', name: 'Total Time', unit: 'seconds', precision: 2 },
      { id: 'change_dir_speed', name: 'Direction Change', unit: 'seconds', precision: 2 },
      { id: 'lateral_speed', name: 'Lateral Speed', unit: 'mph', precision: 1 },
      { id: 'stability', name: 'Stability', unit: '%', precision: 0 }
    ],
    assets: [
      { id: 'video_file', name: 'Base Video', path: '/videos/agility_drill.mp4', type: 'video' },
      { id: 'html_file', name: 'HTML Renderer', path: '/videos/hd/agility_drill.html', type: 'html' },
      { id: 'motion_data', name: 'Motion Capture Data', path: '/data/agility/motion_shuttle.json', type: 'json' },
      { id: 'character_model', name: 'Athlete Model', path: '/models/athlete_agility.glb', type: 'model' }
    ]
  },
  {
    id: 'bench_press',
    name: 'Bench Press',
    category: 'strength',
    description: 'Bench press strength test with form and power analysis',
    status: 'active',
    version: '2.7.8',
    frameRate: 60,
    duration: 4.0,
    resolution: '4K',
    fileSize: 24.5,
    lastModified: '2025-04-09T16:40:00Z',
    dependencies: ['core-motion', 'physics-engine', 'weight-system'],
    metrics: [
      { id: 'weight', name: 'Weight', unit: 'lbs', precision: 0 },
      { id: 'reps', name: 'Repetitions', unit: '', precision: 0 },
      { id: 'power', name: 'Power Output', unit: 'watts', precision: 0 },
      { id: 'form_score', name: 'Form Score', unit: '%', precision: 0 }
    ],
    assets: [
      { id: 'video_file', name: 'Base Video', path: '/videos/bench_press.mp4', type: 'video' },
      { id: 'html_file', name: 'HTML Renderer', path: '/videos/hd/bench_press.html', type: 'html' },
      { id: 'motion_data', name: 'Motion Capture Data', path: '/data/strength/motion_bench.json', type: 'json' },
      { id: 'character_model', name: 'Athlete Model', path: '/models/athlete_strength.glb', type: 'model' }
    ]
  },
  {
    id: 'athletic_combine',
    name: 'Athletic Combine Showcase',
    category: 'commercial',
    description: 'High-quality commercial animation showcasing athletic combine measurements in 256-bit color',
    status: 'active',
    version: '4.0.1',
    frameRate: 120,
    duration: 45.0,
    resolution: '4K',
    fileSize: 48.5,
    lastModified: '2025-04-12T09:45:00Z',
    dependencies: [
      'core-motion', 
      'physics-engine', 
      'neural-rendering', 
      'motion-blur',
      'ray-tracing',
      'hdr-pipeline',
      'multi-athlete-sync'
    ],
    metrics: [
      { id: 'sprint_time', name: '40-Yard Dash', unit: 'seconds', precision: 2 },
      { id: 'vertical_height', name: 'Vertical Jump', unit: 'inches', precision: 1 },
      { id: 'agility_score', name: 'Agility Rating', unit: '', precision: 0 },
      { id: 'basketball_skill', name: 'Basketball Rating', unit: '', precision: 0 }
    ],
    assets: [
      { id: 'combine_video', name: 'Commercial Base', path: '/videos/athletic_combine_commercial.mp4', type: 'video' },
      { id: 'html_file', name: 'HTML Renderer', path: '/videos/hd/athletic_combine.html', type: 'html' },
      { id: 'motion_data', name: 'Motion Capture Data', path: '/data/combine/motion_showcase.json', type: 'json' },
      { id: 'character_models', name: 'Athlete Models', path: '/models/athlete_combine_pack.glb', type: 'model' },
      { id: 'stadium_model', name: 'Stadium Environment', path: '/models/combine_stadium.glb', type: 'model' }
    ]
  }
];

// Define rendering engines with capabilities
const renderingEngines = [
  { 
    id: 'quantum_hdr', 
    name: 'Quantum HDR Pipeline', 
    description: 'Hyper-realistic neural rendering with 256-bit color depth and advanced ray tracing',
    version: '5.0.1',
    capabilities: ['Neural Rendering', '256-bit Color', 'Quantum Ray Tracing', 'AI-driven Anti-aliasing', 'Volumetric Lighting'],
    performance: 98,
    quality: 100,
    compatibility: 80
  },
  { 
    id: 'web_real', 
    name: 'WebReal Engine', 
    description: 'Browser-optimized real-time rendering with WebGL2',
    version: '3.8.5',
    capabilities: ['WebGL2', 'Real-time Shadows', 'Skinned Meshes', 'Parallax Mapping'],
    performance: 92,
    quality: 87,
    compatibility: 96
  },
  { 
    id: 'mobile_hd', 
    name: 'Mobile HD Pipeline', 
    description: 'Mobile-optimized rendering with battery efficiency',
    version: '2.9.7',
    capabilities: ['Mobile Optimization', 'Battery Aware', 'Adaptive Quality', 'Hardware Acceleration'],
    performance: 88,
    quality: 82,
    compatibility: 98
  },
  { 
    id: 'html5_motion', 
    name: 'HTML5 Motion System', 
    description: 'Pure web standards implementation with CSS animations',
    version: '3.4.6',
    capabilities: ['CSS Animations', 'SVG Integration', 'Canvas 2D', 'Web Animation API'],
    performance: 90,
    quality: 80,
    compatibility: 100
  }
];

// Motion capture libraries
const motionCaptureSystems = [
  {
    id: 'mocap_pro',
    name: 'MoCap Pro',
    description: 'Professional-grade motion capture processing system',
    formats: ['FBX', 'BVH', 'JSON', 'GLB'],
    precision: 'High',
    latency: 'Ultra-low',
    integration: ['Video Analysis', 'Real-time Feedback', 'Multi-camera']
  },
  {
    id: 'ai_motion',
    name: 'AI Motion Mapper',
    description: 'AI-powered video-to-motion capture system',
    formats: ['JSON', 'GLB', 'CSV'],
    precision: 'Medium-High',
    latency: 'Low',
    integration: ['Single Camera', 'Smartphone Compatible', 'Cloud Processing']
  },
  {
    id: 'html5_tracking',
    name: 'HTML5 Motion Tracker',
    description: 'Browser-based motion tracking using web APIs',
    formats: ['JSON', 'CSV'],
    precision: 'Medium',
    latency: 'Medium',
    integration: ['Webcam', 'Browser-only', 'Real-time']
  }
];

// Define components for different tabs
const AnimationLibrary: React.FC<{ onSelectPreset: (preset: any) => void }> = ({ onSelectPreset }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  // Filter animations based on search and category
  const filteredAnimations = animationPresets.filter(preset => {
    const matchesSearch = preset.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          preset.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || preset.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search animations..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="sprint">Sprint</SelectItem>
            <SelectItem value="jump">Jump</SelectItem>
            <SelectItem value="agility">Agility</SelectItem>
            <SelectItem value="strength">Strength</SelectItem>
            <SelectItem value="commercial">Commercial</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAnimations.map(preset => (
          <Card key={preset.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between">
                <CardTitle className="text-md font-semibold">{preset.name}</CardTitle>
                <Badge variant="outline">{preset.category}</Badge>
              </div>
              <CardDescription className="line-clamp-2">{preset.description}</CardDescription>
            </CardHeader>
            <CardContent className="p-4 py-2">
              <div className="text-sm space-y-1">
                <div className="flex justify-between text-muted-foreground">
                  <span>Version:</span>
                  <span>{preset.version}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Duration:</span>
                  <span>{preset.duration}s @ {preset.frameRate}fps</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Resolution:</span>
                  <span>{preset.resolution}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Updated:</span>
                  <span>{new Date(preset.lastModified).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-2 flex justify-between">
              <Button 
                size="sm" 
                variant="outline"
                className="w-1/2"
                onClick={() => window.open(`/videos/hd/${preset.id}.html`, '_blank')}
              >
                <Eye className="h-4 w-4 mr-1" /> Preview
              </Button>
              <Button 
                size="sm"
                className="w-1/2"
                onClick={() => onSelectPreset(preset)}
              >
                <Settings className="h-4 w-4 mr-1" /> Configure
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

const MotionEditor: React.FC<{ selectedPreset: any }> = ({ selectedPreset }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [totalFrames, setTotalFrames] = useState(300); // Example value
  const [selectedTool, setSelectedTool] = useState('select');
  const [editorMode, setEditorMode] = useState('visual');
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [keyframeMode, setKeyframeMode] = useState(false);
  const [codeValue, setCodeValue] = useState('// Motion data will appear here\n');
  const { toast } = useToast();
  
  useEffect(() => {
    if (selectedPreset) {
      setTotalFrames(Math.round(selectedPreset.duration * selectedPreset.frameRate));
      setCodeValue(`// Motion data for ${selectedPreset.name}\n// Generated from motion capture\n\n{\n  "id": "${selectedPreset.id}",\n  "version": "${selectedPreset.version}",\n  "frameRate": ${selectedPreset.frameRate},\n  "frames": ${totalFrames},\n  "metrics": ${JSON.stringify(selectedPreset.metrics, null, 2)},\n  "keyframes": [...],\n  "motionPath": [...]\n}`);
    }
  }, [selectedPreset, totalFrames]);
  
  const handleSave = () => {
    toast({
      title: "Changes Saved",
      description: `Motion data for ${selectedPreset.name} has been updated.`,
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-lg font-semibold flex items-center">
          <Clapperboard className="h-5 w-5 mr-2" />
          {selectedPreset ? selectedPreset.name : "Motion Editor"}
        </div>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant={editorMode === 'visual' ? 'default' : 'outline'} 
            onClick={() => setEditorMode('visual')}
          >
            <MousePointer className="h-4 w-4 mr-1" /> Visual
          </Button>
          <Button 
            size="sm" 
            variant={editorMode === 'code' ? 'default' : 'outline'} 
            onClick={() => setEditorMode('code')}
          >
            <Code className="h-4 w-4 mr-1" /> Code
          </Button>
        </div>
      </div>
      
      {editorMode === 'visual' ? (
        <>
          <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
            <canvas 
              ref={canvasRef} 
              className="w-full h-full"
            />
            {selectedPreset && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-center">
                  <p className="text-lg font-bold mb-2">Visual Editor</p>
                  <p className="text-sm opacity-70">Editing {selectedPreset.name}</p>
                </div>
              </div>
            )}
            
            <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm p-2 rounded-lg flex items-center gap-2">
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={() => setIsPlaying(!isPlaying)}
                className="h-8 w-8 text-white"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              
              <div className="flex-1 mx-2">
                <Slider 
                  value={[currentFrame]} 
                  max={totalFrames} 
                  step={1}
                  onValueChange={(value) => setCurrentFrame(value[0])}
                />
              </div>
              
              <div className="text-white text-xs">
                {currentFrame}/{totalFrames}
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 border-b pb-2">
            <Button 
              size="sm" 
              variant={selectedTool === 'select' ? 'default' : 'outline'} 
              onClick={() => setSelectedTool('select')}
              className="h-8"
            >
              <MousePointer className="h-3.5 w-3.5 mr-1" /> Select
            </Button>
            <Button 
              size="sm" 
              variant={selectedTool === 'move' ? 'default' : 'outline'} 
              onClick={() => setSelectedTool('move')}
              className="h-8"
            >
              <MousePointerClick className="h-3.5 w-3.5 mr-1" /> Move
            </Button>
            <Button 
              size="sm" 
              variant={selectedTool === 'rotate' ? 'default' : 'outline'} 
              onClick={() => setSelectedTool('rotate')}
              className="h-8"
            >
              <RotateCw className="h-3.5 w-3.5 mr-1" /> Rotate
            </Button>
            <Button 
              size="sm" 
              variant={selectedTool === 'path' ? 'default' : 'outline'} 
              onClick={() => setSelectedTool('path')}
              className="h-8"
            >
              <PenTool className="h-3.5 w-3.5 mr-1" /> Path
            </Button>
            <Button 
              size="sm" 
              variant={selectedTool === 'keyframe' ? 'default' : 'outline'} 
              onClick={() => setSelectedTool('keyframe')}
              className="h-8"
            >
              <ActivitySquare className="h-3.5 w-3.5 mr-1" /> Keyframe
            </Button>
            <div className="ml-auto flex items-center gap-3">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="grid-toggle" 
                  checked={showGrid} 
                  onCheckedChange={setShowGrid}
                />
                <Label htmlFor="grid-toggle" className="text-xs">Grid</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="snap-toggle" 
                  checked={snapToGrid} 
                  onCheckedChange={setSnapToGrid}
                />
                <Label htmlFor="snap-toggle" className="text-xs">Snap</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="keyframe-toggle" 
                  checked={keyframeMode} 
                  onCheckedChange={setKeyframeMode}
                />
                <Label htmlFor="keyframe-toggle" className="text-xs">Keyframes</Label>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="col-span-1">
              <CardHeader className="p-3">
                <CardTitle className="text-sm font-medium">Properties</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="space-y-2">
                  <div className="grid grid-cols-2 items-center gap-2">
                    <Label htmlFor="position-x" className="text-xs">Position X</Label>
                    <Input id="position-x" className="h-7 text-xs" defaultValue="0" />
                  </div>
                  <div className="grid grid-cols-2 items-center gap-2">
                    <Label htmlFor="position-y" className="text-xs">Position Y</Label>
                    <Input id="position-y" className="h-7 text-xs" defaultValue="0" />
                  </div>
                  <div className="grid grid-cols-2 items-center gap-2">
                    <Label htmlFor="position-z" className="text-xs">Position Z</Label>
                    <Input id="position-z" className="h-7 text-xs" defaultValue="0" />
                  </div>
                  <div className="grid grid-cols-2 items-center gap-2">
                    <Label htmlFor="rotation-x" className="text-xs">Rotation X</Label>
                    <Input id="rotation-x" className="h-7 text-xs" defaultValue="0" />
                  </div>
                  <div className="grid grid-cols-2 items-center gap-2">
                    <Label htmlFor="rotation-y" className="text-xs">Rotation Y</Label>
                    <Input id="rotation-y" className="h-7 text-xs" defaultValue="0" />
                  </div>
                  <div className="grid grid-cols-2 items-center gap-2">
                    <Label htmlFor="rotation-z" className="text-xs">Rotation Z</Label>
                    <Input id="rotation-z" className="h-7 text-xs" defaultValue="0" />
                  </div>
                  <div className="grid grid-cols-2 items-center gap-2">
                    <Label htmlFor="scale" className="text-xs">Scale</Label>
                    <Input id="scale" className="h-7 text-xs" defaultValue="1" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader className="p-3">
                <CardTitle className="text-sm font-medium">Animation</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="space-y-2">
                  <div className="grid grid-cols-2 items-center gap-2">
                    <Label htmlFor="duration" className="text-xs">Duration (sec)</Label>
                    <Input id="duration" className="h-7 text-xs" defaultValue={selectedPreset?.duration.toString() || "5.0"} />
                  </div>
                  <div className="grid grid-cols-2 items-center gap-2">
                    <Label htmlFor="framerate" className="text-xs">Frame Rate</Label>
                    <Input id="framerate" className="h-7 text-xs" defaultValue={selectedPreset?.frameRate.toString() || "60"} />
                  </div>
                  <div className="grid grid-cols-2 items-center gap-2">
                    <Label htmlFor="easing" className="text-xs">Easing</Label>
                    <Select defaultValue="easeInOut">
                      <SelectTrigger id="easing" className="h-7 text-xs">
                        <SelectValue placeholder="Select easing" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="linear">Linear</SelectItem>
                        <SelectItem value="easeIn">Ease In</SelectItem>
                        <SelectItem value="easeOut">Ease Out</SelectItem>
                        <SelectItem value="easeInOut">Ease In Out</SelectItem>
                        <SelectItem value="elastic">Elastic</SelectItem>
                        <SelectItem value="bounce">Bounce</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 items-center gap-2">
                    <Label htmlFor="loop" className="text-xs">Loop</Label>
                    <Select defaultValue="none">
                      <SelectTrigger id="loop" className="h-7 text-xs">
                        <SelectValue placeholder="Select loop type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="loop">Loop</SelectItem>
                        <SelectItem value="pingpong">Ping Pong</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-keyframe" className="text-xs">Auto Keyframe</Label>
                    <Switch id="auto-keyframe" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="motion-blur" className="text-xs">Motion Blur</Label>
                    <Switch id="motion-blur" defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader className="p-3">
                <CardTitle className="text-sm font-medium">Metrics</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <ScrollArea className="h-36">
                  <div className="space-y-2">
                    {selectedPreset?.metrics.map((metric: { id: string, name: string, unit: string, precision: number }) => (
                      <div key={metric.id} className="flex justify-between items-center text-xs">
                        <span>{metric.name}</span>
                        <span className="font-mono">{`0.0 ${metric.unit}`}</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="flex justify-end mt-3">
                  <Button size="sm" variant="outline" className="text-xs h-7">
                    <Wand2 className="h-3 w-3 mr-1" /> Auto Calculate
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <div className="border rounded-md bg-black p-4 h-[500px] overflow-y-auto">
          <pre className="text-sm text-white font-mono">
            {codeValue}
          </pre>
        </div>
      )}
      
      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
};

const RenderPreview: React.FC<{ selectedPreset: any, renderingEngine: any }> = ({ selectedPreset, renderingEngine }) => {
  const [renderProgress, setRenderProgress] = useState(0);
  const { toast } = useToast();
  
  // Simulate rendering process
  useEffect(() => {
    if (selectedPreset && renderingEngine) {
      setRenderProgress(0);
      const timer = setInterval(() => {
        setRenderProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            toast({
              title: "Rendering Complete",
              description: "All animations have been processed successfully.",
            });
            return 100;
          }
          return prev + 1;
        });
      }, 100);
      
      return () => clearInterval(timer);
    }
  }, [selectedPreset, renderingEngine, toast]);
  
  if (!selectedPreset || !renderingEngine) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <FileVideo className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No Animation Selected</h3>
        <p className="text-muted-foreground text-center mt-2">
          Select an animation preset and rendering engine to preview and render
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Render Preview</CardTitle>
          <CardDescription>
            Rendering {selectedPreset.name} with {renderingEngine.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
              <div className="absolute inset-0 flex items-center justify-center">
                {renderProgress < 100 ? (
                  <div className="text-center">
                    <div className="inline-block p-3 rounded-full bg-primary/20 animate-pulse mb-4">
                      <Video className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-white font-medium">Rendering Animation</h3>
                    <p className="text-white/70 text-sm mt-1">{renderProgress}% Complete</p>
                  </div>
                ) : (
                  <Video className="h-12 w-12 text-white opacity-20" />
                )}
              </div>
            </div>
            
            <Progress value={renderProgress} />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Render Settings</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Engine:</span>
                    <span>{renderingEngine.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Resolution:</span>
                    <span>{selectedPreset.resolution}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Frame Rate:</span>
                    <span>{selectedPreset.frameRate} FPS</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span>{selectedPreset.duration}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estimated Size:</span>
                    <span>{selectedPreset.fileSize} MB</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Render Queue</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {animationPresets.map(preset => (
                    <div key={preset.id} className="flex justify-between">
                      <span>{preset.name}</span>
                      <Badge variant={renderProgress > preset.id.length * 10 ? "secondary" : "outline"}>
                        {renderProgress > preset.id.length * 10 ? "Complete" : "Pending"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const MotionCapture: React.FC = () => {
  const [captureSystem, setCaptureSystem] = useState(motionCaptureSystems[0]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [selectedAthleteType, setSelectedAthleteType] = useState('generic');
  const [captureProgress, setCaptureProgress] = useState(0);
  const { toast } = useToast();
  
  const startCapture = () => {
    setIsCapturing(true);
    setCaptureProgress(0);
    
    // Simulate capture process
    const interval = setInterval(() => {
      setCaptureProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsCapturing(false);
          toast({
            title: "Motion Capture Complete",
            description: "Athlete motion has been captured and processed successfully.",
          });
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Motion Capture System</CardTitle>
            <CardDescription>
              Configure the motion capture system for live athlete tracking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="capture-system">Capture System</Label>
                <Select 
                  value={captureSystem.id}
                  onValueChange={(value) => {
                    const selected = motionCaptureSystems.find(sys => sys.id === value);
                    if (selected) setCaptureSystem(selected);
                  }}
                >
                  <SelectTrigger id="capture-system">
                    <SelectValue placeholder="Select system" />
                  </SelectTrigger>
                  <SelectContent>
                    {motionCaptureSystems.map(system => (
                      <SelectItem key={system.id} value={system.id}>
                        {system.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="text-sm text-muted-foreground">
                  {captureSystem.description}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Supported Formats</Label>
                <div className="flex flex-wrap gap-1">
                  {captureSystem.formats.map(format => (
                    <Badge key={format} variant="secondary">
                      {format}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Integration Options</Label>
                <div className="flex flex-wrap gap-1">
                  {captureSystem.integration.map(int => (
                    <Badge key={int} variant="outline">
                      {int}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Precision</Label>
                  <div className="text-sm font-semibold">{captureSystem.precision}</div>
                </div>
                <div>
                  <Label>Latency</Label>
                  <div className="text-sm font-semibold">{captureSystem.latency}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Athlete Configuration</CardTitle>
            <CardDescription>
              Configure the athlete model and capture parameters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="athlete-type">Athlete Type</Label>
                <Select 
                  value={selectedAthleteType}
                  onValueChange={setSelectedAthleteType}
                >
                  <SelectTrigger id="athlete-type">
                    <SelectValue placeholder="Select athlete type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="generic">Generic Athlete</SelectItem>
                    <SelectItem value="football">Football Player</SelectItem>
                    <SelectItem value="basketball">Basketball Player</SelectItem>
                    <SelectItem value="track">Track Athlete</SelectItem>
                    <SelectItem value="strength">Strength Athlete</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="athlete-height">Height (inches)</Label>
                  <Input id="athlete-height" type="number" defaultValue="72" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="athlete-weight">Weight (lbs)</Label>
                  <Input id="athlete-weight" type="number" defaultValue="180" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="capture-fps">Capture Frame Rate</Label>
                <Select defaultValue="120">
                  <SelectTrigger id="capture-fps">
                    <SelectValue placeholder="Select frame rate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="60">60 FPS</SelectItem>
                    <SelectItem value="120">120 FPS</SelectItem>
                    <SelectItem value="240">240 FPS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="skeletal-tracking">Skeletal Tracking</Label>
                  <Switch id="skeletal-tracking" defaultChecked />
                </div>
                <div className="flex justify-between items-center">
                  <Label htmlFor="facial-tracking">Facial Expression Tracking</Label>
                  <Switch id="facial-tracking" defaultChecked />
                </div>
                <div className="flex justify-between items-center">
                  <Label htmlFor="finger-tracking">Finger Tracking</Label>
                  <Switch id="finger-tracking" />
                </div>
                <div className="flex justify-between items-center">
                  <Label htmlFor="physics-simulation">Physics Simulation</Label>
                  <Switch id="physics-simulation" defaultChecked />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={startCapture} 
              disabled={isCapturing}
              className="w-full"
            >
              {isCapturing ? (
                <>
                  <Camera className="h-4 w-4 mr-2 animate-spin" />
                  Capturing ({captureProgress}%)
                </>
              ) : (
                <>
                  <Camera className="h-4 w-4 mr-2" />
                  Start Motion Capture
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      {isCapturing && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Capture Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Progress value={captureProgress} />
              <div className="text-xs text-muted-foreground">
                Capturing motion data for {selectedAthleteType} athlete using {captureSystem.name}
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between">
                  <span>Camera Calibration</span>
                  <Badge variant={captureProgress > 10 ? "secondary" : "outline"}>
                    {captureProgress > 10 ? "Complete" : "In Progress"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Skeletal Tracking</span>
                  <Badge variant={captureProgress > 30 ? "secondary" : "outline"}>
                    {captureProgress > 30 ? "Complete" : "Pending"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Motion Recording</span>
                  <Badge variant={captureProgress > 50 ? "secondary" : "outline"}>
                    {captureProgress > 50 ? "Complete" : "Pending"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Data Processing</span>
                  <Badge variant={captureProgress > 70 ? "secondary" : "outline"}>
                    {captureProgress > 70 ? "Complete" : "Pending"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Model Fitting</span>
                  <Badge variant={captureProgress > 85 ? "secondary" : "outline"}>
                    {captureProgress > 85 ? "Complete" : "Pending"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Export</span>
                  <Badge variant={captureProgress > 95 ? "secondary" : "outline"}>
                    {captureProgress > 95 ? "Complete" : "Pending"}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const AIEnhancement: React.FC = () => {
  const [enhancementTarget, setEnhancementTarget] = useState('all');
  const [isProcessing, setIsProcessing] = useState(false);
  const [enhancementProgress, setEnhancementProgress] = useState(0);
  const [aiModel, setAiModel] = useState('advanced');
  const { toast } = useToast();
  
  const startEnhancement = () => {
    setIsProcessing(true);
    setEnhancementProgress(0);
    
    // Simulate enhancement process
    const interval = setInterval(() => {
      setEnhancementProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          toast({
            title: "AI Enhancement Complete",
            description: "Animations have been enhanced with AI processing.",
          });
          return 100;
        }
        return prev + 3;
      });
    }, 100);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Enhancement System</CardTitle>
          <CardDescription>
            Apply AI-powered enhancements to improve animation quality and realism
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="enhancement-target">Enhancement Target</Label>
                  <Select 
                    value={enhancementTarget}
                    onValueChange={setEnhancementTarget}
                  >
                    <SelectTrigger id="enhancement-target">
                      <SelectValue placeholder="Select target" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Animations</SelectItem>
                      <SelectItem value="sprint">Sprint Animations</SelectItem>
                      <SelectItem value="jump">Jump Animations</SelectItem>
                      <SelectItem value="agility">Agility Animations</SelectItem>
                      <SelectItem value="strength">Strength Animations</SelectItem>
                      <SelectItem value="commercial">Commercial Animations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ai-model">AI Model</Label>
                  <Select 
                    value={aiModel}
                    onValueChange={setAiModel}
                  >
                    <SelectTrigger id="ai-model">
                      <SelectValue placeholder="Select AI model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic Enhancement</SelectItem>
                      <SelectItem value="advanced">Advanced (Claude)</SelectItem>
                      <SelectItem value="expert">Expert (GPT-4o)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-3">
                  <Label>Enhancement Features</Label>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="motion-smoothing" className="text-sm">Motion Smoothing</Label>
                      <Switch id="motion-smoothing" defaultChecked />
                    </div>
                    <div className="flex justify-between items-center">
                      <Label htmlFor="detail-enhancement" className="text-sm">Detail Enhancement</Label>
                      <Switch id="detail-enhancement" defaultChecked />
                    </div>
                    <div className="flex justify-between items-center">
                      <Label htmlFor="realistic-physics" className="text-sm">Realistic Physics</Label>
                      <Switch id="realistic-physics" defaultChecked />
                    </div>
                    <div className="flex justify-between items-center">
                      <Label htmlFor="style-transfer" className="text-sm">Style Transfer</Label>
                      <Switch id="style-transfer" />
                    </div>
                    <div className="flex justify-between items-center">
                      <Label htmlFor="noise-reduction" className="text-sm">Noise Reduction</Label>
                      <Switch id="noise-reduction" defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Processing Settings</Label>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <Label htmlFor="processing-quality" className="text-sm">Processing Quality</Label>
                        <span className="text-xs">Ultra</span>
                      </div>
                      <Slider
                        id="processing-quality"
                        defaultValue={[90]}
                        max={100}
                        step={10}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Draft</span>
                        <span>Standard</span>
                        <span>High</span>
                        <span>Ultra</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <Label htmlFor="processing-speed" className="text-sm">Processing Speed</Label>
                        <span className="text-xs">Balanced</span>
                      </div>
                      <Slider
                        id="processing-speed"
                        defaultValue={[50]}
                        max={100}
                        step={10}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Quality</span>
                        <span>Balanced</span>
                        <span>Speed</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Output Format</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center h-9">
                        <Switch id="output-mp4" defaultChecked />
                        <Label htmlFor="output-mp4" className="ml-2 text-sm">MP4</Label>
                      </div>
                      <Select defaultValue="h264">
                        <SelectTrigger className="h-7 text-xs">
                          <SelectValue placeholder="Codec" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="h264">H.264</SelectItem>
                          <SelectItem value="h265">H.265</SelectItem>
                          <SelectItem value="av1">AV1</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center h-9">
                        <Switch id="output-webm" />
                        <Label htmlFor="output-webm" className="ml-2 text-sm">WebM</Label>
                      </div>
                      <Select defaultValue="vp9" disabled>
                        <SelectTrigger className="h-7 text-xs">
                          <SelectValue placeholder="Codec" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vp8">VP8</SelectItem>
                          <SelectItem value="vp9">VP9</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center h-9">
                        <Switch id="output-html" defaultChecked />
                        <Label htmlFor="output-html" className="ml-2 text-sm">HTML</Label>
                      </div>
                      <Select defaultValue="webgl2">
                        <SelectTrigger className="h-7 text-xs">
                          <SelectValue placeholder="Renderer" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="webgl2">WebGL 2</SelectItem>
                          <SelectItem value="webgpu">WebGPU</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button 
                onClick={startEnhancement} 
                disabled={isProcessing}
                className="w-full md:w-auto"
              >
                {isProcessing ? (
                  <>
                    <Brain className="h-4 w-4 mr-2 animate-pulse" />
                    Processing ({enhancementProgress}%)
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Start AI Enhancement
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {isProcessing && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Enhancement Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Progress value={enhancementProgress} />
              <div className="text-xs text-muted-foreground">
                Enhancing {enhancementTarget === 'all' ? 'all animations' : `${enhancementTarget} animations`} with {aiModel} AI model
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span>Preprocessing</span>
                    <Badge variant={enhancementProgress > 10 ? "secondary" : "outline"} className="text-xs">
                      {enhancementProgress > 10 ? "Done" : "..."}
                    </Badge>
                  </div>
                  <Progress value={enhancementProgress > 10 ? 100 : enhancementProgress * 10} className="h-1" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span>Motion Analysis</span>
                    <Badge variant={enhancementProgress > 25 ? "secondary" : "outline"} className="text-xs">
                      {enhancementProgress > 25 ? "Done" : "..."}
                    </Badge>
                  </div>
                  <Progress value={enhancementProgress > 25 ? 100 : Math.max(0, (enhancementProgress - 10) * 6.67)} className="h-1" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span>AI Processing</span>
                    <Badge variant={enhancementProgress > 40 ? "secondary" : "outline"} className="text-xs">
                      {enhancementProgress > 40 ? "Done" : "..."}
                    </Badge>
                  </div>
                  <Progress value={enhancementProgress > 40 ? 100 : Math.max(0, (enhancementProgress - 25) * 6.67)} className="h-1" />
                </div>
                
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span>Neural Rendering</span>
                    <Badge variant={enhancementProgress > 55 ? "secondary" : "outline"} className="text-xs">
                      {enhancementProgress > 55 ? "Done" : "..."}
                    </Badge>
                  </div>
                  <Progress value={enhancementProgress > 55 ? 100 : Math.max(0, (enhancementProgress - 40) * 6.67)} className="h-1" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span>Color Grading</span>
                    <Badge variant={enhancementProgress > 70 ? "secondary" : "outline"} className="text-xs">
                      {enhancementProgress > 70 ? "Done" : "..."}
                    </Badge>
                  </div>
                  <Progress value={enhancementProgress > 70 ? 100 : Math.max(0, (enhancementProgress - 55) * 6.67)} className="h-1" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span>Final Export</span>
                    <Badge variant={enhancementProgress > 85 ? "secondary" : "outline"} className="text-xs">
                      {enhancementProgress > 85 ? "Done" : "..."}
                    </Badge>
                  </div>
                  <Progress value={enhancementProgress > 85 ? 100 : Math.max(0, (enhancementProgress - 70) * 6.67)} className="h-1" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {enhancementProgress >= 100 && (
        <Card>
          <CardHeader>
            <CardTitle>Enhanced Animations</CardTitle>
            <CardDescription>
              AI-enhanced animations ready for export
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Animation</TableHead>
                    <TableHead>Resolution</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Quality</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {animationPresets.filter(preset => 
                    enhancementTarget === 'all' || preset.category === enhancementTarget
                  ).map(preset => (
                    <TableRow key={preset.id}>
                      <TableCell className="font-medium">{preset.name}</TableCell>
                      <TableCell>{preset.resolution}</TableCell>
                      <TableCell>{preset.duration}s</TableCell>
                      <TableCell>{(preset.fileSize * 1.3).toFixed(1)} MB</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          Enhanced
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download All
                </Button>
                <Button>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Collection
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default function AdvancedAnimationStudio() {
  const [activeTab, setActiveTab] = useState('library');
  const [selectedPreset, setSelectedPreset] = useState<any>(null);
  const [selectedEngine, setSelectedEngine] = useState<any>(null);
  
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Advanced Animation Studio</h1>
        <p className="text-muted-foreground">
          Design, edit, and render sports animations with professional tools
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-4">
          <TabsTrigger value="library">
            <FileVideo className="mr-2 h-4 w-4" />
            <span className="hidden md:inline">Animation Library</span>
            <span className="inline md:hidden">Library</span>
          </TabsTrigger>
          <TabsTrigger value="editor" disabled={!selectedPreset}>
            <PenTool className="mr-2 h-4 w-4" />
            <span className="hidden md:inline">Motion Editor</span>
            <span className="inline md:hidden">Editor</span>
          </TabsTrigger>
          <TabsTrigger value="capture">
            <Camera className="mr-2 h-4 w-4" />
            <span className="hidden md:inline">Motion Capture</span>
            <span className="inline md:hidden">Capture</span>
          </TabsTrigger>
          <TabsTrigger value="render" disabled={!selectedPreset}>
            <Clapperboard className="mr-2 h-4 w-4" />
            <span className="hidden md:inline">Render Preview</span>
            <span className="inline md:hidden">Render</span>
          </TabsTrigger>
          <TabsTrigger value="enhance">
            <Wand2 className="mr-2 h-4 w-4" />
            <span className="hidden md:inline">AI Enhancement</span>
            <span className="inline md:hidden">Enhance</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="library">
          <AnimationLibrary onSelectPreset={(preset) => {
            setSelectedPreset(preset);
            setActiveTab('editor');
          }} />
        </TabsContent>
        
        <TabsContent value="editor">
          {selectedPreset ? (
            <MotionEditor selectedPreset={selectedPreset} />
          ) : (
            <div className="flex flex-col items-center justify-center p-8">
              <FileVideo className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No Animation Selected</h3>
              <p className="text-muted-foreground text-center mt-2">
                Select an animation from the library tab to edit motion data
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="capture">
          <MotionCapture />
        </TabsContent>
        
        <TabsContent value="render">
          <div className="space-y-6">
            {!selectedEngine && (
              <Card>
                <CardHeader>
                  <CardTitle>Select Rendering Engine</CardTitle>
                  <CardDescription>
                    Choose a rendering engine to preview and render your animations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderingEngines.map(engine => (
                      <Card 
                        key={engine.id} 
                        className={`cursor-pointer hover:shadow-md transition-shadow overflow-hidden ${selectedEngine?.id === engine.id ? 'ring-2 ring-primary' : ''}`}
                        onClick={() => setSelectedEngine(engine)}
                      >
                        <CardHeader className="p-4 pb-2">
                          <CardTitle className="text-md font-semibold">{engine.name}</CardTitle>
                          <CardDescription>{engine.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-2">
                          <div className="flex flex-wrap gap-1 mb-3">
                            {engine.capabilities.map(capability => (
                              <Badge key={capability} variant="outline" className="text-xs">
                                {capability}
                              </Badge>
                            ))}
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground">Performance</p>
                              <Progress value={engine.performance} className="h-1.5" />
                              <p className="text-xs font-medium text-right">{engine.performance}%</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground">Quality</p>
                              <Progress value={engine.quality} className="h-1.5" />
                              <p className="text-xs font-medium text-right">{engine.quality}%</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground">Compatibility</p>
                              <Progress value={engine.compatibility} className="h-1.5" />
                              <p className="text-xs font-medium text-right">{engine.compatibility}%</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            <RenderPreview selectedPreset={selectedPreset} renderingEngine={selectedEngine} />
            
            {selectedEngine && (
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedEngine(null)}
                >
                  Change Rendering Engine
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="enhance">
          <AIEnhancement />
        </TabsContent>
      </Tabs>
    </div>
  );
}