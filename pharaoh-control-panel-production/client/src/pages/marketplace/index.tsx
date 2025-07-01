import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';

// UI Components
import TopNav from '@/components/layout/TopNav';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';

// Custom components
import ModelCard from '@/components/marketplace/ModelCard';
import ModelDetailsDialog from '@/components/marketplace/ModelDetailsDialog';

export default function Marketplace() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [memoryLimit, setMemoryLimit] = useState<number[]>([500]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch marketplace models
  const {
    data: marketplaceModels = [],
    isLoading: isLoadingMarketplace,
    error: marketplaceError
  } = useQuery({
    queryKey: ['/api/marketplace/models'],
    retry: 1
  });

  // Fetch user's installed models
  const {
    data: installedModels = [],
    isLoading: isLoadingInstalled,
    error: installedError
  } = useQuery({
    queryKey: ['/api/marketplace/installed'],
    retry: 1
  });

  // Model installation mutation
  const installMutation = useMutation({
    mutationFn: async (modelId: string) => {
      const response = await apiRequest('POST', '/api/marketplace/install', {
        modelId
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to install model');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/marketplace/installed'] });
      toast({
        title: 'Model installation started',
        description: 'The AI model is being installed and will be available soon.',
        variant: 'default'
      });
    },
    onError: (error: Error) => {
      // Check if it's a premium feature that requires upgrade
      if (error.message.includes('requires an upgraded plan')) {
        toast({
          title: 'Premium Model',
          description: 'This model requires a premium subscription.',
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Installation failed',
          description: error.message,
          variant: 'destructive'
        });
      }
    }
  });

  // Handle model installation
  const handleInstallModel = (modelId: string) => {
    installMutation.mutate(modelId);
  };

  // Get all unique categories from models
  const getCategories = () => {
    const categories = new Set<string>();
    
    marketplaceModels.forEach((model: any) => {
      if (model.category) {
        categories.add(model.category);
      }
    });
    
    return Array.from(categories);
  };

  // Check if a model is installed
  const isModelInstalled = (modelId: string) => {
    return installedModels.some((model: any) => model.id === modelId);
  };

  // Filter and sort models
  const getFilteredModels = () => {
    return marketplaceModels.filter((model: any) => {
      // Search filter
      const matchesSearch = !searchQuery || 
        model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Category filter
      const matchesCategory = activeCategory === 'all' || model.category === activeCategory;
      
      // Verification filter
      const matchesVerification = !verifiedOnly || model.verified;
      
      // Memory filter (extract number from memory string like "250MB")
      const modelMemory = parseInt(model.memory.replace(/[^0-9]/g, ''));
      const matchesMemory = modelMemory <= memoryLimit[0];
      
      return matchesSearch && matchesCategory && matchesVerification && matchesMemory;
    }).sort((a: any, b: any) => {
      // Sort by selected criteria
      switch (sortBy) {
        case 'popular':
          return (b.reviewCount || 0) - (a.reviewCount || 0);
        case 'newest':
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'memory':
          return parseInt(a.memory.replace(/[^0-9]/g, '')) - parseInt(b.memory.replace(/[^0-9]/g, ''));
        default:
          return 0;
      }
    });
  };

  // Is the model premium and user can install it
  const canInstallPremium = (model: any) => {
    const isPremium = model.badge === 'Featured' || model.badge === 'Popular';
    return !isPremium || user?.plan === 'premium' || user?.plan === 'enterprise';
  };

  // Prepare categories from models
  const categories = [
    { id: 'all', name: 'All Models', count: marketplaceModels.length || 0 },
    { id: 'security', name: 'Security', count: 4, icon: 'security' },
    { id: 'performance', name: 'Performance', count: 3, icon: 'speed' },
    { id: 'database', name: 'Database', count: 2, icon: 'storage' },
    { id: 'networking', name: 'Networking', count: 2, icon: 'wifi' },
    { id: 'monitoring', name: 'Monitoring', count: 3, icon: 'monitoring' },
  ];

  // Featured collections
  const collections = [
    { 
      id: 'essential', 
      name: 'Essential Stack', 
      description: 'Must-have models for every server',
      models: 3,
      icon: 'verified'
    },
    { 
      id: 'security', 
      name: 'Security Suite', 
      description: 'Complete protection for your infrastructure',
      models: 4,
      icon: 'security'
    },
    { 
      id: 'performance', 
      name: 'Performance Boosters', 
      description: 'Optimize your server speed and efficiency',
      models: 3,
      icon: 'rocket_launch'
    }
  ];

  // Loading state
  const isLoading = isLoadingMarketplace || isLoadingInstalled;
  const hasError = marketplaceError || installedError;

  // Filtered models
  const filteredModels = getFilteredModels();

  return (
    <div className="flex h-screen bg-dark-1000 text-white overflow-hidden">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Marketplace Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">AI Model Marketplace</h1>
                <p className="text-gray-400">
                  Browse and install AI models to enhance your server
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <Button 
                  variant="outline"
                  className="border-primary-700 text-primary-400 hover:text-primary-300 hover:bg-primary-900/20"
                  onClick={() => setLocation('/dashboard')}
                >
                  <span className="material-icons mr-1 text-sm">apps</span>
                  Dashboard
                </Button>
              </div>
            </div>
            
            {/* Subscription Banner (for free users) */}
            {user?.plan === 'free' && (
              <div className="bg-gradient-to-r from-primary-900/40 to-secondary-900/40 rounded-lg p-4 border border-primary-700/30 mb-6">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="flex items-center">
                    <span className="material-icons text-primary-400 mr-3">workspace_premium</span>
                    <div>
                      <h3 className="font-medium text-white">Upgrade to Premium</h3>
                      <p className="text-sm text-gray-300">Get access to all premium AI models and unlock advanced features</p>
                    </div>
                  </div>
                  <Button
                    className="mt-3 md:mt-0"
                    onClick={() => setLocation('/subscription')}
                  >
                    View Plans
                  </Button>
                </div>
              </div>
            )}
            
            {/* Search Bar */}
            <div className="relative mb-6">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <span className="material-icons text-lg">search</span>
              </span>
              <Input
                type="search"
                placeholder="Search AI models by name, type, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 py-2 bg-dark-800 border-dark-700 text-white placeholder:text-gray-500 focus:border-primary-600"
              />
            </div>
            
            {/* Category Tabs and Filters */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <Tabs 
                value={activeCategory} 
                onValueChange={setActiveCategory}
                className="w-full md:w-auto"
              >
                <TabsList className="bg-dark-800 w-full md:w-auto overflow-x-auto flex no-scrollbar">
                  {categories.map((category) => (
                    <TabsTrigger 
                      key={category.id}
                      value={category.id}
                      className={category.id === 'all' ? 'flex-1 md:flex-initial' : ''}
                    >
                      {category.icon && <span className="material-icons mr-1 text-sm">{category.icon}</span>}
                      {category.name}
                      <span className="ml-1 text-xs text-gray-400">({category.count})</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
              
              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[130px] bg-dark-900 border-dark-700 text-white">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="bg-dark-800 border-dark-700 text-white">
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="memory">Lowest Memory</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="flex items-center space-x-2 bg-dark-900 border border-dark-700 rounded-md px-3 py-1.5">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Label htmlFor="verified-only" className="text-sm cursor-pointer">Verified Only</Label>
                      </TooltipTrigger>
                      <TooltipContent className="bg-dark-800 border-dark-700 text-white">
                        <p>Show only verified models from trusted publishers</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Switch
                    id="verified-only"
                    checked={verifiedOnly}
                    onCheckedChange={setVerifiedOnly}
                  />
                </div>
              </div>
            </div>
            
            {/* Memory Usage Filter */}
            <div className="bg-dark-900 border border-dark-700 rounded-md p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm">Maximum Memory Usage</Label>
                <Badge variant="outline" className="bg-dark-800">
                  {memoryLimit[0]}MB
                </Badge>
              </div>
              <Slider
                defaultValue={[500]}
                max={1000}
                step={50}
                value={memoryLimit}
                onValueChange={setMemoryLimit}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>50MB</span>
                <span>250MB</span>
                <span>500MB</span>
                <span>750MB</span>
                <span>1000MB</span>
              </div>
            </div>
            
            {/* Main Content */}
            {isLoading ? (
              <div className="flex justify-center items-center min-h-[300px]">
                <div className="text-center">
                  <Spinner size="lg" className="text-primary-500 mb-4" />
                  <p className="text-gray-400">Loading AI models...</p>
                </div>
              </div>
            ) : hasError ? (
              <div className="text-center p-8 text-gray-400">
                <div className="material-icons text-3xl mb-2">error_outline</div>
                <p>Failed to load AI models. Please try again later.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    queryClient.invalidateQueries({ queryKey: ['/api/marketplace/models'] });
                    queryClient.invalidateQueries({ queryKey: ['/api/marketplace/installed'] });
                  }}
                >
                  Retry
                </Button>
              </div>
            ) : (
              <>
                {/* Featured Collection Banner */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-white mb-4">Featured Collections</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {collections.map(collection => (
                      <div 
                        key={collection.id}
                        className="bg-gradient-to-br from-dark-900 to-primary-900/20 rounded-lg border border-dark-700 p-4 hover:border-primary-700 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center mb-2">
                          <div className="h-10 w-10 rounded-full bg-primary-900/40 flex items-center justify-center mr-3">
                            <span className="material-icons text-primary-400">{collection.icon}</span>
                          </div>
                          <div>
                            <h3 className="font-medium text-white">{collection.name}</h3>
                            <p className="text-xs text-gray-400">{collection.models} models</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-300 mb-3">{collection.description}</p>
                        <Button variant="outline" size="sm" className="w-full border-dark-700">
                          View Collection
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Filter Results */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-white">
                    {activeCategory === 'all' ? 'All Models' : 
                      categories.find(c => c.id === activeCategory)?.name || 'Models'}
                  </h2>
                  <p className="text-sm text-gray-400">
                    {filteredModels.length} {filteredModels.length === 1 ? 'model' : 'models'} found
                  </p>
                </div>
                
                {/* No results message */}
                {filteredModels.length === 0 ? (
                  <div className="text-center p-12 border border-dark-700 rounded-md bg-dark-900">
                    <div className="bg-dark-800 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="material-icons text-3xl text-gray-400">search_off</span>
                    </div>
                    <h3 className="text-xl font-medium text-white mb-2">No models found</h3>
                    <p className="text-gray-400 max-w-md mx-auto mb-4">
                      We couldn't find any models matching your current filters. Try adjusting your search criteria.
                    </p>
                    <Button variant="outline" onClick={() => {
                      setSearchQuery('');
                      setActiveCategory('all');
                      setVerifiedOnly(false);
                      setMemoryLimit([500]);
                    }}>
                      Clear Filters
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredModels.map((model: any) => {
                      const isInstalled = isModelInstalled(model.id);
                      const isInstalling = installMutation.isPending && installMutation.variables === model.id;
                      const isPremium = model.badge === 'Featured' || model.badge === 'Popular';
                      
                      return (
                        <ModelCard
                          key={model.id}
                          model={model}
                          onSelect={setSelectedModel}
                          isInstalled={isInstalled}
                          isInstalling={isInstalling}
                          isPremium={isPremium && !canInstallPremium(model)}
                        />
                      );
                    })}
                  </div>
                )}
                
                {/* Load More Button */}
                {filteredModels.length > 0 && filteredModels.length % 6 === 0 && (
                  <div className="flex justify-center mt-8">
                    <Button variant="outline" className="border-dark-700 text-primary-400">
                      Load More Models
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
      
      {/* Model Details Dialog */}
      {selectedModel && (
        <ModelDetailsDialog
          model={selectedModel}
          open={!!selectedModel}
          onOpenChange={(open) => !open && setSelectedModel(null)}
          isInstalled={isModelInstalled(selectedModel.id)}
          onInstall={handleInstallModel}
          installMutation={installMutation}
        />
      )}
    </div>
  );
}