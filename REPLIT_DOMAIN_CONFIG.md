# Replit Domain Configuration

## Current Setup

**Main Application Port:** 5000  
**External Port Mapping:** 5000 → 80 (HTTP)

## Custom Domain: `06ddc8fe-bdbb-476c-b3ae-36d82f4f96d4.id.repl.co`

This appears to be your Replit deployment domain identifier.

### To Configure:

1. **In Replit Dashboard:**
   - Go to your Repl settings
   - Navigate to "Domains" tab
   - Your custom domain should be: `06ddc8fe-bdbb-476c-b3ae-36d82f4f96d4.id.repl.co`
   - Ensure it points to port 5000 (external port 80)

2. **Port Mappings:**
   ```
   Internal Port 5000 → External Port 80 (HTTP)
   Internal Port 3001 → External Port 3001 (Backend API)
   ```

3. **Environment Variables Set:**
   ```
   PORT=5000
   HOSTNAME=0.0.0.0
   NODE_ENV=production
   ```

### Testing Your Deployment:

```bash
# Local test (within Replit)
curl http://localhost:5000

# External test (from browser)
https://06ddc8fe-bdbb-476c-b3ae-36d82f4f96d4.id.repl.co
```

## Port Configuration Summary

| Service | Internal Port | External Port | Purpose |
|---------|--------------|---------------|---------|
| **Next.js App** | 5000 | 80 | Main web application |
| Backend API (StarPath) | 3001 | 3001 | REST API endpoints |
| Dev Port Fallback | 3000 | 5000 | Legacy mapping |

## Updated Files

✅ `package.json` - Dev and start scripts now use port 5000  
✅ `.replit` - PORT environment variable set to 5000  
✅ `.replit` - Workflow waitForPort configured for 5000  

## Verification Steps

1. **Start the application:**
   ```bash
   npm run dev
   ```
   
2. **Check it's running on port 5000:**
   ```bash
   lsof -i :5000
   ```

3. **Access via Replit domain:**
   ```
   https://06ddc8fe-bdbb-476c-b3ae-36d82f4f96d4.id.repl.co
   ```

## Troubleshooting

If the domain doesn't work:

1. Verify Replit deployment is active
2. Check Replit console for port binding messages
3. Ensure `.replit` deployment config points to correct run command
4. Confirm external port 80 is mapped to internal port 5000

## Next Steps

- Test deployment on Replit
- Verify domain resolves correctly
- Set up SSL/TLS (Replit handles this automatically for `.repl.co` domains)
- Configure any custom domain if needed (via Replit settings)
