'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, BarChart3, Target, TrendingUp, Clock, Medal, Cpu, Zap } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function GARUploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [sport, setSport] = useState<string>('');
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [useLocalModels, setUseLocalModels] = useState(true);

  const sports = [
    'basketball', 'soccer', 'football', 'baseball', 'tennis', 'volleyball',
    'track', 'swimming', 'golf', 'softball', 'lacrosse', 'wrestling'
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleAnalysis = async () => {
    if (!selectedFile || !sport) {
      alert('Please select a video file and sport');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setAnalysisResult(null);

    try {
      const formData = new FormData();
      formData.append('video', selectedFile);
      formData.append('sport', sport);

      // Progress simulation
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      const endpoint = useLocalModels ? '/api/gar/analyze-local' : '/api/gar/analyze';
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData
      });

      clearInterval(progressInterval);
      setAnalysisProgress(100);

      const result = await response.json();

      if (response.ok) {
        setAnalysisResult(result);
      } else {
        if (result.needsModels) {
          alert('Local AI models not installed. Redirecting to model download page...');
          window.location.href = '/local-models';
        } else {
          alert(`Analysis failed: ${result.error}`);
        }
      }
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setSelectedFile(null);
    setSport('');
    setAnalysisProgress(0);
    setAnalysisResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">GAR Score Video Analysis</h1>
          <p className="text-slate-300">Upload your athletic performance video for comprehensive AI analysis</p>
        </div>

        {/* Analysis Method Selection */}
        <Card className="bg-slate-800 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Cpu className="w-5 h-5" />
              Analysis Method
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                className={`p-4 rounded-lg border-2 cursor-pointer ${
                  useLocalModels ? 'border-blue-500 bg-blue-900/20' : 'border-slate-600'
                }`}
                onClick={() => setUseLocalModels(true)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-white font-semibold">Local AI Models</h3>
                  <Badge variant="secondary">Recommended</Badge>
                </div>
                <p className="text-sm text-slate-300">2-4 second analysis, privacy-first, works offline</p>
              </div>
              <div 
                className={`p-4 rounded-lg border-2 cursor-pointer ${
                  !useLocalModels ? 'border-blue-500 bg-blue-900/20' : 'border-slate-600'
                }`}
                onClick={() => setUseLocalModels(false)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-5 h-5 text-green-400" />
                  <h3 className="text-white font-semibold">Cloud AI Analysis</h3>
                  <Badge variant="outline">Backup</Badge>
                </div>
                <p className="text-sm text-slate-300">OpenAI/Anthropic powered, requires internet</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Video Upload
              </CardTitle>
              <CardDescription>
                Upload your athletic performance video for GAR analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Sport Selection */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Sport</label>
                <Select value={sport} onValueChange={setSport}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Select your sport" />
                  </SelectTrigger>
                  <SelectContent>
                    {sports.map((sportOption) => (
                      <SelectItem key={sportOption} value={sportOption}>
                        {sportOption.charAt(0).toUpperCase() + sportOption.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Video File</label>
                <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="video-upload"
                  />
                  <label htmlFor="video-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                    {selectedFile ? (
                      <div>
                        <p className="text-lg font-medium text-green-400 mb-2">{selectedFile.name}</p>
                        <p className="text-sm text-slate-300">{(selectedFile.size / 1024 / 1024).toFixed(1)} MB</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-lg font-medium text-white mb-2">Drop your video here</p>
                        <p className="text-sm text-slate-300 mb-4">or click to browse files</p>
                        <p className="text-xs text-slate-400">Supports MP4, MOV, AVI (max 500MB)</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Analysis Progress */}
              {isAnalyzing && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">Analyzing Video...</span>
                    <span className="text-blue-400">{analysisProgress}%</span>
                  </div>
                  <Progress value={analysisProgress} className="h-2" />
                  <p className="text-sm text-slate-300">
                    {useLocalModels ? 'Processing with local AI models...' : 'Processing with cloud AI...'}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button 
                  onClick={handleAnalysis}
                  disabled={!selectedFile || !sport || isAnalyzing}
                  className="bg-blue-600 hover:bg-blue-700 flex-1"
                >
                  {isAnalyzing ? 'Analyzing...' : 'Start GAR Analysis'}
                </Button>
                {(selectedFile || analysisResult) && (
                  <Button 
                    onClick={resetAnalysis}
                    variant="outline"
                    disabled={isAnalyzing}
                  >
                    Reset
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Analysis Results
              </CardTitle>
              <CardDescription>
                Comprehensive GAR scoring and performance insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analysisResult ? (
                <div className="space-y-6">
                  {/* GAR Score */}
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-400 mb-2">
                      {analysisResult.garScore.toFixed(1)}
                    </div>
                    <p className="text-slate-300">GAR Score out of 100</p>
                    <Badge className="mt-2">
                      {analysisResult.analysisSource === 'local_models' ? 'Local AI Analysis' : 'Cloud AI Analysis'}
                    </Badge>
                  </div>

                  {/* Component Scores */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-xl font-semibold text-green-400">
                        {analysisResult.analysis.technicalSkills.toFixed(0)}
                      </div>
                      <p className="text-sm text-slate-300">Technical</p>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-semibold text-yellow-400">
                        {analysisResult.analysis.athleticism.toFixed(0)}
                      </div>
                      <p className="text-sm text-slate-300">Athletic</p>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-semibold text-purple-400">
                        {analysisResult.analysis.gameAwareness.toFixed(0)}
                      </div>
                      <p className="text-sm text-slate-300">Awareness</p>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-semibold text-orange-400">
                        {analysisResult.analysis.consistency.toFixed(0)}
                      </div>
                      <p className="text-sm text-slate-300">Consistency</p>
                    </div>
                  </div>

                  {/* Strengths */}
                  <div>
                    <h4 className="text-white font-semibold mb-2">Strengths</h4>
                    <div className="space-y-1">
                      {analysisResult.analysis.breakdown.strengths.slice(0, 3).map((strength: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <Medal className="w-4 h-4 text-green-400" />
                          <span className="text-sm text-slate-300">{strength}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Processing Time */}
                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Processing time: {analysisResult.processingTime}ms</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      <span>Analysis ID: #{analysisResult.analysisId}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-slate-400 py-12">
                  <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">No analysis yet</p>
                  <p className="text-sm">Upload a video and select your sport to get started</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Info Card */}
        <Card className="bg-slate-800 border-slate-700 mt-8">
          <CardContent className="p-6">
            <Alert className="bg-blue-900/20 border-blue-500/50">
              <TrendingUp className="h-4 w-4" />
              <AlertDescription className="text-blue-200">
                <strong>Local vs Cloud Analysis:</strong> Local models provide faster analysis (2-4 seconds) and 
                complete privacy since your video never leaves the server. Cloud analysis uses OpenAI/Anthropic 
                for advanced insights. Both provide the same GAR scoring accuracy.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}