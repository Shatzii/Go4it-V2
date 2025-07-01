import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getFileContent, saveFile } from '@/lib/file-service';
import { useToast } from '@/hooks/use-toast';

export interface OpenFile {
  path: string;
  name: string;
  content: string;
  lastModified: string;
  isDirty: boolean;
}

interface EditorContextType {
  openFiles: OpenFile[];
  activeFile: OpenFile | null;
  openFile: (path: string) => Promise<void>;
  closeFile: (path: string) => void;
  saveActiveFile: () => Promise<void>;
  setActiveFilePath: (path: string) => void;
  setActiveFile: (file: OpenFile) => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [openFiles, setOpenFiles] = useState<OpenFile[]>([]);
  const [activeFile, setActiveFile] = useState<OpenFile | null>(null);
  const { toast } = useToast();
  
  // Open a file
  const openFile = useCallback(async (path: string) => {
    // Check if the file is already open
    const existingFile = openFiles.find(file => file.path === path);
    if (existingFile) {
      setActiveFile(existingFile);
      return;
    }
    
    try {
      // Fetch the file content
      const fileContent = await getFileContent(path);
      
      // Create the new file object
      const newFile: OpenFile = {
        path: fileContent.path,
        name: path.split('/').pop() || path,
        content: fileContent.content,
        lastModified: fileContent.lastModified,
        isDirty: false,
      };
      
      // Add to open files and set as active
      setOpenFiles(prev => [...prev, newFile]);
      setActiveFile(newFile);
    } catch (error) {
      toast({
        title: 'Error Opening File',
        description: error instanceof Error ? error.message : 'Failed to open file',
        variant: 'destructive',
      });
    }
  }, [openFiles, toast]);
  
  // Close a file
  const closeFile = useCallback((path: string) => {
    // Find the file
    const fileToClose = openFiles.find(file => file.path === path);
    
    // If the file has unsaved changes, confirm before closing
    if (fileToClose?.isDirty) {
      if (!window.confirm('This file has unsaved changes. Close anyway?')) {
        return;
      }
    }
    
    // Remove the file from open files
    setOpenFiles(prev => prev.filter(file => file.path !== path));
    
    // If the active file is being closed, set another file as active
    if (activeFile?.path === path) {
      const remainingFiles = openFiles.filter(file => file.path !== path);
      setActiveFile(remainingFiles.length > 0 ? remainingFiles[0] : null);
    }
  }, [openFiles, activeFile]);
  
  // Save the active file
  const saveActiveFile = useCallback(async () => {
    if (!activeFile) return;
    
    try {
      await saveFile(activeFile.path, activeFile.content);
      
      // Update the file to mark it as no longer dirty
      setOpenFiles(prev => 
        prev.map(file => 
          file.path === activeFile.path 
            ? { ...file, isDirty: false, lastModified: new Date().toISOString() } 
            : file
        )
      );
      
      setActiveFile(prev => prev ? { ...prev, isDirty: false, lastModified: new Date().toISOString() } : null);
      
      toast({
        title: 'File Saved',
        description: `${activeFile.name} has been saved successfully`,
      });
    } catch (error) {
      toast({
        title: 'Error Saving File',
        description: error instanceof Error ? error.message : 'Failed to save file',
        variant: 'destructive',
      });
    }
  }, [activeFile, toast]);
  
  // Set active file by path
  const setActiveFilePath = useCallback((path: string) => {
    const file = openFiles.find(f => f.path === path);
    if (file) {
      setActiveFile(file);
    }
  }, [openFiles]);
  
  // Update active file when content changes
  const updateActiveFile = useCallback((file: OpenFile) => {
    setActiveFile(file);
    setOpenFiles(prev => 
      prev.map(f => f.path === file.path ? file : f)
    );
  }, []);
  
  // Keyboard shortcuts for saving
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S or Cmd+S
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveActiveFile();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [saveActiveFile]);
  
  return (
    <EditorContext.Provider
      value={{
        openFiles,
        activeFile,
        openFile,
        closeFile,
        saveActiveFile,
        setActiveFilePath,
        setActiveFile: updateActiveFile,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = (): EditorContextType => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
};
