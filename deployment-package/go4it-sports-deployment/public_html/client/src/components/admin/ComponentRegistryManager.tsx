import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Trash2, Plus, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

import {
  useComponentTypes,
  useComponentCategories,
  useCreateComponentType,
  useUpdateComponentType,
  useDeleteComponentType,
} from "@/modules/cms/hooks/useComponentRegistry";
import { ComponentRegistryItem } from "@/services/component-registry-api-service";

// Define schema for form validation
const componentTypeSchema = z.object({
  identifier: z.string().min(3, {
    message: "Identifier must be at least 3 characters long",
  }),
  name: z.string().min(3, {
    message: "Name must be at least 3 characters long",
  }),
  description: z.string().optional(),
  category: z.string().min(1, {
    message: "Category is required",
  }),
  icon: z.string().optional(),
  props: z.string().optional(),
  defaultProps: z.string().optional(),
});

type ComponentTypeFormValues = z.infer<typeof componentTypeSchema>;

export default function ComponentRegistryManager() {
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<ComponentRegistryItem | null>(null);

  // Fetch data using react-query hooks
  const { data: componentTypes = [], isLoading: isLoadingComponents, isError: isComponentsError } = useComponentTypes();
  const { data: categories = [], isLoading: isLoadingCategories, isError: isCategoriesError } = useComponentCategories();
  
  // Mutations
  const createMutation = useCreateComponentType();
  const updateMutation = useUpdateComponentType(selectedComponent?.identifier || '');
  const deleteMutation = useDeleteComponentType();

  // Initialize React Hook Form for create component form
  const createForm = useForm<ComponentTypeFormValues>({
    resolver: zodResolver(componentTypeSchema),
    defaultValues: {
      identifier: "",
      name: "",
      description: "",
      category: "",
      icon: "",
      props: "{}",
      defaultProps: "{}",
    },
  });

  // Initialize React Hook Form for edit component form
  const editForm = useForm<ComponentTypeFormValues>({
    resolver: zodResolver(componentTypeSchema),
    defaultValues: {
      identifier: "",
      name: "",
      description: "",
      category: "",
      icon: "",
      props: "{}",
      defaultProps: "{}",
    },
  });

  // Handle create form submission
  const onCreateSubmit = (data: ComponentTypeFormValues) => {
    try {
      const formattedData = {
        ...data,
        props: JSON.parse(data.props || "{}"),
        defaultProps: JSON.parse(data.defaultProps || "{}"),
      };

      createMutation.mutate(formattedData, {
        onSuccess: () => {
          setIsCreateDialogOpen(false);
          createForm.reset();
        },
        onError: (error: any) => {
          toast({
            title: "Error creating component",
            description: error.message || "An error occurred while creating the component.",
            variant: "destructive",
          });
        },
      });
    } catch (e: any) {
      toast({
        title: "Invalid JSON",
        description: "Please check the props and defaultProps fields for valid JSON.",
        variant: "destructive",
      });
    }
  };

  // Handle edit form submission
  const onUpdateSubmit = (data: ComponentTypeFormValues) => {
    if (!selectedComponent) return;

    try {
      const formattedData = {
        ...data,
        props: JSON.parse(data.props || "{}"),
        defaultProps: JSON.parse(data.defaultProps || "{}"),
      };

      updateMutation.mutate(formattedData, {
        onSuccess: () => {
          setIsEditDialogOpen(false);
          setSelectedComponent(null);
          editForm.reset();
        },
        onError: (error: any) => {
          toast({
            title: "Error updating component",
            description: error.message || "An error occurred while updating the component.",
            variant: "destructive",
          });
        },
      });
    } catch (e: any) {
      toast({
        title: "Invalid JSON",
        description: "Please check the props and defaultProps fields for valid JSON.",
        variant: "destructive",
      });
    }
  };

  // Handle delete
  const handleDelete = () => {
    if (!selectedComponent) return;

    deleteMutation.mutate(selectedComponent.identifier, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        setSelectedComponent(null);
      },
      onError: (error: any) => {
        toast({
          title: "Error deleting component",
          description: error.message || "An error occurred while deleting the component.",
          variant: "destructive",
        });
      },
    });
  };

  // Handle edit button click
  const handleEditClick = (component: ComponentRegistryItem) => {
    setSelectedComponent(component);
    
    editForm.reset({
      identifier: component.identifier,
      name: component.name,
      description: component.description,
      category: component.category,
      icon: component.icon,
      props: JSON.stringify(component.props, null, 2),
      defaultProps: JSON.stringify(component.defaultProps, null, 2),
    });
    
    setIsEditDialogOpen(true);
  };

  // Handle delete button click
  const handleDeleteClick = (component: ComponentRegistryItem) => {
    setSelectedComponent(component);
    setIsDeleteDialogOpen(true);
  };

  // Loading and error states
  if (isLoadingComponents || isLoadingCategories) {
    return <div className="py-4 text-center">Loading component registry...</div>;
  }

  if (isComponentsError || isCategoriesError) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load component registry data. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Component Registry</h2>
          <p className="text-muted-foreground">
            Manage reusable components that can be used in the CMS.
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Component
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Component</DialogTitle>
              <DialogDescription>
                Register a new component type in the CMS. This component will be available for use in content pages.
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
                        <Input placeholder="hero-section" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Hero Section" {...field} />
                      </FormControl>
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
                          placeholder="A full-width hero section with image and text"
                          className="resize-none"
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                          <SelectItem value="layout">Layout</SelectItem>
                          <SelectItem value="content">Content</SelectItem>
                          <SelectItem value="feature">Feature</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
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
                      <FormLabel>Icon (Lucide Icon Name)</FormLabel>
                      <FormControl>
                        <Input placeholder="layout" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createForm.control}
                  name="props"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Props Schema (JSON)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='{"title": {"type": "string", "required": true}}'
                          className="resize-none font-mono"
                          rows={5}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createForm.control}
                  name="defaultProps"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Default Props (JSON)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='{"title": "Default Title"}'
                          className="resize-none font-mono"
                          rows={5}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit" disabled={createMutation.isPending}>
                    {createMutation.isPending ? "Creating..." : "Create Component"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      <Separator />

      {componentTypes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="text-center">
              <h3 className="mt-2 text-lg font-semibold">No components registered</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Get started by adding your first component to the registry.
              </p>
              <Button
                className="mt-4"
                onClick={() => setIsCreateDialogOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Component
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Registered Components</CardTitle>
            <CardDescription>
              {componentTypes.length} component{componentTypes.length !== 1 ? 's' : ''} available in the registry
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Identifier</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {componentTypes.map((component) => (
                  <TableRow key={component.id}>
                    <TableCell className="font-medium">{component.name}</TableCell>
                    <TableCell className="font-mono text-xs">{component.identifier}</TableCell>
                    <TableCell>{component.category}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {component.description || "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClick(component)}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(component)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Component</DialogTitle>
            <DialogDescription>
              Update the properties of this component.
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onUpdateSubmit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Identifier</FormLabel>
                    <FormControl>
                      <Input disabled {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                        <SelectItem value="layout">Layout</SelectItem>
                        <SelectItem value="content">Content</SelectItem>
                        <SelectItem value="feature">Feature</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon (Lucide Icon Name)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="props"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Props Schema (JSON)</FormLabel>
                    <FormControl>
                      <Textarea
                        className="resize-none font-mono"
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="defaultProps"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Props (JSON)</FormLabel>
                    <FormControl>
                      <Textarea
                        className="resize-none font-mono"
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the component "{selectedComponent?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}