import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Pencil, Trash2, MoveUp, MoveDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageComponent, PageComponentType } from "@/modules/cms/types";
import { useQuery } from "@tanstack/react-query";

interface PageComponentEditorProps {
  components: PageComponent[];
  onChange: (components: PageComponent[]) => void;
}

// Available component types
const componentTypes: { value: PageComponentType; label: string }[] = [
  { value: "content-block", label: "Content Block" },
  { value: "content-section", label: "Content Section" },
  { value: "hero", label: "Hero" },
  { value: "custom", label: "Custom Component" },
];

export default function PageComponentEditor({ 
  components = [], 
  onChange 
}: PageComponentEditorProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isAddingComponent, setIsAddingComponent] = useState(false);

  // Fetch available content blocks for selection
  const { data: contentBlocks = [] } = useQuery({
    queryKey: ['/api/content-blocks'],
    queryFn: async () => {
      const response = await fetch('/api/content-blocks');
      if (!response.ok) {
        throw new Error('Failed to fetch content blocks');
      }
      return response.json();
    }
  });

  // Get unique sections from content blocks
  const availableSections = Array.from(
    new Set(contentBlocks.map((block: any) => block.section).filter(Boolean))
  );

  // Component form data
  const { register, handleSubmit, watch, setValue, reset, formState } = useForm<PageComponent>({
    defaultValues: {
      type: "content-block",
      identifier: "",
      section: "",
      title: "",
      subtitle: "",
      content: "",
      className: "",
      customProps: {}
    }
  });

  // Get current component type selection
  const selectedType = watch("type") as PageComponentType;

  // Add a new component
  const handleAddComponent = (data: PageComponent) => {
    const newComponents = [...components, data];
    onChange(newComponents);
    setIsAddingComponent(false);
    reset();
  };

  // Update an existing component
  const handleUpdateComponent = (data: PageComponent) => {
    if (editingIndex !== null) {
      const newComponents = [...components];
      newComponents[editingIndex] = data;
      onChange(newComponents);
      setEditingIndex(null);
      reset();
    }
  };

  // Delete a component
  const handleDeleteComponent = (index: number) => {
    if (confirm("Are you sure you want to delete this component?")) {
      const newComponents = [...components];
      newComponents.splice(index, 1);
      onChange(newComponents);
    }
  };

  // Move a component up in the order
  const handleMoveUp = (index: number) => {
    if (index > 0) {
      const newComponents = [...components];
      const temp = newComponents[index];
      newComponents[index] = newComponents[index - 1];
      newComponents[index - 1] = temp;
      onChange(newComponents);
    }
  };

  // Move a component down in the order
  const handleMoveDown = (index: number) => {
    if (index < components.length - 1) {
      const newComponents = [...components];
      const temp = newComponents[index];
      newComponents[index] = newComponents[index + 1];
      newComponents[index + 1] = temp;
      onChange(newComponents);
    }
  };

  // Start editing a component
  const handleEdit = (component: PageComponent, index: number) => {
    reset(component);
    setEditingIndex(index);
    setIsAddingComponent(false);
  };

  // Cancel editing/adding
  const handleCancel = () => {
    setEditingIndex(null);
    setIsAddingComponent(false);
    reset();
  };

  // Render the form inputs for the selected component type
  const renderComponentTypeFields = () => {
    switch (selectedType) {
      case "content-block":
        return (
          <div>
            <Label htmlFor="identifier">Content Block Identifier</Label>
            <Select 
              onValueChange={value => setValue("identifier", value)}
              value={watch("identifier")}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select a content block" />
              </SelectTrigger>
              <SelectContent>
                {contentBlocks.map((block: any) => (
                  <SelectItem key={block.identifier} value={block.identifier}>
                    {block.identifier} ({block.title})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
        
      case "content-section":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="section">Section Name</Label>
              <Select 
                onValueChange={value => setValue("section", value)}
                value={watch("section")}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select a section" />
                </SelectTrigger>
                <SelectContent>
                  {availableSections.map((section: any) => (
                    <SelectItem key={section} value={section}>
                      {section}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="title">Section Title (Optional)</Label>
              <Input
                id="title"
                {...register("title")}
                className="mt-1"
              />
            </div>
          </div>
        );
        
      case "hero":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Hero Title</Label>
              <Input
                id="title"
                {...register("title")}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                {...register("subtitle")}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                {...register("content")}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="backgroundImage">Background Image URL</Label>
              <Input
                id="backgroundImage"
                {...register("backgroundImage")}
                className="mt-1"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
        );
        
      case "custom":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title (Optional)</Label>
              <Input
                id="title"
                {...register("title")}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="subtitle">Subtitle (Optional)</Label>
              <Input
                id="subtitle"
                {...register("subtitle")}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="content">Content (HTML)</Label>
              <Textarea
                id="content"
                {...register("content")}
                className="mt-1 min-h-[200px]"
              />
            </div>
            
            <div>
              <Label htmlFor="customProps">Custom Properties (JSON)</Label>
              <Textarea
                id="customProps"
                {...register("customProps", {
                  setValueAs: (value) => {
                    try {
                      return typeof value === 'string' && value.trim() !== '' 
                        ? JSON.parse(value) 
                        : {};
                    } catch (e) {
                      console.error("Invalid JSON for customProps", e);
                      return {};
                    }
                  }
                })}
                className="mt-1 font-mono text-sm"
                placeholder='{"prop1": "value1", "prop2": "value2"}'
                defaultValue={
                  watch("customProps") 
                    ? JSON.stringify(watch("customProps"), null, 2) 
                    : ''
                }
              />
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Page Components</h3>
        {!isAddingComponent && editingIndex === null && (
          <Button 
            size="sm" 
            onClick={() => {
              setIsAddingComponent(true);
              setEditingIndex(null);
              reset();
            }}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Component
          </Button>
        )}
      </div>

      {/* Form for adding/editing a component */}
      {(isAddingComponent || editingIndex !== null) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingIndex !== null ? "Edit Component" : "Add Component"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form 
              onSubmit={handleSubmit(
                editingIndex !== null ? handleUpdateComponent : handleAddComponent
              )}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Component Type</Label>
                  <Select 
                    onValueChange={value => setValue("type", value as PageComponentType)}
                    value={selectedType}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select component type" />
                    </SelectTrigger>
                    <SelectContent>
                      {componentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="className">CSS Class Name (Optional)</Label>
                  <Input
                    id="className"
                    {...register("className")}
                    className="mt-1"
                    placeholder="Custom CSS class"
                  />
                </div>
              </div>

              {/* Render fields based on component type */}
              <div className="pt-4">
                {renderComponentTypeFields()}
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingIndex !== null ? "Update Component" : "Add Component"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* List of components */}
      {components.length > 0 && !isAddingComponent && editingIndex === null && (
        <div className="space-y-3">
          {components.map((component, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="flex items-center bg-muted px-4 py-2">
                <span className="font-medium flex-1">
                  {component.type.charAt(0).toUpperCase() + component.type.slice(1).replace(/-/g, ' ')}
                  {component.type === 'content-block' && component.identifier && 
                    `: ${component.identifier}`
                  }
                  {component.type === 'content-section' && component.section && 
                    `: ${component.section}`
                  }
                  {component.title && ` - ${component.title}`}
                </span>
                <div className="flex gap-1">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                  >
                    <MoveUp className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => handleMoveDown(index)}
                    disabled={index === components.length - 1}
                  >
                    <MoveDown className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => handleEdit(component, index)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => handleDeleteComponent(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="pt-4">
                <Tabs defaultValue="details" className="w-full">
                  <TabsList>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    {component.content && <TabsTrigger value="content">Content</TabsTrigger>}
                    {component.customProps && Object.keys(component.customProps).length > 0 && (
                      <TabsTrigger value="props">Custom Props</TabsTrigger>
                    )}
                  </TabsList>
                  <TabsContent value="details" className="space-y-2 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {component.type === 'content-block' && (
                        <div>
                          <span className="font-medium">Identifier:</span> {component.identifier}
                        </div>
                      )}
                      {component.type === 'content-section' && (
                        <div>
                          <span className="font-medium">Section:</span> {component.section}
                        </div>
                      )}
                      {component.title && (
                        <div>
                          <span className="font-medium">Title:</span> {component.title}
                        </div>
                      )}
                      {component.subtitle && (
                        <div>
                          <span className="font-medium">Subtitle:</span> {component.subtitle}
                        </div>
                      )}
                      {component.backgroundImage && (
                        <div>
                          <span className="font-medium">Background Image:</span> {component.backgroundImage}
                        </div>
                      )}
                      {component.className && (
                        <div>
                          <span className="font-medium">CSS Class:</span> {component.className}
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  {component.content && (
                    <TabsContent value="content" className="pt-4">
                      <div className="border rounded-md p-3 max-h-40 overflow-y-auto">
                        <pre className="text-xs whitespace-pre-wrap">{component.content}</pre>
                      </div>
                    </TabsContent>
                  )}
                  
                  {component.customProps && Object.keys(component.customProps).length > 0 && (
                    <TabsContent value="props" className="pt-4">
                      <div className="border rounded-md p-3 max-h-40 overflow-y-auto bg-muted">
                        <pre className="text-xs whitespace-pre-wrap">
                          {JSON.stringify(component.customProps, null, 2)}
                        </pre>
                      </div>
                    </TabsContent>
                  )}
                </Tabs>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {components.length === 0 && !isAddingComponent && (
        <div className="text-center p-6 border rounded-md bg-muted/50">
          <p className="text-muted-foreground mb-4">No components added to this page yet.</p>
          <Button onClick={() => setIsAddingComponent(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add First Component
          </Button>
        </div>
      )}
    </div>
  );
}