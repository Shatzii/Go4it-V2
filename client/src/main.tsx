import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initBrowserCompatibility } from "./utils/browser-compatibility";

// Create loading spinner
function showLoadingSpinner() {
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="text-align:center;padding:2rem;background:#0e1628;color:white;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;">
        <h2>Go4It Sports</h2>
        <p>Loading application...</p>
        <div style="width:48px;height:48px;border:4px solid rgba(255,255,255,0.1);border-radius:50%;border-top-color:#fff;animation:spin 1s linear infinite;margin:2rem 0;"></div>
        <style>@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}</style>
      </div>
    `;
  }
}

// Show error message
function showErrorMessage(error: unknown) {
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="text-align:center;padding:2rem;background:#0e1628;color:white;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;">
        <h2>Go4It Sports</h2>
        <p>We're having trouble loading the application.</p>
        <p>Please try refreshing the page.</p>
        <code style="background:rgba(0,0,0,0.2);padding:1rem;margin-top:1rem;border-radius:4px;max-width:600px;overflow:auto;text-align:left;">
          Error: ${error instanceof Error ? error.message : String(error)}
        </code>
        <button 
          onclick="window.location.reload()" 
          style="margin-top:2rem;background:#0070f3;color:white;border:none;padding:0.5rem 1rem;border-radius:4px;cursor:pointer;"
        >
          Refresh Page
        </button>
      </div>
    `;
  }
}

// Show the loading spinner immediately
showLoadingSpinner();

// Initialize browser compatibility detection
try {
  initBrowserCompatibility();
  console.log("Browser compatibility detection initialized");
} catch (error) {
  console.error("Failed to initialize browser compatibility detection:", error);
  // Continue even if browser compatibility detection fails
}

// Safely render the app with error handling
setTimeout(() => {
  try {
    const rootElement = document.getElementById("root");
    if (!rootElement) {
      throw new Error("Root element not found");
    }
    
    const root = createRoot(rootElement);
    root.render(<App />);
    console.log("App rendered successfully");
  } catch (error) {
    console.error("Failed to render app:", error);
    showErrorMessage(error);
  }
}, 100); // Small delay to allow browser to render loading spinner first
