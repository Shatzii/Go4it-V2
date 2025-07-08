'use client';

import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Download, 
  Share2, 
  Star, 
  Clock, 
  Activity,
  Target,
  Award,
  Zap,
  Calendar,
  Eye
} from 'lucide-react';

interface HighlightMoment {
  startTime: number;
  endTime: number;
  type: string;
  score: number;
  description: string;
}

interface HighlightReelPreviewProps {
  reelId: number;
  onClose: () => void;
}

const HighlightReelPreview: React.FC<HighlightReelPreviewProps> = ({ reelId, onClose }) => {
  const [reel, setReel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentHighlight, setCurrentHighlight] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    fetchReelData();
  }, [reelId]);

  const fetchReelData = async () => {
    try {
      const response = await fetch(`/api/highlight-reel/${reelId}`);
      const data = await response.json();
      
      if (data.success) {
        setReel(data.highlightReel);
      }
    } catch (error) {
      console.error('Error fetching reel data:', error);
    } finally {
      setLoading(false);
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDownload = async () => {
    if (reel?.downloadUrl) {
      // In a real implementation, this would trigger the download
      window.open(reel.downloadUrl, '_blank');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: reel.title,
          text: `Check out my highlight reel: ${reel.title}`,
          url: window.location.href
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto"></div>
          <p className="text-white mt-4 text-center">Loading highlight reel...</p>
        </div>
      </div>
    );
  }

  if (!reel) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 text-center">
          <p className="text-white">Highlight reel not found</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl border border-slate-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">{reel.title}</h2>
              <div className="flex items-center space-x-4 mt-2 text-sm text-slate-400">
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {reel.duration}s
                </span>
                <span className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  {reel.highlights.length} highlights
                </span>
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(reel.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleShare}
                className="p-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600"
              >
                ×
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Player Placeholder */}
          <div className="lg:col-span-2">
            <div className="bg-slate-900 rounded-xl aspect-video flex items-center justify-center border border-slate-700">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">Highlight Reel Preview</h3>
                <p className="text-slate-400 text-sm">
                  Video player would display the generated highlight reel here
                </p>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {isPlaying ? 'Pause' : 'Play'} Highlight Reel
                </button>
              </div>
            </div>
          </div>

          {/* Highlights List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Key Highlights</h3>
            
            <div className="space-y-3">
              {reel.highlights.map((highlight: HighlightMoment, index: number) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    currentHighlight === index
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-slate-600 bg-slate-700 hover:bg-slate-600'
                  }`}
                  onClick={() => setCurrentHighlight(index)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg border ${getHighlightTypeColor(highlight.type)}`}>
                      {getHighlightTypeIcon(highlight.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-white">
                          {formatTime(highlight.startTime)} - {formatTime(highlight.endTime)}
                        </span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-400" />
                          <span className="text-xs text-yellow-400">{highlight.score}</span>
                        </div>
                      </div>
                      
                      <p className="text-xs text-slate-400 leading-tight">
                        {highlight.description}
                      </p>
                      
                      <div className="mt-2">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          getHighlightTypeColor(highlight.type)
                        }`}>
                          {highlight.type.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Footer */}
        <div className="p-6 border-t border-slate-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {Math.round(reel.highlights.reduce((sum: number, h: HighlightMoment) => sum + h.score, 0) / reel.highlights.length)}
              </div>
              <div className="text-sm text-slate-400">Avg Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {reel.highlights.reduce((sum: number, h: HighlightMoment) => sum + (h.endTime - h.startTime), 0)}s
              </div>
              <div className="text-sm text-slate-400">Total Highlights</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {Math.max(...reel.highlights.map((h: HighlightMoment) => h.score))}
              </div>
              <div className="text-sm text-slate-400">Best Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">
                {reel.videoSport}
              </div>
              <div className="text-sm text-slate-400">Sport</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HighlightReelPreview;