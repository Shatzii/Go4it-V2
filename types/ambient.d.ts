declare module 'puppeteer';
declare module 'canvas';
declare module 'sharp';
declare module '@/lib/advanced-social-media-engine' {
  const anyExport: any;
  export = anyExport;
}

// Fallback for other native modules used during build-time analysis
declare module 'posthog-node';
declare module 'recharts';
