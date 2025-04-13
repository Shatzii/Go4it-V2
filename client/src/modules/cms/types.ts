/**
 * CMS Module Types
 * 
 * This file defines the types used throughout the CMS module for content management
 * and dynamic page rendering.
 */

/**
 * Content Block - Basic unit of content used throughout the application
 */
export interface ContentBlock {
  id: number;
  title: string;
  content: string;
  identifier: string;
  section: string;
  sortOrder?: number;
  createdAt: Date;
  updatedAt: Date;
  lastUpdatedBy?: number;
  publishedAt?: Date;
  type?: string;
  metadata?: Record<string, any>;
  format?: 'html' | 'markdown' | 'json' | 'text';
}

/**
 * Page Component - Components that make up a page
 */
export interface PageComponent {
  id: number;
  name: string;
  type: string;
  data: any;
  sortOrder: number;
}

/**
 * Page Data - Represents a full page in the CMS
 */
export interface PageData {
  id: number;
  slug: string;
  title: string;
  description?: string;
  coverImage?: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  components: PageComponent[];
  metadata?: Record<string, any>;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
    canonicalUrl?: string;
    ogImage?: string;
  };
}

/**
 * Content Section - Group of related content blocks
 */
export interface ContentSection {
  id: string;
  name: string;
  description?: string;
  blocks: ContentBlock[];
}

/**
 * CMS Metadata - Additional information about CMS content
 */
export interface CMSMetadata {
  lastUpdated: Date;
  version: string;
  status: 'draft' | 'published' | 'archived';
}