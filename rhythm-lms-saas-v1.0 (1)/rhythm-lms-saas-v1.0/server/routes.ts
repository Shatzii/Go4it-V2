import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import * as fs from "fs/promises";
import * as path from "path";
import { fileService } from "./services/file-service";
import { aiService } from "./services/ai-service";
import { rhythmParser } from "./services/rhythm-parser";
import academicRoutes from "./routes/academic-routes";
import curriculumRoutes from "./routes/curriculum-routes";
import aiAcademicRoutes from "./routes/ai-academic-routes";

// Store active WebSocket connections
const connectedClients = new Set<WebSocket>();
const terminalClients = new Set<WebSocket>();
const editorClients = new Map<string, Set<WebSocket>>();  // Map of filePath -> Set of clients

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Register academic API routes
  app.use('/api/academic', academicRoutes);
  
  // Register curriculum and compliance routes
  app.use('/api/curriculum', curriculumRoutes);
  
  // Register AI academic engine routes
  app.use('/api/ai', aiAcademicRoutes);

  // Set up WebSocket server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  // WebSocket connection handler
  wss.on('connection', (ws, req) => {
    const path = req.url || '/ws';
    const url = new URL(`http://localhost${path}`);
    const filePath = url.searchParams.get('file');
    
    // Generate a unique user ID for this connection
    const userId = Math.random().toString(36).substring(2, 10);
    
    // Add client to the appropriate set based on path
    if (path.includes('/ws/terminal')) {
      terminalClients.add(ws);
    } else if (path.includes('/ws/editor') && filePath) {
      // Add to editor clients for this file
      if (!editorClients.has(filePath)) {
        editorClients.set(filePath, new Set());
      }
      editorClients.get(filePath)?.add(ws);
      
      // Send current file state to the new client
      fileService.getFileContent(filePath)
        .then(content => {
          ws.send(JSON.stringify({
            type: 'initial_content',
            content: content.content,
            path: filePath,
            lastModified: content.lastModified
          }));
        })
        .catch(error => {
          console.error(`Error loading file content for ${filePath}:`, error);
        });
      
      // Broadcast join notification to other clients
      broadcastToEditorClients(filePath, {
        type: 'user_joined',
        path: filePath,
        timestamp: new Date().toISOString(),
        userId: userId
      }, ws);
    } else {
      connectedClients.add(ws);
    }
    
    // Handle incoming messages
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        // Broadcast to appropriate clients based on path
        if (path.includes('/ws/terminal')) {
          broadcastToTerminal(data);
        } else if (path.includes('/ws/editor') && filePath) {
          // Add metadata
          data.timestamp = new Date().toISOString();
          data.userId = userId;
          data.path = filePath;
          
          // Process editor-specific message types
          if (data.type === 'content_change') {
            // Store content changes to file
            fileService.saveFile(filePath, data.content)
              .catch(error => console.error(`Error saving changes to ${filePath}:`, error));
          }
          
          // Broadcast to all clients editing the same file
          broadcastToEditorClients(filePath, data, ws);
        } else {
          broadcast(data);
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    });
    
    // Handle disconnection
    ws.on('close', () => {
      if (path.includes('/ws/terminal')) {
        terminalClients.delete(ws);
      } else if (path.includes('/ws/editor') && filePath) {
        // Remove from editor clients
        const fileClients = editorClients.get(filePath);
        if (fileClients) {
          fileClients.delete(ws);
          if (fileClients.size === 0) {
            editorClients.delete(filePath);
          }
          
          // Broadcast leave notification
          broadcastToEditorClients(filePath, {
            type: 'user_left',
            path: filePath,
            userId: userId,
            timestamp: new Date().toISOString()
          }, null);
        }
      } else {
        connectedClients.delete(ws);
      }
    });
    
    // Send welcome message
    ws.send(JSON.stringify({
      type: 'connection',
      message: 'Connected to Rhythm Engine WebSocket Server',
      timestamp: new Date().toISOString(),
      userId: userId
    }));
  });
  
  // Broadcast message to all connected clients
  function broadcast(message: any) {
    const messageStr = typeof message === 'string' ? message : JSON.stringify(message);
    connectedClients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(messageStr);
      }
    });
  }
  
  // Broadcast message to terminal clients
  function broadcastToTerminal(message: any) {
    const messageStr = typeof message === 'string' ? message : JSON.stringify(message);
    terminalClients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(messageStr);
      }
    });
  }
  
  // Broadcast message to clients editing a specific file
  // Exclude the originating client if specified
  function broadcastToEditorClients(filePath: string, message: any, excludeClient: WebSocket | null = null) {
    const messageStr = typeof message === 'string' ? message : JSON.stringify(message);
    const clients = editorClients.get(filePath);
    
    if (clients) {
      clients.forEach(client => {
        if (client !== excludeClient && client.readyState === WebSocket.OPEN) {
          client.send(messageStr);
        }
      });
    }
  }
  
  // API Routes
  
  // Files API
  app.get('/api/files/tree', async (req, res) => {
    try {
      const tree = await fileService.getFileTree();
      res.json(tree);
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : 'Failed to get file tree' 
      });
    }
  });
  
  app.get('/api/files/content', async (req, res) => {
    try {
      const filePath = req.query.path as string;
      if (!filePath) {
        return res.status(400).json({ message: 'Path is required' });
      }
      
      const content = await fileService.getFileContent(filePath);
      res.json(content);
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : 'Failed to get file content' 
      });
    }
  });
  
  app.post('/api/files/save', async (req, res) => {
    try {
      const { path: filePath, content } = req.body;
      if (!filePath || content === undefined) {
        return res.status(400).json({ message: 'Path and content are required' });
      }
      
      await fileService.saveFile(filePath, content);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : 'Failed to save file' 
      });
    }
  });
  
  app.post('/api/files/create', async (req, res) => {
    try {
      const { path: filePath, type } = req.body;
      if (!filePath) {
        return res.status(400).json({ message: 'Path is required' });
      }
      
      await fileService.createFile(filePath, type || 'file');
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : 'Failed to create file' 
      });
    }
  });
  
  app.delete('/api/files/delete', async (req, res) => {
    try {
      const filePath = req.query.path as string;
      if (!filePath) {
        return res.status(400).json({ message: 'Path is required' });
      }
      
      await fileService.deleteFile(filePath);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : 'Failed to delete file' 
      });
    }
  });
  
  app.post('/api/files/rename', async (req, res) => {
    try {
      const { oldPath, newPath } = req.body;
      if (!oldPath || !newPath) {
        return res.status(400).json({ message: 'Old path and new path are required' });
      }
      
      await fileService.renameFile(oldPath, newPath);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : 'Failed to rename file' 
      });
    }
  });
  
  app.get('/api/files/activity', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 5;
      const activity = await storage.getRecentActivity(limit);
      res.json(activity);
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : 'Failed to get recent activity' 
      });
    }
  });
  
  // AI API
  app.post('/api/ai/generate', async (req, res) => {
    try {
      const { prompt, model, context, temperature, maxTokens } = req.body;
      if (!prompt) {
        return res.status(400).json({ message: 'Prompt is required' });
      }
      
      const result = await aiService.generateCode({
        prompt,
        model: model || 'rhythm-core-v0.1.0',
        context,
        temperature,
        maxTokens
      });
      
      res.json(result);
      
      // Log activity if successful
      if (result.success) {
        await storage.logActivity({
          path: 'ai-generated',
          prompt,
          time: new Date(),
        });
      }
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: error instanceof Error ? error.message : 'Failed to generate code' 
      });
    }
  });
  
  app.get('/api/ai/status', async (req, res) => {
    try {
      const status = await aiService.getStatus();
      res.json(status);
    } catch (error) {
      res.status(500).json({ 
        isReady: false,
        model: 'unknown',
        memoryUsage: { used: 0, total: 0 },
        message: error instanceof Error ? error.message : 'Failed to get AI status' 
      });
    }
  });
  
  // Rhythm language parser API
  app.post('/api/rhythm/parse', async (req, res) => {
    try {
      const { code } = req.body;
      if (!code) {
        return res.status(400).json({ message: 'Code is required' });
      }
      
      const result = await rhythmParser.parse(code);
      res.json(result);
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: error instanceof Error ? error.message : 'Failed to parse Rhythm code' 
      });
    }
  });
  
  app.post('/api/rhythm/compile', async (req, res) => {
    try {
      const { code, outputType } = req.body;
      if (!code) {
        return res.status(400).json({ message: 'Code is required' });
      }
      
      const result = await rhythmParser.compile(code, outputType || 'html');
      res.json(result);
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: error instanceof Error ? error.message : 'Failed to compile Rhythm code' 
      });
    }
  });
  
  // Run API
  app.post('/api/run', async (req, res) => {
    try {
      // Send a message to the terminal
      broadcastToTerminal({
        type: 'log',
        message: 'Executing Rhythm application...',
        level: 'info',
        timestamp: new Date().toISOString()
      });
      
      // Simulate running the application
      setTimeout(() => {
        broadcastToTerminal({
          type: 'log',
          message: 'Application running on port 4242',
          level: 'success',
          timestamp: new Date().toISOString()
        });
      }, 1000);
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: error instanceof Error ? error.message : 'Failed to run application' 
      });
    }
  });

  return httpServer;
}
