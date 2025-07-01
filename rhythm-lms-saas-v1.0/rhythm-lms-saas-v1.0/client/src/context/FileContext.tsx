import React, { createContext, useContext, useState, useCallback } from 'react';
import { getFileTree, FileNode, createFile, deleteFile, renameFile } from '@/lib/file-service';
import { useToast } from '@/hooks/use-toast';

interface FileContextType {
  fileTree: FileNode | null;
  loadFileTree: () => Promise<void>;
  addFile: (path: string, type: 'file' | 'directory') => Promise<void>;
  removeFile: (path: string) => Promise<void>;
  rename: (oldPath: string, newPath: string) => Promise<void>;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export const FileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fileTree, setFileTree] = useState<FileNode | null>(null);
  const { toast } = useToast();
  
  // Load the file tree
  const loadFileTree = useCallback(async () => {
    try {
      const tree = await getFileTree();
      setFileTree(tree);
    } catch (error) {
      console.error('Error loading file tree:', error);
      toast({
        title: 'Error',
        description: 'Failed to load file tree',
        variant: 'destructive',
      });
    }
  }, [toast]);
  
  // Add a new file or directory
  const addFile = useCallback(async (path: string, type: 'file' | 'directory') => {
    try {
      await createFile(path, type);
      await loadFileTree(); // Reload the tree
      
      toast({
        title: 'Success',
        description: `${type === 'file' ? 'File' : 'Directory'} created successfully`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to create ${type}`,
        variant: 'destructive',
      });
    }
  }, [loadFileTree, toast]);
  
  // Remove a file or directory
  const removeFile = useCallback(async (path: string) => {
    try {
      await deleteFile(path);
      await loadFileTree(); // Reload the tree
      
      toast({
        title: 'Success',
        description: 'File deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete file',
        variant: 'destructive',
      });
    }
  }, [loadFileTree, toast]);
  
  // Rename a file or directory
  const rename = useCallback(async (oldPath: string, newPath: string) => {
    try {
      await renameFile(oldPath, newPath);
      await loadFileTree(); // Reload the tree
      
      toast({
        title: 'Success',
        description: 'File renamed successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to rename file',
        variant: 'destructive',
      });
    }
  }, [loadFileTree, toast]);
  
  return (
    <FileContext.Provider
      value={{
        fileTree,
        loadFileTree,
        addFile,
        removeFile,
        rename,
      }}
    >
      {children}
    </FileContext.Provider>
  );
};

export const useFile = (): FileContextType => {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error('useFile must be used within a FileProvider');
  }
  return context;
};
