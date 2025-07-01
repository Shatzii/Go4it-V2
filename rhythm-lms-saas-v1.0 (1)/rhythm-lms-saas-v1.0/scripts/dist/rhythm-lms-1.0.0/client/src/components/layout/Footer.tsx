import React from 'react';
import { useAI } from '@/context/AIContext';

const Footer: React.FC = () => {
  const { aiStatus } = useAI();

  return (
    <footer className="bg-dark-900 border-t border-dark-700 py-2 px-4 text-xs text-dark-400 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <div>Rhythm Engine v0.1.0</div>
        <div className="flex items-center">
          <span className={`w-2 h-2 rounded-full ${aiStatus.isReady ? 'bg-success-500' : 'bg-error-500'} mr-1`}></span>
          <span>{aiStatus.isReady ? 'Server Running' : 'Server Error'}</span>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div>AI: {aiStatus.model}</div>
        <div>Memory: {(aiStatus.memoryUsage.used / 1024).toFixed(1)}GB</div>
        <div>Port: 4242</div>
      </div>
    </footer>
  );
};

export default Footer;
