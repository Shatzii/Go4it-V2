import { Request, Response, NextFunction } from 'express';

// Cache control headers for different content types
export const cacheControl = {
  // Static assets - cache for 1 year
  static: (req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    next();
  },

  // API responses - cache for 5 minutes
  api: (req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300');
    next();
  },

  // Dynamic content - cache for 1 minute
  dynamic: (req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=60');
    next();
  },

  // No cache for sensitive data
  noCache: (req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
  }
};

// ETag middleware for conditional requests
export const etag = (req: Request, res: Response, next: NextFunction) => {
  const originalSend = res.send;
  
  res.send = function(data: any) {
    if (data && typeof data === 'string') {
      const hash = require('crypto').createHash('md5').update(data).digest('hex');
      res.setHeader('ETag', `"${hash}"`);
      
      if (req.headers['if-none-match'] === `"${hash}"`) {
        res.status(304).end();
        return res;
      }
    }
    
    return originalSend.call(this, data);
  };
  
  next();
};

// Compression middleware
export const compression = (req: Request, res: Response, next: NextFunction) => {
  const acceptEncoding = req.headers['accept-encoding'] || '';
  
  if (acceptEncoding.includes('gzip')) {
    res.setHeader('Content-Encoding', 'gzip');
  } else if (acceptEncoding.includes('deflate')) {
    res.setHeader('Content-Encoding', 'deflate');
  }
  
  next();
};