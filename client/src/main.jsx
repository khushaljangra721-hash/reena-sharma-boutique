import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// Automatically forward relative /api & /uploads requests on Vercel to the live Render backend
if (typeof window !== 'undefined') {
  const originalFetch = window.fetch;
  window.fetch = function (input, init) {
    if (typeof input === 'string' && (input.startsWith('/api') || input.startsWith('/uploads')) && window.location.hostname.includes('vercel.app')) {
      input = `https://reena-sharma-boutique.onrender.com${input}`;
    }
    return originalFetch.call(this, input, init);
  };
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
