/**
 * Browser polyfills for server-side rendering
 * Prevents "window is not defined" and "self is not defined" errors during build
 */

// Global polyfills for SSR compatibility
if (typeof window === 'undefined') {
  // Mock window object
  global.window = {
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
    location: {
      href: 'http://localhost:3000',
      protocol: 'http:',
      host: 'localhost:3000',
      pathname: '/',
      search: '',
      hash: '',
    },
    navigator: {
      userAgent: 'node',
      platform: 'node',
    },
    document: {
      createElement: () => ({
        addEventListener: () => {},
        removeEventListener: () => {},
        setAttribute: () => {},
        getAttribute: () => null,
        style: {},
      }),
      addEventListener: () => {},
      removeEventListener: () => {},
      body: {
        appendChild: () => {},
        removeChild: () => {},
      },
      head: {
        appendChild: () => {},
        removeChild: () => {},
      },
    },
    localStorage: {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
    },
    sessionStorage: {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
    },
    requestAnimationFrame: (fn) => setTimeout(fn, 16),
    cancelAnimationFrame: (id) => clearTimeout(id),
    WebGLRenderingContext: function () {},
    WebGL2RenderingContext: function () {},
    HTMLCanvasElement: function () {},
    CanvasRenderingContext2D: function () {},
    ImageData: function () {},
    Image: function () {},
    fetch: () => Promise.resolve({ ok: true, json: () => Promise.resolve({}) }),
  };

  // Mock self reference
  global.self = global.window;

  // Mock document
  global.document = global.window.document;

  // Mock navigator
  global.navigator = global.window.navigator;

  // Mock WebGL contexts for TensorFlow.js
  global.WebGLRenderingContext = global.window.WebGLRenderingContext;
  global.WebGL2RenderingContext = global.window.WebGL2RenderingContext;

  // Mock Canvas elements
  global.HTMLCanvasElement = global.window.HTMLCanvasElement;
  global.CanvasRenderingContext2D = global.window.CanvasRenderingContext2D;
  global.ImageData = global.window.ImageData;
  global.Image = global.window.Image;
}

module.exports = {};
