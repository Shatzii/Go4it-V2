'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Package, FileText, AlertTriangle } from 'lucide-react';

interface BundleStats {
  totalSize: number;
  gzippedSize: number;
  chunks: Array<{
    name: string;
    size: number;
    modules: number;
  }>;
  largestModules: Array<{
    name: string;
    size: number;
    path: string;
  }>;
  recommendations: string[];
}

export function BundleAnalyzer() {
  const [stats, setStats] = useState<BundleStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeBundleSize = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/bundle-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze bundle');
      }
      
      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getSizeColor = (size: number) => {
    if (size > 5 * 1024 * 1024) return 'text-red-600'; // > 5MB
    if (size > 2 * 1024 * 1024) return 'text-yellow-600'; // > 2MB
    return 'text-green-600';
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Bundle Size Analysis
        </CardTitle>
        <CardDescription>
          Analyze your application bundle size and identify optimization opportunities
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-4">
          <Button 
            onClick={analyzeBundleSize}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <Package className="w-4 h-4" />
            {loading ? 'Analyzing...' : 'Analyze Bundle'}
          </Button>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {stats && (
          <div className="space-y-6">
            {/* Overall Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Size</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${getSizeColor(stats.totalSize)}`}>
                    {formatSize(stats.totalSize)}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Gzipped Size</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${getSizeColor(stats.gzippedSize)}`}>
                    {formatSize(stats.gzippedSize)}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Compression Ratio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round((stats.gzippedSize / stats.totalSize) * 100)}%
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chunks Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Chunks Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.chunks.map((chunk, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-gray-600" />
                        <div>
                          <div className="font-medium">{chunk.name}</div>
                          <div className="text-sm text-gray-600">{chunk.modules} modules</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-medium ${getSizeColor(chunk.size)}`}>
                          {formatSize(chunk.size)}
                        </div>
                        <Progress 
                          value={(chunk.size / stats.totalSize) * 100} 
                          className="w-20 h-2 mt-1"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Largest Modules */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Largest Modules</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.largestModules.map((module, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{module.name}</div>
                        <div className="text-sm text-gray-600 truncate">{module.path}</div>
                      </div>
                      <Badge variant={module.size > 1024 * 1024 ? 'destructive' : 'secondary'}>
                        {formatSize(module.size)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            {stats.recommendations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Optimization Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {stats.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                        <AlertTriangle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-blue-800">{rec}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}