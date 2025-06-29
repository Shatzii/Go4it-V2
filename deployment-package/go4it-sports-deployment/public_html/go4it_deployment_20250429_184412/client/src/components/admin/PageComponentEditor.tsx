import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Layers, Settings, Move, Copy, Save, Trash, Paintbrush, Grid3X3, GridIcon, ImageIcon, TextIcon, CodeIcon } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

// Define types
interface ComponentInstance {
  id: string;
  componentId: string;
  title: string;
  props: Record<string, any>;
  order: number;
  section: string;
}

interface ComponentDefinition {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail?: string;
  props: ComponentPropDefinition[];
}

interface ComponentPropDefinition {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'select' | 'content' | 'image';
  label: string;
  description?: string;
  defaultValue?: any;
  required?: boolean;
  options?: { label: string; value: any }[];
}

interface PageSection {
  id: string;
  name: string;
  description: string;
  key: string;
  allowedComponents?: string[];
  maxComponents?: number;
}

interface PageData {
  id: number;
  title: string;
  slug: string;
  layout: string;
  components: ComponentInstance[];
  sections: PageSection[];
}

export default function PageComponentEditor({ pageId }: { pageId: number }) {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<ComponentInstance | null>(null);
  const [isAddComponentDialogOpen, setIsAddComponentDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedComponent, setDraggedComponent] = useState<string | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch the page data
  const { data: page, isLoading: isPageLoading } = useQuery({
    queryKey: [`/api/pages/${pageId}`],
    queryFn: async () => {
      try {
        // This is a temporary mock for development
        return {
          id: pageId,
          title: 'Home Page',
          slug: '/',
          layout: 'default',
          components: [
            {
              id: 'c1',
              componentId: 'hero',
              title: 'Hero Section',
              props: {
                heading: 'Welcome to Go4It Sports',
                subheading: 'Empowering neurodivergent athletes to reach their full potential',
                ctaText: 'Get Started',
                ctaLink: '/register',
                backgroundImage: '/assets/images/hero-bg.jpg',
                textColor: 'white',
                textAlignment: 'center',
              },
              order: 1,
              section: 'hero',
            },
            {
              id: 'c2',
              componentId: 'feature-cards',
              title: 'Feature Cards',
              props: {
                heading: 'Our Features',
                cards: [
                  {
                    title: 'Personalized Training',
                    description: 'Custom training plans designed for your unique needs and abilities',
                    icon: 'dumbbell',
                  },
                  {
                    title: 'Performance Tracking',
                    description: 'Advanced analytics to track your progress over time',
                    icon: 'chart',
                  },
                  {
                    title: 'Professional Coaches',
                    description: 'Learn from experts who understand neurodivergent athletes',
                    icon: 'users',
                  },
                ],
                backgroundColor: '#f8f9fa',
              },
              order: 2,
              section: 'features',
            },
            {
              id: 'c3',
              componentId: 'testimonial-slider',
              title: 'Testimonials',
              props: {
                heading: 'What Our Athletes Say',
                testimonials: [
                  {
                    quote: 'Go4It Sports changed my life. For the first time, I feel like my ADHD is a strength, not a limitation.',
                    author: 'Alex Johnson',
                    role: 'High School Basketball Player',
                    avatar: '/assets/images/testimonial-1.jpg',
                  },
                  {
                    quote: 'The coaches understand how to work with athletes like me. I\'ve improved more in 3 months than in years of traditional coaching.',
                    author: 'Sam Rodriguez',
                    role: 'Track & Field Athlete',
                    avatar: '/assets/images/testimonial-2.jpg',
                  },
                ],
              },
              order: 3,
              section: 'testimonials',
            },
            {
              id: 'c4',
              componentId: 'cta-block',
              title: 'Call to Action',
              props: {
                heading: 'Ready to Transform Your Athletic Journey?',
                subheading: 'Join thousands of athletes who have found their path with Go4It Sports',
                buttonText: 'Join Today',
                buttonLink: '/register',
                backgroundColor: '#0066cc',
                textColor: 'white',
              },
              order: 4,
              section: 'cta',
            },
          ],
          sections: [
            {
              id: 's1',
              name: 'Hero Section',
              description: 'The main hero banner at the top of the page',
              key: 'hero',
              allowedComponents: ['hero', 'video-hero'],
              maxComponents: 1,
            },
            {
              id: 's2',
              name: 'Features',
              description: 'Highlight your key features and benefits',
              key: 'features',
              allowedComponents: ['feature-cards', 'feature-tabs', 'feature-grid'],
            },
            {
              id: 's3',
              name: 'Testimonials',
              description: 'Showcase testimonials from your users',
              key: 'testimonials',
              allowedComponents: ['testimonial-slider', 'testimonial-grid'],
            },
            {
              id: 's4',
              name: 'Call to Action',
              description: 'Encourage users to take action',
              key: 'cta',
              allowedComponents: ['cta-block', 'newsletter-signup'],
            },
          ],
        } as PageData;
      } catch (error) {
        console.error('Failed to fetch page:', error);
        throw error;
      }
    }
  });

  // Fetch component definitions
  const { data: componentDefinitions = [], isLoading: isComponentsLoading } = useQuery({
    queryKey: ['/api/component-definitions'],
    queryFn: async () => {
      try {
        // This is a temporary mock for development
        return [
          {
            id: 'hero',
            name: 'Hero Banner',
            description: 'A hero banner with heading, subheading, and call-to-action',
            category: 'Hero',
            thumbnail: '/assets/components/hero.jpg',
            props: [
              {
                name: 'heading',
                type: 'string',
                label: 'Heading',
                description: 'The main heading text',
                required: true,
              },
              {
                name: 'subheading',
                type: 'string',
                label: 'Subheading',
                description: 'The secondary text below the heading',
              },
              {
                name: 'ctaText',
                type: 'string',
                label: 'Button Text',
                description: 'The text for the call-to-action button',
              },
              {
                name: 'ctaLink',
                type: 'string',
                label: 'Button Link',
                description: 'The link for the call-to-action button',
              },
              {
                name: 'backgroundImage',
                type: 'image',
                label: 'Background Image',
                description: 'Background image for the hero section',
              },
              {
                name: 'textColor',
                type: 'select',
                label: 'Text Color',
                options: [
                  { label: 'White', value: 'white' },
                  { label: 'Black', value: 'black' },
                  { label: 'Primary', value: 'primary' },
                ],
                defaultValue: 'white',
              },
              {
                name: 'textAlignment',
                type: 'select',
                label: 'Text Alignment',
                options: [
                  { label: 'Left', value: 'left' },
                  { label: 'Center', value: 'center' },
                  { label: 'Right', value: 'right' },
                ],
                defaultValue: 'center',
              },
            ],
          },
          {
            id: 'video-hero',
            name: 'Video Hero',
            description: 'A hero section with background video',
            category: 'Hero',
            thumbnail: '/assets/components/video-hero.jpg',
            props: [
              {
                name: 'heading',
                type: 'string',
                label: 'Heading',
                description: 'The main heading text',
                required: true,
              },
              {
                name: 'subheading',
                type: 'string',
                label: 'Subheading',
                description: 'The secondary text below the heading',
              },
              {
                name: 'videoUrl',
                type: 'string',
                label: 'Video URL',
                description: 'URL to the background video',
                required: true,
              },
              {
                name: 'fallbackImage',
                type: 'image',
                label: 'Fallback Image',
                description: 'Image to show if video fails to load',
              },
              {
                name: 'textColor',
                type: 'select',
                label: 'Text Color',
                options: [
                  { label: 'White', value: 'white' },
                  { label: 'Black', value: 'black' },
                  { label: 'Primary', value: 'primary' },
                ],
                defaultValue: 'white',
              },
            ],
          },
          {
            id: 'feature-cards',
            name: 'Feature Cards',
            description: 'Display key features in a card layout',
            category: 'Content',
            thumbnail: '/assets/components/feature-cards.jpg',
            props: [
              {
                name: 'heading',
                type: 'string',
                label: 'Heading',
                description: 'Section heading text',
              },
              {
                name: 'cards',
                type: 'array',
                label: 'Feature Cards',
                description: 'List of feature cards to display',
                defaultValue: [
                  { 
                    title: 'Feature 1', 
                    description: 'Description for feature 1', 
                    icon: 'star'
                  },
                ],
              },
              {
                name: 'backgroundColor',
                type: 'string',
                label: 'Background Color',
                description: 'Background color for the section',
                defaultValue: '#f8f9fa',
              },
            ],
          },
          {
            id: 'testimonial-slider',
            name: 'Testimonial Slider',
            description: 'Carousel of customer testimonials',
            category: 'Social Proof',
            thumbnail: '/assets/components/testimonial-slider.jpg',
            props: [
              {
                name: 'heading',
                type: 'string',
                label: 'Heading',
                description: 'Section heading text',
              },
              {
                name: 'testimonials',
                type: 'array',
                label: 'Testimonials',
                description: 'List of testimonials to display',
                defaultValue: [
                  { 
                    quote: 'This is an amazing product', 
                    author: 'John Doe', 
                    role: 'Customer', 
                    avatar: ''
                  },
                ],
              },
            ],
          },
          {
            id: 'cta-block',
            name: 'Call to Action Block',
            description: 'A call-to-action section with heading and button',
            category: 'Conversion',
            thumbnail: '/assets/components/cta-block.jpg',
            props: [
              {
                name: 'heading',
                type: 'string',
                label: 'Heading',
                description: 'The main heading text',
                required: true,
              },
              {
                name: 'subheading',
                type: 'string',
                label: 'Subheading',
                description: 'The secondary text below the heading',
              },
              {
                name: 'buttonText',
                type: 'string',
                label: 'Button Text',
                description: 'The text for the call-to-action button',
                required: true,
              },
              {
                name: 'buttonLink',
                type: 'string',
                label: 'Button Link',
                description: 'The link for the call-to-action button',
                required: true,
              },
              {
                name: 'backgroundColor',
                type: 'string',
                label: 'Background Color',
                description: 'Background color for the section',
                defaultValue: '#0066cc',
              },
              {
                name: 'textColor',
                type: 'string',
                label: 'Text Color',
                description: 'Color for the text content',
                defaultValue: 'white',
              },
            ],
          }
        ] as ComponentDefinition[];
      } catch (error) {
        console.error('Failed to fetch component definitions:', error);
        return [];
      }
    }
  });

  // Set the first section as selected if no section is selected and the page is loaded
  useEffect(() => {
    if (!selectedSection && page?.sections.length) {
      setSelectedSection(page.sections[0].key);
    }
  }, [page, selectedSection]);

  // Update component mutation
  const updateComponentMutation = useMutation({
    mutationFn: async (component: ComponentInstance) => {
      try {
        // This is a placeholder for the actual API request
        console.log('Updating component:', component);
        // return await apiRequest(`/api/pages/${pageId}/components/${component.id}`, {
        //   method: 'PATCH',
        //   data: component,
        // });
        
        // Mock response for development
        return { ...component };
      } catch (error) {
        console.error('Failed to update component:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/pages/${pageId}`] });
      toast({
        title: "Success!",
        description: "Component updated successfully.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error!",
        description: "Failed to update component. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Add component mutation
  const addComponentMutation = useMutation({
    mutationFn: async ({ componentDef, section }: { componentDef: ComponentDefinition, section: string }) => {
      try {
        // This is a placeholder for the actual API request
        console.log('Adding component:', componentDef, 'to section:', section);
        // return await apiRequest(`/api/pages/${pageId}/components`, {
        //   method: 'POST',
        //   data: { componentId: componentDef.id, section },
        // });
        
        // Mock response for development
        const defaultProps: Record<string, any> = {};
        componentDef.props.forEach(prop => {
          if (prop.defaultValue !== undefined) {
            defaultProps[prop.name] = prop.defaultValue;
          } else if (prop.required) {
            // Set some basic default values based on type
            switch (prop.type) {
              case 'string':
                defaultProps[prop.name] = '';
                break;
              case 'number':
                defaultProps[prop.name] = 0;
                break;
              case 'boolean':
                defaultProps[prop.name] = false;
                break;
              case 'array':
                defaultProps[prop.name] = [];
                break;
              case 'object':
                defaultProps[prop.name] = {};
                break;
            }
          }
        });

        const newComponent: ComponentInstance = {
          id: `new-${Date.now()}`,
          componentId: componentDef.id,
          title: componentDef.name,
          props: defaultProps,
          order: (page?.components.filter(c => c.section === section).length || 0) + 1,
          section,
        };

        return newComponent;
      } catch (error) {
        console.error('Failed to add component:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/pages/${pageId}`] });
      setIsAddComponentDialogOpen(false);
      toast({
        title: "Success!",
        description: "Component added successfully.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error!",
        description: "Failed to add component. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Delete component mutation
  const deleteComponentMutation = useMutation({
    mutationFn: async (componentId: string) => {
      try {
        // This is a placeholder for the actual API request
        console.log('Deleting component:', componentId);
        // return await apiRequest(`/api/pages/${pageId}/components/${componentId}`, {
        //   method: 'DELETE',
        // });
        
        // Mock response for development
        return { success: true };
      } catch (error) {
        console.error('Failed to delete component:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/pages/${pageId}`] });
      setSelectedComponent(null);
      toast({
        title: "Success!",
        description: "Component deleted successfully.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error!",
        description: "Failed to delete component. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Reorder components mutation
  const reorderComponentsMutation = useMutation({
    mutationFn: async ({ componentId, newOrder }: { componentId: string, newOrder: number }) => {
      try {
        // This is a placeholder for the actual API request
        console.log('Reordering component:', componentId, 'to order:', newOrder);
        // return await apiRequest(`/api/pages/${pageId}/components/${componentId}/reorder`, {
        //   method: 'PATCH',
        //   data: { order: newOrder },
        // });
        
        // Mock response for development
        return { success: true };
      } catch (error) {
        console.error('Failed to reorder component:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/pages/${pageId}`] });
    },
    onError: (error) => {
      toast({
        title: "Error!",
        description: "Failed to reorder components. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Filter components by category and search query
  const filteredComponents = componentDefinitions
    .filter(component => !categoryFilter || component.category === categoryFilter)
    .filter(component => 
      !searchQuery || 
      component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      component.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Group components by category
  const componentsByCategory = filteredComponents.reduce((acc, component) => {
    if (!acc[component.category]) {
      acc[component.category] = [];
    }
    acc[component.category].push(component);
    return acc;
  }, {} as Record<string, ComponentDefinition[]>);

  // Get unique categories
  const categories = Array.from(new Set(componentDefinitions.map(c => c.category)));

  // Get components for the selected section
  const componentsInSection = selectedSection
    ? page?.components.filter(component => component.section === selectedSection).sort((a, b) => a.order - b.order) || []
    : [];

  // Find the selected section object
  const selectedSectionObject = page?.sections.find(section => section.key === selectedSection);

  // Handle editing component props
  const handleEditComponentProps = (component: ComponentInstance) => {
    setSelectedComponent(component);
  };

  // Handle updating component props
  const handleUpdateComponentProp = (name: string, value: any) => {
    if (!selectedComponent) return;
    
    const updatedComponent = {
      ...selectedComponent,
      props: {
        ...selectedComponent.props,
        [name]: value,
      },
    };
    
    setSelectedComponent(updatedComponent);
  };

  // Handle save component changes
  const handleSaveComponentChanges = () => {
    if (selectedComponent) {
      updateComponentMutation.mutate(selectedComponent);
    }
  };

  // Handle add component
  const handleAddComponent = (componentDefinition: ComponentDefinition) => {
    if (!selectedSection) return;
    
    addComponentMutation.mutate({
      componentDef: componentDefinition,
      section: selectedSection,
    });
  };

  // Handle delete component
  const handleDeleteComponent = (componentId: string) => {
    if (window.confirm("Are you sure you want to delete this component?")) {
      deleteComponentMutation.mutate(componentId);
    }
  };

  // Handle drag start
  const handleDragStart = (componentId: string) => {
    setIsDragging(true);
    setDraggedComponent(componentId);
  };

  // Handle drag end
  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedComponent(null);
  };

  // Handle drop
  const handleDrop = (targetOrder: number) => {
    if (!draggedComponent || !selectedSection) return;
    
    const draggedComponentObj = page?.components.find(c => c.id === draggedComponent);
    if (!draggedComponentObj) return;
    
    // If the component is already at the target position, do nothing
    if (draggedComponentObj.order === targetOrder) return;
    
    reorderComponentsMutation.mutate({
      componentId: draggedComponent,
      newOrder: targetOrder,
    });
  };

  // Get component definition
  const getComponentDefinition = (componentId: string) => {
    return componentDefinitions.find(def => def.id === componentId);
  };

  // Render a prop editor control based on the prop type
  const renderPropEditor = (prop: ComponentPropDefinition, value: any, onChange: (value: any) => void) => {
    switch (prop.type) {
      case 'string':
        return (
          <Input
            id={`prop-${prop.name}`}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
          />
        );
      case 'number':
        return (
          <Input
            id={`prop-${prop.name}`}
            type="number"
            value={value !== undefined ? value : ''}
            onChange={(e) => onChange(Number(e.target.value))}
          />
        );
      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <Switch
              id={`prop-${prop.name}`}
              checked={Boolean(value)}
              onCheckedChange={onChange}
            />
            <Label htmlFor={`prop-${prop.name}`}>
              {value ? 'Enabled' : 'Disabled'}
            </Label>
          </div>
        );
      case 'select':
        return (
          <Select
            value={value !== undefined ? String(value) : undefined}
            onValueChange={onChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {prop.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'image':
        return (
          <div className="space-y-2">
            <Input
              id={`prop-${prop.name}`}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Image URL or path"
            />
            {value && (
              <div className="relative h-20 w-full bg-muted rounded-md overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${value})` }} />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white text-xs">
                  {value.split('/').pop()}
                </div>
              </div>
            )}
            <Button variant="outline" type="button" size="sm">
              <ImageIcon className="h-4 w-4 mr-2" />
              Choose Image
            </Button>
          </div>
        );
      case 'content':
        return (
          <Textarea
            id={`prop-${prop.name}`}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="min-h-[100px]"
          />
        );
      case 'array':
        // Simple array editing - in a real app, this would be more sophisticated
        return (
          <div className="space-y-2">
            <Textarea
              id={`prop-${prop.name}`}
              value={value ? JSON.stringify(value, null, 2) : '[]'}
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  onChange(parsed);
                } catch (error) {
                  // Don't update on invalid JSON
                }
              }}
              className="min-h-[100px] font-mono text-xs"
            />
            <p className="text-xs text-muted-foreground">Edit as JSON</p>
          </div>
        );
      case 'object':
        // Simple object editing - in a real app, this would be more sophisticated
        return (
          <div className="space-y-2">
            <Textarea
              id={`prop-${prop.name}`}
              value={value ? JSON.stringify(value, null, 2) : '{}'}
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  onChange(parsed);
                } catch (error) {
                  // Don't update on invalid JSON
                }
              }}
              className="min-h-[100px] font-mono text-xs"
            />
            <p className="text-xs text-muted-foreground">Edit as JSON</p>
          </div>
        );
      default:
        return <p className="text-sm text-muted-foreground">Unsupported property type: {prop.type}</p>;
    }
  };

  if (isPageLoading || isComponentsLoading) {
    return <div className="flex items-center justify-center h-64">Loading page components...</div>;
  }

  if (!page) {
    return <div className="flex items-center justify-center h-64">Page not found</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left sidebar: Sections */}
      <Card className="md:col-span-1">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Page Sections</CardTitle>
          <CardDescription>
            Select a section to view and edit components
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {page.sections.map((section) => (
              <Button
                key={section.key}
                variant={selectedSection === section.key ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setSelectedSection(section.key)}
              >
                <div className="flex items-center">
                  <Layers className="h-4 w-4 mr-2" />
                  <span>{section.name}</span>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Middle: Component list */}
      <Card className="md:col-span-1">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">
              {selectedSectionObject ? selectedSectionObject.name : 'Components'}
            </CardTitle>
            <Button
              size="sm"
              onClick={() => setIsAddComponentDialogOpen(true)}
              disabled={!selectedSection}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
          <CardDescription>
            {selectedSectionObject
              ? selectedSectionObject.description
              : 'Select a section to view and edit components'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {componentsInSection.length === 0 ? (
              <div className="text-center p-6 border-2 border-dashed rounded-lg">
                <p className="text-sm text-muted-foreground mb-4">
                  No components in this section yet
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddComponentDialogOpen(true)}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Component
                </Button>
              </div>
            ) : (
              componentsInSection.map((component, index) => {
                const def = getComponentDefinition(component.componentId);
                return (
                  <div
                    key={component.id}
                    className={`p-3 border rounded-lg ${
                      selectedComponent?.id === component.id
                        ? 'border-primary bg-muted/50'
                        : 'border-border'
                    } ${isDragging ? 'cursor-move' : 'cursor-pointer'}`}
                    onClick={() => handleEditComponentProps(component)}
                    draggable
                    onDragStart={() => handleDragStart(component.id)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(component.order)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Move className="h-4 w-4 mr-2 text-muted-foreground" />
                        <div>
                          <h4 className="text-sm font-medium">{component.title}</h4>
                          <p className="text-xs text-muted-foreground">
                            {def?.name || component.componentId}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (componentsInSection.length > 1 && index > 0) {
                              reorderComponentsMutation.mutate({
                                componentId: component.id,
                                newOrder: componentsInSection[index - 1].order,
                              });
                            }
                          }}
                          disabled={index === 0}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                          >
                            <path d="m18 15-6-6-6 6" />
                          </svg>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (
                              componentsInSection.length > 1 &&
                              index < componentsInSection.length - 1
                            ) {
                              reorderComponentsMutation.mutate({
                                componentId: component.id,
                                newOrder: componentsInSection[index + 1].order,
                              });
                            }
                          }}
                          disabled={index === componentsInSection.length - 1}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                          >
                            <path d="m6 9 6 6 6-6" />
                          </svg>
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Right sidebar: Component properties */}
      <Card className="md:col-span-1">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">
              {selectedComponent
                ? 'Component Properties'
                : 'Select a Component'}
            </CardTitle>
            {selectedComponent && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDeleteComponent(selectedComponent.id)}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveComponentChanges}
                  disabled={updateComponentMutation.isPending}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            )}
          </div>
          <CardDescription>
            {selectedComponent
              ? `Editing: ${selectedComponent.title}`
              : 'Click on a component to edit its properties'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedComponent ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="component-title">Component Title</Label>
                <Input
                  id="component-title"
                  value={selectedComponent.title}
                  onChange={(e) =>
                    setSelectedComponent({
                      ...selectedComponent,
                      title: e.target.value,
                    })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Internal reference name for this component
                </p>
              </div>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="appearance">
                  <AccordionTrigger className="py-3">
                    <div className="flex items-center">
                      <Paintbrush className="h-4 w-4 mr-2" />
                      <span>Component Properties</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ScrollArea className="h-[calc(100vh-500px)]">
                      <div className="space-y-4 pr-4">
                        {getComponentDefinition(selectedComponent.componentId)?.props.map((prop) => (
                          <div key={prop.name} className="space-y-2">
                            <Label htmlFor={`prop-${prop.name}`} className="flex items-center">
                              {prop.label}
                              {prop.required && <span className="text-destructive ml-1">*</span>}
                            </Label>
                            {renderPropEditor(
                              prop,
                              selectedComponent.props[prop.name],
                              (value) => handleUpdateComponentProp(prop.name, value)
                            )}
                            {prop.description && (
                              <p className="text-xs text-muted-foreground">{prop.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          ) : (
            <div className="text-center p-6 border-2 border-dashed rounded-lg">
              <Settings className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
              <h3 className="font-medium text-lg mb-1">No Component Selected</h3>
              <p className="text-muted-foreground mb-4">
                Select a component from the list to edit its properties
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Component Dialog */}
      <Dialog open={isAddComponentDialogOpen} onOpenChange={setIsAddComponentDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Add Component</DialogTitle>
            <DialogDescription>
              Choose a component to add to the {selectedSectionObject?.name} section
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-4">
            <div className="col-span-1 space-y-4">
              <div className="space-y-2">
                <Label>Filter by Category</Label>
                <div className="space-y-1">
                  <Button
                    variant={categoryFilter === null ? "default" : "outline"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setCategoryFilter(null)}
                  >
                    All Categories
                  </Button>
                  {categories.map(category => (
                    <Button
                      key={category}
                      variant={categoryFilter === category ? "default" : "outline"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setCategoryFilter(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="col-span-1 md:col-span-3 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="search-components">Search Components</Label>
                <Input
                  id="search-components"
                  placeholder="Search by name or description"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-6">
                  {Object.entries(componentsByCategory).map(([category, components]) => (
                    <div key={category}>
                      <h3 className="text-sm font-medium mb-3">{category}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {components.map((component) => (
                          <div
                            key={component.id}
                            className="border rounded-lg p-3 hover:border-primary cursor-pointer"
                            onClick={() => handleAddComponent(component)}
                          >
                            <div className="h-24 bg-muted rounded-md flex items-center justify-center mb-2">
                              {component.category === 'Hero' ? (
                                <ImageIcon className="h-8 w-8 text-muted-foreground" />
                              ) : component.category === 'Content' ? (
                                <TextIcon className="h-8 w-8 text-muted-foreground" />
                              ) : component.category === 'Conversion' ? (
                                <Button variant="outline" size="sm" disabled className="pointer-events-none">
                                  Call to Action
                                </Button>
                              ) : component.category === 'Layout' ? (
                                <GridIcon className="h-8 w-8 text-muted-foreground" />
                              ) : (
                                <div className="text-2xl text-muted-foreground">
                                  {component.name.charAt(0)}
                                </div>
                              )}
                            </div>
                            <h4 className="font-medium">{component.name}</h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              {component.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {filteredComponents.length === 0 && (
                    <div className="text-center p-8">
                      <p className="text-muted-foreground">No components match your search</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddComponentDialogOpen(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}