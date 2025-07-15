/**
 * Universal One School Site Optimizer
 * 
 * Comprehensive optimization system for seamless navigation and performance
 */

window.SiteOptimizer = (function() {
  
  // Centralized school configuration
  const SCHOOL_CONFIG = {
    'primary-school': {
      path: '/schools/primary-school/',
      name: 'Primary School Heroes',
      instructor: 'Captain Knowledge',
      theme: 'superhero',
      colors: { primary: '#ff6b6b', secondary: '#ffa726' }
    },
    'secondary-school': {
      path: '/schools/secondary-school/',
      name: 'Secondary School Excellence', 
      instructor: 'Dr. Mentor',
      theme: 'academic',
      colors: { primary: '#4ecdc4', secondary: '#44a08d' }
    },
    'law-school': {
      path: '/schools/law-school/',
      name: 'The Lawyer Makers',
      instructor: 'Professor Justice',
      theme: 'professional',
      colors: { primary: '#1e40af', secondary: '#3b82f6' }
    },
    'language-school': {
      path: '/schools/language-school/',
      name: 'Global Language Academy',
      instructor: 'Professor Polyglot',
      theme: 'cultural',
      colors: { primary: '#96ceb4', secondary: '#85c1e9' }
    }
  };

  // Legacy path mappings for seamless migration
  const LEGACY_MAPPINGS = {
    '/primary': '/schools/primary-school/',
    '/secondary': '/schools/secondary-school/',
    '/lawyer-makers': '/schools/law-school/',
    '/language': '/schools/language-school/',
    '/schools/lawyer-makers': '/schools/law-school/',
    '/schools/lawyer-makers/': '/schools/law-school/'
  };

  /**
   * Fix all broken links on the page
   */
  function optimizeLinks() {
    const links = document.querySelectorAll('a[href]');
    
    links.forEach(link => {
      const href = link.getAttribute('href');
      
      // Skip external links and anchors
      if (!href || href.startsWith('http') || href.startsWith('#') || 
          href.startsWith('mailto:') || href.startsWith('tel:')) {
        return;
      }

      // Apply legacy mappings
      if (LEGACY_MAPPINGS[href]) {
        link.setAttribute('href', LEGACY_MAPPINGS[href]);
        console.log(`Fixed legacy link: ${href} → ${LEGACY_MAPPINGS[href]}`);
        return;
      }

      // Fix school-related links
      for (const [schoolId, config] of Object.entries(SCHOOL_CONFIG)) {
        // Pattern matching for various school link formats
        const patterns = [
          new RegExp(`/${schoolId}(?:/|$)`),
          new RegExp(`/schools?/${schoolId}(?:/|$)`),
          new RegExp(`/${schoolId.replace('-', '-?')}(?:/|$)`)
        ];

        for (const pattern of patterns) {
          if (pattern.test(href) && href !== config.path) {
            link.setAttribute('href', config.path);
            console.log(`Fixed school link: ${href} → ${config.path}`);
            return;
          }
        }
      }
    });
  }

  /**
   * Optimize page performance
   */
  function optimizePerformance() {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));

    // Preload critical school pages
    Object.values(SCHOOL_CONFIG).forEach(school => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = school.path;
      document.head.appendChild(link);
    });
  }

  /**
   * Enhanced navigation highlighting
   */
  function optimizeNavigation() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('nav a[href], .navigation a[href]');
    
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      link.classList.remove('active');
      
      // Exact match
      if (href === currentPath) {
        link.classList.add('active');
        return;
      }
      
      // School page matching
      for (const [schoolId, config] of Object.entries(SCHOOL_CONFIG)) {
        if (currentPath.startsWith(config.path) && href === config.path) {
          link.classList.add('active');
          return;
        }
      }
      
      // Partial match for nested pages
      if (href !== '/' && currentPath.startsWith(href)) {
        link.classList.add('active');
      }
    });
  }

  /**
   * Create breadcrumb navigation
   */
  function createBreadcrumbs() {
    const currentPath = window.location.pathname;
    const pathSegments = currentPath.split('/').filter(segment => segment);
    
    if (pathSegments.length <= 1) return; // No breadcrumbs for home page
    
    const breadcrumbContainer = document.createElement('nav');
    breadcrumbContainer.className = 'breadcrumb-nav';
    breadcrumbContainer.style.cssText = `
      padding: 1rem 0;
      font-size: 0.9rem;
      color: #666;
      border-bottom: 1px solid #eee;
    `;
    
    let breadcrumbHTML = '<a href="/" style="color: #667eea; text-decoration: none;">Home</a>';
    let currentPathBuilder = '';
    
    pathSegments.forEach((segment, index) => {
      currentPathBuilder += '/' + segment;
      
      // Get friendly name for school pages
      const schoolConfig = Object.values(SCHOOL_CONFIG).find(config => 
        config.path === currentPathBuilder + '/'
      );
      
      const displayName = schoolConfig ? schoolConfig.name : 
        segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      if (index === pathSegments.length - 1) {
        breadcrumbHTML += ` <span style="margin: 0 0.5rem;">/</span> <span>${displayName}</span>`;
      } else {
        breadcrumbHTML += ` <span style="margin: 0 0.5rem;">/</span> <a href="${currentPathBuilder}/" style="color: #667eea; text-decoration: none;">${displayName}</a>`;
      }
    });
    
    breadcrumbContainer.innerHTML = breadcrumbHTML;
    
    // Insert after header
    const header = document.querySelector('header');
    if (header && header.nextSibling) {
      header.parentNode.insertBefore(breadcrumbContainer, header.nextSibling);
    }
  }

  /**
   * Handle 404 errors gracefully
   */
  function handleNotFound() {
    if (document.title.includes('404') || document.body.textContent.includes('Not Found')) {
      const currentPath = window.location.pathname;
      
      // Check if this might be a legacy school path
      for (const [legacyPath, newPath] of Object.entries(LEGACY_MAPPINGS)) {
        if (currentPath.includes(legacyPath.substring(1))) {
          window.location.replace(newPath);
          return;
        }
      }
      
      // Suggest alternative pages
      console.log('Page not found, suggesting alternatives...');
    }
  }

  /**
   * Smooth scrolling for anchor links
   */
  function enableSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  /**
   * Initialize all optimizations
   */
  function init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    optimizeLinks();
    optimizeNavigation();
    optimizePerformance();
    createBreadcrumbs();
    handleNotFound();
    enableSmoothScrolling();

    // Re-optimize after dynamic content loads
    document.addEventListener('includes-loaded', () => {
      setTimeout(() => {
        optimizeLinks();
        optimizeNavigation();
      }, 100);
    });

    console.log('Site optimization complete');
  }

  // Auto-initialize
  init();

  // Public API
  return {
    optimizeLinks,
    optimizeNavigation,
    optimizePerformance,
    createBreadcrumbs,
    getSchoolConfig: (schoolId) => SCHOOL_CONFIG[schoolId],
    getAllSchools: () => SCHOOL_CONFIG
  };

})();

// Load optimization on every page
if (typeof window !== 'undefined') {
  window.SiteOptimizer;
}