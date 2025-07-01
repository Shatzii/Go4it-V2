import React from 'react';
import { cn } from '@/lib/utils';

interface ListProps {
  content: string[] | string;
  onChange: (content: string[]) => void;
  settings?: {
    style?: 'ordered' | 'unordered' | 'checklist';
    iconType?: 'disc' | 'circle' | 'square' | 'emoji' | 'number';
    emoji?: string;
    spacing?: 'tight' | 'normal' | 'relaxed';
    color?: string;
    size?: 'small' | 'medium' | 'large';
    align?: 'left' | 'center' | 'right';
  };
}

export const List: React.FC<ListProps> = ({
  content,
  onChange,
  settings = {}
}) => {
  const {
    style = 'unordered',
    iconType = 'disc',
    emoji = '✓',
    spacing = 'normal',
    color,
    size = 'medium',
    align = 'left'
  } = settings;

  // Convert string content to array if necessary
  const items = Array.isArray(content) 
    ? content 
    : content.split('\n').filter(item => item.trim() !== '');

  // Map spacing to Tailwind classes
  const getSpacingClass = () => {
    switch (spacing) {
      case 'tight':
        return 'space-y-1';
      case 'normal':
        return 'space-y-2';
      case 'relaxed':
        return 'space-y-4';
      default:
        return 'space-y-2';
    }
  };

  // Map size to Tailwind classes
  const getSizeClass = () => {
    switch (size) {
      case 'small':
        return 'text-sm';
      case 'medium':
        return 'text-base';
      case 'large':
        return 'text-lg';
      default:
        return 'text-base';
    }
  };

  // Map alignment to Tailwind classes
  const getAlignClass = () => {
    switch (align) {
      case 'left':
        return 'text-left';
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      default:
        return 'text-left';
    }
  };

  // Get list style and icon type
  const getListStyleClass = () => {
    if (style === 'ordered') {
      return 'list-decimal';
    }
    
    if (style === 'checklist') {
      return 'list-none';
    }
    
    // Unordered list
    switch (iconType) {
      case 'disc':
        return 'list-disc';
      case 'circle':
        return 'list-circle';
      case 'square':
        return 'list-square';
      case 'emoji':
        return 'list-none';
      default:
        return 'list-disc';
    }
  };

  // Handle item change
  const handleItemChange = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    onChange(newItems);
  };

  // Handle item deletion
  const handleItemDelete = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onChange(newItems);
  };

  // Handle adding a new item
  const handleAddItem = () => {
    onChange([...items, 'New item']);
  };

  // Generate style object for custom colors
  const customStyles = color ? { color } : {};

  return (
    <div className="my-4">
      {style === 'ordered' ? (
        <ol 
          className={cn(
            getListStyleClass(),
            getSpacingClass(),
            getSizeClass(),
            getAlignClass(),
            'pl-5'
          )}
          style={customStyles}
        >
          {items.map((item, index) => (
            <li 
              key={index}
              className="relative group"
            >
              <div 
                contentEditable
                suppressContentEditableWarning
                className="outline-none focus:ring-1 focus:ring-primary rounded px-1"
                onBlur={(e) => handleItemChange(index, e.currentTarget.textContent || '')}
                dangerouslySetInnerHTML={{ __html: item }}
              />
              <button
                className="absolute -left-5 top-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleItemDelete(index)}
                title="Delete item"
              >
                ✕
              </button>
            </li>
          ))}
        </ol>
      ) : style === 'checklist' ? (
        <ul 
          className={cn(
            getListStyleClass(),
            getSpacingClass(),
            getSizeClass(),
            getAlignClass(),
            'pl-5'
          )}
          style={customStyles}
        >
          {items.map((item, index) => (
            <li 
              key={index} 
              className="relative group flex items-start"
            >
              <span className="text-primary mr-2">{emoji}</span>
              <div 
                contentEditable
                suppressContentEditableWarning
                className="outline-none focus:ring-1 focus:ring-primary rounded px-1 flex-1"
                onBlur={(e) => handleItemChange(index, e.currentTarget.textContent || '')}
                dangerouslySetInnerHTML={{ __html: item }}
              />
              <button
                className="absolute -left-5 top-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleItemDelete(index)}
                title="Delete item"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <ul 
          className={cn(
            getListStyleClass(),
            getSpacingClass(),
            getSizeClass(),
            getAlignClass(),
            'pl-5'
          )}
          style={customStyles}
        >
          {items.map((item, index) => (
            <li 
              key={index} 
              className="relative group"
            >
              {iconType === 'emoji' && (
                <span className="absolute -left-5">{emoji}</span>
              )}
              <div 
                contentEditable
                suppressContentEditableWarning
                className="outline-none focus:ring-1 focus:ring-primary rounded px-1"
                onBlur={(e) => handleItemChange(index, e.currentTarget.textContent || '')}
                dangerouslySetInnerHTML={{ __html: item }}
              />
              <button
                className="absolute -left-5 top-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleItemDelete(index)}
                title="Delete item"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
      
      <button
        className="mt-2 text-sm text-primary hover:underline"
        onClick={handleAddItem}
      >
        + Add item
      </button>
    </div>
  );
};