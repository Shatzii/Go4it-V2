/**
 * Help System Integration
 *
 * This script integrates the contextual help bubbles system with the existing
 * help character system in the student dashboard.
 */

document.addEventListener('DOMContentLoaded', function () {
  // Check if both systems are available
  const hasHelpCharacter = typeof window.HelpCharacterSystem !== 'undefined';
  const hasContextualHelp = typeof window.ContextualHelpSystem !== 'undefined';

  // If both systems are not available, exit early
  if (!hasHelpCharacter && !hasContextualHelp) {
    console.log('Help integration: Neither help system is available');
    return;
  }

  // If only the help character system is available
  if (hasHelpCharacter && !hasContextualHelp) {
    console.log('Help integration: Only help character system is available');

    // Add a menu option to switch to contextual help if available
    if (document.querySelector('.help-options')) {
      const helpOptions = document.querySelector('.help-options');
      const switchOption = document.createElement('div');
      switchOption.className = 'help-option special';
      switchOption.textContent = 'Switch to contextual help bubbles';
      switchOption.addEventListener('click', function () {
        // Redirect to the contextual help demo
        window.location.href = '/superhero-school/contextual-help-demo.html';
      });
      helpOptions.appendChild(switchOption);
    }
    return;
  }

  // If only the contextual help system is available
  if (!hasHelpCharacter && hasContextualHelp) {
    console.log('Help integration: Only contextual help system is available');
    // Nothing special needed, contextual help works standalone
    return;
  }

  // If both systems are available, integrate them
  console.log('Help integration: Both help systems are available');

  // Get the help bubble element
  const helpBubble = document.getElementById('help-bubble');
  const helpPanel = document.getElementById('help-content');

  if (helpBubble && helpPanel) {
    // Add a special option to help panel for contextual help
    const helpOptions = helpPanel.querySelector('.help-options');
    if (helpOptions) {
      const contextualOption = document.createElement('div');
      contextualOption.className = 'help-option special';
      contextualOption.textContent = 'Switch to contextual help mode';

      contextualOption.addEventListener('click', function () {
        // Hide the help panel
        helpPanel.classList.remove('active');

        // Show a notification that contextual mode is active
        const notification = document.createElement('div');
        notification.className = 'contextual-mode-notification';
        notification.innerHTML = `
          <div class="notification-content">
            <p>Contextual help mode is now active!</p>
            <p>Click on question marks (?) next to elements for specific help.</p>
            <button class="close-notification">Got it!</button>
          </div>
        `;

        // Add styles for the notification
        const style = document.createElement('style');
        style.textContent = `
          .contextual-mode-notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: rgba(52, 152, 219, 0.9);
            color: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            z-index: 9999;
            max-width: 300px;
            animation: slide-in 0.5s ease-out;
          }
          
          .notification-content {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          
          .notification-content p {
            margin: 0;
          }
          
          .close-notification {
            background-color: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
            align-self: flex-end;
          }
          
          .close-notification:hover {
            background-color: rgba(255, 255, 255, 0.3);
          }
          
          @keyframes slide-in {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        `;

        document.head.appendChild(style);
        document.body.appendChild(notification);

        // Initialize contextual help (if it's not already initialized)
        if (!window.contextualHelp) {
          // Get the character type from the help character system
          const characterType = window.HelpCharacterSystem.getCurrentCharacter() || 'stella';

          // Initialize contextual help
          window.contextualHelp = new ContextualHelpSystem({
            character: characterType.toLowerCase(),
            animationLevel: 'medium',
            autoShowFirstTime: true,
            debug: false,
          });
        }

        // Add event listener to close button
        notification.querySelector('.close-notification').addEventListener('click', function () {
          notification.remove();
        });

        // Auto-remove after 8 seconds
        setTimeout(() => {
          if (document.body.contains(notification)) {
            notification.style.animation = 'slide-out 0.5s ease-in forwards';

            // Add slide-out animation
            const slideOutStyle = document.createElement('style');
            slideOutStyle.textContent = `
              @keyframes slide-out {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
              }
            `;
            document.head.appendChild(slideOutStyle);

            // Remove after animation completes
            setTimeout(() => notification.remove(), 500);
          }
        }, 8000);
      });

      // Add option to the help panel
      helpOptions.appendChild(contextualOption);
    }

    // Add a way to synchronize character selection between systems
    if (window.HelpCharacterSystem && window.contextualHelp) {
      // When HelpCharacterSystem changes character
      const originalSwitchCharacter = window.HelpCharacterSystem.switchCharacter;
      window.HelpCharacterSystem.switchCharacter = function (character) {
        originalSwitchCharacter.call(window.HelpCharacterSystem, character);

        // Sync with contextual help
        if (window.contextualHelp) {
          window.contextualHelp.switchCharacter(character.toLowerCase());
        }
      };

      // When contextual help changes character
      const originalContextualSwitchCharacter = window.contextualHelp.switchCharacter;
      window.contextualHelp.switchCharacter = function (character) {
        originalContextualSwitchCharacter.call(window.contextualHelp, character);

        // Sync with help character system
        if (window.HelpCharacterSystem) {
          window.HelpCharacterSystem.switchCharacter(
            character.charAt(0).toUpperCase() + character.slice(1),
          );
        }
      };
    }
  }
});
