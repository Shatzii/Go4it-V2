/**
 * CMS Page Components Routes
 * 
 * API routes for managing page components in the CMS system.
 */

import { Request, Response, Router } from 'express';
import { storage } from '../storage';
import { isAuthenticatedMiddleware, isAdminMiddleware } from '../middleware/auth-middleware';

const router = Router();

// Apply admin middleware to all routes in this router
router.use(isAuthenticatedMiddleware, isAdminMiddleware);

/**
 * Get all page components for a specific page
 * GET /api/cms/page-components/:pageId
 */
router.get('/:pageId', async (req: Request, res: Response) => {
  try {
    const pageId = parseInt(req.params.pageId);
    if (isNaN(pageId)) {
      return res.status(400).json({ message: "Invalid page ID format" });
    }

    const components = await storage.getPageComponents(pageId);
    res.json(components);
  } catch (error) {
    console.error("Error fetching page components:", error);
    res.status(500).json({ message: "Error fetching page components" });
  }
});

/**
 * Create a new page component
 * POST /api/cms/page-components
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      pageId,
      type,
      title,
      content,
      configuration,
      position,
      section,
      active
    } = req.body;

    // Basic validation
    if (!pageId || !type) {
      return res.status(400).json({ message: "Missing required fields: pageId, type" });
    }

    // Get user ID from session
    const userId = req.user?.id;

    const newComponent = await storage.createPageComponent({
      pageId,
      type,
      title: title || "",
      content: content || "",
      configuration: configuration || {},
      position: position || 0,
      section: section || "main",
      active: active !== undefined ? active : true,
      createdBy: userId,
      lastUpdatedBy: userId
    });

    res.status(201).json(newComponent);
  } catch (error) {
    console.error("Error creating page component:", error);
    res.status(500).json({ message: "Error creating page component" });
  }
});

/**
 * Get page component by ID
 * GET /api/cms/page-components/component/:id
 */
router.get('/component/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const component = await storage.getPageComponentById(id);
    
    if (!component) {
      return res.status(404).json({ message: "Page component not found" });
    }
    
    res.json(component);
  } catch (error) {
    console.error(`Error fetching page component with ID ${req.params.id}:`, error);
    res.status(500).json({ message: "Error fetching page component" });
  }
});

/**
 * Update page component by ID
 * PATCH /api/cms/page-components/component/:id
 */
router.patch('/component/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const component = await storage.getPageComponentById(id);
    
    if (!component) {
      return res.status(404).json({ message: "Page component not found" });
    }

    // Get user ID from session
    const userId = req.user?.id;

    const updatedComponent = await storage.updatePageComponent(id, {
      ...req.body,
      lastUpdatedBy: userId
    });
    
    res.json(updatedComponent);
  } catch (error) {
    console.error(`Error updating page component with ID ${req.params.id}:`, error);
    res.status(500).json({ message: "Error updating page component" });
  }
});

/**
 * Delete page component by ID
 * DELETE /api/cms/page-components/component/:id
 */
router.delete('/component/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const component = await storage.getPageComponentById(id);
    
    if (!component) {
      return res.status(404).json({ message: "Page component not found" });
    }

    await storage.deletePageComponent(id);
    
    res.json({ success: true, message: "Page component deleted successfully" });
  } catch (error) {
    console.error(`Error deleting page component with ID ${req.params.id}:`, error);
    res.status(500).json({ message: "Error deleting page component" });
  }
});

/**
 * Update page component positions (batch update)
 * PATCH /api/cms/page-components/positions
 */
router.patch('/positions', async (req: Request, res: Response) => {
  try {
    const { positions } = req.body;
    
    if (!positions || !Array.isArray(positions)) {
      return res.status(400).json({ message: "Invalid positions data. Expected array of { id, position }" });
    }

    const userId = req.user?.id;
    
    // Update positions for all components in the array
    const results = await Promise.all(
      positions.map(item => 
        storage.updatePageComponent(item.id, { 
          position: item.position,
          lastUpdatedBy: userId
        })
      )
    );
    
    res.json({ 
      success: true, 
      message: "Component positions updated successfully",
      updatedComponents: results.length
    });
  } catch (error) {
    console.error("Error updating component positions:", error);
    res.status(500).json({ message: "Error updating component positions" });
  }
});

export default router;