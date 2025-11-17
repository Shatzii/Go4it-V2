/* Ambient module declarations to quiet missing type packages for heavy/optional libs */
/* Ambient module declarations to quiet missing type packages for heavy/optional libs */

declare module '@tensorflow/tfjs-node';
declare module '@tensorflow-models/pose-detection';
declare module '@tensorflow-models/*';
declare module 'winston';
declare module '@playwright/test';
declare module '@jest/globals';
declare module 'canvas';
declare module 'sharp';
declare module 'opencv4nodejs';

// Common server-side packages that may not have types installed in the container
declare module 'mysql2';
declare module 'mysql2/promise';
declare module 'express' {
  const express: any;
  export default express;
}
declare module 'body-parser' {
  const bp: any;
  export default bp;
}
declare module 'cors' {
  const cors: any;
  export default cors;
}
declare module 'helmet' {
  const helmet: any;
  export default helmet;
}
declare module 'dotenv' {
  const dotenv: any;
  export default dotenv;
}
declare module 'connect-pg-simple' {
  const cpg: any;
  export default cpg;
}
declare module 'express-session' {
  const session: any;
  export default session;
}
declare module 'cookie-parser' {
  const cp: any;
  export default cp;
}
declare module 'pg' {
  const pg: any;
  export default pg;
}

// Project path aliases used in the repo (shallow ambients to quiet type-check)
declare module '@/server/database-storage';
declare module '@/shared/schema';
declare module '@shared/schema';

// Allow importing JSON without types in some legacy modules
declare module '*.json' {
  const value: any;
  export default value;
}
