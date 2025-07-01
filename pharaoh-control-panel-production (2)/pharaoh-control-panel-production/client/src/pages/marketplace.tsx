import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { 
  Brain,
  CheckCircle2,
  Crown,
  Database,
  Download,
  Eye,
  RefreshCw,
  Search,
  Shield,
  Star,
  Terminal,
  Trash2,
  Zap 
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface MarketplaceModel {
  id: string;
  name: string;
  description: string;
  category: string;
  version: string;
  publisher: string;
  rating: number;
  downloadCount: number;
  verified: boolean;
  featured: boolean;
  size: string;
  capabilities: string[];
  pricing: {
    free: boolean;
    price?: number;
  };
}

interface InstalledModel {
  id: string;
  modelId: string;
  status: string;
  installedAt: string;
}

const AIMarketplace: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModel, setSelectedModel] = useState<MarketplaceModel | null>(null);

  // Sample marketplace models
  const sampleModels: MarketplaceModel[] = [
    {
      id: 'llama-3-70b',
      name: 'LLaMA 3 70B',
      description: 'Large language model for text generation, code completion, and conversational AI',
      category: 'language',
      version: '3.0',
      publisher: 'Meta AI',
      rating: 4.8,
      downloadCount: 125430,
      verified: true,
      featured: true,
      size: '35.2 GB',
      capabilities: ['Text Generation', 'Code Completion', 'Chat', 'Reasoning'],
      pricing: { free: true }
    },
    {
      id: 'claude-3-haiku',
      name: 'Claude 3 Haiku',
      description: 'Fast and efficient AI model for quick responses and lightweight tasks',
      category: 'language',
      version: '3.0',
      publisher: 'Anthropic',
      rating: 4.6,
      downloadCount: 89234,
      verified: true,
      featured: false,
      size: '8.4 GB',
      capabilities: ['Fast Chat', 'Text Analysis', 'Summarization'],
      pricing: { free: false, price: 29.99 }
    },
    {
      id: 'stable-diffusion-xl',
      name: 'Stable Diffusion XL',
      description: 'High-resolution image generation model with superior quality and detail',
      category: 'image',
      version: '1.0',
      publisher: 'Stability AI',
      rating: 4.9,
      downloadCount: 234567,
      verified: true,
      featured: true,
      size: '6.9 GB',
      capabilities: ['Image Generation', 'Image Editing', 'Style Transfer'],
      pricing: { free: true }
    },
    {
      id: 'whisper-large-v3',
      name: 'Whisper Large v3',
      description: 'State-of-the-art speech recognition and transcription model',
      category: 'audio',
      version: '3.0',
      publisher: 'OpenAI',
      rating: 4.7,
      downloadCount: 156789,
      verified: true,
      featured: false,
      size: '1.5 GB',
      capabilities: ['Speech Recognition', 'Transcription', 'Translation'],
      pricing: { free: true }
    },
    {
      id: 'code-llama-34b',
      name: 'Code Llama 34B',
      description: 'Specialized code generation and programming assistance model',
      category: 'code',
      version: '2.0',
      publisher: 'Meta AI',
      rating: 4.5,
      downloadCount: 67890,
      verified: true,
      featured: false,
      size: '17.1 GB',
      capabilities: ['Code Generation', 'Bug Fixing', 'Code Explanation', 'Refactoring'],
      pricing: { free: true }
    },
    {
      id: 'server-guardian',
      name: 'Server Guardian AI',
      description: 'AI-powered server monitoring and security analysis tool',
      category: 'security',
      version: '1.2',
      publisher: 'PharaohAI',
      rating: 4.8,
      downloadCount: 23456,
      verified: true,
      featured: true,
      size: '2.3 GB',
      capabilities: ['Threat Detection', 'Performance Monitoring', 'Automated Fixes'],
      pricing: { free: false, price: 49.99 }
    }
  ];

  // Sample installed models
  const sampleInstalled: InstalledModel[] = [
    {
      id: 'inst-1',
      modelId: 'llama-3-70b',
      status: 'active',
      installedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'inst-2',
      modelId: 'stable-diffusion-xl',
      status: 'active',
      installedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  // Fetch marketplace models (using sample data for demo)
  const { data: marketplaceModels = sampleModels, isLoading: isLoadingModels } = useQuery({
    queryKey: ['/api/marketplace/models', selectedCategory, searchQuery],
    queryFn: async () => {
      // In real implementation, this would fetch from API
      const response = await apiRequest('GET', '/api/marketplace/models');
      if (!response.ok) {
        // Fallback to sample data for demo
        return sampleModels;
      }
      return response.json();
    },
    enabled: !!user,
  });

  // Fetch installed models (using sample data for demo)
  const { data: installedModels = sampleInstalled, isLoading: isLoadingInstalled } = useQuery({
    queryKey: ['/api/user/models'],
    queryFn: async () => {
      // In real implementation, this would fetch from API
      const response = await apiRequest('GET', '/api/user/models');
      if (!response.ok) {
        // Fallback to sample data for demo
        return sampleInstalled;
      }
      return response.json();
    },
    enabled: !!user,
  });

  // Install model mutation
  const installModelMutation = useMutation({
    mutationFn: async (modelId: string) => {
      const response = await apiRequest('POST', '/api/user/models/install', { modelId });
      if (!response.ok) throw new Error('Failed to install model');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/models'] });
      toast({
        title: "Model installed successfully",
        description: "The AI model is now ready to use in your applications.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Installation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Uninstall model mutation
  const uninstallModelMutation = useMutation({
    mutationFn: async (modelId: string) => {
      const response = await apiRequest('DELETE', `/api/user/models/${modelId}`);
      if (!response.ok) throw new Error('Failed to uninstall model');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/models'] });
      toast({
        title: "Model uninstalled",
        description: "The AI model has been removed from your system.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Uninstall failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Check if model is installed
  const isModelInstalled = (modelId: string) => {
    return installedModels.some((installed: InstalledModel) => installed.modelId === modelId);
  };

  // Filter models
  const filteredModels = marketplaceModels.filter((model: MarketplaceModel) => {
    const matchesCategory = selectedCategory === 'all' || model.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'language', label: 'Language Models' },
    { value: 'image', label: 'Image Generation' },
    { value: 'audio', label: 'Audio Processing' },
    { value: 'code', label: 'Code Generation' },
    { value: 'security', label: 'Security & Monitoring' }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'language': return <Brain className="h-4 w-4" />;
      case 'image': return <Eye className="h-4 w-4" />;
      case 'audio': return <Zap className="h-4 w-4" />;
      case 'code': return <Terminal className="h-4 w-4" />;
      case 'security': return <Shield className="h-4 w-4" />;
      default: return <Database className="h-4 w-4" />;
    }
  };

  const formatDownloads = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">AI Marketplace</span>
          </h1>
          <p className="text-slate-400">
            Discover and install powerful AI models for your server infrastructure
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search AI models..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-slate-700 bg-slate-800 pl-10 text-white"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48 border-slate-700 bg-slate-800 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-slate-700 bg-slate-800 text-white">
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="browse" className="w-full">
          <TabsList className="bg-slate-800 mb-6">
            <TabsTrigger value="browse">Browse Models</TabsTrigger>
            <TabsTrigger value="installed">Installed ({installedModels.length})</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
          </TabsList>

          {/* Browse Models Tab */}
          <TabsContent value="browse" className="space-y-6">
            {isLoadingModels ? (
              <div className="flex h-64 items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-transparent border-blue-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredModels.map((model: MarketplaceModel) => (
                  <Card 
                    key={model.id} 
                    className="border-slate-800 bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer"
                    onClick={() => setSelectedModel(model)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          {getCategoryIcon(model.category)}
                          <CardTitle className="text-lg text-white">{model.name}</CardTitle>
                        </div>
                        <div className="flex items-center space-x-1">
                          {model.verified && (
                            <Badge className="bg-emerald-500 text-white">
                              <Shield className="mr-1 h-3 w-3" />
                              Verified
                            </Badge>
                          )}
                          {model.featured && (
                            <Badge className="bg-amber-500 text-white">
                              <Crown className="mr-1 h-3 w-3" />
                              Featured
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-slate-400">
                        <span>{model.publisher}</span>
                        <span>•</span>
                        <span>v{model.version}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-300 text-sm mb-4 line-clamp-2">
                        {model.description}
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Size:</span>
                          <span className="text-white">{model.size}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Downloads:</span>
                          <span className="text-white">{formatDownloads(model.downloadCount)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">Rating:</span>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            <span className="text-white">{model.rating}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      {isModelInstalled(model.id) ? (
                        <Button
                          className="w-full bg-emerald-600 hover:bg-emerald-700"
                          disabled
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Installed
                        </Button>
                      ) : (
                        <Button
                          className="w-full bg-blue-600 hover:bg-blue-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            installModelMutation.mutate(model.id);
                          }}
                          disabled={installModelMutation.isPending}
                        >
                          {installModelMutation.isPending ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              Installing...
                            </>
                          ) : model.pricing.free ? (
                            <>
                              <Download className="mr-2 h-4 w-4" />
                              Install Free
                            </>
                          ) : (
                            <>
                              <Download className="mr-2 h-4 w-4" />
                              Install ${model.pricing.price}
                            </>
                          )}
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Installed Models Tab */}
          <TabsContent value="installed" className="space-y-6">
            {isLoadingInstalled ? (
              <div className="flex h-64 items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-transparent border-blue-600"></div>
              </div>
            ) : installedModels.length === 0 ? (
              <div className="text-center py-12">
                <Database className="h-12 w-12 mx-auto text-slate-600 mb-4" />
                <h3 className="text-lg font-medium text-slate-400 mb-2">No models installed</h3>
                <p className="text-slate-500">Install your first AI model from the browse tab.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {installedModels.map((installed: InstalledModel) => {
                  const model = marketplaceModels.find((m: MarketplaceModel) => m.id === installed.modelId);
                  if (!model) return null;
                  
                  return (
                    <Card key={installed.id} className="border-slate-800 bg-slate-900">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2">
                            {getCategoryIcon(model.category)}
                            <CardTitle className="text-lg text-white">{model.name}</CardTitle>
                          </div>
                          <Badge className="bg-emerald-500 text-white">
                            Active
                          </Badge>
                        </div>
                        <div className="text-sm text-slate-400">
                          Installed {new Date(installed.installedAt).toLocaleDateString()}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-300 text-sm mb-4">
                          {model.description}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {model.capabilities.slice(0, 3).map((capability, index) => (
                            <Badge key={index} variant="outline" className="border-slate-700 text-slate-400 text-xs">
                              {capability}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 border-slate-700"
                        >
                          Configure
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => uninstallModelMutation.mutate(model.id)}
                          disabled={uninstallModelMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Featured Models Tab */}
          <TabsContent value="featured" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {marketplaceModels
                .filter((model: MarketplaceModel) => model.featured)
                .map((model: MarketplaceModel) => (
                  <Card 
                    key={model.id} 
                    className="border-slate-800 bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer"
                    onClick={() => setSelectedModel(model)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          {getCategoryIcon(model.category)}
                          <CardTitle className="text-lg text-white">{model.name}</CardTitle>
                        </div>
                        <Badge className="bg-amber-500 text-white">
                          <Crown className="mr-1 h-3 w-3" />
                          Featured
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-300 text-sm mb-4">
                        {model.description}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Rating:</span>
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span className="text-white">{model.rating}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      {isModelInstalled(model.id) ? (
                        <Button
                          className="w-full bg-emerald-600 hover:bg-emerald-700"
                          disabled
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Installed
                        </Button>
                      ) : (
                        <Button
                          className="w-full bg-blue-600 hover:bg-blue-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            installModelMutation.mutate(model.id);
                          }}
                          disabled={installModelMutation.isPending}
                        >
                          {installModelMutation.isPending ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              Installing...
                            </>
                          ) : (
                            <>
                              <Download className="mr-2 h-4 w-4" />
                              {model.pricing.free ? 'Install Free' : `Install $${model.pricing.price}`}
                            </>
                          )}
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Model Details Dialog */}
        <Dialog open={!!selectedModel} onOpenChange={() => setSelectedModel(null)}>
          <DialogContent className="border-slate-800 bg-slate-900 text-white sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                {selectedModel && getCategoryIcon(selectedModel.category)}
                <span>{selectedModel?.name}</span>
              </DialogTitle>
              <DialogDescription className="text-slate-400">
                {selectedModel?.description}
              </DialogDescription>
            </DialogHeader>
            
            {selectedModel && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-400">Publisher</label>
                    <p className="text-white">{selectedModel.publisher}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-400">Version</label>
                    <p className="text-white">v{selectedModel.version}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-400">Size</label>
                    <p className="text-white">{selectedModel.size}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-400">Downloads</label>
                    <p className="text-white">{formatDownloads(selectedModel.downloadCount)}</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-400">Capabilities</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedModel.capabilities.map((capability, index) => (
                      <Badge key={index} variant="outline" className="border-slate-700 text-slate-400">
                        {capability}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="text-white">{selectedModel.rating} rating</span>
                  </div>
                  {selectedModel.pricing.free ? (
                    <Badge className="bg-emerald-500 text-white">Free</Badge>
                  ) : (
                    <Badge className="bg-blue-500 text-white">${selectedModel.pricing.price}</Badge>
                  )}
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setSelectedModel(null)}
                className="border-slate-700"
              >
                Close
              </Button>
              {selectedModel && (
                isModelInstalled(selectedModel.id) ? (
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700"
                    disabled
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Already Installed
                  </Button>
                ) : (
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => {
                      installModelMutation.mutate(selectedModel.id);
                      setSelectedModel(null);
                    }}
                    disabled={installModelMutation.isPending}
                  >
                    {installModelMutation.isPending ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Installing...
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        {selectedModel.pricing.free ? 'Install Free' : `Install for $${selectedModel.pricing.price}`}
                      </>
                    )}
                  </Button>
                )
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AIMarketplace;