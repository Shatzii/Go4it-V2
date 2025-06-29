/**
 * Module Configuration File
 * 
 * This file defines which modules are enabled and their configurations
 * This approach allows for easy CMS integration where modules can be enabled/disabled
 * and configured through a CMS interface
 */

export interface ModuleConfig {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  routes: Array<{
    path: string;
    component: string;
    exact?: boolean;
  }>;
  dependencies?: string[];
  version: string;
  settings?: Record<string, any>;
}

/**
 * Module configurations
 * In a CMS implementation, this would be loaded from an API or database
 */
export const moduleConfigs: ModuleConfig[] = [
  {
    id: 'myplayer',
    name: 'My Player',
    description: 'PlayStation 5-quality game interface for athlete development',
    enabled: true,
    routes: [
      { path: '/myplayer', component: 'pages/myplayer/index' },
      { path: '/myplayer/star-path', component: 'pages/myplayer/star-path' },
      { path: '/myplayer/ai-coach', component: 'pages/myplayer/ai-coach' },
      { path: '/myplayer/xp', component: 'pages/myplayer/xp/index' },
      { path: '/myplayer/xp/enhanced', component: 'pages/myplayer/xp/enhanced' },
      { path: '/myplayer/verification', component: 'pages/myplayer/verification/index' },
      { path: '/myplayer/verification/submit', component: 'pages/myplayer/verification/submit' },
      { path: '/myplayer/verification/:id', component: 'pages/myplayer/verification/detail' },
      { path: '/myplayer/video-recorder', component: 'pages/myplayer/video-recorder' },
    ],
    version: '1.0.0',
    settings: {
      showInMainNav: true,
      mainNavIcon: 'GameController',
      mainNavLabel: 'My Player',
    }
  },
  {
    id: 'gar',
    name: 'GAR Scoring System',
    description: 'Growth and Ability Rating assessment system',
    enabled: true,
    routes: [
      { path: '/gar', component: 'pages/gar/index' },
      { path: '/gar/score', component: 'pages/gar/score' },
      { path: '/gar/visualization', component: 'pages/gar/visualization' },
    ],
    version: '1.0.0',
    settings: {
      showInMainNav: true,
      mainNavIcon: 'BarChart',
      mainNavLabel: 'GAR Score',
    }
  },
  {
    id: 'academics',
    name: 'Academic Performance',
    description: 'Track and improve academic performance',
    enabled: true,
    routes: [
      { path: '/academics', component: 'pages/academics/index' },
      { path: '/academics/progress', component: 'pages/academics/progress' },
    ],
    version: '1.0.0',
    settings: {
      showInMainNav: true,
      mainNavIcon: 'GraduationCap',
      mainNavLabel: 'Academics',
    }
  },
  {
    id: 'social',
    name: 'Athlete Social Hub',
    description: 'Connect with other athletes and mentors',
    enabled: true,
    routes: [
      { path: '/social', component: 'pages/social/index' },
      { path: '/social/hub', component: 'pages/social/hub' },
      { path: '/social/connections', component: 'pages/social/connections' },
      { path: '/social/messages', component: 'pages/social/messages' },
      { path: '/social/events', component: 'pages/social/events' },
    ],
    version: '1.0.0',
    settings: {
      showInMainNav: true,
      mainNavIcon: 'Users',
      mainNavLabel: 'Social Hub',
    }
  },
  {
    id: 'combine',
    name: 'Athletic Combine',
    description: 'Showcase athletic abilities and get scouted',
    enabled: true,
    routes: [
      { path: '/combine', component: 'pages/combine/index' },
      { path: '/combine/showcase', component: 'pages/combine/showcase' },
      { path: '/combine/results', component: 'pages/combine/results' },
    ],
    version: '1.0.0',
    settings: {
      showInMainNav: true,
      mainNavIcon: 'Trophy',
      mainNavLabel: 'Combine',
    }
  },
  {
    id: 'skill',
    name: 'Skill Development',
    description: 'Track and develop athletic skills',
    enabled: true,
    routes: [
      { path: '/skill', component: 'pages/skill/index' },
      { path: '/skill/development-tracker', component: 'pages/skill/development-tracker' },
    ],
    version: '1.0.0',
    settings: {
      showInMainNav: true,
      mainNavIcon: 'Target',
      mainNavLabel: 'Skills',
    }
  },
  {
    id: 'video',
    name: 'Video Analysis',
    description: 'Upload and analyze performance videos',
    enabled: true,
    routes: [
      { path: '/video', component: 'pages/video/index' },
      { path: '/video/analysis', component: 'pages/video/analysis' },
      { path: '/video/upload', component: 'pages/video/upload' },
    ],
    version: '1.0.0',
    settings: {
      showInMainNav: true,
      mainNavIcon: 'Video',
      mainNavLabel: 'Videos',
    }
  },
  {
    id: 'profile',
    name: 'Athlete Profile',
    description: 'Manage athlete profile and settings',
    enabled: true,
    routes: [
      { path: '/profile', component: 'pages/profile/index' },
      { path: '/profile/athlete-profile', component: 'pages/profile/athlete-profile' },
      { path: '/profile/settings', component: 'pages/profile/settings' },
    ],
    version: '1.0.0',
    settings: {
      showInMainNav: true,
      mainNavIcon: 'User',
      mainNavLabel: 'Profile',
    }
  },
];

/**
 * Get all enabled modules
 */
export function getEnabledModules(): ModuleConfig[] {
  return moduleConfigs.filter(module => module.enabled);
}

/**
 * Get a specific module by ID
 */
export function getModuleById(id: string): ModuleConfig | undefined {
  return moduleConfigs.find(module => module.id === id);
}

/**
 * Get all routes from enabled modules
 */
export function getAllEnabledRoutes() {
  return getEnabledModules().flatMap(module => module.routes);
}