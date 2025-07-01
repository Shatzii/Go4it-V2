import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  ChartLine, 
  Home, 
  Video, 
  Star, 
  User, 
  Bell, 
  Menu,
  LogOut,
  GraduationCap,
  Settings
} from "lucide-react";

export default function Navbar() {
  const [location] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/auth/logout");
    },
    onSuccess: () => {
      queryClient.clear();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const getRoleDisplay = (role: string) => {
    const roleMap = {
      student: "Student Athlete",
      coach: "Coach", 
      parent: "Parent",
    };
    return roleMap[role as keyof typeof roleMap] || role;
  };

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: Home },
    { path: "/gar-analysis", label: "GAR Analysis", icon: Video },
    { path: "/starpath", label: "StarPath", icon: Star },
    { path: "/ncaa-eligibility", label: "NCAA Eligibility", icon: GraduationCap },
    { path: "/advanced-features", label: "AI Features", icon: ChartLine, badge: "NEW" },
    { path: "/usa-football", label: "USA Football", icon: User, badge: "OFFICIAL" },
    { path: "/profile", label: "Profile", icon: User },
  ];

  return (
    <nav className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="bg-primary rounded-lg p-2">
              <ChartLine className="text-white h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-white">Go4It Sports</span>
          </div>

          {/* Main Navigation - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = location === item.path || (item.path === "/dashboard" && location === "/");
              
              return (
                <Link key={item.path} href={item.path}>
                  <Button
                    variant="ghost"
                    className={`text-sm font-medium transition-colors neurodivergent-focus ${
                      isActive 
                        ? "text-white bg-slate-700" 
                        : "text-slate-300 hover:text-white hover:bg-slate-700"
                    }`}
                  >
                    <IconComponent className="mr-2 h-4 w-4" />
                    {item.label}
                    {item.badge && (
                      <Badge 
                        className={`ml-2 text-xs ${
                          item.badge === "NEW" 
                            ? "bg-cyan-500 text-white" 
                            : item.badge === "OFFICIAL"
                            ? "bg-gradient-to-r from-red-500 to-blue-500 text-white"
                            : "bg-slate-600 text-slate-200"
                        }`}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Role Display - Desktop Only */}
            <div className="hidden md:block">
              <Badge variant="outline" className="text-slate-300 border-slate-600">
                {getRoleDisplay(user?.role || "")}
              </Badge>
            </div>
            
            {/* Admin Dashboard Access */}
            <Link href="/admin">
              <Button 
                variant="outline" 
                size="sm" 
                className="px-3 py-1 border-cyan-600 text-cyan-400 hover:bg-cyan-600 hover:text-white mobile-touch-target neurodivergent-focus"
              >
                <Settings className="h-4 w-4 mr-1" />
                Admin
              </Button>
            </Link>

            {/* Notifications */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative p-2 text-slate-300 hover:text-white mobile-touch-target neurodivergent-focus"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-warning text-xs text-white rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </Button>

            {/* Profile Avatar */}
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <User className="text-white h-4 w-4" />
            </div>

            {/* Logout Button - Desktop */}
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="hidden md:flex text-slate-300 hover:text-white neurodivergent-focus"
              disabled={logoutMutation.isPending}
            >
              <LogOut className="h-4 w-4 mr-2" />
              {logoutMutation.isPending ? "..." : "Logout"}
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-2 text-slate-300 hover:text-white mobile-touch-target"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden bg-slate-800 border-t border-slate-700 px-4 py-4 space-y-2">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = location === item.path || (item.path === "/dashboard" && location === "/");
              
              return (
                <Link key={item.path} href={item.path}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start mobile-touch-target neurodivergent-focus ${
                      isActive 
                        ? "text-white bg-slate-700" 
                        : "text-slate-300 hover:text-white hover:bg-slate-700"
                    }`}
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <IconComponent className="mr-3 h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
            
            {/* Mobile Role Display */}
            <div className="px-3 py-2">
              <Badge variant="outline" className="text-slate-300 border-slate-600">
                {getRoleDisplay(user?.role || "")}
              </Badge>
            </div>
            
            {/* Mobile Logout */}
            <Button
              onClick={() => {
                handleLogout();
                setShowMobileMenu(false);
              }}
              variant="ghost"
              className="w-full justify-start text-slate-300 hover:text-white mobile-touch-target neurodivergent-focus"
              disabled={logoutMutation.isPending}
            >
              <LogOut className="mr-3 h-4 w-4" />
              {logoutMutation.isPending ? "Logging out..." : "Logout"}
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
