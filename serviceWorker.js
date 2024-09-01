/*
var staticCacheName = "NRP_PWA";
self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(staticCacheName).then(function (cache) {
      return cache.addAll(["/vid"]);
    })
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    fetch(event.request).then(function (networkResponse) {
      // Clone the response to modify headers
      let modifiedResponse = networkResponse.clone();

      // Modify the headers of the response
      const newHeaders = new Headers(modifiedResponse.headers);
      newHeaders.set('Access-Control-Allow-Origin', '*');

      // Return a new response with the modified headers
      return new Response(modifiedResponse.body, {
        status: modifiedResponse.status,
        statusText: modifiedResponse.statusText,
        headers: newHeaders
      });
    })
  );
});
*/

var staticCacheName = "NRP-PWA";

// Cache the app shell during the install phase
self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(staticCacheName).then(function (cache) {
      return cache.addAll(["/vid"]);
    })
  );
});

// Intercept and handle fetch requests
self.addEventListener("fetch", function (event) {
  console.log(event.request.url);
  event.respondWith(
    fetch(event.request).then(function (networkResponse) {
      // Clone the response to modify headers
      let modifiedResponse = networkResponse.clone();

      // Modify the headers of the response
      const newHeaders = new Headers(modifiedResponse.headers);
      newHeaders.set('Access-Control-Allow-Origin', 'https://1nrp.github.io');
      newHeaders.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, HEAD, DELETE');

      // Return a new response with the modified headers
      return new Response(modifiedResponse.body, {
        status: modifiedResponse.status,
        statusText: modifiedResponse.statusText,
        headers: newHeaders
      });
    }).catch(function() {
      // Fallback to cache if the network request fails
      return caches.match(event.request);
    })
  );
});

