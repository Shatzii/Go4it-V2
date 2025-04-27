/**
 * Athlete Profile Module
 * 
 * This module handles athlete profiles and provides components for displaying profile data.
 * It registers itself with the Component Registry to make its features available to the CMS.
 */

import React from 'react';
import { 
  componentRegistry, 
  FeatureModule 
} from '@/services/component-registry-service';
import AthleteProfileCard from './components/AthleteProfileCard';
import AthleteStats from './components/AthleteStats';
import { ListChecks } from 'lucide-react';

// Lazy load pages
const AthleteProfile = React.lazy(() => import('./pages/AthleteProfile'));
const AthletesList = React.lazy(() => import('./pages/AthletesList'));
const AthleteAdmin = React.lazy(() => import('./pages/AthleteAdmin'));

// Define the module
const athleteProfileModule: FeatureModule = {
  id: 'athlete-profile',
  name: 'Athlete Profile',
  description: 'Components and services for managing athlete profiles',
  version: '1.0.0',
  
  // Components that can be used in CMS pages
  components: {
    'AthleteProfileCard': AthleteProfileCard,
    'AthleteStats': AthleteStats,
  },
  
  // Admin pages provided by this module
  adminPages: [
    {
      path: '/admin/athletes',
      component: AthleteAdmin,
      title: 'Athlete Management',
      icon: <ListChecks size={16} />,
      group: 'Users',
    },
  ],
  
  // Routes for public-facing pages
  routes: [
    {
      path: '/athletes/:id',
      component: AthleteProfile,
      exact: true,
    },
    {
      path: '/athletes',
      component: AthletesList,
      exact: true,
    },
  ],
  
  // Initialization function
  initialize: async () => {
    console.log('Athlete Profile Module initialized');
    // Any async initialization can happen here
  }
};

// Register the module with the registry
componentRegistry.registerFeatureModule(athleteProfileModule);

// Register individual UI components for the CMS
componentRegistry.registerUIComponent({
  id: 'athlete-profile-card',
  name: 'Athlete Profile Card',
  description: 'Displays a card with athlete information',
  component: AthleteProfileCard,
  category: 'Athletes',
  tags: ['profile', 'card', 'athlete'],
});

componentRegistry.registerUIComponent({
  id: 'athlete-stats',
  name: 'Athlete Statistics',
  description: 'Displays athlete performance statistics',
  component: AthleteStats,
  category: 'Athletes',
  tags: ['statistics', 'performance', 'athlete'],
});

// Export the module
export default athleteProfileModule;