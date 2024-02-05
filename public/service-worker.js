const CACHE_NAME = 'mon-site-cache-v1';
const cacheName = 'downloaded-videos-cache';

const urlsToCache = ['/downloads'];

self.addEventListener('install', (event) => {
  console.log('Service worker installed');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .catch((error) => console.error('Cache installation failed:', error))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service worker activated');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((name) => {
            if (name !== CACHE_NAME && name !== cacheName) {
              return caches.delete(name);
            }
          })
        );
      })
      .catch((error) => console.error('Cache activation failed:', error))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.url.endsWith('.mp4')) {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            console.log('Video found in cache:', event.request.url);
            return response;
          } else {
            console.log('Video not found in cache, fetching from network:', event.request.url);
            return fetch(event.request)
              .then((fetchedResponse) => {
                const responseClone = fetchedResponse.clone();
                caches.open(cacheName)
                  .then((cache) => cache.put(event.request, responseClone))
                  .catch((error) => console.error('Caching video failed:', error));
                console.log('Video fetched from network and cached:', event.request.url);
                return fetchedResponse;
              })
              .catch((error) => {
                console.error('Fetching video failed:', error);
                throw error;
              });
          }
        })
        .catch((error) => {
          console.error('Matching video request failed:', error);
          throw error;
        })
    );
  } else {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            console.log('Resource found in cache:', event.request.url);
            return response;
          } else {
            console.log('Resource not found in cache, fetching from network:', event.request.url);
            return fetch(event.request)
              .catch((error) => {
                console.error('Fetching request failed:', error);
                throw error;
              });
          }
        })
        .catch((error) => {
          console.error('Matching request failed:', error);
          throw error;
        })
    );
  }
});

self.addEventListener('message', (event) => {
  console.log('Message received:', event.data);

  if (event.data && event.data.type === 'CACHE_VIDEO') {
    const { url, blob, name, body, page, profil, create, Uuid, uniid } = event.data;
    const response = new Response(blob, {
      headers: {
        'Content-Disposition': `inline; filename=${name}`,
        'X-File-Info': JSON.stringify({ body, page, profil, create, Uuid, uniid }),
      },
    });

    caches.open(cacheName)
      .then((cache) => {
        cache.put(url, response);
        console.log(`Video cached: ${url}`);
      })
      .catch((error) => console.error('Caching video failed:', error));
  }
});

