# Go4It Sports Platform Installation Guide

This document provides instructions for installing and configuring the Go4It Sports platform components.

## Frontend Installation

The frontend is a React application built with Vite and bundled for production.

### Prerequisites
- Node.js (v16 or higher)
- Web server (Nginx, Apache, or similar)

### Installation Steps

1. Extract the frontend package:
   ```bash
   unzip go4it-frontend.zip -d /path/to/your/webserver/public
   ```

2. Configure your web server to serve the static files and handle client-side routing.

   Example Nginx configuration:
   ```nginx
   server {
     listen 80;
     server_name yourdomain.com;
     root /path/to/your/webserver/public;
     
     location / {
       try_files $uri $uri/ /index.html;
     }
   }
   ```

3. If you're using HTTPS (recommended), set up SSL certificates and update your server configuration accordingly.

## Server Components Installation

These components add functionality for admin file uploads, AI integration, and system status monitoring.

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database (already configured)
- Backend server running Express.js

### Installation Steps

1. Extract the server components:
   ```bash
   unzip go4it-server-components.zip -d /path/to/your/backend/server
   ```

2. Make sure the following environment variables are set in your server environment:
   - `DATABASE_URL`: Connection string for PostgreSQL
   - `OPENAI_API_KEY`: API key for OpenAI integration
   - `ANTHROPIC_API_KEY`: API key for Claude AI integration (optional)
   - `AUTH_SECRET`: Secret key for authentication

3. Import the components in your main server file (typically `index.ts` or `routes.ts`):
   ```typescript
   import { setupUploaderRoutes } from './uploader';
   import { setupAgentMessageRoutes } from './agent-message';
   import { setupStatusRoutes } from './status';
   
   // Then in your Express app setup:
   setupUploaderRoutes(app);
   setupAgentMessageRoutes(app);
   setupStatusRoutes(app);
   ```

4. Restart your backend server to apply the changes.

## Configuration

### OpenAI Integration

To enable AI features, you'll need to provide an OpenAI API key. Set the `OPENAI_API_KEY` environment variable with your API key.

You can obtain a key from [OpenAI's platform](https://platform.openai.com/).

### File Upload Limitations

By default, the uploader is configured to accept only certain file types (JS, ZIP) and has a size limit of 10MB. To modify these settings, edit the `uploader.ts` file:

```typescript
// Change file size limit (in bytes)
const maxSize = 10 * 1024 * 1024; // 10MB

// Change allowed file types
const allowedFileTypes = ['.js', '.zip', '.pdf', '.jpg', '.png'];
```

## Verifying Installation

After installation, you can verify that the components are working correctly:

1. **Status Check**: Visit `/api/status` in your browser or use curl:
   ```bash
   curl https://yourdomain.com/api/status
   ```
   You should see a JSON response with build information and system status.

2. **AI Integration Check**: Check if AI integration is working:
   ```bash
   curl https://yourdomain.com/api/ai-status
   ```
   You should see a success message if the OpenAI API key is valid.

3. **Admin Upload**: Log in as an admin and visit the upload page to ensure the file upload functionality works.

## Troubleshooting

### Missing Dependencies

If you encounter errors about missing dependencies, ensure all required packages are installed:

```bash
npm install @openai/api axios multer fs-extra
```

### Database Connection Issues

If you experience database connection problems, verify that:
- The PostgreSQL service is running
- The `DATABASE_URL` environment variable is correct
- The database user has appropriate permissions

### File Upload Errors

If file uploads fail:
- Check that the destination directory exists and is writable
- Verify that the file size is within limits
- Ensure the file type is allowed

For further assistance, check the application logs or contact the Go4It Sports technical support team.