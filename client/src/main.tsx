import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initBrowserCompatibility } from "./utils/browser-compatibility";

// Initialize browser compatibility detection if possible
try {
  initBrowserCompatibility();
  console.log("Browser compatibility detection initialized");
} catch (error) {
  console.error("Failed to initialize browser compatibility detection:", error);
}

// Safely render the app with error handling
try {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Root element not found");
  }
  
  // Show a simple loading message while we initialize
  rootElement.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100vh;"><p>Loading Go4It Sports...</p></div>';
  
  // Render the React app
  setTimeout(() => {
    try {
      const root = createRoot(rootElement);
      root.render(<App />);
      console.log("App rendered successfully");
    } catch (err) {
      console.error("Failed to render app:", err);
      rootElement.innerHTML = '<div style="text-align:center;padding:20px;"><h2>Error Loading Go4It Sports</h2><p>Please refresh the page and try again.</p></div>';
    }
  }, 100);
} catch (error) {
  console.error("Critical initialization error:", error);
  // Try to show an error message if possible
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = '<div style="text-align:center;padding:20px;"><h2>Error Loading Go4It Sports</h2><p>Please refresh the page and try again.</p></div>';
  }
}
