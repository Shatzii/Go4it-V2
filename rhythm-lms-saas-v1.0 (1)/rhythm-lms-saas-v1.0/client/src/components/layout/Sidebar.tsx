import React from 'react';
import FileExplorer from '@/components/sidebar/FileExplorer';
import { useAI } from '@/context/AIContext';

const Sidebar: React.FC = () => {
  const { aiStatus } = useAI();
  
  return (
    <aside className="w-16 md:w-64 bg-dark-900 border-r border-dark-700 flex flex-col">
      <div className="h-14 border-b border-dark-700 flex items-center justify-center md:justify-start px-4">
        <span className="hidden md:block text-sm font-medium text-dark-300">PROJECT EXPLORER</span>
        <i className="ri-folder-line md:hidden text-dark-300"></i>
      </div>
      <div className="overflow-y-auto flex-1">
        <FileExplorer />
      </div>
      <div className="p-4 border-t border-dark-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className={`w-3 h-3 rounded-full ${aiStatus.isReady ? 'bg-success-500' : 'bg-error-500'}`}></span>
            <span className="hidden md:inline ml-2 text-xs text-dark-300">
              {aiStatus.isReady ? 'Local AI Ready' : 'AI Offline'}
            </span>
          </div>
          <span className="hidden md:inline text-xs text-dark-400">v0.1.0</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
