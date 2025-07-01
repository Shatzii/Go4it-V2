import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import {
  Edit,
  Save,
  Plus,
  Trash2,
  Search,
  Settings,
  FileText,
  Database,
  Brain,
  Download,
  Upload,
  History,
  Eye,
  Code,
  Image,
  DollarSign,
  Users,
  Zap,
  Globe,
  Lock,
  Mail,
  BarChart3
} from 'lucide-react';

interface ContentBlock {
  id: string;
  type: 'text' | 'html' | 'json' | 'image' | 'video' | 'ai_config' | 'pricing' | 'feature_list';
  page: string;
  section: string;
  key: string;
  title: string;
  content: any;
  metadata: {
    description?: string;
    required?: boolean;
    validation?: string;
    category?: string;
  };
  lastModified: string;
  modifiedBy: string;
  version: number;
  published: boolean;
}

export default function CMSDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('content');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingContent, setEditingContent] = useState<ContentBlock | null>(null);
  const [newContent, setNewContent] = useState<Partial<ContentBlock>>({});

  // Fetch CMS data
  const { data: contentBlocks, isLoading: contentLoading } = useQuery({
    queryKey: ['/api/cms/content'],
    refetchInterval: 30000
  });

  const { data: aiConfigs, isLoading: aiLoading } = useQuery({
    queryKey: ['/api/cms/ai-configs'],
    refetchInterval: 30000
  });

  const { data: platformConfigs, isLoading: platformLoading } = useQuery({
    queryKey: ['/api/cms/platform-configs'],
    refetchInterval: 30000
  });

  // Mutations
  const updateContentMutation = useMutation({
    mutationFn: async ({ id, content }: { id: string; content: any }) => {
      return apiRequest(`/api/cms/content/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ content })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cms/content'] });
      setEditingContent(null);
      toast({
        title: "Content Updated",
        description: "Content has been successfully updated.",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update content. Please try again.",
        variant: "destructive",
      });
    }
  });

  const createContentMutation = useMutation({
    mutationFn: async (content: Partial<ContentBlock>) => {
      return apiRequest('/api/cms/content', {
        method: 'POST',
        body: JSON.stringify(content)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cms/content'] });
      setNewContent({});
      toast({
        title: "Content Created",
        description: "New content block has been created.",
      });
    }
  });

  const deleteContentMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest(`/api/cms/content/${id}`, {
        method: 'DELETE'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cms/content'] });
      toast({
        title: "Content Deleted",
        description: "Content block has been deleted.",
      });
    }
  });

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'text': return <FileText className="h-4 w-4" />;
      case 'html': return <Code className="h-4 w-4" />;
      case 'json': return <Database className="h-4 w-4" />;
      case 'image': return <Image className="h-4 w-4" />;
      case 'pricing': return <DollarSign className="h-4 w-4" />;
      case 'ai_config': return <Brain className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getContentCategoryColor = (page: string) => {
    switch (page) {
      case 'landing': return 'bg-blue-600';
      case 'dashboard': return 'bg-green-600';
      case 'pricing': return 'bg-purple-600';
      case 'ai': return 'bg-orange-600';
      default: return 'bg-gray-600';
    }
  };

  const filteredContent = contentBlocks?.filter((content: ContentBlock) =>
    content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    content.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
    content.page.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleSaveContent = () => {
    if (editingContent) {
      updateContentMutation.mutate({
        id: editingContent.id,
        content: editingContent.content
      });
    }
  };

  const handleCreateContent = () => {
    if (newContent.title && newContent.key && newContent.page && newContent.section) {
      createContentMutation.mutate({
        ...newContent,
        type: newContent.type || 'text',
        content: newContent.content || '',
        published: true,
        modifiedBy: 'current_user',
        metadata: { description: newContent.metadata?.description || '' }
      });
    }
  };

  const renderContentEditor = (content: ContentBlock) => {
    if (content.type === 'json' || content.type === 'pricing' || content.type === 'feature_list') {
      return (
        <Textarea
          value={JSON.stringify(content.content, null, 2)}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value);
              setEditingContent({ ...content, content: parsed });
            } catch (error) {
              // Keep the text as is if invalid JSON
              setEditingContent({ ...content, content: e.target.value });
            }
          }}
          className="h-64 font-mono text-sm"
          placeholder="Enter JSON content..."
        />
      );
    }

    if (content.type === 'html') {
      return (
        <Textarea
          value={content.content}
          onChange={(e) => setEditingContent({ ...content, content: e.target.value })}
          className="h-32 font-mono text-sm"
          placeholder="Enter HTML content..."
        />
      );
    }

    return (
      <Textarea
        value={content.content}
        onChange={(e) => setEditingContent({ ...content, content: e.target.value })}
        className="h-24"
        placeholder="Enter content..."
      />
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Content Management System
            </h1>
            <p className="text-slate-400 mt-2">
              Full control over platform content, AI configurations, and settings
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="border-slate-600">
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
            <Button variant="outline" className="border-slate-600">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800">
            <TabsTrigger value="content" className="data-[state=active]:bg-purple-600">
              <FileText className="h-4 w-4 mr-2" />
              Content
            </TabsTrigger>
            <TabsTrigger value="ai-config" className="data-[state=active]:bg-blue-600">
              <Brain className="h-4 w-4 mr-2" />
              AI Config
            </TabsTrigger>
            <TabsTrigger value="platform" className="data-[state=active]:bg-green-600">
              <Settings className="h-4 w-4 mr-2" />
              Platform
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-orange-600">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6">
            {/* Content Management */}
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search content..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-80 bg-slate-800 border-slate-600"
                  />
                </div>
              </div>
              <Button
                onClick={() => setNewContent({ page: 'landing', section: 'hero', type: 'text' })}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Content
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Content List */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-purple-400">Content Blocks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {filteredContent.map((content: ContentBlock) => (
                      <div
                        key={content.id}
                        className="p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
                        onClick={() => setEditingContent(content)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {getContentTypeIcon(content.type)}
                            <span className="font-medium">{content.title}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={`${getContentCategoryColor(content.page)} text-white border-0`}>
                              {content.page}
                            </Badge>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteContentMutation.mutate(content.id);
                              }}
                              className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-slate-400 mb-2">{content.metadata.description}</p>
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>{content.section}.{content.key}</span>
                          <span>v{content.version}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Content Editor */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-purple-400">
                    {editingContent ? 'Edit Content' : 'Create New Content'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {editingContent ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={editingContent.title}
                          onChange={(e) => setEditingContent({ ...editingContent, title: e.target.value })}
                          className="bg-slate-700 border-slate-600"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="content">Content</Label>
                        {renderContentEditor(editingContent)}
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={editingContent.published}
                          onCheckedChange={(checked) => setEditingContent({ ...editingContent, published: checked })}
                        />
                        <Label>Published</Label>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          onClick={handleSaveContent}
                          disabled={updateContentMutation.isPending}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setEditingContent(null)}
                          className="border-slate-600"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="new-title">Title</Label>
                          <Input
                            id="new-title"
                            value={newContent.title || ''}
                            onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                            className="bg-slate-700 border-slate-600"
                            placeholder="Content title"
                          />
                        </div>
                        <div>
                          <Label htmlFor="new-key">Key</Label>
                          <Input
                            id="new-key"
                            value={newContent.key || ''}
                            onChange={(e) => setNewContent({ ...newContent, key: e.target.value })}
                            className="bg-slate-700 border-slate-600"
                            placeholder="content_key"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="new-page">Page</Label>
                          <Input
                            id="new-page"
                            value={newContent.page || ''}
                            onChange={(e) => setNewContent({ ...newContent, page: e.target.value })}
                            className="bg-slate-700 border-slate-600"
                            placeholder="landing"
                          />
                        </div>
                        <div>
                          <Label htmlFor="new-section">Section</Label>
                          <Input
                            id="new-section"
                            value={newContent.section || ''}
                            onChange={(e) => setNewContent({ ...newContent, section: e.target.value })}
                            className="bg-slate-700 border-slate-600"
                            placeholder="hero"
                          />
                        </div>
                        <div>
                          <Label htmlFor="new-type">Type</Label>
                          <select
                            id="new-type"
                            value={newContent.type || 'text'}
                            onChange={(e) => setNewContent({ ...newContent, type: e.target.value as any })}
                            className="w-full p-2 bg-slate-700 border border-slate-600 rounded"
                          >
                            <option value="text">Text</option>
                            <option value="html">HTML</option>
                            <option value="json">JSON</option>
                            <option value="pricing">Pricing</option>
                            <option value="feature_list">Feature List</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="new-content">Content</Label>
                        <Textarea
                          id="new-content"
                          value={newContent.content || ''}
                          onChange={(e) => setNewContent({ ...newContent, content: e.target.value })}
                          className="h-24 bg-slate-700 border-slate-600"
                          placeholder="Enter content..."
                        />
                      </div>

                      <Button
                        onClick={handleCreateContent}
                        disabled={createContentMutation.isPending}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Content
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ai-config" className="space-y-6">
            {/* AI Configuration Management */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {aiConfigs?.map((config: any) => (
                <Card key={config.id} className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-blue-400 flex items-center">
                      <Brain className="h-5 w-5 mr-2" />
                      {config.model}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Status</span>
                      <Badge className={config.enabled ? 'bg-green-600' : 'bg-red-600'}>
                        {config.enabled ? 'Active' : 'Disabled'}
                      </Badge>
                    </div>
                    
                    <div>
                      <Label className="text-sm">Temperature</Label>
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        max="2"
                        value={config.parameters.temperature}
                        className="bg-slate-700 border-slate-600 mt-1"
                      />
                    </div>

                    <div>
                      <Label className="text-sm">Max Tokens</Label>
                      <Input
                        type="number"
                        value={config.parameters.max_tokens}
                        className="bg-slate-700 border-slate-600 mt-1"
                      />
                    </div>

                    <div>
                      <Label className="text-sm">System Prompt</Label>
                      <Textarea
                        value={config.systemPrompt}
                        className="h-20 bg-slate-700 border-slate-600 mt-1 text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="text-lg font-bold text-green-400">{config.performance.accuracy}%</div>
                        <div className="text-xs text-slate-400">Accuracy</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-blue-400">{config.performance.speed}ms</div>
                        <div className="text-xs text-slate-400">Speed</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-purple-400">${config.performance.cost_per_request}</div>
                        <div className="text-xs text-slate-400">Cost</div>
                      </div>
                    </div>

                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <Save className="h-4 w-4 mr-2" />
                      Update Config
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="platform" className="space-y-6">
            {/* Platform Configuration */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {platformConfigs?.map((config: any) => (
                <Card key={config.id} className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-green-400 flex items-center">
                      {config.category === 'general' && <Globe className="h-5 w-5 mr-2" />}
                      {config.category === 'security' && <Lock className="h-5 w-5 mr-2" />}
                      {config.category === 'email' && <Mail className="h-5 w-5 mr-2" />}
                      {config.category === 'ai' && <Brain className="h-5 w-5 mr-2" />}
                      {config.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-slate-400">{config.description}</p>
                    
                    <div>
                      <Label className="text-sm">Value</Label>
                      {config.type === 'boolean' ? (
                        <div className="flex items-center space-x-2 mt-2">
                          <Switch checked={config.value} />
                          <span className="text-sm">{config.value ? 'Enabled' : 'Disabled'}</span>
                        </div>
                      ) : (
                        <Input
                          type={config.type === 'number' ? 'number' : 'text'}
                          value={config.value}
                          className="bg-slate-700 border-slate-600 mt-1"
                        />
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <Badge variant="outline" className="border-slate-600">
                        {config.category}
                      </Badge>
                      {config.required && (
                        <Badge className="bg-red-600 text-white">Required</Badge>
                      )}
                    </div>

                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      <Save className="h-4 w-4 mr-2" />
                      Update Setting
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* CMS Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Total Content</p>
                      <p className="text-2xl font-bold text-purple-400">
                        {contentBlocks?.length || 0}
                      </p>
                    </div>
                    <FileText className="h-8 w-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">AI Configs</p>
                      <p className="text-2xl font-bold text-blue-400">
                        {aiConfigs?.length || 0}
                      </p>
                    </div>
                    <Brain className="h-8 w-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Platform Settings</p>
                      <p className="text-2xl font-bold text-green-400">
                        {platformConfigs?.length || 0}
                      </p>
                    </div>
                    <Settings className="h-8 w-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Last Update</p>
                      <p className="text-sm font-medium text-white">
                        Just now
                      </p>
                    </div>
                    <History className="h-8 w-8 text-orange-400" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}