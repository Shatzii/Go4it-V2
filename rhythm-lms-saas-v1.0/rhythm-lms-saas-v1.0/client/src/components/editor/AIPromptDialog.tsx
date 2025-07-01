import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Sparkles, Lightbulb, Zap, Wand2, Brain, Code, Bot, Stars, Rocket } from 'lucide-react';
import { availableModels } from '@/lib/ai-service';
import { useToast } from '@/hooks/use-toast';

interface AIPromptDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (prompt: string, model: string, options: any) => void;
  initialPrompt?: string;
  ageGroup?: 'kids' | 'teens' | 'all';
}

export const AIPromptDialog: React.FC<AIPromptDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialPrompt = '',
  ageGroup = 'kids'
}) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState('rhythm-core-v0.1.0');
  const [promptType, setPromptType] = useState<'free' | 'templates'>('free');
  const [temperature, setTemperature] = useState(0.7);
  const [useContext, setUseContext] = useState(true);
  const { toast } = useToast();
  
  // Predefined prompts for kids
  const kidPrompts = [
    {
      title: 'Make a Pet Page',
      prompt: 'Create a colorful page about pets with pictures and fun facts',
      icon: <Stars className="h-4 w-4" />
    },
    {
      title: 'My Hobby Page',
      prompt: 'Make a page about a cool hobby with pictures and information',
      icon: <Rocket className="h-4 w-4" />
    },
    {
      title: 'School Project',
      prompt: 'Create an educational page for a school project with headings and lists',
      icon: <Brain className="h-4 w-4" />
    },
    {
      title: 'My Story',
      prompt: 'Create a page to tell a story with a beginning, middle, and end',
      icon: <Bot className="h-4 w-4" />
    },
    {
      title: 'Family Page',
      prompt: 'Make a family page with sections for each family member',
      icon: <Sparkles className="h-4 w-4" />
    }
  ];
  
  // Regular prompts
  const regularPrompts = [
    {
      title: 'Landing Page',
      prompt: 'Create a professional landing page with hero section, features, and contact info',
      icon: <Zap className="h-4 w-4" />
    },
    {
      title: 'Portfolio',
      prompt: 'Generate a portfolio page with work samples, skills, and contact form',
      icon: <Lightbulb className="h-4 w-4" />
    },
    {
      title: 'Blog Post',
      prompt: 'Create a blog post layout with title, content, and author information',
      icon: <Code className="h-4 w-4" />
    },
    {
      title: 'Product Page',
      prompt: 'Generate a product showcase page with images, descriptions, and pricing',
      icon: <Wand2 className="h-4 w-4" />
    }
  ];
  
  const prompts = ageGroup === 'kids' ? kidPrompts : regularPrompts;
  
  const handleSubmit = () => {
    if (!prompt.trim()) {
      toast({
        title: ageGroup === 'kids' ? 'Oops! Need an idea' : 'Prompt required',
        description: ageGroup === 'kids' 
          ? 'Please tell me what kind of page you want to make!' 
          : 'Please enter a prompt to generate content',
        variant: 'destructive'
      });
      return;
    }
    
    setLoading(true);
    
    const options = {
      temperature,
      useContext
    };
    
    onSubmit(prompt, model, options);
    
    // Reset state after submission
    setLoading(false);
    setPrompt('');
  };
  
  const renderKidPromptButtons = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-2">
        {prompts.map((promptItem, index) => (
          <button
            key={index}
            className="flex items-center p-3 border rounded-lg hover:bg-accent hover:border-primary transition-colors"
            onClick={() => setPrompt(promptItem.prompt)}
          >
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary mr-3">
              {promptItem.icon}
            </div>
            <div className="text-left">
              <div className="font-medium text-sm">{promptItem.title}</div>
              <div className="text-xs text-muted-foreground truncate">
                {promptItem.prompt.length > 40 
                  ? promptItem.prompt.substring(0, 40) + '...' 
                  : promptItem.prompt}
              </div>
            </div>
          </button>
        ))}
      </div>
    );
  };
  
  const renderRegularPromptButtons = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-2">
        {prompts.map((promptItem, index) => (
          <button
            key={index}
            className="flex items-center p-3 border rounded-lg hover:bg-accent hover:border-primary transition-colors"
            onClick={() => setPrompt(promptItem.prompt)}
          >
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary mr-3">
              {promptItem.icon}
            </div>
            <div className="text-left">
              <div className="font-medium text-sm">{promptItem.title}</div>
              <div className="text-xs text-muted-foreground">
                {promptItem.prompt.length > 50 
                  ? promptItem.prompt.substring(0, 50) + '...' 
                  : promptItem.prompt}
              </div>
            </div>
          </button>
        ))}
      </div>
    );
  };
  
  const handleModelChange = (value: string) => {
    setModel(value);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-primary" />
            {ageGroup === 'kids' 
              ? 'Magic Page Creator' 
              : 'AI Content Generator'}
          </DialogTitle>
          <DialogDescription>
            {ageGroup === 'kids'
              ? "Tell me what kind of page you want to make, and I'll help you create it!"
              : "Describe what you want to create and our AI will generate it for you."}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="free" onValueChange={(value) => setPromptType(value as 'free' | 'templates')}>
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="free" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span>{ageGroup === 'kids' ? 'Your Idea' : 'Custom Prompt'}</span>
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              <span>{ageGroup === 'kids' ? 'Quick Ideas' : 'Templates'}</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="free" className="space-y-4 mt-4">
            <Textarea
              placeholder={
                ageGroup === 'kids' 
                  ? "Describe the page you want to make... (Example: 'A page about dinosaurs with pictures and facts')" 
                  : "What would you like the AI to generate? Be specific and detailed."
              }
              className="min-h-[100px]"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </TabsContent>
          
          <TabsContent value="templates" className="mt-4">
            <ScrollArea className="h-[200px] rounded-md border p-2">
              {ageGroup === 'kids' ? renderKidPromptButtons() : renderRegularPromptButtons()}
            </ScrollArea>
          </TabsContent>
        </Tabs>
        
        <div className="grid gap-4 pt-4">
          {ageGroup !== 'kids' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="temperature">Creativity (Temperature)</Label>
                <span className="text-xs text-muted-foreground">{temperature}</span>
              </div>
              <Slider
                id="temperature"
                min={0}
                max={1}
                step={0.1}
                value={[temperature]}
                onValueChange={(value) => setTemperature(value[0])}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>More Precise</span>
                <span>More Creative</span>
              </div>
            </div>
          )}
          
          {ageGroup !== 'kids' && (
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="context-switch">Use Current Page Context</Label>
                <p className="text-xs text-muted-foreground">
                  Consider the current page content when generating
                </p>
              </div>
              <Switch
                id="context-switch"
                checked={useContext}
                onCheckedChange={setUseContext}
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label>{ageGroup === 'kids' ? 'Creative Helper' : 'AI Model'}</Label>
            <RadioGroup 
              value={model} 
              onValueChange={handleModelChange}
              className="flex flex-wrap gap-2"
            >
              {ageGroup === 'kids' ? (
                <>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="rhythm-core-v0.1.0" id="rhythm-core" />
                    <Label htmlFor="rhythm-core" className="flex items-center">
                      <Rocket className="h-4 w-4 mr-1" />
                      Super Helper
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="rhythm-creative-v0.1.0" id="rhythm-creative" />
                    <Label htmlFor="rhythm-creative" className="flex items-center">
                      <Stars className="h-4 w-4 mr-1" />
                      Extra Creative
                    </Label>
                  </div>
                </>
              ) : (
                availableModels?.map(modelOption => (
                  <div key={modelOption} className="flex items-center space-x-2">
                    <RadioGroupItem value={modelOption} id={modelOption} />
                    <Label htmlFor={modelOption}>{modelOption}</Label>
                  </div>
                )) || []
              )}
            </RadioGroup>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {ageGroup === 'kids' ? 'Cancel' : 'Cancel'}
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <span className="flex items-center">
                <Sparkles className="animate-spin h-4 w-4 mr-2" />
                {ageGroup === 'kids' ? 'Creating...' : 'Generating...'}
              </span>
            ) : (
              <span className="flex items-center">
                <Sparkles className="h-4 w-4 mr-2" />
                {ageGroup === 'kids' ? 'Create My Page!' : 'Generate Content'}
              </span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};