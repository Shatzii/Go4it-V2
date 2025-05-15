import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Very basic app loading
const rootElement = document.getElementById("root");
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
}
