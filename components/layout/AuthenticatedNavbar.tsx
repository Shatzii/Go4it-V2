'use client';

import { useUser, useClerk } from '@clerk/nextjs';
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
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  if (!isLoaded) {
    return (
      <div className="flex items-center gap-4">
        <div className="animate-pulse bg-slate-700 h-8 w-20 rounded"></div>
        <div className="animate-pulse bg-slate-700 h-10 w-10 rounded-full"></div>
      </div>
    );
  }

  if (!user) {
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

  const userRole = user.publicMetadata?.role as string;

  return (
    <div className="flex items-center gap-4">
      {/* Role Badge */}
      {userRole === 'admin' && (
        <Badge className="bg-red-600 hover:bg-red-700">
          <Shield className="w-3 h-3 mr-1" />
          Admin
        </Badge>
      )}

      {/* User Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2 hover:bg-slate-800">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.imageUrl} alt={user.fullName || ''} />
              <AvatarFallback>
                {user.firstName?.[0]}{user.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-slate-300">{user.firstName || user.fullName}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-slate-800 border-slate-700">
          <div className="px-2 py-1.5">
            <p className="text-sm font-medium text-white">{user.fullName}</p>
            <p className="text-xs text-slate-400">{user.primaryEmailAddress?.emailAddress}</p>
          </div>
          <DropdownMenuSeparator className="bg-slate-700" />
          <DropdownMenuItem asChild className="text-slate-300 hover:bg-slate-700">
            <a href="/dashboard" className="flex items-center cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              Dashboard
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="text-slate-300 hover:bg-slate-700">
            <a href="/settings" className="flex items-center cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </a>
          </DropdownMenuItem>
          {userRole === 'admin' && (
            <DropdownMenuItem asChild className="text-slate-300 hover:bg-slate-700">
              <a href="/admin" className="flex items-center cursor-pointer">
                <Shield className="mr-2 h-4 w-4" />
                Admin Panel
              </a>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator className="bg-slate-700" />
          <DropdownMenuItem
            onClick={() => signOut()}
            className="text-red-400 hover:bg-slate-700 hover:text-red-300 cursor-pointer"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
