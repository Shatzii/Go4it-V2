import { NextRequest, NextResponse } from 'next/server';
import { storage } from './storage';
import { insertUserSchema, insertVideoAnalysisSchema } from '../shared/schema';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Zod schemas for validation
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Helper function to get user from JWT token
export async function getUserFromRequest(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    return await storage.getUser(decoded.userId);
  } catch (error) {
    return null;
  }
}

// Auth Routes
export async function authLogin(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    const user = await storage.validateUserCredentials(email, password);
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    await storage.updateLastLogin(user.id);
    
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    
    return NextResponse.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        sport: user.sport,
        subscriptionPlan: user.subscriptionPlan
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}

export async function authRegister(request: NextRequest) {
  try {
    const body = await request.json();
    const userData = insertUserSchema.parse(body) as any;

    // Check if user already exists
    const existingUser = await storage.getUserByEmail(userData.email);
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    const user = await storage.createUser(userData);
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}

export async function authMe(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        sport: user.sport,
        subscriptionPlan: user.subscriptionPlan
      }
    });
  } catch (error) {
    console.error('Auth me error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

// Dashboard Routes
export async function getDashboard(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const stats = await storage.getDashboardStats(user.id);
    const userAnalyses = await storage.getVideoAnalysisByUserId(user.id);

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        sport: user.sport,
        position: user.position,
        graduationYear: user.graduationYear,
        gpa: user.gpa,
        subscriptionPlan: user.subscriptionPlan
      },
      stats,
      recentAnalyses: userAnalyses.slice(0, 5)
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json({ error: 'Failed to load dashboard' }, { status: 500 });
  }
}

// Video Analysis Routes
export async function createVideoAnalysis(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const data = insertVideoAnalysisSchema.parse({
      ...body,
      userId: user.id
    }) as any;

    const analysis = await storage.createVideoAnalysis(data);
    return NextResponse.json(analysis, { status: 201 });
  } catch (error) {
    console.error('Video analysis creation error:', error);
    return NextResponse.json({ error: 'Failed to create analysis' }, { status: 500 });
  }
}

export async function getUserVideoAnalyses(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const analyses = await storage.getVideoAnalysisByUserId(user.id);
    return NextResponse.json(analyses);
  } catch (error) {
    console.error('Get video analyses error:', error);
    return NextResponse.json({ error: 'Failed to get analyses' }, { status: 500 });
  }
}

// Rankings Routes
export async function getAthleteRankings(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sport = searchParams.get('sport') || undefined;
    const limit = parseInt(searchParams.get('limit') || '100');

    const topAthletes = await storage.getTopAthletesByGAR(limit, sport);
    return NextResponse.json(topAthletes);
  } catch (error) {
    console.error('Get rankings error:', error);
    return NextResponse.json({ error: 'Failed to get rankings' }, { status: 500 });
  }
}

// Verified Athletes Routes
export async function getVerifiedAthletes(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sport = searchParams.get('sport') || undefined;
    const minGAR = searchParams.get('minGAR') ? parseInt(searchParams.get('minGAR')!) : 80;

    const verifiedAthletes = await storage.getUsersByGARScore(minGAR, undefined, sport);
    return NextResponse.json(verifiedAthletes);
  } catch (error) {
    console.error('Get verified athletes error:', error);
    return NextResponse.json({ error: 'Failed to get verified athletes' }, { status: 500 });
  }
}

// Admin Routes
export async function getAdminStats(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const stats = await storage.getDashboardStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ error: 'Failed to get admin stats' }, { status: 500 });
  }
}

// Subscription Routes
export async function updateSubscription(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const updatedUser = await storage.updateUserSubscription(user.id, body);
    
    return NextResponse.json({
      user: {
        id: updatedUser.id,
        subscriptionPlan: updatedUser.subscriptionPlan,
        subscriptionStatus: updatedUser.subscriptionStatus,
        subscriptionEndDate: updatedUser.subscriptionEndDate
      }
    });
  } catch (error) {
    console.error('Update subscription error:', error);
    return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 });
  }
}