import React from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TopNavProps {
  title?: string;
  toggleSidebar: () => void;
}

export default function TopNav({ title = 'Dashboard', toggleSidebar }: TopNavProps) {
  const [, setLocation] = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    setLocation('/login');
  };

  return (
    <div className="h-16 bg-dark-900 border-b border-dark-700 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="md:hidden text-gray-400 hover:text-white mr-4"
        >
          <span className="material-icons">menu</span>
        </button>
        <h1 className="text-xl font-semibold text-white">{title}</h1>
      </div>

      <div className="hidden md:flex items-center space-x-1 flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            <span className="material-icons text-lg">search</span>
          </span>
          <Input
            type="search"
            placeholder="Search commands, documentation..."
            className="w-full pl-10 py-1.5 bg-dark-800 border-dark-700 text-white placeholder:text-gray-500 focus:border-primary-600"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="hidden md:flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white"
            onClick={() => setLocation('/marketplace')}
          >
            <span className="material-icons">extension</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white"
            onClick={() => setLocation('/documentation')}
          >
            <span className="material-icons">help_outline</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white"
          >
            <span className="material-icons">notifications</span>
          </Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-primary-700 flex items-center justify-center">
                <span className="material-icons text-sm text-white">person</span>
              </div>
              <div className="hidden md:block text-left">
                <div className="text-sm font-medium text-white">
                  {user?.username || 'User'}
                </div>
                <div className="text-xs text-gray-400 capitalize">
                  {user?.plan || 'Free'} Plan
                </div>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-dark-800 border-dark-700 text-white" align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-dark-700" />
            <DropdownMenuItem
              className="cursor-pointer hover:bg-dark-700"
              onClick={() => setLocation('/profile')}
            >
              <span className="material-icons mr-2 text-lg">account_circle</span>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer hover:bg-dark-700"
              onClick={() => setLocation('/subscription')}
            >
              <span className="material-icons mr-2 text-lg">workspace_premium</span>
              Subscription
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer hover:bg-dark-700"
              onClick={() => setLocation('/settings')}
            >
              <span className="material-icons mr-2 text-lg">settings</span>
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-dark-700" />
            <DropdownMenuItem
              className="cursor-pointer text-red-400 hover:bg-dark-700 hover:text-red-300"
              onClick={handleLogout}
            >
              <span className="material-icons mr-2 text-lg">logout</span>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}