import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Terminal, 
  Code2, 
  Database, 
  Cloud, 
  Shield, 
  Cpu,
  Network,
  GitBranch,
  Server,
  Globe,
  Lock,
  Gauge,
  Eye,
  Brain,
  Zap,
  Rocket,
  Users,
  TrendingUp,
  Settings,
  Monitor,
  HardDrive,
  Wifi,
  Download,
  Upload,
  Activity
} from 'lucide-react';

export default function TechExpert() {
  const [activeDemo, setActiveDemo] = useState('architecture');
  const [systemMetrics, setSystemMetrics] = useState({
    cpu: 67,
    memory: 45,
    network: 89,
    storage: 23,
    requests: 1247,
    latency: 45,
    uptime: 99.97
  });

  const techStack = [
    {
      category: "Frontend",
      technologies: [
        { name: "React 18", version: "18.2.0", status: "latest", usage: 95 },
        { name: "TypeScript", version: "5.0", status: "latest", usage: 100 },
        { name: "Tailwind CSS", version: "3.3", status: "latest", usage: 90 },
        { name: "Vite", version: "4.3", status: "latest", usage: 85 }
      ]
    },
    {
      category: "Backend",
      technologies: [
        { name: "Node.js", version: "20.x", status: "lts", usage: 100 },
        { name: "Express", version: "4.18", status: "stable", usage: 95 },
        { name: "WebSocket", version: "8.13", status: "stable", usage: 80 },
        { name: "JWT", version: "9.0", status: "latest", usage: 90 }
      ]
    },
    {
      category: "AI/ML",
      technologies: [
        { name: "Ollama", version: "0.1.26", status: "latest", usage: 100 },
        { name: "Qdrant", version: "1.7", status: "latest", usage: 95 },
        { name: "PyTorch", version: "2.1", status: "latest", usage: 90 },
        { name: "Transformers", version: "4.36", status: "latest", usage: 85 }
      ]
    },
    {
      category: "Database",
      technologies: [
        { name: "PostgreSQL", version: "15.x", status: "latest", usage: 100 },
        { name: "Redis", version: "7.2", status: "latest", usage: 95 },
        { name: "Drizzle ORM", version: "0.29", status: "latest", usage: 90 },
        { name: "PgVector", version: "0.5", status: "latest", usage: 80 }
      ]
    },
    {
      category: "DevOps",
      technologies: [
        { name: "Docker", version: "24.x", status: "latest", usage: 100 },
        { name: "Kubernetes", version: "1.28", status: "stable", usage: 95 },
        { name: "Nginx", version: "1.24", status: "stable", usage: 90 },
        { name: "PM2", version: "5.3", status: "latest", usage: 85 }
      ]
    }
  ];

  const architectureDiagram = {
    frontend: {
      name: "React Frontend",
      description: "Modern SPA with TypeScript and Tailwind",
      connections: ["api-gateway"],
      metrics: { requests: 2341, responseTime: "120ms" }
    },
    "api-gateway": {
      name: "Express API Gateway", 
      description: "RESTful API with JWT authentication",
      connections: ["ai-engine", "database", "cache"],
      metrics: { requests: 1847, responseTime: "45ms" }
    },
    "ai-engine": {
      name: "AI Engine Cluster",
      description: "Autonomous AI agents for business operations",
      connections: ["vector-db", "model-store"],
      metrics: { inferences: 5234, accuracy: "97.8%" }
    },
    database: {
      name: "PostgreSQL Cluster",
      description: "Primary data storage with replication",
      connections: [],
      metrics: { queries: 8932, avgTime: "3.2ms" }
    },
    cache: {
      name: "Redis Cache",
      description: "In-memory caching and session store",
      connections: [],
      metrics: { hitRate: "94.3%", memory: "2.1GB" }
    },
    "vector-db": {
      name: "Qdrant Vector DB",
      description: "Semantic search and embeddings",
      connections: [],
      metrics: { vectors: "1.2M", similarity: "0.95" }
    },
    "model-store": {
      name: "Model Repository",
      description: "AI model storage and versioning",
      connections: [],
      metrics: { models: 47, storage: "15.6GB" }
    }
  };

  const codeExample = `// AI Engine Integration Example
import { AIEngine } from '@shatzii/ai-core';
import { VectorDB } from '@shatzii/vector-db';
import { ModelManager } from '@shatzii/models';

export class BusinessAIOrchestrator {
  private aiEngine: AIEngine;
  private vectorDB: VectorDB;
  private modelManager: ModelManager;

  constructor() {
    this.aiEngine = new AIEngine({
      endpoint: process.env.AI_ENGINE_URL,
      apiKey: process.env.AI_API_KEY,
      maxConcurrency: 10
    });
    
    this.vectorDB = new VectorDB({
      url: process.env.QDRANT_URL,
      collection: 'business-embeddings'
    });
    
    this.modelManager = new ModelManager({
      repository: process.env.MODEL_STORE_URL
    });
  }

  async processBusinessQuery(query: string): Promise<any> {
    // Generate embeddings for semantic search
    const embedding = await this.aiEngine.embed(query);
    
    // Find similar business contexts
    const context = await this.vectorDB.search(embedding, {
      limit: 5,
      threshold: 0.8
    });
    
    // Select optimal model for business domain
    const model = await this.modelManager.selectModel({
      domain: 'business-intelligence',
      complexity: this.analyzeComplexity(query)
    });
    
    // Process with full context
    return await this.aiEngine.process({
      model: model.id,
      prompt: query,
      context: context.results,
      parameters: {
        temperature: 0.7,
        maxTokens: 2000,
        systemPrompt: 'You are a business AI expert...'
      }
    });
  }

  private analyzeComplexity(query: string): 'simple' | 'medium' | 'complex' {
    const indicators = {
      simple: ['status', 'summary', 'list'],
      medium: ['analyze', 'compare', 'explain'],
      complex: ['strategy', 'forecast', 'optimize']
    };
    
    for (const [level, keywords] of Object.entries(indicators)) {
      if (keywords.some(keyword => query.toLowerCase().includes(keyword))) {
        return level as any;
      }
    }
    
    return 'medium';
  }
}`;

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemMetrics(prev => ({
        cpu: Math.max(30, Math.min(90, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(20, Math.min(80, prev.memory + (Math.random() - 0.5) * 8)),
        network: Math.max(70, Math.min(100, prev.network + (Math.random() - 0.5) * 5)),
        storage: Math.max(15, Math.min(60, prev.storage + (Math.random() - 0.5) * 3)),
        requests: prev.requests + Math.floor(Math.random() * 20),
        latency: Math.max(20, Math.min(100, prev.latency + (Math.random() - 0.5) * 10)),
        uptime: Math.max(99.5, Math.min(100, prev.uptime + (Math.random() - 0.5) * 0.01))
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 px-4 py-2 bg-gray-500/20 text-gray-400 border-gray-500/30">
            <Terminal className="w-4 h-4 mr-2" />
            Technical Deep Dive
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
            Enterprise Architecture
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto">
            Comprehensive technical documentation for enterprise-grade AI platform deployment. 
            Built for scalability, security, and performance.
          </p>
        </div>

        {/* System Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">CPU Usage</CardTitle>
              <Cpu className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">{systemMetrics.cpu.toFixed(1)}%</div>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${systemMetrics.cpu}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Memory</CardTitle>
              <HardDrive className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-400">{systemMetrics.memory.toFixed(1)}%</div>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                <div 
                  className="bg-emerald-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${systemMetrics.memory}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Network</CardTitle>
              <Wifi className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">{systemMetrics.network.toFixed(1)}%</div>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                <div 
                  className="bg-purple-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${systemMetrics.network}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Uptime</CardTitle>
              <Activity className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-400">{systemMetrics.uptime.toFixed(2)}%</div>
              <div className="text-xs text-gray-500">24/7 monitoring</div>
            </CardContent>
          </Card>
        </div>

        {/* Technical Deep Dive */}
        <Tabs value={activeDemo} onValueChange={setActiveDemo} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800/50">
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
            <TabsTrigger value="stack">Tech Stack</TabsTrigger>
            <TabsTrigger value="code">Implementation</TabsTrigger>
            <TabsTrigger value="deployment">Deployment</TabsTrigger>
          </TabsList>

          <TabsContent value="architecture" className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Network className="h-5 w-5 text-blue-400" />
                      System Architecture
                    </CardTitle>
                    <CardDescription>
                      Enterprise-grade microservices architecture with AI-first design
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {Object.entries(architectureDiagram).map(([key, component]) => (
                        <div key={key} className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-white">{component.name}</h3>
                            <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                              Active
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-400 mb-3">{component.description}</p>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            {Object.entries(component.metrics).map(([metric, value]) => (
                              <div key={metric} className="flex justify-between">
                                <span className="text-gray-500 capitalize">{metric}:</span>
                                <span className="text-emerald-400">{value}</span>
                              </div>
                            ))}
                          </div>
                          {component.connections.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-gray-600">
                              <span className="text-xs text-gray-500">Connects to: </span>
                              {component.connections.map((conn, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs mr-1 border-gray-600">
                                  {architectureDiagram[conn as keyof typeof architectureDiagram]?.name || conn}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gauge className="h-5 w-5 text-emerald-400" />
                      Performance Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Requests/sec</span>
                      <span className="text-emerald-400">{systemMetrics.requests}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Avg Latency</span>
                      <span className="text-emerald-400">{systemMetrics.latency}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">AI Accuracy</span>
                      <span className="text-emerald-400">97.8%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Cache Hit Rate</span>
                      <span className="text-emerald-400">94.3%</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-orange-400" />
                      Security Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">SSL/TLS</span>
                      <Badge className="bg-emerald-500/20 text-emerald-400">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">WAF</span>
                      <Badge className="bg-emerald-500/20 text-emerald-400">Protected</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Auth</span>
                      <Badge className="bg-emerald-500/20 text-emerald-400">JWT + OAuth</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Encryption</span>
                      <Badge className="bg-emerald-500/20 text-emerald-400">AES-256</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="stack" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {techStack.map((category) => (
                <Card key={category.category} className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-lg">{category.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {category.technologies.map((tech) => (
                        <div key={tech.name} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-white">{tech.name}</span>
                            <Badge 
                              variant="secondary"
                              className={
                                tech.status === 'latest' ? 'bg-emerald-500/20 text-emerald-400' :
                                tech.status === 'stable' ? 'bg-blue-500/20 text-blue-400' :
                                'bg-orange-500/20 text-orange-400'
                              }
                            >
                              v{tech.version}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Usage</span>
                            <span className="text-gray-300">{tech.usage}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-1">
                            <div 
                              className="bg-blue-400 h-1 rounded-full"
                              style={{ width: `${tech.usage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="code" className="mt-8">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code2 className="h-5 w-5 text-purple-400" />
                  Implementation Example
                </CardTitle>
                <CardDescription>
                  Production-ready TypeScript implementation with full type safety
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900/80 rounded-lg border border-gray-600 overflow-hidden">
                  <div className="flex items-center justify-between p-3 border-b border-gray-600">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <div className="text-xs text-gray-400">business-ai-orchestrator.ts</div>
                  </div>
                  <pre className="p-4 text-sm text-gray-300 overflow-x-auto">
                    <code>{codeExample}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deployment" className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cloud className="h-5 w-5 text-blue-400" />
                    Deployment Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Production Environment</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Server Specs:</span>
                        <span className="text-gray-300">16GB RAM, 4 CPU cores</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Storage:</span>
                        <span className="text-gray-300">100GB SSD</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">OS:</span>
                        <span className="text-gray-300">Ubuntu 20.04+</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-white mb-2">Container Stack</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Docker:</span>
                        <span className="text-gray-300">24.x</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Kubernetes:</span>
                        <span className="text-gray-300">1.28</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Load Balancer:</span>
                        <span className="text-gray-300">Nginx</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-white mb-2">Monitoring</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Metrics:</span>
                        <span className="text-gray-300">Prometheus</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Visualization:</span>
                        <span className="text-gray-300">Grafana</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Alerts:</span>
                        <span className="text-gray-300">PagerDuty</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Rocket className="h-5 w-5 text-emerald-400" />
                    Deployment Commands
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-white mb-2">Quick Start</h4>
                      <div className="bg-gray-900/80 rounded p-3 text-sm font-mono">
                        <div className="text-gray-400"># Clone and setup</div>
                        <div className="text-emerald-400">git clone https://github.com/shatzii/platform.git</div>
                        <div className="text-emerald-400">cd platform</div>
                        <div className="text-emerald-400">npm install</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-white mb-2">Docker Deployment</h4>
                      <div className="bg-gray-900/80 rounded p-3 text-sm font-mono">
                        <div className="text-gray-400"># Build and run</div>
                        <div className="text-emerald-400">docker-compose up -d</div>
                        <div className="text-emerald-400">kubectl apply -f k8s/</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-white mb-2">Environment Setup</h4>
                      <div className="bg-gray-900/80 rounded p-3 text-sm font-mono">
                        <div className="text-gray-400"># Required env vars</div>
                        <div className="text-blue-400">DATABASE_URL=...</div>
                        <div className="text-blue-400">REDIS_URL=...</div>
                        <div className="text-blue-400">AI_API_KEY=...</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Download Section */}
        <Card className="bg-gradient-to-r from-gray-900/50 to-slate-900/50 border-gray-700 mt-12">
          <CardContent className="p-8 text-center">
            <Terminal className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Enterprise Implementation Guide</h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Download our comprehensive technical documentation including architecture diagrams, 
              API specifications, and deployment scripts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Download className="mr-2 h-5 w-5" />
                Download Tech Docs
              </Button>
              <Button variant="outline" size="lg" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                <GitBranch className="mr-2 h-5 w-5" />
                View on GitHub
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}