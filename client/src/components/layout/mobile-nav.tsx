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
  BookOpen
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useLayout } from "@/contexts/layout-context";
import { AccessibilityControls } from "@/components/accessibility/accessibility-controls";

export default function MobileNav() {
  const [location] = useLocation();
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const { user } = useAuth();
  const { focusMode } = useLayout();

  const toggleMoreMenu = () => {
    setShowMoreMenu(prev => !prev);
  };

  return (
    <>
      {/* Main Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-gray-950 border-t border-gray-800 flex justify-around items-center p-3 z-20">
        <Link href="/">
          <a className={`flex flex-col items-center ${location === "/" ? "text-cyan-400" : "text-gray-400"}`}>
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1 font-medium">Home</span>
          </a>
        </Link>
        
        <Link href="/myplayer-star-path">
          <a className={`flex flex-col items-center ${location === "/myplayer-star-path" ? "text-cyan-400" : "text-gray-400"}`}>
            <Award className="h-5 w-5" />
            <span className="text-xs mt-1 font-medium">Star Path</span>
          </a>
        </Link>
        
        <Link href="/upload-video">
          <a className="flex flex-col items-center">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full p-3 -mt-6 shadow-lg shadow-cyan-500/20">
              <Plus className="h-5 w-5 text-white" />
            </div>
            <span className="text-xs mt-1 text-gray-400 font-medium">Upload</span>
          </a>
        </Link>
        
        <Link href="/weight-room">
          <a className={`flex flex-col items-center ${location.startsWith("/weight-room") ? "text-cyan-400" : "text-gray-400"}`}>
            <Dumbbell className="h-5 w-5" />
            <span className="text-xs mt-1 font-medium">Train</span>
          </a>
        </Link>
        
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
        <div className="md:hidden fixed bottom-16 inset-x-0 bg-gray-800 border-t border-gray-700 p-4 z-10 shadow-lg animate-in slide-in-from-bottom duration-200">
          {/* Accessibility Controls Row */}
          <div className="flex justify-end mb-4 px-2">
            <AccessibilityControls />
          </div>
          
          {/* Menu Categories */}
          <div className="mb-4">
            <h3 className="text-white text-sm font-bold mb-2 px-2">My Go4It Sports</h3>
            <div className="grid grid-cols-4 gap-2 mb-6">
              <Link href="/profile">
                <a className="flex flex-col items-center" onClick={() => setShowMoreMenu(false)}>
                  <div className={`rounded-full p-3 ${location === "/profile" ? "bg-cyan-500 text-white" : "bg-gray-700 text-gray-200"}`}>
                    <User className="h-5 w-5" />
                  </div>
                  <span className="text-xs mt-2 text-center text-white font-medium">Profile</span>
                </a>
              </Link>
              
              <Link href="/video-analysis">
                <a className="flex flex-col items-center" onClick={() => setShowMoreMenu(false)}>
                  <div className={`rounded-full p-3 ${location === "/video-analysis" ? "bg-cyan-500 text-white" : "bg-gray-700 text-gray-200"}`}>
                    <FileVideo className="h-5 w-5" />
                  </div>
                  <span className="text-xs mt-2 text-center text-white font-medium">Videos</span>
                </a>
              </Link>
              
              <Link href="/messaging">
                <a className="flex flex-col items-center" onClick={() => setShowMoreMenu(false)}>
                  <div className={`rounded-full p-3 ${location === "/messaging" ? "bg-cyan-500 text-white" : "bg-gray-700 text-gray-200"}`}>
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <span className="text-xs mt-2 text-center text-white font-medium">Messages</span>
                </a>
              </Link>
              
              <Link href="/dashboard">
                <a className="flex flex-col items-center" onClick={() => setShowMoreMenu(false)}>
                  <div className={`rounded-full p-3 ${location === "/dashboard" ? "bg-cyan-500 text-white" : "bg-gray-700 text-gray-200"}`}>
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  <span className="text-xs mt-2 text-center text-white font-medium">Stats</span>
                </a>
              </Link>
            </div>
            
            <h3 className="text-white text-sm font-bold mb-2 px-2">Discover</h3>
            <div className="grid grid-cols-4 gap-2">
              <Link href="/sport-recommendations">
                <a className="flex flex-col items-center" onClick={() => setShowMoreMenu(false)}>
                  <div className={`rounded-full p-3 ${location === "/sport-recommendations" ? "bg-cyan-500 text-white" : "bg-gray-700 text-gray-200"}`}>
                    <Search className="h-5 w-5" />
                  </div>
                  <span className="text-xs mt-2 text-center text-white font-medium">Sports</span>
                </a>
              </Link>
              
              <Link href="/coach-connection">
                <a className="flex flex-col items-center" onClick={() => setShowMoreMenu(false)}>
                  <div className={`rounded-full p-3 ${location === "/coach-connection" ? "bg-cyan-500 text-white" : "bg-gray-700 text-gray-200"}`}>
                    <Users className="h-5 w-5" />
                  </div>
                  <span className="text-xs mt-2 text-center text-white font-medium">Coaches</span>
                </a>
              </Link>
              
              <Link href="/ncaa-clearinghouse">
                <a className="flex flex-col items-center" onClick={() => setShowMoreMenu(false)}>
                  <div className={`rounded-full p-3 ${location === "/ncaa-clearinghouse" ? "bg-cyan-500 text-white" : "bg-gray-700 text-gray-200"}`}>
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <span className="text-xs mt-2 text-center text-white font-medium">NCAA</span>
                </a>
              </Link>
            </div>
          </div>
          
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
