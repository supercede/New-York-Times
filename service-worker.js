const CACHE_NAME = "nyt-current-v8";
const DATA_CACHE_NAME = "nyt-data-cache-v8";
const FILES_TO_CACHE = [
  "",
  "index.html",
  "style.css",
  "images/my-news-logo.png",
  "images/nyt_logo.png",
  "images/icons/favicon-32x32.png",
  "images/install.svg",
  "scripts/app.js",
  "scripts/install.js"
];

self.addEventListener("install", evt => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", evt => {
  evt.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME && key != DATA_CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", evt => {
  if (
    evt.request.url.includes("nyt.com/images/") ||
    evt.request.url.includes("api.nytimes.com/")
  ) {
    // console.log("[Service Worker] Fetch (data)", evt.request.url);
    evt.respondWith(
      caches.open(DATA_CACHE_NAME).then(cache => {
        return fetch(evt.request)
          .then(response => {
            if (response.status === 200 || response.status === 0) {
              cache.put(evt.request.url, response.clone());
            }
            return response;
          })
          .catch(err => {
            return cache.match(evt.request);
          });
      })
    );
    return;
  }

  evt.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(evt.request).then(response => {
        return response || fetch(evt.request);
      });
    })
  );
});
