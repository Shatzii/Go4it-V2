import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/auth-context";
import { useMessaging } from "@/contexts/messaging-context";
import MobileNav from "./mobile-nav";
import {
  Home,
  User,
  FileVideo,
  Award,
  Users,
  BookOpen,
  Menu,
  LogOut,
  LogIn,
  Plus,
  ChartBarStacked,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const { unreadCount } = useMessaging();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when location changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Get the user's initials for the avatar fallback
  const getUserInitials = () => {
    if (!user || !user.name) return "U";
    return user.name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar Navigation (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-neutral dark:bg-neutral-dark text-white">
        <div className="p-4 border-b border-neutral-light border-opacity-20">
          <img 
            src="/assets/IMG_3534.jpeg" 
            alt="Go4It Sports Logo" 
            className="h-12"
          />
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <Link href="/">
                <a className={`flex items-center p-2 rounded-lg ${location === "/" ? "bg-primary text-white" : "hover:bg-primary hover:bg-opacity-30 text-white"}`}>
                  <Home className="h-5 w-5 mr-3" />
                  Home
                </a>
              </Link>
            </li>

            <li>
              <Link href="/dashboard">
                <a className={`flex items-center p-2 rounded-lg ${location === "/dashboard" ? "bg-primary text-white" : "hover:bg-primary hover:bg-opacity-30 text-white"}`}>
                  <ChartBarStacked className="h-5 w-5 mr-3" />
                  Dashboard
                </a>
              </Link>
            </li>

            <li>
              <Link href="/profile">
                <a className={`flex items-center p-2 rounded-lg ${location === "/profile" ? "bg-primary text-white" : "hover:bg-primary hover:bg-opacity-30 text-white"}`}>
                  <User className="h-5 w-5 mr-3" />
                  My Profile
                </a>
              </Link>
            </li>

            <li>
              <Link href="/video-analysis">
                <a className={`flex items-center p-2 rounded-lg ${location === "/video-analysis" ? "bg-primary text-white" : "hover:bg-primary hover:bg-opacity-30 text-white"}`}>
                  <FileVideo className="h-5 w-5 mr-3" />
                  Video Analysis
                </a>
              </Link>
            </li>

            <li>
              <Link href="/sport-recommendations">
                <a className={`flex items-center p-2 rounded-lg ${location === "/sport-recommendations" ? "bg-primary text-white" : "hover:bg-primary hover:bg-opacity-30 text-white"}`}>
                  <Award className="h-5 w-5 mr-3" />
                  Sport Recommendations
                </a>
              </Link>
            </li>

            <li>
              <Link href="/coach-connection">
                <a className={`flex items-center p-2 rounded-lg ${location === "/coach-connection" ? "bg-primary text-white" : "hover:bg-primary hover:bg-opacity-30 text-white"}`}>
                  <Users className="h-5 w-5 mr-3" />
                  Coach Connection
                </a>
              </Link>
            </li>

            <li>
              <Link href="/ncaa-clearinghouse">
                <a className={`flex items-center p-2 rounded-lg ${location === "/ncaa-clearinghouse" ? "bg-primary text-white" : "hover:bg-primary hover:bg-opacity-30 text-white"}`}>
                  <BookOpen className="h-5 w-5 mr-3" />
                  NCAA Clearinghouse
                </a>
              </Link>
            </li>

            <li>
              <Link href="/messaging">
                <a className={`flex items-center p-2 rounded-lg ${location === "/messaging" ? "bg-primary text-white" : "hover:bg-primary hover:bg-opacity-30 text-white"}`}>
                  <div className="relative mr-3">
                    <MessageSquare className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </div>
                  Messaging
                </a>
              </Link>
            </li>

            {/* Admin section - only visible for admin users */}
            {user && user.role === "admin" && (
              <li>
                <Link href="/admin-dashboard">
                  <a className={`flex items-center p-2 rounded-lg ${location === "/admin-dashboard" ? "bg-primary text-white" : "hover:bg-primary hover:bg-opacity-30 text-white"}`}>
                    <ChartBarStacked className="h-5 w-5 mr-3" />
                    Admin Dashboard
                  </a>
                </Link>
              </li>
            )}
          </ul>
        </nav>

        <div className="p-4 border-t border-neutral-light border-opacity-20">
          {user ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={user.profileImage} alt={user.name} />
                  <AvatarFallback>{getUserInitials()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{user.name}</p>
                  <p className="text-xs text-gray-300 capitalize">{user.role}</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                className="text-gray-300 hover:text-white hover:bg-gray-700"
                onClick={logout}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <a className="flex items-center p-2 rounded-lg hover:bg-primary hover:bg-opacity-30 text-white">
                <LogIn className="h-5 w-5 mr-3" />
                Login
              </a>
            </Link>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Mobile Header */}
        <header className="md:hidden bg-neutral text-white p-4 flex items-center justify-between">
          <h1 className="font-heading font-bold text-xl flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-secondary" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            GoForIt AI
          </h1>
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </header>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-neutral">
            <div className="p-4 flex justify-end">
              <Button 
                variant="ghost" 
                size="icon"
                className="text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </div>
            <nav className="p-4">
              <ul className="space-y-4">
                <li>
                  <Link href="/">
                    <a className="flex items-center p-2 rounded-lg text-white text-lg">
                      <Home className="h-6 w-6 mr-3" />
                      Home
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard">
                    <a className="flex items-center p-2 rounded-lg text-white text-lg">
                      <ChartBarStacked className="h-6 w-6 mr-3" />
                      Dashboard
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/profile">
                    <a className="flex items-center p-2 rounded-lg text-white text-lg">
                      <User className="h-6 w-6 mr-3" />
                      My Profile
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/video-analysis">
                    <a className="flex items-center p-2 rounded-lg text-white text-lg">
                      <FileVideo className="h-6 w-6 mr-3" />
                      Video Analysis
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/sport-recommendations">
                    <a className="flex items-center p-2 rounded-lg text-white text-lg">
                      <Award className="h-6 w-6 mr-3" />
                      Sport Recommendations
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/coach-connection">
                    <a className="flex items-center p-2 rounded-lg text-white text-lg">
                      <Users className="h-6 w-6 mr-3" />
                      Coach Connection
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/ncaa-clearinghouse">
                    <a className="flex items-center p-2 rounded-lg text-white text-lg">
                      <BookOpen className="h-6 w-6 mr-3" />
                      NCAA Clearinghouse
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/messaging">
                    <a className="flex items-center p-2 rounded-lg text-white text-lg">
                      <div className="relative mr-3">
                        <MessageSquare className="h-6 w-6" />
                        {unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                            {unreadCount > 99 ? '99+' : unreadCount}
                          </span>
                        )}
                      </div>
                      Messaging
                    </a>
                  </Link>
                </li>
                {user && user.role === "admin" && (
                  <li>
                    <Link href="/admin-dashboard">
                      <a className="flex items-center p-2 rounded-lg text-white text-lg">
                        <ChartBarStacked className="h-6 w-6 mr-3" />
                        Admin Dashboard
                      </a>
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
            <div className="absolute bottom-0 inset-x-0 p-4 border-t border-neutral-light border-opacity-20">
              {user ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={user.profileImage} alt={user.name} />
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm text-white">{user.name}</p>
                      <p className="text-xs text-gray-300 capitalize">{user.role}</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-gray-300 hover:text-white"
                    onClick={logout}
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                </div>
              ) : (
                <Link href="/login">
                  <a className="flex items-center p-2 rounded-lg text-white">
                    <LogIn className="h-5 w-5 mr-3" />
                    Login
                  </a>
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-4 md:p-8">
          {children}
        </div>

        {/* Mobile Navigation */}
        <MobileNav />
      </main>
    </div>
  );
}
