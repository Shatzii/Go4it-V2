import React, { useState } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { useAuth } from "@/contexts/simplified-auth-context";
import { GarScoreCard } from "@/components/gar/GarScoreCard";
import { AcademicTracker } from "@/components/academics/AcademicTracker";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { 
  Trophy, 
  Upload, 
  LineChart, 
  ListChecks, 
  Clock3,
  Video,
  VideoIcon,
  Calendar,
  Users,
  GraduationCap
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  
  // Mock data for the dashboard
  const mockGarData = {
    overallScore: 78,
    physicalScore: 82,
    technicalScore: 75,
    tacticalScore: 68,
    mentalScore: 77,
    academicScore: 85,
    socialScore: 80,
    sportType: "Basketball",
  };
  
  // Mock recent videos
  const recentVideos = [
    {
      id: 1,
      title: "Game Highlights vs. Central High",
      date: "May 18, 2025",
      thumbnail: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500",
      duration: "4:25",
      views: 76,
      score: 83,
    },
    {
      id: 2,
      title: "Practice Shooting Drills",
      date: "May 15, 2025",
      thumbnail: "https://images.unsplash.com/photo-1627627256672-027a4613d028?w=500",
      duration: "2:18",
      views: 42,
      score: 77,
    },
  ];
  
  // Mock upcoming events
  const upcomingEvents = [
    {
      id: 1,
      title: "Team Practice",
      date: "Tomorrow, 4:00 PM",
      location: "Main Gym",
      type: "practice"
    },
    {
      id: 2,
      title: "Game vs. Westside Eagles",
      date: "May 25, 2025, 7:00 PM",
      location: "Home Court",
      type: "game"
    },
    {
      id: 3,
      title: "Speed Training",
      date: "May 27, 2025, 3:30 PM",
      location: "Track Field",
      type: "training"
    }
  ];
  
  // Stats summary data
  const statsSummary = [
    { label: "Videos", value: 12, icon: <VideoIcon size={18} /> },
    { label: "GAR Score", value: 78, icon: <Trophy size={18} /> },
    { label: "Practice Hours", value: 24, icon: <Clock3 size={18} /> },
    { label: "Tasks Complete", value: 8, icon: <ListChecks size={18} /> },
  ];

  const handleVideoUpload = () => {
    navigate("/videos/upload");
  };
  
  return (
    <MobileLayout title="Dashboard">
      <div className="space-y-6 pb-20">
        {/* Welcome section */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Welcome, {user?.name}</h2>
            <p className="text-gray-400">Your athletic journey continues</p>
          </div>
          <Button 
            onClick={handleVideoUpload}
            className="bg-gradient-to-r from-blue-600 to-blue-500 flex items-center gap-2"
            size="sm"
          >
            <Upload size={16} />
            <span>Upload</span>
          </Button>
        </div>
        
        {/* Stats summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {statsSummary.map((stat, index) => (
            <div 
              key={index} 
              className="bg-gray-900 p-4 rounded-lg border border-gray-800 flex flex-col items-center justify-center"
            >
              <div className="bg-blue-900/50 p-2 rounded-full mb-2">
                {stat.icon}
              </div>
              <span className="text-xl font-bold">{stat.value}</span>
              <span className="text-xs text-gray-400">{stat.label}</span>
            </div>
          ))}
        </div>
        
        {/* GAR Score Card */}
        <GarScoreCard {...mockGarData} />
        
        {/* Recent Videos */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Recent Videos</h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/videos")}
            >
              View All
            </Button>
          </div>
          
          <div className="space-y-4">
            {recentVideos.map((video) => (
              <div 
                key={video.id}
                className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 flex"
                onClick={() => navigate(`/videos/${video.id}`)}
              >
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute bottom-1 right-1 bg-black/70 text-xs px-1 rounded">
                    {video.duration}
                  </div>
                </div>
                <div className="p-3 flex-1">
                  <h4 className="font-medium mb-1 line-clamp-1">{video.title}</h4>
                  <p className="text-xs text-gray-400 mb-2">{video.date}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">{video.views} views</span>
                    <div className="flex items-center">
                      <Trophy size={14} className="text-yellow-400 mr-1" />
                      <span className="text-sm font-medium">{video.score}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {recentVideos.length === 0 && (
              <div className="bg-gray-900 rounded-lg p-6 text-center border border-gray-800">
                <Video className="mx-auto h-8 w-8 text-gray-500 mb-2" />
                <h3 className="font-medium text-gray-300">No videos yet</h3>
                <p className="text-sm text-gray-500 mb-4">Upload your first video to get started</p>
                <Button 
                  onClick={handleVideoUpload}
                  variant="outline"
                  size="sm"
                >
                  Upload Video
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Academic Tracker */}
        <AcademicTracker />
        
        {/* Upcoming Events */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Upcoming Events</h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/calendar")}
            >
              View Calendar
            </Button>
          </div>
          
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <div 
                key={event.id} 
                className="bg-gray-900 rounded-lg p-3 border border-gray-800"
              >
                <div className="flex items-start">
                  <div className={`p-2 rounded-lg mr-3 ${
                    event.type === "game" ? "bg-green-900/30" : 
                    event.type === "practice" ? "bg-blue-900/30" : 
                    "bg-yellow-900/30"
                  }`}>
                    {event.type === "game" ? (
                      <Trophy size={20} className="text-green-400" />
                    ) : event.type === "practice" ? (
                      <Users size={20} className="text-blue-400" />
                    ) : (
                      <GraduationCap size={20} className="text-yellow-400" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium">{event.title}</h4>
                    <p className="text-xs text-gray-400">{event.date}</p>
                    <p className="text-xs text-gray-500">{event.location}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {upcomingEvents.length === 0 && (
              <div className="bg-gray-900 rounded-lg p-4 text-center border border-gray-800">
                <Calendar className="mx-auto h-8 w-8 text-gray-500 mb-2" />
                <p className="text-sm text-gray-400">No upcoming events</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            className="flex items-center justify-center gap-2 h-14"
            onClick={() => navigate("/videos/upload")}
          >
            <Video size={18} />
            <span>Upload Video</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center justify-center gap-2 h-14"
            onClick={() => navigate("/academics")}
          >
            <GraduationCap size={18} />
            <span>Academic Profile</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center justify-center gap-2 h-14"
            onClick={() => navigate("/progress")}
          >
            <LineChart size={18} />
            <span>View Progress</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center justify-center gap-2 h-14"
            onClick={() => navigate("/tasks")}
          >
            <ListChecks size={18} />
            <span>Training Tasks</span>
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
}