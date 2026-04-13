const CACHE_NAME = 'vision-blog-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/about.html',
  '/articles.html',
  '/nav.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
