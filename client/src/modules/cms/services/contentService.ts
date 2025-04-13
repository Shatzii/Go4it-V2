import { ContentBlock, PageData } from '../types';

import { cmsCache } from './cacheService';

/**
 * Fetch all content blocks
 * @returns Promise with all content blocks
 */
export async function getAllContentBlocks(): Promise<ContentBlock[]> {
  // Check cache first
  const cachedBlocks = cmsCache.getAllContentBlocks();
  if (cachedBlocks) {
    return cachedBlocks;
  }

  // Fetch from API if not in cache
  const response = await fetch('/api/content-blocks');
  if (!response.ok) {
    throw new Error(`Failed to fetch content blocks: ${response.statusText}`);
  }
  
  const blocks = await response.json();
  
  // Store in cache
  cmsCache.setAllContentBlocks(blocks);
  
  return blocks;
}

/**
 * Fetch a specific content block by identifier
 * @param identifier The unique identifier for the content block
 * @returns Promise with the content block
 */
export async function getContentBlock(identifier: string): Promise<ContentBlock> {
  // Check cache first
  const cachedBlock = cmsCache.getContentBlock(identifier);
  if (cachedBlock) {
    return cachedBlock;
  }

  // Fetch from API if not in cache
  const response = await fetch(`/api/content-blocks/${identifier}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch content block ${identifier}: ${response.statusText}`);
  }
  
  const block = await response.json();
  
  // Store in cache
  cmsCache.setContentBlock(identifier, block);
  
  return block;
}

/**
 * Fetch all content blocks for a specific section
 * @param section The section name
 * @returns Promise with all content blocks in the section
 */
export async function getContentSection(section: string): Promise<ContentBlock[]> {
  // Check cache first
  const cachedSection = cmsCache.getContentSection(section);
  if (cachedSection) {
    return cachedSection;
  }

  // Fetch from API if not in cache
  const response = await fetch(`/api/content-blocks/section/${section}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch content section ${section}: ${response.statusText}`);
  }
  
  const blocks = await response.json();
  
  // Store in cache
  cmsCache.setContentSection(section, blocks);
  
  return blocks;
}

/**
 * Create a new content block
 * @param data The content block data to create
 * @returns Promise with the created content block
 */
export async function createContentBlock(data: Omit<ContentBlock, 'id'>): Promise<ContentBlock> {
  const response = await fetch('/api/content-blocks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to create content block: ${response.statusText}`);
  }
  
  const newBlock = await response.json();
  
  // Invalidate section cache since a new block was added
  if (data.section) {
    cmsCache.invalidateContentSection(data.section);
  }
  
  return newBlock;
}

/**
 * Update an existing content block
 * @param id The ID of the content block to update
 * @param data The updated content block data
 * @returns Promise with the updated content block
 */
export async function updateContentBlock(id: number, data: Partial<ContentBlock>): Promise<ContentBlock> {
  // First, get the current content block to determine what cache keys to invalidate
  let currentBlock: ContentBlock | null = null;
  try {
    const blockResponse = await fetch(`/api/content-blocks/${id}`);
    if (blockResponse.ok) {
      currentBlock = await blockResponse.json();
    }
  } catch (error) {
    console.error("Error fetching current content block:", error);
  }
  
  const response = await fetch(`/api/content-blocks/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to update content block ${id}: ${response.statusText}`);
  }
  
  const updatedBlock = await response.json();
  
  // Invalidate cache for the section of the updated block
  if (updatedBlock.section) {
    cmsCache.invalidateContentSection(updatedBlock.section);
  }
  
  // Also invalidate the old section if it was changed
  if (currentBlock && currentBlock.section && currentBlock.section !== updatedBlock.section) {
    cmsCache.invalidateContentSection(currentBlock.section);
  }
  
  return updatedBlock;
}

/**
 * Delete a content block
 * @param id The ID of the content block to delete
 * @returns Promise with success status
 */
export async function deleteContentBlock(id: number): Promise<{ success: boolean }> {
  // First, get the content block to determine what cache keys to invalidate
  let blockToDelete: ContentBlock | null = null;
  try {
    const blockResponse = await fetch(`/api/content-blocks/${id}`);
    if (blockResponse.ok) {
      blockToDelete = await blockResponse.json();
    }
  } catch (error) {
    console.error("Error fetching content block to delete:", error);
  }
  
  const response = await fetch(`/api/content-blocks/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to delete content block ${id}: ${response.statusText}`);
  }
  
  const result = await response.json();
  
  // Invalidate cache for the section of the deleted block
  if (blockToDelete && blockToDelete.section) {
    cmsCache.invalidateContentSection(blockToDelete.section);
  }
  
  return result;
}

/**
 * Fetch a page by its slug
 * @param slug The unique slug identifier for the page
 * @returns Promise with the page data
 */
export async function getPage(slug: string): Promise<PageData> {
  // Check cache first
  const cachedPage = cmsCache.getPage(slug);
  if (cachedPage) {
    return cachedPage;
  }
  
  // Fetch from API if not in cache
  const response = await fetch(`/api/pages/${slug}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch page ${slug}: ${response.statusText}`);
  }
  
  const page = await response.json();
  
  // Store in cache
  cmsCache.setPage(slug, page);
  
  return page;
}

/**
 * Fetch all pages
 * @returns Promise with all pages
 */
export async function getAllPages(): Promise<PageData[]> {
  // Check cache first
  const cachedPages = cmsCache.getAllPages();
  if (cachedPages) {
    return cachedPages;
  }

  // Fetch from API if not in cache
  const response = await fetch('/api/pages');
  if (!response.ok) {
    throw new Error(`Failed to fetch pages: ${response.statusText}`);
  }
  
  const pages = await response.json();
  
  // Store in cache
  cmsCache.setAllPages(pages);
  
  return pages;
}

/**
 * Create a new page
 * @param data The page data to create
 * @returns Promise with the created page
 */
export async function createPage(data: Omit<PageData, 'id'>): Promise<PageData> {
  const response = await fetch('/api/pages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to create page: ${response.statusText}`);
  }
  
  const newPage = await response.json();
  
  // Invalidate the all pages cache since we added a new page
  // By setting the allPagesCache to null directly instead of using a separate method
  cmsCache.invalidateAllContent();
  
  return newPage;
}

/**
 * Update an existing page
 * @param id The ID of the page to update
 * @param data The updated page data
 * @returns Promise with the updated page
 */
export async function updatePage(id: number, data: Partial<PageData>): Promise<PageData> {
  // First fetch the page to get its slug for invalidation
  let pageToUpdate: PageData | null = null;
  try {
    const pageResponse = await fetch(`/api/pages/${id}`);
    if (pageResponse.ok) {
      pageToUpdate = await pageResponse.json();
    }
  } catch (error) {
    console.error("Error fetching page to update:", error);
  }
  
  const response = await fetch(`/api/pages/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to update page ${id}: ${response.statusText}`);
  }
  
  const updatedPage = await response.json();
  
  // Invalidate specific page cache
  if (pageToUpdate && pageToUpdate.slug) {
    cmsCache.invalidatePage(pageToUpdate.slug);
  }
  
  // If the slug was updated, invalidate both old and new slug
  if (data.slug && pageToUpdate && pageToUpdate.slug !== data.slug) {
    cmsCache.invalidatePage(data.slug);
  }
  
  // Also invalidate the all pages cache since a page was updated
  // Make it explicit for clarity
  cmsCache.invalidateAllContent();
  
  return updatedPage;
}

/**
 * Delete a page
 * @param id The ID of the page to delete
 * @returns Promise with success status
 */
export async function deletePage(id: number): Promise<{ success: boolean }> {
  // First fetch the page to get its slug for invalidation
  let pageToDelete: PageData | null = null;
  try {
    const pageResponse = await fetch(`/api/pages/${id}`);
    if (pageResponse.ok) {
      pageToDelete = await pageResponse.json();
    }
  } catch (error) {
    console.error("Error fetching page to delete:", error);
  }
  
  const response = await fetch(`/api/pages/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to delete page ${id}: ${response.statusText}`);
  }
  
  const result = await response.json();
  
  // Invalidate specific page cache
  if (pageToDelete && pageToDelete.slug) {
    cmsCache.invalidatePage(pageToDelete.slug);
  }
  
  // Also invalidate the all pages cache since a page was deleted
  // Make it explicit for clarity
  cmsCache.invalidateAllContent();
  
  return result;
}