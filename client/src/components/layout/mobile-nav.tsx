import { Link, useLocation } from "wouter";
import { Home, FileVideo, Plus, User, Menu } from "lucide-react";

export default function MobileNav() {
  const [location] = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 flex justify-around items-center p-3 z-10">
      <Link href="/">
        <a className={`flex flex-col items-center ${location === "/" ? "text-primary" : "text-gray-500"}`}>
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1">Home</span>
        </a>
      </Link>
      
      <Link href="/video-analysis">
        <a className={`flex flex-col items-center ${location === "/video-analysis" ? "text-primary" : "text-gray-500"}`}>
          <FileVideo className="h-6 w-6" />
          <span className="text-xs mt-1">Videos</span>
        </a>
      </Link>
      
      <Link href="/upload-video">
        <a className="flex flex-col items-center">
          <div className="bg-secondary rounded-full p-2">
            <Plus className="h-6 w-6 text-white" />
          </div>
          <span className="text-xs mt-1 text-gray-500">Upload</span>
        </a>
      </Link>
      
      <Link href="/profile">
        <a className={`flex flex-col items-center ${location === "/profile" ? "text-primary" : "text-gray-500"}`}>
          <User className="h-6 w-6" />
          <span className="text-xs mt-1">Profile</span>
        </a>
      </Link>
      
      <Link href="#more">
        <a className="flex flex-col items-center text-gray-500">
          <Menu className="h-6 w-6" />
          <span className="text-xs mt-1">More</span>
        </a>
      </Link>
    </nav>
  );
}
