const CACHE_NAME = "nytimescache-v3";
const FILES_TO_CACHE = ["/offline.html"];

self.addEventListener("install", evt => {
  console.log("Service Worker Installing");
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("[ServiceWorker] Pre-caching offline page");
      return cache.addAll(FILES_TO_CACHE);
    })
    //   .catch(err => console.log("error", err))
  );
  self.skipWaiting();
});

self.addEventListener("activate", evt => {
  console.log("activation");
  evt.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME) {
            console.log("whatgwan now? Removing old cache");
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", evt => {
  //   if (!(evt.request.mode === "navigation")) return;

  evt.respondWith(
    fetch(evt.request).catch(() => {
      return caches.open(CACHE_NAME).then(cache => {
        return cache.match("offline.html");
      });
    })
  );
});
