import React from 'react';
import { Link } from 'wouter';

interface HeaderProps {
  onRunClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onRunClick }) => {
  return (
    <header className="bg-dark-900 border-b border-dark-700 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Link href="/">
          <div className="flex items-center cursor-pointer">
            <i className="ri-rhythm-line text-primary-500 text-2xl mr-2"></i>
            <h1 className="text-xl font-semibold text-white">Rhythm Engine</h1>
          </div>
        </Link>
        <div className="hidden md:flex space-x-4">
          <button className="text-dark-300 hover:text-white px-3 py-1 text-sm rounded hover:bg-dark-700 transition">File</button>
          <button className="text-dark-300 hover:text-white px-3 py-1 text-sm rounded hover:bg-dark-700 transition">Edit</button>
          <button className="text-dark-300 hover:text-white px-3 py-1 text-sm rounded hover:bg-dark-700 transition">View</button>
          <button className="text-dark-300 hover:text-white px-3 py-1 text-sm rounded hover:bg-dark-700 transition">AI</button>
          <button className="text-dark-300 hover:text-white px-3 py-1 text-sm rounded hover:bg-dark-700 transition">Deploy</button>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button 
          onClick={onRunClick} 
          className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-1.5 rounded text-sm font-medium flex items-center"
        >
          <i className="ri-play-fill mr-1"></i> Run
        </button>
        <div className="relative text-dark-300">
          <i className="ri-settings-3-line text-xl cursor-pointer hover:text-white"></i>
        </div>
      </div>
    </header>
  );
};

export default Header;
