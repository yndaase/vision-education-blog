const CACHE_NAME = 'vision-blog-v3';
const ASSETS = [
  '/',
  '/index.html',
  '/about.html',
  '/articles.html',
  '/ai-test-prep.html',
  '/core-math-2026.html',
  '/cs-integration.html',
  '/parent-guide.html',
  '/nav.js',
  '/tts.js',
  '/manifest.json',
  '/assets/logo-512.png',
  '/assets/logo-192.png',
  '/assets/hero-image.png'
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
