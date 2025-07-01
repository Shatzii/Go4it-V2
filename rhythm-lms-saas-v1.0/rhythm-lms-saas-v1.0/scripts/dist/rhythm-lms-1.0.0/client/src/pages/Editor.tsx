import React, { useEffect } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import EditorTabs from '@/components/editor/EditorTabs';
import CodeEditor from '@/components/editor/CodeEditor';
import Terminal from '@/components/editor/Terminal';
import SidePanel from '@/components/sidepanel/SidePanel';
import { useEditor } from '@/context/EditorContext';
import { useToast } from '@/hooks/use-toast';

const Editor: React.FC = () => {
  const { saveActiveFile } = useEditor();
  const { toast } = useToast();
  
  // Handle Run button click
  const handleRunClick = async () => {
    try {
      // Save the current file first
      await saveActiveFile();
      
      // Send a POST request to run the file
      const response = await fetch('/api/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      
      if (!response.ok) {
        throw new Error(`Run failed: ${response.statusText}`);
      }
      
      toast({
        title: 'Success',
        description: 'Application is now running',
      });
    } catch (error) {
      toast({
        title: 'Run Failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <div className="bg-dark-800 text-dark-100 font-sans h-screen flex flex-col">
      <Header onRunClick={handleRunClick} />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden">
            <EditorTabs />
            <CodeEditor />
            <Terminal />
          </div>
          
          <SidePanel />
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default Editor;
