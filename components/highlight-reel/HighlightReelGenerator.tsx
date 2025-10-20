'use client';

import React, { useState } from 'react';
import {
  Play,
  Video,
  Zap,
  Clock,
  Star,
  Download,
  Settings,
  ChevronRight,
  Upload,
  Sparkles,
  Target,
  Activity,
  Award,
} from 'lucide-react';

interface HighlightMoment {
  startTime: number;
  endTime: number;
  type: string;
  score: number;
  description: string;
}

interface HighlightReel {
  id: number;
  title: string;
  duration: number;
  highlights: HighlightMoment[];
  status: 'processing' | 'completed' | 'failed';
  downloadUrl?: string;
  createdAt: string;
  processedAt?: string;
}

const HighlightReelGenerator: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(60);
  const [selectedVideoId, setSelectedVideoId] = useState<number | null>(null);
  const [reelTitle, setReelTitle] = useState('');
  const [recentReels, setRecentReels] = useState<HighlightReel[]>([]);
  const [currentStep, setCurrentStep] = useState(1);

  const generateHighlightReel = async () => {
    if (!selectedVideoId) {
      alert('Please select a video first');
      return;
    }

    setIsGenerating(true);
    setCurrentStep(2);

    try {
      const response = await fetch('/api/highlight-reel/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoId: selectedVideoId,
          title: reelTitle || `Highlight Reel - ${new Date().toLocaleDateString()}`,
          duration: selectedDuration,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setCurrentStep(3);
        // Poll for completion
        pollForCompletion(data.highlightReel.id);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error generating highlight reel:', error);
      alert('Failed to generate highlight reel');
      setIsGenerating(false);
      setCurrentStep(1);
    }
  };

  const pollForCompletion = async (reelId: number) => {
    const poll = async () => {
      try {
        const response = await fetch(`/api/highlight-reel/${reelId}`);
        const data = await response.json();

        if (data.success) {
          const reel = data.highlightReel;

          if (reel.status === 'completed') {
            setCurrentStep(4);
            setIsGenerating(false);
            fetchRecentReels();
          } else if (reel.status === 'failed') {
            alert('Highlight reel generation failed');
            setIsGenerating(false);
            setCurrentStep(1);
          } else {
            // Still processing, continue polling
            setTimeout(poll, 2000);
          }
        }
      } catch (error) {
        console.error('Error polling for completion:', error);
        setIsGenerating(false);
        setCurrentStep(1);
      }
    };

    poll();
  };

  const fetchRecentReels = async () => {
    try {
      const response = await fetch('/api/highlight-reel?limit=5');
      const data = await response.json();

      if (data.success) {
        setRecentReels(data.highlightReels);
      }
    } catch (error) {
      console.error('Error fetching recent reels:', error);
    }
  };

  const getHighlightTypeIcon = (type: string) => {
    switch (type) {
      case 'best_shot':
        return <Target className="w-4 h-4 text-green-400" />;
      case 'agility_display':
        return <Zap className="w-4 h-4 text-blue-400" />;
      case 'defensive_play':
        return <Activity className="w-4 h-4 text-red-400" />;
      case 'teamwork':
        return <Award className="w-4 h-4 text-purple-400" />;
      default:
        return <Star className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getHighlightTypeColor = (type: string) => {
    switch (type) {
      case 'best_shot':
        return 'bg-green-500/20 border-green-500 text-green-400';
      case 'agility_display':
        return 'bg-blue-500/20 border-blue-500 text-blue-400';
      case 'defensive_play':
        return 'bg-red-500/20 border-red-500 text-red-400';
      case 'teamwork':
        return 'bg-purple-500/20 border-purple-500 text-purple-400';
      default:
        return 'bg-yellow-500/20 border-yellow-500 text-yellow-400';
    }
  };

  React.useEffect(() => {
    fetchRecentReels();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">One-Click Highlight Reel Generator</h1>
        <p className="text-slate-400">
          Create professional highlight reels from your performance videos with AI-powered analysis
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Generator */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step Progress */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Generation Progress</h2>
              <span className="text-sm text-slate-400">Step {currentStep} of 4</span>
            </div>

            <div className="flex items-center space-x-4">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-600 text-slate-400'
                }`}
              >
                1
              </div>
              <div
                className={`flex-1 h-2 rounded-full ${
                  currentStep >= 2 ? 'bg-blue-600' : 'bg-slate-600'
                }`}
              ></div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-600 text-slate-400'
                }`}
              >
                2
              </div>
              <div
                className={`flex-1 h-2 rounded-full ${
                  currentStep >= 3 ? 'bg-blue-600' : 'bg-slate-600'
                }`}
              ></div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-slate-600 text-slate-400'
                }`}
              >
                3
              </div>
              <div
                className={`flex-1 h-2 rounded-full ${
                  currentStep >= 4 ? 'bg-blue-600' : 'bg-slate-600'
                }`}
              ></div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 4 ? 'bg-green-600 text-white' : 'bg-slate-600 text-slate-400'
                }`}
              >
                4
              </div>
            </div>

            <div className="mt-4 text-sm text-slate-300">
              {currentStep === 1 && 'Configure your highlight reel settings'}
              {currentStep === 2 && 'Analyzing video for key moments...'}
              {currentStep === 3 && 'Generating your highlight reel...'}
              {currentStep === 4 && 'Highlight reel ready for download!'}
            </div>
          </div>

          {/* Configuration Panel */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">Reel Configuration</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Reel Title</label>
                <input
                  type="text"
                  value={reelTitle}
                  onChange={(e) => setReelTitle(e.target.value)}
                  placeholder="Enter highlight reel title"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Duration</label>
                <div className="grid grid-cols-4 gap-2">
                  {[30, 60, 90, 120].map((duration) => (
                    <button
                      key={duration}
                      onClick={() => setSelectedDuration(duration)}
                      className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedDuration === duration
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      {duration}s
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Select Video
                </label>
                <div className="border-2 border-dashed border-slate-600 rounded-lg p-4 text-center">
                  <Video className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-400 mb-2">
                    Select a video from your GAR analysis library
                  </p>
                  <button
                    onClick={() => setSelectedVideoId(1)} // Mock selection
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    Choose Video
                  </button>
                </div>
              </div>

              <button
                onClick={generateHighlightReel}
                disabled={isGenerating || !selectedVideoId}
                className={`w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors ${
                  isGenerating || !selectedVideoId
                    ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                }`}
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Generate Highlight Reel</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Recent Reels & Preview */}
        <div className="space-y-6">
          {/* Recent Reels */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Highlight Reels</h3>

            {recentReels.length === 0 ? (
              <div className="text-center py-8">
                <Video className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-400 text-sm">No highlight reels yet</p>
                <p className="text-slate-500 text-xs">Generate your first one above!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentReels.map((reel) => (
                  <div
                    key={reel.id}
                    className="bg-slate-700 rounded-lg p-4 border border-slate-600"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-white text-sm truncate">{reel.title}</h4>
                      <div
                        className={`px-2 py-1 rounded-full text-xs ${
                          reel.status === 'completed'
                            ? 'bg-green-500/20 text-green-400'
                            : reel.status === 'processing'
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {reel.status}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>{reel.duration}s</span>
                      <span>{reel.highlights.length} highlights</span>
                    </div>

                    {reel.status === 'completed' && (
                      <button className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-xs font-medium flex items-center justify-center space-x-1">
                        <Download className="w-3 h-3" />
                        <span>Download</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Features */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">AI Features</h3>

            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white">Smart Highlight Detection</h4>
                  <p className="text-xs text-slate-400">
                    AI identifies your best moments automatically
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-600/20 rounded-lg flex items-center justify-center">
                  <Star className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white">GAR Score Integration</h4>
                  <p className="text-xs text-slate-400">Highlights based on performance ratings</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-600/20 rounded-lg flex items-center justify-center">
                  <Settings className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white">Customizable Length</h4>
                  <p className="text-xs text-slate-400">Perfect for social media or recruitment</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HighlightReelGenerator;
