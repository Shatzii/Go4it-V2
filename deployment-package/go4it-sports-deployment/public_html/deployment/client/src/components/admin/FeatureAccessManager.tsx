import React, { useState } from 'react';
import { Search, ArrowRight, Plus, ListFilter, Zap, Star, GraduationCap, FileVideo, Activity, Trophy, BarChart3, CheckSquare, User, Settings, ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

// Define feature categories and their features
const featureCategories = [
  {
    id: 'academics',
    name: 'Academic',
    icon: <GraduationCap className="h-5 w-5" />,
    color: 'bg-blue-100 text-blue-800',
    features: [
      { id: 'academic_progress', name: 'Academic Progress Dashboard', path: '/academic-progress', status: 'active' },
      { id: 'gpa_tracker', name: 'GPA Tracking', path: '/academic-progress', status: 'active' },
      { id: 'ncaa_eligibility', name: 'NCAA Eligibility Checker', path: '/academic-progress/eligibility', status: 'active' },
      { id: 'study_plans', name: 'ADHD Study Plans', path: '/academic-progress/study-plans', status: 'active' },
    ]
  },
  {
    id: 'performance',
    name: 'Performance',
    icon: <Activity className="h-5 w-5" />,
    color: 'bg-green-100 text-green-800',
    features: [
      { id: 'gar_score', name: 'GAR Score Analysis', path: '/gar-score', status: 'active' },
      { id: 'skill_tree', name: 'Skill Tree', path: '/skill-tree', status: 'active' },
      { id: 'enhanced_skill_tree', name: 'Enhanced Skill Tree', path: '/enhanced-skill-tree', status: 'active' },
      { id: 'performance_analytics', name: 'Performance Analytics', path: '/analytics-dashboard', status: 'active' },
      { id: 'workout_verification', name: 'Workout Verification', path: '/workout-verification', status: 'active' },
    ]
  },
  {
    id: 'recruiting',
    name: 'Recruiting',
    icon: <Search className="h-5 w-5" />,
    color: 'bg-purple-100 text-purple-800',
    features: [
      { id: 'coach_connection', name: 'Coach Connection', path: '/coach-connection', status: 'active' },
      { id: 'coach_portal', name: 'Coach Portal', path: '/coach-portal', status: 'active' },
      { id: 'nextup_spotlight', name: 'NextUp Spotlight', path: '/nextup-spotlight', status: 'active' },
      { id: 'scoutvision_feed', name: 'ScoutVision Feed', path: '/scoutvision-feed', status: 'active' },
      { id: 'transfer_portal', name: 'Transfer Portal', path: '/transfer-portal', status: 'beta' },
    ]
  },
  {
    id: 'combines',
    name: 'Combines',
    icon: <BarChart3 className="h-5 w-5" />,
    color: 'bg-amber-100 text-amber-800',
    features: [
      { id: 'combine_tour', name: 'Combine Tour', path: '/combine-tour', status: 'active' },
      { id: 'combine_public', name: 'Combine Public Engine', path: '/combine-public', status: 'active' },
      { id: 'combine_leaderboards', name: 'Combine Leaderboards', path: '/combine-leaderboards', status: 'active' },
      { id: 'combine_heatmap', name: 'Combine Heatmap', path: '/combine-heatmap', status: 'beta' },
    ]
  },
  {
    id: 'video',
    name: 'Video',
    icon: <FileVideo className="h-5 w-5" />,
    color: 'bg-red-100 text-red-800',
    features: [
      { id: 'video_analysis', name: 'Video Analysis', path: '/video-analysis', status: 'active' },
      { id: 'highlight_generator', name: 'Highlight Generator', path: '/highlight-generator', status: 'active' },
      { id: 'film_comparison', name: 'Film Comparison', path: '/film-comparison', status: 'active' },
      { id: 'ai_video_player', name: 'AI Video Player', path: '/ai-video-player', status: 'active' },
    ]
  },
  {
    id: 'myplayer',
    name: 'MyPlayer',
    icon: <User className="h-5 w-5" />,
    color: 'bg-cyan-100 text-cyan-800',
    features: [
      { id: 'xp_system', name: 'XP System', path: '/myplayer-xp', status: 'active' },
      { id: 'star_path', name: 'Star Path', path: '/myplayer-star-path', status: 'active' },
      { id: 'weight_room', name: 'Weight Room', path: '/weight-room', status: 'active' },
      { id: 'myplayer_missions', name: 'MyPlayer Missions', path: '/myplayer-missions', status: 'beta' },
      { id: 'myplayer_badges', name: 'MyPlayer Badge System', path: '/myplayer-badges', status: 'beta' },
    ]
  },
  {
    id: 'content',
    name: 'Content',
    icon: <FileVideo className="h-5 w-5" />,
    color: 'bg-indigo-100 text-indigo-800',
    features: [
      { id: 'blog', name: 'Blog', path: '/blog', status: 'active' },
      { id: 'video_highlights', name: 'Video Highlights', path: '/video-highlights', status: 'active' },
      { id: 'ai_blog_generator', name: 'AI Blog Generator', path: '/admin/blog-generator', status: 'active' },
    ]
  },
  {
    id: 'security',
    name: 'Security',
    icon: <ShieldAlert className="h-5 w-5" />,
    color: 'bg-slate-100 text-slate-800',
    features: [
      { id: 'cybershield', name: 'CyberShield Security', path: '/admin/cybershield', status: 'active' },
      { id: 'user_management', name: 'User Management', path: '/admin/users', status: 'active' },
      { id: 'api_keys', name: 'API Key Management', path: '/admin/api-keys', status: 'active' },
    ]
  },
];

const FeatureAccessManager = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingFeature, setEditingFeature] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Filter features based on search query, category, and status
  const filteredFeatures = featureCategories
    .filter(category => activeCategory === 'all' || category.id === activeCategory)
    .flatMap(category => 
      category.features
        .filter(feature => 
          (statusFilter === 'all' || feature.status === statusFilter) &&
          (searchQuery === '' || 
            feature.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            category.name.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .map(feature => ({
          ...feature,
          category: {
            id: category.id,
            name: category.name,
            icon: category.icon,
            color: category.color
          }
        }))
    );

  // Handler for edit feature
  const handleEditFeature = (feature) => {
    setEditingFeature(feature);
    setDialogOpen(true);
  };

  // Handler for save feature changes
  const handleSaveFeature = () => {
    // In a real application, this would update the feature in the database
    console.log('Saving changes to feature:', editingFeature);
    setDialogOpen(false);
    setEditingFeature(null);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center">
          <Settings className="mr-2 h-5 w-5" /> 
          Feature Access Manager
        </CardTitle>
        <CardDescription>
          Manage all platform features, check status, and configure access permissions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search features..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={activeCategory} onValueChange={setActiveCategory}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {featureCategories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center">
                        {category.icon}
                        <span className="ml-2">{category.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="beta">Beta</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {filteredFeatures.length} features found
            </div>
            <Button size="sm" className="gap-1">
              <Plus className="h-4 w-4" /> Add Feature
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="grid" className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="grid" className="flex items-center gap-1">
                <ListFilter className="h-4 w-4" /> Grid View
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center gap-1">
                <ListFilter className="h-4 w-4" /> List View
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="grid" className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFeatures.map(feature => (
                <Card key={feature.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-md ${feature.category.color}`}>
                          {feature.category.icon}
                        </div>
                        <div>
                          <CardTitle className="text-md font-semibold">{feature.name}</CardTitle>
                          <CardDescription className="text-xs">{feature.category.name}</CardDescription>
                        </div>
                      </div>
                      
                      <Badge 
                        variant={
                          feature.status === 'active' ? 'success' : 
                          feature.status === 'beta' ? 'warning' : 'destructive'
                        }
                        className="capitalize"
                      >
                        {feature.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center">
                        <Label htmlFor={`status-${feature.id}`} className="mr-2 text-sm">Active</Label>
                        <Switch id={`status-${feature.id}`} checked={feature.status === 'active'} />
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleEditFeature(feature)}
                        className="text-xs"
                      >
                        Configure <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="list" className="w-full">
            <div className="border rounded-md">
              <div className="grid grid-cols-12 bg-muted/50 p-3 text-sm font-medium">
                <div className="col-span-4">Feature</div>
                <div className="col-span-2">Category</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Path</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>
              <ScrollArea className="h-[400px]">
                {filteredFeatures.map((feature, index) => (
                  <div 
                    key={feature.id} 
                    className={`
                      grid grid-cols-12 p-3 text-sm items-center
                      ${index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}
                      hover:bg-muted/50 transition-colors
                    `}
                  >
                    <div className="col-span-4 flex items-center gap-2">
                      <div className={`p-1 rounded-md ${feature.category.color}`}>
                        {feature.category.icon}
                      </div>
                      <span className="font-medium">{feature.name}</span>
                    </div>
                    <div className="col-span-2">{feature.category.name}</div>
                    <div className="col-span-2">
                      <Badge 
                        variant={
                          feature.status === 'active' ? 'success' : 
                          feature.status === 'beta' ? 'warning' : 'destructive'
                        }
                        className="capitalize"
                      >
                        {feature.status}
                      </Badge>
                    </div>
                    <div className="col-span-2 truncate text-xs text-muted-foreground">
                      {feature.path}
                    </div>
                    <div className="col-span-2 flex justify-end gap-2">
                      <Switch 
                        id={`list-status-${feature.id}`} 
                        checked={feature.status === 'active'} 
                        className="scale-75"
                      />
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleEditFeature(feature)}
                        className="h-7 px-2"
                      >
                        <Settings className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      {/* Edit Feature Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          {editingFeature && (
            <>
              <DialogHeader>
                <DialogTitle>Configure Feature: {editingFeature.name}</DialogTitle>
                <DialogDescription>
                  Adjust settings and access permissions for this feature
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="feature-name" className="text-right">Feature Name</Label>
                  <Input 
                    id="feature-name" 
                    value={editingFeature.name} 
                    onChange={(e) => setEditingFeature({...editingFeature, name: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="feature-status" className="text-right">Status</Label>
                  <Select 
                    value={editingFeature.status}
                    onValueChange={(value) => setEditingFeature({...editingFeature, status: value})}
                  >
                    <SelectTrigger id="feature-status" className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="beta">Beta</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="feature-path" className="text-right">Path</Label>
                  <Input 
                    id="feature-path" 
                    value={editingFeature.path} 
                    onChange={(e) => setEditingFeature({...editingFeature, path: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">User Access</Label>
                  <div className="col-span-3 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="access-athletes" checked={true} />
                      <Label htmlFor="access-athletes">Athletes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="access-coaches" checked={true} />
                      <Label htmlFor="access-coaches">Coaches</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="access-parents" checked={true} />
                      <Label htmlFor="access-parents">Parents</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="access-scouts" checked={true} />
                      <Label htmlFor="access-scouts">Scouts</Label>
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSaveFeature}>Save Changes</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default FeatureAccessManager;