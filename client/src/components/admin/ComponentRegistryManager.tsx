import React, { useState } from 'react';
import { useComponentTypes, useCreateComponentType, useUpdateComponentType, useDeleteComponentType } from '@/modules/cms/hooks/useComponentRegistry';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Pencil, Trash2, Code, Box, Check, X } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import type { ComponentRegistryItem } from '@shared/schema';

// Form schema for component type
const componentTypeSchema = z.object({
  identifier: z.string().min(3, {
    message: "Identifier must be at least 3 characters long",
  }).regex(/^[a-z0-9-]+$/, {
    message: "Identifier can only contain lowercase letters, numbers, and hyphens",
  }),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters long",
  }),
  description: z.string().optional(),
  category: z.string().default("general"),
  icon: z.string().default("box"),
});

type ComponentTypeFormValues = z.infer<typeof componentTypeSchema>;

export default function ComponentRegistryManager() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<ComponentRegistryItem | null>(null);

  const { data: componentTypes, isLoading, refetch } = useComponentTypes();
  const createComponentType = useCreateComponentType();
  const updateComponentType = useUpdateComponentType(selectedComponent?.identifier || '');
  const deleteComponentType = useDeleteComponentType();

  const createForm = useForm<ComponentTypeFormValues>({
    resolver: zodResolver(componentTypeSchema),
    defaultValues: {
      identifier: '',
      name: '',
      description: '',
      category: 'general',
      icon: 'box',
    },
  });

  const updateForm = useForm<ComponentTypeFormValues>({
    resolver: zodResolver(componentTypeSchema),
    defaultValues: {
      identifier: '',
      name: '',
      description: '',
      category: 'general',
      icon: 'box',
    },
  });

  // Handle create component type
  const onCreateSubmit = (data: ComponentTypeFormValues) => {
    createComponentType.mutate(data, {
      onSuccess: () => {
        setIsCreateDialogOpen(false);
        createForm.reset();
        refetch();
      }
    });
  };

  // Handle update component type
  const onUpdateSubmit = (data: ComponentTypeFormValues) => {
    if (selectedComponent) {
      updateComponentType.mutate(data, {
        onSuccess: () => {
          setIsUpdateDialogOpen(false);
          updateForm.reset();
          refetch();
        }
      });
    }
  };

  // Handle delete component type
  const onDeleteConfirm = () => {
    if (selectedComponent) {
      deleteComponentType.mutate(selectedComponent.identifier, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          setSelectedComponent(null);
          refetch();
        }
      });
    }
  };

  const handleEditClick = (component: ComponentRegistryItem) => {
    setSelectedComponent(component);
    updateForm.reset({
      identifier: component.identifier,
      name: component.name,
      description: component.description || '',
      category: component.category || 'general',
      icon: component.icon || 'box',
    });
    setIsUpdateDialogOpen(true);
  };

  const handleDeleteClick = (component: ComponentRegistryItem) => {
    setSelectedComponent(component);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Component Registry</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Component Type
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add Component Type</DialogTitle>
              <DialogDescription>
                Create a new component type that can be used in the CMS.
              </DialogDescription>
            </DialogHeader>
            <Form {...createForm}>
              <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
                <FormField
                  control={createForm.control}
                  name="identifier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Identifier</FormLabel>
                      <FormControl>
                        <Input placeholder="my-component-type" {...field} />
                      </FormControl>
                      <FormDescription>
                        A unique identifier for this component type (lowercase, numbers, hyphens only)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="My Component Type" {...field} />
                      </FormControl>
                      <FormDescription>
                        A human-readable name for this component type
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="A description of what this component does and when to use it" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createForm.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="layout">Layout</SelectItem>
                          <SelectItem value="media">Media</SelectItem>
                          <SelectItem value="form">Form</SelectItem>
                          <SelectItem value="athletics">Athletics</SelectItem>
                          <SelectItem value="coaching">Coaching</SelectItem>
                          <SelectItem value="academic">Academic</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createForm.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon</FormLabel>
                      <FormControl>
                        <Input placeholder="box" {...field} />
                      </FormControl>
                      <FormDescription>
                        The name of a Lucide icon to use for this component
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={createComponentType.isPending}
                  >
                    {createComponentType.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Create
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : componentTypes && componentTypes.length > 0 ? (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Identifier</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {componentTypes.map((component) => (
                <TableRow key={component.id}>
                  <TableCell className="font-medium">{component.name}</TableCell>
                  <TableCell className="font-mono text-sm">{component.identifier}</TableCell>
                  <TableCell>{component.category}</TableCell>
                  <TableCell className="max-w-md truncate">
                    {component.description || "No description"}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEditClick(component)}
                      >
                        <Pencil className="w-4 h-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteClick(component)}
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 border rounded-md bg-muted/10">
          <Code className="w-12 h-12 mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">No Component Types</h3>
          <p className="text-muted-foreground text-center max-w-md mb-6">
            You haven't created any component types yet. Component types define the 
            building blocks that can be used in your CMS pages.
          </p>
          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create First Component Type
          </Button>
        </div>
      )}

      {/* Update Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Component Type</DialogTitle>
            <DialogDescription>
              Update the details of this component type.
            </DialogDescription>
          </DialogHeader>
          <Form {...updateForm}>
            <form onSubmit={updateForm.handleSubmit(onUpdateSubmit)} className="space-y-4">
              <FormField
                control={updateForm.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Identifier</FormLabel>
                    <FormControl>
                      <Input disabled {...field} />
                    </FormControl>
                    <FormDescription>
                      Component identifiers cannot be changed after creation
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={updateForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={updateForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={updateForm.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="layout">Layout</SelectItem>
                        <SelectItem value="media">Media</SelectItem>
                        <SelectItem value="form">Form</SelectItem>
                        <SelectItem value="athletics">Athletics</SelectItem>
                        <SelectItem value="coaching">Coaching</SelectItem>
                        <SelectItem value="academic">Academic</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={updateForm.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      The name of a Lucide icon to use for this component
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsUpdateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={updateComponentType.isPending}
                >
                  {updateComponentType.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Update
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Component Type</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this component type? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <Alert variant="destructive">
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              If this component type is used by any pages, they will be affected.
            </AlertDescription>
          </Alert>
          
          <div className="py-2">
            <h4 className="font-medium mb-1">Component Type Details:</h4>
            <p className="text-muted-foreground mb-1">
              <span className="font-semibold">Name:</span> {selectedComponent?.name}
            </p>
            <p className="text-muted-foreground mb-1">
              <span className="font-semibold">Identifier:</span> {selectedComponent?.identifier}
            </p>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button 
              type="button"
              variant="destructive"
              onClick={onDeleteConfirm}
              disabled={deleteComponentType.isPending}
            >
              {deleteComponentType.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}