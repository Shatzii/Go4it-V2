'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';

// Lazy load LiveKit components to reduce initial bundle size (important for Replit)
const LiveKitRoom = dynamic(
  () => import('@livekit/components-react').then((mod) => mod.LiveKitRoom),
  { ssr: false }
);
const VideoConference = dynamic(
  () => import('@livekit/components-react').then((mod) => mod.VideoConference),
  { ssr: false }
);
const RoomAudioRenderer = dynamic(
  () => import('@livekit/components-react').then((mod) => mod.RoomAudioRenderer),
  { ssr: false }
);

interface VideoRoomProps {
  roomName: string;
  roomType?: 'team' | 'parent-night' | 'coaching';
  isHost?: boolean;
  onLeave?: () => void;
}

export function VideoRoom({ roomName, roomType = 'team', isHost = false, onLeave }: VideoRoomProps) {
  const [token, setToken] = useState<string>('');
  const [serverUrl, setServerUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    async function fetchToken() {
      try {
        const response = await fetch('/api/video/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roomName, roomType, isHost }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to get token');
        }

        const data = await response.json();
        setToken(data.token);
        setServerUrl(data.serverUrl);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to connect to video room');
      } finally {
        setLoading(false);
      }
    }

    fetchToken();
  }, [roomName, roomType, isHost]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-900 rounded-lg">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-2" />
          <p className="text-slate-400">Connecting to video room...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-900 rounded-lg">
        <div className="text-center p-6">
          <div className="text-red-500 mb-2">❌</div>
          <p className="text-white font-medium mb-1">Connection Error</p>
          <p className="text-slate-400 text-sm">{error}</p>
          {onLeave && (
            <button
              onClick={onLeave}
              className="mt-4 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg"
            >
              Go Back
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <LiveKitRoom
      token={token}
      serverUrl={serverUrl}
      connect={true}
      video={true}
      audio={true}
      {...(onLeave && { onDisconnected: () => onLeave() })}
      data-lk-theme="default"
      className="h-full"
      style={{ '--lk-bg': '#0f172a' } as React.CSSProperties}
    >
      <VideoConference />
      <RoomAudioRenderer />
    </LiveKitRoom>
  );
}

/**
 * Simpler video room with custom layout (REMOVED - use VideoConference)
 * Removed to optimize bundle size for Replit deployment
 */
