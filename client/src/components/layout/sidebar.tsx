import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/auth-context";
import { useMessaging } from "@/contexts/messaging-context";
import { useLayout } from "@/contexts/layout-context";
import MobileNav from "./mobile-nav";
import { motion, AnimatePresence } from "framer-motion";
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
  MessageSquare,
  Maximize,
  Minimize,
  GitCompare,
  Film,
  Video,
  CalendarCheck,
  UserCog,
  Dumbbell,
  Sparkles,
  Bot
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
  const { isFullscreen, toggleFullscreen } = useLayout();
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

  // Animation variants for transitions
  const sidebarVariants = {
    open: { 
      width: "16rem", // 256px (w-64)
      opacity: 1,
      x: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        duration: 0.3
      }
    },
    closed: { 
      width: 0,
      opacity: 0, 
      x: "-100%", 
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        duration: 0.3
      }
    }
  };

  const mobileMenuVariants = {
    open: { 
      x: 0,
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        duration: 0.3, 
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    },
    closed: { 
      x: "-100%", 
      opacity: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        duration: 0.3,
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };

  const menuItemVariants = {
    open: { 
      x: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 500, 
        damping: 30 
      }
    },
    closed: { 
      x: -20, 
      opacity: 0,
      transition: { 
        type: "spring", 
        stiffness: 500, 
        damping: 30 
      }
    }
  };

  const fullscreenButtonVariants = {
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 500, 
        damping: 30 
      }
    },
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      transition: { 
        type: "spring", 
        stiffness: 500, 
        damping: 30 
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar Navigation (Desktop) */}
      <AnimatePresence>
        {!isFullscreen && (
          <motion.aside 
            className="hidden md:flex flex-col w-64 bg-neutral dark:bg-neutral-dark text-white overflow-hidden"
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
          >
            <div className="p-4 border-b border-neutral-light border-opacity-20 flex items-center justify-between">
              <motion.img 
                src="/assets/IMG_3534.jpeg" 
                alt="Go4It Sports Logo" 
                className="h-12 mix-blend-screen"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.2 }}
              >
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-white"
                  onClick={toggleFullscreen}
                  title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                >
                  <Maximize className="h-5 w-5" />
                </Button>
              </motion.div>
            </div>

            <nav className="flex-1 p-4">
              <motion.ul 
                className="space-y-2"
                initial="closed"
                animate="open"
                variants={{
                  open: {
                    transition: { staggerChildren: 0.07, delayChildren: 0.2 }
                  },
                  closed: {
                    transition: { staggerChildren: 0.05, staggerDirection: -1 }
                  }
                }}
              >
                <motion.li variants={menuItemVariants}>
                  <Link href="/">
                    <a className={`flex items-center p-2 rounded-lg sidebar-link ${location === "/" ? "active bg-primary text-white" : "hover:bg-primary hover:bg-opacity-30 text-white"}`}>
                      <Home className="h-5 w-5 mr-3" />
                      Home
                    </a>
                  </Link>
                </motion.li>

                <motion.li variants={menuItemVariants}>
                  <Link href="/dashboard">
                    <a className={`flex items-center p-2 rounded-lg sidebar-link ${location === "/dashboard" ? "active bg-primary text-white" : "hover:bg-primary hover:bg-opacity-30 text-white"}`}>
                      <ChartBarStacked className="h-5 w-5 mr-3" />
                      Dashboard
                    </a>
                  </Link>
                </motion.li>

                <motion.li variants={menuItemVariants}>
                  <Link href="/profile">
                    <a className={`flex items-center p-2 rounded-lg sidebar-link ${location === "/profile" ? "active bg-primary text-white" : "hover:bg-primary hover:bg-opacity-30 text-white"}`}>
                      <User className="h-5 w-5 mr-3" />
                      My Profile
                    </a>
                  </Link>
                </motion.li>

                <motion.li variants={menuItemVariants}>
                  <Link href="/video-analysis">
                    <a className={`flex items-center p-2 rounded-lg sidebar-link ${location === "/video-analysis" ? "active bg-primary text-white" : "hover:bg-primary hover:bg-opacity-30 text-white"}`}>
                      <FileVideo className="h-5 w-5 mr-3" />
                      Video Analysis
                    </a>
                  </Link>
                </motion.li>

                <motion.li variants={menuItemVariants}>
                  <Link href="/film-comparison">
                    <a className={`flex items-center p-2 rounded-lg sidebar-link ${location === "/film-comparison" || location.startsWith("/film-comparison-") ? "active bg-primary text-white" : "hover:bg-primary hover:bg-opacity-30 text-white"}`}>
                      <GitCompare className="h-5 w-5 mr-3" />
                      Film Comparison
                    </a>
                  </Link>
                </motion.li>

                <motion.li variants={menuItemVariants}>
                  <Link href="/sport-recommendations">
                    <a className={`flex items-center p-2 rounded-lg sidebar-link ${location === "/sport-recommendations" ? "active bg-primary text-white" : "hover:bg-primary hover:bg-opacity-30 text-white"}`}>
                      <Award className="h-5 w-5 mr-3" />
                      Sport Recommendations
                    </a>
                  </Link>
                </motion.li>

                <motion.li variants={menuItemVariants}>
                  <Link href="/coach-connection">
                    <a className={`flex items-center p-2 rounded-lg sidebar-link ${location === "/coach-connection" ? "active bg-primary text-white" : "hover:bg-primary hover:bg-opacity-30 text-white"}`}>
                      <Users className="h-5 w-5 mr-3" />
                      Coach Connection
                    </a>
                  </Link>
                </motion.li>

                <motion.li variants={menuItemVariants}>
                  <Link href="/ncaa-clearinghouse">
                    <a className={`flex items-center p-2 rounded-lg sidebar-link ${location === "/ncaa-clearinghouse" ? "active bg-primary text-white" : "hover:bg-primary hover:bg-opacity-30 text-white"}`}>
                      <BookOpen className="h-5 w-5 mr-3" />
                      NCAA Clearinghouse
                    </a>
                  </Link>
                </motion.li>

                <motion.li variants={menuItemVariants}>
                  <Link href="/messaging">
                    <a className={`flex items-center p-2 rounded-lg sidebar-link ${location === "/messaging" ? "active bg-primary text-white" : "hover:bg-primary hover:bg-opacity-30 text-white"}`}>
                      <div className="relative mr-3">
                        <MessageSquare className="h-5 w-5" />
                        {unreadCount > 0 && (
                          <motion.span 
                            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          >
                            {unreadCount > 99 ? '99+' : unreadCount}
                          </motion.span>
                        )}
                      </div>
                      Messaging
                    </a>
                  </Link>
                </motion.li>
                
                <motion.li variants={menuItemVariants}>
                  <Link href="/scoutvision-feed">
                    <a className={`flex items-center p-2 rounded-lg sidebar-link ${location === "/scoutvision-feed" ? "active bg-primary text-white" : "hover:bg-primary hover:bg-opacity-30 text-white"}`}>
                      <Video className="h-5 w-5 mr-3" />
                      ScoutVision Feed
                    </a>
                  </Link>
                </motion.li>
                
                <motion.li variants={menuItemVariants}>
                  <Link href="/coach-portal">
                    <a className={`flex items-center p-2 rounded-lg sidebar-link ${location === "/coach-portal" ? "active bg-primary text-white" : "hover:bg-primary hover:bg-opacity-30 text-white"}`}>
                      <UserCog className="h-5 w-5 mr-3" />
                      Coach Portal
                    </a>
                  </Link>
                </motion.li>
                
                <motion.li variants={menuItemVariants}>
                  <Link href="/combine-tour">
                    <a className={`flex items-center p-2 rounded-lg sidebar-link ${location === "/combine-tour" ? "active bg-primary text-white" : "hover:bg-primary hover:bg-opacity-30 text-white"}`}>
                      <CalendarCheck className="h-5 w-5 mr-3" />
                      Combine Tour
                    </a>
                  </Link>
                </motion.li>
                
                <motion.li variants={menuItemVariants}>
                  <Link href="/myplayer-xp">
                    <a className={`flex items-center p-2 rounded-lg sidebar-link ${location === "/myplayer-xp" ? "active bg-primary text-white" : "hover:bg-primary hover:bg-opacity-30 text-white"}`}>
                      <Sparkles className="h-5 w-5 mr-3" />
                      MyPlayer XP
                    </a>
                  </Link>
                </motion.li>
                
                <motion.li variants={menuItemVariants}>
                  <Link href="/weight-room">
                    <a className={`flex items-center p-2 rounded-lg sidebar-link ${location === "/weight-room" ? "active bg-primary text-white" : "hover:bg-primary hover:bg-opacity-30 text-white"}`}>
                      <Dumbbell className="h-5 w-5 mr-3" />
                      Weight Room
                    </a>
                  </Link>
                </motion.li>
                
                <motion.li variants={menuItemVariants}>
                  <Link href="/myplayer-star-path">
                    <a className={`flex items-center p-2 rounded-lg sidebar-link ${location === "/myplayer-star-path" ? "active bg-primary text-white" : "hover:bg-primary hover:bg-opacity-30 text-white"}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0.5">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      Star Path
                    </a>
                  </Link>
                </motion.li>
                
                <motion.li variants={menuItemVariants}>
                  <Link href="/myplayer-ai-coach">
                    <a className={`flex items-center p-2 rounded-lg sidebar-link ${location === "/myplayer-ai-coach" ? "active bg-primary text-white" : "hover:bg-primary hover:bg-opacity-30 text-white"}`}>
                      <Bot className="h-5 w-5 mr-3" />
                      AI Coach
                    </a>
                  </Link>
                </motion.li>
                
                <motion.li variants={menuItemVariants}>
                  <Link href="/nextup-spotlight">
                    <a className={`flex items-center p-2 rounded-lg sidebar-link ${location === "/nextup-spotlight" ? "active bg-primary text-white" : "hover:bg-primary hover:bg-opacity-30 text-white"}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 7L12 3L4 7M20 7L12 11M20 7V17L12 21M12 11L4 7M12 11V21M4 7V17L12 21" />
                      </svg>
                      NextUp Spotlight
                    </a>
                  </Link>
                </motion.li>

                {/* Admin section - only visible for admin users */}
                {user && user.role === "admin" && (
                  <motion.li variants={menuItemVariants}>
                    <Link href="/admin-dashboard">
                      <a className={`flex items-center p-2 rounded-lg sidebar-link ${location === "/admin-dashboard" ? "active bg-primary text-white" : "hover:bg-primary hover:bg-opacity-30 text-white"}`}>
                        <ChartBarStacked className="h-5 w-5 mr-3" />
                        Admin Dashboard
                      </a>
                    </Link>
                  </motion.li>
                )}
              </motion.ul>
            </nav>

            <motion.div 
              className="p-4 border-t border-neutral-light border-opacity-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
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
            </motion.div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.main 
        className="flex-1 overflow-y-auto"
        initial={{ x: 0 }}
        animate={{ 
          x: 0,
          transition: { duration: 0.3, type: "spring", stiffness: 300, damping: 30 }
        }}
      >
        {/* Mobile Header */}
        <header className="md:hidden bg-neutral text-white p-4 flex items-center justify-between">
          <h1 className="font-heading font-bold text-xl flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-secondary" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            GoForIt AI
          </h1>
          <div className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="ghost" 
                size="icon"
                className="text-white mr-2"
                onClick={toggleFullscreen}
                title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              >
                {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="ghost" 
                size="icon"
                className="text-white"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </motion.div>
          </div>
        </header>

        {/* Mobile Menu with AnimatePresence */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              className="md:hidden fixed inset-0 z-50 bg-neutral overflow-hidden"
              initial="closed"
              animate="open"
              exit="closed"
              variants={mobileMenuVariants}
            >
              <motion.div 
                className="p-4 flex justify-end"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
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
              </motion.div>
              <nav className="p-4">
                <motion.ul className="space-y-4">
                  <motion.li variants={menuItemVariants}>
                    <Link href="/">
                      <a className={`flex items-center p-2 rounded-lg sidebar-link text-white text-lg ${location === "/" ? "active bg-primary" : ""}`}>
                        <Home className="h-6 w-6 mr-3" />
                        Home
                      </a>
                    </Link>
                  </motion.li>
                  <motion.li variants={menuItemVariants}>
                    <Link href="/dashboard">
                      <a className="flex items-center p-2 rounded-lg text-white text-lg">
                        <ChartBarStacked className="h-6 w-6 mr-3" />
                        Dashboard
                      </a>
                    </Link>
                  </motion.li>
                  <motion.li variants={menuItemVariants}>
                    <Link href="/profile">
                      <a className="flex items-center p-2 rounded-lg text-white text-lg">
                        <User className="h-6 w-6 mr-3" />
                        My Profile
                      </a>
                    </Link>
                  </motion.li>
                  <motion.li variants={menuItemVariants}>
                    <Link href="/video-analysis">
                      <a className="flex items-center p-2 rounded-lg text-white text-lg">
                        <FileVideo className="h-6 w-6 mr-3" />
                        Video Analysis
                      </a>
                    </Link>
                  </motion.li>
                  <motion.li variants={menuItemVariants}>
                    <Link href="/film-comparison">
                      <a className={`flex items-center p-2 rounded-lg text-white text-lg ${location === "/film-comparison" || location.startsWith("/film-comparison-") ? "active bg-primary" : ""}`}>
                        <GitCompare className="h-6 w-6 mr-3" />
                        Film Comparison
                      </a>
                    </Link>
                  </motion.li>
                  <motion.li variants={menuItemVariants}>
                    <Link href="/sport-recommendations">
                      <a className="flex items-center p-2 rounded-lg text-white text-lg">
                        <Award className="h-6 w-6 mr-3" />
                        Sport Recommendations
                      </a>
                    </Link>
                  </motion.li>
                  <motion.li variants={menuItemVariants}>
                    <Link href="/coach-connection">
                      <a className="flex items-center p-2 rounded-lg text-white text-lg">
                        <Users className="h-6 w-6 mr-3" />
                        Coach Connection
                      </a>
                    </Link>
                  </motion.li>
                  <motion.li variants={menuItemVariants}>
                    <Link href="/ncaa-clearinghouse">
                      <a className="flex items-center p-2 rounded-lg text-white text-lg">
                        <BookOpen className="h-6 w-6 mr-3" />
                        NCAA Clearinghouse
                      </a>
                    </Link>
                  </motion.li>
                  <motion.li variants={menuItemVariants}>
                    <Link href="/messaging">
                      <a className="flex items-center p-2 rounded-lg text-white text-lg">
                        <div className="relative mr-3">
                          <MessageSquare className="h-6 w-6" />
                          {unreadCount > 0 && (
                            <motion.span 
                              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 500, damping: 30, delay: 0.3 }}
                            >
                              {unreadCount > 99 ? '99+' : unreadCount}
                            </motion.span>
                          )}
                        </div>
                        Messaging
                      </a>
                    </Link>
                  </motion.li>

                  <motion.li variants={menuItemVariants}>
                    <Link href="/scoutvision-feed">
                      <a className={`flex items-center p-2 rounded-lg text-white text-lg ${location === "/scoutvision-feed" ? "active bg-primary" : ""}`}>
                        <Video className="h-6 w-6 mr-3" />
                        ScoutVision Feed
                      </a>
                    </Link>
                  </motion.li>
                  
                  <motion.li variants={menuItemVariants}>
                    <Link href="/coach-portal">
                      <a className={`flex items-center p-2 rounded-lg text-white text-lg ${location === "/coach-portal" ? "active bg-primary" : ""}`}>
                        <UserCog className="h-6 w-6 mr-3" />
                        Coach Portal
                      </a>
                    </Link>
                  </motion.li>
                  
                  <motion.li variants={menuItemVariants}>
                    <Link href="/combine-tour">
                      <a className={`flex items-center p-2 rounded-lg text-white text-lg ${location === "/combine-tour" ? "active bg-primary" : ""}`}>
                        <CalendarCheck className="h-6 w-6 mr-3" />
                        Combine Tour
                      </a>
                    </Link>
                  </motion.li>
                  
                  <motion.li variants={menuItemVariants}>
                    <Link href="/myplayer-xp">
                      <a className={`flex items-center p-2 rounded-lg text-white text-lg ${location === "/myplayer-xp" ? "active bg-primary" : ""}`}>
                        <Sparkles className="h-6 w-6 mr-3" />
                        MyPlayer XP
                      </a>
                    </Link>
                  </motion.li>
                  
                  <motion.li variants={menuItemVariants}>
                    <Link href="/weight-room">
                      <a className={`flex items-center p-2 rounded-lg text-white text-lg ${location === "/weight-room" ? "active bg-primary" : ""}`}>
                        <Dumbbell className="h-6 w-6 mr-3" />
                        Weight Room
                      </a>
                    </Link>
                  </motion.li>
                  
                  <motion.li variants={menuItemVariants}>
                    <Link href="/myplayer-star-path">
                      <a className={`flex items-center p-2 rounded-lg text-white text-lg ${location === "/myplayer-star-path" ? "active bg-primary" : ""}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0.5">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        Star Path
                      </a>
                    </Link>
                  </motion.li>
                  
                  <motion.li variants={menuItemVariants}>
                    <Link href="/myplayer-ai-coach">
                      <a className={`flex items-center p-2 rounded-lg text-white text-lg ${location === "/myplayer-ai-coach" ? "active bg-primary" : ""}`}>
                        <Bot className="h-6 w-6 mr-3" />
                        AI Coach
                      </a>
                    </Link>
                  </motion.li>
                  
                  <motion.li variants={menuItemVariants}>
                    <Link href="/nextup-spotlight">
                      <a className={`flex items-center p-2 rounded-lg text-white text-lg ${location === "/nextup-spotlight" ? "active bg-primary" : ""}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 7L12 3L4 7M20 7L12 11M20 7V17L12 21M12 11L4 7M12 11V21M4 7V17L12 21" />
                        </svg>
                        NextUp Spotlight
                      </a>
                    </Link>
                  </motion.li>
                  
                  {user && user.role === "admin" && (
                    <motion.li variants={menuItemVariants}>
                      <Link href="/admin-dashboard">
                        <a className="flex items-center p-2 rounded-lg text-white text-lg">
                          <ChartBarStacked className="h-6 w-6 mr-3" />
                          Admin Dashboard
                        </a>
                      </Link>
                    </motion.li>
                  )}
                </motion.ul>
              </nav>
              <motion.div 
                className="absolute bottom-0 inset-x-0 p-4 border-t border-neutral-light border-opacity-20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
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
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Fullscreen toggle for desktop when sidebar is hidden */}
        <AnimatePresence>
          {isFullscreen && (
            <motion.div 
              className="hidden md:block absolute top-4 right-4 z-10"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={fullscreenButtonVariants}
            >
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="bg-neutral/80 text-white hover:bg-neutral hover:text-white"
                  onClick={toggleFullscreen}
                  title="Exit Fullscreen"
                >
                  <Minimize className="h-5 w-5" />
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Content */}
        <div className="p-4 md:p-8">
          {children}
        </div>

        {/* Mobile Navigation */}
        <MobileNav />
      </motion.main>
    </div>
  );
}
