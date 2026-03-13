const CACHE_NAME = 'demo-website-cache-v1';

const urlsToCache = [
  '/demo/',
  '/demo/index.html',
  '/demo/output.css',
  '/demo/favicon.png',
  '/demo/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});