'use client';

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { User, Settings, LogOut, Shield } from 'lucide-react';

export function AuthenticatedNavbar() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center gap-4">
        <div className="animate-pulse bg-slate-700 h-8 w-20 rounded"></div>
        <div className="animate-pulse bg-slate-700 h-10 w-10 rounded-full"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center gap-4">
        <a
          href="/login"
          className="text-slate-300 hover:text-white transition-colors px-4 py-2 rounded-lg border border-slate-600 hover:border-slate-500"
        >
          Sign In
        </a>
        <a
          href="/register"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
        >
          Get Started
        </a>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {/* Role Badge */}
      {user.role === 'admin' && (
        <Badge variant="secondary" className="bg-red-100 text-red-800">
          <Shield className="w-3 h-3 mr-1" />
          Admin
        </Badge>
      )}

      {/* Subscription Badge */}
      <Badge variant="outline" className="text-blue-400 border-blue-400">
        {user.subscription}
      </Badge>

      {/* User Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.profileImage} alt={user.name} />
              <AvatarFallback className="bg-slate-700 text-white">
                {user.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-slate-800 border-slate-700" align="end" forceMount>
          <div className="flex flex-col space-y-1 p-2">
            <p className="text-sm font-medium leading-none text-white">{user.name}</p>
            <p className="text-xs leading-none text-slate-400">{user.email}</p>
          </div>
          <DropdownMenuSeparator className="bg-slate-700" />
          <DropdownMenuItem className="text-white hover:bg-slate-700" asChild>
            <a href="/profile" className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              Profile
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem className="text-white hover:bg-slate-700" asChild>
            <a href="/settings" className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </a>
          </DropdownMenuItem>
          {user.role === 'admin' && (
            <DropdownMenuItem className="text-white hover:bg-slate-700" asChild>
              <a href="/admin" className="flex items-center">
                <Shield className="mr-2 h-4 w-4" />
                Admin Panel
              </a>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator className="bg-slate-700" />
          <DropdownMenuItem
            className="text-red-400 hover:bg-slate-700 hover:text-red-300"
            onClick={logout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
