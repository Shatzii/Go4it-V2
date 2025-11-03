/**
 * Landing Page Server with Chat API
 * Serves static files and handles chat API requests
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;

// Load environment variables if .env.local exists
try {
  require('dotenv').config({ path: '.env.local' });
} catch (e) {
  // dotenv not installed, skip
}

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Simple chat API handler (without full Express)
async function handleChatAPI(req, res) {
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'Method not allowed' }));
  }

  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', async () => {
    try {
      const { message } = JSON.parse(body);

      if (!message) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Message is required' }));
      }

      // Check if Anthropic is available
      const hasAnthropicKey = !!process.env.ANTHROPIC_API_KEY;
      
      if (!hasAnthropicKey) {
        // Fallback response if no API key
        const fallbackResponses = {
          'what is gar': 'GAR (Go4it Athletic Rating) is our comprehensive athlete verification system that measures physical, cognitive, and mental abilities on a 0-100 scale. Want to learn more? Contact us at info@go4itsports.org or call to schedule your test! 🏀',
          'apply': 'Great! To apply to Go4it Sports Academy, visit our application page or click "Apply Now" above. We\'ll guide you through the process including the 48-hour credit audit. Questions? Reach out to admissions@go4itsports.org 📝',
          'ncaa': 'Our NCAA Pathway program helps athletes navigate eligibility requirements including Eligibility Center registration, transcript evaluation, GPA conversion, and amateur status protection. Want to start with a 48-hour credit audit? Click "Book Audit" above! 🎓',
          'programs': 'We offer: Online + Hybrid Academy, NCAA Pathway Support, GAR Testing, AthleteAI coaching OS, Friday Night Lights showcases, and International residencies in Vienna & Mérida. Which interests you most? 🌟'
        };

        // Simple keyword matching for fallback
        const lowerMessage = message.toLowerCase();
        let response = 'Thanks for your question! Our team is here to help. For detailed information, please contact us at info@go4itsports.org or call our admissions office. We\'d love to discuss how Go4it can support your athletic and academic journey! 🚀';

        for (const [keyword, answer] of Object.entries(fallbackResponses)) {
          if (lowerMessage.includes(keyword)) {
            response = answer;
            break;
          }
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ 
          success: true,
          response: response,
          mode: 'fallback'
        }));
      }

      // If Anthropic key exists, use the API
      const Anthropic = require('@anthropic-ai/sdk');
      const anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });

      const systemPrompt = `You are the Go4it Sports Academy AI Assistant. You are knowledgeable, enthusiastic, and helpful.

Your primary responsibilities:
1. Answer questions about Go4it Sports Academy programs and services
2. Explain GAR (Go4it Athletic Rating) testing and what it measures
3. Provide information about NCAA pathway support and eligibility
4. Describe the academy's online and hybrid school options
5. Help prospective students and parents understand the application process
6. Explain AthleteAI and other technology offerings
7. Share information about Friday Night Lights showcases and international hubs

Key Information:
- GAR Testing: Comprehensive athlete verification measuring physical, cognitive, and mental abilities (0-100 scale)
- Programs: Online Academy, Hybrid Training, NCAA Pathway, GAR Testing, AthleteAI, Friday Night Lights (FNL)
- Locations: Denver (HQ), Vienna, Dallas, Mérida (Mexico)
- Sports: Basketball, Football, Soccer, Volleyball, Baseball, and more
- Focus: NCAA compliance, academic excellence, verified athletic performance

Communication Style:
- Friendly and approachable but professional
- Use emojis occasionally to show enthusiasm (🏀⚽🏈🎓)
- Keep responses concise (2-4 sentences unless detailed explanation is needed)
- Always encourage next steps: "Schedule a call", "Apply now", "Book a GAR test"
- For complex questions, offer to connect them with a human advisor

If you don't know something specific, acknowledge it and offer to have someone from the team reach out.`;

      const apiResponse = await anthropic.messages.create({
        model: "claude-3-7-sonnet-20250219",
        max_tokens: 500,
        system: systemPrompt,
        messages: [{
          role: 'user',
          content: message
        }]
      });

      const assistantMessage = apiResponse.content[0].text;

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        response: assistantMessage,
        messageId: apiResponse.id
      }));

    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        error: 'Sorry, I\'m having trouble right now. Please try again or contact us directly at info@go4itsports.org'
      }));
    }
  });
}

// Main server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Handle chat API
  if (pathname === '/api/chat') {
    return handleChatAPI(req, res);
  }

  // Handle static files
  let filePath = '.' + pathname;
  if (filePath === './') {
    filePath = './landing-page.html';
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>', 'utf-8');
      } else {
        res.writeHead(500);
        res.end('Server Error: ' + error.code, 'utf-8');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  const hasApiKey = !!process.env.ANTHROPIC_API_KEY;
  
  // eslint-disable-next-line no-console
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║  🏀 Go4it Sports Academy Landing Page Server 🏈           ║
║                                                            ║
║  Server: http://localhost:${PORT}/                           ║
║  Landing Page: http://localhost:${PORT}/landing-page.html    ║
║                                                            ║
║  Chat Widget: ${hasApiKey ? '✅ Connected to Claude AI' : '⚠️  Using fallback responses'}  ║
║  ${hasApiKey ? '' : 'Set ANTHROPIC_API_KEY for full AI features           '}║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
});
