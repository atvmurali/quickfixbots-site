// service-worker.js

const CACHE_NAME = "quickfixbots-v1";
const ASSETS_TO_CACHE = [
  "/assets/logo.png",
  "/assets/icon-192.png",
  "/assets/icon-512.png",
  "/manifest.json"
];

// Install: cache only static assets (NOT index.html)
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate: clear old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  clients.claim();
});

// Fetch: 
// - Always fetch HTML/documents from network (so updates are instant).
// - For images/icons, try cache first, then network fallback.
self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate" || event.request.destination === "document") {
    event.respondWith(fetch(event.request)); // Always fresh HTML
  } else if (event.request.destination === "image" || event.request.destination === "script" || event.request.destination === "style") {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        return cached || fetch(event.request).then((response) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });
        });
      })
    );
  }
});
