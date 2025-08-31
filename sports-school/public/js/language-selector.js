/**
 * ShatziiOS Language Selector Component
 *
 * This script creates and manages the language selector dropdown in the header,
 * including language switching and parent translation mode.
 */

// Create and initialize the language selector when the document is loaded
document.addEventListener('DOMContentLoaded', function () {
  // Create and initialize the language selector
  const languageSelector = (function () {
    // Flag emoji for each language
    const FLAGS = {
      en: '🇺🇸',
      de: '🇩🇪',
      es: '🇪🇸',
    };

    // Language names in their own language
    const NATIVE_NAMES = {
      en: 'English',
      de: 'Deutsch',
      es: 'Español',
    };

    // Wait for i18n to be loaded before initializing
    function init() {
      if (!window.ShatziiI18n) {
        console.warn('Language selector waiting for i18n to initialize...');
        setTimeout(init, 100);
        return;
      }

      createLanguageSelector();
      bindEvents();
      updateLanguageSelector();
    }

    /**
     * Create the language selector component
     */
    function createLanguageSelector() {
      // Find the nav element
      const nav = document.querySelector('.main-nav ul');
      if (!nav) {
        console.warn('Navigation not found, cannot add language selector');
        return;
      }

      // Create language selector li element
      const selectorLi = document.createElement('li');
      selectorLi.className = 'language-selector-container';

      // Create language selector
      const selector = document.createElement('div');
      selector.className = 'language-selector';
      selector.setAttribute('aria-label', 'Language selector');
      selector.setAttribute('aria-expanded', 'false');

      // Create language toggle button
      const toggle = document.createElement('button');
      toggle.className = 'language-selector-toggle';
      toggle.setAttribute('aria-label', 'Toggle language menu');
      toggle.setAttribute('type', 'button');
      toggle.innerHTML = `<i class="fas fa-globe"></i> <span class="current-language">English</span>`;
      selector.appendChild(toggle);

      // Create language menu
      const menu = document.createElement('div');
      menu.className = 'language-selector-menu';
      menu.setAttribute('role', 'menu');
      menu.setAttribute('aria-label', 'Language options');

      // Add language options
      const languages = Object.values(window.ShatziiI18n.LANGUAGES);
      languages.forEach((lang) => {
        const option = document.createElement('div');
        option.className = 'language-option';
        option.setAttribute('role', 'menuitem');
        option.setAttribute('data-language', lang);
        option.innerHTML = `<span class="language-flag">${FLAGS[lang]}</span> ${NATIVE_NAMES[lang]}`;
        menu.appendChild(option);
      });

      // Add parent mode toggle
      const parentToggle = document.createElement('div');
      parentToggle.className = 'parent-mode-toggle';
      parentToggle.innerHTML = `
        <label>
          <input type="checkbox" id="parent-mode-toggle">
          <span data-i18n="language_selector.parent_mode">Parent Translation Mode</span>
        </label>
        <div class="parent-mode-description" data-i18n="language_selector.parent_mode_description">
          Displays professional translations alongside content to help non-native speaking parents support their children's learning
        </div>
      `;
      menu.appendChild(parentToggle);

      // Add menu to selector
      selector.appendChild(menu);

      // Add selector to navigation
      selectorLi.appendChild(selector);
      nav.appendChild(selectorLi);

      // Translate the added elements
      if (window.ShatziiI18n) {
        window.ShatziiI18n.applyTranslations();
      }
    }

    /**
     * Bind events to language selector
     */
    function bindEvents() {
      // Get the selector elements
      const selector = document.querySelector('.language-selector');
      if (!selector) return;

      const toggle = selector.querySelector('.language-selector-toggle');
      const languageOptions = selector.querySelectorAll('.language-option');
      const parentModeToggle = selector.querySelector('#parent-mode-toggle');

      // Toggle language selector menu
      toggle.addEventListener('click', function () {
        const isExpanded = selector.getAttribute('aria-expanded') === 'true';
        selector.classList.toggle('open');
        selector.setAttribute('aria-expanded', !isExpanded);
      });

      // Close when clicking outside
      document.addEventListener('click', function (event) {
        if (!selector.contains(event.target)) {
          selector.classList.remove('open');
          selector.setAttribute('aria-expanded', 'false');
        }
      });

      // Language selection
      languageOptions.forEach((option) => {
        option.addEventListener('click', function () {
          const language = this.getAttribute('data-language');

          // Change language using the i18n module
          window.ShatziiI18n.setLanguage(language).then(() => {
            // Update the UI
            updateLanguageSelector();

            // Close the menu
            selector.classList.remove('open');
            selector.setAttribute('aria-expanded', 'false');
          });
        });
      });

      // Parent mode toggle
      if (parentModeToggle) {
        parentModeToggle.addEventListener('change', function () {
          window.ShatziiI18n.setParentMode(this.checked);
          updateLanguageSelector();
        });
      }

      // Listen for language changes from other sources
      document.addEventListener('language-changed', updateLanguageSelector);
    }

    /**
     * Update the language selector UI to reflect current settings
     */
    function updateLanguageSelector() {
      // Get the current settings
      const settings = window.ShatziiI18n.getSettings();

      // Update the toggle text
      const currentLangElement = document.querySelector('.current-language');
      if (currentLangElement) {
        currentLangElement.textContent = NATIVE_NAMES[settings.language];
      }

      // Update active language option
      const languageOptions = document.querySelectorAll('.language-option');
      languageOptions.forEach((option) => {
        const lang = option.getAttribute('data-language');
        option.classList.toggle('active', lang === settings.language);
      });

      // Update parent mode toggle
      const parentModeToggle = document.querySelector('#parent-mode-toggle');
      if (parentModeToggle) {
        parentModeToggle.checked = settings.parentMode;
      }

      // Apply body class for parent mode styling
      document.body.classList.toggle('parent-mode', settings.parentMode);

      // Add language class to body for language-specific styling
      document.body.classList.remove('lang-en', 'lang-de', 'lang-es');
      document.body.classList.add(`lang-${settings.language}`);
    }

    return {
      init: init,
      updateLanguageSelector: updateLanguageSelector,
    };
  })();

  // Initialize the language selector
  languageSelector.init();

  // Also initialize after includes are loaded
  document.addEventListener('includes-loaded', function () {
    languageSelector.init();
  });
});
