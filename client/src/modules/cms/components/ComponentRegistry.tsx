/**
 * Component Registry
 * 
 * A registry system for dynamically mapping content identifiers to React components.
 * This allows the CMS to dynamically load and render specific components based on content type.
 */

import React from 'react';
import { ComponentMapping } from '../types';

// Default Content Block Components
import { ContentBlock } from './ContentBlock';

// Default Section Components
import { ContentSection } from './ContentSection';

// Registry of content block components
const contentComponentRegistry: ComponentMapping = {
  'default': ContentBlock,
};

// Registry of section components
const sectionComponentRegistry: ComponentMapping = {
  'default': ContentSection,
  'hero-section': ContentSection,
  'blog-section': ContentSection,
  'combines-section': ContentSection,
  'athletes-section': ContentSection,
  'scout-section': ContentSection,
  'gar-section': ContentSection
};

/**
 * Register a new content block component type
 * @param identifier The unique identifier for this component type
 * @param component The React component to render
 */
export function registerContentComponent(identifier: string, component: React.ComponentType<any>) {
  if (contentComponentRegistry[identifier]) {
    console.warn(`Component with identifier "${identifier}" already exists and will be overridden.`);
  }
  contentComponentRegistry[identifier] = component;
}

/**
 * Register a new section component type
 * @param identifier The unique identifier for this section type
 * @param component The React component to render
 */
export function registerSectionComponent(identifier: string, component: React.ComponentType<any>) {
  if (sectionComponentRegistry[identifier]) {
    console.warn(`Section component with identifier "${identifier}" already exists and will be overridden.`);
  }
  sectionComponentRegistry[identifier] = component;
}

/**
 * Get a component by its identifier
 * @param identifier The component identifier
 * @returns The React component or the default component if not found
 */
export function getContentComponent(identifier: string): React.ComponentType<any> {
  return contentComponentRegistry[identifier] || contentComponentRegistry['default'];
}

/**
 * Get a section component by its identifier
 * @param identifier The section component identifier
 * @returns The React component or the default section component if not found
 */
export function getSectionComponent(identifier: string): React.ComponentType<any> {
  return sectionComponentRegistry[identifier] || sectionComponentRegistry['default'];
}

/**
 * Dynamic Content Renderer component
 * This component renders the appropriate component based on the content identifier
 */
interface DynamicContentProps {
  identifier: string;
  content: any;
  className?: string;
}

export const DynamicContent: React.FC<DynamicContentProps> = ({ 
  identifier, 
  content,
  className 
}) => {
  const Component = getContentComponent(identifier);
  return <Component content={content} className={className} />;
};

/**
 * Dynamic Section Renderer component
 * This component renders the appropriate section component based on the section identifier
 */
interface DynamicSectionProps {
  identifier: string;
  section: any;
  className?: string;
}

export const DynamicSection: React.FC<DynamicSectionProps> = ({
  identifier,
  section,
  className
}) => {
  const SectionComponent = getSectionComponent(identifier);
  return <SectionComponent section={section} className={className} />;
};