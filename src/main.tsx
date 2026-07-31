import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';

// Import original legacy stylesheets
import '../Vrindopnishad Web/Home/css/styles.css';
import '../Vrindopnishad Web/Home/css/hamburger.css';
import '../Vrindopnishad Web/Home/css/menu.css';
import '../Vrindopnishad Web/Home/css/cloude.css';
import '../Vrindopnishad Web/Home/css/image-hover.css';
import '../Vrindopnishad Web/web-extentions/Custom Cursor/custom-cursor.css';
import '../Vrindopnishad Web/web-extentions/Cookie Consent/cookie-consent.css';

// Import original legacy JS logic directly
import '../Vrindopnishad Web/Home/js/main-interactive.js';
import '../Vrindopnishad Web/Home/js/animations.js';
import '../Vrindopnishad Web/Home/js/effects.js';
import '../Vrindopnishad Web/Home/js/image-hover.js';
import '../Vrindopnishad Web/web-extentions/Custom Cursor/custom-cursor.js';

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
