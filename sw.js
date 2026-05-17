const CACHE = 'trip-planner-v1';

// App shell files to pre-cache on install
const PRECACHE = [
  '/',
  '/index.html',
  '/assets/fonts.css',
  '/manifest.json',
  '/icons/icon.svg',
];

// Domains that should never be served from cache (live data / auth)
const NETWORK_ONLY = [
  'firebaseio.com',       // Realtime Database API
  'firebaseapp.com',      // Firebase Auth
  'identitytoolkit.googleapis.com',
  'securetoken.googleapis.com',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const { request } = e;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Pass live Firebase data / auth requests straight to the network
  if (NETWORK_ONLY.some(h => url.hostname.includes(h))) return;

  // Navigation requests → serve app shell (enables offline SPA)
  if (request.mode === 'navigate') {
    e.respondWith(
      fetch(request).catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Everything else: cache-first, then network + update cache
  e.respondWith(
    caches.match(request).then(cached => {
      const networkFetch = fetch(request).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE).then(c => c.put(request, clone));
        }
        return response;
      });
      return cached || networkFetch;
    })
  );
});
