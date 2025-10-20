'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Upload,
  Video,
  TrendingUp,
  Target,
  Star,
  CheckCircle,
  Clock,
  Play,
  Award,
  BarChart3,
} from 'lucide-react';

export default function VideoUpload() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Video className="w-10 h-10 text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent mb-4">
            GAR Analysis System
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Upload your game footage for comprehensive AI-powered analysis. Get detailed insights on
            your athletic performance with our advanced GAR scoring system.
          </p>
        </div>

        {/* Upload Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-2">
                <Upload className="w-6 h-6 text-blue-400" />
                Upload Video
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                <Video className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Drop your video here</h3>
                <p className="text-slate-400 mb-4">Or click to browse files</p>
                <Button className="bg-blue-600 hover:bg-blue-700">Select Video File</Button>
                <div className="mt-4 text-sm text-slate-500">
                  Supported formats: MP4, MOV, AVI (Max 500MB)
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center gap-2">
                <Target className="w-6 h-6 text-green-400" />
                Recent GAR Scores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div>
                    <div className="font-semibold text-white">Football - Quarterback</div>
                    <div className="text-sm text-slate-400">Jan 15, 2024</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-400">87</div>
                    <div className="text-xs text-slate-400">GAR Score</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div>
                    <div className="font-semibold text-white">Basketball - Guard</div>
                    <div className="text-sm text-slate-400">Jan 10, 2024</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-400">82</div>
                    <div className="text-xs text-slate-400">GAR Score</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div>
                    <div className="font-semibold text-white">Football - Running</div>
                    <div className="text-sm text-slate-400">Jan 5, 2024</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-yellow-400">78</div>
                    <div className="text-xs text-slate-400">GAR Score</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-slate-800/50 border-slate-700 text-center">
            <CardContent className="pt-6">
              <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Performance Analysis</h3>
              <p className="text-slate-400">
                AI-powered analysis of your athletic performance with detailed scoring
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 text-center">
            <CardContent className="pt-6">
              <Star className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Skill Assessment</h3>
              <p className="text-slate-400">
                Comprehensive evaluation of technical skills and athletic abilities
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 text-center">
            <CardContent className="pt-6">
              <Award className="w-8 h-8 text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Recruitment Ready</h3>
              <p className="text-slate-400">
                Generate professional reports for college recruiters and scouts
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Analysis Process */}
        <Card className="bg-slate-800/50 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-blue-400" />
              How GAR Analysis Works
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">1. Upload Video</h3>
                <p className="text-sm text-slate-400">Upload your game footage or training video</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Play className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">2. AI Processing</h3>
                <p className="text-sm text-slate-400">
                  Advanced AI analyzes your athletic performance
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">3. GAR Scoring</h3>
                <p className="text-sm text-slate-400">Receive detailed GAR score and breakdown</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">4. Get Results</h3>
                <p className="text-sm text-slate-400">
                  Download professional reports for recruiters
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current User Status */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-xl text-white">Your Analysis Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <div>
                  <div className="font-semibold text-white">Pro Tier Active</div>
                  <div className="text-sm text-slate-400">Unlimited video analysis available</div>
                </div>
              </div>
              <Badge className="bg-green-600">Active</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">∞</div>
                <div className="text-sm text-slate-400">Videos Remaining</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">87</div>
                <div className="text-sm text-slate-400">Current GAR Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">15</div>
                <div className="text-sm text-slate-400">Total Analyses</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
