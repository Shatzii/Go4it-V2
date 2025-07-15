'use client';

import { User, Settings, Bell, LogOut } from 'lucide-react';
import { useApp } from '../providers/AppProviders';

export function DashboardHeader() {
  const { user } = useApp();

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-6">
            <h1 className="text-2xl font-bold text-primary neon-text">
              Go4It Sports
            </h1>
            <nav className="hidden md:flex space-x-6">
              <NavLink href="/dashboard" active>Dashboard</NavLink>
              <NavLink href="/starpath">StarPath</NavLink>
              <NavLink href="/gar-upload">GAR Analysis</NavLink>
              <NavLink href="/academy">Academy</NavLink>
              <NavLink href="/teams">Teams</NavLink>
              <NavLink href="/models">AI Models</NavLink>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="h-5 w-5" />
            </button>
            <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
              <Settings className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center neon-glow">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-sm text-foreground">
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
          ? 'bg-primary text-primary-foreground neon-border' 
          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
      }`}
    >
      {children}
    </a>
  );
}