import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Download, Eye, Clock, Cpu, Zap, Shield, TrendingUp } from "lucide-react";
import { ProfessionalBrain, ProfessionalChart, ProfessionalShield } from "@/components/ui/professional-icons";

interface AIModel {
  id: string;
  name: string;
  description: string;
  category: string;
  provider: string;
  version: string;
  rating: number;
  downloads: number;
  performance: {
    accuracy: number;
    latency: number;
    throughput: number;
    memoryUsage: number;
  };
  pricing: {
    tier: "free" | "premium" | "enterprise";
    price?: string;
  };
  tags: string[];
  lastUpdated: string;
  featured: boolean;
}

export default function ModelMarketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");

  const aiModels: AIModel[] = [
    {
      id: "quantum-nlp-v3",
      name: "QuantumNLP-v3",
      description: "Advanced natural language processing with quantum-enhanced embeddings for superior context understanding",
      category: "nlp",
      provider: "Shatzii Labs",
      version: "3.2.1",
      rating: 4.9,
      downloads: 125430,
      performance: {
        accuracy: 94.7,
        latency: 12,
        throughput: 850,
        memoryUsage: 2.1
      },
      pricing: { tier: "premium", price: "$0.02/request" },
      tags: ["transformer", "multilingual", "sentiment", "classification"],
      lastUpdated: "2 days ago",
      featured: true
    },
    {
      id: "neural-vision-pro",
      name: "NeuralVision Pro",
      description: "State-of-the-art computer vision model with real-time object detection and image segmentation",
      category: "vision",
      provider: "Shatzii Labs",
      version: "2.8.4",
      rating: 4.8,
      downloads: 89240,
      performance: {
        accuracy: 96.2,
        latency: 8,
        throughput: 1200,
        memoryUsage: 1.8
      },
      pricing: { tier: "free" },
      tags: ["object-detection", "segmentation", "real-time", "edge-optimized"],
      lastUpdated: "5 days ago",
      featured: true
    },
    {
      id: "predictive-analytics-engine",
      name: "Predictive Analytics Engine",
      description: "Advanced time-series forecasting with anomaly detection for business intelligence",
      category: "analytics",
      provider: "Shatzii Labs",
      version: "1.5.2",
      rating: 4.7,
      downloads: 67890,
      performance: {
        accuracy: 91.5,
        latency: 45,
        throughput: 320,
        memoryUsage: 3.2
      },
      pricing: { tier: "enterprise", price: "Contact Sales" },
      tags: ["forecasting", "anomaly-detection", "time-series", "business-intelligence"],
      lastUpdated: "1 week ago",
      featured: true
    },
    {
      id: "cybersec-guardian",
      name: "CyberSec Guardian",
      description: "AI-powered cybersecurity model for real-time threat detection and response automation",
      category: "security",
      provider: "Shatzii Security",
      version: "4.1.0",
      rating: 4.9,
      downloads: 45670,
      performance: {
        accuracy: 98.1,
        latency: 3,
        throughput: 2500,
        memoryUsage: 1.2
      },
      pricing: { tier: "premium", price: "$0.05/scan" },
      tags: ["threat-detection", "malware", "network-security", "real-time"],
      lastUpdated: "3 days ago",
      featured: false
    },
    {
      id: "speech-synthesis-ultra",
      name: "Speech Synthesis Ultra",
      description: "High-fidelity neural speech synthesis with emotion and accent control",
      category: "audio",
      provider: "Shatzii Audio",
      version: "2.3.1",
      rating: 4.6,
      downloads: 34520,
      performance: {
        accuracy: 89.3,
        latency: 150,
        throughput: 180,
        memoryUsage: 4.5
      },
      pricing: { tier: "free" },
      tags: ["text-to-speech", "neural-synthesis", "multilingual", "emotion-control"],
      lastUpdated: "1 week ago",
      featured: false
    },
    {
      id: "recommendation-ai-plus",
      name: "Recommendation AI Plus",
      description: "Personalized recommendation engine with real-time learning and A/B testing capabilities",
      category: "recommendation",
      provider: "Shatzii Commerce",
      version: "3.0.5",
      rating: 4.5,
      downloads: 78910,
      performance: {
        accuracy: 87.9,
        latency: 25,
        throughput: 600,
        memoryUsage: 2.8
      },
      pricing: { tier: "premium", price: "$0.01/recommendation" },
      tags: ["collaborative-filtering", "content-based", "real-time-learning", "a-b-testing"],
      lastUpdated: "4 days ago",
      featured: false
    }
  ];

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "nlp", label: "Natural Language" },
    { value: "vision", label: "Computer Vision" },
    { value: "analytics", label: "Analytics" },
    { value: "security", label: "Cybersecurity" },
    { value: "audio", label: "Audio Processing" },
    { value: "recommendation", label: "Recommendations" }
  ];

  const filteredModels = aiModels.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         model.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         model.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || model.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedModels = [...filteredModels].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating;
      case "downloads":
        return b.downloads - a.downloads;
      case "updated":
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      default:
        return b.featured ? 1 : -1;
    }
  });

  const getPricingColor = (tier: string) => {
    switch (tier) {
      case "free": return "text-green-400 border-green-400/30";
      case "premium": return "text-cyan-400 border-cyan-400/30";
      case "enterprise": return "text-purple-400 border-purple-400/30";
      default: return "text-slate-400 border-slate-400/30";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "nlp": return <ProfessionalBrain className="w-4 h-4" />;
      case "vision": return <Eye className="w-4 h-4" />;
      case "analytics": return <ProfessionalChart className="w-4 h-4" />;
      case "security": return <ProfessionalShield className="w-4 h-4" />;
      case "audio": return <Zap className="w-4 h-4" />;
      case "recommendation": return <TrendingUp className="w-4 h-4" />;
      default: return <Cpu className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900">
      {/* Header */}
      <section className="py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-slate-800 border border-cyan-500/30 text-cyan-400 px-4 py-2 rounded-full text-sm font-mono uppercase tracking-wide mb-6">
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-lg shadow-cyan-400/50"></span>
              AI Model Marketplace
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-100 leading-tight mb-6">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">Enterprise</span> AI Models
            </h1>
            
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              Deploy production-ready AI models instantly. Browse our curated collection of 
              high-performance neural networks with guaranteed SLAs and enterprise support.
            </p>
            
            {/* Search and Filters */}
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <Input
                    placeholder="Search models, tags, or descriptions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-slate-800/50 border-cyan-500/20 text-slate-100 placeholder-slate-400"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-48 bg-slate-800/50 border-cyan-500/20 text-slate-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-cyan-500/20">
                      {categories.map(category => (
                        <SelectItem key={category.value} value={category.value} className="text-slate-100">
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40 bg-slate-800/50 border-cyan-500/20 text-slate-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-cyan-500/20">
                      <SelectItem value="featured" className="text-slate-100">Featured</SelectItem>
                      <SelectItem value="rating" className="text-slate-100">Rating</SelectItem>
                      <SelectItem value="downloads" className="text-slate-100">Downloads</SelectItem>
                      <SelectItem value="updated" className="text-slate-100">Recently Updated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Models Grid */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedModels.map((model) => (
              <Card key={model.id} className="group relative overflow-hidden bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-400/50 transition-all duration-500">
                {/* Scanning effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                {model.featured && (
                  <div className="absolute top-3 right-3 z-10">
                    <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-900 font-mono text-xs">
                      FEATURED
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="relative z-10">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(model.category)}
                      <CardTitle className="text-lg text-slate-100 group-hover:text-cyan-400 transition-colors">
                        {model.name}
                      </CardTitle>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-slate-400 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span>{model.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      <span>{(model.downloads / 1000).toFixed(1)}k</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{model.lastUpdated}</span>
                    </div>
                  </div>
                  
                  <p className="text-slate-300 text-sm leading-relaxed mb-4">
                    {model.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {model.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs text-slate-400 border-slate-600">
                        {tag}
                      </Badge>
                    ))}
                    {model.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs text-slate-400 border-slate-600">
                        +{model.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="relative z-10 pt-0">
                  {/* Performance Metrics */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-slate-800/50 rounded-lg p-2 border border-cyan-500/20">
                      <div className="text-xs text-slate-400 font-mono">ACCURACY</div>
                      <div className="text-sm text-cyan-400 font-mono">{model.performance.accuracy}%</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-2 border border-cyan-500/20">
                      <div className="text-xs text-slate-400 font-mono">LATENCY</div>
                      <div className="text-sm text-blue-400 font-mono">{model.performance.latency}ms</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`text-xs font-mono uppercase ${getPricingColor(model.pricing.tier)}`}>
                        {model.pricing.tier}
                      </Badge>
                      {model.pricing.price && (
                        <span className="text-xs text-slate-400 font-mono">{model.pricing.price}</span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 font-mono">v{model.version}</div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-slate-900"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Try Demo
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-slate-600 hover:border-cyan-400 text-slate-300 hover:text-cyan-400"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Deploy
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {sortedModels.length === 0 && (
            <div className="text-center py-12">
              <div className="text-slate-400 mb-4">No models found matching your criteria</div>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                variant="outline"
                className="border-slate-600 hover:border-cyan-400 text-slate-300 hover:text-cyan-400"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-12">
            <h2 className="text-4xl font-bold text-slate-100 mb-6">
              Need a <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Custom Model</span>?
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Our AI engineers can build bespoke models tailored to your specific use case 
              with guaranteed performance metrics and enterprise SLAs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-slate-900 px-8 py-4 text-lg font-semibold shadow-lg shadow-cyan-500/25"
              >
                Request Custom Model
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-slate-600 hover:border-cyan-400 text-slate-300 hover:text-cyan-400 px-8 py-4 text-lg bg-slate-800/50 backdrop-blur-sm"
              >
                Enterprise Consultation
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}