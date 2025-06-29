import { 
  pages, type Page, type InsertPage,
  pageComponents, type PageComponent, type InsertPageComponent,
  componentRegistry, type ComponentRegistryItem, type InsertComponentRegistryItem,
  users
} from "@shared/schema";
import { db } from "./db";
import { eq, sql, desc, count } from "drizzle-orm";

/**
 * CMS storage implementation functions
 * These methods will be integrated into the DatabaseStorage class
 */

// CMS: Component Registry operations
export async function getComponentTypes(): Promise<ComponentRegistryItem[]> {
  try {
    return await db.select().from(componentRegistry).orderBy(componentRegistry.category, componentRegistry.name);
  } catch (error) {
    console.error("Error getting component types:", error);
    return [];
  }
}

export async function getComponentTypeByIdentifier(identifier: string): Promise<ComponentRegistryItem | undefined> {
  try {
    const [componentType] = await db
      .select()
      .from(componentRegistry)
      .where(eq(componentRegistry.identifier, identifier));
    return componentType;
  } catch (error) {
    console.error(`Error getting component type with identifier ${identifier}:`, error);
    return undefined;
  }
}

export async function getComponentCategories(): Promise<string[]> {
  try {
    const result = await db
      .select({ category: componentRegistry.category })
      .from(componentRegistry)
      .groupBy(componentRegistry.category)
      .orderBy(componentRegistry.category);
    
    return result.map(item => item.category);
  } catch (error) {
    console.error("Error getting component categories:", error);
    return [];
  }
}

export async function createComponentType(data: InsertComponentRegistryItem): Promise<ComponentRegistryItem> {
  try {
    const [componentType] = await db
      .insert(componentRegistry)
      .values({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    
    return componentType;
  } catch (error) {
    console.error("Error creating component type:", error);
    throw error;
  }
}

export async function updateComponentType(identifier: string, data: Partial<ComponentRegistryItem>): Promise<ComponentRegistryItem | undefined> {
  try {
    const [updatedComponentType] = await db
      .update(componentRegistry)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(eq(componentRegistry.identifier, identifier))
      .returning();
    
    return updatedComponentType;
  } catch (error) {
    console.error(`Error updating component type with identifier ${identifier}:`, error);
    return undefined;
  }
}

export async function deleteComponentType(identifier: string): Promise<boolean> {
  try {
    const result = await db
      .delete(componentRegistry)
      .where(eq(componentRegistry.identifier, identifier));
    
    return result.rowCount > 0;
  } catch (error) {
    console.error(`Error deleting component type with identifier ${identifier}:`, error);
    return false;
  }
}

export async function countComponentsUsingType(identifier: string): Promise<number> {
  try {
    const result = await db
      .select({ count: sql`count(*)` })
      .from(pageComponents)
      .where(eq(pageComponents.type, identifier));
    
    return Number(result[0]?.count) || 0;
  } catch (error) {
    console.error(`Error counting components using type ${identifier}:`, error);
    return 0;
  }
}

// CMS: Page operations
export async function getPages(): Promise<Page[]> {
  try {
    return await db
      .select()
      .from(pages)
      .orderBy(pages.title);
  } catch (error) {
    console.error("Error getting pages:", error);
    return [];
  }
}

export async function getPage(id: number): Promise<Page | undefined> {
  try {
    const [page] = await db
      .select()
      .from(pages)
      .where(eq(pages.id, id));
    
    return page;
  } catch (error) {
    console.error(`Error getting page with id ${id}:`, error);
    return undefined;
  }
}

export async function getPageBySlug(slug: string): Promise<Page | undefined> {
  try {
    const [page] = await db
      .select()
      .from(pages)
      .where(eq(pages.slug, slug));
    
    return page;
  } catch (error) {
    console.error(`Error getting page with slug ${slug}:`, error);
    return undefined;
  }
}

export async function createPage(data: InsertPage): Promise<Page> {
  try {
    const [page] = await db
      .insert(pages)
      .values({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    
    return page;
  } catch (error) {
    console.error("Error creating page:", error);
    throw error;
  }
}

export async function updatePage(id: number, data: Partial<Page>): Promise<Page | undefined> {
  try {
    const [updatedPage] = await db
      .update(pages)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(eq(pages.id, id))
      .returning();
    
    return updatedPage;
  } catch (error) {
    console.error(`Error updating page with id ${id}:`, error);
    return undefined;
  }
}

export async function deletePage(id: number): Promise<boolean> {
  try {
    // First delete all components associated with this page
    await db
      .delete(pageComponents)
      .where(eq(pageComponents.pageId, id));
    
    // Then delete the page
    const result = await db
      .delete(pages)
      .where(eq(pages.id, id));
    
    return result.rowCount > 0;
  } catch (error) {
    console.error(`Error deleting page with id ${id}:`, error);
    return false;
  }
}

export async function publishPage(id: number, isPublished: boolean): Promise<Page | undefined> {
  try {
    const publishDate = isPublished ? new Date() : null;
    
    const [updatedPage] = await db
      .update(pages)
      .set({
        active: isPublished,
        publishDate,
        updatedAt: new Date()
      })
      .where(eq(pages.id, id))
      .returning();
    
    return updatedPage;
  } catch (error) {
    console.error(`Error ${isPublished ? 'publishing' : 'unpublishing'} page with id ${id}:`, error);
    return undefined;
  }
}

export async function clonePage(id: number, newSlug: string): Promise<Page | undefined> {
  try {
    // Get the original page
    const originalPage = await getPage(id);
    if (!originalPage) return undefined;
    
    // Create a new page with the same content but a different slug
    const [clonedPage] = await db
      .insert(pages)
      .values({
        title: `${originalPage.title} (Copy)`,
        slug: newSlug,
        description: originalPage.description,
        content: originalPage.content,
        className: originalPage.className,
        components: originalPage.components,
        metadata: originalPage.metadata,
        active: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: originalPage.createdBy
      })
      .returning();
    
    // Clone all components from the original page
    const originalComponents = await getPageComponents(id);
    for (const component of originalComponents) {
      await db
        .insert(pageComponents)
        .values({
          pageId: clonedPage.id,
          type: component.type,
          title: component.title,
          content: component.content,
          configuration: component.configuration,
          position: component.position,
          section: component.section,
          active: component.active,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: component.createdBy
        });
    }
    
    return clonedPage;
  } catch (error) {
    console.error(`Error cloning page with id ${id}:`, error);
    return undefined;
  }
}

// CMS: Page Components operations
export async function getPageComponents(pageId: number): Promise<PageComponent[]> {
  try {
    return await db
      .select()
      .from(pageComponents)
      .where(eq(pageComponents.pageId, pageId))
      .orderBy(pageComponents.position);
  } catch (error) {
    console.error(`Error getting page components for page ${pageId}:`, error);
    return [];
  }
}

export async function getPageComponent(id: number): Promise<PageComponent | undefined> {
  try {
    const [component] = await db
      .select()
      .from(pageComponents)
      .where(eq(pageComponents.id, id));
    
    return component;
  } catch (error) {
    console.error(`Error getting page component with id ${id}:`, error);
    return undefined;
  }
}

export async function createPageComponent(data: InsertPageComponent): Promise<PageComponent> {
  try {
    const [component] = await db
      .insert(pageComponents)
      .values({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    
    return component;
  } catch (error) {
    console.error("Error creating page component:", error);
    throw error;
  }
}

export async function updatePageComponent(id: number, data: Partial<PageComponent>): Promise<PageComponent | undefined> {
  try {
    const [updatedComponent] = await db
      .update(pageComponents)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(eq(pageComponents.id, id))
      .returning();
    
    return updatedComponent;
  } catch (error) {
    console.error(`Error updating page component with id ${id}:`, error);
    return undefined;
  }
}

export async function deletePageComponent(id: number): Promise<boolean> {
  try {
    const result = await db
      .delete(pageComponents)
      .where(eq(pageComponents.id, id));
    
    return result.rowCount > 0;
  } catch (error) {
    console.error(`Error deleting page component with id ${id}:`, error);
    return false;
  }
}

export async function updatePageComponentPositions(components: { id: number, position: number }[]): Promise<boolean> {
  try {
    // Create a transaction to update all positions
    for (const component of components) {
      await db
        .update(pageComponents)
        .set({
          position: component.position,
          updatedAt: new Date()
        })
        .where(eq(pageComponents.id, component.id));
    }
    
    return true;
  } catch (error) {
    console.error("Error updating page component positions:", error);
    return false;
  }
}