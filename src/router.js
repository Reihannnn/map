import Home from './views/home';
import MapView from './views/mapView';
import AddStory from './views/addStory';
import Header from './components/header';
import Login from './views/login';
import Register from './views/register';

const routes = {
  '/': Home,
  '/map': MapView,
  '/add': AddStory,
  '/login': Login,
  '/register': Register,
};

const appHeader = document.getElementById('app-header');
const appMain = document.getElementById('maincontent');

export function initRouter() {
  // Render header hanya sekali
  if (appHeader && appHeader.childElementCount === 0) {
    const headerEl = Header();
    appHeader.appendChild(headerEl);
  }

  // Jalankan render pertama kali
  window.addEventListener('load', renderRoute);
  // Jalankan tiap hash berubah
  window.addEventListener('hashchange', renderRoute);

  // Fokuskan main setiap navigasi link
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-link]');
    if (a) {
      setTimeout(() => {
        const main = document.getElementById('maincontent');
        if (main) main.focus();
      }, 50);
    }
  });
}

function getPath() {
  const hash = location.hash || '#/';
  const path = hash.replace('#', '').split('?')[0];
  return path || '/';
}

let currentViewEl = null;

export function renderRoute() {
  const path = getPath();
  const View = routes[path] || Home;

  // 🌈 Gunakan View Transition API (bisa jalan di Chrome 111+)
  const transition = document.startViewTransition
    ? document.startViewTransition(() => {
        appMain.innerHTML = '';
        const viewEl = View();
        appMain.appendChild(viewEl);
        currentViewEl = viewEl;
        viewEl.classList.add('view-enter');
        requestAnimationFrame(() => {
          viewEl.classList.add('view-enter-active');
        });
      })
    : null;

  // fallback untuk browser yang belum mendukung
  if (!transition) {
    appMain.innerHTML = '';
    const viewEl = View();
    appMain.appendChild(viewEl);
    currentViewEl = viewEl;
    viewEl.classList.add('view-enter');
    requestAnimationFrame(() => {
      viewEl.classList.add('view-enter-active');
    });
  }
}

