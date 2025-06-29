import { useRef, useState, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface VideoPlayerProps {
  src: string;
  thumbnail?: string;
  keyFrameTimestamps?: number[];
  motionMarkers?: {
    x: number;
    y: number;
    name?: string;
  }[];
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
}

export function VideoPlayer({
  src,
  thumbnail,
  keyFrameTimestamps = [],
  motionMarkers = [],
  onPlay,
  onPause,
  onEnded,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(true);

  // Initialize video when component mounts
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleEnded = () => {
      setPlaying(false);
      if (onEnded) onEnded();
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
    };
  }, [onEnded]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (playing) {
      video.pause();
      setPlaying(false);
      if (onPause) onPause();
    } else {
      video.play();
      setPlaying(true);
      if (onPlay) onPlay();
    }
  };

  const handleSeek = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = value[0];
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const jumpToKeyFrame = (timestamp: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = timestamp;
    setCurrentTime(timestamp);
    if (!playing) {
      togglePlay();
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="rounded-lg overflow-hidden bg-gray-900" ref={containerRef}>
      <div className="relative">
        {/* Video element */}
        <video
          ref={videoRef}
          className="w-full h-auto"
          poster={thumbnail}
          preload="metadata"
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Play button overlay when paused */}
        {!playing && !loading && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 cursor-pointer"
            onClick={togglePlay}
          >
            <div className="bg-white bg-opacity-90 rounded-full p-3 hover:bg-opacity-100 transition">
              <Play className="h-8 w-8 text-primary" />
            </div>
          </div>
        )}

        {/* Motion analysis markers */}
        {motionMarkers.map((marker, index) => (
          <div
            key={index}
            className="absolute border-2 border-secondary rounded-full animate-pulse"
            style={{
              top: `${marker.y * 100}%`,
              left: `${marker.x * 100}%`,
              width: "15px",
              height: "15px",
              transform: "translate(-50%, -50%)",
            }}
            title={marker.name || `Marker ${index + 1}`}
          ></div>
        ))}
      </div>

      {/* Controls */}
      <div className="bg-gray-800 px-4 py-3">
        <div className="flex items-center mb-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:text-primary hover:bg-gray-700"
            onClick={togglePlay}
          >
            {playing ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
            <span className="sr-only">{playing ? "Pause" : "Play"}</span>
          </Button>
          
          <div className="flex-1 mx-2">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={0.1}
              onValueChange={handleSeek}
              className="cursor-pointer"
            />
          </div>
          
          <div className="text-xs text-white ml-2">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>

        {/* Key frame jump buttons */}
        {keyFrameTimestamps.length > 0 && (
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-xs text-gray-400">Key moments:</span>
            {keyFrameTimestamps.map((timestamp, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs bg-gray-700 hover:bg-gray-600 border-gray-600 text-white"
                onClick={() => jumpToKeyFrame(timestamp)}
              >
                {formatTime(timestamp)}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
