import React, { useState } from 'react';
import { Outlet } from 'wouter';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen bg-slate-950">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}