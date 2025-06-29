import express from 'express';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { promises as fsPromises } from 'fs';

// Setup directories
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOGS_DIR = path.resolve(__dirname, '../logs');

// Ensure logs directory exists
if (!fs.existsSync(LOGS_DIR)) {
  fs.mkdirSync(LOGS_DIR, { recursive: true });
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Create router
const router = express.Router();

// Log function for AI interactions
async function logAIInteraction(action: string, details: any) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    action,
    details,
  };
  
  const logFile = path.join(LOGS_DIR, 'ai-interactions.log');
  await fsPromises.appendFile(
    logFile, 
    JSON.stringify(logEntry) + '\n',
    { encoding: 'utf8' }
  );
  
  return logEntry;
}

// Agent message endpoint
router.post('/agent-message', async (req, res) => {
  try {
    const { message, context, fileContext } = req.body;
    
    if (!message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Message is required' 
      });
    }

    // Prepare system prompt
    let systemPrompt = "You are a helpful AI assistant specializing in web development and code updates for Go4it Sports. ";
    
    if (fileContext) {
      systemPrompt += "You're working with the following file context: " + fileContext;
    }
    
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        ...(context ? context.map(msg => ({ role: msg.role, content: msg.content })) : []),
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 2048,
    });
    
    const reply = response.choices[0].message.content;
    
    // Log the interaction
    await logAIInteraction('agent_message', {
      userMessage: message,
      aiReply: reply,
      modelUsed: response.model,
      tokensUsed: response.usage
    });
    
    return res.status(200).json({
      success: true,
      reply,
      model: response.model,
      usage: response.usage,
    });
    
  } catch (error) {
    console.error('Error processing agent message:', error);
    
    await logAIInteraction('agent_message_error', {
      error: error.message,
      request: req.body
    });
    
    return res.status(500).json({
      success: false,
      message: 'Error processing your request',
      error: error.message,
    });
  }
});

// Get AI interaction logs endpoint
router.get('/agent-logs', async (req, res) => {
  try {
    const logFile = path.join(LOGS_DIR, 'ai-interactions.log');
    
    // Check if log file exists
    if (!fs.existsSync(logFile)) {
      return res.status(200).json({ logs: [] });
    }
    
    // Read and parse logs
    const logContent = await fsPromises.readFile(logFile, 'utf8');
    const logs = logContent
      .split('\n')
      .filter(line => line.trim())
      .map(line => JSON.parse(line))
      .slice(-50); // Get most recent 50 entries
    
    return res.status(200).json({ logs });
  } catch (error) {
    console.error('Error retrieving AI logs:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error retrieving AI interaction logs',
      error: error.message
    });
  }
});

// Check OpenAI connection status
router.get('/ai-status', async (req, res) => {
  try {
    // Simple model list call to check API connection
    await openai.models.list();
    
    return res.status(200).json({
      success: true,
      connected: true,
      apiKey: process.env.OPENAI_API_KEY ? 'Configured' : 'Missing',
      message: 'OpenAI API connection successful'
    });
  } catch (error) {
    console.error('OpenAI API connection error:', error);
    
    return res.status(200).json({
      success: false,
      connected: false,
      apiKey: process.env.OPENAI_API_KEY ? 'Invalid' : 'Missing',
      message: 'OpenAI API connection failed',
      error: error.message
    });
  }
});

export default router;