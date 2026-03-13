const CACHE_NAME = "demo-cache-v4";

const urlsToCache = [
  "/demo/",
  "/demo/index.html",
  "/demo/output.css",
  "/demo/favicon.png",
  "/demo/manifest.json"
];

// Install and cache files
self.addEventListener("install", (event) => {
  self.skipWaiting(); // activate new SW immediately

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Activate and remove old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );

  self.clients.claim(); // take control immediately
});

// Fetch from cache first
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});