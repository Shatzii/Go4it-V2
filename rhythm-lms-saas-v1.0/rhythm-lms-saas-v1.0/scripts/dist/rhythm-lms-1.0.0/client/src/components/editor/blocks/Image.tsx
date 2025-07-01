import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImagePlus, Link, X } from 'lucide-react';

interface ImageProps {
  content: string;
  onChange: (content: string) => void;
  settings?: {
    align?: 'left' | 'center' | 'right';
    width?: string;
    height?: string;
    alt?: string;
    rounded?: boolean;
    shadow?: boolean;
    border?: boolean;
    caption?: string;
    link?: string;
  };
}

export const Image: React.FC<ImageProps> = ({
  content,
  onChange,
  settings = {}
}) => {
  const {
    align = 'center',
    width = '100%',
    height = 'auto',
    alt = '',
    rounded = false,
    shadow = false,
    border = false,
    caption = '',
    link
  } = settings;

  const [isEditing, setIsEditing] = useState(false);
  const [tempUrl, setTempUrl] = useState(content);
  const [tempAlt, setTempAlt] = useState(alt);
  const [tempCaption, setTempCaption] = useState(caption);

  // Map alignment to Tailwind classes
  const alignClasses = {
    left: 'mr-auto',
    center: 'mx-auto',
    right: 'ml-auto'
  };

  const handleUrlChange = () => {
    onChange(tempUrl);
    setIsEditing(false);
  };

  const handleUploadClick = () => {
    // In a real implementation, this would open a file picker
    alert('In a real implementation, this would open a file picker');
  };

  if (isEditing) {
    return (
      <div className="p-4 border border-dashed rounded-md bg-gray-50">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image-url">Image URL</Label>
            <div className="flex gap-2">
              <Input
                id="image-url"
                placeholder="https://example.com/image.jpg"
                value={tempUrl}
                onChange={(e) => setTempUrl(e.target.value)}
              />
              <Button variant="secondary" size="sm" onClick={handleUploadClick}>
                <ImagePlus className="h-4 w-4 mr-2" />
                Upload
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image-alt">Alt Text (for accessibility)</Label>
            <Input
              id="image-alt"
              placeholder="Describe the image"
              value={tempAlt}
              onChange={(e) => setTempAlt(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image-caption">Caption (optional)</Label>
            <Input
              id="image-caption"
              placeholder="Image caption"
              value={tempCaption}
              onChange={(e) => setTempCaption(e.target.value)}
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleUrlChange}>
              Save
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const ImageComponent = (
    <img
      src={content}
      alt={alt}
      className={cn(
        'max-w-full',
        alignClasses[align],
        rounded && 'rounded-lg',
        shadow && 'shadow-md',
        border && 'border'
      )}
      style={{ width, height }}
    />
  );

  const handleImageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsEditing(true);
  };

  return (
    <figure className="relative group my-4">
      <div className="relative">
        {link ? (
          <a href={link} target="_blank" rel="noopener noreferrer">
            {ImageComponent}
          </a>
        ) : (
          ImageComponent
        )}
        
        <button 
          className="absolute top-2 right-2 bg-white/80 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleImageClick}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      
      {caption && (
        <figcaption className={cn(
          'mt-2 text-sm text-gray-600',
          `text-${align}`
        )}>
          {caption}
        </figcaption>
      )}
      
      {(!content || content === 'https://via.placeholder.com/640x360') && (
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 cursor-pointer"
          onClick={handleImageClick}
        >
          <ImagePlus className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">Add an image</p>
        </div>
      )}
    </figure>
  );
};