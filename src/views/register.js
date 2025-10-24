import { apiRegister } from "../utils/api";

export default function Register() {
  const el = document.createElement('section');
  el.className = 'container';
  el.innerHTML = `
    <h1>Daftar Akun</h1>
    <form id="registerForm">
      <div class="form-row">
        <label for="name">Nama</label>
        <input id="name" name="name" type="text" required />
      </div>
      <div class="form-row">
        <label for="email">Email</label>
        <input id="email" name="email" type="email" required />
      </div>
      <div class="form-row">
        <label for="password">Password (min. 8 karakter)</label>
        <input id="password" name="password" type="password" minlength="8" required />
      </div>
      <button type="submit">Daftar</button>
      <p>Sudah punya akun? <a href="#/login">Login di sini</a></p>
      <div id="msg" role="status" aria-live="polite"></div>
    </form>
  `;

  el.querySelector('#registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = el.querySelector('#msg');
    msg.textContent = 'Mendaftarkan akun...';
    const name = el.querySelector('#name').value.trim();
    const email = el.querySelector('#email').value.trim();
    const password = el.querySelector('#password').value.trim();

    try {
      const res = await apiRegister(name, email, password);
      if (!res.error) {
        msg.innerHTML = `<div class="success">Akun berhasil dibuat! Silakan <a href="#/login">login</a>.</div>`;
      } else {
        msg.innerHTML = `<div class="error">${res.message}</div>`;
      }
    } catch (err) {
      msg.innerHTML = `<div class="error">${err.message}</div>`;
    }
  });

  return el;
}
