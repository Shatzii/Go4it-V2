import React from 'react';
import { useParams } from 'wouter';
import VideoAnalysisDashboard from '@/components/video-analysis/VideoAnalysisDashboard';
import { PageHeader } from '@/components/ui/page-header';

/**
 * Video Analysis GAR Page
 * 
 * This page displays the Growth and Ability Rating (GAR) scoring dashboard for a specific video.
 * The dashboard provides a comprehensive breakdown of an athlete's performance with
 * specialized insights for neurodivergent athletes, particularly those with ADHD.
 */
const VideoAnalysisGARPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  // Component now uses the self-contained VideoAnalysisDashboard which handles
  // all its own data fetching and state management internally
  return (
    <div className="container mx-auto pt-8 pb-16">
      <PageHeader
        title="GAR Score Analysis"
        description="AI-powered performance analysis with Growth and Ability Rating scoring system"
      />
      
      <div className="my-8">
        {/* Our updated VideoAnalysisDashboard now handles all its own data loading */}
        <VideoAnalysisDashboard />
      </div>
    </div>
  );
};

export default VideoAnalysisGARPage;