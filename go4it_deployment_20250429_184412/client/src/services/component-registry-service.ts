import React from 'react';

// Interface for UI Component
export interface UIComponent {
  id: string;
  name: string;
  description: string;
  component: React.ComponentType<any>;
  category: string;
  tags?: string[];
  props?: Record<string, any>;
  thumbnail?: string;
}

// Interface for Admin Page
export interface AdminPage {
  path: string;
  component: React.ComponentType<any>;
  title: string;
  icon?: React.ReactNode;
  group?: string;
}

// Interface for Route
export interface RouteDefinition {
  path: string;
  component: React.ComponentType<any>;
  exact?: boolean;
}

// Interface for Feature Module
export interface FeatureModule {
  id: string;
  name: string;
  description: string;
  version: string;
  components: Record<string, React.ComponentType<any>>;
  adminPages?: AdminPage[];
  routes?: RouteDefinition[];
  initialize?: () => Promise<void>;
}

/**
 * Component Registry Service
 * 
 * Central registry for UI components, feature modules, and routes
 * Used by the CMS to dynamically load components based on configuration
 */
class ComponentRegistry {
  private components: Map<string, UIComponent>;
  private modules: Map<string, FeatureModule>;
  private adminPages: AdminPage[];
  private routes: RouteDefinition[];

  constructor() {
    this.components = new Map();
    this.modules = new Map();
    this.adminPages = [];
    this.routes = [];
    console.log('Component Registry initialized');
  }

  /**
   * Register a UI component
   */
  registerUIComponent(component: UIComponent): void {
    if (this.components.has(component.id)) {
      console.warn(`Component with id ${component.id} already exists. Overwriting.`);
    }
    this.components.set(component.id, component);
    console.log(`Registered UI component: ${component.name} (${component.id})`);
  }

  /**
   * Get a UI component by ID
   */
  getComponent(id: string): UIComponent | undefined {
    return this.components.get(id);
  }

  /**
   * Get all registered UI components
   */
  getRegisteredComponents(): UIComponent[] {
    return Array.from(this.components.values());
  }

  /**
   * Get components by category
   */
  getComponentsByCategory(category: string): UIComponent[] {
    return Array.from(this.components.values()).filter(
      (component) => component.category === category
    );
  }

  /**
   * Register a feature module
   */
  registerFeatureModule(module: FeatureModule): void {
    if (this.modules.has(module.id)) {
      console.warn(`Module with id ${module.id} already exists. Overwriting.`);
    }
    
    this.modules.set(module.id, module);
    
    // Register admin pages from the module
    if (module.adminPages && module.adminPages.length > 0) {
      this.adminPages.push(...module.adminPages);
    }
    
    // Register routes from the module
    if (module.routes && module.routes.length > 0) {
      this.routes.push(...module.routes);
    }
    
    console.log(`Registered feature module: ${module.name} (${module.id})`);
  }

  /**
   * Get a module by ID
   */
  getModule(id: string): FeatureModule | undefined {
    return this.modules.get(id);
  }

  /**
   * Get all registered modules
   */
  getRegisteredModules(): FeatureModule[] {
    return Array.from(this.modules.values());
  }

  /**
   * Get all admin pages
   */
  getAdminPages(): AdminPage[] {
    return this.adminPages;
  }

  /**
   * Get all routes
   */
  getRoutes(): RouteDefinition[] {
    return this.routes;
  }

  /**
   * Initialize all modules
   */
  async initializeModules(): Promise<void> {
    console.log('Initializing all registered modules...');
    const modules = Array.from(this.modules.values());
    
    for (const module of modules) {
      if (module.initialize) {
        try {
          await module.initialize();
          console.log(`Module ${module.name} initialized successfully`);
        } catch (error) {
          console.error(`Failed to initialize module ${module.name}:`, error);
        }
      }
    }
    
    console.log('All modules initialized');
  }

  /**
   * Get admin pages grouped by category
   */
  getGroupedAdminPages(): Record<string, AdminPage[]> {
    const grouped: Record<string, AdminPage[]> = {};
    
    this.adminPages.forEach((page) => {
      const group = page.group || 'Other';
      if (!grouped[group]) {
        grouped[group] = [];
      }
      grouped[group].push(page);
    });
    
    return grouped;
  }
}

// Create singleton instance
export const componentRegistry = new ComponentRegistry();

export default componentRegistry;