/**
 * Browser compatibility utilities for feature detection and polyfills
 * These utilities use feature detection rather than user agent sniffing
 */

/**
 * Detect WebP support for image optimization
 * @returns boolean indicating browser support for WebP
 */
export function supportsWebP(): boolean {
  try {
    const canvas = document.createElement('canvas');
    if (canvas.getContext && canvas.getContext('2d')) {
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    return false;
  } catch (e) {
    return false;
  }
}

/**
 * Detect CSS Grid support for layout fallbacks
 * @returns boolean indicating browser support for CSS Grid
 */
export function supportsGrid(): boolean {
  try {
    return window.CSS && CSS.supports('(display: grid)');
  } catch (e) {
    return false;
  }
}

/**
 * Detect CSS Flex Gap property for spacing fallbacks
 * @returns boolean indicating browser support for flex gap
 */
export function supportsFlexGap(): boolean {
  try {
    // Create test elements
    const flex = document.createElement('div');
    flex.style.display = 'flex';
    flex.style.flexDirection = 'column';
    flex.style.rowGap = '1px';
    
    // Check computed style to see if row gap is supported
    flex.appendChild(document.createElement('div'));
    flex.appendChild(document.createElement('div'));
    document.body.appendChild(flex);
    
    const isSupported = flex.scrollHeight === 1;
    document.body.removeChild(flex);
    
    return isSupported;
  } catch (e) {
    return false;
  }
}

/**
 * Detect touch device support for interaction adjustments
 * @returns boolean indicating device has touch capability
 */
export function isTouchDevice(): boolean {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * Detect passive event listener support
 * @returns boolean indicating browser support for passive event listeners
 */
export function supportsPassiveEvents(): boolean {
  let supportsPassive = false;
  try {
    const opts = Object.defineProperty({}, 'passive', {
      get: function() {
        supportsPassive = true;
        return true;
      }
    });
    window.addEventListener('testPassive', null as any, opts);
    window.removeEventListener('testPassive', null as any, opts);
  } catch (e) {
    // Silently fail
  }
  return supportsPassive;
}

/**
 * Get device type for specific UI adjustments
 * @returns string indicating device type: 'mobile', 'tablet', or 'desktop'
 */
export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  const width = window.innerWidth;
  if (width < 768) {
    return 'mobile';
  } else if (width < 1024) {
    return 'tablet';
  } else {
    return 'desktop';
  }
}

/**
 * Apply browser compatibility classes to the document root
 * These can be used for CSS targeting specific browsers/features
 */
export function applyBrowserCompatibilityClasses(): void {
  const html = document.documentElement;
  
  // WebP support
  if (supportsWebP()) {
    html.classList.add('webp-support');
  } else {
    html.classList.add('no-webp-support');
  }
  
  // Grid support
  if (supportsGrid()) {
    html.classList.add('grid-support');
  } else {
    html.classList.add('no-grid-support');
  }
  
  // Flex gap support
  if (supportsFlexGap()) {
    html.classList.add('flex-gap-support');
  } else {
    html.classList.add('no-flex-gap-support');
  }
  
  // Touch device
  if (isTouchDevice()) {
    html.classList.add('touch-device');
  } else {
    html.classList.add('no-touch-device');
  }
  
  // Device type
  html.classList.add(`device-${getDeviceType()}`);
  
  // Low memory detection (experimental)
  if ('deviceMemory' in navigator) {
    const memory = (navigator as any).deviceMemory;
    if (memory && memory < 4) {
      html.classList.add('low-memory-device');
    }
  }
  
  // Reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    html.classList.add('prefers-reduced-motion');
  }
}

/**
 * Initialize all browser compatibility checks and apply necessary polyfills
 * Call this function once at app initialization
 */
export function initBrowserCompatibility(): void {
  // Apply compatibility classes
  applyBrowserCompatibilityClasses();
  
  // Add event listener for viewport resize to update device type
  let resizeTimeout: NodeJS.Timeout;
  window.addEventListener('resize', () => {
    // Debounce resize events
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const html = document.documentElement;
      // Remove old device type classes
      html.classList.remove('device-mobile', 'device-tablet', 'device-desktop');
      // Add current device type class
      html.classList.add(`device-${getDeviceType()}`);
    }, 250);
  }, supportsPassiveEvents() ? { passive: true } : false);
  
  // Log detected features for debugging
  if (process.env.NODE_ENV === 'development') {
    console.log('Browser compatibility features detected:', {
      webp: supportsWebP(),
      grid: supportsGrid(),
      flexGap: supportsFlexGap(),
      touchDevice: isTouchDevice(),
      passiveEvents: supportsPassiveEvents(),
      deviceType: getDeviceType(),
    });
  }
}