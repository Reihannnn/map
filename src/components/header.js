export default function Header() {
  const el = document.createElement('div');
  el.innerHTML = `
    <div class="app-header-inner" style="
      display:flex;
      justify-content:space-between;
      align-items:center;
      background:linear-gradient(90deg,#0ea5e9,#3b82f6);
      color:white;
      padding:12px 24px;
      box-shadow:0 2px 6px rgba(0,0,0,0.1);
    ">
      <div class="app-title" style="display:flex;align-items:center;gap:8px;">
        <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="white" d="M12 2L2 7v6c0 5 5 9 10 9s10-4 10-9V7l-10-5z"/>
        </svg>
        <div>
          <div style="font-size:1.1rem;font-weight:600;">StoryMapApp</div>
          <small style="opacity:0.9;">Peta • Cerita • Lokasi</small>
        </div>
      </div>

      <nav class="app-nav" aria-label="Navigasi utama" style="display:flex;gap:16px;align-items:center;">
        <a href="#/" data-link style="color:white;text-decoration:none;">Home</a>
        <a href="#/map" data-link style="color:white;text-decoration:none;">Map</a>
        <a href="#/add" data-link style="color:white;text-decoration:none;">Tambah Story</a>
        <span id="auth-area"></span>
      </nav>
    </div>
  `;

  const authArea = el.querySelector('#auth-area');
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user') || '';

  if (token) {
    authArea.innerHTML = `
      <span style="margin-left:12px;">Hai, <strong>${escapeHtml(user)}</strong></span>
      <a href="#" id="logout" style="margin-left:10px;color:#fef2f2;text-decoration:underline;">Logout</a>
    `;
    authArea.querySelector('#logout').addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      location.hash = '/login';
      location.reload();
    });
  } else {
    authArea.innerHTML = `<a href="#/login" style="color:white;text-decoration:underline;">Login</a>`;
  }

  return el;
}

function escapeHtml(s = '') {
  return s.replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );
}
