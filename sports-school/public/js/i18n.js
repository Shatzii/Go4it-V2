/**
 * Internationalization Support for ShatziiOS
 *
 * This module provides multilingual support for the ShatziiOS platform,
 * with special features for parent translation mode.
 */

// Global translations object to store all language data
let translations = {
  en: {}, // English (default)
  de: {}, // German
  es: {}, // Spanish
};

// Current active language
let currentLanguage = 'en';

// Parent translation mode flag
let parentTranslationMode = false;

/**
 * Initialize translations by loading all language files
 *
 * @returns {Promise<void>}
 */
async function initializeTranslations() {
  try {
    // Load all languages in parallel
    const [enData, deData, esData] = await Promise.all([
      fetch('/i18n/en.json').then((response) => response.json()),
      fetch('/i18n/de.json').then((response) => response.json()),
      fetch('/i18n/es.json').then((response) => response.json()),
    ]);

    // Store the loaded translations
    translations.en = enData;
    translations.de = deData;
    translations.es = esData;

    console.log('Translations loaded successfully');
  } catch (error) {
    console.error('Error loading translations:', error);

    // Fallback to minimal translations if loading fails
    translations = {
      en: {
        common: {
          welcome: 'Welcome to ShatziiOS',
          loading: 'Loading...',
          error: 'An error occurred',
        },
      },
      de: {
        common: {
          welcome: 'Willkommen bei ShatziiOS',
          loading: 'Wird geladen...',
          error: 'Ein Fehler ist aufgetreten',
        },
      },
      es: {
        common: {
          welcome: 'Bienvenido a ShatziiOS',
          loading: 'Cargando...',
          error: 'Ha ocurrido un error',
        },
      },
    };
  }
}

/**
 * Get a translated string by key
 *
 * @param {string} key - The translation key in dot notation (e.g. "common.welcome")
 * @param {Object} params - Optional parameters to replace placeholders
 * @param {string} lang - Optional language code (defaults to current language)
 * @returns {string} - The translated string
 */
function getTranslation(key, params = {}, lang = currentLanguage) {
  // Split the key into path segments
  const path = key.split('.');

  // Start at the root of the translations object
  let result = translations[lang];

  // Traverse the path to find the translation
  for (const segment of path) {
    if (result && result[segment] !== undefined) {
      result = result[segment];
    } else {
      // If translation not found, fallback to English
      if (lang !== 'en') {
        return getTranslation(key, params, 'en');
      }
      // If not found in English either, return the key
      return key;
    }
  }

  // If result is not a string, it's an object (nested translations)
  if (typeof result !== 'string') {
    return key;
  }

  // Replace parameters in the string
  if (params && Object.keys(params).length > 0) {
    Object.keys(params).forEach((param) => {
      result = result.replace(new RegExp(`{${param}}`, 'g'), params[param]);
    });
  }

  return result;
}

/**
 * Translate all elements with data-i18n attribute on the page
 *
 * @param {string} lang - Language code to translate to
 */
function translatePage(lang) {
  currentLanguage = lang;

  // Find all elements with data-i18n attribute
  const elements = document.querySelectorAll('[data-i18n]');

  elements.forEach((element) => {
    const key = element.getAttribute('data-i18n');
    const text = getTranslation(key);

    // Special handling for input placeholders
    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
      if (element.hasAttribute('placeholder')) {
        element.setAttribute('placeholder', text);
      } else {
        element.value = text;
      }
    } else {
      element.textContent = text;
    }
  });

  // Save language preference
  try {
    localStorage.setItem('preferredLanguage', lang);
  } catch (e) {
    console.error('Error saving language preference:', e);
  }

  // Update language display
  document.getElementById('current-language').textContent = {
    en: 'English',
    de: 'Deutsch',
    es: 'Español',
  }[lang];

  // Handle parent translation mode if active
  if (parentTranslationMode) {
    addParentTranslations();
  }

  // Dispatch a custom event to notify that the language has changed
  window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
}

/**
 * Toggle parent translation mode
 *
 * @param {boolean} enabled - Whether to enable or disable parent translation mode
 */
function setParentTranslationMode(enabled) {
  parentTranslationMode = enabled;

  if (enabled) {
    document.body.classList.add('parent-translation-mode');
    addParentTranslations();
  } else {
    document.body.classList.remove('parent-translation-mode');
    removeParentTranslations();
  }

  // Save preference
  try {
    localStorage.setItem('parentTranslationMode', enabled ? 'true' : 'false');
  } catch (e) {
    console.error('Error saving parent mode preference:', e);
  }
}

/**
 * Add parent translations (original language + translation) to elements
 */
function addParentTranslations() {
  // Only proceed if parent mode is active
  if (!parentTranslationMode) return;

  // Find all elements with data-i18n attribute
  const elements = document.querySelectorAll('[data-i18n]');

  elements.forEach((element) => {
    // Skip elements that already have parent translation
    if (element.querySelector('.parent-translation')) return;

    const key = element.getAttribute('data-i18n');

    // Get the original English text
    const originalText = getTranslation(key, {}, 'en');

    // Only add parent translation if current language is not English
    if (currentLanguage !== 'en') {
      const translation = getTranslation(key);

      // Create parent translation element
      const parentTranslation = document.createElement('span');
      parentTranslation.className = 'parent-translation';
      parentTranslation.innerHTML = `<span class="original">${originalText}</span> ➡️ <span class="translation">${translation}</span>`;

      // Store the original content for restoration
      if (!element.hasAttribute('data-original-html')) {
        element.setAttribute('data-original-html', element.innerHTML);
      }

      // Clear and update element content
      element.textContent = '';
      element.appendChild(parentTranslation);
    }
  });
}

/**
 * Remove parent translations and restore original content
 */
function removeParentTranslations() {
  // Find all elements with parent translations
  const elements = document.querySelectorAll('[data-original-html]');

  elements.forEach((element) => {
    // Restore original content
    element.innerHTML = element.getAttribute('data-original-html');
  });

  // Re-translate to current language
  translatePage(currentLanguage);
}

/**
 * Load saved language preferences
 */
function loadLanguagePreferences() {
  try {
    // Load preferred language
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && ['en', 'de', 'es'].includes(savedLanguage)) {
      currentLanguage = savedLanguage;
    }

    // Load parent translation mode
    const savedParentMode = localStorage.getItem('parentTranslationMode');
    if (savedParentMode) {
      parentTranslationMode = savedParentMode === 'true';
    }
  } catch (e) {
    console.error('Error loading language preferences:', e);
  }
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', () => {
  loadLanguagePreferences();

  // Set initial parent mode
  if (parentTranslationMode) {
    document.body.classList.add('parent-translation-mode');
    document.getElementById('parentModeIndicator').style.display = 'inline-block';
  }
});
