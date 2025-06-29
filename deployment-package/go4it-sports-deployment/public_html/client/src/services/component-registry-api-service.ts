import { apiRequest } from "@/lib/queryClient";

/**
 * Type definition for a Component Registry Item
 */
export interface ComponentRegistryItem {
  id: number;
  identifier: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  props: Record<string, any>;
  defaultProps: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Component Registry API Service
 * 
 * Service for interacting with the CMS component registry API endpoints
 */
export const componentRegistryApiService = {
  /**
   * Get all component types from the registry
   */
  async getAllComponentTypes(): Promise<ComponentRegistryItem[]> {
    const response = await apiRequest('/api/cms/component-registry', {
      method: 'GET',
    });
    return response;
  },

  /**
   * Get a component type by its identifier
   */
  async getComponentTypeByIdentifier(identifier: string): Promise<ComponentRegistryItem> {
    const response = await apiRequest(`/api/cms/component-registry/${identifier}`, {
      method: 'GET',
    });
    return response;
  },

  /**
   * Get all component categories
   */
  async getComponentCategories(): Promise<string[]> {
    const response = await apiRequest('/api/cms/component-registry/categories/all', {
      method: 'GET',
    });
    return response;
  },

  /**
   * Create a new component type
   */
  async createComponentType(data: Omit<ComponentRegistryItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<ComponentRegistryItem> {
    const response = await apiRequest('/api/cms/component-registry', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  },

  /**
   * Update an existing component type
   */
  async updateComponentType(identifier: string, data: Partial<ComponentRegistryItem>): Promise<ComponentRegistryItem> {
    const response = await apiRequest(`/api/cms/component-registry/${identifier}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return response;
  },

  /**
   * Delete a component type
   */
  async deleteComponentType(identifier: string): Promise<{ success: boolean; message: string }> {
    const response = await apiRequest(`/api/cms/component-registry/${identifier}`, {
      method: 'DELETE',
    });
    return response;
  },
};