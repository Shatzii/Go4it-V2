import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initBrowserCompatibility } from "./utils/browser-compatibility";

// Initialize browser compatibility detection
initBrowserCompatibility();

createRoot(document.getElementById("root")!).render(<App />);
