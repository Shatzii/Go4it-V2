import React, { useState } from 'react';
import { X, Settings, ChevronRight, ChevronDown, Palette, AlignLeft, AlignCenter, AlignRight, AlignJustify, Type, ListOrdered, ListChecks, List as ListIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Block } from './VisualBlockEditor';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface BlockToolbarProps {
  block: Block;
  onSettingsChange: (settings: Record<string, any>) => void;
  onClose: () => void;
  ageGroup?: 'kids' | 'teens' | 'all';
}

export const BlockToolbar: React.FC<BlockToolbarProps> = ({
  block,
  onSettingsChange,
  onClose,
  ageGroup = 'all'
}) => {
  const [accordionState, setAccordionState] = useState<{
    appearance: boolean;
    layout: boolean;
    advanced: boolean;
  }>({
    appearance: true,
    layout: false,
    advanced: false
  });

  const toggleAccordion = (section: keyof typeof accordionState) => {
    setAccordionState(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const renderHeadingSettings = () => {
    const { level = 'h2', align = 'left', color } = block.settings || {};
    
    return (
      <>
        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">
              {ageGroup === 'kids' ? 'Size' : 'Heading Level'}
            </Label>
            <RadioGroup 
              defaultValue={level} 
              onValueChange={(value) => onSettingsChange({ level: value })}
              className="flex flex-wrap gap-2"
            >
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="h1" id="h1" />
                <Label htmlFor="h1" className="text-2xl font-bold">
                  {ageGroup === 'kids' ? 'Big' : 'H1'}
                </Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="h2" id="h2" />
                <Label htmlFor="h2" className="text-xl font-bold">
                  {ageGroup === 'kids' ? 'Medium' : 'H2'}
                </Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="h3" id="h3" />
                <Label htmlFor="h3" className="text-lg font-bold">
                  {ageGroup === 'kids' ? 'Small' : 'H3'}
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <Label className="mb-2 block">
              {ageGroup === 'kids' ? 'Position' : 'Alignment'}
            </Label>
            <div className="flex space-x-1">
              <Button
                variant={align === 'left' ? 'default' : 'outline'}
                size="icon"
                onClick={() => onSettingsChange({ align: 'left' })}
                title="Left align"
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button
                variant={align === 'center' ? 'default' : 'outline'}
                size="icon"
                onClick={() => onSettingsChange({ align: 'center' })}
                title="Center align"
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button
                variant={align === 'right' ? 'default' : 'outline'}
                size="icon"
                onClick={() => onSettingsChange({ align: 'right' })}
                title="Right align"
              >
                <AlignRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div>
            <Label className="mb-2 block">
              {ageGroup === 'kids' ? 'Color' : 'Text Color'}
            </Label>
            <div className="flex space-x-2">
              <Input 
                type="color" 
                value={color || '#000000'} 
                onChange={(e) => onSettingsChange({ color: e.target.value })}
                className="w-12 h-8 p-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSettingsChange({ color: undefined })}
              >
                {ageGroup === 'kids' ? 'Default' : 'Reset'}
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderParagraphSettings = () => {
    const { align = 'left', size = 'medium', color, highlight = false } = block.settings || {};
    
    return (
      <>
        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">
              {ageGroup === 'kids' ? 'Size' : 'Text Size'}
            </Label>
            <RadioGroup 
              defaultValue={size} 
              onValueChange={(value) => onSettingsChange({ size: value })}
              className="flex flex-wrap gap-2"
            >
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="small" id="small" />
                <Label htmlFor="small" className="text-sm">
                  {ageGroup === 'kids' ? 'Small' : 'Small'}
                </Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium">
                  {ageGroup === 'kids' ? 'Medium' : 'Normal'}
                </Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="large" id="large" />
                <Label htmlFor="large" className="text-lg">
                  {ageGroup === 'kids' ? 'Big' : 'Large'}
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <Label className="mb-2 block">
              {ageGroup === 'kids' ? 'Position' : 'Alignment'}
            </Label>
            <div className="flex space-x-1">
              <Button
                variant={align === 'left' ? 'default' : 'outline'}
                size="icon"
                onClick={() => onSettingsChange({ align: 'left' })}
                title="Left align"
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button
                variant={align === 'center' ? 'default' : 'outline'}
                size="icon"
                onClick={() => onSettingsChange({ align: 'center' })}
                title="Center align"
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button
                variant={align === 'right' ? 'default' : 'outline'}
                size="icon"
                onClick={() => onSettingsChange({ align: 'right' })}
                title="Right align"
              >
                <AlignRight className="h-4 w-4" />
              </Button>
              <Button
                variant={align === 'justify' ? 'default' : 'outline'}
                size="icon"
                onClick={() => onSettingsChange({ align: 'justify' })}
                title="Justify text"
              >
                <AlignJustify className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div>
            <Label className="mb-2 block">
              {ageGroup === 'kids' ? 'Color' : 'Text Color'}
            </Label>
            <div className="flex space-x-2">
              <Input 
                type="color" 
                value={color || '#000000'} 
                onChange={(e) => onSettingsChange({ color: e.target.value })}
                className="w-12 h-8 p-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSettingsChange({ color: undefined })}
              >
                {ageGroup === 'kids' ? 'Default' : 'Reset'}
              </Button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="highlight"
              checked={highlight}
              onCheckedChange={(checked) => onSettingsChange({ highlight: checked })}
            />
            <Label htmlFor="highlight">
              {ageGroup === 'kids' ? 'Make it stand out' : 'Highlight paragraph'}
            </Label>
          </div>
        </div>
      </>
    );
  };

  const renderImageSettings = () => {
    const { rounded = false, border = false, shadow = false, size = 'medium' } = block.settings || {};
    
    return (
      <>
        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">
              {ageGroup === 'kids' ? 'Size' : 'Image Size'}
            </Label>
            <RadioGroup 
              defaultValue={size} 
              onValueChange={(value) => onSettingsChange({ size: value })}
              className="flex flex-wrap gap-2"
            >
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="small" id="img-small" />
                <Label htmlFor="img-small">
                  {ageGroup === 'kids' ? 'Small' : 'Small'}
                </Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="medium" id="img-medium" />
                <Label htmlFor="img-medium">
                  {ageGroup === 'kids' ? 'Medium' : 'Medium'}
                </Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="large" id="img-large" />
                <Label htmlFor="img-large">
                  {ageGroup === 'kids' ? 'Big' : 'Large'}
                </Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="full" id="img-full" />
                <Label htmlFor="img-full">
                  {ageGroup === 'kids' ? 'Super Big' : 'Full Width'}
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="rounded"
              checked={rounded}
              onCheckedChange={(checked) => onSettingsChange({ rounded: checked })}
            />
            <Label htmlFor="rounded">
              {ageGroup === 'kids' ? 'Round corners' : 'Rounded corners'}
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="border"
              checked={border}
              onCheckedChange={(checked) => onSettingsChange({ border: checked })}
            />
            <Label htmlFor="border">
              {ageGroup === 'kids' ? 'Add border' : 'Show border'}
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="shadow"
              checked={shadow}
              onCheckedChange={(checked) => onSettingsChange({ shadow: checked })}
            />
            <Label htmlFor="shadow">
              {ageGroup === 'kids' ? 'Add shadow' : 'Drop shadow'}
            </Label>
          </div>
        </div>
      </>
    );
  };

  const renderButtonSettings = () => {
    const { 
      style = 'primary', 
      size = 'medium',
      fullWidth = false,
      openInNewTab = false
    } = block.settings || {};
    
    return (
      <>
        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">
              {ageGroup === 'kids' ? 'Style' : 'Button Style'}
            </Label>
            <RadioGroup 
              defaultValue={style} 
              onValueChange={(value) => onSettingsChange({ style: value })}
              className="grid grid-cols-2 gap-2"
            >
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="primary" id="btn-primary" />
                <Label htmlFor="btn-primary">
                  {ageGroup === 'kids' ? 'Main' : 'Primary'}
                </Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="secondary" id="btn-secondary" />
                <Label htmlFor="btn-secondary">
                  {ageGroup === 'kids' ? 'Fancy' : 'Secondary'}
                </Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="outline" id="btn-outline" />
                <Label htmlFor="btn-outline">
                  {ageGroup === 'kids' ? 'Outline' : 'Outline'}
                </Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="destructive" id="btn-destructive" />
                <Label htmlFor="btn-destructive">
                  {ageGroup === 'kids' ? 'Important' : 'Destructive'}
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <Label className="mb-2 block">
              {ageGroup === 'kids' ? 'Size' : 'Button Size'}
            </Label>
            <RadioGroup 
              defaultValue={size} 
              onValueChange={(value) => onSettingsChange({ size: value })}
              className="flex flex-wrap gap-2"
            >
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="small" id="btn-size-small" />
                <Label htmlFor="btn-size-small">
                  {ageGroup === 'kids' ? 'Small' : 'Small'}
                </Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="medium" id="btn-size-medium" />
                <Label htmlFor="btn-size-medium">
                  {ageGroup === 'kids' ? 'Medium' : 'Medium'}
                </Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="large" id="btn-size-large" />
                <Label htmlFor="btn-size-large">
                  {ageGroup === 'kids' ? 'Big' : 'Large'}
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="fullWidth"
              checked={fullWidth}
              onCheckedChange={(checked) => onSettingsChange({ fullWidth: checked })}
            />
            <Label htmlFor="fullWidth">
              {ageGroup === 'kids' ? 'Make button super wide' : 'Full width button'}
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="openInNewTab"
              checked={openInNewTab}
              onCheckedChange={(checked) => onSettingsChange({ openInNewTab: checked })}
            />
            <Label htmlFor="openInNewTab">
              {ageGroup === 'kids' ? 'Open in new window' : 'Open in new tab'}
            </Label>
          </div>
        </div>
      </>
    );
  };

  const renderListSettings = () => {
    const { 
      type = 'bullet', 
      spacing = 'normal',
    } = block.settings || {};
    
    return (
      <>
        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">
              {ageGroup === 'kids' ? 'List Type' : 'List Style'}
            </Label>
            <RadioGroup 
              defaultValue={type} 
              onValueChange={(value) => onSettingsChange({ type: value })}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bullet" id="list-bullet" />
                <ListIcon className="h-4 w-4 mr-1" />
                <Label htmlFor="list-bullet">
                  {ageGroup === 'kids' ? 'Dots' : 'Bullet Points'}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="numbered" id="list-numbered" />
                <ListOrdered className="h-4 w-4 mr-1" />
                <Label htmlFor="list-numbered">
                  {ageGroup === 'kids' ? 'Numbers' : 'Numbered List'}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="check" id="list-check" />
                <ListChecks className="h-4 w-4 mr-1" />
                <Label htmlFor="list-check">
                  {ageGroup === 'kids' ? 'Checkboxes' : 'Checklist'}
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <Label className="mb-2 block">
              {ageGroup === 'kids' ? 'Space Between Items' : 'Item Spacing'}
            </Label>
            <RadioGroup 
              defaultValue={spacing} 
              onValueChange={(value) => onSettingsChange({ spacing: value })}
              className="flex flex-wrap gap-2"
            >
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="tight" id="spacing-tight" />
                <Label htmlFor="spacing-tight">
                  {ageGroup === 'kids' ? 'Close' : 'Tight'}
                </Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="normal" id="spacing-normal" />
                <Label htmlFor="spacing-normal">
                  {ageGroup === 'kids' ? 'Normal' : 'Normal'}
                </Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="loose" id="spacing-loose" />
                <Label htmlFor="spacing-loose">
                  {ageGroup === 'kids' ? 'Far Apart' : 'Loose'}
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </>
    );
  };

  const renderLayoutSettings = () => {
    const { 
      gapSize = 'medium',
      equalHeight = false,
      reverse = false,
      stackAt = 'mobile',
      background
    } = block.settings || {};
    
    return (
      <>
        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">
              {ageGroup === 'kids' ? 'Space Between' : 'Column Gap'}
            </Label>
            <RadioGroup 
              defaultValue={gapSize} 
              onValueChange={(value) => onSettingsChange({ gapSize: value })}
              className="flex flex-wrap gap-2"
            >
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="small" id="gap-small" />
                <Label htmlFor="gap-small">
                  {ageGroup === 'kids' ? 'Small' : 'Small'}
                </Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="medium" id="gap-medium" />
                <Label htmlFor="gap-medium">
                  {ageGroup === 'kids' ? 'Medium' : 'Medium'}
                </Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="large" id="gap-large" />
                <Label htmlFor="gap-large">
                  {ageGroup === 'kids' ? 'Big' : 'Large'}
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <Label className="mb-2 block">
              {ageGroup === 'kids' ? 'Stack on Small Screens' : 'Stack Columns At'}
            </Label>
            <RadioGroup 
              defaultValue={stackAt} 
              onValueChange={(value) => onSettingsChange({ stackAt: value })}
              className="flex flex-wrap gap-2"
            >
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="mobile" id="stack-mobile" />
                <Label htmlFor="stack-mobile">
                  {ageGroup === 'kids' ? 'Phone' : 'Mobile'}
                </Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="tablet" id="stack-tablet" />
                <Label htmlFor="stack-tablet">
                  {ageGroup === 'kids' ? 'Tablet' : 'Tablet'}
                </Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="never" id="stack-never" />
                <Label htmlFor="stack-never">
                  {ageGroup === 'kids' ? 'Never' : 'Never'}
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <Label className="mb-2 block">
              {ageGroup === 'kids' ? 'Background Color' : 'Background Color'}
            </Label>
            <div className="flex space-x-2">
              <Input 
                type="color" 
                value={background || '#ffffff'} 
                onChange={(e) => onSettingsChange({ background: e.target.value })}
                className="w-12 h-8 p-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSettingsChange({ background: undefined })}
              >
                {ageGroup === 'kids' ? 'None' : 'Clear'}
              </Button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="reverse"
              checked={reverse}
              onCheckedChange={(checked) => onSettingsChange({ reverse: checked })}
            />
            <Label htmlFor="reverse">
              {ageGroup === 'kids' ? 'Flip order' : 'Reverse column order'}
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="equalHeight"
              checked={equalHeight}
              onCheckedChange={(checked) => onSettingsChange({ equalHeight: checked })}
            />
            <Label htmlFor="equalHeight">
              {ageGroup === 'kids' ? 'Same height columns' : 'Equal height columns'}
            </Label>
          </div>
        </div>
      </>
    );
  };

  // Render settings based on block type
  const renderBlockSettings = () => {
    switch (block.type) {
      case 'heading':
        return renderHeadingSettings();
      case 'paragraph':
        return renderParagraphSettings();
      case 'image':
        return renderImageSettings();
      case 'button':
        return renderButtonSettings();
      case 'list':
        return renderListSettings();
      case 'layout':
        return renderLayoutSettings();
      default:
        return <p className="text-center text-gray-500 py-4">No settings available for this block type.</p>;
    }
  };

  return (
    <div className="block-toolbar p-1">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Settings className="h-4 w-4 text-gray-500" />
          <h3 className="font-medium">
            {ageGroup === 'kids' ? 'Block Settings' : 'Block Settings'}
          </h3>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8" 
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="block-settings">
        {renderBlockSettings()}
      </div>
    </div>
  );
};

export default BlockToolbar;