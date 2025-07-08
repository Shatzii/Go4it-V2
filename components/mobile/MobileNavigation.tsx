'use client';

import { useState } from 'react';
import { 
  Home, 
  Star, 
  Video, 
  BookOpen, 
  Users, 
  Menu, 
  X,
  Settings,
  LogOut 
} from 'lucide-react';
import { useApp } from '../providers/AppProviders';

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useApp();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, active: true },
    { name: 'StarPath', href: '/starpath', icon: Star, active: false },
    { name: 'Video Analysis', href: '/video-analysis', icon: Video, active: false },
    { name: 'Academics', href: '/academics', icon: BookOpen, active: false },
    { name: 'Teams', href: '/teams', icon: Users, active: false },
  ];

  return (
    <>
      {/* Mobile Navigation Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors md:hidden"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Mobile Navigation Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsOpen(false)} />
          
          <div className="fixed right-0 top-0 bottom-0 w-80 bg-slate-900 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-white">Go4It Sports</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-2"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* User Profile */}
            <div className="flex items-center space-x-3 mb-8 p-4 bg-slate-800 rounded-lg">
              <div className="h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  {user?.firstName?.[0] || 'U'}
                </span>
              </div>
              <div>
                <p className="text-white font-medium">{user?.firstName || 'User'}</p>
                <p className="text-slate-400 text-sm">{user?.role || 'Athlete'}</p>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-2">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    item.active
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </a>
              ))}
            </nav>

            {/* Settings & Logout */}
            <div className="mt-8 pt-8 border-t border-slate-700 space-y-2">
              <button className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors w-full">
                <Settings className="h-5 w-5" />
                <span className="font-medium">Settings</span>
              </button>
              <button className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors w-full">
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}