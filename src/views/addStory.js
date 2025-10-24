import { postStory } from '../utils/api';

export default function AddStory() {
  const el = document.createElement('section');
  el.className = 'container';
  el.innerHTML = `
    <h1>Tambah Story</h1>
    <p>Isi form berikut untuk menambahkan story. Klik peta untuk memilih lokasi.</p>
    <form id="storyForm" aria-label="Form tambah story">
      <div class="form-row">
        <label for="description">Deskripsi</label>
        <textarea id="description" name="description" rows="4" required></textarea>
      </div>
      <div class="form-row">
        <label for="photo">Foto (max 1MB)</label>
        <input id="photo" name="photo" type="file" accept="image/*" required />
      </div>
      <div class="form-row">
        <label>Lokasi (klik pada peta untuk memilih)</label>
        <div id="mini-map" style="height:240px;border:1px solid #e6edf2;border-radius:6px"></div>
        <input id="lat" name="lat" type="text" placeholder="latitude" readonly />
        <input id="lon" name="lon" type="text" placeholder="longitude" readonly />
      </div>
      <div class="form-row">
        <button type="submit">Kirim Story</button>
      </div>
      <div id="formMessage" role="status" aria-live="polite"></div>
    </form>
  `;

  // Inisialisasi peta
  setTimeout(async () => {
    const mapDiv = el.querySelector('#mini-map');
    const L = (await import('leaflet')).default;
    const map = L.map(mapDiv).setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    let marker = null;
    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      el.querySelector('#lat').value = lat.toFixed(6);
      el.querySelector('#lon').value = lng.toFixed(6);
      if (marker) marker.setLatLng([lat, lng]);
      else marker = L.marker([lat, lng]).addTo(map);
    });
  }, 80);

  // Submit form
  el.querySelector('#storyForm').addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const msgEl = el.querySelector('#formMessage');
    msgEl.textContent = '';

    const description = el.querySelector('#description').value.trim();
    const photoInput = el.querySelector('#photo');
    const lat = el.querySelector('#lat').value;
    const lon = el.querySelector('#lon').value;

    if (!description) {
      msgEl.innerHTML = `<div class="error">Deskripsi wajib diisi.</div>`;
      return;
    }
    if (!photoInput.files.length) {
      msgEl.innerHTML = `<div class="error">Masukkan foto.</div>`;
      return;
    }

    const file = photoInput.files[0];
    if (file.size > 1024 * 1024) {
      msgEl.innerHTML = `<div class="error">Ukuran file melebihi 1MB.</div>`;
      return;
    }

    const formData = new FormData();
    formData.append('description', description);
    formData.append('photo', file);
    if (lat) formData.append('lat', lat);
    if (lon) formData.append('lon', lon);

    try {
      msgEl.innerHTML = `<div class="center">Mengirim...</div>`;
      const res = await postStory(formData);

      if (res && !res.error) {
        msgEl.innerHTML = `<div class="success">Story berhasil ditambahkan!</div>`;
        el.querySelector('#storyForm').reset();

        // ✅ Tambahkan ini agar langsung kembali ke halaman utama setelah sukses
        setTimeout(() => {
          location.hash = '/';
        }, 1200);
      } else {
        msgEl.innerHTML = `<div class="error">Gagal: ${res.message || 'Terjadi kesalahan.'}</div>`;
      }
    } catch (err) {
      msgEl.innerHTML = `<div class="error">Kesalahan: ${err.message}</div>`;
    }
  });

  return el;
}
