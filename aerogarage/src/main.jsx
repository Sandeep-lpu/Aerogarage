// ── Entry Point ───────────────────────────────────────────────────────────────
// This is the application entry point. It mounts the root React component
// into the #root DOM element defined in index.html.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'  // Global styles
import App from './App.jsx'  // Root application component


// StrictMode enables additional runtime warnings in development
// to help catch potential issues early (e.g. deprecated lifecycle methods).
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
