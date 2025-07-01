#!/bin/bash

echo "🔐 Setting up Secure Authentication System for AI Education Platform..."

# Ensure we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in a Node.js project directory"
    echo "Please navigate to your schools.shatzii.com project directory first"
    exit 1
fi

# Create authentication directories
echo "📁 Creating authentication directory structure..."
mkdir -p server/services
mkdir -p server/routes
mkdir -p server/middleware
mkdir -p components/auth
mkdir -p hooks
mkdir -p utils

# Create feature branch for authentication system
echo "🌿 Creating feature branch for authentication..."
git checkout -b feature/auth-system 2>/dev/null || echo "ℹ️  Auth feature branch already exists"

# Install required dependencies if not present
echo "📦 Checking authentication dependencies..."
npm list jsonwebtoken > /dev/null 2>&1 || echo "jsonwebtoken" >> .install-queue
npm list bcrypt > /dev/null 2>&1 || echo "bcrypt" >> .install-queue
npm list express-rate-limit > /dev/null 2>&1 || echo "express-rate-limit" >> .install-queue
npm list cookie-parser > /dev/null 2>&1 || echo "cookie-parser" >> .install-queue

if [ -f ".install-queue" ]; then
    echo "Installing required dependencies..."
    while IFS= read -r package; do
        npm install "$package"
    done < .install-queue
    rm .install-queue
fi

# Create authentication environment variables
if [ ! -f ".env.auth" ]; then
    echo "⚙️ Creating authentication environment configuration..."
    cat > .env.auth << 'EOF'
# Authentication System Configuration
JWT_SECRET=your_jwt_secret_here_replace_with_256_bit_key
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here_replace_with_256_bit_key
SESSION_SECRET=your_session_secret_here_replace_with_secure_key

# Security Settings
MAX_LOGIN_ATTEMPTS=5
LOCKOUT_DURATION=1800000
TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

# Rate Limiting
AUTH_RATE_LIMIT_WINDOW=900000
AUTH_RATE_LIMIT_MAX=5
GENERAL_RATE_LIMIT_MAX=100

# Cookie Settings
COOKIE_SECURE=true
COOKIE_SAME_SITE=strict
COOKIE_HTTP_ONLY=true
EOF
    echo "📝 Created .env.auth - remember to add secure secrets!"
else
    echo "ℹ️  .env.auth already exists - keeping existing configuration"
fi

# Create TypeScript interfaces for authentication
cat > types/auth.ts << 'EOF'
// Authentication Types for AI Education Platform

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  schoolId?: string;
  permissions: string[];
  createdAt: string;
  lastLogin?: string;
  mfaEnabled: boolean;
}

export type UserRole = 'super_admin' | 'school_admin' | 'teacher' | 'student' | 'parent';

export interface AuthResult {
  success: boolean;
  user?: User;
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: string;
  error?: string;
  code?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
  schoolId?: string;
}

export interface SecurityEvent {
  id: string;
  userId?: string;
  eventType: string;
  eventData: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
}

export interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  requiredPermissions?: string[];
  fallback?: React.ReactNode;
}
EOF

# Create comprehensive Copilot context for authentication
cat > .copilot-auth-context.md << 'EOF'
# AI Education Platform - Authentication System Context

## Authentication Architecture Overview

This project implements a comprehensive, production-ready authentication system for the AI Education Platform at schools.shatzii.com.

### Security Features Implemented
- JWT token-based authentication with 15-minute access tokens
- Refresh tokens with 7-day expiry stored in HTTP-only cookies
- Bcrypt password hashing with 12 salt rounds
- Account lockout protection (5 failed attempts = 30-minute lockout)
- Rate limiting on authentication endpoints (5 requests/15 minutes)
- Comprehensive security event logging and audit trail
- Role-based access control with granular permissions
- CSRF protection with secure cookie attributes

### User Roles and Permissions
1. **Super Admin**: Complete platform access, manages all schools
2. **School Admin**: Full school management, user creation, billing access
3. **Teacher**: Student management, content creation, AI teacher access, analytics
4. **Student**: Course access, AI tutoring sessions, assignment submission, progress tracking
5. **Parent**: Child progress monitoring, teacher communication, report access

### Integration with AI Education Platform
- Seamless integration with 6 specialized AI teachers
- Role-based access to different AI capabilities
- Student session tracking for personalized learning paths
- Progress data tied to authenticated user profiles
- School-specific content and branding access
- Parent portal integration for monitoring child progress

### Database Schema
The authentication system uses PostgreSQL with tables for:
- users: Core user information and authentication data
- auth_sessions: Refresh token management and session tracking
- security_events: Comprehensive audit logging for compliance

### API Endpoints
- POST /api/auth/login - User authentication with JWT generation
- POST /api/auth/refresh - Secure token refresh mechanism
- POST /api/auth/logout - Token invalidation and secure logout
- POST /api/auth/register - User registration (admin-restricted)
- GET /api/auth/me - Current user profile information
- POST /api/auth/change-password - Secure password modification
- GET /api/auth/security-events - Security audit access (admin-only)

### Frontend Integration
- React authentication hooks for state management
- Automatic token refresh handling
- Protected route components with role-based access
- Login/logout UI components with proper error handling
- Loading states and user feedback
- Role-based navigation and feature visibility

### Security Best Practices
- Input validation and sanitization on all endpoints
- Comprehensive error handling with security-appropriate responses
- Rate limiting to prevent brute force attacks
- Audit logging for compliance and security monitoring
- Secure cookie configuration for production environments
- Protection against common web vulnerabilities (XSS, CSRF, etc.)

### Educational Platform Specific Features
- Integration with student learning profiles and progress tracking
- Teacher access to student data within appropriate scope
- Parent access to child accounts with privacy protections
- School admin oversight with data governance controls
- AI teacher session authentication and personalization
- Content access control based on user roles and school policies

## Development Guidelines
- Always use feature branch: feature/auth-system
- Implement comprehensive error handling and logging
- Follow TypeScript best practices with proper interfaces
- Include comprehensive testing for security functionality
- Maintain compatibility with existing AI education platform features
- Ensure GDPR and FERPA compliance considerations

This authentication system provides enterprise-grade security while maintaining seamless integration with the AI education platform's specialized features and user experience requirements.
EOF

# Create VS Code workspace configuration for authentication development
cat > .vscode/auth-workspace.code-workspace << 'EOF'
{
  "folders": [
    {
      "name": "Authentication System - AI Education Platform",
      "path": "."
    }
  ],
  "settings": {
    "typescript.preferences.importModuleSpecifier": "relative",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.organizeImports": true,
      "source.fixAll.eslint": true
    },
    "github.copilot.enable": {
      "*": true,
      "typescript": true,
      "javascript": true,
      "typescriptreact": true
    },
    "files.associations": {
      ".env.auth": "properties"
    }
  },
  "extensions": {
    "recommendations": [
      "github.copilot",
      "github.copilot-chat", 
      "ms-vscode.vscode-typescript-next",
      "esbenp.prettier-vscode",
      "ms-vscode.vscode-eslint"
    ]
  },
  "tasks": {
    "version": "2.0.0",
    "tasks": [
      {
        "label": "🔐 Setup Authentication System",
        "type": "shell",
        "command": "echo",
        "args": ["Authentication system workspace ready!"],
        "group": "build"
      },
      {
        "label": "🧪 Test Authentication Endpoints",
        "type": "shell",
        "command": "echo",
        "args": ["Use REST client to test /api/auth/* endpoints"],
        "group": "test"
      }
    ]
  }
}
EOF

# Create API testing file for authentication endpoints
cat > .vscode/auth-api-tests.http << 'EOF'
### AI Education Platform - Authentication API Tests

# Test User Login
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@demo-school.com",
  "password": "password123"
}

###

# Test Token Refresh
POST http://localhost:5000/api/auth/refresh
Content-Type: application/json
Cookie: refreshToken=your_refresh_token_here

###

# Test Get Current User (requires Authorization header)
GET http://localhost:5000/api/auth/me
Authorization: Bearer your_access_token_here

###

# Test User Registration (admin only)
POST http://localhost:5000/api/auth/register
Content-Type: application/json
Authorization: Bearer your_admin_access_token_here

{
  "email": "newuser@demo-school.com",
  "password": "securePassword123",
  "firstName": "New",
  "lastName": "User",
  "role": "teacher",
  "schoolId": "demo-school"
}

###

# Test Change Password
POST http://localhost:5000/api/auth/change-password
Content-Type: application/json
Authorization: Bearer your_access_token_here

{
  "currentPassword": "oldPassword123",
  "newPassword": "newSecurePassword456"
}

###

# Test Logout
POST http://localhost:5000/api/auth/logout
Content-Type: application/json
Cookie: refreshToken=your_refresh_token_here

###

# Test Security Events (admin only)
GET http://localhost:5000/api/auth/security-events?limit=10
Authorization: Bearer your_admin_access_token_here

###

# Test Rate Limiting (try multiple rapid requests)
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@demo-school.com",
  "password": "wrongpassword"
}
EOF

echo ""
echo "✅ Authentication system workspace setup complete!"
echo ""
echo "📋 Next Steps:"
echo "1. 💻 Open authentication workspace:"
echo "   code .vscode/auth-workspace.code-workspace"
echo ""
echo "2. 🔐 Configure secure secrets in .env.auth:"
echo "   • Generate JWT_SECRET (256-bit key)"
echo "   • Generate REFRESH_TOKEN_SECRET (256-bit key)"
echo "   • Set SESSION_SECRET (secure random string)"
echo ""
echo "3. 🤖 Start with GitHub Copilot:"
echo "   • Press Ctrl+Shift+P → 'GitHub Copilot: Open Chat'"
echo "   • Use: @workspace Create the complete AuthenticationService class"
echo ""
echo "4. 🧪 Test authentication endpoints:"
echo "   • Open .vscode/auth-api-tests.http"
echo "   • Use REST Client to test each endpoint"
echo ""
echo "5. 🔗 Integration commands for Copilot:"
echo "   @workspace Build authentication API routes with security middleware"
echo "   @workspace Create React authentication hooks and context"
echo "   @workspace Implement protected routes with role-based access"
echo ""
echo "🛡️  Security: Everything uses feature branch 'feature/auth-system'"
echo "🔄 Rollback: 'git checkout main' to return to original code"
echo ""
echo "Ready to implement enterprise-grade authentication! 🔐✨"