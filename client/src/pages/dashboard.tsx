import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressRing } from "@/components/dashboard/progress-ring";
import { Achievements } from "@/components/dashboard/achievements";
import { VideoAnalysisCard } from "@/components/dashboard/video-analysis-card";
import { SportRecommendationCard } from "@/components/dashboard/sport-recommendation-card";
import { CoachCard } from "@/components/dashboard/coach-card";
import { 
  Achievement, 
  AthleteProfile, 
  CoachConnection, 
  NcaaEligibility, 
  SportRecommendation, 
  Video, 
  VideoAnalysis 
} from "@shared/schema";

export default function Dashboard() {
  const { user } = useAuth();
  
  // Fetch user's athlete profile if they are an athlete
  const { data: athleteProfile } = useQuery({
    queryKey: ["/api/athletes", user?.id, "/profile"],
    enabled: !!user && user.role === "athlete",
  });

  // Fetch recent videos and their analyses
  const { data: videos } = useQuery({
    queryKey: ["/api/videos"],
    enabled: !!user,
  });

  // Fetch video analysis for the most recent video
  const { data: videoAnalysis, isLoading: analysisLoading } = useQuery({
    queryKey: ["/api/videos", videos?.[0]?.id, "/analysis"],
    enabled: !!videos && videos.length > 0,
  });

  // Fetch sport recommendations
  const { data: sportRecommendations } = useQuery({
    queryKey: ["/api/athletes", user?.id, "/recommendations"],
    enabled: !!user && user.role === "athlete",
  });

  // Fetch NCAA eligibility
  const { data: ncaaEligibility } = useQuery({
    queryKey: ["/api/athletes", user?.id, "/ncaa-eligibility"],
    enabled: !!user && user.role === "athlete",
  });

  // Fetch coach connections
  const { data: coachConnections } = useQuery({
    queryKey: ["/api/connections"],
    enabled: !!user,
  });

  // Fetch achievements
  const { data: achievements } = useQuery({
    queryKey: ["/api/athletes", user?.id, "/achievements"],
    enabled: !!user && user.role === "athlete",
  });

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6">
        <h1 className="text-2xl font-bold mb-4">Welcome to GoForIt AI Platform</h1>
        <p className="text-gray-600 mb-6">
          Please log in to access your personalized dashboard and start your athletic journey!
        </p>
        <div className="flex gap-4">
          <Link href="/login">
            <Button>Log In</Button>
          </Link>
          <Link href="/register">
            <Button variant="outline">Create Account</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Welcome Section */}
      <section className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="font-heading font-bold text-2xl md:text-3xl text-neutral">
              Hey {user.name.split(' ')[0]}, Welcome Back!
            </h1>
            <p className="text-gray-600 mt-1">Your athlete journey is progressing well!</p>
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
      </section>

      {/* Player Story & Progress */}
      <section className="mb-8 bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="font-heading font-bold text-xl text-neutral mb-4">Your Player Story</h2>
          
          {/* Progress Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Progress Metric 1 - Motion Score */}
            <div className="bg-neutral-light bg-opacity-30 rounded-lg p-4 flex items-center">
              <div className="relative w-16 h-16 mr-4">
                <ProgressRing 
                  percentage={athleteProfile?.motionScore || 65} 
                  color="#36B37E"
                >
                  <div className="text-lg font-bold text-accent">
                    {athleteProfile?.motionScore || 65}%
                  </div>
                </ProgressRing>
              </div>
              <div>
                <h3 className="font-medium text-neutral">Motion Score</h3>
                <p className="text-sm text-gray-600">
                  Based on {videos?.length || 0} video analyses
                </p>
              </div>
            </div>
            
            {/* Progress Metric 2 - NCAA Eligibility */}
            <div className="bg-neutral-light bg-opacity-30 rounded-lg p-4 flex items-center">
              <div className="relative w-16 h-16 mr-4">
                <ProgressRing 
                  percentage={
                    ncaaEligibility ? 
                    Math.round((ncaaEligibility.coreCoursesCompleted / ncaaEligibility.coreCoursesRequired) * 100) : 
                    85
                  } 
                  color="#FF5630"
                >
                  <div className="text-lg font-bold text-secondary">
                    {ncaaEligibility ? 
                     Math.round((ncaaEligibility.coreCoursesCompleted / ncaaEligibility.coreCoursesRequired) * 100) : 
                     85}%
                  </div>
                </ProgressRing>
              </div>
              <div>
                <h3 className="font-medium text-neutral">NCAA Eligibility</h3>
                <p className="text-sm text-gray-600">
                  {ncaaEligibility ? 
                   `${ncaaEligibility.coreCoursesCompleted} of ${ncaaEligibility.coreCoursesRequired} requirements met` : 
                   "3 of 4 requirements met"}
                </p>
              </div>
            </div>
            
            {/* Progress Metric 3 - Profile Completion */}
            <div className="bg-neutral-light bg-opacity-30 rounded-lg p-4 flex items-center">
              <div className="relative w-16 h-16 mr-4">
                <ProgressRing 
                  percentage={athleteProfile?.profileCompletionPercentage || 50} 
                  color="#0052CC"
                >
                  <div className="text-lg font-bold text-primary">
                    {athleteProfile?.profileCompletionPercentage || 50}%
                  </div>
                </ProgressRing>
              </div>
              <div>
                <h3 className="font-medium text-neutral">Profile Completion</h3>
                <p className="text-sm text-gray-600">Add more details to improve</p>
              </div>
            </div>
          </div>
          
          {/* Achievement Badges */}
          {achievements && achievements.length > 0 && (
            <Achievements achievements={achievements} />
          )}
        </div>
      </section>

      {/* Video Analysis & Sport Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Video Analysis Section */}
        <section className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-heading font-bold text-xl text-neutral">Recent Video Analysis</h2>
              <Link href="/video-analysis">
                <a className="text-primary text-sm font-medium hover:text-primary-dark">View All</a>
              </Link>
            </div>
            
            {videos && videos.length > 0 ? (
              <VideoAnalysisCard 
                video={videos[0]} 
                analysis={videoAnalysis}
              />
            ) : (
              <div className="text-center py-12 bg-neutral-light bg-opacity-30 rounded-lg">
                <div className="mb-4">
                  <UploadCloud className="h-12 w-12 mx-auto text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">No videos yet</h3>
                <p className="text-gray-600 mb-4">Upload a video to get motion analysis</p>
                <Link href="/upload-video">
                  <Button variant="secondary">Upload Your First Video</Button>
                </Link>
              </div>
            )}
          </div>
        </section>
        
        {/* Sport Recommendations Section */}
        <section className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-heading font-bold text-xl text-neutral">Sport Recommendations</h2>
              <Link href="/sport-recommendations">
                <a className="text-primary text-sm font-medium hover:text-primary-dark">View All</a>
              </Link>
            </div>
            
            <p className="text-gray-600 mb-4">Based on your motion analysis, these sports match your athletic profile:</p>
            
            {sportRecommendations && sportRecommendations.length > 0 ? (
              <div className="space-y-4">
                {sportRecommendations.slice(0, 3).map((recommendation, index) => (
                  <SportRecommendationCard 
                    key={recommendation.id} 
                    recommendation={recommendation} 
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-neutral-light bg-opacity-30 rounded-lg">
                <div className="mb-4">
                  <UploadCloud className="h-12 w-12 mx-auto text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">No recommendations yet</h3>
                <p className="text-gray-600">Upload videos for AI-powered sport recommendations</p>
              </div>
            )}
          </div>
        </section>
      </div>
      
      {/* NCAA Clearinghouse Tracking */}
      <section className="mt-8 bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="font-heading font-bold text-xl text-neutral mb-4">NCAA Clearinghouse Progress</h2>
          
          {ncaaEligibility ? (
            <div className="bg-neutral-light bg-opacity-30 rounded-lg p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <div>
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-accent mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 100-16 8 8 0 000 16zm-1-5h2v2h-2v-2zm0-8h2v6h-2V7z"/>
                    </svg>
                    <h3 className="font-medium text-neutral">
                      Eligibility Status: <span className="text-accent">{ncaaEligibility.overallEligibilityStatus === "complete" ? "Complete" : ncaaEligibility.overallEligibilityStatus === "partial" ? "On Track" : "Incomplete"}</span>
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Keep up the good work with your academic and athletic development!</p>
                </div>
                <Link href="/ncaa-clearinghouse">
                  <Button className="mt-3 md:mt-0 bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                    View Full Report
                  </Button>
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-neutral mb-2">Core Courses</h4>
                  <div className="flex items-center">
                    <div className="relative w-12 h-12 mr-3">
                      <ProgressRing 
                        percentage={Math.round((ncaaEligibility.coreCoursesCompleted / ncaaEligibility.coreCoursesRequired) * 100)} 
                        size={48}
                        color="#36B37E"
                      >
                        <div className="text-sm font-bold text-accent">
                          {Math.round((ncaaEligibility.coreCoursesCompleted / ncaaEligibility.coreCoursesRequired) * 100)}%
                        </div>
                      </ProgressRing>
                    </div>
                    <div>
                      <p className="text-sm">{ncaaEligibility.coreCoursesCompleted} of {ncaaEligibility.coreCoursesRequired}</p>
                      <p className="text-xs text-gray-500">Courses Completed</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-neutral mb-2">GPA Requirement</h4>
                  <div className="flex items-center">
                    <div className="relative w-12 h-12 mr-3">
                      <ProgressRing 
                        percentage={ncaaEligibility.gpaMeetsRequirement ? 100 : 0} 
                        size={48}
                        color="#36B37E"
                      >
                        <div className="text-sm font-bold text-accent">
                          {ncaaEligibility.gpaMeetsRequirement ? "100%" : "0%"}
                        </div>
                      </ProgressRing>
                    </div>
                    <div>
                      <p className="text-sm">{ncaaEligibility.gpa} GPA</p>
                      <p className="text-xs text-gray-500">
                        {ncaaEligibility.gpaMeetsRequirement ? "Requirement Met" : "Below Requirement"}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-neutral mb-2">Test Scores</h4>
                  <div className="flex items-center">
                    <div className="relative w-12 h-12 mr-3">
                      <ProgressRing 
                        percentage={ncaaEligibility.testScoresMeetRequirement ? 100 : 0} 
                        size={48}
                        color="#36B37E"
                      >
                        <div className="text-sm font-bold text-accent">
                          {ncaaEligibility.testScoresMeetRequirement ? "100%" : "0%"}
                        </div>
                      </ProgressRing>
                    </div>
                    <div>
                      <p className="text-sm">{ncaaEligibility.testScores || "No scores"}</p>
                      <p className="text-xs text-gray-500">
                        {ncaaEligibility.testScoresMeetRequirement ? "Requirement Met" : "Testing Needed"}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-neutral mb-2">Amateurism</h4>
                  <div className="flex items-center">
                    <div className="relative w-12 h-12 mr-3">
                      <ProgressRing 
                        percentage={ncaaEligibility.amateurismStatus === "verified" ? 100 : ncaaEligibility.amateurismStatus === "pending" ? 50 : 0} 
                        size={48}
                        color={ncaaEligibility.amateurismStatus === "verified" ? "#36B37E" : "#FF5630"}
                      >
                        <div className="text-sm font-bold" style={{ color: ncaaEligibility.amateurismStatus === "verified" ? "#36B37E" : "#FF5630" }}>
                          {ncaaEligibility.amateurismStatus === "verified" ? "100%" : ncaaEligibility.amateurismStatus === "pending" ? "50%" : "0%"}
                        </div>
                      </ProgressRing>
                    </div>
                    <div>
                      <p className="text-sm capitalize">{ncaaEligibility.amateurismStatus}</p>
                      <p className="text-xs text-gray-500">Form Submission</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-neutral-light bg-opacity-30 rounded-lg">
              <h3 className="text-lg font-medium mb-2">NCAA Eligibility Tracking Not Started</h3>
              <p className="text-gray-600 mb-4">Complete your profile to begin tracking your NCAA eligibility</p>
              <Link href="/ncaa-clearinghouse">
                <Button>Set Up NCAA Tracking</Button>
              </Link>
            </div>
          )}
        </div>
      </section>
      
      {/* Coach Connection */}
      <section className="mt-8 bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-heading font-bold text-xl text-neutral">Coach Connections</h2>
            <Link href="/coach-connection">
              <Button className="text-primary text-sm font-medium hover:text-primary-dark flex items-center" variant="ghost">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Find Coaches
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coachConnections && coachConnections.length > 0 ? (
              <>
                {coachConnections.slice(0, 2).map((connection) => (
                  <CoachCard
                    key={connection.id}
                    connection={connection}
                    coach={{
                      id: connection.coachId,
                      name: connection.otherUser?.name || "Coach",
                      institution: "University Athletic Department",
                      profileImage: connection.otherUser?.profileImage,
                      notes: connection.notes,
                    }}
                  />
                ))}
                
                {/* Suggested Coach */}
                <CoachCard
                  isSuggested={true}
                  coach={{ id: 0, name: "" }}
                  onConnect={() => window.location.href = "/coach-connection"}
                />
              </>
            ) : (
              <>
                <div className="col-span-full text-center py-12 bg-neutral-light bg-opacity-30 rounded-lg">
                  <div className="mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Coach Connections Yet</h3>
                  <p className="text-gray-600 mb-4">Connect with coaches based on your sport recommendations</p>
                  <Link href="/coach-connection">
                    <Button>Find Coaches</Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
