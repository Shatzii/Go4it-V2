import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
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
import { 
  PlusCircle, 
  Trash2, 
  MoveUp, 
  MoveDown, 
  Copy, 
  Wand2, 
  Save,
  Undo,
  Redo
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { BlockToolbar } from './BlockToolbar';
import { useToast } from '@/hooks/use-toast';
import { Button as UIButton } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { AIPromptDialog } from './AIPromptDialog';
import { ComponentLibrary } from './ComponentLibrary';
import { LivePreview } from './LivePreview';

export interface Block {
  id: string;
  type: string;
  content: any;
  settings?: Record<string, any>;
}

interface BlockProps {
  block: Block;
  index: number;
  moveBlock: (dragIndex: number, hoverIndex: number) => void;
  onEdit: (id: string, content: any) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onSettingsChange: (id: string, settings: Record<string, any>) => void;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

const BlockTypes = {
  LAYOUT: 'layout',
  HEADING: 'heading',
  PARAGRAPH: 'paragraph',
  IMAGE: 'image',
  BUTTON: 'button',
  LIST: 'list',
  VIDEO: 'video',
  EMBED: 'embed',
  FORM: 'form'
};

const BlockItem: React.FC<BlockProps> = ({ 
  block, 
  index, 
  moveBlock, 
  onEdit, 
  onDelete, 
  onDuplicate,
  onSettingsChange,
  isSelected,
  onSelect
}) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const [{ handlerId }, drop] = useDrop({
    accept: 'BLOCK',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveBlock(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'BLOCK',
    item: () => {
      return { id: block.id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));
  
  const renderBlockContent = () => {
    switch (block.type) {
      case BlockTypes.LAYOUT:
        return (
          <Layout 
            content={block.content} 
            onChange={(content) => onEdit(block.id, content)} 
            settings={block.settings}
          />
        );
      case BlockTypes.HEADING:
        return (
          <Heading 
            content={block.content} 
            onChange={(content) => onEdit(block.id, content)} 
            settings={block.settings}
          />
        );
      case BlockTypes.PARAGRAPH:
        return (
          <Paragraph 
            content={block.content} 
            onChange={(content) => onEdit(block.id, content)} 
            settings={block.settings}
          />
        );
      case BlockTypes.IMAGE:
        return (
          <Image 
            content={block.content} 
            onChange={(content) => onEdit(block.id, content)} 
            settings={block.settings}
          />
        );
      case BlockTypes.BUTTON:
        return (
          <Button 
            content={block.content} 
            onChange={(content) => onEdit(block.id, content)} 
            settings={block.settings}
          />
        );
      case BlockTypes.LIST:
        return (
          <List 
            content={block.content} 
            onChange={(content) => onEdit(block.id, content)} 
            settings={block.settings}
          />
        );
      case BlockTypes.VIDEO:
        return (
          <Video 
            content={block.content} 
            onChange={(content) => onEdit(block.id, content)} 
            settings={block.settings}
          />
        );
      case BlockTypes.EMBED:
        return (
          <Embed 
            content={block.content} 
            onChange={(content) => onEdit(block.id, content)} 
            settings={block.settings}
          />
        );
      case BlockTypes.FORM:
        return (
          <Form 
            content={block.content} 
            onChange={(content) => onEdit(block.id, content)} 
            settings={block.settings}
          />
        );
      default:
        return <div>Unknown block type: {block.type}</div>;
    }
  };

  return (
    <div 
      ref={ref}
      className={cn(
        "relative border border-dashed p-4 mb-4 rounded-md transition-all",
        isDragging ? "opacity-50" : "opacity-100",
        isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-400"
      )}
      onClick={() => onSelect(block.id)}
      data-handler-id={handlerId}
    >
      {isSelected && (
        <div className="absolute -top-10 left-0 right-0 bg-white border border-gray-200 rounded-t-md shadow-sm flex items-center space-x-1 p-1 z-10">
          <Badge variant="outline" className="mr-2">
            {block.type}
          </Badge>
          <UIButton variant="ghost" size="icon" onClick={() => moveBlock(index, Math.max(0, index - 1))} title="Move up">
            <MoveUp className="h-4 w-4" />
          </UIButton>
          <UIButton variant="ghost" size="icon" onClick={() => moveBlock(index, index + 1)} title="Move down">
            <MoveDown className="h-4 w-4" />
          </UIButton>
          <UIButton variant="ghost" size="icon" onClick={() => onDuplicate(block.id)} title="Duplicate">
            <Copy className="h-4 w-4" />
          </UIButton>
          <UIButton variant="ghost" size="icon" onClick={() => onDelete(block.id)} title="Delete">
            <Trash2 className="h-4 w-4" />
          </UIButton>
        </div>
      )}
      
      {renderBlockContent()}
    </div>
  );
};

interface VisualBlockEditorProps {
  initialBlocks?: Block[];
  onChange?: (blocks: Block[]) => void;
  onSave?: (blocks: Block[]) => void;
  readOnly?: boolean;
  ageGroup?: 'kids' | 'teens' | 'all';
}

export const VisualBlockEditor: React.FC<VisualBlockEditorProps> = ({ 
  initialBlocks = [], 
  onChange,
  onSave,
  readOnly = false,
  ageGroup = 'kids'
}) => {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [history, setHistory] = useState<Block[][]>([initialBlocks]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [pageTitle, setPageTitle] = useState('My Awesome Page');
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);
  const [isComponentLibraryOpen, setIsComponentLibraryOpen] = useState(false);
  const { toast } = useToast();

  // Generate a unique ID for new blocks
  const generateId = () => {
    return Math.random().toString(36).substring(2, 9);
  };

  // Create a history point for undo/redo
  const createHistoryPoint = useCallback((newBlocks: Block[]) => {
    // Slice off any forward history if we've gone back in time
    const newHistory = history.slice(0, historyIndex + 1);
    // Add the new blocks to history
    newHistory.push(JSON.parse(JSON.stringify(newBlocks)));
    // Limit history to 50 states to prevent memory issues
    if (newHistory.length > 50) {
      newHistory.shift();
    }
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  // Add a new block to the editor
  const addBlock = useCallback((type: string) => {
    let newContent: any;
    let newSettings: Record<string, any> = {};
    
    // Set default content based on block type
    switch (type) {
      case BlockTypes.LAYOUT:
        newContent = {
          columns: [
            { width: '1/2', blocks: [] },
            { width: '1/2', blocks: [] }
          ]
        };
        break;
      case BlockTypes.HEADING:
        newContent = ageGroup === 'kids' ? 'My Fun Title' : 'New Heading';
        newSettings = { level: 'h2' };
        break;
      case BlockTypes.PARAGRAPH:
        newContent = ageGroup === 'kids' 
          ? 'Write your story here! What amazing adventures will you share?' 
          : 'Enter your content here...';
        break;
      case BlockTypes.IMAGE:
        newContent = {
          src: '',
          alt: 'Descriptive image text',
          caption: ''
        };
        break;
      case BlockTypes.BUTTON:
        newContent = {
          text: ageGroup === 'kids' ? 'Click Me!' : 'Button Text',
          url: '#'
        };
        newSettings = { 
          style: 'primary',
          size: 'medium'
        };
        break;
      case BlockTypes.LIST:
        newContent = {
          items: ageGroup === 'kids' 
            ? ['Item 1', 'Item 2', 'Add more fun things!'] 
            : ['Item 1', 'Item 2', 'Item 3']
        };
        newSettings = { type: 'bullet' };
        break;
      case BlockTypes.VIDEO:
        newContent = {
          url: '',
          caption: ''
        };
        break;
      case BlockTypes.EMBED:
        newContent = {
          code: '',
          height: 400
        };
        break;
      case BlockTypes.FORM:
        newContent = {
          fields: [
            { type: 'text', label: 'Name', required: true },
            { type: 'email', label: 'Email', required: true },
            { type: 'textarea', label: 'Message', required: false }
          ],
          submitText: 'Send'
        };
        break;
      default:
        newContent = '';
    }

    const newBlock: Block = {
      id: generateId(),
      type,
      content: newContent,
      settings: newSettings
    };

    const newBlocks = [...blocks, newBlock];
    setBlocks(newBlocks);
    setSelectedBlockId(newBlock.id);
    createHistoryPoint(newBlocks);
    
    if (onChange) {
      onChange(newBlocks);
    }
    
    toast({
      title: ageGroup === 'kids' ? 'Yay! New block added!' : 'Block added',
      description: ageGroup === 'kids' ? 'Now you can edit it to make it your own!' : 'You can now edit the new block'
    });
  }, [blocks, onChange, createHistoryPoint, toast, ageGroup]);

  // Edit a block's content
  const handleEditBlock = useCallback((id: string, content: any) => {
    const newBlocks = blocks.map(block => 
      block.id === id ? { ...block, content } : block
    );
    setBlocks(newBlocks);
    
    if (onChange) {
      onChange(newBlocks);
    }
  }, [blocks, onChange]);

  // Delete a block
  const handleDeleteBlock = useCallback((id: string) => {
    const newBlocks = blocks.filter(block => block.id !== id);
    setBlocks(newBlocks);
    setSelectedBlockId(null);
    createHistoryPoint(newBlocks);
    
    if (onChange) {
      onChange(newBlocks);
    }
    
    toast({
      title: ageGroup === 'kids' ? 'Block removed!' : 'Block deleted',
      description: ageGroup === 'kids' ? 'Poof! It\'s gone!' : 'The block has been removed'
    });
  }, [blocks, onChange, createHistoryPoint, toast, ageGroup]);

  // Duplicate a block
  const handleDuplicateBlock = useCallback((id: string) => {
    const blockToDuplicate = blocks.find(block => block.id === id);
    if (!blockToDuplicate) return;
    
    const duplicatedBlock: Block = {
      ...JSON.parse(JSON.stringify(blockToDuplicate)),
      id: generateId()
    };
    
    const blockIndex = blocks.findIndex(block => block.id === id);
    const newBlocks = [
      ...blocks.slice(0, blockIndex + 1),
      duplicatedBlock,
      ...blocks.slice(blockIndex + 1)
    ];
    
    setBlocks(newBlocks);
    setSelectedBlockId(duplicatedBlock.id);
    createHistoryPoint(newBlocks);
    
    if (onChange) {
      onChange(newBlocks);
    }
    
    toast({
      title: ageGroup === 'kids' ? 'Block duplicated!' : 'Block duplicated',
      description: ageGroup === 'kids' ? 'Now you have two of them!' : 'A copy of the block has been created'
    });
  }, [blocks, onChange, createHistoryPoint, toast, ageGroup]);

  // Update a block's settings
  const handleSettingsChange = useCallback((id: string, settings: Record<string, any>) => {
    const newBlocks = blocks.map(block => 
      block.id === id ? { ...block, settings: { ...block.settings, ...settings } } : block
    );
    setBlocks(newBlocks);
    
    if (onChange) {
      onChange(newBlocks);
    }
  }, [blocks, onChange]);

  // Move a block (drag and drop)
  const moveBlock = useCallback((dragIndex: number, hoverIndex: number) => {
    if (hoverIndex < 0 || hoverIndex >= blocks.length) return;
    
    const draggedBlock = blocks[dragIndex];
    const newBlocks = [...blocks];
    newBlocks.splice(dragIndex, 1);
    newBlocks.splice(hoverIndex, 0, draggedBlock);
    
    setBlocks(newBlocks);
    
    if (onChange) {
      onChange(newBlocks);
    }
  }, [blocks, onChange]);

  // Undo function
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setBlocks(history[newIndex]);
      
      if (onChange) {
        onChange(history[newIndex]);
      }
      
      toast({
        title: ageGroup === 'kids' ? 'Oops! Went back!' : 'Undo successful',
        description: ageGroup === 'kids' ? 'You went back in time!' : 'Previous state restored'
      });
    }
  }, [history, historyIndex, onChange, toast, ageGroup]);

  // Redo function
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setBlocks(history[newIndex]);
      
      if (onChange) {
        onChange(history[newIndex]);
      }
      
      toast({
        title: ageGroup === 'kids' ? 'Woohoo! Went forward!' : 'Redo successful',
        description: ageGroup === 'kids' ? 'You went forward in time!' : 'Later state restored'
      });
    }
  }, [history, historyIndex, onChange, toast, ageGroup]);

  // Save function
  const handleSave = useCallback(() => {
    if (onSave) {
      onSave(blocks);
    }
    
    toast({
      title: ageGroup === 'kids' ? 'Great job! Page saved!' : 'Page saved successfully',
      description: ageGroup === 'kids' ? 'Your amazing work has been saved!' : 'All your changes have been saved'
    });
  }, [blocks, onSave, toast, ageGroup]);

  // AI prompt handler
  const handleAIPrompt = useCallback((prompt: string) => {
    setIsAIDialogOpen(false);
    
    // For now, simulate AI generation with predetermined blocks
    setTimeout(() => {
      let aiGeneratedBlocks: Block[] = [];
      
      if (prompt.toLowerCase().includes('story')) {
        aiGeneratedBlocks = [
          {
            id: generateId(),
            type: BlockTypes.HEADING,
            content: 'My Adventure Story',
            settings: { level: 'h1' }
          },
          {
            id: generateId(),
            type: BlockTypes.IMAGE,
            content: {
              src: 'https://placehold.co/600x400?text=Adventure+Image',
              alt: 'An exciting adventure scene',
              caption: 'Our adventure begins!'
            }
          },
          {
            id: generateId(),
            type: BlockTypes.PARAGRAPH,
            content: 'Once upon a time in a magical forest, a brave little explorer named Alex discovered a hidden path. The trees whispered secrets and the birds sang songs of ancient treasure.'
          },
          {
            id: generateId(),
            type: BlockTypes.PARAGRAPH,
            content: 'With a trusty backpack and a map drawn on old parchment, Alex followed the winding trail deeper into the woods. What adventures awaited? Only the journey would tell!'
          }
        ];
      } else if (prompt.toLowerCase().includes('science')) {
        aiGeneratedBlocks = [
          {
            id: generateId(),
            type: BlockTypes.HEADING,
            content: 'Amazing Science Facts',
            settings: { level: 'h1' }
          },
          {
            id: generateId(),
            type: BlockTypes.LIST,
            content: {
              items: [
                'The human body has over 600 muscles!',
                'A year on Jupiter is equal to 12 Earth years',
                'Octopuses have three hearts',
                'Butterflies taste with their feet'
              ]
            },
            settings: { type: 'bullet' }
          },
          {
            id: generateId(),
            type: BlockTypes.IMAGE,
            content: {
              src: 'https://placehold.co/600x400?text=Science+Image',
              alt: 'Science experiment',
              caption: 'Science is amazing!'
            }
          }
        ];
      } else {
        aiGeneratedBlocks = [
          {
            id: generateId(),
            type: BlockTypes.HEADING,
            content: 'My Amazing Page',
            settings: { level: 'h1' }
          },
          {
            id: generateId(),
            type: BlockTypes.PARAGRAPH,
            content: 'This is a page created with AI help. You can edit everything you see here to make it your own!'
          },
          {
            id: generateId(),
            type: BlockTypes.BUTTON,
            content: {
              text: 'Click Me!',
              url: '#'
            },
            settings: { 
              style: 'primary',
              size: 'large'
            }
          }
        ];
      }
      
      const newBlocks = [...blocks, ...aiGeneratedBlocks];
      setBlocks(newBlocks);
      createHistoryPoint(newBlocks);
      
      if (onChange) {
        onChange(newBlocks);
      }
      
      toast({
        title: ageGroup === 'kids' ? 'Magic content appeared!' : 'AI content generated',
        description: ageGroup === 'kids' ? 'The AI wizard created some cool blocks for you!' : 'AI-generated blocks have been added'
      });
    }, 1500);
    
    toast({
      title: 'AI is thinking...',
      description: ageGroup === 'kids' ? 'The AI wizard is creating something special for you!' : 'Generating content based on your prompt'
    });
  }, [blocks, onChange, createHistoryPoint, toast, ageGroup]);

  useEffect(() => {
    // Update blocks if initialBlocks changes from parent
    if (JSON.stringify(initialBlocks) !== JSON.stringify(blocks) && 
        JSON.stringify(initialBlocks) !== JSON.stringify(history[0])) {
      setBlocks(initialBlocks);
      setHistory([initialBlocks]);
      setHistoryIndex(0);
    }
  }, [initialBlocks]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="visual-block-editor">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4 mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Input
              value={pageTitle}
              onChange={(e) => setPageTitle(e.target.value)}
              className="text-xl font-semibold border-0 focus-visible:ring-0 p-0 h-auto"
              placeholder="Page Title"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <UIButton variant="outline" size="sm" onClick={handleUndo} disabled={historyIndex <= 0}>
              <Undo className="h-4 w-4 mr-1" />
              {ageGroup === 'kids' ? 'Go Back' : 'Undo'}
            </UIButton>
            <UIButton variant="outline" size="sm" onClick={handleRedo} disabled={historyIndex >= history.length - 1}>
              <Redo className="h-4 w-4 mr-1" />
              {ageGroup === 'kids' ? 'Go Forward' : 'Redo'}
            </UIButton>
            <UIButton variant="outline" size="sm" onClick={() => setIsComponentLibraryOpen(true)}>
              <BookMarked className="h-4 w-4 mr-1" />
              {ageGroup === 'kids' ? 'Learning Blocks' : 'Components'}
            </UIButton>
            <UIButton variant="outline" size="sm" onClick={() => setIsAIDialogOpen(true)}>
              <Wand2 className="h-4 w-4 mr-1" />
              {ageGroup === 'kids' ? 'Magic Helper' : 'AI Assist'}
            </UIButton>
            <UIButton variant="default" size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-1" />
              {ageGroup === 'kids' ? 'Save My Page' : 'Save Page'}
            </UIButton>
          </div>
        </div>

        <div className="flex">
          <div className="w-64 border-r border-gray-200 p-4 hidden md:block">
            <h3 className="font-semibold mb-3">
              {ageGroup === 'kids' ? 'Building Blocks' : 'Add Blocks'}
            </h3>
            <div className="space-y-2">
              <UIButton
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => addBlock(BlockTypes.HEADING)}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                {ageGroup === 'kids' ? 'Title' : 'Heading'}
              </UIButton>
              <UIButton
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => addBlock(BlockTypes.PARAGRAPH)}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                {ageGroup === 'kids' ? 'Text' : 'Paragraph'}
              </UIButton>
              <UIButton
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => addBlock(BlockTypes.IMAGE)}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                {ageGroup === 'kids' ? 'Picture' : 'Image'}
              </UIButton>
              <UIButton
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => addBlock(BlockTypes.BUTTON)}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Button
              </UIButton>
              <UIButton
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => addBlock(BlockTypes.LIST)}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                List
              </UIButton>
              <UIButton
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => addBlock(BlockTypes.LAYOUT)}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                {ageGroup === 'kids' ? 'Columns' : 'Layout'}
              </UIButton>
              <UIButton
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => addBlock(BlockTypes.VIDEO)}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Video
              </UIButton>
              <UIButton
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => addBlock(BlockTypes.FORM)}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                {ageGroup === 'kids' ? 'Questionnaire' : 'Form'}
              </UIButton>
            </div>
          </div>
          
          <div className="flex-1 p-4">
            {blocks.length === 0 ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {ageGroup === 'kids' 
                    ? 'Let\'s start creating!' 
                    : 'Start building your page'}
                </h3>
                <p className="text-gray-500 mb-4">
                  {ageGroup === 'kids'
                    ? 'Click a building block from the menu to add it here'
                    : 'Add blocks from the sidebar to build your page'}
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <UIButton onClick={() => addBlock(BlockTypes.HEADING)}>
                    {ageGroup === 'kids' ? 'Add a Title' : 'Add Heading'}
                  </UIButton>
                  <UIButton variant="outline" onClick={() => setIsAIDialogOpen(true)}>
                    {ageGroup === 'kids' ? 'Get AI Help' : 'Generate with AI'}
                  </UIButton>
                </div>
              </div>
            ) : (
              <div className="blocks-container">
                {blocks.map((block, index) => (
                  <BlockItem
                    key={block.id}
                    block={block}
                    index={index}
                    moveBlock={moveBlock}
                    onEdit={handleEditBlock}
                    onDelete={handleDeleteBlock}
                    onDuplicate={handleDuplicateBlock}
                    onSettingsChange={handleSettingsChange}
                    isSelected={selectedBlockId === block.id}
                    onSelect={setSelectedBlockId}
                  />
                ))}
              </div>
            )}
            
            {/* Mobile fab for adding blocks */}
            <div className="md:hidden fixed bottom-4 right-4">
              <UIButton
                size="icon"
                className="h-14 w-14 rounded-full shadow-lg"
                onClick={() => {
                  // Show a simplified block menu for mobile
                  toast({
                    title: "Add a block",
                    description: (
                      <div className="flex flex-wrap gap-2 mt-2">
                        <UIButton size="sm" variant="outline" onClick={() => addBlock(BlockTypes.HEADING)}>
                          Heading
                        </UIButton>
                        <UIButton size="sm" variant="outline" onClick={() => addBlock(BlockTypes.PARAGRAPH)}>
                          Text
                        </UIButton>
                        <UIButton size="sm" variant="outline" onClick={() => addBlock(BlockTypes.IMAGE)}>
                          Image
                        </UIButton>
                        <UIButton size="sm" variant="outline" onClick={() => addBlock(BlockTypes.BUTTON)}>
                          Button
                        </UIButton>
                      </div>
                    ),
                    duration: 5000,
                  });
                }}
              >
                <PlusCircle className="h-6 w-6" />
              </UIButton>
            </div>
          </div>
          
          {selectedBlockId && (
            <div className="w-80 border-l border-gray-200 p-4 hidden lg:block">
              <BlockToolbar
                block={blocks.find(b => b.id === selectedBlockId)!}
                onSettingsChange={(settings) => handleSettingsChange(selectedBlockId, settings)}
                onClose={() => setSelectedBlockId(null)}
                ageGroup={ageGroup}
              />
            </div>
          )}
        </div>
        
        {/* Live Preview */}
        <LivePreview 
          blocks={blocks}
          title={pageTitle}
          ageGroup={ageGroup}
        />
        
        {/* Dialogs */}
        <AIPromptDialog 
          isOpen={isAIDialogOpen} 
          onClose={() => setIsAIDialogOpen(false)}
          onSubmit={handleAIPrompt}
          ageGroup={ageGroup}
        />
        
        <ComponentLibrary
          isOpen={isComponentLibraryOpen}
          onClose={() => setIsComponentLibraryOpen(false)}
          onInsert={(newBlocks) => {
            const blocksWithIds = newBlocks.map(block => ({
              ...block,
              id: generateId()
            }));
            
            const updatedBlocks = [...blocks, ...blocksWithIds];
            setBlocks(updatedBlocks);
            createHistoryPoint(updatedBlocks);
            
            if (onChange) {
              onChange(updatedBlocks);
            }
            
            toast({
              title: ageGroup === 'kids' ? 'Learning blocks added!' : 'Component inserted',
              description: ageGroup === 'kids' ? 'Your learning blocks are ready to use!' : 'Educational component has been added to your page'
            });
          }}
          ageGroup={ageGroup}
        />
      </div>
    </DndProvider>
  );
};

export default VisualBlockEditor;