'use client';

import { User, Settings, Bell, LogOut } from 'lucide-react';
import { useApp } from '../providers/AppProviders';

export function DashboardHeader() {
  const { user } = useApp();

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-6">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Go4It Sports
            </h1>
            <nav className="hidden md:flex space-x-6">
              <NavLink href="/dashboard" active>Dashboard</NavLink>
              <NavLink href="/starpath">StarPath</NavLink>
              <NavLink href="/video-analysis">Video Analysis</NavLink>
              <NavLink href="/academics">Academics</NavLink>
              <NavLink href="/teams">Teams</NavLink>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 text-slate-400 hover:text-white transition-colors">
              <Bell className="h-5 w-5" />
            </button>
            <button className="p-2 text-slate-400 hover:text-white transition-colors">
              <Settings className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm text-slate-300">
                {user?.firstName || 'Athlete'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function NavLink({ href, children, active = false }: { 
  href: string; 
  children: React.ReactNode; 
  active?: boolean 
}) {
  return (
    <a 
      href={href}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        active 
          ? 'bg-slate-800 text-white' 
          : 'text-slate-400 hover:text-white hover:bg-slate-800'
      }`}
    >
      {children}
    </a>
  );
}