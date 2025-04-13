import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  Home, 
  FileVideo, 
  Plus, 
  User, 
  Menu, 
  X, 
  Award, 
  BarChart3, 
  MessageSquare,
  Search,
  Dumbbell,
  Settings,
  Eye,
  EyeOff,
  Users,
  BookOpen,
  Layers,
  Coffee,
  Bot,
  Star,
  CalendarCheck,
  GitCompare,
  BarChart2,
  ClipboardList,
  ShieldCheck
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useLayout } from "@/contexts/layout-context";
import { useMessaging } from "@/contexts/messaging-context";
import { AccessibilityControls } from "@/components/accessibility/accessibility-controls";

export default function MobileNav() {
  const [location] = useLocation();
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const { user, actualRole } = useAuth();
  const { focusMode } = useLayout();
  const { unreadCount } = useMessaging();

  const toggleMoreMenu = () => {
    setShowMoreMenu(prev => !prev);
  };

  // Check if current path is admin-related
  const isAdminRoute = location.startsWith('/admin') || location === '/admin-dashboard';
  const isAdmin = user && (user.role === 'admin' || actualRole === 'admin');

  return (
    <>
      {/* Main Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-gray-950 border-t border-gray-800 flex justify-around items-center p-3 z-20">
        <Link href="/">
          <div className={`flex flex-col items-center ${location === "/" ? "text-cyan-400" : "text-gray-400"}`}>
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1 font-medium">Home</span>
          </div>
        </Link>
        
        {/* Different navigation based on user role */}
        {isAdmin ? (
          <Link href="/admin-dashboard">
            <div className={`flex flex-col items-center ${location === "/admin-dashboard" ? "text-cyan-400" : "text-gray-400"}`}>
              <ShieldCheck className="h-5 w-5" />
              <span className="text-xs mt-1 font-medium">Admin</span>
            </div>
          </Link>
        ) : (
          <Link href="/myplayer-star-path">
            <div className={`flex flex-col items-center ${location === "/myplayer-star-path" ? "text-cyan-400" : "text-gray-400"}`}>
              <Star className="h-5 w-5" />
              <span className="text-xs mt-1 font-medium">Star Path</span>
            </div>
          </Link>
        )}
        
        <Link href="/upload-video">
          <div className="flex flex-col items-center">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full p-3 -mt-6 shadow-lg shadow-cyan-500/20">
              <Plus className="h-5 w-5 text-white" />
            </div>
            <span className="text-xs mt-1 text-gray-400 font-medium">Upload</span>
          </div>
        </Link>
        
        {isAdmin ? (
          <Link href="/admin/content-manager">
            <div className={`flex flex-col items-center ${location === "/admin/content-manager" ? "text-cyan-400" : "text-gray-400"}`}>
              <Layers className="h-5 w-5" />
              <span className="text-xs mt-1 font-medium">Content</span>
            </div>
          </Link>
        ) : (
          <Link href="/weight-room">
            <div className={`flex flex-col items-center ${location.startsWith("/weight-room") ? "text-cyan-400" : "text-gray-400"}`}>
              <Dumbbell className="h-5 w-5" />
              <span className="text-xs mt-1 font-medium">Train</span>
            </div>
          </Link>
        )}
        
        <button 
          onClick={toggleMoreMenu}
          className="flex flex-col items-center text-gray-400 focus:outline-none"
          aria-expanded={showMoreMenu}
          aria-label="Toggle more menu"
        >
          {showMoreMenu ? (
            <X className="h-5 w-5 text-cyan-400" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
          <span className="text-xs mt-1 font-medium">More</span>
        </button>
      </nav>

      {/* Expanded More Menu - Redesigned with solid background */}
      {showMoreMenu && (
        <div className="md:hidden fixed bottom-16 inset-x-0 bg-gray-800 border-t border-gray-700 p-4 z-10 shadow-lg animate-in slide-in-from-bottom duration-200 max-h-[80vh] overflow-y-auto">
          {/* Accessibility Controls Row */}
          <div className="flex justify-end mb-4 px-2">
            <AccessibilityControls />
          </div>
          
          {/* Menu Categories */}
          <div className="mb-4">
            <h3 className="text-white text-sm font-bold mb-2 px-2">My Go4It Sports</h3>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <Link href="/profile">
                <div className="flex flex-col items-center" onClick={() => setShowMoreMenu(false)}>
                  <div className={`rounded-full p-3 ${location === "/profile" ? "bg-cyan-500 text-white" : "bg-gray-700 text-gray-200"}`}>
                    <User className="h-5 w-5" />
                  </div>
                  <span className="text-xs mt-2 text-center text-white font-medium">Profile</span>
                </div>
              </Link>
              
              <Link href="/video-analysis">
                <div className="flex flex-col items-center" onClick={() => setShowMoreMenu(false)}>
                  <div className={`rounded-full p-3 ${location === "/video-analysis" ? "bg-cyan-500 text-white" : "bg-gray-700 text-gray-200"}`}>
                    <FileVideo className="h-5 w-5" />
                  </div>
                  <span className="text-xs mt-2 text-center text-white font-medium">Videos</span>
                </div>
              </Link>
              
              <Link href="/messaging">
                <div className="flex flex-col items-center" onClick={() => setShowMoreMenu(false)}>
                  <div className={`rounded-full p-3 relative ${location === "/messaging" ? "bg-cyan-500 text-white" : "bg-gray-700 text-gray-200"}`}>
                    <MessageSquare className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </div>
                  <span className="text-xs mt-2 text-center text-white font-medium">Messages</span>
                </div>
              </Link>
              
              <Link href="/dashboard">
                <div className="flex flex-col items-center" onClick={() => setShowMoreMenu(false)}>
                  <div className={`rounded-full p-3 ${location === "/dashboard" ? "bg-cyan-500 text-white" : "bg-gray-700 text-gray-200"}`}>
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  <span className="text-xs mt-2 text-center text-white font-medium">Stats</span>
                </div>
              </Link>
            </div>
            
            <h3 className="text-white text-sm font-bold mb-2 px-2">Train & Develop</h3>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <Link href="/myplayer-star-path">
                <div className="flex flex-col items-center" onClick={() => setShowMoreMenu(false)}>
                  <div className={`rounded-full p-3 ${location === "/myplayer-star-path" ? "bg-cyan-500 text-white" : "bg-gray-700 text-gray-200"}`}>
                    <Star className="h-5 w-5" />
                  </div>
                  <span className="text-xs mt-2 text-center text-white font-medium">Star Path</span>
                </div>
              </Link>
              
              <Link href="/weight-room">
                <div className="flex flex-col items-center" onClick={() => setShowMoreMenu(false)}>
                  <div className={`rounded-full p-3 ${location === "/weight-room" ? "bg-cyan-500 text-white" : "bg-gray-700 text-gray-200"}`}>
                    <Dumbbell className="h-5 w-5" />
                  </div>
                  <span className="text-xs mt-2 text-center text-white font-medium">Weight Room</span>
                </div>
              </Link>
              
              <Link href="/workout-verification">
                <div className="flex flex-col items-center" onClick={() => setShowMoreMenu(false)}>
                  <div className={`rounded-full p-3 ${location === "/workout-verification" ? "bg-cyan-500 text-white" : "bg-gray-700 text-gray-200"}`}>
                    <CalendarCheck className="h-5 w-5" />
                  </div>
                  <span className="text-xs mt-2 text-center text-white font-medium">Verify</span>
                </div>
              </Link>
              
              <Link href="/myplayer-ai-coach">
                <div className="flex flex-col items-center" onClick={() => setShowMoreMenu(false)}>
                  <div className={`rounded-full p-3 ${location === "/myplayer-ai-coach" ? "bg-cyan-500 text-white" : "bg-gray-700 text-gray-200"}`}>
                    <Bot className="h-5 w-5" />
                  </div>
                  <span className="text-xs mt-2 text-center text-white font-medium">AI Coach</span>
                </div>
              </Link>
            </div>
            
            <h3 className="text-white text-sm font-bold mb-2 px-2">Analyze & Improve</h3>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <Link href="/enhanced-gar">
                <div className="flex flex-col items-center" onClick={() => setShowMoreMenu(false)}>
                  <div className={`rounded-full p-3 ${location.startsWith("/enhanced-gar") ? "bg-cyan-500 text-white" : "bg-gray-700 text-gray-200"}`}>
                    <BarChart2 className="h-5 w-5" />
                  </div>
                  <span className="text-xs mt-2 text-center text-white font-medium">GAR Analytics</span>
                </div>
              </Link>
              
              <Link href="/film-comparison">
                <div className="flex flex-col items-center" onClick={() => setShowMoreMenu(false)}>
                  <div className={`rounded-full p-3 ${location.startsWith("/film-comparison") ? "bg-cyan-500 text-white" : "bg-gray-700 text-gray-200"}`}>
                    <GitCompare className="h-5 w-5" />
                  </div>
                  <span className="text-xs mt-2 text-center text-white font-medium">Compare</span>
                </div>
              </Link>
              
              <Link href="/scoutvision-feed">
                <div className="flex flex-col items-center" onClick={() => setShowMoreMenu(false)}>
                  <div className={`rounded-full p-3 ${location === "/scoutvision-feed" ? "bg-cyan-500 text-white" : "bg-gray-700 text-gray-200"}`}>
                    <FileVideo className="h-5 w-5" />
                  </div>
                  <span className="text-xs mt-2 text-center text-white font-medium">ScoutVision</span>
                </div>
              </Link>
              
              <Link href="/athlete-star-profiles">
                <div className="flex flex-col items-center" onClick={() => setShowMoreMenu(false)}>
                  <div className={`rounded-full p-3 ${location === "/athlete-star-profiles" ? "bg-cyan-500 text-white" : "bg-gray-700 text-gray-200"}`}>
                    <Star className="h-5 w-5" />
                  </div>
                  <span className="text-xs mt-2 text-center text-white font-medium">Star Profiles</span>
                </div>
              </Link>
            </div>
            
            <h3 className="text-white text-sm font-bold mb-2 px-2">Connect & Discover</h3>
            <div className="grid grid-cols-4 gap-4">
              <Link href="/sport-recommendations">
                <div className="flex flex-col items-center" onClick={() => setShowMoreMenu(false)}>
                  <div className={`rounded-full p-3 ${location === "/sport-recommendations" ? "bg-cyan-500 text-white" : "bg-gray-700 text-gray-200"}`}>
                    <Search className="h-5 w-5" />
                  </div>
                  <span className="text-xs mt-2 text-center text-white font-medium">Sports</span>
                </div>
              </Link>
              
              <Link href="/coach-connection">
                <div className="flex flex-col items-center" onClick={() => setShowMoreMenu(false)}>
                  <div className={`rounded-full p-3 ${location === "/coach-connection" ? "bg-cyan-500 text-white" : "bg-gray-700 text-gray-200"}`}>
                    <Users className="h-5 w-5" />
                  </div>
                  <span className="text-xs mt-2 text-center text-white font-medium">Coaches</span>
                </div>
              </Link>
              
              <Link href="/ncaa-clearinghouse">
                <div className="flex flex-col items-center" onClick={() => setShowMoreMenu(false)}>
                  <div className={`rounded-full p-3 ${location === "/ncaa-clearinghouse" ? "bg-cyan-500 text-white" : "bg-gray-700 text-gray-200"}`}>
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <span className="text-xs mt-2 text-center text-white font-medium">NCAA</span>
                </div>
              </Link>
              
              <Link href="/combine-tour">
                <div className="flex flex-col items-center" onClick={() => setShowMoreMenu(false)}>
                  <div className={`rounded-full p-3 ${location === "/combine-tour" ? "bg-cyan-500 text-white" : "bg-gray-700 text-gray-200"}`}>
                    <CalendarCheck className="h-5 w-5" />
                  </div>
                  <span className="text-xs mt-2 text-center text-white font-medium">Combines</span>
                </div>
              </Link>
            </div>
          </div>
          
          {/* Admin Panel - Only visible for admins */}
          {isAdmin && (
            <div className="mb-4">
              <h3 className="text-white text-sm font-bold mb-2 px-2 flex items-center">
                <ShieldCheck className="h-4 w-4 mr-1 text-cyan-400" /> Admin Panel
              </h3>
              <div className="grid grid-cols-4 gap-4">
                <Link href="/admin-dashboard">
                  <div className="flex flex-col items-center" onClick={() => setShowMoreMenu(false)}>
                    <div className={`rounded-full p-3 ${location === "/admin-dashboard" ? "bg-cyan-500 text-white" : "bg-gray-700 text-gray-200"}`}>
                      <BarChart3 className="h-5 w-5" />
                    </div>
                    <span className="text-xs mt-2 text-center text-white font-medium">Dashboard</span>
                  </div>
                </Link>
                
                <Link href="/admin/content-manager">
                  <div className="flex flex-col items-center" onClick={() => setShowMoreMenu(false)}>
                    <div className={`rounded-full p-3 ${location === "/admin/content-manager" ? "bg-cyan-500 text-white" : "bg-gray-700 text-gray-200"}`}>
                      <Layers className="h-5 w-5" />
                    </div>
                    <span className="text-xs mt-2 text-center text-white font-medium">Content</span>
                  </div>
                </Link>
                
                <Link href="/admin/analytics-dashboard">
                  <div className="flex flex-col items-center" onClick={() => setShowMoreMenu(false)}>
                    <div className={`rounded-full p-3 ${location === "/admin/analytics-dashboard" ? "bg-cyan-500 text-white" : "bg-gray-700 text-gray-200"}`}>
                      <BarChart2 className="h-5 w-5" />
                    </div>
                    <span className="text-xs mt-2 text-center text-white font-medium">Analytics</span>
                  </div>
                </Link>
                
                <Link href="/cms">
                  <div className="flex flex-col items-center" onClick={() => setShowMoreMenu(false)}>
                    <div className={`rounded-full p-3 ${location === "/cms" ? "bg-cyan-500 text-white" : "bg-gray-700 text-gray-200"}`}>
                      <ClipboardList className="h-5 w-5" />
                    </div>
                    <span className="text-xs mt-2 text-center text-white font-medium">CMS</span>
                  </div>
                </Link>
              </div>
            </div>
          )}
          
          {/* Close button at bottom */}
          <div className="mt-4 flex justify-center">
            <button 
              onClick={() => setShowMoreMenu(false)}
              className="text-xs text-gray-300 flex items-center gap-1 py-2 px-4 rounded-full bg-gray-700 hover:bg-gray-600"
            >
              <X className="h-3 w-3" /> Close Menu
            </button>
          </div>
        </div>
      )}
    </>
  );
}
