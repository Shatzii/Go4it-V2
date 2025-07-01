import React, { useState, useEffect } from 'react';
import { useFile } from '@/context/FileContext';
import { useEditor } from '@/context/EditorContext';
import { FileNode } from '@/lib/file-service';
import { getFileIcon, getFileIconColor } from '@/lib/utils';

interface FileTreeItemProps {
  node: FileNode;
  level: number;
  openFile: (path: string) => void;
  activeFilePath?: string;
}

const FileTreeItem: React.FC<FileTreeItemProps> = ({ node, level, openFile, activeFilePath }) => {
  const [isExpanded, setIsExpanded] = useState(level === 0);
  const isActive = activeFilePath === node.path;

  const handleClick = () => {
    if (node.type === 'directory') {
      setIsExpanded(!isExpanded);
    } else {
      openFile(node.path);
    }
  };

  const paddingLeft = level === 0 ? 3 : 8 + level * 2;

  return (
    <>
      <li className={`px-3 py-2 pl-${paddingLeft} pr-3`}>
        <div 
          className={`flex items-center ${
            isActive ? 'text-white font-medium' : 'text-dark-300 hover:text-white'
          } cursor-pointer`}
          onClick={handleClick}
        >
          {node.type === 'directory' && (
            <i className={`${isExpanded ? 'ri-folder-open-line' : 'ri-folder-line'} mr-3 text-lg`}></i>
          )}
          {node.type === 'file' && (
            <i className={`${getFileIcon(node.name)} mr-3 text-lg ${getFileIconColor(node.name)}`}></i>
          )}
          <span className="hidden md:inline text-sm">{node.name}</span>
        </div>
      </li>
      
      {/* Render children if expanded */}
      {isExpanded && node.children && (
        <>
          {node.children.map(child => (
            <FileTreeItem 
              key={child.path} 
              node={child} 
              level={level + 1}
              openFile={openFile}
              activeFilePath={activeFilePath}
            />
          ))}
        </>
      )}
    </>
  );
};

const FileExplorer: React.FC = () => {
  const { fileTree, loadFileTree } = useFile();
  const { openFile, activeFile } = useEditor();
  
  useEffect(() => {
    loadFileTree();
  }, [loadFileTree]);
  
  if (!fileTree) {
    return (
      <div className="p-4 text-dark-400 text-sm">
        Loading files...
      </div>
    );
  }
  
  return (
    <nav className="py-4">
      <ul>
        <FileTreeItem 
          node={fileTree} 
          level={0} 
          openFile={openFile}
          activeFilePath={activeFile?.path}
        />
      </ul>
    </nav>
  );
};

export default FileExplorer;
