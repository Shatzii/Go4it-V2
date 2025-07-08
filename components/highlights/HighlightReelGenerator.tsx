'use client';

import { useState } from 'react';
import { 
  Play, 
  Download, 
  Wand2, 
  Clock, 
  Video, 
  CheckCircle, 
  AlertCircle,
  Settings,
  Star
} from 'lucide-react';

interface HighlightSettings {
  duration: number;
  momentTypes: string[];
  musicEnabled: boolean;
  transitionStyle: 'fade' | 'cut' | 'slide';
}

interface HighlightMoment {
  id: string;
  timestamp: number;
  duration: number;
  type: string;
  description: string;
  confidence: number;
}

export function HighlightReelGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedReel, setGeneratedReel] = useState<string | null>(null);
  const [settings, setSettings] = useState<HighlightSettings>({
    duration: 60,
    momentTypes: ['goals', 'saves', 'skills', 'assists'],
    musicEnabled: true,
    transitionStyle: 'fade'
  });
  const [showSettings, setShowSettings] = useState(false);
  const [detectedMoments, setDetectedMoments] = useState<HighlightMoment[]>([]);

  const generateHighlightReel = async () => {
    setIsGenerating(true);
    setProgress(0);
    setDetectedMoments([]);

    try {
      // Simulate AI moment detection
      const progressSteps = [
        { step: 10, status: 'Analyzing video content...' },
        { step: 30, status: 'Detecting key moments...' },
        { step: 50, status: 'Scoring highlights...' },
        { step: 70, status: 'Generating transitions...' },
        { step: 90, status: 'Adding music and effects...' },
        { step: 100, status: 'Finalizing highlight reel...' }
      ];

      for (const progressStep of progressSteps) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setProgress(progressStep.step);
      }

      // Mock detected moments
      const mockMoments: HighlightMoment[] = [
        {
          id: '1',
          timestamp: 45,
          duration: 3,
          type: 'goal',
          description: 'Amazing goal from 25 yards',
          confidence: 0.95
        },
        {
          id: '2',
          timestamp: 122,
          duration: 2,
          type: 'skill',
          description: 'Perfect ball control sequence',
          confidence: 0.88
        },
        {
          id: '3',
          timestamp: 201,
          duration: 4,
          type: 'assist',
          description: 'Brilliant assist setup',
          confidence: 0.92
        },
        {
          id: '4',
          timestamp: 267,
          duration: 2,
          type: 'save',
          description: 'Outstanding defensive play',
          confidence: 0.85
        }
      ];

      setDetectedMoments(mockMoments);
      setGeneratedReel('/api/highlights/generated-reel.mp4');
      
    } catch (error) {
      console.error('Failed to generate highlight reel:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSettingChange = (key: keyof HighlightSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-400';
    if (confidence >= 0.8) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getMomentTypeIcon = (type: string) => {
    switch (type) {
      case 'goal':
        return '⚽';
      case 'save':
        return '🧤';
      case 'skill':
        return '⭐';
      case 'assist':
        return '🎯';
      default:
        return '📽️';
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Wand2 className="h-6 w-6 text-purple-400" />
          <h2 className="text-xl font-bold text-white">AI Highlight Reel Generator</h2>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 text-slate-400 hover:text-white transition-colors"
        >
          <Settings className="h-5 w-5" />
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="mb-6 p-4 bg-slate-700 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Generation Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Duration (seconds)
              </label>
              <input
                type="range"
                min="30"
                max="180"
                value={settings.duration}
                onChange={(e) => handleSettingChange('duration', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-400">
                <span>30s</span>
                <span>{settings.duration}s</span>
                <span>180s</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Transition Style
              </label>
              <select
                value={settings.transitionStyle}
                onChange={(e) => handleSettingChange('transitionStyle', e.target.value)}
                className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white"
              >
                <option value="fade">Fade</option>
                <option value="cut">Cut</option>
                <option value="slide">Slide</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="music"
                checked={settings.musicEnabled}
                onChange={(e) => handleSettingChange('musicEnabled', e.target.checked)}
                className="rounded"
              />
              <label htmlFor="music" className="text-sm text-slate-300">
                Add background music
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Generation Status */}
      {isGenerating && (
        <div className="mb-6 p-4 bg-slate-700 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-white">Generating Highlight Reel</span>
            <span className="text-sm text-slate-400">{progress}%</span>
          </div>
          <div className="w-full bg-slate-600 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Generated Reel */}
      {generatedReel && (
        <div className="mb-6 p-4 bg-slate-700 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Generated Highlight Reel</h3>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-sm text-green-400">Ready</span>
            </div>
          </div>
          
          <div className="aspect-video bg-slate-800 rounded-lg flex items-center justify-center mb-4">
            <div className="text-center">
              <Video className="h-12 w-12 text-slate-400 mx-auto mb-2" />
              <p className="text-slate-400">Video Preview</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
              <Play className="h-4 w-4" />
              <span>Play</span>
            </button>
            <button className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
              <Download className="h-4 w-4" />
              <span>Download</span>
            </button>
          </div>
        </div>
      )}

      {/* Detected Moments */}
      {detectedMoments.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Detected Highlight Moments</h3>
          <div className="space-y-3">
            {detectedMoments.map((moment) => (
              <div key={moment.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{getMomentTypeIcon(moment.type)}</span>
                  <div>
                    <p className="text-sm font-medium text-white">{moment.description}</p>
                    <div className="flex items-center space-x-2 text-xs text-slate-400">
                      <Clock className="h-3 w-3" />
                      <span>{Math.floor(moment.timestamp / 60)}:{(moment.timestamp % 60).toString().padStart(2, '0')}</span>
                      <span>•</span>
                      <span>{moment.duration}s</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs font-medium ${getConfidenceColor(moment.confidence)}`}>
                    {Math.round(moment.confidence * 100)}%
                  </span>
                  <Star className="h-4 w-4 text-yellow-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Generate Button */}
      <button
        onClick={generateHighlightReel}
        disabled={isGenerating}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-purple-800 disabled:to-blue-800 text-white py-3 px-6 rounded-lg font-medium transition-all disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {isGenerating ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            <span>Generating...</span>
          </>
        ) : (
          <>
            <Wand2 className="h-5 w-5" />
            <span>Generate Highlight Reel</span>
          </>
        )}
      </button>
    </div>
  );
}