'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, FileVideo, AlertCircle, CheckCircle, TrendingUp, Target, Trophy, BarChart3 } from 'lucide-react';

interface UploadProgress {
  progress: number;
  status: 'idle' | 'uploading' | 'analyzing' | 'complete' | 'error';
  message: string;
}

interface GARResults {
  analysisId: number;
  garScore: number;
  analysis: {
    overallScore: number;
    technicalSkills: number;
    athleticism: number;
    gameAwareness: number;
    consistency: number;
    improvement: number;
    breakdown: {
      strengths: string[];
      weaknesses: string[];
      recommendations: string[];
      keyMoments: Array<{
        timestamp: string;
        description: string;
        score: number;
      }>;
    };
    coachingInsights: {
      focus_areas: string[];
      drill_recommendations: string[];
      mental_game: string[];
      physical_development: string[];
    };
    comparison: {
      peer_percentile: number;
      grade_level_ranking: string;
      college_readiness: number;
    };
  };
}

const SPORTS_OPTIONS = [
  'Football', 'Basketball', 'Soccer', 'Baseball', 'Softball',
  'Tennis', 'Track & Field', 'Swimming', 'Volleyball', 'Wrestling',
  'Golf', 'Cross Country', 'Lacrosse', 'Hockey', 'Other'
];

export default function GARUploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedSport, setSelectedSport] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    progress: 0,
    status: 'idle',
    message: ''
  });
  const [results, setResults] = useState<GARResults | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const router = useRouter();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('video/')) {
        setSelectedFile(file);
      } else {
        setUploadProgress({
          progress: 0,
          status: 'error',
          message: 'Please select a valid video file'
        });
      }
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('video/')) {
        setSelectedFile(file);
        setUploadProgress({ progress: 0, status: 'idle', message: '' });
      } else {
        setUploadProgress({
          progress: 0,
          status: 'error',
          message: 'Please select a valid video file'
        });
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedSport) {
      setUploadProgress({
        progress: 0,
        status: 'error',
        message: 'Please select a video file and sport'
      });
      return;
    }

    const formData = new FormData();
    formData.append('video', selectedFile);
    formData.append('sport', selectedSport);

    try {
      setUploadProgress({
        progress: 20,
        status: 'uploading',
        message: 'Uploading video...'
      });

      const response = await fetch('/api/gar/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      setUploadProgress({
        progress: 60,
        status: 'analyzing',
        message: 'AI analyzing performance...'
      });

      const result = await response.json();

      setUploadProgress({
        progress: 100,
        status: 'complete',
        message: 'Analysis complete!'
      });

      setResults(result);

    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadProgress({
        progress: 0,
        status: 'error',
        message: error.message || 'Upload failed. Please try again.'
      });
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setSelectedSport('');
    setUploadProgress({ progress: 0, status: 'idle', message: '' });
    setResults(null);
  };

  if (results) {
    return <GARResultsView results={results} onNewAnalysis={resetUpload} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                ← Back to Dashboard
              </button>
              <h1 className="text-2xl font-bold text-white">GAR Video Analysis</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-slate-900 rounded-lg p-8 border border-slate-800">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Upload Your Performance Video
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Get your Growth and Ability Rating (GAR) with AI-powered analysis. 
              Our system provides detailed feedback on technique, athleticism, and improvement areas.
            </p>
          </div>

          {/* Sport Selection */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-slate-200 mb-3">
              Select Your Sport
            </label>
            <select
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={uploadProgress.status === 'uploading' || uploadProgress.status === 'analyzing'}
            >
              <option value="">Choose a sport...</option>
              {SPORTS_OPTIONS.map((sport) => (
                <option key={sport} value={sport}>
                  {sport}
                </option>
              ))}
            </select>
          </div>

          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
              dragActive
                ? 'border-blue-500 bg-blue-500/10'
                : selectedFile
                ? 'border-green-500 bg-green-500/10'
                : 'border-slate-600 hover:border-slate-500'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {selectedFile ? (
              <div className="space-y-4">
                <FileVideo className="h-16 w-16 text-green-400 mx-auto" />
                <div>
                  <p className="text-lg font-medium text-white">{selectedFile.name}</p>
                  <p className="text-slate-400">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Choose different file
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="h-16 w-16 text-slate-400 mx-auto" />
                <div>
                  <p className="text-lg font-medium text-white mb-2">
                    Drag and drop your video here
                  </p>
                  <p className="text-slate-400 mb-4">
                    or click to browse files
                  </p>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="video-upload"
                    disabled={uploadProgress.status === 'uploading' || uploadProgress.status === 'analyzing'}
                  />
                  <label
                    htmlFor="video-upload"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg cursor-pointer transition-colors"
                  >
                    Choose Video File
                  </label>
                </div>
                <p className="text-sm text-slate-500">
                  Supported formats: MP4, AVI, MOV, WMV (Max 100MB)
                </p>
              </div>
            )}
          </div>

          {/* Upload Progress */}
          {uploadProgress.status !== 'idle' && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-300">{uploadProgress.message}</span>
                <span className="text-sm text-slate-300">{uploadProgress.progress}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    uploadProgress.status === 'error'
                      ? 'bg-red-500'
                      : uploadProgress.status === 'complete'
                      ? 'bg-green-500'
                      : 'bg-blue-500'
                  }`}
                  style={{ width: `${uploadProgress.progress}%` }}
                ></div>
              </div>
              {uploadProgress.status === 'error' && (
                <div className="flex items-center mt-3 text-red-400">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  <span className="text-sm">{uploadProgress.message}</span>
                </div>
              )}
            </div>
          )}

          {/* Upload Button */}
          <div className="mt-8 text-center">
            <button
              onClick={handleUpload}
              disabled={
                !selectedFile || 
                !selectedSport || 
                uploadProgress.status === 'uploading' || 
                uploadProgress.status === 'analyzing'
              }
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              {uploadProgress.status === 'uploading' || uploadProgress.status === 'analyzing'
                ? 'Analyzing...'
                : 'Start GAR Analysis'
              }
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

function GARResultsView({ results, onNewAnalysis }: {
  results: GARResults;
  onNewAnalysis: () => void;
}) {
  const router = useRouter();
  const { analysis } = results;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-white">GAR Analysis Results</h1>
              <div className="flex items-center space-x-2 bg-blue-600 px-3 py-1 rounded-full">
                <Trophy className="h-4 w-4" />
                <span className="font-bold">GAR Score: {analysis.overallScore}/100</span>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onNewAnalysis}
                className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                New Analysis
              </button>
              <button
                onClick={() => router.push('/dashboard')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Results Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Score Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <ScoreCard
            title="Technical Skills"
            score={analysis.technicalSkills}
            icon={<Target className="h-6 w-6" />}
            color="blue"
          />
          <ScoreCard
            title="Athleticism"
            score={analysis.athleticism}
            icon={<TrendingUp className="h-6 w-6" />}
            color="green"
          />
          <ScoreCard
            title="Game Awareness"
            score={analysis.gameAwareness}
            icon={<BarChart3 className="h-6 w-6" />}
            color="purple"
          />
          <ScoreCard
            title="Consistency"
            score={analysis.consistency}
            icon={<CheckCircle className="h-6 w-6" />}
            color="orange"
          />
          <ScoreCard
            title="Improvement"
            score={analysis.improvement}
            icon={<Trophy className="h-6 w-6" />}
            color="yellow"
          />
        </div>

        {/* Detailed Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Strengths & Weaknesses */}
          <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
            <h3 className="text-xl font-semibold mb-4 text-white">Performance Breakdown</h3>
            
            <div className="mb-6">
              <h4 className="text-green-400 font-medium mb-3">Strengths</h4>
              <ul className="space-y-2">
                {analysis.breakdown.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-orange-400 font-medium mb-3">Areas for Improvement</h4>
              <ul className="space-y-2">
                {analysis.breakdown.weaknesses.map((weakness, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <AlertCircle className="h-4 w-4 text-orange-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300">{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Key Moments */}
          <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
            <h3 className="text-xl font-semibold mb-4 text-white">Key Moments</h3>
            <div className="space-y-4">
              {analysis.breakdown.keyMoments.map((moment, index) => (
                <div key={index} className="flex justify-between items-start p-3 bg-slate-800 rounded-lg">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-blue-400 font-mono text-sm">{moment.timestamp}</span>
                      <span className="text-xs text-slate-500">•</span>
                      <span className="text-white font-medium">{moment.score}/100</span>
                    </div>
                    <p className="text-slate-300 text-sm">{moment.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Coaching Insights */}
          <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
            <h3 className="text-xl font-semibold mb-4 text-white">Coaching Insights</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-blue-400 font-medium mb-2">Focus Areas</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-300 text-sm">
                  {analysis.coachingInsights.focus_areas.map((area, index) => (
                    <li key={index}>{area}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-green-400 font-medium mb-2">Recommended Drills</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-300 text-sm">
                  {analysis.coachingInsights.drill_recommendations.map((drill, index) => (
                    <li key={index}>{drill}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Comparison & Development */}
          <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
            <h3 className="text-xl font-semibold mb-4 text-white">Performance Comparison</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-800 rounded">
                <span className="text-slate-300">Peer Percentile</span>
                <span className="text-white font-bold">{analysis.comparison.peer_percentile}th</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-slate-800 rounded">
                <span className="text-slate-300">Grade Level Ranking</span>
                <span className="text-white font-bold">{analysis.comparison.grade_level_ranking}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-slate-800 rounded">
                <span className="text-slate-300">College Readiness</span>
                <span className="text-white font-bold">{analysis.comparison.college_readiness}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-8 bg-slate-900 rounded-lg p-6 border border-slate-800">
          <h3 className="text-xl font-semibold mb-4 text-white">Personalized Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {analysis.breakdown.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-slate-800 rounded-lg">
                <Target className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <span className="text-slate-300">{recommendation}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function ScoreCard({ title, score, icon, color }: {
  title: string;
  score: number;
  icon: React.ReactNode;
  color: string;
}) {
  const colorClasses = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    purple: 'text-purple-400',
    orange: 'text-orange-400',
    yellow: 'text-yellow-400'
  };

  return (
    <div className="bg-slate-900 rounded-lg p-4 border border-slate-800 text-center">
      <div className={`${colorClasses[color]} mb-2 flex justify-center`}>
        {icon}
      </div>
      <div className="text-2xl font-bold text-white mb-1">{score}</div>
      <div className="text-sm text-slate-400">{title}</div>
    </div>
  );
}