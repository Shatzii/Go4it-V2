import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Store, 
  Bot, 
  TrendingUp, 
  DollarSign, 
  Star, 
  Download, 
  Upload,
  Search,
  Filter,
  ShoppingCart,
  Award,
  Users,
  Zap,
  Brain,
  Target,
  Shield,
  Activity
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AIAgent {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  downloads: number;
  revenue: number;
  creator: string;
  features: string[];
  industries: string[];
  version: string;
  lastUpdated: string;
  status: 'active' | 'new' | 'featured';
  performance: {
    accuracy: number;
    speed: number;
    efficiency: number;
  };
}

interface CreatorProfile {
  id: string;
  name: string;
  avatar: string;
  totalRevenue: number;
  totalAgents: number;
  rating: number;
  verified: boolean;
  specialties: string[];
}

export default function AgentMarketplace() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [featuredAgents, setFeaturedAgents] = useState<AIAgent[]>([]);
  const [creators, setCreators] = useState<CreatorProfile[]>([]);
  const { toast } = useToast();

  const agentCategories = [
    'all',
    'sales',
    'marketing',
    'customer-service',
    'analytics',
    'finance',
    'healthcare',
    'manufacturing',
    'education'
  ];

  useEffect(() => {
    // Initialize marketplace data
    const mockAgents: AIAgent[] = [
      {
        id: '1',
        name: 'Healthcare Lead Qualifier Pro',
        description: 'Advanced AI agent that qualifies healthcare prospects with 94% accuracy using medical compliance protocols',
        category: 'healthcare',
        price: 299,
        rating: 4.8,
        downloads: 1247,
        revenue: 372453,
        creator: 'Dr. Sarah Chen',
        features: ['HIPAA Compliance', 'Medical Terminology', 'Insurance Validation', 'Real-time Scoring'],
        industries: ['Healthcare', 'Medical Devices', 'Pharmaceuticals'],
        version: '2.1.3',
        lastUpdated: '2025-06-25',
        status: 'featured',
        performance: { accuracy: 94, speed: 87, efficiency: 92 }
      },
      {
        id: '2',
        name: 'Financial Risk Analyzer',
        description: 'Sophisticated AI for real-time financial risk assessment and compliance monitoring',
        category: 'finance',
        price: 449,
        rating: 4.9,
        downloads: 892,
        revenue: 400348,
        creator: 'Marcus Rodriguez',
        features: ['Risk Modeling', 'Compliance Checks', 'Market Analysis', 'Regulatory Updates'],
        industries: ['Banking', 'Investment', 'Insurance', 'Fintech'],
        version: '3.0.1',
        lastUpdated: '2025-06-28',
        status: 'new',
        performance: { accuracy: 96, speed: 91, efficiency: 89 }
      },
      {
        id: '3',
        name: 'Manufacturing Quality Inspector',
        description: 'AI-powered quality control agent for manufacturing processes with computer vision integration',
        category: 'manufacturing',
        price: 399,
        rating: 4.7,
        downloads: 1156,
        revenue: 461244,
        creator: 'Tech Innovations Inc',
        features: ['Computer Vision', 'Defect Detection', 'Process Optimization', 'Predictive Maintenance'],
        industries: ['Automotive', 'Electronics', 'Aerospace', 'Consumer Goods'],
        version: '1.8.2',
        lastUpdated: '2025-06-20',
        status: 'active',
        performance: { accuracy: 91, speed: 94, efficiency: 88 }
      },
      {
        id: '4',
        name: 'Education Performance Tracker',
        description: 'Comprehensive student performance analysis and personalized learning recommendations',
        category: 'education',
        price: 199,
        rating: 4.6,
        downloads: 2341,
        revenue: 465919,
        creator: 'EduTech Solutions',
        features: ['Learning Analytics', 'Progress Tracking', 'Personalization', 'Parent Insights'],
        industries: ['K-12 Education', 'Higher Education', 'Corporate Training'],
        version: '4.2.0',
        lastUpdated: '2025-06-22',
        status: 'active',
        performance: { accuracy: 89, speed: 85, efficiency: 93 }
      },
      {
        id: '5',
        name: 'Sales Conversion Optimizer',
        description: 'Advanced sales AI that optimizes conversion rates through behavioral analysis and timing',
        category: 'sales',
        price: 349,
        rating: 4.9,
        downloads: 1789,
        revenue: 624261,
        creator: 'Sales Dynamics Corp',
        features: ['Behavioral Analysis', 'Optimal Timing', 'A/B Testing', 'CRM Integration'],
        industries: ['SaaS', 'E-commerce', 'Professional Services', 'Real Estate'],
        version: '2.5.1',
        lastUpdated: '2025-06-27',
        status: 'featured',
        performance: { accuracy: 93, speed: 90, efficiency: 95 }
      },
      {
        id: '6',
        name: 'Marketing Campaign Orchestrator',
        description: 'Multi-channel marketing AI that coordinates campaigns across all digital platforms',
        category: 'marketing',
        price: 379,
        rating: 4.8,
        downloads: 1432,
        revenue: 542168,
        creator: 'Digital Marketing AI',
        features: ['Multi-Channel', 'Campaign Automation', 'Performance Analytics', 'Content Generation'],
        industries: ['E-commerce', 'SaaS', 'Healthcare', 'Finance'],
        version: '3.1.4',
        lastUpdated: '2025-06-26',
        status: 'active',
        performance: { accuracy: 88, speed: 92, efficiency: 91 }
      }
    ];

    const mockCreators: CreatorProfile[] = [
      {
        id: '1',
        name: 'Dr. Sarah Chen',
        avatar: '/api/placeholder/64/64',
        totalRevenue: 1247823,
        totalAgents: 8,
        rating: 4.9,
        verified: true,
        specialties: ['Healthcare AI', 'Medical Compliance', 'HIPAA Solutions']
      },
      {
        id: '2',
        name: 'Marcus Rodriguez',
        avatar: '/api/placeholder/64/64',
        totalRevenue: 987456,
        totalAgents: 5,
        rating: 4.8,
        verified: true,
        specialties: ['Financial AI', 'Risk Analysis', 'Compliance Automation']
      },
      {
        id: '3',
        name: 'Tech Innovations Inc',
        avatar: '/api/placeholder/64/64',
        totalRevenue: 2145697,
        totalAgents: 12,
        rating: 4.7,
        verified: true,
        specialties: ['Manufacturing AI', 'Computer Vision', 'Industrial Automation']
      }
    ];

    setAgents(mockAgents);
    setFeaturedAgents(mockAgents.filter(agent => agent.status === 'featured'));
    setCreators(mockCreators);
  }, []);

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || agent.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedAgents = [...filteredAgents].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.downloads - a.downloads;
      case 'highest-rated':
        return b.rating - a.rating;
      case 'newest':
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      default:
        return b.downloads - a.downloads;
    }
  });

  const handlePurchaseAgent = (agent: AIAgent) => {
    toast({
      title: "Agent Purchased!",
      description: `${agent.name} has been added to your AI arsenal. Deployment starting...`,
    });
  };

  const handleDeployAgent = (agent: AIAgent) => {
    toast({
      title: "Agent Deployed!",
      description: `${agent.name} is now active and processing data autonomously.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center">
            <Store className="w-8 h-8 mr-3" />
            Autonomous Agent Marketplace
          </h1>
          <p className="text-xl text-gray-300">
            Buy, sell, and trade specialized AI agents. Build your autonomous workforce.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 text-center">
              <Bot className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">247</div>
              <div className="text-sm text-gray-400">Available Agents</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">89K</div>
              <div className="text-sm text-gray-400">Total Downloads</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 text-center">
              <DollarSign className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">$12.4M</div>
              <div className="text-sm text-gray-400">Creator Revenue</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">1,247</div>
              <div className="text-sm text-gray-400">Active Creators</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="bg-slate-800 border-slate-700 mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search agents by name, description, or features..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-slate-700 border-slate-600"
                  />
                </div>
              </div>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48 bg-slate-700 border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {agentCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 bg-slate-700 border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="highest-rated">Highest Rated</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="marketplace" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800">
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="creators">Top Creators</TabsTrigger>
            <TabsTrigger value="my-agents">My Agents</TabsTrigger>
          </TabsList>

          {/* Marketplace Tab */}
          <TabsContent value="marketplace">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedAgents.map((agent) => (
                <Card key={agent.id} className="bg-slate-800 border-slate-700 hover:border-purple-500 transition-colors">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Bot className="w-5 h-5 text-purple-400" />
                        <CardTitle className="text-white text-lg">{agent.name}</CardTitle>
                      </div>
                      {agent.status === 'featured' && (
                        <Badge className="bg-yellow-600">Featured</Badge>
                      )}
                      {agent.status === 'new' && (
                        <Badge className="bg-green-600">New</Badge>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-gray-300 text-sm">{agent.description}</p>

                    {/* Performance Metrics */}
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="text-sm font-medium text-white">{agent.performance.accuracy}%</div>
                        <div className="text-xs text-gray-400">Accuracy</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{agent.performance.speed}%</div>
                        <div className="text-xs text-gray-400">Speed</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{agent.performance.efficiency}%</div>
                        <div className="text-xs text-gray-400">Efficiency</div>
                      </div>
                    </div>

                    {/* Features */}
                    <div>
                      <div className="text-sm font-medium text-white mb-2">Key Features:</div>
                      <div className="flex flex-wrap gap-1">
                        {agent.features.slice(0, 3).map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                        {agent.features.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{agent.features.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-white">{agent.rating}</span>
                        <span className="text-gray-400">({agent.downloads} downloads)</span>
                      </div>
                      <div className="text-gray-400">by {agent.creator}</div>
                    </div>

                    {/* Price and Actions */}
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-green-400">${agent.price}</div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handlePurchaseAgent(agent)}
                        >
                          <ShoppingCart className="w-4 h-4 mr-1" />
                          Buy
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-purple-600 hover:bg-purple-700"
                          onClick={() => handleDeployAgent(agent)}
                        >
                          <Zap className="w-4 h-4 mr-1" />
                          Deploy
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Featured Tab */}
          <TabsContent value="featured">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Featured AI Agents</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {featuredAgents.map((agent) => (
                  <Card key={agent.id} className="bg-gradient-to-r from-purple-900 to-blue-900 border-purple-500">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white text-xl">{agent.name}</CardTitle>
                        <Badge className="bg-yellow-600">Featured</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-200 mb-4">{agent.description}</p>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-white">{agent.rating}</div>
                          <div className="text-sm text-gray-300">Rating</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-white">{agent.downloads.toLocaleString()}</div>
                          <div className="text-sm text-gray-300">Downloads</div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-2xl font-bold text-green-400">${agent.price}</div>
                        <Button className="bg-yellow-600 hover:bg-yellow-700">
                          <Award className="w-4 h-4 mr-2" />
                          Get Featured Agent
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Creators Tab */}
          <TabsContent value="creators">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Top AI Agent Creators</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {creators.map((creator) => (
                  <Card key={creator.id} className="bg-slate-800 border-slate-700">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <Users className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <h3 className="text-lg font-bold text-white">{creator.name}</h3>
                        {creator.verified && (
                          <Shield className="w-4 h-4 text-blue-400" />
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="text-lg font-bold text-green-400">
                            ${(creator.totalRevenue / 1000000).toFixed(1)}M
                          </div>
                          <div className="text-xs text-gray-400">Total Revenue</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-purple-400">{creator.totalAgents}</div>
                          <div className="text-xs text-gray-400">Agents</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-center space-x-2 mb-4">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-white">{creator.rating}</span>
                        <span className="text-gray-400">Creator Rating</span>
                      </div>

                      <div className="mb-4">
                        <div className="text-sm text-gray-400 mb-2">Specialties:</div>
                        <div className="flex flex-wrap gap-1 justify-center">
                          {creator.specialties.map((specialty, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Button variant="outline" className="w-full">
                        <Users className="w-4 h-4 mr-2" />
                        View Creator Profile
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* My Agents Tab */}
          <TabsContent value="my-agents">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">My AI Agent Portfolio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No Agents Purchased Yet</h3>
                  <p className="text-gray-400 mb-6">Start building your autonomous AI workforce by purchasing specialized agents</p>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Store className="w-4 h-4 mr-2" />
                    Browse Marketplace
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}