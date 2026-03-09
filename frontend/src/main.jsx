if (import.meta.env.PROD) {
  console.log = () => {}; // Regular logs
  console.info = () => {}; // Info logs
  console.debug = () => {}; // Debug logs
  console.warn = () => {}; // Warnings

  // console.error is preserved for errors
}

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
