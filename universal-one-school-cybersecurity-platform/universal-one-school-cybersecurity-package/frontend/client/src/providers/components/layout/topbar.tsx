import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Bell, User, LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { DashboardStats } from "@/types/security";

export function TopBar() {
  const { user, logout } = useAuth();

  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
    enabled: !!user?.clientId || user?.role === "admin",
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-navy-800 border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Security Dashboard</h1>
          <p className="text-sm text-gray-400">Real-time threat monitoring and analysis</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Alert Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white hover:bg-navy-700"
            >
              <Bell className="w-5 h-5" />
              {stats?.unreadAlerts && stats.unreadAlerts > 0 && (
                <Badge 
                  className="absolute -top-1 -right-1 w-5 h-5 bg-security-red text-white text-xs flex items-center justify-center p-0 min-w-0"
                >
                  {stats.unreadAlerts > 99 ? "99+" : stats.unreadAlerts}
                </Badge>
              )}
            </Button>
          </div>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center space-x-3 text-white hover:bg-navy-700 px-3 py-2"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium">{user?.username || "User"}</p>
                  <p className="text-xs text-gray-400 capitalize">
                    {user?.role === "client_admin" ? "Client Admin" : user?.role || "User"}
                  </p>
                </div>
                <div className="w-8 h-8 bg-security-blue rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent 
              className="w-56 bg-navy-800 border-gray-600" 
              align="end"
            >
              <DropdownMenuLabel className="text-gray-300">
                My Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-600" />
              
              <DropdownMenuItem className="text-gray-300 hover:bg-navy-700 hover:text-white cursor-pointer">
                <User className="w-4 h-4 mr-2" />
                Profile Settings
              </DropdownMenuItem>
              
              <DropdownMenuItem className="text-gray-300 hover:bg-navy-700 hover:text-white cursor-pointer">
                <Bell className="w-4 h-4 mr-2" />
                Notification Settings
              </DropdownMenuItem>
              
              <DropdownMenuSeparator className="bg-gray-600" />
              
              <DropdownMenuItem 
                className="text-red-400 hover:bg-red-500/10 hover:text-red-300 cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
