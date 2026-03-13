const CACHE_NAME = "demo-cache-v9";

const urlsToCache = [
  "/demo/",
  "/demo/index.html",
  "/demo/output.css",
  "/demo/favicon.png",
  "/demo/manifest.json"
];

// INSTALL
self.addEventListener("install", (event) => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});


// ACTIVATE
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

  self.clients.claim();
});


// FETCH
self.addEventListener("fetch", (event) => {

  // HTML pages → NETWORK FIRST
  if (event.request.mode === "navigate") {

    event.respondWith(
      fetch(event.request)
        .then((response) => {

          const responseClone = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });

          return response;

        })
        .catch(() => {
          return caches.match(event.request);
        })
    );

    return;
  }


  // STATIC FILES → CACHE FIRST
  event.respondWith(
    caches.match(event.request)
      .then((response) => {

        if (response) {
          return response;
        }

        return fetch(event.request).then((response) => {

          const responseClone = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });

          return response;

        });

      })
  );

});