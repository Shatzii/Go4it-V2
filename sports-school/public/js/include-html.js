/**
 * HTML Include System
 *
 * This script loads HTML fragments from external files into elements with the
 * data-include attribute.
 */

document.addEventListener('DOMContentLoaded', function () {
  // Find all elements with data-include attribute
  const includes = document.querySelectorAll('[data-include]');
  let loadedCount = 0;

  if (includes.length === 0) {
    // If no includes are found, dispatch the includes-loaded event immediately
    document.dispatchEvent(new Event('includes-loaded'));
    return;
  }

  // Load each include
  includes.forEach(function (element) {
    const file = element.getAttribute('data-include');
    fetch(file)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load ${file}: ${response.status} ${response.statusText}`);
        }
        return response.text();
      })
      .then((html) => {
        // Insert the HTML into the element
        element.innerHTML = html;

        // Increment the counter
        loadedCount++;

        // If all includes are loaded, dispatch the includes-loaded event
        if (loadedCount === includes.length) {
          document.dispatchEvent(new Event('includes-loaded'));
        }
      })
      .catch((error) => {
        console.error(error);
        element.innerHTML = `<div class="error">Error loading ${file}: ${error.message}</div>`;

        // Increment the counter even on error
        loadedCount++;

        // If all includes are loaded (even with errors), dispatch the includes-loaded event
        if (loadedCount === includes.length) {
          document.dispatchEvent(new Event('includes-loaded'));
        }
      });
  });
});
