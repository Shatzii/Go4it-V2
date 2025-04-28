import { Express, Request, Response } from "express";
import { storage } from "./storage";
import { invalidateCache } from "./middleware/cache-middleware";

// This module registers the skill tree API endpoints directly
// so they won't be intercepted by Vite during development
export function registerSkillTreeApi(app: Express) {
  // Root Nodes API endpoint - added for direct access to root nodes
  app.get('/api/skill-tree/root-nodes', async (req: Request, res: Response) => {
    try {
      const { sport_type, position } = req.query;
      // Check if the storage method exists
      if (typeof storage.getRootSkillTreeNodes === 'function') {
        const nodes = await storage.getRootSkillTreeNodes(
          sport_type as string | undefined, 
          position as string | undefined
        );
        res.json(nodes);
      } else if (typeof storage.getSkillTreeNodes === 'function') {
        // Fallback to retrieving all nodes and filtering root nodes
        console.log('Using fallback method to get root nodes');
        const allNodes = await storage.getSkillTreeNodes(
          sport_type as string | undefined,
          position as string | undefined
        );
        
        // Get all relationship records
        const relationships = await storage.getSkillTreeRelationships();
        
        // Find all child IDs in relationships to exclude them from root nodes
        const childIds = new Set(relationships.map(rel => rel.child_id));
        
        // Root nodes are those that don't appear as children in any relationship
        const rootNodes = allNodes.filter(node => !childIds.has(node.id));
        
        res.json(rootNodes);
      } else {
        console.warn('Neither getRootSkillTreeNodes nor getSkillTreeNodes method found in storage');
        res.json([]);
      }
    } catch (error) {
      console.error('Error fetching root skill tree nodes:', error);
      res.status(500).json({ error: 'Failed to fetch root skill tree nodes' });
    }
  });

  // Skill Tree API Routes
  app.get('/api/skill-tree/nodes', async (req: Request, res: Response) => {
    try {
      const { sportType, position } = req.query;
      // Check if the storage method exists
      if (typeof storage.getSkillTreeNodes === 'function') {
        const nodes = await storage.getSkillTreeNodes(
          sportType as string | undefined, 
          position as string | undefined
        );
        res.json(nodes);
      } else {
        console.warn('getSkillTreeNodes method not found in storage');
        res.json([]);
      }
    } catch (error) {
      console.error('Error fetching skill tree nodes:', error);
      res.status(500).json({ error: 'Failed to fetch skill tree nodes' });
    }
  });

  app.get('/api/skill-tree/nodes/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (typeof storage.getSkillTreeNode === 'function') {
        const node = await storage.getSkillTreeNode(parseInt(id, 10));
        if (!node) {
          return res.status(404).json({ error: 'Skill tree node not found' });
        }
        res.json(node);
      } else {
        console.warn('getSkillTreeNode method not found in storage');
        res.status(404).json({ error: 'Skill tree node not found' });
      }
    } catch (error) {
      console.error(`Error fetching skill tree node with ID ${req.params.id}:`, error);
      res.status(500).json({ error: 'Failed to fetch skill tree node' });
    }
  });

  app.get('/api/skill-tree/nodes/level/:level', async (req: Request, res: Response) => {
    try {
      const { level } = req.params;
      const nodes = await storage.getSkillTreeNodesByLevel(parseInt(level, 10));
      res.json(nodes);
    } catch (error) {
      console.error(`Error fetching skill tree nodes for level ${req.params.level}:`, error);
      res.status(500).json({ error: 'Failed to fetch skill tree nodes for this level' });
    }
  });

  app.post('/api/skill-tree/nodes', async (req: Request, res: Response) => {
    try {
      const node = await storage.createSkillTreeNode(req.body);
      
      // Invalidate caches related to skill tree nodes
      invalidateCache('/api/skill-tree/nodes');
      invalidateCache('/api/skill-tree/root-nodes');
      
      // Invalidate level-specific cache if level is present
      if (node.level) {
        invalidateCache(`/api/skill-tree/nodes/level/${node.level}`);
      }
      
      res.status(201).json(node);
    } catch (error) {
      console.error('Error creating skill tree node:', error);
      res.status(500).json({ error: 'Failed to create skill tree node' });
    }
  });

  app.put('/api/skill-tree/nodes/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updatedNode = await storage.updateSkillTreeNode(parseInt(id, 10), req.body);
      if (!updatedNode) {
        return res.status(404).json({ error: 'Skill tree node not found' });
      }
      
      // Invalidate caches related to skill tree nodes
      invalidateCache('/api/skill-tree/nodes');
      invalidateCache(`/api/skill-tree/nodes/${id}`);
      invalidateCache('/api/skill-tree/root-nodes');
      
      // Invalidate level-specific cache if level is present
      if (updatedNode.level) {
        invalidateCache(`/api/skill-tree/nodes/level/${updatedNode.level}`);
      }
      
      // Invalidate children and parent relationships
      invalidateCache(`/api/skill-tree/nodes/${id}/children`);
      invalidateCache(`/api/skill-tree/nodes/${id}/parents`);
      invalidateCache(`/api/skill-tree/nodes/${id}/drills`);
      
      res.json(updatedNode);
    } catch (error) {
      console.error(`Error updating skill tree node with ID ${req.params.id}:`, error);
      res.status(500).json({ error: 'Failed to update skill tree node' });
    }
  });

  app.get('/api/skill-tree/relationships', async (req: Request, res: Response) => {
    try {
      const relationships = await storage.getSkillTreeRelationships();
      res.json(relationships);
    } catch (error) {
      console.error('Error fetching skill tree relationships:', error);
      res.status(500).json({ error: 'Failed to fetch skill tree relationships' });
    }
  });

  app.get('/api/skill-tree/nodes/:id/children', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const children = await storage.getChildSkillNodes(parseInt(id, 10));
      res.json(children);
    } catch (error) {
      console.error(`Error fetching child nodes for parent ID ${req.params.id}:`, error);
      res.status(500).json({ error: 'Failed to fetch child nodes' });
    }
  });

  app.get('/api/skill-tree/nodes/:id/parents', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const parents = await storage.getParentSkillNodes(parseInt(id, 10));
      res.json(parents);
    } catch (error) {
      console.error(`Error fetching parent nodes for child ID ${req.params.id}:`, error);
      res.status(500).json({ error: 'Failed to fetch parent nodes' });
    }
  });

  app.post('/api/skill-tree/relationships', async (req: Request, res: Response) => {
    try {
      const relationship = await storage.createSkillTreeRelationship(req.body);
      
      // Invalidate caches related to skill tree relationships
      invalidateCache('/api/skill-tree/relationships');
      invalidateCache('/api/skill-tree/root-nodes');
      
      // Invalidate parent and child node relationship caches
      if (relationship.parent_id) {
        invalidateCache(`/api/skill-tree/nodes/${relationship.parent_id}/children`);
      }
      
      if (relationship.child_id) {
        invalidateCache(`/api/skill-tree/nodes/${relationship.child_id}/parents`);
      }
      
      res.status(201).json(relationship);
    } catch (error) {
      console.error('Error creating skill tree relationship:', error);
      res.status(500).json({ error: 'Failed to create skill tree relationship' });
    }
  });

  // Training Drills API Routes
  app.get('/api/training-drills', async (req: Request, res: Response) => {
    try {
      const { sportType, position, category } = req.query;
      const drills = await storage.getTrainingDrills(
        sportType as string | undefined,
        position as string | undefined,
        category as string | undefined
      );
      res.json(drills);
    } catch (error) {
      console.error('Error fetching training drills:', error);
      res.status(500).json({ error: 'Failed to fetch training drills' });
    }
  });

  app.get('/api/training-drills/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const drill = await storage.getTrainingDrill(parseInt(id, 10));
      if (!drill) {
        return res.status(404).json({ error: 'Training drill not found' });
      }
      res.json(drill);
    } catch (error) {
      console.error(`Error fetching training drill with ID ${req.params.id}:`, error);
      res.status(500).json({ error: 'Failed to fetch training drill' });
    }
  });

  app.get('/api/skill-tree/nodes/:id/drills', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const drills = await storage.getTrainingDrillsBySkill(parseInt(id, 10));
      res.json(drills);
    } catch (error) {
      console.error(`Error fetching training drills for skill node ID ${req.params.id}:`, error);
      res.status(500).json({ error: 'Failed to fetch training drills for this skill' });
    }
  });

  app.post('/api/training-drills', async (req: Request, res: Response) => {
    try {
      const drill = await storage.createTrainingDrill(req.body);
      
      // Invalidate caches related to training drills
      invalidateCache('/api/training-drills');
      
      // Invalidate sport/position/category specific caches if present
      if (drill.sport) {
        invalidateCache(`/api/training-drills?sportType=${drill.sport}`);
      }
      
      if (drill.position) {
        invalidateCache(`/api/training-drills?position=${drill.position}`);
      }
      
      if (drill.category) {
        invalidateCache(`/api/training-drills?category=${drill.category}`);
      }
      
      // If the drill is associated with a skill node, invalidate that relationship
      if (drill.skillNodeId) {
        invalidateCache(`/api/skill-tree/nodes/${drill.skillNodeId}/drills`);
      }
      
      res.status(201).json(drill);
    } catch (error) {
      console.error('Error creating training drill:', error);
      res.status(500).json({ error: 'Failed to create training drill' });
    }
  });

  app.put('/api/training-drills/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updatedDrill = await storage.updateTrainingDrill(parseInt(id, 10), req.body);
      if (!updatedDrill) {
        return res.status(404).json({ error: 'Training drill not found' });
      }
      
      // Invalidate caches related to training drills
      invalidateCache('/api/training-drills');
      invalidateCache(`/api/training-drills/${id}`);
      
      // Invalidate sport/position/category specific caches if present
      if (updatedDrill.sport) {
        invalidateCache(`/api/training-drills?sportType=${updatedDrill.sport}`);
      }
      
      if (updatedDrill.position) {
        invalidateCache(`/api/training-drills?position=${updatedDrill.position}`);
      }
      
      if (updatedDrill.category) {
        invalidateCache(`/api/training-drills?category=${updatedDrill.category}`);
      }
      
      // If the drill is associated with a skill node, invalidate that relationship
      if (updatedDrill.skillNodeId) {
        invalidateCache(`/api/skill-tree/nodes/${updatedDrill.skillNodeId}/drills`);
      }
      
      res.json(updatedDrill);
    } catch (error) {
      console.error(`Error updating training drill with ID ${req.params.id}:`, error);
      res.status(500).json({ error: 'Failed to update training drill' });
    }
  });

  // User Skill Progress API Routes
  app.get('/api/users/:userId/skills', async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const skills = await storage.getUserSkills(parseInt(userId, 10));
      res.json(skills);
    } catch (error) {
      console.error(`Error fetching skills for user ID ${req.params.userId}:`, error);
      res.status(500).json({ error: 'Failed to fetch user skills' });
    }
  });

  app.get('/api/skills/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const skill = await storage.getSkill(parseInt(id, 10));
      if (!skill) {
        return res.status(404).json({ error: 'Skill not found' });
      }
      res.json(skill);
    } catch (error) {
      console.error(`Error fetching skill with ID ${req.params.id}:`, error);
      res.status(500).json({ error: 'Failed to fetch skill' });
    }
  });

  app.post('/api/users/:userId/skills', async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const skill = await storage.createSkill({
        ...req.body,
        userId: parseInt(userId, 10)
      });
      
      // Invalidate user skills cache
      invalidateCache(`/api/users/${userId}/skills`);
      
      // Invalidate relevant StarPath system caches if any node ID present
      if (skill.skillNodeId) {
        invalidateCache(`/api/users/${userId}/starpath`);
        invalidateCache(`/api/users/${userId}/progression`);
        invalidateCache(`/api/skill-tree/nodes/${skill.skillNodeId}/users`);
      }
      
      res.status(201).json(skill);
    } catch (error) {
      console.error(`Error creating skill for user ID ${req.params.userId}:`, error);
      res.status(500).json({ error: 'Failed to create skill' });
    }
  });

  app.put('/api/skills/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updatedSkill = await storage.updateSkill(parseInt(id, 10), req.body);
      if (!updatedSkill) {
        return res.status(404).json({ error: 'Skill not found' });
      }
      
      // Invalidate specific skill cache
      invalidateCache(`/api/skills/${id}`);
      
      // Invalidate user skills cache
      if (updatedSkill.userId) {
        invalidateCache(`/api/users/${updatedSkill.userId}/skills`);
        
        // Invalidate relevant StarPath system caches
        invalidateCache(`/api/users/${updatedSkill.userId}/starpath`);
        invalidateCache(`/api/users/${updatedSkill.userId}/progression`);
      }
      
      // Invalidate relevant node users cache if skill node ID present
      if (updatedSkill.skillNodeId) {
        invalidateCache(`/api/skill-tree/nodes/${updatedSkill.skillNodeId}/users`);
      }
      
      res.json(updatedSkill);
    } catch (error) {
      console.error(`Error updating skill with ID ${req.params.id}:`, error);
      res.status(500).json({ error: 'Failed to update skill' });
    }
  });

  // User Drill Progress API Routes
  app.get('/api/users/:userId/drill-progress', async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const progress = await storage.getUserDrillProgress(parseInt(userId, 10));
      res.json(progress);
    } catch (error) {
      console.error(`Error fetching drill progress for user ID ${req.params.userId}:`, error);
      res.status(500).json({ error: 'Failed to fetch user drill progress' });
    }
  });

  app.get('/api/users/:userId/drills/:drillId/progress', async (req: Request, res: Response) => {
    try {
      const { userId, drillId } = req.params;
      const progress = await storage.getUserDrillProgressByDrill(
        parseInt(userId, 10),
        parseInt(drillId, 10)
      );
      if (!progress) {
        return res.status(404).json({ error: 'Drill progress not found' });
      }
      res.json(progress);
    } catch (error) {
      console.error(`Error fetching drill progress for user ID ${req.params.userId} and drill ID ${req.params.drillId}:`, error);
      res.status(500).json({ error: 'Failed to fetch drill progress' });
    }
  });

  app.post('/api/users/:userId/drill-progress', async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const progress = await storage.createUserDrillProgress({
        ...req.body,
        userId: parseInt(userId, 10)
      });
      res.status(201).json(progress);
    } catch (error) {
      console.error(`Error creating drill progress for user ID ${req.params.userId}:`, error);
      res.status(500).json({ error: 'Failed to create drill progress' });
    }
  });

  app.put('/api/drill-progress/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updatedProgress = await storage.updateUserDrillProgress(parseInt(id, 10), req.body);
      if (!updatedProgress) {
        return res.status(404).json({ error: 'Drill progress not found' });
      }
      res.json(updatedProgress);
    } catch (error) {
      console.error(`Error updating drill progress with ID ${req.params.id}:`, error);
      res.status(500).json({ error: 'Failed to update drill progress' });
    }
  });
}