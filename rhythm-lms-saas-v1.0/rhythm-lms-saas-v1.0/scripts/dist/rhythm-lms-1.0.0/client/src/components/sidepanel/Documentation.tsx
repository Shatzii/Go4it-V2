import React, { useState } from 'react';

interface DocumentationProps {
  isCollapsed: boolean;
}

const Documentation: React.FC<DocumentationProps> = ({ isCollapsed }) => {
  const [isExpanded, setIsExpanded] = useState(!isCollapsed);
  
  // Common directives from the Rhythm language spec
  const coreDirectives = [
    { name: '@extends()', description: 'Inherit a base layout' },
    { name: '@section()', description: 'Define content area' },
    { name: '@include()', description: 'Import a partial file' },
    { name: '@endsection', description: 'Close a section' },
    { name: '@block()', description: 'Named content block' },
    { name: '@endblock', description: 'End a block' },
  ];
  
  // Control flow directives
  const controlFlow = [
    { name: '@if(expr)', description: 'Conditional start' },
    { name: '@elseif(expr)', description: 'Else if condition' },
    { name: '@else', description: 'Fallback condition' },
    { name: '@endif', description: 'End conditional' },
    { name: '@loop(count)', description: 'Repeat block n times' },
    { name: '@each(item in list)', description: 'Loop through array' },
    { name: '@endloop', description: 'End loop' },
  ];
  
  // AI directives
  const aiDirectives = [
    { name: '@ai("summarize")', description: 'AI summarization' },
    { name: '@ai("quiz-gen")', description: 'Generate quiz from content' },
    { name: '@prompt("...")', description: 'Custom prompt to AI' },
    { name: '@model("local")', description: 'Choose AI model' },
  ];
  
  // Toggle expansion
  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">Rhythm Documentation</h2>
        <button 
          className="text-xs text-primary-400 hover:text-primary-300"
          onClick={toggleExpansion}
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>
      
      <div className="bg-dark-700 rounded-lg p-3">
        <h3 className="font-medium mb-2">Core Directives</h3>
        <div className="space-y-1 text-sm">
          {(isExpanded ? coreDirectives : coreDirectives.slice(0, 4)).map((directive, index) => (
            <div key={index} className="flex">
              <code className="text-secondary-400 w-32">{directive.name}</code>
              <span className="text-dark-200">{directive.description}</span>
            </div>
          ))}
        </div>
        
        {isExpanded && (
          <>
            <h3 className="font-medium mb-2 mt-4">Control Flow</h3>
            <div className="space-y-1 text-sm">
              {controlFlow.map((directive, index) => (
                <div key={index} className="flex">
                  <code className="text-secondary-400 w-32">{directive.name}</code>
                  <span className="text-dark-200">{directive.description}</span>
                </div>
              ))}
            </div>
            
            <h3 className="font-medium mb-2 mt-4">AI Integration</h3>
            <div className="space-y-1 text-sm">
              {aiDirectives.map((directive, index) => (
                <div key={index} className="flex">
                  <code className="text-secondary-400 w-32">{directive.name}</code>
                  <span className="text-dark-200">{directive.description}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Documentation;
