/**
 * ShatziiOS Parent Translation Mode
 *
 * This script manages the parent translation mode feature, which displays
 * content in both the original language and the selected language to help
 * non-native speaking parents support their children's learning.
 */

// Initialize parent mode functionality when the document is loaded
document.addEventListener('DOMContentLoaded', function () {
  // Create and initialize parent mode features
  const parentMode = (function () {
    const STORAGE_KEY = 'shatzii_parent_mode_seen';
    let bannerElement = null;

    /**
     * Initialize parent mode features
     */
    function init() {
      // Listen for language changes that might trigger parent mode
      document.addEventListener('language-changed', handleLanguageChange);

      // Check if we need to show the banner when parent mode is enabled
      if (document.body.classList.contains('parent-mode')) {
        maybeShowBanner();
      }
    }

    /**
     * Handle language or parent mode changes
     */
    function handleLanguageChange(event) {
      const detail = event.detail || {};
      const settings = detail.settings || {};

      // If parent mode was just enabled, show the banner
      if (settings.parentMode === true) {
        document.body.classList.add('parent-mode');
        maybeShowBanner();
      } else if (settings.parentMode === false) {
        document.body.classList.remove('parent-mode');
        // Hide banner if it's visible
        if (bannerElement) {
          bannerElement.classList.remove('visible');
        }
      }
    }

    /**
     * Create and show the parent mode banner if the user hasn't seen it before
     */
    function maybeShowBanner() {
      // Check if user has seen the banner before
      if (localStorage.getItem(STORAGE_KEY) === 'true') {
        return;
      }

      // Create the banner if it doesn't exist
      if (!bannerElement) {
        createBanner();
      }

      // Show the banner
      bannerElement.classList.add('visible');
    }

    /**
     * Create the parent mode banner
     */
    function createBanner() {
      // Create banner element
      bannerElement = document.createElement('div');
      bannerElement.className = 'parent-mode-banner';
      bannerElement.setAttribute('role', 'alert');

      // Add banner content
      bannerElement.innerHTML = `
        <button class="close-banner" aria-label="Close banner">×</button>
        <h3><i class="fas fa-info-circle"></i> <span data-i18n="language_selector.parent_mode">Parent Translation Mode</span></h3>
        <p data-i18n="parent_mode.banner_text">You've enabled Parent Translation Mode. This feature displays content in both the original language and your selected language, making it easier for non-native speaking parents to support their children's learning.</p>
        <p data-i18n="parent_mode.banner_note">Original text appears in standard font, while translations appear in blue italic text.</p>
        <p><a href="/parent-mode-help.html" data-i18n="parent_mode.help">Need help with Parent Mode?</a></p>
        <div class="banner-actions">
          <button class="secondary" data-action="disable" data-i18n="parent_mode.disable">Disable</button>
          <button data-action="gotit" data-i18n="parent_mode.got_it">Got It</button>
        </div>
      `;

      // Add banner to the page at the top of the main content
      const mainContent =
        document.querySelector('.accessibility-guide') ||
        document.querySelector('main') ||
        document.querySelector('.hero');

      if (mainContent) {
        mainContent.insertBefore(bannerElement, mainContent.firstChild);
      } else {
        // Fallback - insert after header
        const header = document.querySelector('header');
        if (header && header.nextSibling) {
          header.parentNode.insertBefore(bannerElement, header.nextSibling);
        } else {
          // Last resort - add to body
          document.body.appendChild(bannerElement);
        }
      }

      // Apply translations
      if (window.ShatziiI18n) {
        window.ShatziiI18n.applyTranslations();
      }

      // Add event listeners
      const closeButton = bannerElement.querySelector('.close-banner');
      if (closeButton) {
        closeButton.addEventListener('click', function () {
          bannerElement.classList.remove('visible');
          // Mark as seen
          localStorage.setItem(STORAGE_KEY, 'true');
        });
      }

      // Handle action buttons
      const actionButtons = bannerElement.querySelectorAll('[data-action]');
      actionButtons.forEach((button) => {
        button.addEventListener('click', function () {
          const action = this.getAttribute('data-action');

          if (action === 'disable') {
            // Disable parent mode
            if (window.ShatziiI18n) {
              window.ShatziiI18n.setParentMode(false);
            }
            bannerElement.classList.remove('visible');
          } else if (action === 'gotit') {
            // Just close the banner
            bannerElement.classList.remove('visible');
            // Mark as seen
            localStorage.setItem(STORAGE_KEY, 'true');
          }
        });
      });
    }

    /**
     * Reset "seen" status to show the banner again next time
     */
    function resetBannerSeen() {
      localStorage.removeItem(STORAGE_KEY);
    }

    return {
      init: init,
      resetBannerSeen: resetBannerSeen,
    };
  })();

  // Initialize parent mode
  parentMode.init();
});
