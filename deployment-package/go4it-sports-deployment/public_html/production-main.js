/**
 * Go4It Sports Main Application Entry
 * Production build for https://go4itsports.org
 * 
 * This file serves as the main entry point for the Go4It Sports application.
 * It handles initialization, routing, and core application functionality.
 */

// Import AI modules
import agent from './agent.js';
import aiAssist from './ai_assist.js';
import upload from './upload.js';
import voice from './voice.js';

// Application configuration
const config = {
  apiBase: '/api',
  wsUrl: (window.location.protocol === 'https:' ? 'wss:' : 'ws:') + '//' + window.location.host + '/ws',
  assetBase: '/assets',
  uploadBase: '/uploads',
  version: '1.0.1',
  environment: 'production'
};

// Application state
const state = {
  initialized: false,
  authenticated: false,
  user: null,
  wsConnection: null,
  routes: new Map(),
  currentRoute: '/'
};

/**
 * Initialize the application
 */
function initApp() {
  console.log(`Go4It Sports Platform v${config.version} initializing...`);
  
  // Initialize AI modules
  initializeAIModules();
  
  // Set up WebSocket connection
  initializeWebSocket();
  
  // Check authentication status
  checkAuthStatus();
  
  // Set up routing
  setupRouting();
  
  // Listen for server status
  document.addEventListener('server-ready', handleServerReady);
  document.addEventListener('server-error', handleServerError);
  
  // Mark as initialized
  state.initialized = true;
  document.documentElement.classList.add('app-initialized');
  
  console.log('Go4It Sports Platform initialized successfully');
}

/**
 * Initialize AI modules
 */
function initializeAIModules() {
  try {
    agent.init(config);
    aiAssist.init(config);
    upload.init(config);
    voice.init(config);
    console.log('AI modules initialized');
  } catch (error) {
    console.error('Error initializing AI modules:', error);
  }
}

/**
 * Initialize WebSocket connection
 */
function initializeWebSocket() {
  try {
    const socket = new WebSocket(config.wsUrl);
    
    socket.addEventListener('open', () => {
      console.log('WebSocket connection established');
      state.wsConnection = socket;
      
      // Send initial ping
      socket.send(JSON.stringify({ type: 'ping', time: Date.now() }));
    });
    
    socket.addEventListener('message', (event) => {
      try {
        const message = JSON.parse(event.data);
        handleWebSocketMessage(message);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });
    
    socket.addEventListener('close', () => {
      console.log('WebSocket connection closed');
      state.wsConnection = null;
      
      // Attempt to reconnect after delay
      setTimeout(initializeWebSocket, 5000);
    });
    
    socket.addEventListener('error', (error) => {
      console.error('WebSocket error:', error);
    });
  } catch (error) {
    console.error('Error establishing WebSocket connection:', error);
  }
}

/**
 * Handle WebSocket messages
 * @param {Object} message - The parsed WebSocket message
 */
function handleWebSocketMessage(message) {
  switch (message.type) {
    case 'welcome':
      console.log('WebSocket welcome message:', message.message);
      break;
    case 'pong':
      // Keep-alive response received
      setTimeout(() => {
        if (state.wsConnection && state.wsConnection.readyState === WebSocket.OPEN) {
          state.wsConnection.send(JSON.stringify({ type: 'ping', time: Date.now() }));
        }
      }, 30000); // Send ping every 30 seconds
      break;
    default:
      console.log('Received WebSocket message:', message);
      // Handle other message types
      break;
  }
}

/**
 * Check authentication status
 */
function checkAuthStatus() {
  fetch(`${config.apiBase}/auth/me`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      if (response.status === 401) {
        state.authenticated = false;
        state.user = null;
        return null;
      }
      return response.json();
    })
    .then(user => {
      if (user) {
        state.authenticated = true;
        state.user = user;
        document.dispatchEvent(new CustomEvent('auth-changed', { detail: { authenticated: true, user } }));
      } else {
        document.dispatchEvent(new CustomEvent('auth-changed', { detail: { authenticated: false } }));
      }
    })
    .catch(error => {
      console.error('Error checking authentication status:', error);
    });
}

/**
 * Set up routing
 */
function setupRouting() {
  // Define routes
  state.routes.set('/', renderHomePage);
  state.routes.set('/login', renderLoginPage);
  state.routes.set('/register', renderRegisterPage);
  state.routes.set('/profile', renderProfilePage);
  
  // Handle navigation
  window.addEventListener('popstate', handleRouteChange);
  document.addEventListener('click', handleLinkClick);
  
  // Initial route
  handleRouteChange();
}

/**
 * Handle route changes
 */
function handleRouteChange() {
  const path = window.location.pathname;
  state.currentRoute = path;
  
  // Find the route handler
  const renderFunction = state.routes.get(path) || renderNotFoundPage;
  
  // Check if route requires authentication
  if ((path === '/profile') && !state.authenticated) {
    window.history.pushState(null, '', '/login');
    renderLoginPage();
    return;
  }
  
  // Render the page
  renderFunction();
}

/**
 * Handle link clicks for SPA navigation
 * @param {Event} event - The click event
 */
function handleLinkClick(event) {
  // Check if it's a link click
  const link = event.target.closest('a');
  if (!link) return;
  
  // Check if it's an internal link
  const url = new URL(link.href, window.location.origin);
  if (url.origin !== window.location.origin) return;
  
  // Prevent default behavior
  event.preventDefault();
  
  // Update history and route
  window.history.pushState(null, '', url.pathname);
  handleRouteChange();
}

/**
 * Handle server ready event
 * @param {CustomEvent} event - The server ready event
 */
function handleServerReady(event) {
  const serverStatus = event.detail;
  console.log('Server is ready:', serverStatus);
  
  // Update UI to show server is ready
  const loadingElement = document.querySelector('.app-loading');
  if (loadingElement) {
    loadingElement.classList.add('hidden');
  }
  
  // Render initial page
  handleRouteChange();
}

/**
 * Handle server error event
 * @param {CustomEvent} event - The server error event
 */
function handleServerError(event) {
  const error = event.detail;
  console.error('Server connection error:', error);
  
  // Show error message
  const root = document.getElementById('root');
  root.innerHTML = `
    <div class="server-error">
      <h1>Connection Error</h1>
      <p>Could not connect to the Go4It Sports server. Please try again later.</p>
      <button onclick="window.location.reload()">Retry</button>
    </div>
  `;
}

/**
 * Render home page
 */
function renderHomePage() {
  const root = document.getElementById('root');
  root.innerHTML = `
    <div class="page home-page">
      <header class="app-header">
        <h1>Go4It Sports Platform</h1>
        <nav>
          <a href="/" class="active">Home</a>
          ${state.authenticated 
            ? `<a href="/profile">My Profile</a><button onclick="logoutUser()">Logout</button>`
            : `<a href="/login">Login</a><a href="/register">Register</a>`}
        </nav>
      </header>
      <main>
        <section class="hero">
          <h2>Welcome to Go4It Sports</h2>
          <p>The advanced sports performance platform for student athletes.</p>
        </section>
        <section class="features">
          <h3>Key Features</h3>
          <div class="feature-grid">
            <div class="feature-card">
              <h4>GAR Scoring</h4>
              <p>Growth and Ability Rating system for comprehensive performance tracking.</p>
            </div>
            <div class="feature-card">
              <h4>AI Coach</h4>
              <p>Personalized AI coaching for continuous improvement.</p>
            </div>
            <div class="feature-card">
              <h4>Star Path</h4>
              <p>Track your progress from Rising Prospect to Five-Star Athlete.</p>
            </div>
          </div>
        </section>
      </main>
      <footer>
        <p>&copy; 2025 Go4It Sports. All rights reserved.</p>
      </footer>
    </div>
  `;
}

/**
 * Render login page
 */
function renderLoginPage() {
  const root = document.getElementById('root');
  root.innerHTML = `
    <div class="page auth-page">
      <header class="app-header">
        <h1>Go4It Sports Platform</h1>
        <nav>
          <a href="/">Home</a>
          <a href="/login" class="active">Login</a>
          <a href="/register">Register</a>
        </nav>
      </header>
      <main>
        <div class="auth-container">
          <div class="auth-form">
            <h2>Login</h2>
            <form id="login-form" onsubmit="handleLogin(event)">
              <div class="form-group">
                <label for="username">Username</label>
                <input type="text" id="username" name="username" required>
              </div>
              <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required>
              </div>
              <button type="submit">Login</button>
            </form>
            <p>Don't have an account? <a href="/register">Register</a></p>
          </div>
          <div class="auth-info">
            <h3>Welcome Back</h3>
            <p>Sign in to access your profile, view your progress, and continue your journey to becoming a star athlete.</p>
          </div>
        </div>
      </main>
      <footer>
        <p>&copy; 2025 Go4It Sports. All rights reserved.</p>
      </footer>
    </div>
  `;
}

/**
 * Render register page
 */
function renderRegisterPage() {
  const root = document.getElementById('root');
  root.innerHTML = `
    <div class="page auth-page">
      <header class="app-header">
        <h1>Go4It Sports Platform</h1>
        <nav>
          <a href="/">Home</a>
          <a href="/login">Login</a>
          <a href="/register" class="active">Register</a>
        </nav>
      </header>
      <main>
        <div class="auth-container">
          <div class="auth-form">
            <h2>Register</h2>
            <form id="register-form" onsubmit="handleRegister(event)">
              <div class="form-group">
                <label for="username">Username</label>
                <input type="text" id="username" name="username" required>
              </div>
              <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" required>
              </div>
              <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required>
              </div>
              <div class="form-group">
                <label for="confirm-password">Confirm Password</label>
                <input type="password" id="confirm-password" name="confirmPassword" required>
              </div>
              <button type="submit">Register</button>
            </form>
            <p>Already have an account? <a href="/login">Login</a></p>
          </div>
          <div class="auth-info">
            <h3>Join Go4It Sports</h3>
            <p>Create your account to start tracking your athletic performance, receive AI coaching, and showcase your skills to coaches and recruiters.</p>
          </div>
        </div>
      </main>
      <footer>
        <p>&copy; 2025 Go4It Sports. All rights reserved.</p>
      </footer>
    </div>
  `;
}

/**
 * Render profile page
 */
function renderProfilePage() {
  if (!state.authenticated) {
    window.history.pushState(null, '', '/login');
    renderLoginPage();
    return;
  }
  
  const user = state.user;
  const root = document.getElementById('root');
  
  root.innerHTML = `
    <div class="page profile-page">
      <header class="app-header">
        <h1>Go4It Sports Platform</h1>
        <nav>
          <a href="/">Home</a>
          <a href="/profile" class="active">My Profile</a>
          <button onclick="logoutUser()">Logout</button>
        </nav>
      </header>
      <main>
        <div class="profile-container">
          <h2>My Profile</h2>
          <div class="profile-info">
            <div class="profile-avatar">
              <div class="avatar-image">
                <img src="${user.avatarUrl || `${config.assetBase}/default-avatar.png`}" alt="Profile avatar">
              </div>
              <button class="change-avatar-btn">Change Avatar</button>
            </div>
            <div class="profile-details">
              <h3>${user.username}</h3>
              <p><strong>Email:</strong> ${user.email || 'No email set'}</p>
              <p><strong>Member since:</strong> ${new Date(user.createdAt).toLocaleDateString()}</p>
              <div class="profile-stats">
                <div class="stat-item">
                  <span class="stat-value">0</span>
                  <span class="stat-label">Videos</span>
                </div>
                <div class="stat-item">
                  <span class="stat-value">0</span>
                  <span class="stat-label">Highlights</span>
                </div>
                <div class="stat-item">
                  <span class="stat-value">0</span>
                  <span class="stat-label">Achievements</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer>
        <p>&copy; 2025 Go4It Sports. All rights reserved.</p>
      </footer>
    </div>
  `;
}

/**
 * Render 404 not found page
 */
function renderNotFoundPage() {
  const root = document.getElementById('root');
  root.innerHTML = `
    <div class="page not-found-page">
      <header class="app-header">
        <h1>Go4It Sports Platform</h1>
        <nav>
          <a href="/">Home</a>
          ${state.authenticated 
            ? `<a href="/profile">My Profile</a><button onclick="logoutUser()">Logout</button>`
            : `<a href="/login">Login</a><a href="/register">Register</a>`}
        </nav>
      </header>
      <main>
        <div class="not-found-container">
          <h2>404 - Page Not Found</h2>
          <p>The page you are looking for does not exist.</p>
          <a href="/" class="btn-primary">Go to Home</a>
        </div>
      </main>
      <footer>
        <p>&copy; 2025 Go4It Sports. All rights reserved.</p>
      </footer>
    </div>
  `;
}

/**
 * Handle login form submission
 * @param {Event} event - The form submission event
 */
window.handleLogin = function(event) {
  event.preventDefault();
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  
  fetch(`${config.apiBase}/login`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Login failed');
      }
      return response.json();
    })
    .then(user => {
      state.authenticated = true;
      state.user = user;
      document.dispatchEvent(new CustomEvent('auth-changed', { detail: { authenticated: true, user } }));
      window.history.pushState(null, '', '/profile');
      renderProfilePage();
    })
    .catch(error => {
      console.error('Login error:', error);
      alert('Login failed. Please check your credentials and try again.');
    });
};

/**
 * Handle register form submission
 * @param {Event} event - The form submission event
 */
window.handleRegister = function(event) {
  event.preventDefault();
  
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  
  if (password !== confirmPassword) {
    alert('Passwords do not match');
    return;
  }
  
  fetch(`${config.apiBase}/register`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, email, password })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Registration failed');
      }
      return response.json();
    })
    .then(user => {
      state.authenticated = true;
      state.user = user;
      document.dispatchEvent(new CustomEvent('auth-changed', { detail: { authenticated: true, user } }));
      window.history.pushState(null, '', '/profile');
      renderProfilePage();
    })
    .catch(error => {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again with a different username.');
    });
};

/**
 * Logout the current user
 */
window.logoutUser = function() {
  fetch(`${config.apiBase}/logout`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(() => {
      state.authenticated = false;
      state.user = null;
      document.dispatchEvent(new CustomEvent('auth-changed', { detail: { authenticated: false } }));
      window.history.pushState(null, '', '/');
      renderHomePage();
    })
    .catch(error => {
      console.error('Logout error:', error);
    });
};

// Initialize the application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// Export public API
export default {
  version: config.version,
  environment: config.environment,
  isInitialized: () => state.initialized,
  isAuthenticated: () => state.authenticated,
  getUser: () => state.user
};