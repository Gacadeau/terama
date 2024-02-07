const CACHE_NAME = 'mon-site-cache-v1';
const cacheName = 'downloaded-videos-cache';

const urlsToCache = ['/downloads,/Watch,/'];

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
          //const responseClone = fetchedResponse.clone();
	        // caches.open(cacheName).then((cache) => {
          //   cache.put(event.request, responseClone);
          // });
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
    const { url, blob, Body, Cat, CatPage, Categorie, Category,Channel,  Cover,Created_at, Hours, ID, Image, Likes,
          Mail, NextVideo,PageName,PageCreated, Photo,Short,Title, User,UserId, Uuid,Video,Views,Visible, uniid } = event.data;
    
    const newUrl = 'https://terama.vercel.app/Watch?v=' + uniid;
    
    const responseVideo = new Response(blob, {
      headers: {
        'Content-Disposition': `inline; filename=${Title}`,
        'X-File-Info': JSON.stringify({ Body, Cat, CatPage, Categorie, Category,Channel,  Cover,Created_at, Hours, ID, Image, Likes,
          Mail, NextVideo,PageName,PageCreated, Photo,Short, User,UserId, Uuid,Video,Views,Visible, uniid }),
      },
    });

    // Mettre en cache la vidéo dans cacheName
    caches.open(cacheName).then((cache) => {
      cache.put(url, responseVideo);
      console.log(`Video cached: ${url}`);
    })
    .then(() => {
      // Créer une nouvelle instance de Response pour la nouvelle URL
      return fetch(newUrl).then((newResponse) => {
        return new Promise((resolve) => {
          const newResponseClone = newResponse.clone();
          // Mettre en cache la nouvelle URL dans CACHE_NAME
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(newUrl, newResponseClone);
            console.log(`New URL cached: ${newUrl}`);
            resolve();
          });
        });
      });
    })
    .catch((error) => {
      console.error('Cache error:', error);
    });
  }
});
