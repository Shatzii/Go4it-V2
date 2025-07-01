import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, ThumbsUp, ThumbsDown, MessageSquare, Share2 } from 'lucide-react';

interface ModelDetailsDialogProps {
  model: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isInstalled: boolean;
  onInstall: (modelId: string) => void;
  installMutation: any;
}

const ModelDetailsDialog: React.FC<ModelDetailsDialogProps> = ({
  model,
  open,
  onOpenChange,
  isInstalled,
  onInstall,
  installMutation
}) => {
  const [activeTab, setActiveTab] = React.useState('overview');
  const { toast } = useToast();
  const { user } = useAuth();

  // Check if model is premium and user can install it
  const isPremium = model?.badge === 'Featured' || model?.badge === 'Popular';
  const canInstallPremium = user?.plan === 'premium' || user?.plan === 'enterprise';
  const requiresUpgrade = isPremium && !canInstallPremium;

  // Get badge variant based on model color property
  const getBadgeVariant = (color: string) => {
    switch (color) {
      case 'primary':
        return 'default';
      case 'secondary':
        return 'secondary';
      case 'accent':
        return 'outline';
      default:
        return 'default';
    }
  };

  // Mock reviews for demonstration
  const reviews = [
    {
      id: '1',
      user: 'Alex Johnson',
      rating: 5,
      date: '2024-05-10',
      content: 'This model has been incredibly effective at optimizing my database queries. Saw a 40% performance improvement!',
      likes: 12,
      dislikes: 1
    },
    {
      id: '2',
      user: 'Maria Garcia',
      rating: 4,
      date: '2024-05-08',
      content: 'Very good model with accurate predictions. The only issue I found was with extremely large datasets.',
      likes: 8,
      dislikes: 2
    },
    {
      id: '3',
      user: 'Sam Taylor',
      rating: 5,
      date: '2024-05-01',
      content: 'Completely transformed our server monitoring. Found issues we didn\'t even know existed.',
      likes: 15,
      dislikes: 0
    }
  ];

  // Mock usage statistics
  const usageStats = {
    installCount: 1248,
    avgCpuUsage: '2.3%',
    avgMemoryUsage: '180MB',
    avgResponseTime: '120ms',
    successRate: '99.7%',
    updatedAt: '2024-05-15'
  };

  // Mock related models
  const relatedModels = [
    { id: 'rel1', name: 'Network Anomaly Detector', type: 'Security' },
    { id: 'rel2', name: 'Database Replication Monitor', type: 'Database' },
    { id: 'rel3', name: 'Traffic Pattern Analyzer', type: 'Analytics' }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-dark-900 border-dark-700 text-white max-w-4xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <span className="material-icons text-primary-500">{model?.icon}</span>
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                {model?.name}
                {model?.verified && (
                  <span className="material-icons text-blue-400 text-sm">verified</span>
                )}
                {isPremium && (
                  <Badge className="ml-2 bg-amber-600 text-amber-100 border-amber-700">
                    Premium
                  </Badge>
                )}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                {model?.type}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="bg-dark-800 w-full justify-start border-b border-dark-700 rounded-none p-0">
            <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary-500 data-[state=active]:bg-transparent text-sm">
              Overview
            </TabsTrigger>
            <TabsTrigger value="reviews" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary-500 data-[state=active]:bg-transparent text-sm">
              Reviews
            </TabsTrigger>
            <TabsTrigger value="usage" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary-500 data-[state=active]:bg-transparent text-sm">
              Usage Stats
            </TabsTrigger>
            <TabsTrigger value="related" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary-500 data-[state=active]:bg-transparent text-sm">
              Related
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="pt-4 focus:outline-none">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Description</h3>
                <p className="text-gray-300">{model?.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Features</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="material-icons text-green-400 mr-2 text-sm">check_circle</span>
                      <span className="text-gray-300">Real-time performance monitoring</span>
                    </li>
                    <li className="flex items-start">
                      <span className="material-icons text-green-400 mr-2 text-sm">check_circle</span>
                      <span className="text-gray-300">Automatic anomaly detection</span>
                    </li>
                    <li className="flex items-start">
                      <span className="material-icons text-green-400 mr-2 text-sm">check_circle</span>
                      <span className="text-gray-300">Predictive analytics</span>
                    </li>
                    <li className="flex items-start">
                      <span className="material-icons text-green-400 mr-2 text-sm">check_circle</span>
                      <span className="text-gray-300">Custom alerting rules</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Specifications</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Memory Usage:</span>
                      <span className="text-white">{model?.memory}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Compatible With:</span>
                      <span className="text-white">All Server Types</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Last Updated:</span>
                      <span className="text-white">May 12, 2024</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Version:</span>
                      <span className="text-white">1.2.0</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">About the Publisher</h4>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary-900 flex items-center justify-center">
                    <span className="material-icons text-primary-400">business</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-white font-medium flex items-center">
                      Pharaoh AI Labs
                      <span className="material-icons text-blue-400 text-sm ml-1">verified</span>
                    </p>
                    <p className="text-xs text-gray-400">12 models published • Since 2022</p>
                  </div>
                </div>
              </div>

              {model?.badge === 'Premium' && (
                <div className="bg-dark-800 p-4 rounded-md border border-dark-700">
                  <h4 className="text-sm font-medium text-white mb-2 flex items-center">
                    <span className="material-icons text-amber-400 mr-1 text-sm">workspace_premium</span>
                    Premium Features
                  </h4>
                  <ul className="space-y-1.5 text-sm">
                    <li className="flex items-start">
                      <span className="material-icons text-green-400 mr-2 text-xs">check_circle</span>
                      <span className="text-gray-300">Advanced threat detection algorithms</span>
                    </li>
                    <li className="flex items-start">
                      <span className="material-icons text-green-400 mr-2 text-xs">check_circle</span>
                      <span className="text-gray-300">Custom rule creation</span>
                    </li>
                    <li className="flex items-start">
                      <span className="material-icons text-green-400 mr-2 text-xs">check_circle</span>
                      <span className="text-gray-300">Integration with external security tools</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="pt-4 focus:outline-none">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="h-5 w-5 text-amber-400 fill-amber-400"
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-white font-medium">4.8</span>
                  <span className="ml-1 text-gray-400">({reviews.length} reviews)</span>
                </div>
                <Button size="sm" variant="outline" className="border-primary-700 text-primary-400">
                  Write a Review
                </Button>
              </div>

              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-dark-800 rounded-md p-4 border border-dark-700">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-white">{review.user}</p>
                        <div className="flex items-center mt-1">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-3.5 w-3.5 ${
                                  star <= review.rating
                                    ? 'text-amber-400 fill-amber-400'
                                    : 'text-gray-500'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-400 ml-2">{review.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm mb-3">{review.content}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-400">
                      <button className="flex items-center hover:text-gray-300">
                        <ThumbsUp className="h-3.5 w-3.5 mr-1" />
                        <span>{review.likes}</span>
                      </button>
                      <button className="flex items-center hover:text-gray-300">
                        <ThumbsDown className="h-3.5 w-3.5 mr-1" />
                        <span>{review.dislikes}</span>
                      </button>
                      <button className="flex items-center hover:text-gray-300">
                        <MessageSquare className="h-3.5 w-3.5 mr-1" />
                        <span>Reply</span>
                      </button>
                      <button className="flex items-center hover:text-gray-300">
                        <Share2 className="h-3.5 w-3.5 mr-1" />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="usage" className="pt-4 focus:outline-none">
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-dark-800 p-4 rounded-md border border-dark-700 text-center">
                  <p className="text-gray-400 text-sm mb-1">Installations</p>
                  <p className="text-2xl font-bold text-white">{usageStats.installCount}</p>
                </div>
                <div className="bg-dark-800 p-4 rounded-md border border-dark-700 text-center">
                  <p className="text-gray-400 text-sm mb-1">Avg. CPU Usage</p>
                  <p className="text-2xl font-bold text-green-400">{usageStats.avgCpuUsage}</p>
                </div>
                <div className="bg-dark-800 p-4 rounded-md border border-dark-700 text-center">
                  <p className="text-gray-400 text-sm mb-1">Avg. Memory</p>
                  <p className="text-2xl font-bold text-blue-400">{usageStats.avgMemoryUsage}</p>
                </div>
              </div>

              <div className="bg-dark-800 p-4 rounded-md border border-dark-700">
                <h3 className="text-sm font-medium text-white mb-3">Performance Metrics</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">Response Time</span>
                      <span className="text-white">{usageStats.avgResponseTime}</span>
                    </div>
                    <div className="h-2 bg-dark-900 rounded-full overflow-hidden">
                      <div className="bg-primary-600 h-full w-[75%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">Success Rate</span>
                      <span className="text-white">{usageStats.successRate}</span>
                    </div>
                    <div className="h-2 bg-dark-900 rounded-full overflow-hidden">
                      <div className="bg-green-600 h-full w-[99%]"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-white mb-3">Usage Recommendations</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="material-icons text-primary-400 mr-2 text-sm">tips_and_updates</span>
                    <span className="text-gray-300">Performs best when allocated at least 250MB of memory</span>
                  </li>
                  <li className="flex items-start">
                    <span className="material-icons text-primary-400 mr-2 text-sm">tips_and_updates</span>
                    <span className="text-gray-300">Consider running during off-peak hours for initial analysis</span>
                  </li>
                  <li className="flex items-start">
                    <span className="material-icons text-primary-400 mr-2 text-sm">tips_and_updates</span>
                    <span className="text-gray-300">Pairs well with Database Optimizer for maximum efficiency</span>
                  </li>
                </ul>
              </div>

              <div className="text-xs text-gray-500 text-right">
                Stats last updated: {usageStats.updatedAt}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="related" className="pt-4 focus:outline-none">
            <div className="space-y-6">
              <h3 className="text-lg font-medium mb-3">Related Models</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedModels.map(relModel => (
                  <div key={relModel.id} className="bg-dark-800 p-4 rounded-md border border-dark-700 hover:border-dark-600 cursor-pointer transition-colors">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-primary-900/50 flex items-center justify-center mr-3">
                        <span className="material-icons text-primary-400">extension</span>
                      </div>
                      <div>
                        <p className="font-medium text-white">{relModel.name}</p>
                        <p className="text-xs text-gray-400">{relModel.type}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Frequently Used Together</h3>
                <div className="bg-dark-800 p-4 rounded-md border border-dark-700">
                  <h4 className="text-sm font-medium text-white mb-2">Suggested Stack</h4>
                  <p className="text-sm text-gray-300 mb-3">
                    For optimal server performance and security, we recommend using these models together:
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-primary-900/50 flex items-center justify-center mr-2">
                        <span className="material-icons text-sm text-primary-400">analytics</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">{model?.name}</p>
                      </div>
                      <Badge>Current</Badge>
                    </div>
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-secondary-900/50 flex items-center justify-center mr-2">
                        <span className="material-icons text-sm text-secondary-400">security</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">Advanced Firewall</p>
                      </div>
                      <Button size="sm" variant="outline" className="h-7 text-xs">Install</Button>
                    </div>
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-amber-900/50 flex items-center justify-center mr-2">
                        <span className="material-icons text-sm text-amber-400">storage</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">Database Optimizer</p>
                      </div>
                      <Button size="sm" variant="outline" className="h-7 text-xs">Install</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {model?.badge && (
              <Badge variant={getBadgeVariant(model?.color || 'primary')}>
                {model?.badge}
              </Badge>
            )}
            <Badge variant="outline" className="bg-dark-800">
              {model?.memory} Memory
            </Badge>
            {model?.verified && (
              <Badge variant="outline" className="bg-dark-800 border-blue-500 text-blue-400">
                Verified
              </Badge>
            )}
          </div>
          
          <div className="flex gap-2">
            {isInstalled ? (
              <Button disabled className="min-w-[120px]">
                Already Installed
              </Button>
            ) : requiresUpgrade ? (
              <Button 
                className="min-w-[120px]"
                onClick={() => {
                  onOpenChange(false);
                  toast({
                    title: 'Premium Model',
                    description: 'This model requires a premium subscription.',
                    variant: 'default'
                  });
                }}
              >
                Upgrade to Install
              </Button>
            ) : installMutation.isPending && installMutation.variables === model?.id ? (
              <Button disabled className="min-w-[120px]">
                <Spinner className="mr-2" size="sm" />
                Installing...
              </Button>
            ) : (
              <Button 
                onClick={() => onInstall(model?.id)}
                className="min-w-[120px]"
              >
                Install Model
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModelDetailsDialog;