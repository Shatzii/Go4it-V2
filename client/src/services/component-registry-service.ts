/**
 * Component Registry Service
 * 
 * This service is responsible for registering and managing all components that can be used in the CMS.
 * It allows for both UI components and feature modules to be centrally registered and discovered.
 */

import React from 'react';
import { 
  registerContentComponent, 
  registerSectionComponent 
} from '@/modules/cms/components/ComponentRegistry';

// Feature module interface
export interface FeatureModule {
  id: string;
  name: string;
  description: string;
  version: string;
  routes?: Array<{
    path: string;
    component: React.ComponentType;
    exact?: boolean;
  }>;
  components?: {[key: string]: React.ComponentType<any>};
  hooks?: {[key: string]: any};
  services?: {[key: string]: any};
  adminPages?: Array<{
    path: string;
    component: React.ComponentType;
    title: string;
    icon?: React.ReactNode;
    group?: string;
  }>;
  initialize?: () => Promise<void>;
}

// UI component interface
export interface UIComponent {
  id: string;
  name: string;
  description: string;
  component: React.ComponentType<any>;
  props?: {[key: string]: any};
  category?: string;
  tags?: string[];
  thumbnail?: string;
  previewContent?: any;
}

// Singleton pattern for the registry
class ComponentRegistryService {
  private featureModules: Map<string, FeatureModule> = new Map();
  private uiComponents: Map<string, UIComponent> = new Map();
  private initialized: boolean = false;

  /**
   * Register a UI component with the registry
   * @param component The UI component definition
   */
  registerUIComponent(component: UIComponent): void {
    if (this.uiComponents.has(component.id)) {
      console.warn(`UI Component with ID "${component.id}" already registered. Overriding.`);
    }
    this.uiComponents.set(component.id, component);
    
    // Also register with the CMS ComponentRegistry
    registerContentComponent(component.id, component.component);
  }

  /**
   * Register a feature module with the registry
   * @param module The feature module definition
   */
  registerFeatureModule(module: FeatureModule): void {
    if (this.featureModules.has(module.id)) {
      console.warn(`Feature Module with ID "${module.id}" already registered. Overriding.`);
    }
    this.featureModules.set(module.id, module);
    
    // Register all components from the module
    if (module.components) {
      Object.entries(module.components).forEach(([key, component]) => {
        const componentId = `${module.id}.${key}`;
        registerContentComponent(componentId, component);
      });
    }
  }

  /**
   * Get a UI component by ID
   * @param id The component ID
   * @returns The UI component or undefined if not found
   */
  getUIComponent(id: string): UIComponent | undefined {
    return this.uiComponents.get(id);
  }

  /**
   * Get a feature module by ID
   * @param id The module ID
   * @returns The feature module or undefined if not found
   */
  getFeatureModule(id: string): FeatureModule | undefined {
    return this.featureModules.get(id);
  }

  /**
   * Get all registered UI components
   * @returns Array of all UI components
   */
  getAllUIComponents(): UIComponent[] {
    return Array.from(this.uiComponents.values());
  }

  /**
   * Get all registered feature modules
   * @returns Array of all feature modules
   */
  getAllFeatureModules(): FeatureModule[] {
    return Array.from(this.featureModules.values());
  }

  /**
   * Get UI components by category
   * @param category The category to filter by
   * @returns Array of UI components in the given category
   */
  getUIComponentsByCategory(category: string): UIComponent[] {
    return this.getAllUIComponents().filter(component => 
      component.category === category
    );
  }

  /**
   * Get UI components by tags
   * @param tags The tags to filter by
   * @returns Array of UI components with matching tags
   */
  getUIComponentsByTags(tags: string[]): UIComponent[] {
    return this.getAllUIComponents().filter(component => 
      component.tags && component.tags.some(tag => tags.includes(tag))
    );
  }

  /**
   * Get admin pages from all feature modules
   * @returns Array of all admin pages
   */
  getAllAdminPages(): Array<{
    path: string;
    component: React.ComponentType;
    title: string;
    icon?: React.ReactNode;
    group?: string;
    moduleId: string;
  }> {
    const pages: Array<{
      path: string;
      component: React.ComponentType;
      title: string;
      icon?: React.ReactNode;
      group?: string;
      moduleId: string;
    }> = [];

    this.featureModules.forEach((module, moduleId) => {
      if (module.adminPages) {
        module.adminPages.forEach(page => {
          pages.push({
            ...page,
            moduleId
          });
        });
      }
    });

    return pages;
  }

  /**
   * Initialize all registered feature modules
   * @returns Promise that resolves when all modules are initialized
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    const initPromises: Promise<void>[] = [];
    
    this.featureModules.forEach(module => {
      if (module.initialize) {
        initPromises.push(module.initialize());
      }
    });

    await Promise.all(initPromises);
    this.initialized = true;
  }
}

// Export a singleton instance
export const componentRegistry = new ComponentRegistryService();

/**
 * Hook to access the component registry
 * @returns The component registry service
 */
export function useComponentRegistry() {
  return componentRegistry;
}