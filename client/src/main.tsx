import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initBrowserCompatibility } from "./utils/browser-compatibility";

// Initialize browser compatibility detection
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
  
  const root = createRoot(rootElement);
  root.render(<App />);
  console.log("App rendered successfully");
} catch (error) {
  console.error("Failed to render app:", error);
  
  // Display a user-friendly error message
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
      </div>
    `;
  }
}
