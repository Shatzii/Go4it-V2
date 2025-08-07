// Go4It Sports Platform - Media Library Management System
// Centralizes all uploaded media assets for easy access across the platform

export interface MediaAsset {
  id: string;
  filename: string;
  originalName: string;
  type: 'image' | 'video' | 'document' | 'logo';
  category: 'branding' | 'events' | 'camps' | 'documentation' | 'promotional' | 'athlete-content';
  description?: string;
  path: string;
  thumbnailPath?: string;
  uploadDate: string;
  tags: string[];
  size?: number;
  dimensions?: { width: number; height: number };
}

// Organized media library with all uploaded assets
export const mediaLibrary: MediaAsset[] = [
  // BRANDING & LOGOS
  {
    id: 'go4it-logo-main',
    filename: 'Go4it Logo_1752616197577.jpeg',
    originalName: 'Go4it Logo.jpeg',
    type: 'logo',
    category: 'branding',
    description: 'Main Go4It Sports platform logo',
    path: '@assets/Go4it Logo_1752616197577.jpeg',
    uploadDate: '2025-01-07',
    tags: ['logo', 'branding', 'go4it', 'primary']
  },

  // EVENT & CAMP PROMOTIONAL MATERIALS
  {
    id: 'green-soccer-camp-flyer',
    filename: 'Green Fun Soccer Camp Sport Event Flyer_1752787651058.jpeg',
    originalName: 'Green Fun Soccer Camp Sport Event Flyer.jpeg',
    type: 'image',
    category: 'camps',
    description: 'Promotional flyer for Green Fun Soccer Camp',
    path: '@assets/Green Fun Soccer Camp Sport Event Flyer_1752787651058.jpeg',
    uploadDate: '2025-01-07',
    tags: ['soccer', 'camp', 'promotional', 'flyer', 'events']
  },
  {
    id: 'baseball-camp-flyer-blue',
    filename: 'Navy Blue and Gray Modern Baseball Camp Promotion Flyer_1752787651058.png',
    originalName: 'Navy Blue and Gray Modern Baseball Camp Promotion Flyer.png',
    type: 'image',
    category: 'camps',
    description: 'Modern baseball camp promotional flyer in navy blue theme',
    path: '@assets/Navy Blue and Gray Modern Baseball Camp Promotion Flyer_1752787651058.png',
    uploadDate: '2025-01-07',
    tags: ['baseball', 'camp', 'promotional', 'flyer', 'navy-blue', 'modern']
  },
  {
    id: 'baseball-camp-flyer-updated',
    filename: 'Navy Blue and Gray Modern Baseball Camp Promotion Flyer_1754370606998.png',
    originalName: 'Navy Blue and Gray Modern Baseball Camp Promotion Flyer Updated.png',
    type: 'image',
    category: 'camps',
    description: 'Updated version of baseball camp promotional flyer',
    path: '@assets/Navy Blue and Gray Modern Baseball Camp Promotion Flyer_1754370606998.png',
    uploadDate: '2025-01-07',
    tags: ['baseball', 'camp', 'promotional', 'flyer', 'updated', 'current']
  },

  // EUROPEAN EVENTS & INTERNATIONAL CONTENT
  {
    id: 'europe-elite-logo',
    filename: 'Copy of Europeselite.com_1754352865747.png',
    originalName: 'Europeselite.com.png',
    type: 'image',
    category: 'events',
    description: 'Europe Elite sports program branding',
    path: '@assets/Copy of Europeselite.com_1754352865747.png',
    uploadDate: '2025-01-07',
    tags: ['europe', 'elite', 'international', 'branding', 'logo']
  },
  {
    id: 'ews-2025-banner',
    filename: 'EWS 2025 - 1_1754352865747.jpeg',
    originalName: 'EWS 2025 - 1.jpeg',
    type: 'image',
    category: 'events',
    description: 'EWS 2025 event banner and promotional material',
    path: '@assets/EWS 2025 - 1_1754352865747.jpeg',
    uploadDate: '2025-01-07',
    tags: ['ews', '2025', 'event', 'banner', 'european', 'sports']
  },
  {
    id: 'team-camp-2025',
    filename: 'TeamCamp2025_1754351477369.jpg',
    originalName: 'TeamCamp2025.jpg',
    type: 'image',
    category: 'camps',
    description: 'Team Camp 2025 promotional image',
    path: '@assets/TeamCamp2025_1754351477369.jpg',
    uploadDate: '2025-01-07',
    tags: ['team', 'camp', '2025', 'group', 'training']
  },

  // ATHLETE PHOTOS & CONTENT
  {
    id: 'athlete-photo-1',
    filename: 'IMG_3867_1754370606998.jpeg',
    originalName: 'IMG_3867.jpeg',
    type: 'image',
    category: 'athlete-content',
    description: 'Athlete training or competition photo',
    path: '@assets/IMG_3867_1754370606998.jpeg',
    uploadDate: '2025-01-07',
    tags: ['athlete', 'photo', 'training', 'action']
  },
  {
    id: 'athlete-photo-2',
    filename: 'IMG_5606_1754352865747.jpeg',
    originalName: 'IMG_5606.jpeg',
    type: 'image',
    category: 'athlete-content',
    description: 'Additional athlete or event photo',
    path: '@assets/IMG_5606_1754352865747.jpeg',
    uploadDate: '2025-01-07',
    tags: ['athlete', 'photo', 'event', 'sports']
  },
  {
    id: 'sports-facility-photo',
    filename: 'TFSD3208_1752680558058.JPG',
    originalName: 'TFSD3208.JPG',
    type: 'image',
    category: 'promotional',
    description: 'Sports facility or training environment photo',
    path: '@assets/TFSD3208_1752680558058.JPG',
    uploadDate: '2025-01-07',
    tags: ['facility', 'training', 'environment', 'sports']
  },

  // VIDEO CONTENT
  {
    id: 'promotional-video-1',
    filename: 'IMG_0397_1752787651058.mov',
    originalName: 'IMG_0397.mov',
    type: 'video',
    category: 'promotional',
    description: 'Promotional or training video content',
    path: '@assets/IMG_0397_1752787651058.mov',
    uploadDate: '2025-01-07',
    tags: ['video', 'promotional', 'training', 'content']
  },
  {
    id: 'training-video-1',
    filename: 'IMG_5141_1753940768312.mov',
    originalName: 'IMG_5141.mov',
    type: 'video',
    category: 'athlete-content',
    description: 'Training or technique demonstration video',
    path: '@assets/IMG_5141_1753940768312.mov',
    uploadDate: '2025-01-07',
    tags: ['video', 'training', 'technique', 'demonstration']
  },

  // DESIGN ASSETS & GRAPHICS
  {
    id: 'chatgpt-design-1',
    filename: 'ChatGPT Image May 31, 2025, 05_20_35 AM_1752599683654.png',
    originalName: 'ChatGPT Image May 31 2025.png',
    type: 'image',
    category: 'promotional',
    description: 'AI-generated promotional design asset',
    path: '@assets/ChatGPT Image May 31, 2025, 05_20_35 AM_1752599683654.png',
    uploadDate: '2025-01-07',
    tags: ['ai-generated', 'design', 'promotional', 'graphic']
  },
  {
    id: 'chatgpt-design-2',
    filename: 'ChatGPT Image May 31, 2025, 05_20_35 AM_1753967034795.png',
    originalName: 'ChatGPT Image May 31 2025 Alt.png',
    type: 'image',
    category: 'promotional',
    description: 'Alternative AI-generated promotional design',
    path: '@assets/ChatGPT Image May 31, 2025, 05_20_35 AM_1753967034795.png',
    uploadDate: '2025-01-07',
    tags: ['ai-generated', 'design', 'promotional', 'alternative']
  },
  {
    id: 'untitled-design',
    filename: 'Untitled design_1754371070721.png',
    originalName: 'Untitled design.png',
    type: 'image',
    category: 'promotional',
    description: 'Custom design asset for platform use',
    path: '@assets/Untitled design_1754371070721.png',
    uploadDate: '2025-01-07',
    tags: ['design', 'custom', 'asset', 'graphic']
  }
];

// DOCUMENT LIBRARY
export const documentLibrary: MediaAsset[] = [
  {
    id: 'ews-2025-spanish-guide',
    filename: 'EWS2025 Espanol.pdf_1754351477369.pdf',
    originalName: 'EWS2025 Espanol.pdf',
    type: 'document',
    category: 'documentation',
    description: 'EWS 2025 Spanish language guide and information',
    path: '@assets/EWS2025 Espanol.pdf_1754351477369.pdf',
    uploadDate: '2025-01-07',
    tags: ['ews', '2025', 'spanish', 'guide', 'documentation']
  },
  {
    id: 'mexico-launch-plan',
    filename: 'Mexico Launch_1754351538465.pdf',
    originalName: 'Mexico Launch.pdf',
    type: 'document',
    category: 'documentation',
    description: 'Mexico market launch strategy and planning document',
    path: '@assets/Mexico Launch_1754351538465.pdf',
    uploadDate: '2025-01-07',
    tags: ['mexico', 'launch', 'strategy', 'international', 'planning']
  },
  {
    id: 'athlete-membership-flyer',
    filename: 'Enrollment 25 - League Marketing Kit - Athlete Membership Flyer[1509453183]_Print_1754352942228.pdf',
    originalName: 'Athlete Membership Flyer.pdf',
    type: 'document',
    category: 'documentation',
    description: 'Athlete membership enrollment flyer and information',
    path: '@assets/Enrollment 25 - League Marketing Kit - Athlete Membership Flyer[1509453183]_Print_1754352942228.pdf',
    uploadDate: '2025-01-07',
    tags: ['enrollment', 'athlete', 'membership', 'flyer', 'marketing']
  },
  {
    id: 'coach-membership-flyer',
    filename: 'Enrollment 25 - League Marketing Kit - Coach Membership Flyer[1509453183]_Print_1754352942228.pdf',
    originalName: 'Coach Membership Flyer.pdf',
    type: 'document',
    category: 'documentation',
    description: 'Coach membership enrollment flyer and information',
    path: '@assets/Enrollment 25 - League Marketing Kit - Coach Membership Flyer[1509453183]_Print_1754352942228.pdf',
    uploadDate: '2025-01-07',
    tags: ['enrollment', 'coach', 'membership', 'flyer', 'marketing']
  },
  {
    id: 'coach-certification-flyer',
    filename: 'Enrollment 25 - League Marketing Kit - CoachCertificationFlyer[1509453183]_Print_1754352942228.pdf',
    originalName: 'Coach Certification Flyer.pdf',
    type: 'document',
    category: 'documentation',
    description: 'Coach certification program flyer and requirements',
    path: '@assets/Enrollment 25 - League Marketing Kit - CoachCertificationFlyer[1509453183]_Print_1754352942228.pdf',
    uploadDate: '2025-01-07',
    tags: ['coach', 'certification', 'program', 'flyer', 'requirements']
  },
  {
    id: 'welcome-letter-buba',
    filename: 'Welcome Letter Buba  .pdf_1754352942228.pdf',
    originalName: 'Welcome Letter Buba.pdf',
    type: 'document',
    category: 'documentation',
    description: 'Personalized welcome letter for participant Buba',
    path: '@assets/Welcome Letter Buba  .pdf_1754352942228.pdf',
    uploadDate: '2025-01-07',
    tags: ['welcome', 'letter', 'participant', 'buba', 'personalized']
  },
  {
    id: 'welcome-letter-zo',
    filename: 'Welcome Letter Zo .pdf_1754352942228.pdf',
    originalName: 'Welcome Letter Zo.pdf',
    type: 'document',
    category: 'documentation',
    description: 'Personalized welcome letter for participant Zo',
    path: '@assets/Welcome Letter Zo .pdf_1754352942228.pdf',
    uploadDate: '2025-01-07',
    tags: ['welcome', 'letter', 'participant', 'zo', 'personalized']
  }
];

// Utility functions for media library
export function getAssetsByCategory(category: MediaAsset['category']): MediaAsset[] {
  return [...mediaLibrary, ...documentLibrary].filter(asset => asset.category === category);
}

export function getAssetsByType(type: MediaAsset['type']): MediaAsset[] {
  return [...mediaLibrary, ...documentLibrary].filter(asset => asset.type === type);
}

export function searchAssets(query: string): MediaAsset[] {
  const searchTerm = query.toLowerCase();
  return [...mediaLibrary, ...documentLibrary].filter(asset => 
    asset.originalName.toLowerCase().includes(searchTerm) ||
    asset.description?.toLowerCase().includes(searchTerm) ||
    asset.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
}

export function getAssetById(id: string): MediaAsset | undefined {
  return [...mediaLibrary, ...documentLibrary].find(asset => asset.id === id);
}

export function getPromotionalAssets(): MediaAsset[] {
  return getAssetsByCategory('promotional');
}

export function getBrandingAssets(): MediaAsset[] {
  return getAssetsByCategory('branding');
}

export function getCampAssets(): MediaAsset[] {
  return getAssetsByCategory('camps');
}

export function getEventAssets(): MediaAsset[] {
  return getAssetsByCategory('events');
}

export function getAthleteContent(): MediaAsset[] {
  return getAssetsByCategory('athlete-content');
}

export function getDocumentation(): MediaAsset[] {
  return getAssetsByCategory('documentation');
}

// Quick access to commonly used assets
export const quickAccess = {
  mainLogo: getAssetById('go4it-logo-main'),
  currentBaseballFlyer: getAssetById('baseball-camp-flyer-updated'),
  soccerCampFlyer: getAssetById('green-soccer-camp-flyer'),
  europeEliteLogo: getAssetById('europe-elite-logo'),
  ews2025Banner: getAssetById('ews-2025-banner'),
  teamCamp2025: getAssetById('team-camp-2025')
};