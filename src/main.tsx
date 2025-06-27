import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.tsx'
import './index.css'
import './i18n'

const root = document.getElementById("root");

if (!root) {
  throw new Error('Root element not found');
}

createRoot(root).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);