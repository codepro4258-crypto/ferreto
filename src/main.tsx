import React from 'react';
import ReactDOM from 'react-dom/client';

// The app is a vanilla HTML/JS app, so we just mount a minimal React root
// The actual app logic is in app.js loaded via index.html script tag
const App = () => null;

const rootEl = document.getElementById('react-root');
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(<App />);
}