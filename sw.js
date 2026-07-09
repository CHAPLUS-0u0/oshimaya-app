const CACHE_NAME = 'oshimaya-v1';
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './style_v8.css',
  './script.js',
  './manifest.json',
  './images/icon-192.png',
  './images/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .catch(err => console.warn('Cache install error', err))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).catch(() => {
          // Fallback if offline and not in cache
          console.log('Offline fallback for', event.request.url);
        });
      })
  );
});
