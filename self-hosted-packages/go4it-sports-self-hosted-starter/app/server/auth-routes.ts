import { Request, Response, Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { SessionData } from 'express-session';

// Extend SessionData to include userId
declare module 'express-session' {
  interface SessionData {
    userId?: number;
  }
}

// This will be our simple in-memory user database for now
const users = [
  {
    id: 1,
    username: 'alexjohnson',
    email: 'alex@example.com',
    password: '$2a$10$p0xsNVF5PVRNYZkhSCzHe.m0fCcQtRSsWixbY9aLZQNaWBtx4E8R2', // password123
    name: 'Alex Johnson',
    role: 'athlete'
  },
  {
    id: 2,
    username: 'admin',
    email: 'admin@go4itsports.org',
    password: '$2a$10$p0xsNVF5PVRNYZkhSCzHe.m0fCcQtRSsWixbY9aLZQNaWBtx4E8R2', // password123
    name: 'Admin User',
    role: 'admin'
  }
];

// JWT secret key (in a real app, this would be in environment variables)
const JWT_SECRET = 'go4it-sports-secret-key';

const router = Router();

// Login endpoint
router.post('/login', async (req: Request, res: Response) => {
  console.log('Login request received:', req.body);
  try {
    const { username, password } = req.body;

    // Check if user exists
    const user = users.find(u => u.username === username);
    if (!user) {
      console.log('User not found:', username);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('Invalid password for user:', username);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create session for the user
    if (req.session) {
      req.session.userId = user.id;
    }

    // Also create a JWT token for stateless API access
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user data and token (exclude password)
    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json({
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Logout endpoint
router.post('/logout', (req: Request, res: Response) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        return res.status(500).json({ message: 'Could not log out' });
      }
      res.clearCookie('connect.sid');
      return res.status(200).json({ message: 'Logged out successfully' });
    });
  } else {
    res.status(200).json({ message: 'Already logged out' });
  }
});

// Get current user endpoint
router.get('/user', (req: Request, res: Response) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const user = users.find(u => u.id === req.session.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  res.status(200).json(userWithoutPassword);
});

// Debug endpoint for testing
router.get('/debug', (req: Request, res: Response) => {
  res.status(200).json({
    session: req.session,
    message: 'Auth routes are working'
  });
});

export default router;