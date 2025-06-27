/**
 * CMS Routes
 * 
 * API routes for the CMS system, serving content blocks and page data.
 */

import { Request, Response, Router } from 'express';
import { storage } from '../storage';

const router = Router();

// Get all content blocks
router.get('/content-blocks', async (req: Request, res: Response) => {
  try {
    const section = req.query.section as string;
    const contentBlocks = await storage.getContentBlocks();
    const filteredBlocks = section ? contentBlocks.filter(block => block.section === section) : contentBlocks;
    res.json(filteredBlocks);
  } catch (error) {
    console.error("Error fetching content blocks:", error);
    res.status(500).json({ message: "Error fetching content blocks" });
  }
});

// Create a new content block
router.post('/content-blocks', async (req: Request, res: Response) => {
  try {
    const {
      identifier,
      title,
      content,
      format,
      section,
      sortOrder,
      active,
      metadata
    } = req.body;

    // Basic validation
    if (!identifier || !content || !format) {
      return res.status(400).json({ message: "Missing required fields: identifier, content, format" });
    }

    // Get user ID from session if available
    const userId = req.user?.id || null;

    const newContentBlock = await storage.createContentBlock({
      identifier,
      title: title || "",
      content,
      format,
      section: section || "",
      sortOrder: sortOrder || 0,
      active: active !== undefined ? active : true,
      metadata: metadata || {},
      createdBy: userId,
      lastUpdatedBy: userId
    });

    res.status(201).json(newContentBlock);
  } catch (error) {
    console.error("Error creating content block:", error);
    res.status(500).json({ message: "Error creating content block" });
  }
});

// Get content block by ID
router.get('/content-blocks/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const contentBlock = await storage.getContentBlockById(id);
    
    if (!contentBlock) {
      return res.status(404).json({ message: "Content block not found" });
    }
    
    res.json(contentBlock);
  } catch (error) {
    console.error(`Error fetching content block with ID ${req.params.id}:`, error);
    res.status(500).json({ message: "Error fetching content block" });
  }
});

// Update content block by ID
router.patch('/content-blocks/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const contentBlock = await storage.getContentBlockById(id);
    
    if (!contentBlock) {
      return res.status(404).json({ message: "Content block not found" });
    }

    // Get user ID from session if available
    const userId = req.user?.id || null;

    const updatedContentBlock = await storage.updateContentBlock(id, {
      ...req.body,
      lastUpdatedBy: userId
    });
    
    res.json(updatedContentBlock);
  } catch (error) {
    console.error(`Error updating content block with ID ${req.params.id}:`, error);
    res.status(500).json({ message: "Error updating content block" });
  }
});

// Delete content block by ID
router.delete('/content-blocks/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const contentBlock = await storage.getContentBlockById(id);
    
    if (!contentBlock) {
      return res.status(404).json({ message: "Content block not found" });
    }

    await storage.deleteContentBlock(id);
    
    res.json({ success: true, message: "Content block deleted successfully" });
  } catch (error) {
    console.error(`Error deleting content block with ID ${req.params.id}:`, error);
    res.status(500).json({ message: "Error deleting content block" });
  }
});

// Get content blocks by section
router.get('/content-blocks/section/:section', async (req: Request, res: Response) => {
  try {
    const section = req.params.section;
    const contentBlocks = await storage.getContentBlocksBySection(section);
    res.json(contentBlocks);
  } catch (error) {
    console.error("Error fetching content blocks by section:", error);
    res.status(500).json({ message: "Error fetching content blocks by section" });
  }
});

// Get content block by identifier
router.get('/content-blocks/identifier/:identifier', async (req: Request, res: Response) => {
  try {
    const identifier = req.params.identifier;
    const contentBlock = await storage.getContentBlockByIdentifier(identifier);
    
    if (!contentBlock) {
      return res.status(404).json({ message: "Content block not found" });
    }
    
    res.json(contentBlock);
  } catch (error) {
    console.error(`Error fetching content block with identifier ${req.params.identifier}:`, error);
    res.status(500).json({ message: "Error fetching content block" });
  }
});

// Get page data
router.get('/pages/:slug', async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug;
    
    // Build predefined page structure based on slug
    let sections: string[] = [];
    let title = '';
    let description = '';
    
    switch (slug) {
      case 'home':
        title = 'Go4It Sports - Home';
        description = 'The premier platform for student athletes';
        sections = ['hero', 'what-makes-us-different', 'featured-athletes', 'testimonials'];
        break;
      case 'about':
        title = 'About Go4It Sports';
        description = 'Learn about our mission and vision';
        sections = ['about-hero', 'our-mission', 'team', 'partners'];
        break;
      case 'features':
        title = 'Go4It Sports Features';
        description = 'Discover what makes Go4It Sports special';
        sections = ['features-hero', 'skill-assessment', 'video-analysis', 'progress-tracking'];
        break;
      default:
        // If no predefined page exists, return 404
        return res.status(404).json({ message: "Page not found" });
    }
    
    // Fetch content for each section
    const sectionsData = await Promise.all(
      sections.map(async (sectionId) => {
        const blocks = await storage.getContentBlocksBySection(sectionId);
        return {
          id: sectionId,
          name: sectionId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
          blocks: blocks.sort((a, b) => {
            // Sort by sortOrder if available, otherwise by id
            if (a.sortOrder !== undefined && b.sortOrder !== undefined) {
              return a.sortOrder - b.sortOrder;
            }
            return a.id - b.id;
          })
        };
      })
    );
    
    // Construct the page data
    const pageData = {
      slug,
      title,
      description,
      layout: {
        id: `${slug}-layout`,
        name: `${title} Layout`,
        sections,
        template: 'default',
        isDefault: true
      },
      sections: sectionsData,
      metadata: {
        seo: {
          title,
          description,
          keywords: ['Go4It Sports', 'student athletes', 'sports technology', 'athletic development']
        }
      }
    };
    
    res.json(pageData);
  } catch (error) {
    console.error(`Error fetching page data for slug ${req.params.slug}:`, error);
    res.status(500).json({ message: "Error fetching page data" });
  }
});

export default router;