var staticCacheName = "NRP-PWA";

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(staticCacheName).then(function (cache) {
      return cache.addAll(["/"]);
    })
  );
});

self.addEventListener("fetch", function (event) {
  console.log(event.request.url);

  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request).then(function (networkResponse) {
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
      });
    })
  );
});



/*
var staticCacheName = "NRP-PWA";
 
self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(staticCacheName).then(function (cache) {
      return cache.addAll(["/"]);
    })
  );
});
 
self.addEventListener("fetch", function (event) {
  console.log(event.request.url);
 
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    })
  );
});
*/