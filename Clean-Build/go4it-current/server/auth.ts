import type { Request, Response, NextFunction } from 'express';

// Simple authentication middleware for development
export const basicAuth = (req: Request, res: Response, next: NextFunction) => {
  // For now, just check if user has a session or basic auth header
  const authHeader = req.headers.authorization;
  const sessionUser = (req as any).user;

  if (sessionUser || authHeader) {
    // User is authenticated
    return next();
  }

  // Return 401 for unauthenticated requests
  res.status(401).json({
    message: 'Unauthorized',
    loginUrl: '/api/login',
  });
};

// Admin user for the platform
export const adminUser = {
  id: 'admin-001',
  email: 'admin@go4itsports.org',
  firstName: 'Admin',
  lastName: 'User',
  profileImageUrl: null,
  sport: 'administration',
  position: 'administrator',
  grade: 'staff',
  garScore: 100,
  isVerified: true,
  subscriptionTier: 'admin',
  isAdmin: true,
};

// Mock user for development
export const mockUser = {
  id: 'dev-user-123',
  email: 'demo@go4it.com',
  firstName: 'Demo',
  lastName: 'User',
  profileImageUrl: null,
  sport: 'football',
  position: 'quarterback',
  grade: '11th',
  garScore: 78,
  isVerified: true,
  subscriptionTier: 'pro',
  isAdmin: false,
};

// Development routes
export const setupDevAuth = (app: any) => {
  // Simple login endpoint that creates a mock session
  app.get('/api/login', (req: Request, res: Response) => {
    // In development, just redirect to a success page with mock user
    const returnTo = req.query.returnTo || '/dashboard';
    res.redirect(`${returnTo}?authenticated=true`);
  });

  // Mock auth endpoints
  app.get('/api/auth/me', (req: Request, res: Response) => {
    // Check for admin login context (in a real system, this would check session/JWT)
    const userAgent = req.headers['user-agent'] || '';
    const isAdminContext = req.query.admin === 'true' || req.headers['x-admin-access'] === 'true';

    // Return admin user for admin context, otherwise return mock user
    if (isAdminContext) {
      res.json(adminUser);
    } else {
      res.json(mockUser);
    }
  });

  app.get('/api/auth/user', (req: Request, res: Response) => {
    // Check for admin context
    const isAdminContext = req.query.admin === 'true' || req.headers['x-admin-access'] === 'true';

    if (isAdminContext) {
      res.json(adminUser);
    } else {
      res.json(mockUser);
    }
  });

  app.get('/api/logout', (req: Request, res: Response) => {
    res.redirect('/?logout=true');
  });
};
