'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Download, 
  HardDrive, 
  Cpu, 
  MemoryStick, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Settings,
  Play,
  Pause,
  RefreshCw,
  Info
} from 'lucide-react';

interface LocalModelInfo {
  name: string;
  size: string;
  description: string;
  downloadUrl: string;
  modelFile: string;
  requirements: {
    ram: string;
    storage: string;
    gpu?: string;
  };
  capabilities: string[];
  status?: 'not_installed' | 'downloading' | 'installed' | 'ready';
  downloadProgress?: number;
}

interface SystemRequirements {
  minimumRam: string;
  recommendedRam: string;
  minimumStorage: string;
  recommendedGpu: string;
}

export default function ModelsPage() {
  const [models, setModels] = useState<LocalModelInfo[]>([]);
  const [systemRequirements, setSystemRequirements] = useState<SystemRequirements | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloadingModel, setDownloadingModel] = useState<string | null>(null);
  const [useLocalModels, setUseLocalModels] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchModels();
    checkLocalModelsPreference();
  }, []);

  const fetchModels = async () => {
    try {
      const response = await fetch('/api/models/download');
      if (response.ok) {
        const data = await response.json();
        setModels(data.models || []);
        setSystemRequirements(data.systemRequirements);
        
        // Check status of each model
        await Promise.all(
          data.models.map(async (model: LocalModelInfo) => {
            const status = await checkModelStatus(model.name);
            model.status = status;
          })
        );
        setModels([...data.models]);
      }
    } catch (error) {
      console.error('Failed to fetch models:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkModelStatus = async (modelName: string): Promise<string> => {
    try {
      const response = await fetch('/api/models/download', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modelName })
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.status;
      }
      return 'not_installed';
    } catch (error) {
      return 'not_installed';
    }
  };

  const checkLocalModelsPreference = () => {
    const preference = localStorage.getItem('useLocalModels');
    setUseLocalModels(preference === 'true');
  };

  const downloadModel = async (modelName: string, installationType: 'download' | 'ollama') => {
    setDownloadingModel(modelName);
    
    try {
      const response = await fetch('/api/models/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modelName, installationType })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Update model status
        setModels(prevModels => 
          prevModels.map(model => 
            model.name === modelName 
              ? { ...model, status: data.status, downloadProgress: data.downloadProgress }
              : model
          )
        );

        // Simulate download progress for demonstration
        if (data.status === 'downloading') {
          simulateDownloadProgress(modelName);
        }
      }
    } catch (error) {
      console.error('Failed to download model:', error);
    } finally {
      setDownloadingModel(null);
    }
  };

  const simulateDownloadProgress = (modelName: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Update model status to installed
        setModels(prevModels => 
          prevModels.map(model => 
            model.name === modelName 
              ? { ...model, status: 'installed', downloadProgress: 100 }
              : model
          )
        );
      } else {
        setModels(prevModels => 
          prevModels.map(model => 
            model.name === modelName 
              ? { ...model, downloadProgress: progress }
              : model
          )
        );
      }
    }, 500);
  };

  const toggleLocalModels = () => {
    const newValue = !useLocalModels;
    setUseLocalModels(newValue);
    localStorage.setItem('useLocalModels', newValue.toString());
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready':
        return <CheckCircle className="h-5 w-5 text-primary" />;
      case 'installed':
        return <CheckCircle className="h-5 w-5 text-primary/70" />;
      case 'downloading':
        return <RefreshCw className="h-5 w-5 text-primary animate-spin" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ready':
        return 'Ready to use';
      case 'installed':
        return 'Installed';
      case 'downloading':
        return 'Downloading...';
      default:
        return 'Not installed';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground hero-bg p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-foreground">Loading AI models...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground hero-bg">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-primary hover:text-primary/80 transition-colors"
              >
                ← Back to Dashboard
              </button>
              <h1 className="text-2xl font-bold text-foreground neon-text">AI Models</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleLocalModels}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  useLocalModels 
                    ? 'bg-primary text-primary-foreground neon-border' 
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {useLocalModels ? 'Using Local Models' : 'Using Cloud APIs'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* System Requirements */}
        {systemRequirements && (
          <div className="bg-card border border-border rounded-lg p-6 mb-8 neon-border">
            <div className="flex items-center mb-4">
              <Info className="h-5 w-5 text-primary mr-2" />
              <h2 className="text-xl font-semibold text-foreground">System Requirements</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <MemoryStick className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">RAM: {systemRequirements.minimumRam} minimum</span>
              </div>
              <div className="flex items-center space-x-2">
                <HardDrive className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">Storage: {systemRequirements.minimumStorage} minimum</span>
              </div>
              <div className="flex items-center space-x-2">
                <Cpu className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">GPU: {systemRequirements.recommendedGpu}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Settings className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">Recommended: {systemRequirements.recommendedRam} RAM</span>
              </div>
            </div>
          </div>
        )}

        {/* Models Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {models.map((model) => (
            <div key={model.name} className="bg-card border border-border rounded-lg p-6 neon-border">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{model.name}</h3>
                  <p className="text-sm text-muted-foreground">{model.size}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(model.status || 'not_installed')}
                  <span className="text-sm text-muted-foreground">
                    {getStatusText(model.status || 'not_installed')}
                  </span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4">{model.description}</p>

              {/* Requirements */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">RAM:</span>
                  <span className="text-foreground">{model.requirements.ram}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Storage:</span>
                  <span className="text-foreground">{model.requirements.storage}</span>
                </div>
                {model.requirements.gpu && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">GPU:</span>
                    <span className="text-foreground">{model.requirements.gpu}</span>
                  </div>
                )}
              </div>

              {/* Capabilities */}
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">Capabilities:</p>
                <div className="flex flex-wrap gap-1">
                  {model.capabilities.map((capability) => (
                    <span
                      key={capability}
                      className="px-2 py-1 bg-primary/20 text-primary text-xs rounded"
                    >
                      {capability}
                    </span>
                  ))}
                </div>
              </div>

              {/* Download Progress */}
              {model.status === 'downloading' && model.downloadProgress && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Download Progress</span>
                    <span className="text-foreground">{Math.round(model.downloadProgress)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${model.downloadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-2">
                {model.status === 'not_installed' && (
                  <>
                    <button
                      onClick={() => downloadModel(model.name, 'download')}
                      disabled={downloadingModel === model.name}
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 neon-border"
                    >
                      <Download className="h-4 w-4 mr-2 inline" />
                      Download
                    </button>
                    <button
                      onClick={() => downloadModel(model.name, 'ollama')}
                      disabled={downloadingModel === model.name}
                      className="flex-1 bg-muted hover:bg-muted/80 text-muted-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                    >
                      Via Ollama
                    </button>
                  </>
                )}
                {model.status === 'installed' && (
                  <button
                    className="flex-1 bg-primary/20 text-primary px-4 py-2 rounded-lg text-sm font-medium"
                    disabled
                  >
                    <CheckCircle className="h-4 w-4 mr-2 inline" />
                    Installed
                  </button>
                )}
                {model.status === 'ready' && (
                  <button
                    className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium neon-border"
                    disabled
                  >
                    <Play className="h-4 w-4 mr-2 inline" />
                    Ready
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Usage Instructions */}
        <div className="mt-8 bg-card border border-border rounded-lg p-6 neon-border">
          <h2 className="text-xl font-semibold text-foreground mb-4">Self-Hosted AI Setup</h2>
          <div className="space-y-4 text-sm text-muted-foreground">
            <div>
              <h3 className="font-medium text-foreground mb-2">Option 1: Direct Download</h3>
              <p>Download model files directly to your local machine. Models run using built-in inference engine.</p>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-2">Option 2: Ollama Integration</h3>
              <p>Use Ollama for model management. Install Ollama first, then download models through the Ollama interface.</p>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-2">Performance Tips</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>GPU acceleration significantly improves inference speed</li>
                <li>Close other applications when running large models</li>
                <li>Consider using CPU-only models for basic tasks</li>
                <li>Models automatically optimize for your hardware</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}