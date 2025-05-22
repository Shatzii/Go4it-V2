import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/simplified-auth-context";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Settings, User, Video, BookOpen, ChevronRight, Award, ActivitySquare } from "lucide-react";
import { StarPathDashboard } from "@/components/starpath/StarPathDashboard";
import StarPath3D from "@/components/starpath/StarPath3D";

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("starpath");
  const [profileStats, setProfileStats] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch user profile data
    const fetchProfileData = async () => {
      try {
        if (!user) return;
        const response = await fetch(`/api/user/${user.id}`);
        if (!response.ok) throw new Error("Failed to fetch profile data");
        const data = await response.json();
        setProfileStats(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user, toast]);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#0e1628" }}>
      {/* Header */}
      <header className="sticky top-0 z-10 bg-slate-900/90 backdrop-blur-sm border-b border-slate-800 py-3 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mr-4">
              Go4It Sports
            </h1>
            <span className="hidden md:block text-sm text-slate-400">Athlete Dashboard</span>
          </div>

          {user && (
            <div className="flex items-center">
              <div className="hidden md:flex mr-4 items-center">
                <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                  <img
                    src={user.profileImage || "https://randomuser.me/api/portraits/men/32.jpg"}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-slate-200 text-sm font-medium">
                  {user.name}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Logout</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full px-4 py-6 gap-6">
        {/* Sidebar */}
        <div className="md:w-64 shrink-0">
          <div className="bg-slate-900 rounded-xl overflow-hidden mb-6">
            {user && (
              <div className="p-6 text-center border-b border-slate-800">
                <div className="w-20 h-20 mx-auto rounded-full overflow-hidden mb-4">
                  <img
                    src={user.profileImage || "https://randomuser.me/api/portraits/men/32.jpg"}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-white text-lg font-semibold">{user.name}</h2>
                <p className="text-slate-400 text-sm mt-1 capitalize">{user.role}</p>

                {profileStats && (
                  <div className="mt-4 grid grid-cols-2 gap-2 text-center">
                    <div className="bg-slate-800 p-2 rounded">
                      <div className="text-blue-400 font-semibold">{profileStats.stats.videosAnalyzed}</div>
                      <div className="text-xs text-slate-400">Videos</div>
                    </div>
                    <div className="bg-slate-800 p-2 rounded">
                      <div className="text-green-400 font-semibold">{profileStats.stats.averageGarScore}</div>
                      <div className="text-xs text-slate-400">GAR Score</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <nav className="p-3">
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => setActiveTab("starpath")}
                    className={`w-full flex items-center px-3 py-2 rounded-md text-sm ${
                      activeTab === "starpath"
                        ? "bg-blue-600 text-white"
                        : "text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    <Award className="h-5 w-5 mr-3" />
                    StarPath
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("videos")}
                    className={`w-full flex items-center px-3 py-2 rounded-md text-sm ${
                      activeTab === "videos"
                        ? "bg-blue-600 text-white"
                        : "text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    <Video className="h-5 w-5 mr-3" />
                    Videos
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("academics")}
                    className={`w-full flex items-center px-3 py-2 rounded-md text-sm ${
                      activeTab === "academics"
                        ? "bg-blue-600 text-white"
                        : "text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    <BookOpen className="h-5 w-5 mr-3" />
                    Academics
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("activity")}
                    className={`w-full flex items-center px-3 py-2 rounded-md text-sm ${
                      activeTab === "activity"
                        ? "bg-blue-600 text-white"
                        : "text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    <ActivitySquare className="h-5 w-5 mr-3" />
                    Activity
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`w-full flex items-center px-3 py-2 rounded-md text-sm ${
                      activeTab === "profile"
                        ? "bg-blue-600 text-white"
                        : "text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    <User className="h-5 w-5 mr-3" />
                    Profile
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("settings")}
                    className={`w-full flex items-center px-3 py-2 rounded-md text-sm ${
                      activeTab === "settings"
                        ? "bg-blue-600 text-white"
                        : "text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    <Settings className="h-5 w-5 mr-3" />
                    Settings
                  </button>
                </li>
              </ul>
            </nav>
          </div>

          {/* Quick Stats */}
          {profileStats && (
            <div className="bg-slate-900 rounded-xl p-4">
              <h3 className="text-slate-200 text-sm font-medium mb-3">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-xs">School</span>
                  <span className="text-slate-200 text-sm">{profileStats.school}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-xs">Grad Year</span>
                  <span className="text-slate-200 text-sm">{profileStats.gradYear}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-xs">Sports</span>
                  <span className="text-slate-200 text-sm">{profileStats.sports.join(", ")}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-xs">Academic Status</span>
                  <span className="text-green-400 text-sm">On Track</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          {activeTab === "starpath" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold text-white">StarPath™ Interactive</h2>
                <div className="flex items-center">
                  <button 
                    className="text-sm px-3 py-1 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors mr-2"
                    onClick={() => toast({
                      title: "Tutorial Mode",
                      description: "Tutorial mode is now enabled. Follow the on-screen instructions.",
                      variant: "default"
                    })}
                  >
                    Tutorial
                  </button>
                  <button 
                    className="text-sm px-3 py-1 rounded-full bg-blue-900 text-blue-300 hover:bg-blue-800 transition-colors"
                    onClick={() => toast({
                      title: "Full Screen Mode",
                      description: "Coming soon in the next update!",
                      variant: "default"
                    })}
                  >
                    Full Screen
                  </button>
                </div>
              </div>
              
              <StarPath3D />
              
              <StarPathDashboard />
            </div>
          )}
          
          {activeTab === "videos" && (
            <div className="bg-slate-900 rounded-xl p-6 text-white">
              <h2 className="text-xl font-bold mb-6">My Videos</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="bg-slate-800 rounded-lg overflow-hidden">
                    <div className="h-40 w-full bg-slate-700 relative">
                      <img 
                        src={`https://images.unsplash.com/photo-${index === 0 ? '1546519638-68e109498ffc' : index === 1 ? '1627627256672-027a4613d028' : '1574680178050-55c6a6a96e0a'}?w=500`} 
                        alt="Video thumbnail" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-2 right-2 bg-slate-900/80 text-white text-xs px-2 py-1 rounded">
                        {index === 0 ? '4:25' : index === 1 ? '2:18' : '3:45'}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-white mb-1">
                        {index === 0 ? 'Game Highlights vs. Central High' : 
                         index === 1 ? 'Practice Shooting Drills' : 'Speed Training Session'}
                      </h3>
                      <p className="text-xs text-slate-400 mb-3">
                        {index === 0 ? 'May 18, 2025' : index === 1 ? 'May 15, 2025' : 'May 10, 2025'}
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="bg-blue-900/40 text-blue-400 px-2 py-1 rounded text-xs">
                          GAR Score: {index === 0 ? '83' : index === 1 ? '77' : '79'}
                        </div>
                        <button className="text-slate-300 hover:text-white text-sm flex items-center">
                          View Analysis
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex justify-center">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition-colors">
                  Upload New Video
                </button>
              </div>
            </div>
          )}
          
          {activeTab === "academics" && (
            <div className="bg-slate-900 rounded-xl p-6 text-white">
              <h2 className="text-xl font-bold mb-2">Academic Tracker</h2>
              <p className="text-slate-400 text-sm mb-6">Track your NCAA eligibility requirements</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-800 p-4 rounded-lg">
                  <h3 className="text-slate-300 text-sm mb-2">GPA</h3>
                  <p className="text-2xl font-bold">3.2</p>
                  <p className="text-green-400 text-xs mt-2">Above NCAA minimum</p>
                </div>
                <div className="bg-slate-800 p-4 rounded-lg">
                  <h3 className="text-slate-300 text-sm mb-2">Core Courses</h3>
                  <p className="text-2xl font-bold">10/16</p>
                  <p className="text-yellow-400 text-xs mt-2">On track for completion</p>
                </div>
                <div className="bg-slate-800 p-4 rounded-lg">
                  <h3 className="text-slate-300 text-sm mb-2">SAT Score</h3>
                  <p className="text-2xl font-bold">1120</p>
                  <p className="text-green-400 text-xs mt-2">Above NCAA minimum</p>
                </div>
              </div>
              
              <h3 className="text-lg font-medium mb-4">Recent Grades</h3>
              <div className="bg-slate-800 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-700">
                      <th className="text-left py-3 px-4 font-medium text-slate-300">Course</th>
                      <th className="text-center py-3 px-4 font-medium text-slate-300">Grade</th>
                      <th className="text-center py-3 px-4 font-medium text-slate-300">Credits</th>
                      <th className="text-center py-3 px-4 font-medium text-slate-300">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { course: "English 2", grade: "B+", credits: 1.0, completed: true },
                      { course: "Algebra II", grade: "B", credits: 1.0, completed: true },
                      { course: "Biology", grade: "A-", credits: 1.0, completed: true },
                      { course: "U.S. History", grade: "B+", credits: 1.0, completed: true },
                      { course: "Spanish II", grade: "B", credits: 1.0, completed: true }
                    ].map((course, index) => (
                      <tr key={index} className="border-t border-slate-700">
                        <td className="py-3 px-4 text-white">{course.course}</td>
                        <td className="py-3 px-4 text-center text-white">{course.grade}</td>
                        <td className="py-3 px-4 text-center text-slate-300">{course.credits}</td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-block px-2 py-1 rounded-full text-xs bg-green-900/50 text-green-400">
                            {course.completed ? "Completed" : "In Progress"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {activeTab === "activity" && (
            <div className="bg-slate-900 rounded-xl p-6 text-white">
              <h2 className="text-xl font-bold mb-6">Activity</h2>
              <p className="text-slate-400 text-sm mb-6">Coming soon!</p>
            </div>
          )}
          
          {activeTab === "profile" && (
            <div className="bg-slate-900 rounded-xl p-6 text-white">
              <h2 className="text-xl font-bold mb-6">Profile</h2>
              <p className="text-slate-400 text-sm mb-6">Coming soon!</p>
            </div>
          )}
          
          {activeTab === "settings" && (
            <div className="bg-slate-900 rounded-xl p-6 text-white">
              <h2 className="text-xl font-bold mb-6">Settings</h2>
              <p className="text-slate-400 text-sm mb-6">Coming soon!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;