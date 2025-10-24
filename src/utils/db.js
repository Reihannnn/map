export function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('UserDB', 3); // ⬅️ Naikkan versi (misal dari 2 ke 3)

    request.onupgradeneeded = (e) => {
      const db = e.target.result;

      // store untuk users
      if (!db.objectStoreNames.contains('users')) {
        db.createObjectStore('users', { keyPath: 'email' });
      }

      // store untuk stories
      if (!db.objectStoreNames.contains('stories')) {
        const storyStore = db.createObjectStore('stories', {
          keyPath: 'id',
          autoIncrement: true
        });
        // tambahkan index biar bisa filter by user
        storyStore.createIndex('by_user', 'userEmail', { unique: false });
      }
    };

    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = (e) => reject(e.target.error);
  });
}

// Tambah user baru (register)
export async function addUser(user) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('users', 'readwrite');
    const store = tx.objectStore('users');
    const req = store.add(user);

    req.onsuccess = () => resolve(true);
    req.onerror = () => reject(req.error);
  });
}

// Cari user berdasarkan email (untuk login)
export async function getUserByEmail(email) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('users', 'readonly');
    const store = tx.objectStore('users');
    const req = store.get(email);

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// --- STORY OPERATIONS ---
// Tambah story baru
export async function addStory(story) {
  const db = await openDB();
  const tx = db.transaction('stories', 'readwrite');
  const store = tx.objectStore('stories');
  store.add(story);
  return tx.complete;
}

// Ambil semua story
export async function getAllStories() {
  const db = await openDB();
  const tx = db.transaction('stories', 'readonly');
  const store = tx.objectStore('stories');
  return new Promise((resolve, reject) => {
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// Ambil story milik user tertentu
export async function getStoriesByUser(email) {
  const db = await openDB();
  const tx = db.transaction('stories', 'readonly');
  const store = tx.objectStore('stories');
  const index = store.index('by_user');

  return new Promise((resolve, reject) => {
    const req = index.getAll(email);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}