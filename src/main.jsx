// Apply saved theme before React mounts (prevents flash on refresh)
try {
  const saved = localStorage.getItem("rookie_theme");
  const theme = saved === "light" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", theme);
} catch {}

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);