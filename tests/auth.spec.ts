import { describe, it, expect, vi, beforeEach } from 'vitest';

// Provide a mockable currentUser and auth from Clerk server module
const currentUserMock = vi.fn();
const authMock = vi.fn();

vi.mock('@clerk/nextjs/server', () => ({
  currentUser: (...args: any[]) => currentUserMock(...args),
  auth: (...args: any[]) => authMock(...args),
}));

import { requireRole } from '../lib/auth';

beforeEach(() => {
  currentUserMock.mockReset();
  authMock.mockReset();
});

describe('requireRole', () => {
  it('allows teacher role', async () => {
    currentUserMock.mockResolvedValueOnce({ id: 'u1', publicMetadata: { role: 'teacher' } });
    const user = await requireRole('teacher');
    expect(user).toBeDefined();
  });

  it('throws for missing role', async () => {
    currentUserMock.mockResolvedValueOnce({ id: 'u2', publicMetadata: { role: 'student' } });
    let threw = false;
    try {
      await requireRole('teacher');
    } catch (e) {
      threw = true;
    }
    expect(threw).toBe(true);
  });
});
