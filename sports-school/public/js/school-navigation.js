/**
 * School Navigation System
 * Provides distinct navigation and theming for each school
 */

class SchoolNavigation {
  constructor() {
    this.currentSchool = this.detectCurrentSchool();
    this.initializeSchoolTheme();
    this.createSchoolMenu();
  }

  detectCurrentSchool() {
    const path = window.location.pathname;
    if (path.includes('/primary-school/')) return 'primary';
    if (path.includes('/secondary-school/')) return 'secondary';
    if (path.includes('/law-school/')) return 'law';
    if (path.includes('/language-school/')) return 'language';
    return 'main';
  }

  initializeSchoolTheme() {
    const themes = {
      primary: {
        name: 'Primary School Heroes',
        colors: {
          primary: '#ff6b6b',
          secondary: '#ffa726',
          accent: '#66bb6a'
        },
        icon: '🦸',
        gradient: 'linear-gradient(135deg, #ff6b6b, #ffa726)'
      },
      secondary: {
        name: 'S.T.A.G.E Prep',
        colors: {
          primary: '#667eea',
          secondary: '#764ba2',
          accent: '#f093fb'
        },
        icon: '🎓',
        gradient: 'linear-gradient(135deg, #667eea, #764ba2)'
      },
      law: {
        name: 'The Lawyer Makers',
        colors: {
          primary: '#2c3e50',
          secondary: '#34495e',
          accent: '#3498db'
        },
        icon: '⚖️',
        gradient: 'linear-gradient(135deg, #2c3e50, #34495e)'
      },
      language: {
        name: 'LIOTA (Language School Of The Americas)',
        colors: {
          primary: '#74b9ff',
          secondary: '#0984e3',
          accent: '#00cec9'
        },
        icon: '🌍',
        gradient: 'linear-gradient(135deg, #74b9ff, #0984e3)'
      }
    };

    this.theme = themes[this.currentSchool] || themes.main;
    this.applyThemeStyles();
  }

  applyThemeStyles() {
    if (this.currentSchool === 'main') return;
    
    const root = document.documentElement;
    root.style.setProperty('--school-primary', this.theme.colors.primary);
    root.style.setProperty('--school-secondary', this.theme.colors.secondary);
    root.style.setProperty('--school-accent', this.theme.colors.accent);
    root.style.setProperty('--school-gradient', this.theme.gradient);
  }

  createSchoolMenu() {
    if (this.currentSchool === 'main') return;

    const menuItems = this.getSchoolMenuItems();
    this.insertSchoolMenu(menuItems);
  }

  getSchoolMenuItems() {
    const menus = {
      primary: [
        { name: 'Hero Dashboard', url: '/schools/primary-school/dashboard.html', icon: '🏠' },
        { name: 'Learning Missions', url: '/schools/primary-school/missions.html', icon: '🎯' },
        { name: 'Captain Knowledge', url: '/demo/', icon: '🤖' },
        { name: 'Hero Progress', url: '/schools/primary-school/progress.html', icon: '📊' },
        { name: 'Achievement Badges', url: '/schools/primary-school/badges.html', icon: '🏆' },
        { name: 'Parent Portal', url: '/schools/primary-school/parent.html', icon: '👨‍👩‍👧' }
      ],
      secondary: [
        { name: 'Student Dashboard', url: '/schools/secondary-school/dashboard.html', icon: '📚' },
        { name: 'Course Catalog', url: '/schools/secondary-school/courses.html', icon: '📖' },
        { name: 'AI Tutor', url: '/demo/', icon: '🤖' },
        { name: 'Academic Progress', url: '/schools/secondary-school/progress.html', icon: '📈' },
        { name: 'Career Planning', url: '/schools/secondary-school/career.html', icon: '🎯' },
        { name: 'Study Groups', url: '/schools/secondary-school/groups.html', icon: '👥' }
      ],
      law: [
        { name: 'Law Dashboard', url: '/schools/law-school/dashboard.html', icon: '⚖️' },
        { name: 'Case Studies', url: '/schools/law-school/cases.html', icon: '📋' },
        { name: 'Legal Research', url: '/schools/law-school/research.html', icon: '🔍' },
        { name: 'Moot Court', url: '/schools/law-school/moot.html', icon: '🏛️' },
        { name: 'Bar Prep', url: '/schools/law-school/bar-prep.html', icon: '📜' },
        { name: 'Professional Ethics', url: '/schools/law-school/ethics.html', icon: '⭐' }
      ],
      language: [
        { name: 'Language Hub', url: '/schools/language-school/dashboard.html', icon: '🌍' },
        { name: 'Live Conversations', url: '/schools/language-school/conversations.html', icon: '💬' },
        { name: 'Cultural Exchange', url: '/schools/language-school/culture.html', icon: '🎭' },
        { name: 'Progress Tracker', url: '/schools/language-school/progress.html', icon: '📊' },
        { name: 'Speaking Practice', url: '/schools/language-school/speaking.html', icon: '🎤' },
        { name: 'Global Community', url: '/schools/language-school/community.html', icon: '🤝' }
      ]
    };

    return menus[this.currentSchool] || [];
  }

  insertSchoolMenu(menuItems) {
    // Create floating navigation menu
    const menuHTML = `
      <div id="school-nav-menu" class="school-nav-floating" data-school="${this.currentSchool}">
        <div class="school-nav-header">
          <span class="school-icon">${this.theme.icon}</span>
          <h3>${this.theme.name}</h3>
          <button id="nav-toggle" class="nav-toggle">☰</button>
        </div>
        <nav class="school-nav-items" id="nav-items">
          ${menuItems.map(item => `
            <a href="${item.url}" class="nav-item ${this.isCurrentPage(item.url) ? 'active' : ''}">
              <span class="nav-icon">${item.icon}</span>
              <span class="nav-text">${item.name}</span>
            </a>
          `).join('')}
          <a href="/" class="nav-item nav-home">
            <span class="nav-icon">🏠</span>
            <span class="nav-text">Main Campus</span>
          </a>
        </nav>
      </div>
    `;

    document.body.insertAdjacentHTML('afterbegin', menuHTML);
    this.initializeMenuEvents();
  }

  isCurrentPage(url) {
    return window.location.pathname === url || 
           (url.includes('dashboard') && window.location.pathname.includes('dashboard'));
  }

  initializeMenuEvents() {
    const toggle = document.getElementById('nav-toggle');
    const navItems = document.getElementById('nav-items');
    const menu = document.getElementById('school-nav-menu');

    if (toggle && navItems) {
      toggle.addEventListener('click', () => {
        navItems.classList.toggle('expanded');
        menu.classList.toggle('expanded');
      });
    }

    // Auto-collapse on mobile after selection
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          navItems.classList.remove('expanded');
          menu.classList.remove('expanded');
        }
      });
    });
  }
}

// Auto-initialize when DOM is ready with error handling
document.addEventListener('DOMContentLoaded', () => {
  try {
    new SchoolNavigation();
  } catch (error) {
    console.log('School navigation initialization skipped - not applicable for this page');
  }
});

// Prevent errors from main.js school card interactions
if (typeof window !== 'undefined') {
  const originalQuerySelector = document.querySelector;
  document.querySelector = function(selector) {
    try {
      return originalQuerySelector.call(document, selector);
    } catch (error) {
      console.log('Selector error caught:', error);
      return null;
    }
  };
}