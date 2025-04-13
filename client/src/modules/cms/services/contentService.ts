import { ContentBlock, PageData } from '../types';

/**
 * Fetch all content blocks
 * @returns Promise with all content blocks
 */
export async function getAllContentBlocks(): Promise<ContentBlock[]> {
  const response = await fetch('/api/cms/content-blocks');
  if (!response.ok) {
    throw new Error(`Failed to fetch content blocks: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Fetch a specific content block by identifier
 * @param identifier The unique identifier for the content block
 * @returns Promise with the content block
 */
export async function getContentBlock(identifier: string): Promise<ContentBlock> {
  const response = await fetch(`/api/cms/content/${identifier}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch content block ${identifier}: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Fetch all content blocks for a specific section
 * @param section The section name
 * @returns Promise with all content blocks in the section
 */
export async function getContentSection(section: string): Promise<ContentBlock[]> {
  const response = await fetch(`/api/cms/content/section/${section}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch content section ${section}: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Create a new content block
 * @param data The content block data to create
 * @returns Promise with the created content block
 */
export async function createContentBlock(data: Omit<ContentBlock, 'id'>): Promise<ContentBlock> {
  const response = await fetch('/api/cms/content', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to create content block: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Update an existing content block
 * @param id The ID of the content block to update
 * @param data The updated content block data
 * @returns Promise with the updated content block
 */
export async function updateContentBlock(id: number, data: Partial<ContentBlock>): Promise<ContentBlock> {
  const response = await fetch(`/api/cms/content/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to update content block ${id}: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Delete a content block
 * @param id The ID of the content block to delete
 * @returns Promise with success status
 */
export async function deleteContentBlock(id: number): Promise<{ success: boolean }> {
  const response = await fetch(`/api/cms/content/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to delete content block ${id}: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Fetch a page by its slug
 * @param slug The unique slug identifier for the page
 * @returns Promise with the page data
 */
export async function getPage(slug: string): Promise<PageData> {
  const response = await fetch(`/api/cms/pages/${slug}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch page ${slug}: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Fetch all pages
 * @returns Promise with all pages
 */
export async function getAllPages(): Promise<PageData[]> {
  const response = await fetch('/api/cms/pages');
  if (!response.ok) {
    throw new Error(`Failed to fetch pages: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Create a new page
 * @param data The page data to create
 * @returns Promise with the created page
 */
export async function createPage(data: Omit<PageData, 'id'>): Promise<PageData> {
  const response = await fetch('/api/cms/pages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to create page: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Update an existing page
 * @param id The ID of the page to update
 * @param data The updated page data
 * @returns Promise with the updated page
 */
export async function updatePage(id: number, data: Partial<PageData>): Promise<PageData> {
  const response = await fetch(`/api/cms/pages/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to update page ${id}: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Delete a page
 * @param id The ID of the page to delete
 * @returns Promise with success status
 */
export async function deletePage(id: number): Promise<{ success: boolean }> {
  const response = await fetch(`/api/cms/pages/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to delete page ${id}: ${response.statusText}`);
  }
  
  return response.json();
}