// Lightweight stub to disable heavy social/video functionality during constrained builds.
// The full implementation has been moved to `lib/advanced-social-media-engine.ts.disabled`.

const VIDEO_ENABLED = process.env.FEATURE_VIDEO === 'true';

export class AdvancedSocialMediaEngine {
  constructor() {}
  async generateAthleteHighlight() {
    throw new Error('Advanced social/video features are disabled (FEATURE_VIDEO != true)');
  }
  async generateContent() {
    throw new Error('Advanced social/video features are disabled (FEATURE_VIDEO != true)');
  }
  async generateScreenshot() {
    throw new Error('Advanced social/video features are disabled (FEATURE_VIDEO != true)');
  }
  async generatePreview() {
    throw new Error('Advanced social/video features are disabled (FEATURE_VIDEO != true)');
  }
  async healthCheck() {
    return { status: 'disabled', details: {} };
  }
  async shutdown() {
    return;
  }
}

// Singleton for in-process use
export const advancedSocialMediaEngine = new AdvancedSocialMediaEngine();

export default AdvancedSocialMediaEngine;
