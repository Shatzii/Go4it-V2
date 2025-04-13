/**
 * CMS Module Exports
 * 
 * Main entry point for the CMS module that powers the dynamic content management
 * across the Go4It Sports platform.
 */

// Export types
export * from './types';

// Export hooks
export { 
  useContentBlocks, 
  useContentBlocksBySection, 
  useContentBlockByIdentifier,
  useContentSection,
  getBlockFromSection,
  formatContent
} from './hooks/useContent';
export { usePage } from './hooks/usePage';

// Export components
export { default as ContentBlock } from './components/ContentBlock';
export { default as ContentSection } from './components/ContentSection';
export { default as Page } from './components/Page';
export { 
  registerContentComponent,
  registerSectionComponent,
  getContentComponent,
  getSectionComponent,
  DynamicContent,
  DynamicSection
} from './components/ComponentRegistry';

// Export services
export {
  getAllContentBlocks,
  getContentBlocksBySection,
  getContentBlockByIdentifier,
  createContentSection,
  getPageData
} from './services/contentService';