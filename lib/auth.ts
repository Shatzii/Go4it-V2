// Auth helper functions
import { NextRequest } from 'next/server';

export async function getUserFromRequest(request: NextRequest) {
  // Mock user for development - in production this would check JWT/session
  return {
    id: 'user_123',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    skillLevel: 'intermediate',
    coachingLevel: 'intermediate'
  };
}