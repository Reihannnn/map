// src/views/login.js
import { apiLogin } from "../utils/api";

export default function Login() {
  const el = document.createElement("section");
  el.className = "container";
  el.innerHTML = `
    <h1>Login</h1>
    <form id="loginForm">
      <div class="form-row">
        <label for="email">Email</label>
        <input id="email" name="email" type="email" required />
      </div>
      <div class="form-row">
        <label for="password">Password</label>
        <input id="password" name="password" type="password" required />
      </div>
      <button type="submit">Masuk</button>
      <p>Belum punya akun? <a href="#/register">Daftar di sini</a></p>
      <div id="msg" role="status" aria-live="polite"></div>
    </form>
  `;

  el.querySelector("#loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const msg = el.querySelector("#msg");
    msg.textContent = "Memproses login...";
    const email = el.querySelector("#email").value.trim();
    const password = el.querySelector("#password").value.trim();
    try {
      const res = await apiLogin(email, password);
      // guard: cek struktur res
      if (res && res.loginResult && res.loginResult.token) {
        localStorage.setItem("token", res.loginResult.token);
        localStorage.setItem("user", res.loginResult.name);
        localStorage.setItem("userEmail", email); // ✅ simpan email user
        // simpan nama user jika ada
        if (res.loginResult.name)
          localStorage.setItem("user", res.loginResult.name);

        msg.innerHTML = `<div class="success">Login berhasil! Mengalihkan...</div>`;
        // reload header to show logout (simple)
        setTimeout(() => {
          location.hash = "/";
          location.reload();
        }, 800);
      } else {
        // respon tidak mengandung loginResult/token
        const message =
          res && res.message ? res.message : "Login gagal: respons tidak valid";
        msg.innerHTML = `<div class="error">${message}</div>`;
      }
    } catch (err) {
      // tangani error jaringan / CORS / API
      msg.innerHTML = `<div class="error">Terjadi kesalahan: ${err.message}</div>`;
      console.error("login error", err);
    }
  });

  return el;
}
