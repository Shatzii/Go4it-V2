import React, { useState } from 'react';
import { useLocation, useSearch } from 'wouter';
import RhythmEditor from '@/components/rhythm/RhythmEditor';
import { Button } from '@/components/ui/button';

const RhythmEditorPage: React.FC = () => {
  const [_, setLocation] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const templateId = params.get('template');
  
  // In a real implementation, this would fetch the template details by ID
  // Here we just provide a filename that indicates the template being edited
  const fileName = templateId 
    ? `template-${templateId}.rhy` 
    : 'new-template.rhy';

  const handleSave = (code: string) => {
    // This would save the code to the backend in a real implementation
    console.log('Saving code:', code);
  };

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col">
      <header className="bg-dark-900 border-b border-dark-800 p-3 flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            className="text-gray-400 hover:text-white mr-2"
            onClick={() => setLocation('/templates')}
          >
            <i className="ri-arrow-left-line mr-1"></i> Templates
          </Button>
          <h1 className="text-xl font-bold text-white">
            {templateId ? 'Edit Template' : 'Create New Template'}
          </h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            className="text-gray-300 border-dark-700"
            onClick={() => setLocation('/dashboard')}
          >
            <i className="ri-dashboard-line mr-1"></i> Dashboard
          </Button>
        </div>
      </header>
      
      <div className="flex-1 overflow-hidden">
        <RhythmEditor 
          fileName={fileName}
          onSave={handleSave}
        />
      </div>
    </div>
  );
};

export default RhythmEditorPage;