import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Code2, 
  Database, 
  Cloud, 
  Shield, 
  Cpu, 
  Network,
  Layers,
  Zap,
  GitBranch,
  Server,
  Globe,
  Lock,
  Gauge,
  Boxes,
  Brain,
  Eye,
  ArrowRight,
  ExternalLink,
  Github,
  Rocket,
  Terminal,
  Workflow
} from 'lucide-react';

interface TechMetric {
  name: string;
  value: string;
  description: string;
  icon: any;
  color: string;
}

interface Architecture {
  name: string;
  description: string;
  technologies: string[];
  benefits: string[];
  icon: any;
  color: string;
}

export default function TechShowcase() {
  const [selectedArch, setSelectedArch] = useState('microservices');
  const [codeExample, setCodeExample] = useState('');

  const techMetrics: TechMetric[] = [
    {
      name: "Model Accuracy",
      value: "99.7%",
      description: "Average accuracy across all AI models",
      icon: Brain,
      color: "text-blue-400"
    },
    {
      name: "Response Time",
      value: "<50ms",
      description: "Average API response time",
      icon: Zap,
      color: "text-emerald-400"
    },
    {
      name: "Uptime",
      value: "99.99%",
      description: "System availability SLA",
      icon: Shield,
      color: "text-purple-400"
    },
    {
      name: "Scale",
      value: "1M+",
      description: "Requests per hour capacity",
      icon: Gauge,
      color: "text-orange-400"
    }
  ];

  const architectures: Architecture[] = [
    {
      name: "Microservices Architecture",
      description: "Scalable, distributed system design for enterprise AI applications",
      technologies: ["Node.js", "TypeScript", "Docker", "Kubernetes", "Redis", "PostgreSQL"],
      benefits: ["High Availability", "Independent Scaling", "Technology Diversity", "Fault Isolation"],
      icon: Boxes,
      color: "text-blue-400"
    },
    {
      name: "Event-Driven Architecture",
      description: "Real-time processing with asynchronous event handling",
      technologies: ["Apache Kafka", "WebSocket", "Event Sourcing", "CQRS", "Redis Streams"],
      benefits: ["Real-time Processing", "Loose Coupling", "Scalability", "Resilience"],
      icon: Network,
      color: "text-emerald-400"
    },
    {
      name: "AI-First Architecture",
      description: "Purpose-built infrastructure optimized for AI workloads",
      technologies: ["TensorFlow", "PyTorch", "ONNX", "CUDA", "Vector Databases", "MLOps"],
      benefits: ["ML Optimization", "Model Versioning", "A/B Testing", "Auto-scaling"],
      icon: Brain,
      color: "text-purple-400"
    },
    {
      name: "Cloud-Native Architecture",
      description: "Born-in-the-cloud design leveraging modern cloud services",
      technologies: ["Serverless", "CDN", "Auto-scaling", "Load Balancers", "Cloud Storage"],
      benefits: ["Cost Efficiency", "Global Scale", "Auto-healing", "Zero Downtime"],
      icon: Cloud,
      color: "text-orange-400"
    }
  ];

  const codeExamples = {
    microservices: `// AI Agent Microservice Architecture
import { EventEmitter } from 'events';
import { AIAgent } from '@shatzii/ai-core';

interface AIServiceConfig {
  modelEndpoint: string;
  maxConcurrency: number;
  timeout: number;
}

export class AIAgentService extends EventEmitter {
  private agents: Map<string, AIAgent> = new Map();
  private config: AIServiceConfig;

  constructor(config: AIServiceConfig) {
    super();
    this.config = config;
    this.setupHealthChecks();
    this.setupCircuitBreaker();
  }

  async deployAgent(agentConfig: AgentConfig): Promise<string> {
    const agent = new AIAgent(agentConfig);
    await agent.initialize();
    
    const agentId = this.generateId();
    this.agents.set(agentId, agent);
    
    this.emit('agentDeployed', { agentId, config: agentConfig });
    return agentId;
  }

  async processRequest(agentId: string, input: any): Promise<any> {
    const agent = this.agents.get(agentId);
    if (!agent) throw new Error('Agent not found');
    
    const result = await agent.process(input);
    this.emit('requestProcessed', { agentId, input, result });
    
    return result;
  }

  private setupHealthChecks() {
    setInterval(() => {
      this.agents.forEach(async (agent, id) => {
        const health = await agent.healthCheck();
        if (!health.healthy) {
          this.emit('agentUnhealthy', { agentId: id, health });
        }
      });
    }, 30000);
  }
}`,

    events: `// Event-Driven AI Processing Pipeline
import { EventBus } from '@shatzii/event-bus';
import { AIProcessor } from '@shatzii/ai-processor';

interface AIEvent {
  type: string;
  data: any;
  timestamp: Date;
  correlationId: string;
}

export class AIEventProcessor {
  private eventBus: EventBus;
  private processors: Map<string, AIProcessor> = new Map();

  constructor() {
    this.eventBus = new EventBus();
    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    // Lead generation events
    this.eventBus.on('lead.generated', async (event: AIEvent) => {
      await this.processLead(event.data);
      this.eventBus.emit('lead.processed', {
        ...event,
        type: 'lead.processed'
      });
    });

    // Campaign events
    this.eventBus.on('campaign.triggered', async (event: AIEvent) => {
      const result = await this.executeAICampaign(event.data);
      this.eventBus.emit('campaign.executed', {
        ...event,
        data: result,
        type: 'campaign.executed'
      });
    });

    // Real-time analytics
    this.eventBus.on('metrics.updated', (event: AIEvent) => {
      this.broadcastMetrics(event.data);
    });
  }

  async processLead(leadData: any): Promise<void> {
    const processor = this.processors.get('lead-qualification');
    const qualifiedLead = await processor.process(leadData);
    
    if (qualifiedLead.score > 80) {
      this.eventBus.emit('lead.qualified', {
        type: 'lead.qualified',
        data: qualifiedLead,
        timestamp: new Date(),
        correlationId: leadData.id
      });
    }
  }
}`,

    ai: `// AI-First Infrastructure
import { AIModelRegistry } from '@shatzii/ai-registry';
import { VectorDatabase } from '@shatzii/vector-db';
import { ModelOrchestrator } from '@shatzii/orchestrator';

export class AIInfrastructure {
  private registry: AIModelRegistry;
  private vectorDB: VectorDatabase;
  private orchestrator: ModelOrchestrator;

  constructor() {
    this.registry = new AIModelRegistry();
    this.vectorDB = new VectorDatabase();
    this.orchestrator = new ModelOrchestrator();
    this.initializeAIStack();
  }

  private async initializeAIStack() {
    // Register available AI models
    await this.registry.register('shatzii-gpt-4o', {
      type: 'multimodal',
      capabilities: ['text', 'image', 'audio'],
      endpoint: process.env.GPT4O_ENDPOINT,
      authentication: process.env.MODEL_API_KEY
    });

    await this.registry.register('business-ai', {
      type: 'specialized',
      domain: 'business-intelligence',
      endpoint: process.env.BUSINESS_AI_ENDPOINT
    });

    // Initialize vector database for embeddings
    await this.vectorDB.connect({
      host: process.env.VECTOR_DB_HOST,
      index: 'shatzii-embeddings',
      dimensions: 1536
    });

    // Setup model orchestration
    this.orchestrator.configure({
      loadBalancing: 'round-robin',
      fallback: true,
      monitoring: true
    });
  }

  async queryAI(prompt: string, modelType?: string): Promise<any> {
    // Generate embeddings for semantic search
    const embedding = await this.generateEmbedding(prompt);
    const context = await this.vectorDB.similaritySearch(embedding, 5);

    // Select optimal model based on query type
    const model = await this.orchestrator.selectModel(prompt, modelType);
    
    // Process with context and return result
    return await model.process({
      prompt,
      context: context.documents,
      parameters: {
        temperature: 0.7,
        maxTokens: 2000
      }
    });
  }
}`,

    cloud: `// Cloud-Native Deployment
import { CloudProvider } from '@shatzii/cloud';
import { AutoScaler } from '@shatzii/auto-scaler';
import { LoadBalancer } from '@shatzii/load-balancer';

export class CloudNativeDeployment {
  private cloud: CloudProvider;
  private scaler: AutoScaler;
  private loadBalancer: LoadBalancer;

  constructor() {
    this.cloud = new CloudProvider();
    this.scaler = new AutoScaler();
    this.loadBalancer = new LoadBalancer();
    this.setupCloudInfrastructure();
  }

  private async setupCloudInfrastructure() {
    // Deploy AI services across multiple regions
    const regions = ['us-east-1', 'eu-west-1', 'ap-southeast-1'];
    
    for (const region of regions) {
      await this.cloud.deployService({
        name: 'shatzii-ai-engine',
        region,
        replicas: 3,
        resources: {
          cpu: '2',
          memory: '4Gi',
          gpu: '1'
        }
      });
    }

    // Configure auto-scaling based on AI workload metrics
    await this.scaler.configure({
      metrics: ['cpu_usage', 'request_rate', 'model_inference_time'],
      scaleUp: {
        threshold: 70,
        increment: 2
      },
      scaleDown: {
        threshold: 30,
        decrement: 1,
        cooldown: '10m'
      }
    });

    // Setup intelligent load balancing
    await this.loadBalancer.configure({
      algorithm: 'ai-aware',
      healthChecks: true,
      stickySession: false,
      weights: {
        'us-east-1': 40,
        'eu-west-1': 35,
        'ap-southeast-1': 25
      }
    });
  }

  async deployUpdate(version: string): Promise<void> {
    // Blue-green deployment for zero downtime
    const deploymentPlan = await this.cloud.createDeploymentPlan({
      strategy: 'blue-green',
      version,
      healthChecks: true,
      rollbackOnFailure: true
    });

    await this.cloud.execute(deploymentPlan);
  }
}`
  };

  useEffect(() => {
    setCodeExample(codeExamples[selectedArch as keyof typeof codeExamples]);
  }, [selectedArch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 px-4 py-2 bg-blue-500/20 text-blue-400 border-blue-500/30">
            <Terminal className="w-4 h-4 mr-2" />
            Enterprise Technology Stack
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
            Built for Scale & Performance
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto">
            Explore the cutting-edge technology infrastructure powering Shatzii's AI engines. 
            From microservices to machine learning pipelines, see how we engineer for the future.
          </p>
        </div>

        {/* Tech Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {techMetrics.map((metric, index) => (
            <Card key={index} className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <metric.icon className={`h-8 w-8 ${metric.color}`} />
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${metric.color}`}>
                      {metric.value}
                    </div>
                  </div>
                </div>
                <h3 className="font-semibold text-white mb-2">{metric.name}</h3>
                <p className="text-sm text-gray-400">{metric.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Architecture Explorer */}
        <Card className="bg-gray-800/50 border-gray-700 mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-6 w-6 text-purple-400" />
              Architecture Deep Dive
            </CardTitle>
            <CardDescription>
              Explore our enterprise-grade system architectures and implementation details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedArch} onValueChange={setSelectedArch}>
              <TabsList className="grid w-full grid-cols-4 bg-gray-700/50">
                {architectures.map((arch, index) => (
                  <TabsTrigger 
                    key={index} 
                    value={arch.name.toLowerCase().replace(' ', '-').split('-')[0]}
                    className="data-[state=active]:bg-gray-600"
                  >
                    <arch.icon className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">
                      {arch.name.split(' ')[0]}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {architectures.map((arch, index) => (
                <TabsContent 
                  key={index} 
                  value={arch.name.toLowerCase().replace(' ', '-').split('-')[0]}
                  className="mt-6"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Architecture Details */}
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <arch.icon className={`h-8 w-8 ${arch.color}`} />
                        <div>
                          <h3 className="text-xl font-bold text-white">{arch.name}</h3>
                          <p className="text-gray-400">{arch.description}</p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <h4 className="font-semibold text-white mb-3">Technologies</h4>
                          <div className="flex flex-wrap gap-2">
                            {arch.technologies.map((tech, techIndex) => (
                              <Badge
                                key={techIndex}
                                variant="secondary"
                                className="bg-gray-700 text-gray-300"
                              >
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-white mb-3">Key Benefits</h4>
                          <ul className="space-y-2">
                            {arch.benefits.map((benefit, benefitIndex) => (
                              <li key={benefitIndex} className="flex items-center gap-2 text-gray-300">
                                <div className={`w-2 h-2 rounded-full ${arch.color.replace('text-', 'bg-')}`} />
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex gap-3">
                          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                            <Github className="w-4 h-4 mr-2" />
                            View Code
                          </Button>
                          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Live Demo
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Code Example */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-white">Implementation Example</h4>
                        <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400">
                          TypeScript
                        </Badge>
                      </div>
                      <div className="bg-gray-900/80 rounded-lg border border-gray-600 overflow-hidden">
                        <div className="flex items-center justify-between p-3 border-b border-gray-600">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-400" />
                            <div className="w-3 h-3 rounded-full bg-yellow-400" />
                            <div className="w-3 h-3 rounded-full bg-green-400" />
                          </div>
                          <div className="text-xs text-gray-400">{arch.name.toLowerCase().replace(' ', '-')}.ts</div>
                        </div>
                        <pre className="p-4 text-sm text-gray-300 overflow-x-auto">
                          <code>{codeExample}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Development Stack */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code2 className="h-5 w-5 text-blue-400" />
                Development Stack
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Frontend</span>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">React</Badge>
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">TypeScript</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Backend</span>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400">Node.js</Badge>
                    <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400">Express</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Database</span>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">PostgreSQL</Badge>
                    <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">Redis</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">AI/ML</span>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="bg-orange-500/20 text-orange-400">PyTorch</Badge>
                    <Badge variant="secondary" className="bg-orange-500/20 text-orange-400">ONNX</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">DevOps</span>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400">Docker</Badge>
                    <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400">Kubernetes</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-emerald-400" />
                Security & Compliance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Encryption</span>
                  <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400">AES-256</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Authentication</span>
                  <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400">OAuth 2.0</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Compliance</span>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400">SOC 2</Badge>
                    <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400">GDPR</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Monitoring</span>
                  <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400">24/7</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Backup</span>
                  <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400">Real-time</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-500/30">
          <CardContent className="p-8 text-center">
            <Rocket className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Ready to Build with Our Stack?</h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Get access to our enterprise-grade development tools, APIs, and infrastructure. 
              Start building your next AI-powered application today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Code2 className="mr-2 h-5 w-5" />
                Access Developer Portal
              </Button>
              <Button variant="outline" size="lg" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                <Github className="mr-2 h-5 w-5" />
                View on GitHub
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}