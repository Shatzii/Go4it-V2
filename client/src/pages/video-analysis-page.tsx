import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'wouter';
import VideoAnalysisDashboard from '@/components/video-analysis/VideoAnalysisDashboard';
import { PageHeader } from '@/components/ui/page-header';
import { Spinner } from '@/components/ui/spinner';
import { ErrorDisplay } from '@/components/ui/error-display';

const VideoAnalysisPage: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  
  // Fetch video data including analysis
  const { data: videoData, isLoading: videoLoading, error: videoError } = useQuery({
    queryKey: ['/api/videos', parseInt(videoId)],
    enabled: !!videoId,
  });
  
  // Fetch video highlights
  const { data: highlights, isLoading: highlightsLoading, error: highlightsError } = useQuery({
    queryKey: ['/api/videos', parseInt(videoId), 'highlights'],
    enabled: !!videoId,
  });
  
  // Fetch video analysis specifically
  const { data: analysisData, isLoading: analysisLoading, error: analysisError } = useQuery({
    queryKey: ['/api/videos', parseInt(videoId), 'analysis'],
    enabled: !!videoId,
  });
  
  const isLoading = videoLoading || highlightsLoading || analysisLoading;
  const error = videoError || highlightsError || analysisError;

  if (isLoading) {
    return (
      <div className="container mx-auto pt-8 pb-16">
        <PageHeader
          title="Video Analysis"
          description="Loading your video performance analysis..."
        />
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto pt-8 pb-16">
        <PageHeader
          title="Video Analysis"
          description="There was an error loading your video analysis."
        />
        <ErrorDisplay 
          title="Could not load analysis"
          description="We encountered a problem retrieving your video analysis data."
          error={error}
          actions={[
            {
              label: "Back to Videos",
              href: "/videos",
              primary: true
            },
            {
              label: "Try Again",
              onClick: () => window.location.reload(),
              primary: false
            }
          ]}
        />
      </div>
    );
  }

  if (!videoData || !highlights || !analysisData) {
    return (
      <div className="container mx-auto pt-8 pb-16">
        <PageHeader
          title="Video Analysis"
          description="No analysis data available for this video."
        />
        <div className="bg-[#1A2033] border border-[#2A3142] rounded-lg p-8 text-center my-8">
          <h3 className="text-xl font-medium mb-4">No Analysis Available</h3>
          <p className="text-gray-400 mb-6">
            This video hasn't been analyzed yet or the analysis data is not available.
          </p>
          <div className="flex space-x-4 justify-center">
            <a
              href="/videos"
              className="px-4 py-2 rounded-md bg-blue-600 text-white font-medium"
            >
              Back to Videos
            </a>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-md border border-gray-600 text-gray-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto pt-8 pb-16">
      <PageHeader
        title="Video Analysis"
        description="AI-powered performance analysis with GAR scoring system"
      />
      
      <div className="my-8">
        <VideoAnalysisDashboard
          videoId={parseInt(videoId)}
          videoTitle={videoData.title}
          videoUrl={videoData.videoUrl || videoData.filePath}
          thumbnailUrl={videoData.thumbnailUrl || videoData.thumbnailPath}
          sportType={videoData.sportType || 'basketball'}
          analysisData={analysisData}
          highlights={highlights}
        />
      </div>
    </div>
  );
};

export default VideoAnalysisPage;