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
  useContent, 
  useContentSection, 
  useAllContent
} from './hooks/useContent';
export { usePage } from './hooks/usePage';

// Export components
export { ContentBlock } from './components/ContentBlock';
export { ContentSection } from './components/ContentSection';
export { Page } from './components/Page';
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
  getContentBlock,
  getContentSection,
  createContentBlock,
  updateContentBlock,
  deleteContentBlock,
  getPage,
  getAllPages,
  createPage,
  updatePage,
  deletePage
} from './services/contentService';