'use client';

import { useState, useEffect } from 'react';
import {
  Download,
  Upload,
  Play,
  Pause,
  Settings,
  Shield,
  Key,
  Server,
  Cloud,
  Brain,
  Zap,
  Lock,
  Unlock,
} from 'lucide-react';

interface AIModel {
  id: string;
  name: string;
  type: 'cloud' | 'local' | 'hybrid';
  provider: 'openai' | 'anthropic' | 'ollama' | 'huggingface' | 'custom';
  size: string;
  capabilities: string[];
  requirements: {
    ram: string;
    storage: string;
    gpu?: string;
  };
  isDownloaded: boolean;
  isActive: boolean;
  isEncrypted: boolean;
  license?: {
    id: string;
    type: string;
    expirationDate: Date;
    activations: number;
    maxActivations: number;
  };
  performance: {
    speed: number;
    accuracy: number;
    resourceUsage: number;
  };
  lastUsed?: Date;
}

interface ModelLicense {
  id: string;
  modelId: string;
  type: 'trial' | 'standard' | 'premium' | 'enterprise';
  key: string;
  expirationDate: Date;
  activations: number;
  maxActivations: number;
  isActive: boolean;
  features: string[];
}

export function AdvancedAIModelManager() {
  const [models, setModels] = useState<AIModel[]>([]);
  const [licenses, setLicenses] = useState<ModelLicense[]>([]);
  const [activeTab, setActiveTab] = useState('models');
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showLicenseDialog, setShowLicenseDialog] = useState(false);
  const [licenseKey, setLicenseKey] = useState('');

  useEffect(() => {
    fetchModels();
    fetchLicenses();
  }, []);

  const fetchModels = async () => {
    try {
      const response = await fetch('/api/ai/models');
      if (response.ok) {
        const data = await response.json();
        setModels(data.models);
      }
    } catch (error) {
      console.error('Failed to fetch models:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLicenses = async () => {
    try {
      const response = await fetch('/api/ai/licenses');
      if (response.ok) {
        const data = await response.json();
        setLicenses(data.licenses);
      }
    } catch (error) {
      console.error('Failed to fetch licenses:', error);
    }
  };

  const downloadModel = async (modelId: string) => {
    setIsDownloading(modelId);
    setDownloadProgress(0);

    try {
      const response = await fetch(`/api/ai/models/${modelId}/download`, {
        method: 'POST',
      });

      if (response.ok) {
        // Simulate download progress
        const interval = setInterval(() => {
          setDownloadProgress((prev) => {
            if (prev >= 100) {
              clearInterval(interval);
              setIsDownloading(null);
              fetchModels();
              return 100;
            }
            return prev + Math.random() * 15;
          });
        }, 500);
      }
    } catch (error) {
      console.error('Failed to download model:', error);
      setIsDownloading(null);
    }
  };

  const activateModel = async (modelId: string) => {
    try {
      const response = await fetch(`/api/ai/models/${modelId}/activate`, {
        method: 'POST',
      });

      if (response.ok) {
        await fetchModels();
      }
    } catch (error) {
      console.error('Failed to activate model:', error);
    }
  };

  const validateLicense = async (key: string) => {
    try {
      const response = await fetch('/api/ai/licenses/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key }),
      });

      if (response.ok) {
        const data = await response.json();
        await fetchLicenses();
        await fetchModels();
        setShowLicenseDialog(false);
        setLicenseKey('');
        return data;
      }
    } catch (error) {
      console.error('Failed to validate license:', error);
    }
  };

  const getModelTypeIcon = (type: string) => {
    switch (type) {
      case 'cloud':
        return <Cloud className="w-5 h-5" />;
      case 'local':
        return <Server className="w-5 h-5" />;
      case 'hybrid':
        return <Zap className="w-5 h-5" />;
      default:
        return <Brain className="w-5 h-5" />;
    }
  };

  const getModelTypeColor = (type: string) => {
    switch (type) {
      case 'cloud':
        return 'text-blue-500';
      case 'local':
        return 'text-green-500';
      case 'hybrid':
        return 'text-purple-500';
      default:
        return 'text-gray-500';
    }
  };

  const renderModels = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">AI Models</h2>
        <button
          onClick={() => setShowLicenseDialog(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Add License
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {models.map((model) => (
          <div key={model.id} className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`${getModelTypeColor(model.type)}`}>
                  {getModelTypeIcon(model.type)}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{model.name}</h3>
                  <p className="text-sm text-slate-400">{model.provider}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {model.isEncrypted && <Lock className="w-4 h-4 text-yellow-500" />}
                <div
                  className={`w-3 h-3 rounded-full ${
                    model.isActive ? 'bg-green-500' : 'bg-gray-500'
                  }`}
                ></div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Size:</span>
                <span className="text-white">{model.size}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">RAM:</span>
                <span className="text-white">{model.requirements.ram}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Storage:</span>
                <span className="text-white">{model.requirements.storage}</span>
              </div>
              {model.requirements.gpu && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">GPU:</span>
                  <span className="text-white">{model.requirements.gpu}</span>
                </div>
              )}
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-white mb-2">Capabilities</h4>
              <div className="flex flex-wrap gap-1">
                {model.capabilities.map((capability, index) => (
                  <span key={index} className="px-2 py-1 bg-slate-700 text-xs text-white rounded">
                    {capability}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-white mb-2">Performance</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Speed</span>
                  <div className="flex-1 mx-2 bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${model.performance.speed}%` }}
                    />
                  </div>
                  <span className="text-xs text-white">{model.performance.speed}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Accuracy</span>
                  <div className="flex-1 mx-2 bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${model.performance.accuracy}%` }}
                    />
                  </div>
                  <span className="text-xs text-white">{model.performance.accuracy}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Resource Usage</span>
                  <div className="flex-1 mx-2 bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full"
                      style={{ width: `${model.performance.resourceUsage}%` }}
                    />
                  </div>
                  <span className="text-xs text-white">{model.performance.resourceUsage}%</span>
                </div>
              </div>
            </div>

            {model.license && (
              <div className="mb-4 p-3 bg-slate-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400">License</span>
                  <span className="text-xs text-white">{model.license.type}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Activations</span>
                  <span className="text-xs text-white">
                    {model.license.activations}/{model.license.maxActivations}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Expires</span>
                  <span className="text-xs text-white">
                    {new Date(model.license.expirationDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}

            {isDownloading === model.id && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white">Downloading...</span>
                  <span className="text-sm text-white">{Math.round(downloadProgress)}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${downloadProgress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex gap-2">
              {!model.isDownloaded ? (
                <button
                  onClick={() => downloadModel(model.id)}
                  disabled={isDownloading === model.id}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              ) : (
                <button
                  onClick={() => activateModel(model.id)}
                  className={`flex-1 py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                    model.isActive
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {model.isActive ? (
                    <>
                      <Pause className="w-4 h-4" />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Activate
                    </>
                  )}
                </button>
              )}
              <button
                onClick={() => setSelectedModel(model)}
                className="bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLicenses = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Model Licenses</h2>
        <button
          onClick={() => setShowLicenseDialog(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Add License
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {licenses.map((license) => (
          <div key={license.id} className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Key className="w-6 h-6 text-yellow-500" />
                <div>
                  <h3 className="font-semibold text-white">{license.type.toUpperCase()}</h3>
                  <p className="text-sm text-slate-400">Model ID: {license.modelId}</p>
                </div>
              </div>
              <div
                className={`w-3 h-3 rounded-full ${
                  license.isActive ? 'bg-green-500' : 'bg-gray-500'
                }`}
              ></div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Activations:</span>
                <span className="text-white">
                  {license.activations}/{license.maxActivations}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Expires:</span>
                <span className="text-white">
                  {new Date(license.expirationDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Status:</span>
                <span className={`${license.isActive ? 'text-green-400' : 'text-gray-400'}`}>
                  {license.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-white mb-2">Features</h4>
              <div className="space-y-1">
                {license.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-slate-300">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-700 rounded-lg p-3">
              <p className="text-xs text-slate-400 mb-1">License Key</p>
              <p className="text-xs text-white font-mono break-all">
                {license.key.substring(0, 8)}...{license.key.substring(license.key.length - 8)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold">AI Model Manager</h1>
          <p className="text-slate-400 mt-1">Manage your AI models and licenses</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-slate-900 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-8">
            {[
              { id: 'models', label: 'Models', icon: Brain },
              { id: 'licenses', label: 'Licenses', icon: Key },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 transition-colors ${
                  activeTab === id
                    ? 'border-blue-500 text-blue-500'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'models' && renderModels()}
        {activeTab === 'licenses' && renderLicenses()}
      </div>

      {/* License Dialog */}
      {showLicenseDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-xl w-full max-w-md shadow-2xl border border-slate-700">
            <div className="p-6 border-b border-slate-700">
              <h3 className="text-xl font-bold text-white">Add License Key</h3>
              <p className="text-slate-400 mt-2">Enter your model license key</p>
            </div>
            <div className="p-6">
              <input
                type="text"
                value={licenseKey}
                onChange={(e) => setLicenseKey(e.target.value)}
                placeholder="Enter license key..."
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 font-mono"
              />
            </div>
            <div className="p-6 border-t border-slate-700 flex gap-3">
              <button
                onClick={() => {
                  setShowLicenseDialog(false);
                  setLicenseKey('');
                }}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => validateLicense(licenseKey)}
                disabled={!licenseKey.trim()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Validate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
