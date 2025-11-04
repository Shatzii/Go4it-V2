/**
 * Authentication API Tests
 * Tests for user authentication flows
 */

import { describe, it, expect, beforeEach } from '@jest/globals';

describe('Authentication API', () => {
  describe('POST /api/auth/login', () => {
    it('should authenticate valid user', async () => {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
        }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty('token');
      expect(data).toHaveProperty('user');
    });

    it('should reject invalid credentials', async () => {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'wrongpassword',
        }),
      });

      expect(response.status).toBe(401);
    });
  });
});

describe('GAR Analysis API', () => {
  let authToken: string;

  beforeEach(async () => {
    // Login to get auth token
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
      }),
    });
    const data = await response.json();
    authToken = data.token;
  });

  describe('POST /api/gar/session', () => {
    it('should create GAR session', async () => {
      const response = await fetch('http://localhost:3000/api/gar/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          studentId: 'test-student-1',
          sessionDate: new Date().toISOString(),
        }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty('sessionId');
    });
  });

  describe('GET /api/gar/metrics', () => {
    it('should fetch GAR metrics', async () => {
      const response = await fetch(
        'http://localhost:3000/api/gar/metrics?studentId=test-student-1',
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data.metrics)).toBe(true);
    });
  });
});

describe('StarPath API', () => {
  describe('GET /api/starpath/summary', () => {
    it('should return StarPath summary', async () => {
      const response = await fetch(
        'http://localhost:3000/api/starpath/summary?studentId=test-student-1'
      );

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty('ncaa');
      expect(data).toHaveProperty('gar');
      expect(data).toHaveProperty('nextBestActions');
    });

    it('should return 304 with matching ETag', async () => {
      const response1 = await fetch(
        'http://localhost:3000/api/starpath/summary?studentId=test-student-1'
      );
      const etag = response1.headers.get('ETag');

      const response2 = await fetch(
        'http://localhost:3000/api/starpath/summary?studentId=test-student-1',
        {
          headers: {
            'If-None-Match': etag || '',
          },
        }
      );

      expect(response2.status).toBe(304);
    });
  });
});

describe('Payment API', () => {
  describe('POST /api/audit/create-payment-intent', () => {
    it('should create Stripe payment intent', async () => {
      const response = await fetch(
        'http://localhost:3000/api/audit/create-payment-intent',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: 29900, // $299
            email: 'test@example.com',
            studentName: 'Test Student',
          }),
        }
      );

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty('clientSecret');
    });
  });
});

describe('Health Check APIs', () => {
  describe('GET /api/healthz', () => {
    it('should return healthy status', async () => {
      const response = await fetch('http://localhost:3000/api/healthz');
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.status).toBe('healthy');
    });
  });

  describe('GET /api/healthz/starpath', () => {
    it('should return StarPath health status', async () => {
      const response = await fetch('http://localhost:3000/api/healthz/starpath');
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty('database');
      expect(data).toHaveProperty('features');
    });
  });
});
