import { useState } from "react";
import { Code2, Terminal, GitBranch, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CodeShowcase() {
  const [activeTab, setActiveTab] = useState("architecture");

  const codeExamples = {
    architecture: {
      title: "Microservices Architecture",
      language: "TypeScript",
      code: `// Advanced AI Pipeline with Edge Computing
interface AIProcessor {
  process<T>(data: T): Promise<ProcessingResult<T>>;
  optimize(): void;
}

class OfflineAIEngine implements AIProcessor {
  private model: TensorFlowModel;
  private cache: LRUCache<string, any>;
  
  async process<T>(data: T): Promise<ProcessingResult<T>> {
    const optimized = await this.preprocess(data);
    const result = await this.model.predict(optimized);
    return this.postprocess(result);
  }
  
  private async preprocess(data: any) {
    // Advanced preprocessing with edge optimization
    return this.vectorize(data).normalize().quantize();
  }
}`
    },
    algorithms: {
      title: "AI Optimization Algorithms",
      language: "Python",
      code: `# Advanced Neural Network Optimization
class AdaptiveQuantization:
    def __init__(self, bit_width=8):
        self.bit_width = bit_width
        self.calibration_data = []
    
    def quantize_weights(self, weights):
        """Dynamic quantization with entropy-based scaling"""
        scale = self.compute_optimal_scale(weights)
        quantized = torch.round(weights / scale).clamp(
            -2**(self.bit_width-1), 
            2**(self.bit_width-1)-1
        )
        return quantized * scale
    
    def compute_optimal_scale(self, tensor):
        """Entropy-guided scale computation"""
        return tensor.abs().max() / (2**(self.bit_width-1)-1)`
    },
    pipeline: {
      title: "CI/CD Pipeline",
      language: "YAML",
      code: `# Advanced Kubernetes Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: shatzii-ai-engine
  labels:
    app: ai-engine
    tier: production
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: ai-engine
  template:
    spec:
      containers:
      - name: ai-processor
        image: shatzii/ai-engine:v2.1.0
        resources:
          requests:
            memory: "2Gi"
            cpu: "1000m"
            nvidia.com/gpu: 1`
    }
  };

  const tabs = [
    { id: "architecture", label: "Architecture", icon: Code2 },
    { id: "algorithms", label: "AI Algorithms", icon: Zap },
    { id: "pipeline", label: "DevOps", icon: GitBranch }
  ];

  return (
    <div className="glass-morphism p-6 rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Live Code Architecture</h3>
          <p className="text-gray-600">Real implementation from our production systems</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">Production Code</span>
        </div>
      </div>

      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="relative">
        <div className="absolute top-4 right-4 z-10">
          <div className="flex items-center space-x-2 bg-black/80 text-white px-3 py-1 rounded-full text-xs">
            <Terminal className="w-3 h-3" />
            <span>{codeExamples[activeTab as keyof typeof codeExamples].language}</span>
          </div>
        </div>
        
        <div className="bg-gray-900 rounded-lg p-6 overflow-x-auto">
          <pre className="text-sm text-gray-100 leading-relaxed">
            <code>{codeExamples[activeTab as keyof typeof codeExamples].code}</code>
          </pre>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {codeExamples[activeTab as keyof typeof codeExamples].title}
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            View Repository
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            Download SDK
          </Button>
        </div>
      </div>
    </div>
  );
}