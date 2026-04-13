const CACHE_VERSION = 'vision-blog-v5';
const ASSET_CACHE   = 'vision-blog-assets-v5';

// Static assets to cache immediately on install
const PRECACHE_ASSETS = [
  '/assets/logo-192.png',
  '/assets/logo-512.png',
  '/nav.js',
  '/tts.js',
  '/manifest.json'
];

// ─────────────────────────────────────────────────────────────────────────────
// Install — precache only static assets, NOT HTML pages
// ─────────────────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(ASSET_CACHE).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  // Take over immediately — don't wait for the old SW to expire
  self.skipWaiting();
});

// ─────────────────────────────────────────────────────────────────────────────
// Activate — delete all old caches so stale content is purged
// ─────────────────────────────────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter(key => key !== CACHE_VERSION && key !== ASSET_CACHE)
          .map(key => {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          })
      );
    })
  );
  // Claim all clients immediately
  self.clients.claim();
});

// ─────────────────────────────────────────────────────────────────────────────
// Fetch — different strategies for HTML vs assets
// ─────────────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and non-same-origin requests
  if (request.method !== 'GET' || url.origin !== location.origin) return;

  // API calls — always go to network, never cache
  if (url.pathname.startsWith('/api/')) return;

  // HTML pages — NETWORK FIRST, fall back to cache
  if (request.headers.get('accept')?.includes('text/html') || url.pathname.endsWith('.html') || url.pathname === '/') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache the fresh copy for offline fallback
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => {
          // Network failed — serve from cache as offline fallback
          return caches.match(request);
        })
    );
    return;
  }

  // Static assets (JS, CSS, images, fonts) — CACHE FIRST, then network
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(ASSET_CACHE).then((cache) => cache.put(request, clone));
        }
        return response;
      });
    })
  );
});
