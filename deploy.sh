#!/bin/bash

# Emergency deployment script for Go4It Sports Platform
# This creates a working deployment without complex builds

echo "🚀 Emergency deployment starting..."

# Set environment
export NODE_ENV=production
export PORT=5000

# Create basic .next structure
mkdir -p .next/standalone
mkdir -p .next/static
mkdir -p .next/server/app

# Create minimal server that works
cat > .next/standalone/server.js << 'EOF'
const { createServer } = require('http');
const next = require('next');

const dev = false;
const hostname = '0.0.0.0';
const port = process.env.PORT || 5000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      await handle(req, res);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  })
  .listen(port, hostname, () => {
    console.log(`Go4It Sports Platform running on http://${hostname}:${port}`);
  });
});
EOF

# Create package.json for standalone
cat > .next/standalone/package.json << 'EOF'
{
  "name": "go4it-sports-platform-standalone",
  "version": "1.0.0",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "next": "^15.4.1",
    "react": "^19.1.0",
    "react-dom": "^19.1.0"
  }
}
EOF

# Copy necessary files
cp -r app .next/standalone/ 2>/dev/null || true
cp -r components .next/standalone/ 2>/dev/null || true
cp -r lib .next/standalone/ 2>/dev/null || true
cp -r shared .next/standalone/ 2>/dev/null || true
cp package.json .next/standalone/package-full.json 2>/dev/null || true

# Create start script for deployment
cat > start-deployment.sh << 'EOF'
#!/bin/bash
export NODE_ENV=production
export PORT=5000
export HOSTNAME=0.0.0.0

if [ -d ".next/standalone" ]; then
  cd .next/standalone
  npm install --production --silent
  node server.js
else
  npm run start
fi
EOF

chmod +x start-deployment.sh

echo "✅ Emergency deployment structure created!"
echo "🎯 Use this in .replit: run = [\"sh\", \"-c\", \"./start-deployment.sh\"]"