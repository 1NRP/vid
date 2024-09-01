var staticCacheName = "NRP-PWA";

// Install event - cache the application shell
self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(staticCacheName).then(function (cache) {
      return cache.addAll(["/vid"]); // Cache the root of the site.
    })
  );
});

// Fetch event - serve cached content if available
self.addEventListener("fetch", function (event) {
  console.log(event.request.url);
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request); // Serve from cache or fetch from network
    })
  );
});
