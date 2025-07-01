import React from 'react';
import { Block } from '../editor/VisualBlockEditor';
import { SiteStructure } from '../editor/SiteStructureManager';

// Color scheme for neurodivergent-friendly design
const colorScheme = {
  primary: '#4C2C8A', // Deep purple 
  secondary: '#FFB6C1', // Light pink
  adhd: '#FF8800', // High contrast orange
  autism: '#00AAFF', // Calming blue
  dyslexia: '#4CAF50', // Growth-oriented green
  background: {
    light: '#F9F7FF', // Very light purple
    accent1: '#FFF5E6', // Light orange
    accent2: '#E6F7FF', // Light blue
    accent3: '#E8F5E9', // Light green
  },
  text: {
    dark: '#333333',
    light: '#FFFFFF',
    muted: '#666666'
  }
};

// Complete site structure for Neurodivergent School for Superheroes
export const neurodivergentSchoolStructure: SiteStructure = {
  pages: [
    // Main pages
    {
      id: 'home',
      title: 'Home',
      slug: 'home',
      isHomePage: true,
      isPublished: true
    },
    {
      id: 'about',
      title: 'About Our School',
      slug: 'about',
      isPublished: true
    },
    {
      id: 'programs',
      title: 'Superhero Programs',
      slug: 'programs',
      isPublished: true
    },
    {
      id: 'resources',
      title: 'Resources',
      slug: 'resources',
      isPublished: true
    },
    // Elementary School (K-6)
    {
      id: 'elementary',
      title: 'Elementary School (K-6)',
      slug: 'elementary',
      isPublished: true
    },
    {
      id: 'elementary-math',
      title: 'Math Superpowers',
      slug: 'elementary/math',
      parent: 'elementary',
      isPublished: true
    },
    {
      id: 'elementary-science',
      title: 'Science Adventures',
      slug: 'elementary/science',
      parent: 'elementary',
      isPublished: true
    },
    {
      id: 'elementary-reading',
      title: 'Reading Heroes',
      slug: 'elementary/reading',
      parent: 'elementary',
      isPublished: true
    },
    // Middle & High School (7-12)
    {
      id: 'secondary',
      title: 'Middle & High School (7-12)',
      slug: 'secondary',
      isPublished: true
    },
    {
      id: 'secondary-math',
      title: 'Advanced Math Powers',
      slug: 'secondary/math',
      parent: 'secondary',
      isPublished: true
    },
    {
      id: 'secondary-science',
      title: 'Science & Technology',
      slug: 'secondary/science',
      parent: 'secondary',
      isPublished: true
    },
    {
      id: 'secondary-humanities',
      title: 'Humanities & Expression',
      slug: 'secondary/humanities',
      parent: 'secondary',
      isPublished: true
    },
    // Special Programs
    {
      id: 'focus-force',
      title: 'Focus Force Academy (ADHD)',
      slug: 'programs/focus-force',
      parent: 'programs',
      isPublished: true
    },
    {
      id: 'pattern-masters',
      title: 'Pattern Masters Institute (Autism)',
      slug: 'programs/pattern-masters',
      parent: 'programs',
      isPublished: true
    },
    {
      id: 'word-wizards',
      title: 'Word Wizards Guild (Dyslexia)',
      slug: 'programs/word-wizards',
      parent: 'programs',
      isPublished: true
    },
    // Resources
    {
      id: 'student-resources',
      title: 'Student Resources',
      slug: 'resources/students',
      parent: 'resources',
      isPublished: true
    },
    {
      id: 'family-resources',
      title: 'Family Resources',
      slug: 'resources/families',
      parent: 'resources',
      isPublished: true
    },
    {
      id: 'educator-resources',
      title: 'Educator Resources',
      slug: 'resources/educators',
      parent: 'resources',
      isPublished: true
    }
  ],
  navigation: {
    mainMenu: [
      {
        id: 'nav-home',
        label: 'Home',
        link: '/'
      },
      {
        id: 'nav-about',
        label: 'About Us',
        link: '/about'
      },
      {
        id: 'nav-programs',
        label: 'Programs',
        link: '/programs',
        children: [
          {
            id: 'nav-elementary',
            label: 'Elementary (K-6)',
            link: '/elementary'
          },
          {
            id: 'nav-secondary',
            label: 'Middle & High (7-12)',
            link: '/secondary'
          },
          {
            id: 'nav-focus-force',
            label: 'Focus Force Academy',
            link: '/programs/focus-force'
          },
          {
            id: 'nav-pattern-masters',
            label: 'Pattern Masters Institute',
            link: '/programs/pattern-masters'
          },
          {
            id: 'nav-word-wizards',
            label: 'Word Wizards Guild',
            link: '/programs/word-wizards'
          }
        ]
      },
      {
        id: 'nav-resources',
        label: 'Resources',
        link: '/resources',
        children: [
          {
            id: 'nav-student-resources',
            label: 'For Students',
            link: '/resources/students'
          },
          {
            id: 'nav-family-resources',
            label: 'For Families',
            link: '/resources/families'
          },
          {
            id: 'nav-educator-resources',
            label: 'For Educators',
            link: '/resources/educators'
          }
        ]
      }
    ],
    footerMenu: [
      {
        id: 'footer-privacy',
        label: 'Privacy Policy',
        link: '/privacy'
      },
      {
        id: 'footer-terms',
        label: 'Terms of Service',
        link: '/terms'
      },
      {
        id: 'footer-contact',
        label: 'Contact Us',
        link: '/contact'
      },
      {
        id: 'footer-sitemap',
        label: 'Site Map',
        link: '/sitemap'
      }
    ]
  },
  settings: {
    siteName: 'Neurodivergent School for Superheroes',
    theme: 'neurodivergent',
    logo: '/assets/logo.svg',
    favicon: '/assets/favicon.ico'
  }
};

// Function to convert block templates to Rhythm language format
export const convertToRhythm = (blocks: Block[], pageTitle: string, section: string = 'content'): string => {
  let rhythmCode = `@extends("layout/page.rhy")\n\n`;
  rhythmCode += `@section("title") ${pageTitle} @endsection\n\n`;
  rhythmCode += `@section("${section}")\n`;
  
  for (const block of blocks) {
    switch (block.type) {
      case 'heading':
        const level = block.settings?.level || 2;
        const align = block.settings?.align || 'left';
        const color = block.settings?.color || '';
        
        rhythmCode += `  <h${level}${color ? ` style="color: ${color}; text-align: ${align};"` : ` style="text-align: ${align};"`}>${block.content}</h${level}>\n`;
        break;
        
      case 'paragraph':
        const pAlign = block.settings?.align || 'left';
        const pColor = block.settings?.color || '';
        const pSize = block.settings?.size || 'medium';
        const pStyle = block.settings?.style || 'normal';
        
        let pStyleAttr = `text-align: ${pAlign};`;
        if (pColor) pStyleAttr += ` color: ${pColor};`;
        if (pSize === 'small') pStyleAttr += ' font-size: 0.875rem;';
        if (pSize === 'large') pStyleAttr += ' font-size: 1.25rem;';
        if (pStyle === 'italic') pStyleAttr += ' font-style: italic;';
        if (pStyle === 'code') pStyleAttr += ' font-family: monospace; background-color: #f5f5f5; padding: 0.25rem;';
        
        rhythmCode += `  <p style="${pStyleAttr}">${block.content}</p>\n`;
        break;
        
      case 'image':
        const imgWidth = block.settings?.width || '100%';
        const imgAlign = block.settings?.align || 'center';
        const imgAlt = block.settings?.alt || '';
        const imgCaption = block.settings?.caption || '';
        
        let imgClass = '';
        if (block.settings?.rounded) imgClass += ' rounded';
        if (block.settings?.shadow) imgClass += ' shadow';
        if (block.settings?.border) imgClass += ' border';
        
        rhythmCode += `  <figure style="text-align: ${imgAlign};">\n`;
        rhythmCode += `    <img src="${block.content}" alt="${imgAlt}" style="width: ${imgWidth};"${imgClass ? ` class="${imgClass}"` : ''} />\n`;
        if (imgCaption) {
          rhythmCode += `    <figcaption style="text-align: ${imgAlign}; font-size: 0.875rem; color: #666;">${imgCaption}</figcaption>\n`;
        }
        rhythmCode += `  </figure>\n`;
        break;
        
      case 'list':
        const listStyle = block.settings?.style || 'unordered';
        const listContent = Array.isArray(block.content) ? block.content : [block.content];
        
        rhythmCode += `  <${listStyle === 'ordered' ? 'ol' : 'ul'}>\n`;
        for (const item of listContent) {
          rhythmCode += `    <li>${item}</li>\n`;
        }
        rhythmCode += `  </${listStyle === 'ordered' ? 'ol' : 'ul'}>\n`;
        break;
        
      case 'layout':
        const layoutContent = Array.isArray(block.content) ? block.content : [block.content];
        const columns = block.settings?.columns || 1;
        const gap = block.settings?.gap || 'medium';
        const padding = block.settings?.padding || 'medium';
        const bgColor = block.settings?.background || '';
        
        let gapSize, paddingSize;
        switch (gap) {
          case 'small': gapSize = '0.5rem'; break;
          case 'medium': gapSize = '1rem'; break;
          case 'large': gapSize = '2rem'; break;
          default: gapSize = '1rem';
        }
        
        switch (padding) {
          case 'small': paddingSize = '0.5rem'; break;
          case 'medium': paddingSize = '1rem'; break;
          case 'large': paddingSize = '2rem'; break;
          default: paddingSize = '1rem';
        }
        
        const layoutStyle = `display: grid; grid-template-columns: repeat(${columns}, 1fr); gap: ${gapSize}; padding: ${paddingSize};${bgColor ? ` background-color: ${bgColor};` : ''}${block.settings?.rounded ? ' border-radius: 0.5rem;' : ''}`;
        
        rhythmCode += `  <div style="${layoutStyle}">\n`;
        
        // Process nested blocks
        for (const item of layoutContent) {
          if (typeof item === 'object' && item.type) {
            // Create a temporary container for the nested block
            const nestedBlock = convertToRhythm([item], pageTitle, '').split('\n');
            
            // Extract just the content part (remove @extends and @section)
            const contentSection = nestedBlock.filter(line => 
              !line.includes('@extends') && 
              !line.includes('@section') && 
              !line.includes('@endsection')
            );
            
            // Add the nested content with padding
            contentSection.forEach(line => {
              rhythmCode += `    ${line}\n`;
            });
          }
        }
        
        rhythmCode += `  </div>\n`;
        break;
        
      case 'button':
        const btnAlign = block.settings?.align || 'left';
        const btnStyle = block.settings?.style || 'primary';
        const btnSize = block.settings?.size || 'medium';
        const btnColor = block.settings?.color || '';
        const btnBg = block.settings?.background || '';
        
        let btnClass = btnStyle === 'primary' ? 'btn-primary' : 'btn-outline';
        if (btnSize === 'small') btnClass += ' btn-sm';
        if (btnSize === 'large') btnClass += ' btn-lg';
        
        let btnStyleAttr = `text-align: ${btnAlign};`;
        if (btnColor) btnStyleAttr += ` color: ${btnColor};`;
        if (btnBg) btnStyleAttr += ` background-color: ${btnBg};`;
        
        rhythmCode += `  <div style="${btnStyleAttr}">\n`;
        rhythmCode += `    <button class="${btnClass}">${block.content}</button>\n`;
        rhythmCode += `  </div>\n`;
        break;
        
      default:
        // For unknown block types, add a comment
        rhythmCode += `  <!-- Unsupported block type: ${block.type} -->\n`;
    }
  }
  
  rhythmCode += `@endsection\n`;
  
  return rhythmCode;
};

// Function to generate Rhythm code for specific pages in the neurodivergent school structure
export const generateRhythmFromTemplate = (
  pageId: string,
  blocks: Block[],
  structure: SiteStructure = neurodivergentSchoolStructure
): { rhythmCode: string, filePath: string } => {
  // Find the page in the structure
  const page = structure.pages.find(p => p.id === pageId);
  if (!page) {
    throw new Error(`Page with ID "${pageId}" not found in site structure`);
  }
  
  // Generate Rhythm code
  const rhythmCode = convertToRhythm(blocks, page.title);
  
  // Determine file path based on page slug
  let filePath = page.slug;
  if (filePath === 'home') filePath = 'index';
  
  // Add file extension
  filePath = `schools/neurodivergent/${filePath}.rhy`;
  
  return { rhythmCode, filePath };
};

// Generate site map in Rhythm format
export const generateSiteMap = (structure: SiteStructure = neurodivergentSchoolStructure): string => {
  let rhythmCode = `@extends("layout/page.rhy")\n\n`;
  rhythmCode += `@section("title") Site Map - ${structure.settings.siteName} @endsection\n\n`;
  rhythmCode += `@section("content")\n`;
  rhythmCode += `  <h1>Site Map</h1>\n`;
  rhythmCode += `  <p>A complete map of all pages on our website.</p>\n\n`;
  
  // Helper function to render a page and its children
  const renderPage = (page: any, level: number = 0) => {
    const indent = '  '.repeat(level + 1);
    rhythmCode += `${indent}<div class="sitemap-item level-${level}">\n`;
    
    // Link to the page
    let pageLink = page.slug;
    if (pageLink === 'home') pageLink = '';
    rhythmCode += `${indent}  <a href="/${pageLink}" class="sitemap-link">${page.title}</a>\n`;
    
    // Find children
    const children = structure.pages.filter(p => p.parent === page.id);
    
    if (children.length > 0) {
      rhythmCode += `${indent}  <div class="sitemap-children">\n`;
      children.forEach(child => {
        renderPage(child, level + 1);
      });
      rhythmCode += `${indent}  </div>\n`;
    }
    
    rhythmCode += `${indent}</div>\n`;
  };
  
  // Get root pages (no parent)
  const rootPages = structure.pages.filter(p => !p.parent);
  
  // Render each root page and its children
  rootPages.forEach(page => {
    renderPage(page);
  });
  
  rhythmCode += `@endsection\n`;
  
  return rhythmCode;
};

// Generate navigation in Rhythm format
export const generateNavigation = (structure: SiteStructure = neurodivergentSchoolStructure): string => {
  let rhythmCode = `@extends("layout/navigation.rhy")\n\n`;
  rhythmCode += `@section("main_nav")\n`;
  
  // Main menu
  structure.navigation.mainMenu.forEach(item => {
    rhythmCode += `  <li class="nav-item">\n`;
    
    if (item.children && item.children.length > 0) {
      rhythmCode += `    <a href="${item.link}" class="nav-link has-dropdown">${item.label}</a>\n`;
      rhythmCode += `    <ul class="dropdown-menu">\n`;
      
      item.children.forEach(child => {
        rhythmCode += `      <li class="dropdown-item">\n`;
        rhythmCode += `        <a href="${child.link}" class="dropdown-link">${child.label}</a>\n`;
        rhythmCode += `      </li>\n`;
      });
      
      rhythmCode += `    </ul>\n`;
    } else {
      rhythmCode += `    <a href="${item.link}" class="nav-link">${item.label}</a>\n`;
    }
    
    rhythmCode += `  </li>\n`;
  });
  
  rhythmCode += `@endsection\n\n`;
  
  // Footer menu
  rhythmCode += `@section("footer_nav")\n`;
  
  structure.navigation.footerMenu?.forEach(item => {
    rhythmCode += `  <li class="footer-item">\n`;
    rhythmCode += `    <a href="${item.link}" class="footer-link">${item.label}</a>\n`;
    rhythmCode += `  </li>\n`;
  });
  
  rhythmCode += `@endsection\n`;
  
  return rhythmCode;
};

// The component names align with both Rhythm syntax and our structure
export const schoolComponents = {
  // Educational components
  'lesson-card': 'Component for displaying lesson overview with title, grade level, and subject',
  'concept-map': 'Visual diagram showing relationships between concepts',
  'quiz-generator': 'Interactive quiz based on lesson content',
  'visual-timer': 'Countdown timer with visual representation',
  'sensory-break': 'Guided sensory break with calming animations',
  'fidget-tool': 'Interactive fidget tool for focus',
  
  // Neurodivergent support components
  'word-reader': 'Text-to-speech component for reading support',
  'color-overlay': 'Colored overlay for reading (helps with visual stress)',
  'visual-schedule': 'Visual schedule with icons and timers',
  'emotion-meter': 'Visual tool for identifying emotional state',
  'focus-tracker': 'Tool to help monitor attention and focus',
  'success-celebration': 'Animation celebrating achievements'
};

// Export the structure and templates for use in the application
export default {
  structure: neurodivergentSchoolStructure,
  convertToRhythm,
  generateRhythmFromTemplate,
  generateSiteMap,
  generateNavigation,
  components: schoolComponents,
  colorScheme
};