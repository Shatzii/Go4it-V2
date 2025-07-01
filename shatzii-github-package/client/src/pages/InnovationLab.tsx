import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sparkles, 
  Rocket, 
  Beaker, 
  Zap, 
  Brain,
  Code,
  Globe,
  Eye,
  Mic,
  Image,
  FileText,
  Lightbulb,
  Cpu,
  Network,
  Database,
  Shield,
  Clock,
  Users,
  TrendingUp,
  Settings,
  Download,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

interface Experiment {
  id: string;
  name: string;
  description: string;
  status: 'running' | 'completed' | 'failed' | 'pending';
  progress: number;
  results?: any;
  startTime: Date;
  category: 'ai' | 'ml' | 'automation' | 'optimization';
}

interface AICapability {
  name: string;
  description: string;
  accuracy: number;
  latency: string;
  icon: any;
  color: string;
  examples: string[];
}

export default function InnovationLab() {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedCapability, setSelectedCapability] = useState('');

  const aiCapabilities: AICapability[] = [
    {
      name: "Autonomous Business Intelligence",
      description: "AI that understands your business context and makes strategic decisions",
      accuracy: 97.8,
      latency: "< 100ms",
      icon: Brain,
      color: "text-purple-400",
      examples: [
        "Predict market trends with 97% accuracy",
        "Identify profitable business opportunities",
        "Automate strategic planning processes",
        "Generate comprehensive business reports"
      ]
    },
    {
      name: "Multimodal Content Creation", 
      description: "Generate text, images, audio, and video content simultaneously",
      accuracy: 95.2,
      latency: "< 2s",
      icon: Sparkles,
      color: "text-emerald-400",
      examples: [
        "Create marketing campaigns with visuals and copy",
        "Generate product demos with voice narration",
        "Build interactive presentations automatically",
        "Design brand assets and messaging"
      ]
    },
    {
      name: "Real-time Conversation AI",
      description: "Natural language processing with emotional intelligence",
      accuracy: 98.5,
      latency: "< 50ms",
      icon: Mic,
      color: "text-blue-400",
      examples: [
        "Handle customer support with empathy",
        "Conduct sales discovery calls",
        "Moderate team meetings and discussions",
        "Provide real-time language translation"
      ]
    },
    {
      name: "Visual Intelligence Engine",
      description: "Advanced computer vision for business applications",
      accuracy: 99.1,
      latency: "< 200ms",
      icon: Eye,
      color: "text-orange-400",
      examples: [
        "Analyze document layouts and extract data",
        "Monitor production quality in real-time",
        "Track inventory levels automatically",
        "Identify security threats from cameras"
      ]
    },
    {
      name: "Predictive Automation",
      description: "AI that anticipates needs and takes action proactively",
      accuracy: 94.7,
      latency: "< 1s",
      icon: Zap,
      color: "text-cyan-400",
      examples: [
        "Auto-scale infrastructure before traffic spikes",
        "Reorder inventory before stockouts",
        "Schedule maintenance before failures",
        "Adjust pricing based on demand patterns"
      ]
    },
    {
      name: "Code Generation AI",
      description: "Enterprise-grade software development automation",
      accuracy: 96.3,
      latency: "< 3s",
      icon: Code,
      color: "text-rose-400",
      examples: [
        "Generate full-stack applications from requirements",
        "Write comprehensive test suites automatically",
        "Optimize code performance and security",
        "Create API documentation and SDKs"
      ]
    }
  ];

  const runningExperiments: Experiment[] = [
    {
      id: 'exp-001',
      name: 'Neural Network Optimization',
      description: 'Testing new architecture for 50% faster inference',
      status: 'running',
      progress: 73,
      startTime: new Date(Date.now() - 3600000),
      category: 'ai'
    },
    {
      id: 'exp-002', 
      name: 'Quantum-Inspired Algorithms',
      description: 'Exploring quantum computing principles for AI',
      status: 'running',
      progress: 45,
      startTime: new Date(Date.now() - 7200000),
      category: 'ml'
    },
    {
      id: 'exp-003',
      name: 'Edge AI Deployment',
      description: 'Running AI models on low-power devices',
      status: 'completed',
      progress: 100,
      startTime: new Date(Date.now() - 86400000),
      category: 'optimization',
      results: {
        latencyReduction: '67%',
        powerConsumption: '45% less',
        accuracy: '99.2%'
      }
    }
  ];

  useEffect(() => {
    setExperiments(runningExperiments);
  }, []);

  const startNewExperiment = () => {
    const newExperiment: Experiment = {
      id: 'exp-' + Math.random().toString(36).substr(2, 9),
      name: 'Custom AI Model Training',
      description: 'Training specialized model for your industry',
      status: 'running',
      progress: 0,
      startTime: new Date(),
      category: 'ai'
    };

    setExperiments(prev => [newExperiment, ...prev]);
    setIsRunning(true);

    // Simulate progress
    const interval = setInterval(() => {
      setExperiments(prev => prev.map(exp => 
        exp.id === newExperiment.id 
          ? { ...exp, progress: Math.min(100, exp.progress + Math.random() * 10) }
          : exp
      ));
    }, 1000);

    setTimeout(() => {
      clearInterval(interval);
      setExperiments(prev => prev.map(exp => 
        exp.id === newExperiment.id 
          ? { ...exp, status: 'completed' as const, progress: 100 }
          : exp
      ));
      setIsRunning(false);
    }, 15000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 px-4 py-2 bg-indigo-500/20 text-indigo-400 border-indigo-500/30">
            <Beaker className="w-4 h-4 mr-2" />
            AI Innovation Laboratory
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
            The Future of AI is Built Here
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto">
            Explore cutting-edge AI research and breakthrough technologies. This is where we develop 
            the next generation of artificial intelligence for enterprise applications.
          </p>
        </div>

        {/* AI Capabilities Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {aiCapabilities.map((capability, index) => (
            <Card 
              key={index} 
              className="bg-gray-800/50 border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105 cursor-pointer"
              onClick={() => setSelectedCapability(capability.name)}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <capability.icon className={`h-8 w-8 ${capability.color}`} />
                  <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400">
                    {capability.accuracy}% Accuracy
                  </Badge>
                </div>
                <CardTitle className="text-lg text-white">{capability.name}</CardTitle>
                <CardDescription className="text-gray-300">
                  {capability.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Latency:</span>
                    <span className={capability.color}>{capability.latency}</span>
                  </div>
                  <Progress value={capability.accuracy} className="h-2" />
                  <div className="space-y-1">
                    <p className="text-xs text-gray-400 font-medium">Key Capabilities:</p>
                    {capability.examples.slice(0, 2).map((example, idx) => (
                      <p key={idx} className="text-xs text-gray-500">• {example}</p>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Active Experiments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-orange-400" />
                  Active Experiments
                </CardTitle>
                <Button 
                  onClick={startNewExperiment}
                  disabled={isRunning}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start New Experiment
                </Button>
              </div>
              <CardDescription>
                Real-time AI research and development experiments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {experiments.map((exp) => (
                  <div key={exp.id} className="p-4 rounded-lg bg-gray-700/50 border border-gray-600">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-white">{exp.name}</h3>
                      <Badge 
                        variant="secondary"
                        className={
                          exp.status === 'running' ? 'bg-blue-500/20 text-blue-400' :
                          exp.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                          exp.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                          'bg-gray-500/20 text-gray-400'
                        }
                      >
                        {exp.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">{exp.description}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Progress</span>
                        <span>{exp.progress}%</span>
                      </div>
                      <Progress value={exp.progress} className="h-1" />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Started: {exp.startTime.toLocaleTimeString()}</span>
                        <Badge variant="secondary" className="text-xs">
                          {exp.category}
                        </Badge>
                      </div>
                    </div>
                    {exp.results && (
                      <div className="mt-3 p-2 bg-emerald-500/10 rounded border border-emerald-500/30">
                        <p className="text-xs text-emerald-400 font-medium mb-1">Results:</p>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <span className="text-gray-400">Latency:</span>
                            <div className="text-emerald-400">{exp.results.latencyReduction}</div>
                          </div>
                          <div>
                            <span className="text-gray-400">Power:</span>
                            <div className="text-emerald-400">{exp.results.powerConsumption}</div>
                          </div>
                          <div>
                            <span className="text-gray-400">Accuracy:</span>
                            <div className="text-emerald-400">{exp.results.accuracy}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Research Pipeline */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-400" />
                Research Pipeline
              </CardTitle>
              <CardDescription>
                Breakthrough technologies in development
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-purple-500/30">
                  <h3 className="font-semibold text-purple-400 mb-2">Quantum-Enhanced AI</h3>
                  <p className="text-sm text-gray-300 mb-3">
                    Leveraging quantum computing principles to create AI models with exponential performance gains.
                  </p>
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
                      Q1 2025
                    </Badge>
                    <span className="text-purple-400 text-sm">1000x faster processing</span>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-gradient-to-r from-emerald-900/50 to-cyan-900/50 border border-emerald-500/30">
                  <h3 className="font-semibold text-emerald-400 mb-2">Neuromorphic Computing</h3>
                  <p className="text-sm text-gray-300 mb-3">
                    Brain-inspired computing architecture that learns and adapts like human neurons.
                  </p>
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400">
                      Q2 2025
                    </Badge>
                    <span className="text-emerald-400 text-sm">90% less energy</span>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-gradient-to-r from-orange-900/50 to-red-900/50 border border-orange-500/30">
                  <h3 className="font-semibold text-orange-400 mb-2">Autonomous AI Ecosystem</h3>
                  <p className="text-sm text-gray-300 mb-3">
                    Self-improving AI systems that evolve and optimize without human intervention.
                  </p>
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary" className="bg-orange-500/20 text-orange-400">
                      Q3 2025
                    </Badge>
                    <span className="text-orange-400 text-sm">Fully autonomous</span>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-gradient-to-r from-cyan-900/50 to-blue-900/50 border border-cyan-500/30">
                  <h3 className="font-semibold text-cyan-400 mb-2">Universal AI Interface</h3>
                  <p className="text-sm text-gray-300 mb-3">
                    Single API that provides access to all AI capabilities across any platform or device.
                  </p>
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400">
                      Q4 2025
                    </Badge>
                    <span className="text-cyan-400 text-sm">One AI, All Devices</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Technology Stack */}
        <Card className="bg-gray-800/50 border-gray-700 mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="h-6 w-6 text-blue-400" />
              Innovation Technology Stack
            </CardTitle>
            <CardDescription>
              Cutting-edge tools and frameworks powering our research
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="ai-ml" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-gray-700/50">
                <TabsTrigger value="ai-ml">AI/ML</TabsTrigger>
                <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
                <TabsTrigger value="data">Data</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>
              
              <TabsContent value="ai-ml" className="mt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: "PyTorch 2.0", desc: "Deep learning framework", progress: 95 },
                    { name: "TensorFlow", desc: "ML platform", progress: 90 },
                    { name: "Hugging Face", desc: "Transformer models", progress: 88 },
                    { name: "ONNX Runtime", desc: "Cross-platform inference", progress: 92 },
                    { name: "OpenAI Triton", desc: "GPU programming", progress: 85 },
                    { name: "Ray", desc: "Distributed computing", progress: 87 },
                    { name: "MLflow", desc: "ML lifecycle", progress: 91 },
                    { name: "Weights & Biases", desc: "Experiment tracking", progress: 89 }
                  ].map((tech, index) => (
                    <div key={index} className="p-3 bg-gray-700/50 rounded-lg">
                      <h4 className="font-semibold text-white text-sm">{tech.name}</h4>
                      <p className="text-xs text-gray-400 mb-2">{tech.desc}</p>
                      <Progress value={tech.progress} className="h-1" />
                      <div className="text-xs text-gray-500 mt-1">{tech.progress}% implemented</div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="infrastructure" className="mt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: "Kubernetes", desc: "Container orchestration", progress: 94 },
                    { name: "Docker", desc: "Containerization", progress: 98 },
                    { name: "NVIDIA GPU", desc: "AI acceleration", progress: 96 },
                    { name: "Redis", desc: "In-memory database", progress: 92 },
                    { name: "Apache Kafka", desc: "Event streaming", progress: 89 },
                    { name: "Prometheus", desc: "Monitoring", progress: 90 },
                    { name: "Grafana", desc: "Visualization", progress: 88 },
                    { name: "Terraform", desc: "Infrastructure as code", progress: 86 }
                  ].map((tech, index) => (
                    <div key={index} className="p-3 bg-gray-700/50 rounded-lg">
                      <h4 className="font-semibold text-white text-sm">{tech.name}</h4>
                      <p className="text-xs text-gray-400 mb-2">{tech.desc}</p>
                      <Progress value={tech.progress} className="h-1" />
                      <div className="text-xs text-gray-500 mt-1">{tech.progress}% implemented</div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="data" className="mt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: "Qdrant", desc: "Vector database", progress: 93 },
                    { name: "PostgreSQL", desc: "Relational database", progress: 95 },
                    { name: "Apache Spark", desc: "Big data processing", progress: 87 },
                    { name: "Elasticsearch", desc: "Search engine", progress: 89 },
                    { name: "MinIO", desc: "Object storage", progress: 91 },
                    { name: "Apache Airflow", desc: "Workflow orchestration", progress: 85 },
                    { name: "dbt", desc: "Data transformation", progress: 88 },
                    { name: "Great Expectations", desc: "Data quality", progress: 84 }
                  ].map((tech, index) => (
                    <div key={index} className="p-3 bg-gray-700/50 rounded-lg">
                      <h4 className="font-semibold text-white text-sm">{tech.name}</h4>
                      <p className="text-xs text-gray-400 mb-2">{tech.desc}</p>
                      <Progress value={tech.progress} className="h-1" />
                      <div className="text-xs text-gray-500 mt-1">{tech.progress}% implemented</div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="security" className="mt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: "HashiCorp Vault", desc: "Secrets management", progress: 92 },
                    { name: "OAuth 2.0", desc: "Authentication", progress: 94 },
                    { name: "JWT", desc: "Token-based auth", progress: 96 },
                    { name: "AES-256", desc: "Encryption", progress: 98 },
                    { name: "TLS 1.3", desc: "Transport security", progress: 95 },
                    { name: "RBAC", desc: "Access control", progress: 90 },
                    { name: "WAF", desc: "Web application firewall", progress: 88 },
                    { name: "SIEM", desc: "Security monitoring", progress: 86 }
                  ].map((tech, index) => (
                    <div key={index} className="p-3 bg-gray-700/50 rounded-lg">
                      <h4 className="font-semibold text-white text-sm">{tech.name}</h4>
                      <p className="text-xs text-gray-400 mb-2">{tech.desc}</p>
                      <Progress value={tech.progress} className="h-1" />
                      <div className="text-xs text-gray-500 mt-1">{tech.progress}% implemented</div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border-indigo-500/30">
          <CardContent className="p-8 text-center">
            <Rocket className="h-12 w-12 text-indigo-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Join the AI Revolution</h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Be part of the next breakthrough in artificial intelligence. Get early access to our cutting-edge 
              AI technologies and shape the future of business automation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                <Beaker className="mr-2 h-5 w-5" />
                Join Beta Program
              </Button>
              <Button variant="outline" size="lg" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                <Download className="mr-2 h-5 w-5" />
                Download Research Papers
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}