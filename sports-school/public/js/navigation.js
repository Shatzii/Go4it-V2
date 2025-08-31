/**
 * ShatziiOS Navigation System
 *
 * This script handles global navigation functionality for the ShatziiOS platform.
 */

// Initialize the global navigation object
window.ShatziiNavigation = (function () {
  /**
   * Map of school identifiers to their full names and paths
   * Optimized for schools.shatzii.com domain
   */
  const SCHOOLS = {
    'primary-school': {
      name: 'Primary School Heroes',
      path: '/schools/primary-school',
    },
    'secondary-school': {
      name: 'Secondary School Excellence',
      path: '/schools/secondary-school',
    },
    'law-school': {
      name: 'The Lawyer Makers',
      path: '/schools/law-school',
    },
    'language-school': {
      name: 'Global Language Academy',
      path: '/schools/language-school',
    },
  };

  /**
   * Map of common pages that might be referenced across the site
   */
  const COMMON_PAGES = {
    dashboard: '/dashboard',
    curriculum: '/curriculum',
    settings: '/settings',
    help: '/help',
    login: '/login',
    register: '/register',
    home: '/',
  };

  /**
   * Fix broken links throughout the page
   */
  function fixBrokenLinks() {
    // Get all links on the page
    const links = document.querySelectorAll('a[href]');

    links.forEach((link) => {
      const href = link.getAttribute('href');

      // Skip external links and anchors
      if (
        href.startsWith('http') ||
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:')
      ) {
        return;
      }

      // Check for school references in formats like "/[name]" or "/school/[name]" or "/[name]-school"
      // Optimized for schools.shatzii.com domain
      for (const [schoolId, schoolInfo] of Object.entries(SCHOOLS)) {
        // Pattern 1: /name directly (for schools.shatzii.com)
        if (href === `/${schoolId}` || href.match(new RegExp(`/${schoolId}(?:/|$)`))) {
          if (href !== schoolInfo.path) {
            console.log(`Fixing school link: ${href} → ${schoolInfo.path}`);
            link.setAttribute('href', schoolInfo.path);
          }
          return;
        }

        // Pattern 2: /school/name or /schools/name (for backward compatibility)
        if (href.match(new RegExp(`/schools?/${schoolId}(?:/|$)`))) {
          if (href !== schoolInfo.path) {
            console.log(`Fixing school link: ${href} → ${schoolInfo.path}`);
            link.setAttribute('href', schoolInfo.path);
          }
          return;
        }

        // Pattern 3: /name-school
        if (href.match(new RegExp(`/${schoolId}-schools?(?:/|$)`))) {
          console.log(`Fixing school link: ${href} → ${schoolInfo.path}`);
          link.setAttribute('href', schoolInfo.path);
          return;
        }
      }

      // Check for common page references like "/dashboard", "/curriculum", etc.
      for (const [pageId, pagePath] of Object.entries(COMMON_PAGES)) {
        if (href === `/${pageId}` && href !== pagePath) {
          console.log(`Fixing common page link: ${href} → ${pagePath}`);
          link.setAttribute('href', pagePath);
          return;
        }
      }
    });
  }

  /**
   * Highlight the current page in the navigation
   */
  function highlightCurrentPage() {
    const currentPath = window.location.pathname;

    // Find all navigation links
    const navLinks = document.querySelectorAll('nav a[href]');

    navLinks.forEach((link) => {
      const href = link.getAttribute('href');

      // If the link matches the current path, add the active class
      if (href === currentPath || (currentPath.startsWith(href) && href !== '/')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  /**
   * Initialize the navigation system
   */
  function init() {
    fixBrokenLinks();

    // Set up the navigation highlighting when the page loads
    document.addEventListener('DOMContentLoaded', highlightCurrentPage);

    // Also set up the navigation highlighting after includes are loaded
    document.addEventListener('includes-loaded', highlightCurrentPage);
  }

  // Run initialization
  init();

  // Return public methods
  return {
    fixBrokenLinks: fixBrokenLinks,
    highlightCurrentPage: highlightCurrentPage,
  };
})();
