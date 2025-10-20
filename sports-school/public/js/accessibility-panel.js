/**
 * ShatziiOS Accessibility Settings Panel
 *
 * This script provides a user interface for adjusting accessibility settings.
 */

// Initialize the accessibility panel when the document is loaded
document.addEventListener('DOMContentLoaded', function () {
  // Create and initialize the panel
  const accessibilityPanel = (function () {
    // Cache DOM elements
    let panel, toggleButton;

    /**
     * Create the accessibility panel
     */
    function createPanel() {
      // Create the panel container
      panel = document.createElement('div');
      panel.className = 'accessibility-panel';
      panel.setAttribute('aria-label', 'Accessibility Settings');
      panel.setAttribute('role', 'dialog');
      panel.setAttribute('aria-modal', 'true');
      panel.setAttribute('aria-hidden', 'true');

      // Create the panel content
      panel.innerHTML = `
        <div class="accessibility-panel-content">
          <div class="accessibility-panel-header">
            <h2 data-i18n="common.accessibility.panel_title">Accessibility Settings</h2>
            <button class="accessibility-panel-close" aria-label="Close accessibility settings">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
          
          <div class="accessibility-panel-body">
            <section class="accessibility-section">
              <h3>Preset Modes</h3>
              <div class="accessibility-presets">
                <button data-mode="standard" class="preset-button active">
                  <span class="preset-icon">Aa</span>
                  <span class="preset-label">Standard</span>
                </button>
                <button data-mode="dyslexia-friendly" class="preset-button">
                  <span class="preset-icon">Dd</span>
                  <span class="preset-label">Dyslexia-Friendly</span>
                </button>
                <button data-mode="high-contrast" class="preset-button">
                  <span class="preset-icon">Cc</span>
                  <span class="preset-label">High Contrast</span>
                </button>
                <button data-mode="adhd-friendly" class="preset-button">
                  <span class="preset-icon">Ad</span>
                  <span class="preset-label">ADHD-Friendly</span>
                </button>
                <button data-mode="autism-friendly" class="preset-button">
                  <span class="preset-icon">Au</span>
                  <span class="preset-label">Autism-Friendly</span>
                </button>
              </div>
            </section>
            
            <section class="accessibility-section">
              <h3>Text Settings</h3>
              <div class="accessibility-control">
                <label for="font-size">Font Size</label>
                <div class="control-buttons">
                  <button id="decrease-font" aria-label="Decrease font size">A-</button>
                  <span id="font-size-value">16px</span>
                  <button id="increase-font" aria-label="Increase font size">A+</button>
                </div>
              </div>
              
              <div class="accessibility-control">
                <label for="font-family">Font</label>
                <select id="font-family" aria-label="Select font family">
                  <option value="standard">Standard</option>
                  <option value="dyslexic">Dyslexic-Friendly</option>
                  <option value="serif">Serif</option>
                  <option value="sans-serif">Sans-Serif</option>
                  <option value="monospace">Monospace</option>
                </select>
              </div>
              
              <div class="accessibility-control">
                <label for="line-spacing">Line Spacing</label>
                <input type="range" id="line-spacing" min="1" max="2" step="0.1" value="1.5" aria-label="Adjust line spacing">
                <span id="line-spacing-value">1.5</span>
              </div>
              
              <div class="accessibility-control">
                <label for="letter-spacing">Letter Spacing</label>
                <input type="range" id="letter-spacing" min="0" max="0.2" step="0.01" value="0" aria-label="Adjust letter spacing">
                <span id="letter-spacing-value">Normal</span>
              </div>
            </section>
            
            <section class="accessibility-section">
              <h3>Reading Aids</h3>
              <div class="accessibility-toggle">
                <label for="reading-ruler">Reading Ruler</label>
                <div class="toggle-switch">
                  <input type="checkbox" id="reading-ruler" aria-label="Toggle reading ruler">
                  <span class="toggle-slider"></span>
                </div>
              </div>
              
              <div class="accessibility-toggle">
                <label for="reduced-motion">Reduced Motion</label>
                <div class="toggle-switch">
                  <input type="checkbox" id="reduced-motion" aria-label="Toggle reduced motion">
                  <span class="toggle-slider"></span>
                </div>
              </div>
            </section>
            
            <div class="accessibility-footer">
              <button id="reset-accessibility" class="reset-button">Reset to Default</button>
            </div>
          </div>
        </div>
      `;

      // Add the panel to the DOM
      document.body.appendChild(panel);

      // Create the toggle button
      toggleButton = document.createElement('button');
      toggleButton.className = 'accessibility-toggle-button';
      toggleButton.setAttribute('aria-label', 'Open accessibility settings');
      toggleButton.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12 2V4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12 20V22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M2 12H4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M20 12H22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `;
      document.body.appendChild(toggleButton);

      // Add the styles for the panel
      addStyles();
    }

    /**
     * Add styles for the accessibility panel
     */
    function addStyles() {
      // Create a style element
      const style = document.createElement('style');
      style.textContent = `
        /* Accessibility Panel Styles */
        .accessibility-toggle-button {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-color: #4299e1;
          color: white;
          border: none;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          cursor: pointer;
          z-index: 9998;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.3s;
        }
        
        .accessibility-toggle-button:hover {
          background-color: #3182ce;
        }
        
        .accessibility-toggle-button:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
        }
        
        .accessibility-panel {
          position: fixed;
          top: 0;
          right: -400px;
          width: 380px;
          height: 100%;
          background-color: white;
          box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
          z-index: 9999;
          overflow-y: auto;
          transition: right 0.3s ease;
        }
        
        .accessibility-panel[aria-hidden="false"] {
          right: 0;
        }
        
        .accessibility-panel-content {
          padding: 20px;
        }
        
        .accessibility-panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .accessibility-panel-header h2 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
        }
        
        .accessibility-panel-close {
          background: none;
          border: none;
          cursor: pointer;
          color: #718096;
          padding: 5px;
        }
        
        .accessibility-panel-close:hover {
          color: #4a5568;
        }
        
        .accessibility-section {
          margin-bottom: 24px;
        }
        
        .accessibility-section h3 {
          margin: 0 0 12px 0;
          font-size: 1.1rem;
          font-weight: 600;
          color: #2d3748;
        }
        
        .accessibility-presets {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 16px;
        }
        
        .preset-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          background-color: #f7fafc;
          padding: 10px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .preset-button:hover {
          background-color: #edf2f7;
        }
        
        .preset-button.active {
          border-color: #4299e1;
          background-color: #ebf8ff;
        }
        
        .preset-icon {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 5px;
        }
        
        .preset-label {
          font-size: 0.75rem;
          text-align: center;
          line-height: 1.2;
        }
        
        .accessibility-control {
          display: flex;
          align-items: center;
          margin-bottom: 16px;
        }
        
        .accessibility-control label {
          flex: 1;
          font-size: 0.95rem;
        }
        
        .accessibility-control select,
        .accessibility-control input[type="range"] {
          flex: 2;
        }
        
        .control-buttons {
          display: flex;
          align-items: center;
        }
        
        .control-buttons button {
          background-color: #edf2f7;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          padding: 5px 10px;
          cursor: pointer;
        }
        
        .control-buttons span {
          margin: 0 10px;
        }
        
        .accessibility-toggle {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        
        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 40px;
          height: 24px;
        }
        
        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        
        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #cbd5e0;
          transition: .4s;
          border-radius: 24px;
        }
        
        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 16px;
          width: 16px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }
        
        input:checked + .toggle-slider {
          background-color: #4299e1;
        }
        
        input:focus + .toggle-slider {
          box-shadow: 0 0 1px #4299e1;
        }
        
        input:checked + .toggle-slider:before {
          transform: translateX(16px);
        }
        
        .accessibility-footer {
          text-align: center;
          margin-top: 24px;
        }
        
        .reset-button {
          background-color: #e2e8f0;
          border: none;
          border-radius: 4px;
          padding: 8px 16px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .reset-button:hover {
          background-color: #cbd5e0;
        }
        
        /* For different modes */
        .dyslexia-friendly .accessibility-panel,
        .dyslexia-friendly .preset-button {
          font-family: var(--font-dyslexic);
        }
        
        .high-contrast .accessibility-panel {
          background-color: black;
          color: white;
        }
        
        .high-contrast .accessibility-panel-header {
          border-bottom-color: #4a5568;
        }
        
        .high-contrast .accessibility-panel-close,
        .high-contrast .accessibility-section h3 {
          color: white;
        }
        
        .high-contrast .preset-button {
          background-color: black;
          border-color: white;
          color: white;
        }
        
        .high-contrast .preset-button.active {
          background-color: #2c5282;
          border-color: white;
        }
        
        /* Responsive adjustments */
        @media (max-width: 480px) {
          .accessibility-panel {
            width: 100%;
            right: -100%;
          }
          
          .preset-button {
            width: 60px;
            height: 70px;
          }
        }
      `;

      document.head.appendChild(style);
    }

    /**
     * Bind events to panel elements
     */
    function bindEvents() {
      // Toggle panel
      toggleButton.addEventListener('click', function () {
        togglePanel();
      });

      // Close panel
      panel.querySelector('.accessibility-panel-close').addEventListener('click', function () {
        closePanel();
      });

      // Close panel on escape key
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && panel.getAttribute('aria-hidden') === 'false') {
          closePanel();
        }
      });

      // Mode preset buttons
      const presetButtons = panel.querySelectorAll('.preset-button');
      presetButtons.forEach((button) => {
        button.addEventListener('click', function () {
          const mode = this.getAttribute('data-mode');
          // Remove active class from all buttons
          presetButtons.forEach((btn) => btn.classList.remove('active'));
          // Add active class to clicked button
          this.classList.add('active');
          // Apply the mode
          window.ShatziiAccessibility.setMode(mode);
          updateUIFromSettings();
        });
      });

      // Font size controls
      panel.querySelector('#increase-font').addEventListener('click', function () {
        window.ShatziiAccessibility.increaseFontSize(1);
        updateUIFromSettings();
      });

      panel.querySelector('#decrease-font').addEventListener('click', function () {
        window.ShatziiAccessibility.decreaseFontSize(1);
        updateUIFromSettings();
      });

      // Font family selector
      panel.querySelector('#font-family').addEventListener('change', function () {
        window.ShatziiAccessibility.updateSettings({ font: this.value });
        updateUIFromSettings();
      });

      // Line spacing control
      const lineSpacingInput = panel.querySelector('#line-spacing');
      const lineSpacingValue = panel.querySelector('#line-spacing-value');

      lineSpacingInput.addEventListener('input', function () {
        lineSpacingValue.textContent = this.value;
        window.ShatziiAccessibility.updateSettings({ lineHeight: parseFloat(this.value) });
      });

      // Letter spacing control
      const letterSpacingInput = panel.querySelector('#letter-spacing');
      const letterSpacingValue = panel.querySelector('#letter-spacing-value');

      letterSpacingInput.addEventListener('input', function () {
        const value = parseFloat(this.value);
        const displayValue = value === 0 ? 'Normal' : `${value.toFixed(2)}em`;
        letterSpacingValue.textContent = displayValue;
        window.ShatziiAccessibility.updateSettings({
          letterSpacing: value === 0 ? 'normal' : `${value.toFixed(2)}em`,
        });
      });

      // Reading ruler toggle
      panel.querySelector('#reading-ruler').addEventListener('change', function () {
        window.ShatziiAccessibility.updateSettings({ useReadingRuler: this.checked });
      });

      // Reduced motion toggle
      panel.querySelector('#reduced-motion').addEventListener('change', function () {
        window.ShatziiAccessibility.updateSettings({ reducedMotion: this.checked });
      });

      // Reset button
      panel.querySelector('#reset-accessibility').addEventListener('click', function () {
        window.ShatziiAccessibility.resetSettings();
        updateUIFromSettings();
      });

      // Listen for settings changes from other sources
      document.addEventListener('accessibility-changed', function () {
        updateUIFromSettings();
      });
    }

    /**
     * Toggle the panel visibility
     */
    function togglePanel() {
      const isHidden = panel.getAttribute('aria-hidden') === 'true';
      panel.setAttribute('aria-hidden', isHidden ? 'false' : 'true');
      toggleButton.setAttribute('aria-expanded', isHidden ? 'true' : 'false');

      if (isHidden) {
        // Focus the first interactive element when opening
        setTimeout(() => {
          panel.querySelector('.accessibility-panel-close').focus();
        }, 300);
      }
    }

    /**
     * Close the panel
     */
    function closePanel() {
      panel.setAttribute('aria-hidden', 'true');
      toggleButton.setAttribute('aria-expanded', 'false');
      // Return focus to the toggle button
      toggleButton.focus();
    }

    /**
     * Update UI elements based on current settings
     */
    function updateUIFromSettings() {
      const settings = window.ShatziiAccessibility.getSettings();

      // Update preset buttons
      const presetButtons = panel.querySelectorAll('.preset-button');
      presetButtons.forEach((button) => {
        button.classList.toggle('active', button.getAttribute('data-mode') === settings.mode);
      });

      // Update font size display
      panel.querySelector('#font-size-value').textContent = `${settings.fontSize}px`;

      // Update font family selector
      panel.querySelector('#font-family').value = settings.font;

      // Update line spacing
      const lineSpacingInput = panel.querySelector('#line-spacing');
      const lineSpacingValue = panel.querySelector('#line-spacing-value');
      lineSpacingInput.value = settings.lineHeight;
      lineSpacingValue.textContent = settings.lineHeight;

      // Update letter spacing
      const letterSpacingInput = panel.querySelector('#letter-spacing');
      const letterSpacingValue = panel.querySelector('#letter-spacing-value');

      if (settings.letterSpacing === 'normal') {
        letterSpacingInput.value = 0;
        letterSpacingValue.textContent = 'Normal';
      } else {
        const value = parseFloat(settings.letterSpacing);
        letterSpacingInput.value = value;
        letterSpacingValue.textContent = `${value.toFixed(2)}em`;
      }

      // Update reading ruler toggle
      panel.querySelector('#reading-ruler').checked = settings.useReadingRuler;

      // Update reduced motion toggle
      panel.querySelector('#reduced-motion').checked = settings.reducedMotion;
    }

    /**
     * Initialize the panel
     */
    function init() {
      createPanel();
      bindEvents();
      updateUIFromSettings();

      // Apply translations if i18n is available
      if (window.ShatziiI18n) {
        window.ShatziiI18n.applyTranslations();
      }

      // Listen for language changes to update translations
      document.addEventListener('language-changed', function () {
        if (window.ShatziiI18n) {
          window.ShatziiI18n.applyTranslations();
        }
      });
    }

    return {
      init: init,
      openPanel: function () {
        panel.setAttribute('aria-hidden', 'false');
        toggleButton.setAttribute('aria-expanded', 'true');
      },
      closePanel: closePanel,
    };
  })();

  // Initialize the panel
  accessibilityPanel.init();
});
