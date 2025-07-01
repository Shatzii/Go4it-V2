import { Router, Request, Response } from 'express';
import { pharaohAI } from '../services/pharaoh-ai-integration';

const router = Router();

/**
 * Get Pharaoh AI Engine status and capabilities
 */
router.get('/pharaoh/status', async (req: Request, res: Response) => {
  try {
    const status = await pharaohAI.getAIEngineStatus();
    res.json(status);
  } catch (error) {
    console.error('Error getting Pharaoh AI status:', error);
    res.status(500).json({ 
      error: 'Failed to get AI engine status',
      pharaoh_available: false,
      fallback_active: true 
    });
  }
});

/**
 * Generate advanced curriculum using Pharaoh AI
 */
router.post('/pharaoh/curriculum/generate', async (req: Request, res: Response) => {
  try {
    const { stateCode, gradeLevel, subject, neurodivergentProfiles, englishSportsIntegration } = req.body;

    if (englishSportsIntegration) {
      const result = await pharaohAI.generateEnglishSportsCurriculum({
        stateCode,
        gradeLevel,
        neurodivergentProfiles: neurodivergentProfiles || [],
        practicumHours: 300 // Default practicum hours
      });
      
      res.json({
        success: result.success,
        curriculum: result.result,
        metadata: result.metadata,
        type: 'english_sports_dual_certification'
      });
    } else {
      const result = await pharaohAI.processRequest({
        action: 'generate_curriculum',
        content: `${subject} curriculum for grade ${gradeLevel}`,
        metadata: {
          stateCode,
          gradeLevel,
          subject,
          neurodivergentProfiles
        }
      });

      res.json({
        success: result.success,
        curriculum: result.result,
        metadata: result.metadata,
        type: 'standard_curriculum'
      });
    }
  } catch (error) {
    console.error('Error generating curriculum with Pharaoh AI:', error);
    res.status(500).json({ error: 'Failed to generate curriculum' });
  }
});

/**
 * Fix Rhythm template code using Pharaoh AI
 */
router.post('/pharaoh/rhythm/fix', async (req: Request, res: Response) => {
  try {
    const { code, error_description } = req.body;

    const result = await pharaohAI.processRequest({
      action: 'fix_code',
      content: code,
      language: 'rhythm',
      metadata: { error_description }
    });

    res.json({
      success: result.success,
      fixed_code: result.result,
      metadata: result.metadata
    });
  } catch (error) {
    console.error('Error fixing Rhythm code:', error);
    res.status(500).json({ error: 'Failed to fix code' });
  }
});

/**
 * Refactor Rhythm template using Pharaoh AI
 */
router.post('/pharaoh/rhythm/refactor', async (req: Request, res: Response) => {
  try {
    const { code, optimization_goals } = req.body;

    const result = await pharaohAI.processRequest({
      action: 'refactor',
      content: code,
      language: 'rhythm',
      metadata: { optimization_goals }
    });

    res.json({
      success: result.success,
      refactored_code: result.result,
      metadata: result.metadata
    });
  } catch (error) {
    console.error('Error refactoring Rhythm code:', error);
    res.status(500).json({ error: 'Failed to refactor code' });
  }
});

/**
 * Process voice commands using Pharaoh AI
 */
router.post('/pharaoh/voice/command', async (req: Request, res: Response) => {
  try {
    const { audio_data, context } = req.body;

    const result = await pharaohAI.processRequest({
      action: 'voice_command',
      content: audio_data,
      metadata: { context }
    });

    res.json({
      success: result.success,
      command: result.result,
      metadata: result.metadata
    });
  } catch (error) {
    console.error('Error processing voice command:', error);
    res.status(500).json({ error: 'Failed to process voice command' });
  }
});

/**
 * Scan and analyze project using Pharaoh AI
 */
router.post('/pharaoh/project/scan', async (req: Request, res: Response) => {
  try {
    const { project_path, scan_type } = req.body;

    const result = await pharaohAI.processRequest({
      action: 'scan_project',
      content: project_path,
      metadata: { scan_type }
    });

    res.json({
      success: result.success,
      analysis: result.result,
      metadata: result.metadata
    });
  } catch (error) {
    console.error('Error scanning project:', error);
    res.status(500).json({ error: 'Failed to scan project' });
  }
});

export default router;