// Import required libraries
importScripts("lib/config.js");
importScripts("lib/chrome.js");
importScripts("lib/runtime.js");
importScripts("lib/webrequest.js");
importScripts("lib/netrequest.js");
importScripts("lib/common.js");

var staticCacheName = "pwa";

// Install event - cache the application shell
self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(staticCacheName).then(function (cache) {
      return cache.addAll(["/"]); // Cache the root of the site
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
