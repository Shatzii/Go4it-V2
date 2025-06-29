/**
 * CMS Pages Routes
 * 
 * API routes for managing pages in the CMS system.
 */

import { Request, Response, Router } from 'express';
import { storage } from '../storage';
import { isAuthenticatedMiddleware, isAdminMiddleware } from '../middleware/auth-middleware';
import { cmsCache } from '../services/cms/cache-service';

const router = Router();

// Apply admin middleware to all routes in this router
router.use(isAuthenticatedMiddleware, isAdminMiddleware);

/**
 * Get all pages
 * GET /api/cms/pages
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const active = req.query.active === 'true';
    const pages = await storage.getPages(active);
    res.json(pages);
  } catch (error) {
    console.error("Error fetching pages:", error);
    res.status(500).json({ message: "Error fetching pages" });
  }
});

/**
 * Create a new page
 * POST /api/cms/pages
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      slug,
      title,
      description,
      content,
      className,
      components,
      metadata,
      active,
      publishDate
    } = req.body;

    // Basic validation
    if (!slug || !title) {
      return res.status(400).json({ message: "Missing required fields: slug, title" });
    }

    // Check for duplicate slug
    const existingPage = await storage.getPageBySlug(slug);
    if (existingPage) {
      return res.status(409).json({ message: "A page with this slug already exists" });
    }

    // Get user ID from session
    const userId = req.user?.id;

    const newPage = await storage.createPage({
      slug,
      title,
      description: description || "",
      content: content || "",
      className: className || "",
      components: components || [],
      metadata: metadata || {},
      active: active !== undefined ? active : true,
      publishDate: publishDate ? new Date(publishDate) : null,
      createdBy: userId,
      lastUpdatedBy: userId
    });

    res.status(201).json(newPage);
  } catch (error) {
    console.error("Error creating page:", error);
    res.status(500).json({ message: "Error creating page" });
  }
});

/**
 * Get page by ID
 * GET /api/cms/pages/:id
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const page = await storage.getPageById(id);
    
    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }
    
    res.json(page);
  } catch (error) {
    console.error(`Error fetching page with ID ${req.params.id}:`, error);
    res.status(500).json({ message: "Error fetching page" });
  }
});

/**
 * Get page by slug
 * GET /api/cms/pages/slug/:slug
 */
router.get('/slug/:slug', async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug;
    const includeComponents = req.query.includeComponents === 'true';
    
    // Check if page is in cache
    const cacheKey = `page:${slug}${includeComponents ? ':with-components' : ''}`;
    const cachedPage = cmsCache.get(cacheKey);
    
    if (cachedPage) {
      return res.json(cachedPage);
    }
    
    // If not in cache, fetch from database
    const page = await storage.getPageBySlug(slug);
    
    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }
    
    let result = page;
    
    // If requested, include components data
    if (includeComponents && page.id) {
      const components = await storage.getPageComponents(page.id);
      result = { ...page, components };
    }
    
    // Cache the result
    cmsCache.set(cacheKey, result);
    
    res.json(result);
  } catch (error) {
    console.error(`Error fetching page with slug ${req.params.slug}:`, error);
    res.status(500).json({ message: "Error fetching page" });
  }
});

/**
 * Update page by ID
 * PATCH /api/cms/pages/:id
 */
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const page = await storage.getPageById(id);
    
    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }

    // If slug is being changed, check for duplicates
    if (req.body.slug && req.body.slug !== page.slug) {
      const existingPage = await storage.getPageBySlug(req.body.slug);
      if (existingPage && existingPage.id !== id) {
        return res.status(409).json({ message: "A page with this slug already exists" });
      }
    }

    // Get user ID from session
    const userId = req.user?.id;

    const updatedPage = await storage.updatePage(id, {
      ...req.body,
      lastUpdatedBy: userId
    });
    
    // Invalidate cache for this page
    if (page.slug) {
      cmsCache.invalidatePage(page.slug);
    }
    if (req.body.slug && req.body.slug !== page.slug) {
      cmsCache.invalidatePage(req.body.slug);
    }
    
    res.json(updatedPage);
  } catch (error) {
    console.error(`Error updating page with ID ${req.params.id}:`, error);
    res.status(500).json({ message: "Error updating page" });
  }
});

/**
 * Delete page by ID
 * DELETE /api/cms/pages/:id
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const page = await storage.getPageById(id);
    
    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }

    // Delete all components associated with this page first
    await storage.deletePageComponentsByPageId(id);
    
    // Then delete the page
    await storage.deletePage(id);
    
    // Invalidate cache for this page
    if (page.slug) {
      cmsCache.invalidatePage(page.slug);
    }
    
    res.json({ success: true, message: "Page and its components deleted successfully" });
  } catch (error) {
    console.error(`Error deleting page with ID ${req.params.id}:`, error);
    res.status(500).json({ message: "Error deleting page" });
  }
});

/**
 * Publish or unpublish a page
 * PATCH /api/cms/pages/:id/publish
 */
router.patch('/:id/publish', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    
    const { active } = req.body;
    if (active === undefined) {
      return res.status(400).json({ message: "Missing required field: active" });
    }

    const page = await storage.getPageById(id);
    
    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }

    // Get user ID from session
    const userId = req.user?.id;

    const updatedPage = await storage.updatePage(id, {
      active,
      lastUpdatedBy: userId,
      publishDate: active ? new Date() : page.publishDate
    });
    
    // Invalidate cache for this page
    if (page.slug) {
      cmsCache.invalidatePage(page.slug);
    }
    
    res.json({ 
      success: true, 
      message: active ? "Page published successfully" : "Page unpublished successfully",
      page: updatedPage
    });
  } catch (error) {
    console.error(`Error updating publish status for page with ID ${req.params.id}:`, error);
    res.status(500).json({ message: "Error updating publish status" });
  }
});

/**
 * Clone a page
 * POST /api/cms/pages/:id/clone
 */
router.post('/:id/clone', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    
    const { newSlug, newTitle } = req.body;
    if (!newSlug || !newTitle) {
      return res.status(400).json({ message: "Missing required fields: newSlug, newTitle" });
    }

    // Check for duplicate slug
    const existingPage = await storage.getPageBySlug(newSlug);
    if (existingPage) {
      return res.status(409).json({ message: "A page with this slug already exists" });
    }

    const sourcePage = await storage.getPageById(id);
    
    if (!sourcePage) {
      return res.status(404).json({ message: "Source page not found" });
    }

    // Get user ID from session
    const userId = req.user?.id;

    // Create the new page
    const newPage = await storage.createPage({
      ...sourcePage,
      id: undefined, // Let the database assign a new ID
      slug: newSlug,
      title: newTitle,
      active: false, // Default to inactive
      publishDate: null,
      createdBy: userId,
      lastUpdatedBy: userId,
      createdAt: undefined, // Let the database set the current date
      updatedAt: undefined
    });

    // Clone all components
    if (sourcePage.id) {
      const sourceComponents = await storage.getPageComponents(sourcePage.id);
      
      // Create cloned components with new pageId
      await Promise.all(sourceComponents.map(component => {
        return storage.createPageComponent({
          ...component,
          id: undefined, // Let the database assign a new ID
          pageId: newPage.id,
          createdBy: userId,
          lastUpdatedBy: userId,
          createdAt: undefined, // Let the database set the current date
          updatedAt: undefined
        });
      }));
    }
    
    res.status(201).json({ 
      success: true, 
      message: "Page cloned successfully",
      page: newPage
    });
  } catch (error) {
    console.error(`Error cloning page with ID ${req.params.id}:`, error);
    res.status(500).json({ message: "Error cloning page" });
  }
});

export default router;