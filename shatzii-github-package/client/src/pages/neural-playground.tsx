import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Play, Pause, RotateCcw, Download, Share, Zap, Brain, Cpu, Database } from "lucide-react";
import { ProfessionalBrain, ProfessionalChart, ProfessionalCpu } from "@/components/ui/professional-icons";

interface NeuralNode {
  id: string;
  x: number;
  y: number;
  activation: number;
  type: "input" | "hidden" | "output";
  connections: string[];
}

interface NetworkParams {
  learningRate: number;
  momentum: number;
  epochs: number;
  batchSize: number;
  dropout: number;
  architecture: number[];
}

export default function NeuralPlayground() {
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [networkParams, setNetworkParams] = useState<NetworkParams>({
    learningRate: 0.01,
    momentum: 0.9,
    epochs: 100,
    batchSize: 32,
    dropout: 0.2,
    architecture: [784, 128, 64, 10]
  });
  
  const [liveMetrics, setLiveMetrics] = useState({
    loss: 0.45,
    accuracy: 0.87,
    learningRate: 0.01,
    gradientNorm: 0.023
  });

  const [codeExample, setCodeExample] = useState(`
# Neural Network Architecture
import torch
import torch.nn as nn

class QuantumNet(nn.Module):
    def __init__(self, input_size=784, hidden_sizes=[128, 64], output_size=10):
        super(QuantumNet, self).__init__()
        self.layers = nn.ModuleList()
        
        # Input layer
        prev_size = input_size
        for hidden_size in hidden_sizes:
            self.layers.append(nn.Linear(prev_size, hidden_size))
            self.layers.append(nn.ReLU())
            self.layers.append(nn.Dropout(0.2))
            prev_size = hidden_size
            
        # Output layer
        self.layers.append(nn.Linear(prev_size, output_size))
        self.layers.append(nn.Softmax(dim=1))
    
    def forward(self, x):
        for layer in self.layers:
            x = layer(x)
        return x

# Quantum-enhanced optimization
model = QuantumNet()
optimizer = torch.optim.AdamW(model.parameters(), lr=0.001)
scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=100)
  `);

  // Simulate training progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTraining) {
      interval = setInterval(() => {
        setTrainingProgress(prev => {
          if (prev >= 100) {
            setIsTraining(false);
            return 100;
          }
          return prev + Math.random() * 5;
        });
        
        // Update live metrics
        setLiveMetrics(prev => ({
          loss: Math.max(0.01, prev.loss - Math.random() * 0.02),
          accuracy: Math.min(0.99, prev.accuracy + Math.random() * 0.01),
          learningRate: prev.learningRate * 0.999,
          gradientNorm: 0.01 + Math.random() * 0.05
        }));
      }, 200);
    }
    return () => clearInterval(interval);
  }, [isTraining]);

  const startTraining = () => {
    setIsTraining(true);
    setTrainingProgress(0);
  };

  const stopTraining = () => {
    setIsTraining(false);
  };

  const resetNetwork = () => {
    setIsTraining(false);
    setTrainingProgress(0);
    setLiveMetrics({
      loss: 0.45,
      accuracy: 0.87,
      learningRate: networkParams.learningRate,
      gradientNorm: 0.023
    });
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
              Neural Architecture Lab
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-100 leading-tight mb-6">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">Quantum</span> Neural Playground
            </h1>
            
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Interactive neural network visualization and training environment. 
              Build, train, and deploy custom AI models in real-time.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="visualizer" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8 bg-slate-800/50 backdrop-blur-xl border border-cyan-500/20 rounded-xl p-1">
              <TabsTrigger value="visualizer" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:border data-[state=active]:border-cyan-400/50 data-[state=active]:text-cyan-400 text-slate-300 hover:text-cyan-300 transition-all duration-300 rounded-lg font-mono text-xs uppercase tracking-wide">
                <ProfessionalBrain className="w-4 h-4 mr-2" />
                Network Visualizer
              </TabsTrigger>
              <TabsTrigger value="training" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:border data-[state=active]:border-cyan-400/50 data-[state=active]:text-cyan-400 text-slate-300 hover:text-cyan-300 transition-all duration-300 rounded-lg font-mono text-xs uppercase tracking-wide">
                <ProfessionalChart className="w-4 h-4 mr-2" />
                Live Training
              </TabsTrigger>
              <TabsTrigger value="code" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:border data-[state=active]:border-cyan-400/50 data-[state=active]:text-cyan-400 text-slate-300 hover:text-cyan-300 transition-all duration-300 rounded-lg font-mono text-xs uppercase tracking-wide">
                <ProfessionalCpu className="w-4 h-4 mr-2" />
                Code Generator
              </TabsTrigger>
              <TabsTrigger value="deploy" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:border data-[state=active]:border-cyan-400/50 data-[state=active]:text-cyan-400 text-slate-300 hover:text-cyan-300 transition-all duration-300 rounded-lg font-mono text-xs uppercase tracking-wide">
                <Database className="w-4 h-4 mr-2" />
                Model Deploy
              </TabsTrigger>
            </TabsList>

            {/* Network Visualizer */}
            <TabsContent value="visualizer" className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Network Canvas */}
                <Card className="lg:col-span-2 bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-cyan-500/20">
                  <CardHeader>
                    <CardTitle className="text-slate-100 flex items-center gap-2">
                      <Brain className="w-5 h-5 text-cyan-400" />
                      Neural Network Architecture
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-96 bg-slate-900/50 rounded-lg border border-cyan-500/20 relative overflow-hidden">
                      {/* Neural network visualization */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="grid grid-cols-4 gap-8 items-center">
                          {/* Input Layer */}
                          <div className="flex flex-col space-y-2">
                            <div className="text-xs text-cyan-400 font-mono mb-2">INPUT</div>
                            {[...Array(4)].map((_, i) => (
                              <div key={i} className="w-4 h-4 bg-cyan-400/60 rounded-full animate-pulse" style={{ animationDelay: `${i * 100}ms` }}></div>
                            ))}
                          </div>
                          
                          {/* Hidden Layer 1 */}
                          <div className="flex flex-col space-y-2">
                            <div className="text-xs text-blue-400 font-mono mb-2">HIDDEN 1</div>
                            {[...Array(3)].map((_, i) => (
                              <div key={i} className="w-4 h-4 bg-blue-400/60 rounded-full animate-pulse" style={{ animationDelay: `${i * 150}ms` }}></div>
                            ))}
                          </div>
                          
                          {/* Hidden Layer 2 */}
                          <div className="flex flex-col space-y-2">
                            <div className="text-xs text-purple-400 font-mono mb-2">HIDDEN 2</div>
                            {[...Array(2)].map((_, i) => (
                              <div key={i} className="w-4 h-4 bg-purple-400/60 rounded-full animate-pulse" style={{ animationDelay: `${i * 200}ms` }}></div>
                            ))}
                          </div>
                          
                          {/* Output Layer */}
                          <div className="flex flex-col space-y-2">
                            <div className="text-xs text-green-400 font-mono mb-2">OUTPUT</div>
                            <div className="w-4 h-4 bg-green-400/60 rounded-full animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Scanning line effect */}
                      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
                    </div>
                  </CardContent>
                </Card>

                {/* Controls */}
                <Card className="bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-cyan-500/20">
                  <CardHeader>
                    <CardTitle className="text-slate-100 flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-cyan-400" />
                      Network Parameters
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-slate-300 font-mono text-xs">Learning Rate</Label>
                      <Slider
                        value={[networkParams.learningRate * 1000]}
                        onValueChange={([value]) => setNetworkParams(prev => ({ ...prev, learningRate: value / 1000 }))}
                        max={100}
                        min={1}
                        step={1}
                        className="mt-2"
                      />
                      <div className="text-xs text-cyan-400 font-mono mt-1">{networkParams.learningRate.toFixed(3)}</div>
                    </div>
                    
                    <div>
                      <Label className="text-slate-300 font-mono text-xs">Momentum</Label>
                      <Slider
                        value={[networkParams.momentum * 100]}
                        onValueChange={([value]) => setNetworkParams(prev => ({ ...prev, momentum: value / 100 }))}
                        max={99}
                        min={50}
                        step={1}
                        className="mt-2"
                      />
                      <div className="text-xs text-cyan-400 font-mono mt-1">{networkParams.momentum.toFixed(2)}</div>
                    </div>
                    
                    <div>
                      <Label className="text-slate-300 font-mono text-xs">Dropout Rate</Label>
                      <Slider
                        value={[networkParams.dropout * 100]}
                        onValueChange={([value]) => setNetworkParams(prev => ({ ...prev, dropout: value / 100 }))}
                        max={50}
                        min={0}
                        step={1}
                        className="mt-2"
                      />
                      <div className="text-xs text-cyan-400 font-mono mt-1">{networkParams.dropout.toFixed(2)}</div>
                    </div>
                    
                    <div className="pt-4 space-y-2">
                      <Button
                        onClick={startTraining}
                        disabled={isTraining}
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-slate-900"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Start Training
                      </Button>
                      
                      <Button
                        onClick={resetNetwork}
                        variant="outline"
                        className="w-full border-slate-600 hover:border-cyan-400 text-slate-300 hover:text-cyan-400"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset Network
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Live Training */}
            <TabsContent value="training" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-cyan-500/20">
                  <CardHeader>
                    <CardTitle className="text-slate-100 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-cyan-400" />
                      Training Progress
                      {isTraining && <Badge variant="outline" className="text-cyan-400 border-cyan-400/30 animate-pulse">ACTIVE</Badge>}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm text-slate-300 mb-2">
                          <span>Epoch Progress</span>
                          <span>{Math.round(trainingProgress)}%</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-cyan-400 to-blue-400 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${trainingProgress}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-800/50 rounded-lg p-3 border border-cyan-500/20">
                          <div className="text-xs text-slate-400 font-mono">LOSS</div>
                          <div className="text-lg text-cyan-400 font-mono">{liveMetrics.loss.toFixed(4)}</div>
                        </div>
                        <div className="bg-slate-800/50 rounded-lg p-3 border border-cyan-500/20">
                          <div className="text-xs text-slate-400 font-mono">ACCURACY</div>
                          <div className="text-lg text-green-400 font-mono">{(liveMetrics.accuracy * 100).toFixed(2)}%</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-cyan-500/20">
                  <CardHeader>
                    <CardTitle className="text-slate-100">Real-time Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-mono text-sm">Learning Rate</span>
                        <span className="text-cyan-400 font-mono text-sm">{liveMetrics.learningRate.toFixed(6)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-mono text-sm">Gradient Norm</span>
                        <span className="text-blue-400 font-mono text-sm">{liveMetrics.gradientNorm.toFixed(6)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-mono text-sm">Batch Size</span>
                        <span className="text-purple-400 font-mono text-sm">{networkParams.batchSize}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Code Generator */}
            <TabsContent value="code" className="space-y-6">
              <Card className="bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="text-slate-100 flex items-center gap-2">
                    <ProfessionalCpu className="w-5 h-5 text-cyan-400" />
                    Generated Neural Network Code
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-900/70 border border-cyan-500/20 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                    <pre className="text-slate-300">
                      <code>{codeExample}</code>
                    </pre>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" className="bg-cyan-500 hover:bg-cyan-600 text-slate-900">
                      <Download className="w-4 h-4 mr-2" />
                      Export Code
                    </Button>
                    <Button size="sm" variant="outline" className="border-slate-600 hover:border-cyan-400 text-slate-300 hover:text-cyan-400">
                      <Share className="w-4 h-4 mr-2" />
                      Share Model
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Model Deploy */}
            <TabsContent value="deploy" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-cyan-500/20">
                  <CardHeader>
                    <CardTitle className="text-slate-100">Deployment Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-slate-300 font-mono text-sm">Model Name</Label>
                      <Input 
                        className="mt-2 bg-slate-800/50 border-cyan-500/20 text-slate-100"
                        placeholder="quantum-classifier-v1"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-slate-300 font-mono text-sm">Deployment Environment</Label>
                      <select className="w-full mt-2 bg-slate-800/50 border border-cyan-500/20 rounded-md px-3 py-2 text-slate-100">
                        <option>Production Cloud</option>
                        <option>Edge Devices</option>
                        <option>Development</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch id="auto-scale" />
                      <Label htmlFor="auto-scale" className="text-slate-300 font-mono text-sm">Auto-scaling</Label>
                    </div>
                    
                    <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-slate-900">
                      Deploy Model
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-cyan-500/20">
                  <CardHeader>
                    <CardTitle className="text-slate-100">Model Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-slate-800/50 rounded-lg p-3 border border-cyan-500/20">
                        <div className="text-sm text-slate-400 mb-2">Inference Speed</div>
                        <div className="text-2xl text-cyan-400 font-mono">2.3ms</div>
                      </div>
                      
                      <div className="bg-slate-800/50 rounded-lg p-3 border border-cyan-500/20">
                        <div className="text-sm text-slate-400 mb-2">Memory Usage</div>
                        <div className="text-2xl text-blue-400 font-mono">128MB</div>
                      </div>
                      
                      <div className="bg-slate-800/50 rounded-lg p-3 border border-cyan-500/20">
                        <div className="text-sm text-slate-400 mb-2">Throughput</div>
                        <div className="text-2xl text-green-400 font-mono">450 req/s</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}