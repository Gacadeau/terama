const CACHE_NAME = 'mon-site-cache-v1';
const cacheName = 'downloaded-videos-cache';

const urlsToCache = ['/downloads'];

self.addEventListener('install', (event) => {
  console.log('Service worker installed');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});


self.addEventListener('activate', (event) => {
  console.log('Service worker activated');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  if (event.request.url.endsWith('.mp4')) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).then((fetchedResponse) => {
          const responseClone = fetchedResponse.clone();
          caches.open(cacheName).then((cache) => {
            cache.put(event.request, responseClone);
          });
          console.log(`Video fetched: ${event.request.url}`);
          return fetchedResponse;
        });
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
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
        'X-File-Info': JSON.stringify({ body, page, profil, create, Uuid, uniid}),
      },
    });
    
    caches.open(cacheName).then((cache) => {
      cache.put(url, response);
    });
   
    const newUrl = 'https://terama.vercel.app/Watch?v=' + uniid;
    caches.open(CACHE_NAME).then((cache) => {
      cache.addAll(newUrl); // Use cache.addAll() to add newUrl to the CACHE_NAME cache
      console.log(`Video cached: ${newUrl}`);
    });
  }
});
