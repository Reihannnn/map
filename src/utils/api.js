import { addStory } from "./db";
import { getUserByEmail } from "./db";
import { addUser } from "./db";


// src/utils/api.js
export const API_BASE = '/api/v1'; // gunakan proxy dev-server

async function requestJson(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, options);
  // jika status non-OK, coba parsing body (untuk pesan error)
  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : {}; } catch (e) { data = { error: true, message: 'Invalid JSON' }; }
  if (!res.ok) {
    // lempar error agar pemanggil bisa menanganinya
    const errMsg = data && data.message ? data.message : `HTTP ${res.status}`;
    const err = new Error(errMsg);
    err.status = res.status;
    err.body = data;
    throw err;
  }
  return data;
}

export async function apiRegister(name, email, password) {
  const existing = await getUserByEmail(email);
  if (existing) {
    return { error: true, message: 'Email sudah terdaftar!' };
  }
  await addUser({ name, email, password });
  return { error: false, message: 'Akun berhasil dibuat!' };
}

export async function apiLogin(email, password) {
  const user = await getUserByEmail(email);
  if (!user) return { error: true, message: 'Akun tidak ditemukan!' };
  if (user.password !== password)
    return { error: true, message: 'Password salah!' };

  // Buat token dummy
  const token = 'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk';
  return {
    loginResult: {
      name: user.name,
      token,
    },
    error: false,
  };
}

export async function apiGetStories({page=1, size=20, location=1} = {}) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return await requestJson(`/stories?page=${page}&size=${size}&location=${location}`, { headers });
}

// export async function postStory(formData) {
//   const token = localStorage.getItem('token');
//   const headers = {};
//   if (token) headers['Authorization'] = `Bearer ${token}`;
//   const res = await fetch(`${API_BASE}/stories`, {
//     method: 'POST',
//     headers,
//     body: formData
//   });
//   const text = await res.text();
//   try { return JSON.parse(text || '{}'); } catch (e) { return { error: true, message: 'Invalid JSON' }; }
// }

// --- TAMBAH STORY ---
export async function postStory(formData) {
  const token = localStorage.getItem('token');
  const userEmail = localStorage.getItem('userEmail');

  if (!token || !userEmail) {
    return { error: true, message: 'Anda harus login dulu!' };
  }

  const description = formData.get('description');
  const photoFile = formData.get('photo');
  const lat = formData.get('lat') || null;
  const lon = formData.get('lon') || null;

  // Konversi foto ke base64 agar bisa disimpan di IndexedDB
  const photoBase64 = await fileToBase64(photoFile);

  const newStory = {
    description,
    photo: photoBase64,
    lat,
    lon,
    userEmail,
    createdAt: new Date().toISOString(),
  };

  await addStory(newStory);
  return { error: false, message: 'Story berhasil ditambahkan!' };
}

// Helper konversi file ke base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}