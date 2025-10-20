'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Download, CheckCircle, HardDrive, Cpu, Zap } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ModelStatus {
  total: number;
  installed: number;
  totalSizeGB: string;
  installedSizeGB: string;
  models: Array<{
    name: string;
    size: string;
    description: string;
    capabilities: string[];
    sports: string[];
    installed: boolean;
  }>;
}

export default function LocalModelsPage() {
  const [modelsStatus, setModelsStatus] = useState<ModelStatus | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [downloadingAll, setDownloadingAll] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModelsStatus();
  }, []);

  const fetchModelsStatus = async () => {
    try {
      const response = await fetch('/api/models/download');
      if (response.ok) {
        const status = await response.json();
        setModelsStatus(status);
      }
    } catch (error) {
      console.error('Failed to fetch models status:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadModel = async (modelName: string) => {
    setDownloading(modelName);
    try {
      const response = await fetch('/api/models/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modelName }),
      });

      const result = await response.json();
      if (result.success) {
        await fetchModelsStatus(); // Refresh status
        alert(`${modelName} downloaded successfully!`);
      } else {
        alert(`Failed to download ${modelName}: ${result.message}`);
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('Download failed. Please try again.');
    } finally {
      setDownloading(null);
    }
  };

  const downloadAllModels = async () => {
    setDownloadingAll(true);
    try {
      const response = await fetch('/api/models/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ downloadAll: true }),
      });

      const result = await response.json();
      if (result.success) {
        await fetchModelsStatus(); // Refresh status
        alert('All models downloaded successfully!');
      } else {
        alert(`Download failed: ${result.message}`);
      }
    } catch (error) {
      console.error('Download all error:', error);
      alert('Download failed. Please try again.');
    } finally {
      setDownloadingAll(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Local AI Models</h1>
          <p className="text-slate-300">Download and manage AI models for offline video analysis</p>
        </div>

        {/* Status Overview */}
        <Card className="bg-slate-800 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Cpu className="w-5 h-5" />
              Model Installation Status
            </CardTitle>
            <CardDescription>
              Local AI models for enhanced video analysis performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            {modelsStatus && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {modelsStatus.installed}/{modelsStatus.total}
                  </div>
                  <p className="text-sm text-slate-300">Models Installed</p>
                  <Progress
                    value={(modelsStatus.installed / modelsStatus.total) * 100}
                    className="mt-2"
                  />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {modelsStatus.installedSizeGB}GB
                  </div>
                  <p className="text-sm text-slate-300">Downloaded Size</p>
                  <p className="text-xs text-slate-400">of {modelsStatus.totalSizeGB}GB total</p>
                </div>
                <div className="text-center">
                  <Button
                    onClick={downloadAllModels}
                    disabled={downloadingAll || modelsStatus.installed === modelsStatus.total}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {downloadingAll ? 'Downloading...' : 'Download All Models'}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Model Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6 text-center">
              <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Faster Analysis</h3>
              <p className="text-sm text-slate-300">
                Local processing reduces analysis time to 2-4 seconds
              </p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6 text-center">
              <HardDrive className="w-8 h-8 text-green-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Offline Capability</h3>
              <p className="text-sm text-slate-300">
                Works without internet connection for video analysis
              </p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6 text-center">
              <AlertCircle className="w-8 h-8 text-blue-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Privacy First</h3>
              <p className="text-sm text-slate-300">
                Video data stays on your server, never sent to external APIs
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Available Models */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white mb-4">Available Models</h2>

          {modelsStatus?.models.map((model) => (
            <Card key={model.name} className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white flex items-center gap-2">
                      {model.installed ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <Download className="w-5 h-5 text-blue-400" />
                      )}
                      {model.name}
                      <Badge variant={model.installed ? 'default' : 'secondary'}>
                        {model.size}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{model.description}</CardDescription>
                  </div>
                  <Button
                    onClick={() => downloadModel(model.name)}
                    disabled={model.installed || downloading === model.name}
                    variant={model.installed ? 'secondary' : 'default'}
                    className={model.installed ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}
                  >
                    {downloading === model.name
                      ? 'Downloading...'
                      : model.installed
                        ? 'Installed'
                        : 'Download'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-white font-medium mb-2">Capabilities</h4>
                    <div className="flex flex-wrap gap-2">
                      {model.capabilities.map((capability) => (
                        <Badge key={capability} variant="outline" className="text-xs">
                          {capability.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-2">Supported Sports</h4>
                    <div className="flex flex-wrap gap-2">
                      {model.sports.map((sport) => (
                        <Badge key={sport} variant="secondary" className="text-xs">
                          {sport === 'all_sports' ? 'All Sports' : sport}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Installation Instructions */}
        <Card className="bg-slate-800 border-slate-700 mt-8">
          <CardHeader>
            <CardTitle className="text-white">Installation Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="bg-blue-900/20 border-blue-500/50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-blue-200">
                <strong>System Requirements:</strong> At least 4GB free storage space and 8GB RAM
                recommended for optimal performance. Models download automatically and are ready for
                immediate use in video analysis.
              </AlertDescription>
            </Alert>

            <div className="mt-4 space-y-2 text-slate-300">
              <p>
                <strong>Step 1:</strong> Click "Download All Models" to install the complete AI
                analysis suite
              </p>
              <p>
                <strong>Step 2:</strong> Wait for download completion (total: ~4GB)
              </p>
              <p>
                <strong>Step 3:</strong> Use local analysis in video upload for faster, private
                processing
              </p>
              <p>
                <strong>Note:</strong> Local models provide the same GAR scoring accuracy as cloud
                models
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
