import { useState } from "react";
import { Link, useLocation } from "wouter";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const [location] = useLocation();

  const navItems = [
    { name: "Dashboard", icon: "dashboard", path: "/" },
    { name: "Server Health", icon: "monitor_heart", path: "/server-health" },
    { name: "Servers", icon: "dns", path: "/servers" },
    { name: "Deployment", icon: "rocket_launch", path: "/deployment" },
  ];
  
  const aiNavItems = [
    { name: "Root Cause Analyzer", icon: "psychology", path: "/ai-analyzer" },
    { name: "Performance Tuner", icon: "auto_fix_high", path: "/ai-performance-tuner" },
    { name: "AI Models", icon: "smart_toy", path: "/ai-models" },
    { name: "Self-Healing", icon: "healing", path: "/self-healing" },
    { name: "AI Marketplace", icon: "store", path: "/marketplace" },
  ];
  
  const bottomNavItems = [
    { name: "Download AI Engine", icon: "download", path: "/download-ai", highlight: true },
    { name: "Upgrade to Pro", icon: "workspace_premium", path: "/subscribe", highlight: true },
    { name: "Documentation", icon: "help_outline", path: "/docs" },
    { name: "Support", icon: "support_agent", path: "/support" },
    { name: "Settings", icon: "settings", path: "/settings" },
  ];

  const isActive = (path: string) => location === path;

  return (
    <div
      className={`bg-dark-900 md:w-64 h-screen flex-shrink-0 border-r border-dark-700 transition-all duration-300 ease-in-out overflow-y-auto scrollbar-thin z-10 ${
        isOpen ? "fixed inset-0 z-50 md:static md:z-auto" : "hidden md:block"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-dark-700">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-600">
            <span className="material-icons text-white">dns</span>
          </div>
          <div>
            <h1 className="font-semibold text-lg text-white">Pharaoh</h1>
            <p className="text-xs text-gray-400">Control Panel 2.0</p>
          </div>
        </div>
        <button
          onClick={toggleSidebar}
          className="md:hidden text-gray-400 hover:text-white"
        >
          <span className="material-icons">menu</span>
        </button>
      </div>

      <div className="p-2">
        {/* Main Navigation */}
        <div className="mb-4">
          <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Main
          </div>
          {navItems.map((item) => (
            <div key={item.path}>
              <Link 
                href={item.path}
                className={`py-2 px-3 mb-1 rounded-md flex items-center cursor-pointer transition-colors ${
                  isActive(item.path)
                    ? "bg-primary-700 text-white"
                    : "text-gray-300 hover:bg-dark-800"
                }`}
              >
                <span className="material-icons mr-2 text-sm">{item.icon}</span>
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            </div>
          ))}
        </div>
        
        {/* AI Features */}
        <div className="mb-4">
          <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center">
            <span className="mr-1">AI Features</span>
            <span className="bg-secondary-900 text-secondary-300 text-[10px] px-1.5 py-0.5 rounded-full">New</span>
          </div>
          {aiNavItems.map((item) => (
            <div key={item.path}>
              <Link 
                href={item.path}
                className={`py-2 px-3 mb-1 rounded-md flex items-center cursor-pointer transition-colors ${
                  isActive(item.path)
                    ? "bg-primary-700 text-white"
                    : "text-gray-300 hover:bg-dark-800"
                }`}
              >
                <span className="material-icons mr-2 text-sm">{item.icon}</span>
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            </div>
          ))}
        </div>

        <div className="py-2 px-3 mt-4 border-t border-dark-700 pt-4">
          {bottomNavItems.map((item, index) => (
            <div key={index}>
              <Link 
                href={item.path}
                className={`py-2 px-3 mb-2 rounded-md text-gray-300 hover:bg-dark-800 flex items-center cursor-pointer transition-colors
                ${item.highlight ? 'bg-dark-800 border border-dark-700' : ''}
                ${isActive(item.path) ? "bg-primary-700 text-white" : ""}`}
              >
                <span className={`material-icons mr-2 text-sm ${item.highlight && !isActive(item.path) ? 'text-primary-400' : ''}`}>
                  {item.icon}
                </span>
                <span className="text-sm">{item.name}</span>
                {item.path === '/download-ai' && (
                  <span className="ml-auto bg-accent-900 text-accent-300 text-[10px] px-1.5 py-0.5 rounded-full">Local</span>
                )}
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto p-4 border-t border-dark-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
            <span className="material-icons text-sm">person</span>
          </div>
          <div>
            <p className="text-sm font-medium text-white">John Developer</p>
            <p className="text-xs text-gray-400">Pro Plan</p>
          </div>
          <div className="ml-auto">
            <button className="text-gray-400 hover:text-white">
              <span className="material-icons text-lg">logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
