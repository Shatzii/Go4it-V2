/**
 * CMS Component Registry Routes
 * 
 * API routes for managing the registry of available component types in the CMS system.
 */

import { Request, Response, Router } from 'express';
import { storage } from '../storage';
import { isAuthenticatedMiddleware, isAdminMiddleware } from '../middleware/auth-middleware';

const router = Router();

// Apply authenticated middleware to all routes in this router
router.use(isAuthenticatedMiddleware);

/**
 * Get all registered component types
 * GET /api/cms/component-registry
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const componentTypes = await storage.getComponentTypes();
    res.json(componentTypes);
  } catch (error) {
    console.error("Error fetching component types:", error);
    res.status(500).json({ message: "Error fetching component types" });
  }
});

/**
 * Get component type by identifier
 * GET /api/cms/component-registry/:identifier
 */
router.get('/:identifier', async (req: Request, res: Response) => {
  try {
    const { identifier } = req.params;
    const componentType = await storage.getComponentTypeByIdentifier(identifier);
    
    if (!componentType) {
      return res.status(404).json({ message: "Component type not found" });
    }
    
    res.json(componentType);
  } catch (error) {
    console.error(`Error fetching component type with identifier ${req.params.identifier}:`, error);
    res.status(500).json({ message: "Error fetching component type" });
  }
});

// The following routes are admin-only
router.use(isAdminMiddleware);

/**
 * Register a new component type
 * POST /api/cms/component-registry
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      identifier,
      name,
      description,
      category,
      icon,
      schema,
      defaultConfig,
      previewImage
    } = req.body;

    // Basic validation
    if (!identifier || !name) {
      return res.status(400).json({ message: "Missing required fields: identifier, name" });
    }

    // Check for duplicate identifier
    const existingType = await storage.getComponentTypeByIdentifier(identifier);
    if (existingType) {
      return res.status(409).json({ message: "A component type with this identifier already exists" });
    }

    // Get user ID from session
    const userId = req.user?.id;

    const newComponentType = await storage.createComponentType({
      identifier,
      name,
      description: description || "",
      category: category || "general",
      icon: icon || "box",
      schema: schema || {},
      defaultConfig: defaultConfig || {},
      previewImage: previewImage || null,
      createdBy: userId,
      lastUpdatedBy: userId
    });

    res.status(201).json(newComponentType);
  } catch (error) {
    console.error("Error registering component type:", error);
    res.status(500).json({ message: "Error registering component type" });
  }
});

/**
 * Update a component type
 * PATCH /api/cms/component-registry/:identifier
 */
router.patch('/:identifier', async (req: Request, res: Response) => {
  try {
    const { identifier } = req.params;
    const componentType = await storage.getComponentTypeByIdentifier(identifier);
    
    if (!componentType) {
      return res.status(404).json({ message: "Component type not found" });
    }

    // Get user ID from session
    const userId = req.user?.id;

    const updatedComponentType = await storage.updateComponentType(identifier, {
      ...req.body,
      lastUpdatedBy: userId
    });
    
    res.json(updatedComponentType);
  } catch (error) {
    console.error(`Error updating component type with identifier ${req.params.identifier}:`, error);
    res.status(500).json({ message: "Error updating component type" });
  }
});

/**
 * Delete a component type
 * DELETE /api/cms/component-registry/:identifier
 */
router.delete('/:identifier', async (req: Request, res: Response) => {
  try {
    const { identifier } = req.params;
    const componentType = await storage.getComponentTypeByIdentifier(identifier);
    
    if (!componentType) {
      return res.status(404).json({ message: "Component type not found" });
    }

    // Check if this component type is in use
    const inUseCount = await storage.countComponentsUsingType(identifier);
    if (inUseCount > 0) {
      return res.status(409).json({ 
        message: `Cannot delete: This component type is in use by ${inUseCount} page components`,
        inUseCount
      });
    }

    await storage.deleteComponentType(identifier);
    
    res.json({ success: true, message: "Component type deleted successfully" });
  } catch (error) {
    console.error(`Error deleting component type with identifier ${req.params.identifier}:`, error);
    res.status(500).json({ message: "Error deleting component type" });
  }
});

/**
 * Get all component categories
 * GET /api/cms/component-registry/categories/all
 */
router.get('/categories/all', async (req: Request, res: Response) => {
  try {
    const categories = await storage.getComponentCategories();
    res.json(categories);
  } catch (error) {
    console.error("Error fetching component categories:", error);
    res.status(500).json({ message: "Error fetching component categories" });
  }
});

export default router;