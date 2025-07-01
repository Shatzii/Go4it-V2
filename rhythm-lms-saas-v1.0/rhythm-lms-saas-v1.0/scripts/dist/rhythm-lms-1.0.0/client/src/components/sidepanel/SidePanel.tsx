import React, { useState } from 'react';
import SystemOverview from './SystemOverview';
import RecentActivity from './RecentActivity';
import AIConsole from './AIConsole';
import Documentation from './Documentation';

type Tab = 'dashboard' | 'documentation';

const SidePanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  
  return (
    <div className="w-full lg:w-80 xl:w-96 border-t lg:border-t-0 lg:border-l border-dark-700 flex flex-col overflow-hidden bg-dark-800">
      <div className="border-b border-dark-700">
        <div className="flex text-sm">
          <button 
            className={`px-4 py-3 ${activeTab === 'dashboard' ? 'bg-dark-700 text-white font-medium' : 'text-dark-400 hover:text-white'} flex-1`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={`px-4 py-3 ${activeTab === 'documentation' ? 'bg-dark-700 text-white font-medium' : 'text-dark-400 hover:text-white'} flex-1`}
            onClick={() => setActiveTab('documentation')}
          >
            Documentation
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-5">
        {activeTab === 'dashboard' && (
          <>
            <SystemOverview />
            <RecentActivity />
            <AIConsole />
            <Documentation isCollapsed={true} />
          </>
        )}
        
        {activeTab === 'documentation' && (
          <Documentation isCollapsed={false} />
        )}
      </div>
    </div>
  );
};

export default SidePanel;
