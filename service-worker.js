// service-worker.js

// Ensure immediate activation
self.addEventListener("install", (event) => {
  self.skipWaiting(); // Activate immediately
});

// Take control of open pages
self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

// Always fetch from network (no caching for HTML)
self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate" || event.request.destination === "document") {
    event.respondWith(fetch(event.request));
  }
});
