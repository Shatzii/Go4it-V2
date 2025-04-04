import { Button } from "@/components/ui/button";
import { VideoPlayer } from "@/components/ui/video-player";
import { Video, VideoAnalysis } from "@shared/schema";
import { Info } from "lucide-react";
import { useState } from "react";

interface VideoAnalysisCardProps {
  video: Video;
  analysis?: VideoAnalysis;
}

export function VideoAnalysisCard({ video, analysis }: VideoAnalysisCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  // Get motion markers from analysis if available
  const getMotionMarkers = () => {
    if (!analysis?.motionData?.keyFrameTimestamps) {
      return [];
    }
    // Return timestamps as markers for now
    return analysis.keyFrameTimestamps.map(timestamp => ({
      x: timestamp / video.duration,
      y: 0.5,
      name: `Key frame ${timestamp}s`
    }));
  };

  const handleViewDetails = () => {
    window.location.href = `/video-analysis/${video.id}`;
  };

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
        
        {analysis && (
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
        
        <Button
          className="w-full mt-4"
          variant="secondary"
          onClick={handleViewDetails}
        >
          <Info className="h-5 w-5 mr-2" />
          View Detailed Analysis
        </Button>
      </div>
    </div>
  );
}
