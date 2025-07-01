import React, { useState, useEffect } from 'react';
import { Block } from './VisualBlockEditor';
import { cn } from '@/lib/utils';
import { 
  Layout, 
  Heading, 
  Paragraph, 
  Image, 
  Button,
  List,
  Video,
  Embed,
  Form
} from './blocks';
import { Eye, EyeOff, RefreshCw, Smartphone, Tablet, Monitor, ExternalLink } from 'lucide-react';
import { Button as UIButton } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface LivePreviewProps {
  blocks: Block[];
  title: string;
  readOnly?: boolean;
  ageGroup?: 'kids' | 'teens' | 'all';
}

export const LivePreview: React.FC<LivePreviewProps> = ({
  blocks,
  title,
  readOnly = true,
  ageGroup = 'kids'
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [customStyles, setCustomStyles] = useState<string>('');
  
  useEffect(() => {
    // Extract custom styles from blocks if any
    const styleBlocks = blocks.filter(block => 
      block.type === 'style' && typeof block.content === 'string'
    );
    
    if (styleBlocks.length > 0) {
      setCustomStyles(styleBlocks.map(block => block.content).join('\n'));
    }
  }, [blocks]);
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };
  
  const getViewportClass = () => {
    switch (viewMode) {
      case 'mobile':
        return 'max-w-[375px]';
      case 'tablet':
        return 'max-w-[768px]';
      case 'desktop':
      default:
        return 'max-w-none';
    }
  };
  
  const renderBlock = (block: Block) => {
    if (block.type === 'style') return null; // Skip style blocks in rendering
    
    switch (block.type) {
      case 'heading':
        return (
          <Heading 
            content={block.content} 
            onChange={() => {}} // No-op in preview
            settings={block.settings}
          />
        );
      case 'paragraph':
        return (
          <Paragraph 
            content={block.content} 
            onChange={() => {}} // No-op in preview
            settings={block.settings}
          />
        );
      case 'image':
        return (
          <Image 
            content={block.content} 
            onChange={() => {}} // No-op in preview
            settings={block.settings}
          />
        );
      case 'button':
        return (
          <Button 
            content={block.content} 
            onChange={() => {}} // No-op in preview
            settings={block.settings}
          />
        );
      case 'list':
        return (
          <List 
            content={block.content} 
            onChange={() => {}} // No-op in preview
            settings={block.settings}
          />
        );
      case 'layout':
        return (
          <Layout 
            content={block.content} 
            onChange={() => {}} // No-op in preview
            settings={block.settings}
          />
        );
      case 'video':
        return (
          <Video 
            content={block.content} 
            onChange={() => {}} // No-op in preview
            settings={block.settings}
          />
        );
      case 'embed':
        return (
          <Embed 
            content={block.content} 
            onChange={() => {}} // No-op in preview
            settings={block.settings}
          />
        );
      case 'form':
        return (
          <Form 
            content={block.content} 
            onChange={() => {}} // No-op in preview
            settings={block.settings}
          />
        );
      default:
        return <div>Unknown block type: {block.type}</div>;
    }
  };
  
  if (!isVisible) {
    return (
      <div className="flex justify-center mt-4">
        <UIButton
          variant="outline"
          size="sm"
          onClick={() => setIsVisible(true)}
          className="flex items-center"
        >
          <Eye className="h-4 w-4 mr-2" />
          {ageGroup === 'kids' ? 'Show Preview' : 'Show Preview'}
        </UIButton>
      </div>
    );
  }
  
  return (
    <div className="live-preview mt-8 border-t border-gray-200 pt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium flex items-center">
          <Eye className="h-4 w-4 mr-2 text-gray-500" />
          {ageGroup === 'kids' ? 'See Your Page' : 'Live Preview'}
        </h3>
        
        <div className="flex items-center space-x-2">
          <Tabs defaultValue={viewMode} onValueChange={(value) => setViewMode(value as any)}>
            <TabsList className="grid grid-cols-3 h-8 w-auto">
              <TabsTrigger value="mobile" className="px-2 h-7">
                <Smartphone className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="tablet" className="px-2 h-7">
                <Tablet className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="desktop" className="px-2 h-7">
                <Monitor className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <UIButton
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleRefresh}
          >
            <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
          </UIButton>
          
          <UIButton
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsVisible(false)}
          >
            <EyeOff className="h-4 w-4" />
          </UIButton>
        </div>
      </div>
      
      <div className={cn(
        "preview-container border border-gray-200 rounded-md mx-auto transition-all duration-300",
        getViewportClass()
      )}>
        <div className="preview-header border-b border-gray-200 p-2 flex items-center justify-between bg-gray-50">
          <div className="flex items-center">
            <div className="flex space-x-1 mr-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="text-xs text-gray-500 truncate max-w-[200px]">
              {title || 'Untitled Page'}
            </div>
          </div>
          
          <UIButton
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            title="Open in new tab"
          >
            <ExternalLink className="h-3 w-3" />
          </UIButton>
        </div>
        
        <div className="preview-content p-4 bg-white">
          <style dangerouslySetInnerHTML={{ __html: customStyles }} />
          
          <h1 className="text-2xl font-bold mb-4 text-center">{title}</h1>
          
          {blocks.map((block) => (
            <div key={block.id} className="preview-block mb-4">
              {renderBlock(block)}
            </div>
          ))}
          
          {blocks.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              {ageGroup === 'kids' 
                ? 'Add some blocks to see your page here!' 
                : 'No content to preview yet. Add some blocks to get started.'}
            </div>
          )}
        </div>
      </div>
      
      {ageGroup === 'kids' && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            This is how your page will look to other people! 
            Try the phone or tablet buttons to see how it looks on different devices.
          </p>
        </div>
      )}
    </div>
  );
};