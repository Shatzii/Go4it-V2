import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";
import { Link } from "wouter";
import { VideoAnalysisCard } from "@/components/dashboard/video-analysis-card";
import { Button } from "@/components/ui/button";
import { UploadCloud, FileVideo, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function VideoAnalysis() {
  const { user } = useAuth();
  const [sortBy, setSortBy] = useState("newest");
  const [sportFilter, setSportFilter] = useState("all");

  // Fetch user's videos
  const { data: videos, isLoading } = useQuery({
    queryKey: ["/api/videos"],
    enabled: !!user,
  });

  // Filter and sort videos based on user selection
  const filteredVideos = videos
    ? videos.filter((video) => 
        sportFilter === "all" || video.sportType === sportFilter
      )
    : [];

  const sortedVideos = [...(filteredVideos || [])].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
    } else if (sortBy === "oldest") {
      return new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime();
    } else if (sortBy === "analyzed") {
      return (b.analyzed ? 1 : 0) - (a.analyzed ? 1 : 0);
    }
    return 0;
  });

  // Create a list of unique sport types for filtering
  const sportTypes = videos
    ? ["all", ...new Set(videos.map((video) => video.sportType).filter(Boolean))]
    : ["all"];

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6">
        <h1 className="text-2xl font-bold mb-4">Video Analysis</h1>
        <p className="text-gray-600 mb-6">
          Please log in to view your video analyses
        </p>
        <Link href="/auth">
          <Button>Log In</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="font-heading font-bold text-2xl md:text-3xl text-neutral mb-2">
            Video Analysis
          </h1>
          <p className="text-gray-600">
            Upload videos for AI-powered motion analysis to improve your technique
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link href="/upload-video">
            <Button className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg flex items-center">
              <UploadCloud className="h-5 w-5 mr-2" />
              Upload New Video
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters and sorting */}
      <div className="bg-white rounded-lg p-4 mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex items-center">
          <Filter className="h-5 w-5 mr-2 text-gray-500" />
          <span className="text-sm font-medium mr-3">Filter by:</span>
          <Select
            value={sportFilter}
            onValueChange={setSportFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by sport" />
            </SelectTrigger>
            <SelectContent>
              {sportTypes.map((sport) => (
                <SelectItem key={sport} value={sport}>
                  {sport === "all" ? "All Sports" : sport.charAt(0).toUpperCase() + sport.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center">
          <span className="text-sm font-medium mr-3">Sort by:</span>
          <Select
            value={sortBy}
            onValueChange={setSortBy}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="analyzed">Analyzed First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your videos...</p>
        </div>
      ) : sortedVideos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedVideos.map((video) => (
            <div key={video.id} className="flex flex-col h-full">
              <VideoAnalysisCard video={video} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
          <FileVideo className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No Videos Yet</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Upload your first video to get started with AI-powered motion analysis
          </p>
          <Link href="/upload-video">
            <Button>Upload Your First Video</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
