'use client';

import { useEffect, useRef, useState } from 'react';

interface VideoPlayerProps {
  videos: { src: string; angle: string }[];
  onSync?: (time: number) => void;
}

export function SynchronizedVideoPlayer({ videos, onSync }: VideoPlayerProps) {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [activeAngle, setActiveAngle] = useState<number | null>(null);

  useEffect(() => {
    // Initialize video refs array
    videoRefs.current = videoRefs.current.slice(0, videos.length);
  }, [videos.length]);

  const syncVideos = () => {
    const masterVideo = videoRefs.current[0];
    if (!masterVideo) return;

    const masterTime = masterVideo.currentTime;
    
    videoRefs.current.forEach((video, index) => {
      if (video && index !== 0) {
        const timeDiff = Math.abs(video.currentTime - masterTime);
        if (timeDiff > 0.1) { // Sync if more than 100ms difference
          video.currentTime = masterTime;
        }
      }
    });
  };

  const playAll = () => {
    videoRefs.current.forEach(video => {
      if (video) {
        video.play().catch(() => {
          // Ignore autoplay errors
        });
      }
    });
    setPlaying(true);
  };

  const pauseAll = () => {
    videoRefs.current.forEach(video => {
      if (video) {
        video.pause();
      }
    });
    setPlaying(false);
  };

  const seekAll = (time: number) => {
    videoRefs.current.forEach(video => {
      if (video) {
        video.currentTime = time;
      }
    });
    setCurrentTime(time);
    onSync?.(time);
  };

  const handleTimeUpdate = () => {
    const masterVideo = videoRefs.current[0];
    if (masterVideo) {
      setCurrentTime(masterVideo.currentTime);
      setDuration(masterVideo.duration);
      syncVideos();
    }
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case ' ':
          e.preventDefault();
          playing ? pauseAll() : playAll();
          break;
        case 'ArrowLeft':
          seekAll(Math.max(0, currentTime - 5));
          break;
        case 'ArrowRight':
          seekAll(Math.min(duration, currentTime + 5));
          break;
        case '0':
          seekAll(0);
          break;
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [playing, currentTime, duration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((video, index) => (
          <div
            key={index}
            className={`relative rounded-lg overflow-hidden border-2 transition-all ${
              activeAngle === index
                ? 'border-blue-500 scale-105 shadow-lg'
                : 'border-gray-300 hover:border-blue-300'
            }`}
            onClick={() => setActiveAngle(activeAngle === index ? null : index)}
          >
            <video
              ref={el => {
                videoRefs.current[index] = el;
              }}
              src={video.src}
              className="w-full aspect-video object-cover"
              onTimeUpdate={index === 0 ? handleTimeUpdate : undefined}
              onLoadedMetadata={index === 0 ? handleTimeUpdate : undefined}
            />
            <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm font-medium">
              {video.angle}
            </div>
            {activeAngle === index && (
              <div className="absolute inset-0 border-4 border-blue-500 pointer-events-none" />
            )}
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="bg-slate-800 rounded-lg p-4 space-y-3">
        <div className="flex items-center space-x-4">
          <button
            onClick={playing ? pauseAll : playAll}
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-colors"
          >
            {playing ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            )}
          </button>

          <button
            onClick={() => seekAll(Math.max(0, currentTime - 5))}
            className="text-white hover:text-blue-400 transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z" clipRule="evenodd" />
            </svg>
          </button>

          <button
            onClick={() => seekAll(Math.min(duration, currentTime + 5))}
            className="text-white hover:text-blue-400 transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
            </svg>
          </button>

          <div className="flex-1">
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={(e) => seekAll(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <span className="text-white font-mono text-sm">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

        {/* Speed Controls */}
        <div className="flex items-center justify-center space-x-2">
          {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 2].map(speed => (
            <button
              key={speed}
              onClick={() => {
                videoRefs.current.forEach(video => {
                  if (video) video.playbackRate = speed;
                });
              }}
              className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm transition-colors"
            >
              {speed}x
            </button>
          ))}
        </div>

        {/* Keyboard Shortcuts Info */}
        <div className="text-xs text-gray-400 text-center">
          Keyboard: Space=Play/Pause | ←/→=Skip 5s | 0=Restart
        </div>
      </div>
    </div>
  );
}
