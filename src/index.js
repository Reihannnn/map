// index.js - entry
import './styles/main.css';
import { initRouter } from './router';
import './views/home'; // ensure modules baked in
import registerSW from '../registerServiceWorker';

// init app
document.addEventListener('DOMContentLoaded', () => {
  initRouter();
  // initial render
  if (!location.hash) location.hash = '/';
  registerSW()
});
