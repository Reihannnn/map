const CACHE_NAME = "storymap-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/offline.html"
];

// Install SW dan cache file dasar
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Fetch: Kalau offline → tampilkan offline.html
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match("/offline.html"))
  );
});
