const CACHE_NAME = 'oshimaya-v7';
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
            return cache.add(new Request(url, { cache: 'reload' })).catch(err => console.warn('Failed to cache', url, err));
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
  if (event.request.method !== 'GET') return;
  // ネット優先：つながる時は常に最新を表示し、オフラインの時だけ保存版を使う
  const sameOrigin = new URL(event.request.url).origin === self.location.origin;
  // 自サイトのファイルは毎回サーバーに更新確認（ブラウザの古い保存版を使わない）
  const req = sameOrigin ? fetch(event.request.url, { cache: 'no-cache' }) : fetch(event.request);
  event.respondWith(
    req
      .then(response => {
        if (response && response.ok && sameOrigin) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() => caches.match(event.request, { ignoreSearch: true }))
  );
});
