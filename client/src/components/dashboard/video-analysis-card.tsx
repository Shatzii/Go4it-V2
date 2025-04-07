import { Button } from "@/components/ui/button";
import { VideoPlayer } from "@/components/ui/video-player";
import { Video, VideoAnalysis } from "@shared/schema";
import { Info, Scissors } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

interface VideoAnalysisCardProps {
  video: Video;
  analysis?: VideoAnalysis;
}

export function VideoAnalysisCard({ video, analysis }: VideoAnalysisCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  // Get motion markers from analysis if available
  const getMotionMarkers = () => {
    if (!analysis?.keyFrameTimestamps) {
      return [];
    }
    // Return timestamps as markers for now
    return analysis.keyFrameTimestamps.map(timestamp => ({
      x: timestamp / (video.duration || 1),
      y: 0.5,
      name: `Key frame ${timestamp}s`
    }));
  };

  if (!analysis && video.analyzed) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-600">Analysis is being processed...</p>
      </div>
    );
  }

  // Use Link component from wouter instead of direct window manipulation
  // This maintains SPA behavior

  return (
    <div className="bg-neutral-light bg-opacity-30 rounded-lg overflow-hidden">
      <div className="relative">
        <VideoPlayer
          src={video.filePath}
          thumbnail={video.thumbnailPath}
          keyFrameTimestamps={analysis?.keyFrameTimestamps}
          motionMarkers={getMotionMarkers()}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      </div>
      <div className="p-4">
        <h3 className="font-medium text-neutral">{video.title}</h3>
        <p className="text-sm text-gray-600 mt-1">
          Analyzed on {analysis
            ? new Date(analysis.analysisDate).toLocaleDateString()
            : new Date(video.uploadDate).toLocaleDateString()}
        </p>
        
        {analysis?.motionData && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            {/* Display metrics from the analysis */}
            {Object.entries(analysis.motionData)
              .filter(([key]) => typeof analysis.motionData[key] === 'number' && key !== 'overallScore')
              .slice(0, 4) // Take top 4 metrics
              .map(([key, value]) => (
                <div key={key} className="bg-white p-3 rounded-lg">
                  <p className="text-xs text-gray-500">
                    {key.replace(/([A-Z])/g, ' $1')
                      .trim()
                      .split(' ')
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ')}
                  </p>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className={`h-2 rounded-full ${
                          value >= 80 ? 'bg-accent' : 
                          value >= 60 ? 'bg-primary' :
                          'bg-secondary'
                        }`} 
                        style={{ width: `${value}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium">{value}%</span>
                  </div>
                </div>
              ))}
          </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
          <Link href={`/video-analysis-detail/${video.id}`}>
            <Button
              variant="secondary"
              className="w-full"
            >
              <Info className="h-4 w-4 mr-2" />
              View Analysis
            </Button>
          </Link>
          
          <Link href={`/highlight-generator/${video.id}`}>
            <Button
              variant="outline"
              className="w-full"
            >
              <Scissors className="h-4 w-4 mr-2" />
              Create Highlights
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
