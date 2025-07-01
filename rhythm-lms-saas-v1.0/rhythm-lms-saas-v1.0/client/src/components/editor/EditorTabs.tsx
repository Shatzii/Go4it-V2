import React from 'react';
import { useEditor } from '@/context/EditorContext';
import { getFileIcon, getFileIconColor } from '@/lib/utils';

const EditorTabs: React.FC = () => {
  const { openFiles, activeFile, closeFile, setActiveFilePath } = useEditor();
  
  if (openFiles.length === 0) {
    return (
      <div className="bg-dark-900 px-2 flex text-sm border-b border-dark-700">
        <div className="px-4 py-2 text-dark-400">
          No open files
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-dark-900 px-2 flex text-sm border-b border-dark-700 overflow-x-auto">
      {openFiles.map(file => {
        const isActive = activeFile && activeFile.path === file.path;
        return (
          <div 
            key={file.path}
            className={`px-4 py-2 flex items-center cursor-pointer ${
              isActive 
                ? 'bg-dark-800 border-t-2 border-primary-600 text-white font-medium' 
                : 'text-dark-400 hover:text-white'
            }`}
            onClick={() => setActiveFilePath(file.path)}
          >
            <i className={`${getFileIcon(file.path)} ${getFileIconColor(file.path)} mr-2`}></i>
            <span>{file.name}</span>
            {file.isDirty && <span className="mx-1 text-dark-400">•</span>}
            <button 
              className="ml-2 text-dark-400 hover:text-white"
              onClick={(e) => {
                e.stopPropagation();
                closeFile(file.path);
              }}
            >
              <i className="ri-close-line"></i>
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default EditorTabs;
