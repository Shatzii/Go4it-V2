/**
 * CMS Module Types
 * 
 * Core type definitions for the CMS module that powers the dynamic content
 * management across the Go4It Sports platform.
 */

export interface ContentMetadata {
  iconName?: string;
  backgroundColor?: string;
  layout?: 'default' | 'hero' | 'card' | 'grid' | 'list';
  priority?: number;
  isHidden?: boolean;
  position?: 'left' | 'right' | 'center' | 'full';
  imagePosition?: 'left' | 'right' | 'top' | 'bottom';
  additionalClasses?: string;
  animation?: string;
  [key: string]: any; // For additional custom metadata
}

export interface ContentBlock {
  id: number;
  identifier: string; 
  title: string;
  content: string;
  section: string;
  order: number | null;
  active: boolean | null;
  lastUpdated: string | null;
  lastUpdatedBy: number | null;
  metadata: ContentMetadata | null;
}

export interface ContentSection {
  id: string;
  name: string;
  description?: string;
  blocks: ContentBlock[];
}

export interface PageLayout {
  id: string;
  name: string;
  sections: string[]; // Section identifiers
  template: string;
  isDefault?: boolean;
}

export interface PageData {
  slug: string;
  title: string;
  description?: string;
  layout: PageLayout;
  sections: ContentSection[];
  metadata?: {
    seo?: {
      title?: string;
      description?: string;
      keywords?: string[];
      ogImage?: string;
    },
    [key: string]: any;
  };
}

export type ContentType = 'block' | 'section' | 'page' | 'layout' | 'component';

export interface CmsComponentProps {
  content: ContentBlock;
  className?: string;
}

export interface CmsSectionProps {
  section: ContentSection;
  className?: string;
}

export interface ContentComponentMapping {
  [identifier: string]: React.ComponentType<CmsComponentProps>;
}

export interface SectionComponentMapping {
  [identifier: string]: React.ComponentType<CmsSectionProps>;
}