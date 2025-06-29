/**
 * Types for the CMS system
 */

/**
 * Content Block Data Type
 * Represents a single piece of content that can be displayed anywhere on the site
 */
export interface ContentBlock {
  id: number;
  identifier: string;  // Unique identifier for the block
  title?: string;      // Optional title for the block
  content: string;     // The actual content
  format: 'html' | 'markdown' | 'json';  // Content format
  section?: string;    // Optional section for grouping blocks
  sortOrder?: number;  // Optional ordering within section
  active: boolean;     // Whether the block is active
  metadata?: any;      // Optional additional metadata
  createdAt?: Date;    // Creation date
  updatedAt?: Date;    // Last update date
  createdBy?: number;  // User ID who created the block
  lastUpdatedBy?: number; // User ID who last updated the block
}

/**
 * Content Block Props
 * Props for the ContentBlock component
 */
export interface ContentBlockProps {
  identifier: string;
  className?: string;
}

/**
 * Content Section
 * Represents a group of content blocks
 */
export interface ContentSection {
  id: number;
  name?: string;
  description?: string;
  blocks: ContentBlock[];
  className?: string;
  metadata?: any;
}

/**
 * Content Section Props
 * Props for the ContentSection component
 */
export interface ContentSectionProps {
  section: ContentSection;
  className?: string;
}

/**
 * Page Props
 * Props for the Page component
 */
export interface PageProps {
  slug: string;
  className?: string;
}

/**
 * Component Mapping
 * Maps identifiers to React components
 */
export interface ComponentMapping {
  [identifier: string]: React.ComponentType<any>;
}

/**
 * Page Component Types
 * Different component types that can be used in a page
 */
export type PageComponentType = 'content-block' | 'content-section' | 'hero' | 'custom';

/**
 * Page Component
 * Represents a component within a page
 */
export interface PageComponent {
  type: PageComponentType;
  identifier?: string;         // Optional identifier to reference content
  section?: string;            // Section identifier for content-section
  className?: string;          // Optional CSS class name
  title?: string;              // Optional title
  subtitle?: string;           // Optional subtitle
  content?: string;            // Optional content
  backgroundImage?: string;    // Optional background image URL
  metadata?: any;              // Optional additional metadata
  customProps?: Record<string, any>; // Custom properties for custom components
}

/**
 * Page Data
 * Represents a full page in the CMS
 */
export interface PageData {
  id: number;
  slug: string;               // URL slug for the page
  title?: string;             // Page title
  description?: string;       // SEO description
  content?: string;           // Main content (HTML)
  className?: string;         // Optional CSS class
  components?: PageComponent[]; // Page components
  blocks?: ContentBlock[];    // Related content blocks
  metadata?: any;             // Additional metadata
  active: boolean;            // Whether the page is active
  createdAt?: Date;           // Creation date
  updatedAt?: Date;           // Last update date
  publishDate?: Date;         // Publication date
  createdBy?: number;         // User ID who created the page
  lastUpdatedBy?: number;     // User ID who last updated the page
}

/**
 * Cache Statistics
 * Represents the performance metrics of the CMS cache
 */
export interface CacheStats {
  hits: number;               // Number of cache hits
  misses: number;             // Number of cache misses
  invalidations: number;      // Number of cache invalidations
  size: number;               // Current cache size (number of items)
  hitRatio: number;           // Cache hit ratio (hits / total requests)
}