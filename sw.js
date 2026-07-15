const CACHE_NAME = 'oshimaya-v4';
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
  // 新しいSWをすぐに待機状態からアクティブにする
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        // addAllだと1つでも失敗するとインストール全体が失敗するため、個別にキャッシュする
        return Promise.all(
          urlsToCache.map(url => {
            return cache.add(url).catch(err => console.warn('Failed to cache', url, err));
          })
        );
      })
  );
});

self.addEventListener('activate', event => {
  // 古いキャッシュを削除する
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
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
          console.log('Offline fallback for', event.request.url);
        });
      })
  );
});
