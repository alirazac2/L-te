import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { FallbackCrashPage } from './components/FallbackCrashPage';
// Initialize Reown Configuration immediately
import './config/reown';

// --- CRASH SAFETY CONTROL ---
// Set this to TRUE to simulate a crash and test the fallback page.
const TEST_CRASH_FALLBACK = false;
// ----------------------------

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

if (TEST_CRASH_FALLBACK) {
  // Render ONLY the fallback page to verify it works in isolation
  root.render(
    <React.StrictMode>
      <FallbackCrashPage />
    </React.StrictMode>
  );
} else {
  // Standard Application Render
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
