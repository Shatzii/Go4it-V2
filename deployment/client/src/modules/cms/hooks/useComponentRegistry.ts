import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";
import { componentRegistryApiService } from "@/services/component-registry-api-service";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

const COMPONENT_TYPES_QUERY_KEY = ['/api/cms/component-registry'];
const COMPONENT_CATEGORIES_QUERY_KEY = ['/api/cms/component-registry/categories/all'];

/**
 * Hook for fetching all component types
 */
export function useComponentTypes() {
  return useQuery({
    queryKey: COMPONENT_TYPES_QUERY_KEY,
    queryFn: () => componentRegistryApiService.getAllComponentTypes(),
  });
}

/**
 * Hook for fetching a component type by identifier
 */
export function useComponentType(identifier: string | null) {
  return useQuery({
    queryKey: [...COMPONENT_TYPES_QUERY_KEY, identifier],
    queryFn: () => componentRegistryApiService.getComponentTypeByIdentifier(identifier as string),
    enabled: !!identifier,
  });
}

/**
 * Hook for fetching all component categories
 */
export function useComponentCategories() {
  return useQuery({
    queryKey: COMPONENT_CATEGORIES_QUERY_KEY,
    queryFn: () => componentRegistryApiService.getComponentCategories(),
  });
}

/**
 * Hook for creating a new component type
 */
export function useCreateComponentType() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: any) => componentRegistryApiService.createComponentType(data),
    onSuccess: () => {
      toast({
        title: "Component created",
        description: "The component type was successfully created.",
      });
      
      // Invalidate queries to refetch the data
      queryClient.invalidateQueries({ queryKey: COMPONENT_TYPES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: COMPONENT_CATEGORIES_QUERY_KEY });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create component type.",
        variant: "destructive",
      });
    },
  });
}

/**
 * Hook for updating a component type
 */
export function useUpdateComponentType(identifier: string) {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: any) => componentRegistryApiService.updateComponentType(identifier, data),
    onSuccess: () => {
      toast({
        title: "Component updated",
        description: "The component type was successfully updated.",
      });
      
      // Invalidate queries to refetch the data
      queryClient.invalidateQueries({ queryKey: COMPONENT_TYPES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...COMPONENT_TYPES_QUERY_KEY, identifier] });
      queryClient.invalidateQueries({ queryKey: COMPONENT_CATEGORIES_QUERY_KEY });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update component type.",
        variant: "destructive",
      });
    },
  });
}

/**
 * Hook for deleting a component type
 */
export function useDeleteComponentType() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (identifier: string) => componentRegistryApiService.deleteComponentType(identifier),
    onSuccess: (data) => {
      toast({
        title: "Component deleted",
        description: data.message || "The component type was successfully deleted.",
      });
      
      // Invalidate queries to refetch the data
      queryClient.invalidateQueries({ queryKey: COMPONENT_TYPES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: COMPONENT_CATEGORIES_QUERY_KEY });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete component type.",
        variant: "destructive",
      });
    },
  });
}