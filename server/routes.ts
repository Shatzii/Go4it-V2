import type { Express } from 'express';
import { createServer, type Server } from 'http';
import { setupDevAuth, basicAuth } from './auth';

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup development authentication
  setupDevAuth(app);

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Protected route example
  app.get('/api/protected', basicAuth, async (req: any, res) => {
    res.json({ message: 'Access granted', user: 'demo' });
  });

  // GAR analysis endpoints
  app.get('/api/gar/recent', (req, res) => {
    res.json({
      analyses: [
        {
          id: 'gar-001',
          sport: 'football',
          garScore: 78,
          date: '2024-01-15',
          strengths: ['Speed', 'Agility', 'Decision Making'],
          improvements: ['Accuracy', 'Arm Strength'],
        },
      ],
    });
  });

  // StarPath progress endpoints
  app.get('/api/starpath/progress', (req, res) => {
    res.json({
      level: 12,
      xp: 2840,
      nextLevelXp: 3000,
      unlockedSkills: ['Speed Training', 'Agility Drills', 'Mental Training'],
      availableSkills: ['Advanced Conditioning', 'Leadership Skills'],
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
