import { Express } from 'express-serve-static-core';

declare global {
  namespace Express {
    interface Request {
      /**
       * Token data attached by the auth-sentinel middleware
       * Will be undefined if no valid token is present
       */
      token?: {
        userId: number;
        role: string;
        sessionId: string;
      };
    }
  }
}