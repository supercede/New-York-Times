const CACHE_NAME = "nyt-full-cache-v7";
const DATA_CACHE_NAME = "data-cache-v1";
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/style.css",
  "/images/my-news-logo.png",
  "/images/nyt_logo.png",
  "/images/icons/favicon-32x32.png",
  "/scripts/app.js",
  "/scripts/install.js"
];

self.addEventListener("install", evt => {
  console.log("I am installing");
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("Ayakata pre-caching");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", evt => {
  console.log("Activating phase");
  evt.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME && key != DATA_CACHE_NAME) {
            console.log("Removing old cache", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", evt => {
  // console.log("service worker fetching");
  // ev;
  // if (
  //   !(
  //     evt.request.url.includes("nyt.com/images/") ||
  //     evt.request.url.includes("api.nytimes.com/")
  //   )
  // ) {
  console.log(evt.request);
  // }
  if (
    evt.request.url.includes("nyt.com/images/") ||
    evt.request.url.includes("api.nytimes.com/")
  ) {
    // console.log("[Service Worker] Fetch (data)", evt.request.url);
    evt.respondWith(
      caches.open(DATA_CACHE_NAME).then(cache => {
        return fetch(evt.request)
          .then(response => {
            console.log(response);
            if (response.status === 200 || response.status === 0) {
              cache.put(evt.request.url, response.clone());
            } else {
              // console.log(evt.request);
              // console.log();
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
