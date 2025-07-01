import React, { useState } from 'react';
import { 
  availableModels, 
  generateCode, 
  AiGenerationResult 
} from '@/lib/ai-service';
import { useToast } from '@/hooks/use-toast';
import { useEditor } from '@/context/EditorContext';

const AIConsole: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('rhythm-core-v0.1.0');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { activeFile } = useEditor();
  
  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: 'Empty Prompt',
        description: 'Please enter a prompt for the AI',
        variant: 'destructive',
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const context = activeFile ? activeFile.content : undefined;
      
      const result = await generateCode({
        prompt,
        model,
        context,
      });
      
      if (result.success) {
        toast({
          title: 'Code Generated',
          description: 'AI has successfully generated code',
        });
        
        // Here you could insert the generated code or create a new file with it
        console.log(result.content); // For now just log it
      } else {
        toast({
          title: 'Generation Failed',
          description: result.message || 'Unknown error occurred',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate code',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <div className="mb-5">
      <h2 className="text-lg font-semibold mb-3">AI Console</h2>
      <div className="bg-dark-700 rounded-lg p-3">
        <textarea 
          className="w-full bg-dark-800 rounded-md p-3 text-white text-sm placeholder-dark-400 focus:outline-none focus:ring-1 focus:ring-primary-500 resize-none" 
          rows={4} 
          placeholder="Ask AI to generate code or explain concepts..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isGenerating}
        ></textarea>
        <div className="flex justify-between mt-2">
          <select 
            className="bg-dark-800 text-dark-300 text-xs rounded px-2 py-1 border border-dark-600"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            disabled={isGenerating}
          >
            {availableModels.map((modelOption) => (
              <option key={modelOption.id} value={modelOption.id}>
                {modelOption.name}
              </option>
            ))}
          </select>
          <button 
            className={`${
              isGenerating
                ? 'bg-dark-600 text-dark-300 cursor-not-allowed'
                : 'bg-primary-600 hover:bg-primary-700 text-white cursor-pointer'
            } px-3 py-1 rounded text-sm`}
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Generate'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIConsole;
