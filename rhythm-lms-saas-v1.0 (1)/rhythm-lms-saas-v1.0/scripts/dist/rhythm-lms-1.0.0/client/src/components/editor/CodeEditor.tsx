import React, { useEffect, useRef, useState } from 'react';
import * as monaco from 'monaco-editor';
import { useEditor } from '@/context/EditorContext';
import { cn } from '@/lib/utils';

// This is a simpler editor for when Monaco is not loaded yet
const SimpleEditor: React.FC<{ content: string }> = ({ content }) => {
  const lines = content.split('\n');
  
  return (
    <div className="flex-1 overflow-auto rhythm-editor bg-dark-800 font-mono text-sm leading-relaxed p-4">
      <pre className="line-numbers">
        {lines.map((line, index) => (
          <span key={index} className="block text-white whitespace-pre">
            {line}
          </span>
        ))}
      </pre>
    </div>
  );
};

const CodeEditor: React.FC = () => {
  const { activeFile, setActiveFile, files } = useEditor();
  const editorRef = useRef<HTMLDivElement>(null);
  const monacoRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [isMonacoLoaded, setIsMonacoLoaded] = useState(false);
  
  // Load Monaco editor
  useEffect(() => {
    if (!editorRef.current) return;
    
    // Load Monaco editor when component mounts
    import('monaco-editor').then(monaco => {
      // Configure Rhythm language
      monaco.languages.register({ id: 'rhythm' });
      monaco.languages.setMonarchTokensProvider('rhythm', {
        tokenizer: {
          root: [
            // Rhythm directives
            [/@[a-zA-Z]+\(.*\)/, 'keyword'],
            [/@[a-zA-Z]+/, 'keyword'],
            
            // HTML tags
            [/(<)([^>\s]+)/, ['delimiter', 'tag']],
            [/(<\/)([^>\s]+)(>)/, ['delimiter', 'tag', 'delimiter']],
            
            // Attributes
            [/([a-zA-Z\-]+)(=)/, ['attribute.name', 'delimiter']],
            [/"[^"]*"/, 'attribute.value'],
            [/'[^']*'/, 'attribute.value'],
            
            // Scripts
            [/<script\b.*>/, { token: 'delimiter.html', next: '@script' }],
            
            // Comments
            [/<!--/, { token: 'comment', next: '@comment' }],
          ],
          
          script: [
            [/<\/script>/, { token: 'delimiter.html', next: '@pop' }],
            [/[^<]+/, 'source.js']
          ],
          
          comment: [
            [/-->/, { token: 'comment', next: '@pop' }],
            [/./, 'comment']
          ]
        }
      });
      
      // Create the editor if it doesn't exist
      if (!monacoRef.current) {
        monacoRef.current = monaco.editor.create(editorRef.current!, {
          automaticLayout: true,
          fontSize: 13,
          fontFamily: 'Fira Code, monospace',
          fontLigatures: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          theme: 'vs-dark',
          language: 'rhythm',
          wordWrap: 'on',
          lineNumbers: 'on',
          renderLineHighlight: 'all',
          cursorBlinking: 'smooth',
          tabSize: 2,
        });
        
        // Set the content
        if (activeFile) {
          monacoRef.current.setValue(activeFile.content);
        }
        
        // Subscribe to content changes
        monacoRef.current.onDidChangeModelContent(() => {
          if (activeFile) {
            const newContent = monacoRef.current!.getValue();
            setActiveFile({
              ...activeFile,
              content: newContent,
              isDirty: true
            });
          }
        });
      }
      
      setIsMonacoLoaded(true);
    });
    
    return () => {
      monacoRef.current?.dispose();
      monacoRef.current = null;
    };
  }, []);
  
  // Update editor content when active file changes
  useEffect(() => {
    if (monacoRef.current && activeFile) {
      // Only set value if it's different to avoid cursor jumps
      if (monacoRef.current.getValue() !== activeFile.content) {
        monacoRef.current.setValue(activeFile.content);
      }
    }
  }, [activeFile?.path]);
  
  if (!activeFile) {
    return (
      <div className="flex-1 flex items-center justify-center bg-dark-800 text-dark-400">
        <div className="text-center">
          <i className="ri-file-code-line text-5xl mb-4"></i>
          <p>Select a file to edit</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex-1 flex overflow-hidden">
      {isMonacoLoaded ? (
        <div ref={editorRef} className="flex-1" />
      ) : (
        <SimpleEditor content={activeFile.content} />
      )}
    </div>
  );
};

export default CodeEditor;
