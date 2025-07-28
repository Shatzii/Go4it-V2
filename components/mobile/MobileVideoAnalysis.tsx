'use client';

import { useState, useRef } from 'react';
import { Upload, Camera, Play, Download, Share2, Zap, Target, TrendingUp } from 'lucide-react';

interface MobileAnalysis {
  garScore: number;
  quickInsights: {
    technique: number;
    movement: number;
    timing: number;
    consistency: number;
  };
  keyHighlights: Array<{
    timestamp: string;
    description: string;
    score: number;
  }>;
  quickTips: string[];
  shareableHighlight: {
    clipStart: string;
    clipEnd: string;
    description: string;
  };
  processingTime: number;
}

export function MobileVideoAnalysis() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [sport, setSport] = useState('soccer');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<MobileAnalysis | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [cameraMode, setCameraMode] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setAnalysis(null); // Clear previous analysis
    }
  };

  const startRecording = () => {
    setCameraMode(true);
    navigator.mediaDevices.getUserMedia({ 
      video: { 
        facingMode: 'environment', // Back camera
        width: { ideal: 1920 },
        height: { ideal: 1080 }
      }, 
      audio: false 
    })
    .then(stream => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    })
    .catch(err => {
      console.error('Camera access failed:', err);
      alert('Camera access denied. Please use file upload instead.');
      setCameraMode(false);
    });
  };

  const analyzeVideo = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('video', selectedFile);
      formData.append('sport', sport);
      formData.append('userId', 'demo_user'); // Get from auth context

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch('/api/mobile/video-analysis', {
        method: 'POST',
        body: formData
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setAnalysis(result.analysis);
          
          // Show success notification
          setTimeout(() => {
            alert(`Analysis complete! GAR Score: ${result.garScore}/100`);
          }, 500);
        }
      } else {
        const error = await response.json();
        alert(`Analysis failed: ${error.error}`);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
      setUploadProgress(0);
    }
  };

  const shareHighlight = () => {
    if (!analysis) return;
    
    const shareData = {
      title: `My GAR Score: ${analysis.garScore}/100`,
      text: `Just got my athletic performance analysis! GAR Score: ${analysis.garScore}/100 🚀`,
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      // Fallback for browsers without Web Share API
      navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      alert('Highlight copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg mb-4">
            <Zap className="w-8 h-8 mx-auto mb-2" />
            <h1 className="text-xl font-bold">Instant GAR Analysis</h1>
            <p className="text-blue-100 text-sm">Get your athletic performance score in seconds</p>
          </div>
        </div>

        {/* Sport Selection */}
        <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Sport
          </label>
          <select
            value={sport}
            onChange={(e) => setSport(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="soccer">Soccer</option>
            <option value="basketball">Basketball</option>
            <option value="football">Football</option>
            <option value="tennis">Tennis</option>
            <option value="baseball">Baseball</option>
          </select>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <div className="space-y-3">
            {/* Camera Recording */}
            <button
              onClick={startRecording}
              className="w-full flex items-center justify-center gap-2 p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <Camera className="w-5 h-5" />
              Record Video
            </button>

            {/* File Upload */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Upload className="w-5 h-5" />
              Upload from Gallery
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Camera Preview */}
          {cameraMode && (
            <div className="mt-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full rounded-lg"
                style={{ maxHeight: '300px' }}
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => {
                    setCameraMode(false);
                    if (videoRef.current?.srcObject) {
                      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
                      tracks.forEach(track => track.stop());
                    }
                  }}
                  className="flex-1 p-2 bg-gray-500 text-white rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Record video logic would go here
                    alert('Recording functionality coming soon!');
                  }}
                  className="flex-1 p-2 bg-red-500 text-white rounded-lg"
                >
                  Record
                </button>
              </div>
            </div>
          )}

          {/* Selected File */}
          {selectedFile && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Selected:</strong> {selectedFile.name}
              </p>
              <p className="text-xs text-blue-600">
                Size: {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB
              </p>
            </div>
          )}
        </div>

        {/* Analyze Button */}
        {selectedFile && (
          <button
            onClick={analyzeVideo}
            disabled={isAnalyzing}
            className="w-full flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Analyzing... {uploadProgress}%
              </>
            ) : (
              <>
                <Target className="w-5 h-5" />
                Analyze Performance
              </>
            )}
          </button>
        )}

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-4">
            {/* GAR Score */}
            <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-6 rounded-lg text-center">
              <div className="text-4xl font-bold mb-2">{analysis.garScore}</div>
              <div className="text-green-100">GAR Score / 100</div>
              <div className="text-sm mt-2 text-green-200">
                Processed in {analysis.processingTime}ms
              </div>
            </div>

            {/* Quick Insights */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                Quick Insights
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-2 bg-blue-50 rounded">
                  <div className="font-bold text-blue-600">{analysis.quickInsights.technique}</div>
                  <div className="text-xs text-blue-800">Technique</div>
                </div>
                <div className="text-center p-2 bg-green-50 rounded">
                  <div className="font-bold text-green-600">{analysis.quickInsights.movement}</div>
                  <div className="text-xs text-green-800">Movement</div>
                </div>
                <div className="text-center p-2 bg-yellow-50 rounded">
                  <div className="font-bold text-yellow-600">{analysis.quickInsights.timing}</div>
                  <div className="text-xs text-yellow-800">Timing</div>
                </div>
                <div className="text-center p-2 bg-purple-50 rounded">
                  <div className="font-bold text-purple-600">{analysis.quickInsights.consistency}</div>
                  <div className="text-xs text-purple-800">Consistency</div>
                </div>
              </div>
            </div>

            {/* Key Highlights */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold mb-3">Key Highlights</h3>
              <div className="space-y-2">
                {analysis.keyHighlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-3 p-2 bg-gray-50 rounded">
                    <Play className="w-4 h-4 text-blue-500 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{highlight.timestamp}</div>
                      <div className="text-sm text-gray-600">{highlight.description}</div>
                      <div className="text-xs text-green-600 font-medium">Score: {highlight.score}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold mb-3">Quick Tips</h3>
              <ul className="space-y-2">
                {analysis.quickTips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Share Section */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold mb-3">Share Your Results</h3>
              <div className="space-y-3">
                <button
                  onClick={shareHighlight}
                  className="w-full flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  Share GAR Score
                </button>
                
                <div className="text-center text-sm text-gray-500">
                  Best moment: {analysis.shareableHighlight.clipStart} - {analysis.shareableHighlight.clipEnd}
                  <br />
                  <span className="text-xs">{analysis.shareableHighlight.description}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}