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
  Dumbbell
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

export default function MobileNav() {
  const [location] = useLocation();
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const { user } = useAuth();

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
            <span className="text-xs mt-1">Home</span>
          </a>
        </Link>
        
        <Link href="/myplayer-star-path">
          <a className={`flex flex-col items-center ${location === "/myplayer-star-path" ? "text-cyan-400" : "text-gray-400"}`}>
            <Award className="h-5 w-5" />
            <span className="text-xs mt-1">Star Path</span>
          </a>
        </Link>
        
        <Link href="/upload-video">
          <a className="flex flex-col items-center">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full p-3 -mt-6 shadow-lg shadow-cyan-500/20">
              <Plus className="h-5 w-5 text-white" />
            </div>
            <span className="text-xs mt-1 text-gray-400">Upload</span>
          </a>
        </Link>
        
        <Link href="/weight-room">
          <a className={`flex flex-col items-center ${location.startsWith("/weight-room") ? "text-cyan-400" : "text-gray-400"}`}>
            <Dumbbell className="h-5 w-5" />
            <span className="text-xs mt-1">Train</span>
          </a>
        </Link>
        
        <button 
          onClick={toggleMoreMenu}
          className="flex flex-col items-center text-gray-400 focus:outline-none"
        >
          {showMoreMenu ? (
            <X className="h-5 w-5 text-cyan-400" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
          <span className="text-xs mt-1">More</span>
        </button>
      </nav>

      {/* Expanded More Menu */}
      {showMoreMenu && (
        <div className="md:hidden fixed bottom-16 inset-x-0 bg-gray-900 border-t border-gray-800 p-4 z-10 animate-in slide-in-from-bottom duration-200">
          <div className="grid grid-cols-4 gap-6">
            <Link href="/profile">
              <a className="flex flex-col items-center" onClick={() => setShowMoreMenu(false)}>
                <div className={`rounded-full p-3 ${location === "/profile" ? "bg-cyan-400/20 text-cyan-400" : "bg-gray-800 text-gray-300"}`}>
                  <User className="h-5 w-5" />
                </div>
                <span className="text-xs mt-2 text-center text-gray-300">Profile</span>
              </a>
            </Link>
            
            <Link href="/video-analysis">
              <a className="flex flex-col items-center" onClick={() => setShowMoreMenu(false)}>
                <div className={`rounded-full p-3 ${location === "/video-analysis" ? "bg-cyan-400/20 text-cyan-400" : "bg-gray-800 text-gray-300"}`}>
                  <FileVideo className="h-5 w-5" />
                </div>
                <span className="text-xs mt-2 text-center text-gray-300">Videos</span>
              </a>
            </Link>
            
            <Link href="/messaging">
              <a className="flex flex-col items-center" onClick={() => setShowMoreMenu(false)}>
                <div className={`rounded-full p-3 ${location === "/messaging" ? "bg-cyan-400/20 text-cyan-400" : "bg-gray-800 text-gray-300"}`}>
                  <MessageSquare className="h-5 w-5" />
                </div>
                <span className="text-xs mt-2 text-center text-gray-300">Messages</span>
              </a>
            </Link>
            
            <Link href="/sport-recommendations">
              <a className="flex flex-col items-center" onClick={() => setShowMoreMenu(false)}>
                <div className={`rounded-full p-3 ${location === "/sport-recommendations" ? "bg-cyan-400/20 text-cyan-400" : "bg-gray-800 text-gray-300"}`}>
                  <Search className="h-5 w-5" />
                </div>
                <span className="text-xs mt-2 text-center text-gray-300">Discover</span>
              </a>
            </Link>
            
            <Link href="/dashboard">
              <a className="flex flex-col items-center" onClick={() => setShowMoreMenu(false)}>
                <div className={`rounded-full p-3 ${location === "/dashboard" ? "bg-cyan-400/20 text-cyan-400" : "bg-gray-800 text-gray-300"}`}>
                  <BarChart3 className="h-5 w-5" />
                </div>
                <span className="text-xs mt-2 text-center text-gray-300">Stats</span>
              </a>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
